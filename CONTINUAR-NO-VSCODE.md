# Continuar o Projeto no VS Code com Claude Code

## Situação Atual

O projeto **Manas Investem** está hospedado no Railway e funcionando em:
- **URL:** https://manas-investem-production.up.railway.app
- **Branch:** `claude/continue-project-0122RLuFythK94CzbAdR1WW8`

---

## Passo 1: Atualizar sua pasta local

Abra o Terminal no seu Mac e navegue até a pasta do projeto:

```bash
cd ~/caminho/para/manas-investem
```

Baixe as atualizações do GitHub:

```bash
git fetch origin
git checkout claude/continue-project-0122RLuFythK94CzbAdR1WW8
git pull origin claude/continue-project-0122RLuFythK94CzbAdR1WW8
```

---

## Passo 2: Instalar dependências

```bash
npm install
```

---

## Passo 3: Configurar ambiente local (opcional)

Se quiser rodar localmente, crie o arquivo `.env`:

```bash
cp .env.example .env
```

Edite o `.env` com as credenciais do Railway (ou configure um PostgreSQL local).

---

## Passo 4: Abrir no VS Code

```bash
code .
```

---

## Passo 5: Usar Claude Code no VS Code

1. Abra o terminal integrado no VS Code (`Ctrl+`` ou `Cmd+``)
2. Digite `claude` para iniciar o Claude Code
3. Peça para continuar o desenvolvimento:

```
Continuar o projeto Manas Investem.
O site está em https://manas-investem-production.up.railway.app
Quero adicionar [descreva a funcionalidade]
```

---

## Estrutura do Projeto

```
manas-investem/
├── server.js           # Backend Node.js + Express
├── package.json        # Dependências
├── .env.example        # Exemplo de variáveis
├── public/
│   ├── index.html      # Landing page
│   ├── cadastro.html   # Cadastro de usuárias
│   ├── login.html      # Login
│   ├── dashboard.html  # Área logada
│   ├── perfil.html     # Edição de perfil
│   ├── styles.css      # Estilos CSS
│   └── favicon.svg     # Ícone
└── README.md           # Documentação
```

---

## Funcionalidades Implementadas

- [x] Landing page com CTA
- [x] Cadastro (nome, email, senha, idade, cidade)
- [x] Login com sessão
- [x] Dashboard personalizado
- [x] Edição de perfil
- [x] Alteração de senha
- [x] API Admin (listar usuárias, estatísticas)
- [x] Design profissional

---

## Próximas Funcionalidades Sugeridas

- [ ] Recuperação de senha por email
- [ ] Questionário de perfil de investidora integrado
- [ ] Conteúdos educacionais (vídeos, artigos)
- [ ] Notificações por email
- [ ] Exportar dados em CSV
- [ ] Dashboard com gráficos

---

## Comandos Úteis

```bash
# Rodar localmente
npm start

# Ver logs do Railway
# (acesse railway.app > seu projeto > Deployments > View Logs)

# Fazer commit e push
git add .
git commit -m "Descrição da alteração"
git push origin claude/continue-project-0122RLuFythK94CzbAdR1WW8
```

---

## Links Importantes

- **Site:** https://manas-investem-production.up.railway.app
- **Railway:** https://railway.app (painel de controle)
- **GitHub:** https://github.com/lopesandrew/manas-investem

---

## API de Admin

Para ver usuárias cadastradas:

```
https://manas-investem-production.up.railway.app/api/admin/usuarios?admin_key=SUA_ADMIN_KEY
```

Para ver estatísticas:

```
https://manas-investem-production.up.railway.app/api/admin/estatisticas?admin_key=SUA_ADMIN_KEY
```
