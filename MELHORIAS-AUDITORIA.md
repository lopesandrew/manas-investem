# Auditoria Geral — Manas Investem

> Check-up técnico em 5 dimensões: Acessibilidade, Segurança, SEO, Performance e Code Review.
> Gerado em 2026-05-01 a partir de 5 agents paralelos. Para uso do Andrew como roadmap.

---

## ⚠️ Atenção — Regra de redirect 302 no Hostinger está bloqueando indexação

**Contexto do fluxo de deploy do Andrew:** GitHub Pages é usado como staging (a Flávia valida em `lopesandrew.github.io/manas-investem/`); depois os arquivos são enviados manualmente pro Hostinger (`manasinvestem.com.br`). Tudo OK até aqui — esperado que `manasinvestem.com.br` mostre versão anterior enquanto o ciclo de aprovação está em curso.

**O problema não é o atraso do deploy**, e sim que **o Hostinger está retornando `302 → /` em páginas que já existem há tempos**:

- Confirmado via curl em produção:
  - `/` → **200 OK** (home funciona)
  - `/quem-somos.html` → **302 → /** ❌
  - `/evento.html` → **302 → /** ❌
  - `/contato.html` → **302 → /** ❌
- Mesmo `quem-somos.html` e `evento.html`, que existem desde **06/Feb/2026**, estão sendo redirecionados. Isso significa que **a regra de redirect provavelmente existe há meses** e está prejudicando SEO/UX mesmo da versão atual em produção:
  - Quem clica em link direto (Instagram bio, Google, e-mail) cai na home, perdendo o contexto
  - O Googlebot não consegue indexar nenhuma página interna
  - Quando subir as novas páginas (`eventos-passados.html`), elas também vão cair no mesmo redirect

**Ação recomendada antes do próximo upload pro Hostinger:**

- Painel Hostinger → **Sites** → **Redirects** ou **Avançado / .htaccess**
- Procurar por regra do tipo "redirect all to home" ou `RewriteRule ^.*$ / [R=302,L]`
- Remover a regra
- Re-testar com curl: `curl -sI https://manasinvestem.com.br/quem-somos.html` — deve retornar 200
- Aí sim subir os arquivos novos

**Alternativa de longo prazo (opcional):** em vez de upload manual, apontar o DNS do `manasinvestem.com.br` pra `lopesandrew.github.io.` (CNAME no GitHub já está configurado). Vantagem: deploy contínuo via push, sem upload manual. Custo: perder controle granular (logs do Hostinger, .htaccess customizado, painel admin).

---

## Sumário executivo

O site tem **boa fundação visual e semântica** (HTML5 landmarks, alt presente, design tokens em `styles.css`, imagens otimizadas em WebP+lazy loading). Os pontos fracos concentram-se em três áreas:

1. **Infraestrutura de deploy**: domínio custom aponta pro provedor errado e desatualizado.
2. **Dívida técnica de duplicação**: header, footer e ~370 linhas de JS são repetidos em 7 páginas; ~1.225 linhas (~42%) do `styles.css` é código morto de scaffolding antigo.
3. **Acessibilidade desktop quebrada**: o dropdown hierárquico da nav (Agenda → Encontros → Futuros/Passados) é inacessível por teclado fora do mobile, e não há indicador visual de foco em nenhum link/botão do site.

Foram identificados ~70 itens distribuídos em 5 áreas, dos quais **9 são críticos**. Boa parte dos itens MÉDIO/BAIXO são micro-otimizações que podem virar uma "limpeza de fim de tarde".

---

## Top 9 prioridades (impacto/esforço)

| # | Severidade | Item | Esforço | Área |
|---|---|---|---|---|
| 1 | 🔴 CRÍTICO | Remover regra de redirect 302 no painel Hostinger antes do próximo upload | 15min | Deploy |
| 2 | 🔴 CRÍTICO | Atualizar `README.md` (descreve stack Node/Postgres/Railway que não existe — risco de credencial vazada) | 30min | Segurança |
| 3 | 🔴 CRÍTICO | Adicionar `<link rel="canonical">` em todas as 8 páginas | 30min | SEO |
| 4 | 🔴 CRÍTICO | Criar `robots.txt` na raiz | 5min | SEO |
| 5 | 🔴 CRÍTICO | Adicionar `:focus-visible` global em links/botões/nav | 30min | A11y |
| 6 | 🔴 CRÍTICO | Refatorar dropdown "Agenda/Encontros" pra `<button>` + `aria-expanded` + Enter/Esc | 1h | A11y |
| 7 | 🔴 CRÍTICO | Externalizar JS duplicado em `script.js` | 30min | Arquitetura |
| 8 | 🔴 CRÍTICO | Remover ~1.225 linhas de CSS morto em `styles.css` | 30min | Arquitetura |
| 9 | 🔴 CRÍTICO | Lightbox: focus trap + retorno de foco ao fechar | 30min | A11y |

**Quick wins (≤30min cada, alto impacto):** itens 2, 4, 5, 7, 8, 9.

---

## Achados por área

### 1. Acessibilidade (WCAG 2.2 AA)

#### CRÍTICO

- **Dropdown da nav inacessível por teclado no desktop** (`index.html:43-55` e equivalentes nas 7 páginas). `<span tabindex="0" aria-haspopup="true">` + abertura via `:hover` no CSS = usuário de teclado pega foco no span mas Enter/Espaço não fazem nada (handler JS só roda em mobile). Links Aulas/Futuros/Passados ficam **inalcançáveis por teclado em desktop**. **Fix:** trocar `<span>` por `<button type="button" aria-expanded="false">`, controlar abertura no JS sem media query, abrir/fechar com Enter/Espaço/seta-baixo, fechar com Escape. (1h) — Falha SC 2.1.1 e SC 4.1.2.
- **Falta de `:focus-visible` em links/botões/menu** (`styles.css` global). Hoje só `input/select/textarea` têm focus styling. Em desktop o usuário tabulando não vê onde está. (30min) — Falha SC 2.4.7 e SC 2.4.11 (novo em WCAG 2.2).
- **Lightbox sem focus trap nem retorno de foco** (`eventos-passados.html:380-425`). `aria-modal="true"` sem trap "mente" para o leitor de tela. (30min) — Falha SC 2.4.3 e SC 4.1.2.

#### ALTO

- Contraste pink/yellow ~2.0:1 (AA exige 4.5:1). Locais: `index.html:80-84`, `evento.html:380-381`, `eventos-passados.html:84-85`. Trocar p/ `var(--marsala)` → 9.3:1. (30min)
- Contraste pink/lilac (~1.7:1) e yellow/blue (~1.6:1). `eventos-passados.html:87,91`, `quem-somos.html:60`. Trocar pra marsala. (30min)
- "Em breve" cinza-400 sobre fundos claros — ~2.4:1. `evento.html:356,363,370`. (5min)
- Footer texto branco com `opacity:0.6` sobre marsala → ~4.0:1 (texto pequeno precisa 4.5:1). (5min)
- Badge "Inscrições Encerradas" white/pink ~3.6:1. (5min)
- `<span class="btn">` "Evento Encerrado" sem semântica disabled — usar `<button disabled>` ou `<a aria-disabled="true">`. (15min)
- iframe Google Forms ainda em `evento-rj.html` mesmo com inscrições encerradas. (15min)
- Hierarquia headings home: H1 é a citação, não o nome da marca. (15min)
- Skip-link ausente — **(já mapeado em `melhorias-pendentes.md` item 2)**. (30min)
- `aria-expanded` ausente no botão hambúrguer mobile — **(já mapeado item 11)**. (5min)

#### MÉDIO

- `aria-disabled="true"` em `<span>` "Aulas" (Em breve) sem role interativo é ignorado. (5min)
- Touch targets do menu mobile <44px. (10min)
- Botão hambúrguer ~40×27px. (5min)
- Animações `fadeInUp` ignoram `prefers-reduced-motion`. (5min)
- `scrollIntoView({ behavior: 'smooth' })` força smooth scroll. (10min)
- Alt das 53 thumbnails: `Foto N do evento` — usar `alt=""` (já há aria-label no botão). (5min)
- Lightbox counter sem `aria-live="polite"`. (5min)
- `<section>` sem `aria-labelledby` em todas as páginas — **(já mapeado em `melhorias-manas-investem.md` item 14)**.
- `links.html` sem `<nav>` envolvendo links sociais. (10min)
- Logo header em `index.html` redundante com "Início" — usar `alt=""`. (10min)

#### BAIXO

- `+` separador em `evento-sp.html:70` sem `aria-hidden`. (5min)
- SVG email em `contato.html:177` sem `aria-hidden`. (2min)
- SVGs em `links.html` sem `aria-hidden`. (5min)
- "gap" em inglês sem `<span lang="en">`. (5min)
- `<cite>` para nome de pessoa (HTML5 reserva pra obra). (5min, opcional)

---

### 2. Segurança Web

#### ALTO

- **`README.md` desatualizado expõe stack Node/Postgres/Railway que não existe** + sugere credenciais fracas (`manas2024secretkey`, `minhaChaveAdmin123`). Risco real: se um Railway antigo ainda estiver no ar, acesso a `/api/admin/usuarios` vaza emails/idades/senhas hash. **Ação:** verificar Railway/Heroku antigo e desligar; reescrever README; rotacionar `SESSION_SECRET`/`ADMIN_KEY`; verificar histórico git por `.env` ou `server.js` commitados. (30min)
- **Ausência de Content-Security-Policy (CSP)** — qualquer XSS futuro vira RCE. **Fix:** adicionar `<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; frame-src https://docs.google.com; form-action 'self' https://docs.google.com; base-uri 'self'; object-src 'none'; upgrade-insecure-requests">`. (30min) — **(elevado de BAIXO em `melhorias-manas-investem.md` item 21)**

#### MÉDIO

- `rel="noreferrer"` ausente em 30 links externos. `replace_all` `rel="noopener"` → `rel="noopener noreferrer"`. (5min) — **(já mapeado em `melhorias-pendentes.md` item 6)**
- iframe Google Forms permite `allow-popups` desnecessário em `evento-rj.html:99`. (15min)
- `grid.innerHTML` em `eventos-passados.html:360` é frágil (hoje seguro, frágil se virar fetch externo). Refatorar pra `createElement` + `textContent`. (30min)
- Sem SRI no Google Fonts em `links.html:24-25`. Self-hostear DM Sans (já há `fonts/` local). (30min)

#### BAIXO

- `<meta http-equiv="X-UA-Compatible">` é dead code (IE EOL). (5min)
- HSTS preload em https://hstspreload.org/ se elegível. (5min)
- iframe sem `referrerpolicy="no-referrer"` no `evento-rj.html`. (2min)
- Privacy: iframe `docs.google.com` carrega cookies do Google. Evento RJ encerrado → considerar remover iframe. (5min)

---

### 3. SEO Técnico

#### CRÍTICO

- **🔴 Redirect 302 em produção** — coberto pelo alerta no topo. Prioridade #1.
- **`robots.txt` ausente.** Criar `/robots.txt`:
  ```
  User-agent: *
  Allow: /
  Sitemap: https://manasinvestem.com.br/sitemap.xml
  ```
  (5min)
- **Canonical ausente em todas as 8 páginas** — risco de duplicação `.html` vs sem extensão. Adicionar `<link rel="canonical">` em cada página. (30min) — **(elevado de Alta em `melhorias-pendentes.md` item 4)**

#### ALTO

- JSON-LD ausente — sem `Organization` na home, sem `Event` em RJ/SP, sem `ItemList` em eventos-passados. **(já mapeado item 9)** (1h)
- `og:url` inconsistente com URLs reais — todos sem extensão, mas servidor serve `.html`. (30min)
- Sitemap sem `<lastmod>` + `priority` errada nos eventos encerrados. (15min)
- `evento-sp.html` sem `<h1>` — só logos no hero. (5min)

#### MÉDIO

- Alt text genérico em `index.html:102` (`alt="Manas Investem"` numa foto). (5min)
- Alt text das galerias `Foto N do evento` — enriquecer com nome do evento. (15min)
- Anchor text fraco para `evento-rj.html`/`evento-sp.html` em `evento.html`. (15min)
- Twitter Card ausente em todas as páginas. (30min)
- Sitemap referencia URLs extensionless mas servidor serve `.html`. (15min)
- `links.html` com title genérico + texto sem acento ("Educacao"). (10min)

#### BAIXO

- Sitemap sem `<changefreq>`. (5min)
- Lightbox carrega `.jpg` sem `srcset`/WebP. (30min)
- `<title>` de RJ/SP não indica estado encerrado. (10min)

---

### 4. Performance

#### CRÍTICO

- **`@import url('fonts.googleapis.com/...')` dentro do `styles.css:7`** — cascata de 3 round-trips antes de qualquer texto renderizar (~600-900ms extras em 3G). Sem `<link rel="preconnect">` para domínio das fontes. **Fix:** mover pro `<head>` de cada página com `<link rel="preconnect">` para `fonts.googleapis.com` e `fonts.gstatic.com`, e `<link rel="stylesheet">` com a URL Google. Remover `@import` do CSS. Derrubar weights 300/900 (não usados). (30min)

#### ALTO

- `logo-pink.svg` tem 20KB — paths exportados como outline sem compressão. `npx svgo logo-pink.svg --multipass` → ~4-7KB. Adicionar `fetchpriority="high"` no hero da home (LCP). (15min)
- `ativa-mar-2026/10-th.webp` é 84KB vs ~18KB de média (4.7× acima). Reprocessar. (15min)
- Lightbox carrega `.jpg` em vez de `.webp` (`eventos-passados.html:390`). Adicionar feature detection + WebP. (15min)
- Thumbnail `<img>` fallback usa `.jpg` full-resolution (não há `-th.jpg`). Risco baixo (Safari/IE legacy < 1%). (30min)

#### MÉDIO

- CSS com ~146 classes não utilizadas (~20-25KB raw, ~6-8KB gzip). Rodar PurgeCSS. (1h) — **(já mapeado item 12)**
- `@keyframes fadeInUp` duplicado em 5 lugares. (5min) — **(já mapeado item 13)**
- Scroll listener sem `{ passive: true }` em 7 páginas. (5min)
- Royal Wisdom (86KB TTF) declarada mas sem uso real. (5min)

#### BAIXO

- Sem `fetchpriority="high"` no LCP da homepage. (5min)
- `foto-flavia-fernanda.png` (25MB) ainda no repo, não referenciado. (5min)
- `symbol-pink.png` (13KB) — converter pra WebP via `image-set()`. (15min)

---

### 5. Code Review / Arquitetura

#### CRÍTICO

- **JS de menu/header duplicado em 7 páginas (~370 linhas)** — divergência já materializada (4 páginas têm smooth-scroll, 3 não). Trocar comportamento = 7 edições. **Fix:** extrair pra `script.js` com `<script src="script.js" defer></script>`. (30min) — **(já mapeado item 1)**
- **Header e footer duplicados em 7 páginas (~52 linhas × 7 = ~364 linhas)** — sem build, sem includes. Inconsistências já presentes. **Opções (escolher):** (1) injetar via JS (1h), (2) Eleventy/11ty com layout único (>1h), (3) GitHub Action de include (1h).
- **~1.225 linhas (~42%) de CSS morto em `styles.css`** — classes `.dashboard-*`, `.feature-card`, `.testimonial-*`, `.auth-*`, `.team-*`, `.benefit-card`, `.stats-*`, `.profile-card`, `.values-grid`, `.about-hero`. Resíduo de scaffolding. **Fix:** rodar `npx purgecss --css styles.css --content '*.html'`; depois `git rm` dos blocos. (30min)

#### ALTO

- `links.html` é uma ilha — não importa `styles.css`, redefine `:root` à mão (com cores **dessincronizadas** do site real, faltam `--lilac`/`--blue`/`--coral`/`--yellow`). E o link "Evento Presencial - 28/02" aponta pra evento já encerrado. (30min)
- CSS inline em `<style>` blocks (~530 linhas em 4 páginas). Extrair padrões repetidos. (1h)
- Estilos inline (`style="..."`) carregando responsabilidades de design — `evento.html:351,378-381`. Criar `.quote-block` + `.quote-block__cite`. (30min)

#### MÉDIO

- Footer-social vs nav-links inconsistente — coberto pelo fix de duplicação.
- Indentação suspeita do `<img>` do logo (8 espaços extra em 5 páginas). (5min)
- 18 valores de cor hardcoded fora do `:root`. Adicionar tokens `--overlay-dark`, `--overlay-light`, `--green-dark`. (30min)
- 3 declarações independentes de `.hero-symbol-bg::before` com opacidades diferentes. (30min)
- Magic numbers (`160px`, `120px`, `80px` para top-padding). Adicionar `--header-height`. (30min)
- CSS sem comentários de "porquê". (30min)
- "Educacao" sem acento em `links.html:150`. (5min)

#### BAIXO

- `Site/` e `atualizacoes/` versionados localmente (ver `git ls-files`). (5min)
- `WhatsApp Image 2026-02-21 at 12.20.23.jpeg` solto na raiz (já no `.gitignore`). (5min)
- 15 media queries `@media (max-width: 768px)` espalhadas. (1h) — **(já mapeado item 18)**
- `symbol-pink.png` ainda PNG enquanto logo é SVG. (30min)
- `tabindex="0"` em `<span>` (anti-pattern). Coberto pelo fix de a11y. (15min)
- Sem versionamento de assets (`styles.css?v=...`). (5min manual / 30min via Action)

---

## Como usar este documento

1. **Antes do próximo upload pro Hostinger:** atacar item #1 (regra de redirect). Sem isso, as novas páginas (`eventos-passados.html`) vão cair no mesmo 302 das atuais.
2. **Mesma rodada de upload:** itens 2-9 (críticos restantes — ~4h de trabalho). Tudo é alteração local, sobe junto com o resto.
3. **Próxima sprint:** quick wins MÉDIO/BAIXO de A11y e SEO (~3-4h).
4. **Sprint dedicada (1 dia):** items de arquitetura — refatoração de header/footer/CSS morto.
5. **Backlog:** itens BAIXO ficam como "fim de tarde" quando der tempo.

## Já mapeado em outros arquivos

Os arquivos `melhorias-manas-investem.md` (lista antiga, 22 itens) e `melhorias-pendentes.md` (lista priorizada, ~25 itens) já mapearam vários desses pontos. Esta auditoria:

- **Re-elevou prioridade** de alguns itens (CSP de "Baixa" → ALTO; canonical de "Alta" → CRÍTICO)
- **Confirmou status** de itens já resolvidos (title no iframe, TODO em `evento-sp.html`, horário evento RJ)
- **Identificou novos itens** (redirect 302 em produção, README desatualizado, lightbox sem focus trap, thumbnails inconsistentes)

Recomenda-se, após executar os itens críticos, **consolidar os 3 documentos** em um único `BACKLOG.md` para reduzir fragmentação.

---

*Gerado por 5 agents paralelos do Claude Code: a11y-architect, security-reviewer, seo-specialist, performance-optimizer, code-reviewer.*
