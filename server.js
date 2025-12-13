require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Modo de desenvolvimento (sem banco de dados)
const DEV_MODE = !process.env.DATABASE_URL;

// Armazenamento em memória para desenvolvimento
const memoryStore = {
  usuarios: [],
  nextId: 1
};

// Pool do PostgreSQL (apenas em produção)
let pool = null;
let pgSession = null;

if (!DEV_MODE) {
  const { Pool } = require('pg');
  pgSession = require('connect-pg-simple')(session);
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });
}

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Confiar no proxy do Railway (necessário para cookies seguros)
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// Configuração de sessão
const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'manas-investem-secret-key-2024',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 dias
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'strict',
    httpOnly: true
  }
};

// Usar PostgreSQL session store apenas em produção
if (!DEV_MODE && pgSession) {
  sessionConfig.store = new pgSession({
    pool: pool,
    tableName: 'sessoes'
  });
}

app.use(session(sessionConfig));

// Criar tabelas no banco de dados
async function inicializarBanco() {
  if (DEV_MODE) {
    console.log('🔧 Modo de desenvolvimento ativo (sem banco de dados)');
    console.log('📝 Dados serão armazenados em memória');
    return;
  }

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        senha VARCHAR(255) NOT NULL,
        idade INTEGER,
        cidade VARCHAR(100),
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS sessoes (
        sid VARCHAR NOT NULL COLLATE "default",
        sess JSON NOT NULL,
        expire TIMESTAMP(6) NOT NULL,
        PRIMARY KEY (sid)
      )
    `);

    console.log('✅ Banco de dados inicializado com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao inicializar banco:', error.message);
  }
}

// Middleware para verificar autenticação
function autenticado(req, res, next) {
  if (req.session.usuario) {
    next();
  } else {
    res.status(401).json({ erro: 'Não autorizado' });
  }
}

// =====================
// ROTAS DA API
// =====================

// Cadastro de usuária
app.post('/api/cadastro', async (req, res) => {
  try {
    const { nome, email, senha, idade, cidade } = req.body;

    // Validações
    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: 'Nome, email e senha são obrigatórios' });
    }

    const emailLower = email.toLowerCase();

    if (DEV_MODE) {
      // Modo desenvolvimento - usar memória
      const usuarioExiste = memoryStore.usuarios.find(u => u.email === emailLower);
      if (usuarioExiste) {
        return res.status(400).json({ erro: 'Este email já está cadastrado' });
      }

      const senhaCriptografada = await bcrypt.hash(senha, 10);
      const novaUsuaria = {
        id: memoryStore.nextId++,
        nome,
        email: emailLower,
        senha: senhaCriptografada,
        idade: idade || null,
        cidade: cidade || null,
        criado_em: new Date().toISOString()
      };
      memoryStore.usuarios.push(novaUsuaria);

      req.session.usuario = {
        id: novaUsuaria.id,
        nome: novaUsuaria.nome,
        email: novaUsuaria.email
      };

      const { senha: _, ...usuarioSemSenha } = novaUsuaria;
      return res.status(201).json({
        mensagem: 'Cadastro realizado com sucesso!',
        usuario: usuarioSemSenha
      });
    }

    // Modo produção - usar PostgreSQL
    const usuarioExiste = await pool.query(
      'SELECT id FROM usuarios WHERE email = $1',
      [emailLower]
    );

    if (usuarioExiste.rows.length > 0) {
      return res.status(400).json({ erro: 'Este email já está cadastrado' });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const resultado = await pool.query(
      `INSERT INTO usuarios (nome, email, senha, idade, cidade)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, nome, email, idade, cidade, criado_em`,
      [nome, emailLower, senhaCriptografada, idade || null, cidade || null]
    );

    const novaUsuaria = resultado.rows[0];

    req.session.usuario = {
      id: novaUsuaria.id,
      nome: novaUsuaria.nome,
      email: novaUsuaria.email
    };

    res.status(201).json({
      mensagem: 'Cadastro realizado com sucesso!',
      usuario: novaUsuaria
    });

  } catch (error) {
    console.error('Erro no cadastro:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
    }

    const emailLower = email.toLowerCase();

    if (DEV_MODE) {
      // Modo desenvolvimento - usar memória
      const usuario = memoryStore.usuarios.find(u => u.email === emailLower);

      if (!usuario) {
        return res.status(401).json({ erro: 'Email ou senha incorretos' });
      }

      const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
      if (!senhaCorreta) {
        return res.status(401).json({ erro: 'Email ou senha incorretos' });
      }

      req.session.usuario = {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email
      };

      return res.json({
        mensagem: 'Login realizado com sucesso!',
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          idade: usuario.idade,
          cidade: usuario.cidade
        }
      });
    }

    // Modo produção - usar PostgreSQL
    const resultado = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1',
      [emailLower]
    );

    if (resultado.rows.length === 0) {
      return res.status(401).json({ erro: 'Email ou senha incorretos' });
    }

    const usuario = resultado.rows[0];

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'Email ou senha incorretos' });
    }

    req.session.usuario = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email
    };

    res.json({
      mensagem: 'Login realizado com sucesso!',
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        idade: usuario.idade,
        cidade: usuario.cidade
      }
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

// Logout
app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao fazer logout' });
    }
    res.json({ mensagem: 'Logout realizado com sucesso!' });
  });
});

// Obter dados da usuária logada
app.get('/api/usuario', autenticado, async (req, res) => {
  try {
    if (DEV_MODE) {
      const usuario = memoryStore.usuarios.find(u => u.id === req.session.usuario.id);
      if (!usuario) {
        return res.status(404).json({ erro: 'Usuária não encontrada' });
      }
      const { senha, ...usuarioSemSenha } = usuario;
      return res.json(usuarioSemSenha);
    }

    const resultado = await pool.query(
      'SELECT id, nome, email, idade, cidade, criado_em FROM usuarios WHERE id = $1',
      [req.session.usuario.id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: 'Usuária não encontrada' });
    }

    res.json(resultado.rows[0]);

  } catch (error) {
    console.error('Erro ao buscar usuária:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

// Verificar se está logada
app.get('/api/verificar-sessao', (req, res) => {
  if (req.session.usuario) {
    res.json({ logada: true, usuario: req.session.usuario });
  } else {
    res.json({ logada: false });
  }
});

// Atualizar perfil da usuária
app.put('/api/usuario', autenticado, async (req, res) => {
  try {
    const { nome, idade, cidade } = req.body;

    if (!nome || nome.trim() === '') {
      return res.status(400).json({ erro: 'Nome é obrigatório' });
    }

    if (DEV_MODE) {
      const usuario = memoryStore.usuarios.find(u => u.id === req.session.usuario.id);
      if (usuario) {
        usuario.nome = nome.trim();
        usuario.idade = idade || null;
        usuario.cidade = cidade || null;
      }
      req.session.usuario.nome = nome.trim();
      return res.json({ mensagem: 'Perfil atualizado com sucesso!' });
    }

    await pool.query(
      'UPDATE usuarios SET nome = $1, idade = $2, cidade = $3 WHERE id = $4',
      [nome.trim(), idade || null, cidade || null, req.session.usuario.id]
    );

    req.session.usuario.nome = nome.trim();

    res.json({ mensagem: 'Perfil atualizado com sucesso!' });

  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

// Alterar senha
app.put('/api/usuario/senha', autenticado, async (req, res) => {
  try {
    const { senhaAtual, novaSenha } = req.body;

    if (!senhaAtual || !novaSenha) {
      return res.status(400).json({ erro: 'Senha atual e nova senha são obrigatórias' });
    }

    if (novaSenha.length < 6) {
      return res.status(400).json({ erro: 'A nova senha deve ter pelo menos 6 caracteres' });
    }

    if (DEV_MODE) {
      const usuario = memoryStore.usuarios.find(u => u.id === req.session.usuario.id);
      if (!usuario) {
        return res.status(404).json({ erro: 'Usuária não encontrada' });
      }

      const senhaCorreta = await bcrypt.compare(senhaAtual, usuario.senha);
      if (!senhaCorreta) {
        return res.status(401).json({ erro: 'Senha atual incorreta' });
      }

      usuario.senha = await bcrypt.hash(novaSenha, 10);
      return res.json({ mensagem: 'Senha alterada com sucesso!' });
    }

    const resultado = await pool.query(
      'SELECT senha FROM usuarios WHERE id = $1',
      [req.session.usuario.id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: 'Usuária não encontrada' });
    }

    const senhaCorreta = await bcrypt.compare(senhaAtual, resultado.rows[0].senha);

    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'Senha atual incorreta' });
    }

    const senhaCriptografada = await bcrypt.hash(novaSenha, 10);

    await pool.query(
      'UPDATE usuarios SET senha = $1 WHERE id = $2',
      [senhaCriptografada, req.session.usuario.id]
    );

    res.json({ mensagem: 'Senha alterada com sucesso!' });

  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

// =====================
// ROTAS DE ADMIN
// =====================

// Middleware para verificar chave de admin
function verificarAdmin(req, res, next) {
  const adminKey = req.headers['x-admin-key'] || req.query.admin_key;
  const adminKeyEnv = process.env.ADMIN_KEY;

  if (!adminKeyEnv) {
    return res.status(403).json({ erro: 'Acesso admin não configurado' });
  }

  if (adminKey !== adminKeyEnv) {
    return res.status(403).json({ erro: 'Chave de admin inválida' });
  }

  next();
}

// Listar todas as usuárias (admin)
app.get('/api/admin/usuarios', verificarAdmin, async (req, res) => {
  try {
    if (DEV_MODE) {
      const usuarios = memoryStore.usuarios.map(({ senha, ...u }) => u);
      return res.json({
        total: usuarios.length,
        usuarios
      });
    }

    const resultado = await pool.query(
      'SELECT id, nome, email, idade, cidade, criado_em FROM usuarios ORDER BY criado_em DESC'
    );

    res.json({
      total: resultado.rows.length,
      usuarios: resultado.rows
    });

  } catch (error) {
    console.error('Erro ao listar usuárias:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

// Estatísticas (admin)
app.get('/api/admin/estatisticas', verificarAdmin, async (req, res) => {
  try {
    if (DEV_MODE) {
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      const semanaAtras = new Date(hoje);
      semanaAtras.setDate(semanaAtras.getDate() - 7);

      const usuariosHoje = memoryStore.usuarios.filter(u => new Date(u.criado_em) >= hoje).length;
      const usuariosSemana = memoryStore.usuarios.filter(u => new Date(u.criado_em) >= semanaAtras).length;

      const cidadesCount = {};
      memoryStore.usuarios.forEach(u => {
        if (u.cidade) {
          cidadesCount[u.cidade] = (cidadesCount[u.cidade] || 0) + 1;
        }
      });
      const cidadesMaisComuns = Object.entries(cidadesCount)
        .map(([cidade, total]) => ({ cidade, total }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 5);

      return res.json({
        total_usuarios: memoryStore.usuarios.length,
        cadastros_hoje: usuariosHoje,
        cadastros_semana: usuariosSemana,
        cidades_mais_comuns: cidadesMaisComuns
      });
    }

    const totalUsuarios = await pool.query('SELECT COUNT(*) FROM usuarios');
    const usuariosHoje = await pool.query(
      "SELECT COUNT(*) FROM usuarios WHERE criado_em >= CURRENT_DATE"
    );
    const usuariosSemana = await pool.query(
      "SELECT COUNT(*) FROM usuarios WHERE criado_em >= CURRENT_DATE - INTERVAL '7 days'"
    );
    const cidadesMaisComuns = await pool.query(
      `SELECT cidade, COUNT(*) as total FROM usuarios
       WHERE cidade IS NOT NULL
       GROUP BY cidade ORDER BY total DESC LIMIT 5`
    );

    res.json({
      total_usuarios: parseInt(totalUsuarios.rows[0].count),
      cadastros_hoje: parseInt(usuariosHoje.rows[0].count),
      cadastros_semana: parseInt(usuariosSemana.rows[0].count),
      cidades_mais_comuns: cidadesMaisComuns.rows
    });

  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

// =====================
// ROTAS DE PÁGINAS
// =====================

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/cadastro', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cadastro.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/perfil', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'perfil.html'));
});

// Iniciar servidor
inicializarBanco().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📍 Acesse: http://localhost:${PORT}`);
  });
});
