# Manas Investem

Plataforma de educação financeira para mulheres investidoras.

## Tecnologias

- **Backend:** Node.js + Express
- **Banco de Dados:** PostgreSQL
- **Frontend:** HTML, CSS, JavaScript
- **Hospedagem:** Railway

## Estrutura do Projeto

```
manas-investem/
├── server.js           # Servidor Express + API
├── package.json        # Dependências
├── .env.example        # Exemplo de variáveis de ambiente
├── public/             # Frontend
│   ├── index.html      # Landing page
│   ├── cadastro.html   # Página de cadastro
│   ├── login.html      # Página de login
│   ├── dashboard.html  # Área logada
│   ├── perfil.html     # Edição de perfil
│   ├── favicon.svg     # Ícone do site
│   └── styles.css      # Estilos
└── README.md
```

## Deploy no Railway

### 1. Criar conta no Railway

1. Acesse [railway.app](https://railway.app)
2. Clique em "Login" e entre com sua conta GitHub

### 2. Criar novo projeto

1. Clique em **"New Project"**
2. Selecione **"Deploy from GitHub repo"**
3. Conecte sua conta GitHub (se ainda não conectou)
4. Selecione o repositório **manas-investem**

### 3. Adicionar banco de dados PostgreSQL

1. No projeto criado, clique em **"+ New"**
2. Selecione **"Database"** → **"Add PostgreSQL"**
3. O Railway vai criar o banco automaticamente

### 4. Conectar o banco ao app

1. Clique no serviço do seu app (não o PostgreSQL)
2. Vá na aba **"Variables"**
3. Clique em **"Add Variable Reference"**
4. Selecione **DATABASE_URL** do PostgreSQL
5. Adicione também:
   - `SESSION_SECRET` = (gere uma senha aleatória, ex: `manas2024secretkey`)
   - `NODE_ENV` = `production`
   - `ADMIN_KEY` = (senha para acessar dados das usuárias, ex: `minhaChaveAdmin123`)

### 5. Deploy

O Railway faz deploy automático quando você faz push no GitHub.

Para fazer deploy manual:
1. Vá na aba **"Deployments"**
2. Clique em **"Deploy"**

### 6. Acessar o site

1. Vá na aba **"Settings"**
2. Em **"Domains"**, clique em **"Generate Domain"**
3. Seu site estará disponível em `seu-projeto.up.railway.app`

## Desenvolvimento Local

### Pré-requisitos

- Node.js 18+
- PostgreSQL instalado localmente (ou use Docker)

### Instalação

```bash
# Clonar repositório
git clone https://github.com/seu-usuario/manas-investem.git
cd manas-investem

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Iniciar servidor
npm start
```

### Variáveis de Ambiente

| Variável | Descrição |
|----------|-----------|
| `DATABASE_URL` | URL de conexão do PostgreSQL |
| `SESSION_SECRET` | Chave secreta para sessões |
| `NODE_ENV` | Ambiente (development/production) |
| `PORT` | Porta do servidor (padrão: 3000) |
| `ADMIN_KEY` | Chave para acessar rotas de admin |

## API Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/cadastro` | Cadastrar nova usuária |
| POST | `/api/login` | Fazer login |
| POST | `/api/logout` | Fazer logout |
| GET | `/api/usuario` | Dados da usuária logada |
| PUT | `/api/usuario` | Atualizar perfil (nome, idade, cidade) |
| PUT | `/api/usuario/senha` | Alterar senha |
| GET | `/api/verificar-sessao` | Verificar se está logada |

### API de Admin (protegida por ADMIN_KEY)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/admin/usuarios` | Listar todas as usuárias |
| GET | `/api/admin/estatisticas` | Estatísticas de cadastros |

**Como usar:**

```bash
# Via header
curl -H "x-admin-key: SUA_ADMIN_KEY" https://seu-site.up.railway.app/api/admin/usuarios

# Via query string
curl "https://seu-site.up.railway.app/api/admin/usuarios?admin_key=SUA_ADMIN_KEY"
```

## Banco de Dados

### Tabela: usuarios

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | SERIAL | ID único |
| nome | VARCHAR(100) | Nome completo |
| email | VARCHAR(100) | Email (único) |
| senha | VARCHAR(255) | Senha criptografada |
| idade | INTEGER | Idade |
| cidade | VARCHAR(100) | Cidade |
| criado_em | TIMESTAMP | Data de cadastro |

## Licença

© 2024 Manas Investem. Todos os direitos reservados.
