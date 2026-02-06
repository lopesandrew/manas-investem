# Melhorias — Manas Investem

## Prioridade Alta

### 1. Adicionar `<h1>` na homepage
A homepage (index.html) não possui `<h1>`. O logo grande "manas investem" na seção hero ou a tagline principal devem ser um `<h1>`. Essencial para SEO e acessibilidade.

### 2. Adicionar `<main>` em todas as páginas
Nenhuma página tem o elemento `<main>`. Envolver o conteúdo principal (entre `<header>` e `<footer>`) com `<main id="main-content">` em todas as páginas: index.html, quem-somos.html, evento.html, evento-rj.html, evento-sp.html, contato.html.

### 3. Adicionar og:image
Falta a meta tag `og:image` em todas as páginas. Criar uma imagem de 1200x630px da marca e adicionar:
```html
<meta property="og:image" content="https://manasinvestem.com.br/images/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
```

### 4. Corrigir inconsistência de horário — Evento RJ
Na página evento-rj.html o conteúdo diz "10h às 13h" mas o Google Form embarcado diz "11h às 13h". Alinhar o horário correto.

### 5. Otimizar imagens
- O logo `logo-pink.png` tem 1218x513px mas é exibido em no máximo 332px de largura. Redimensionar para ~400px de largura e converter para WebP.
- Mesmo para `logo-green.png`.
- Converter `foto-flavia-fernanda.png` para WebP/JPEG (PNG é desnecessariamente pesado para fotos).
- Renomear `IMG_9259.jpg` (background da seção hero) para um nome semântico como `evento-mulheres.jpg` e comprimir.
- Usar `<picture>` com fallback para navegadores antigos:
```html
<picture>
  <source srcset="images/logo-pink.webp" type="image/webp">
  <img src="images/logo-pink.png" alt="Manas Investem">
</picture>
```

### 6. Adicionar `loading="lazy"` nas imagens abaixo do fold
Todas as imagens carregam imediatamente. Adicionar `loading="lazy"` nas imagens que não estão no viewport inicial (ex: foto do footer, imagem da seção "investem muito bem", etc.). Manter `loading="eager"` apenas no logo do header.

---

## Prioridade Média

### 7. Adicionar canonical link em todas as páginas
```html
<link rel="canonical" href="https://manasinvestem.com.br/">
```
Ajustar o href para cada página respectiva.

### 8. Adicionar apple-touch-icon
Criar ícone de 180x180px e adicionar no `<head>`:
```html
<link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png">
```

### 9. Adicionar `title` no iframe do Google Forms
Nos arquivos evento-rj.html e evento-sp.html, o iframe do Google Forms não tem `title`. Adicionar:
```html
<iframe title="Formulário de inscrição — Evento Manas Investem" ...>
```

### 10. Adicionar `rel="noreferrer"` nos links externos
Todos os links externos (Instagram, TikTok, LinkedIn, Substack) têm `rel="noopener"` mas falta `noreferrer`. Atualizar para:
```html
rel="noopener noreferrer"
```

### 11. Criar página 404.html
Criar uma página 404.html customizada com a identidade visual do site e links de navegação de volta. GitHub Pages usa automaticamente o arquivo `404.html` na raiz.

### 12. Adicionar skip-link
Adicionar em todas as páginas, como primeiro filho do `<body>`:
```html
<a class="skip-link" href="#main-content">Pular para o conteúdo</a>
```
Com CSS:
```css
.skip-link {
  position: absolute;
  top: -100%;
  left: 0;
  padding: 0.5rem 1rem;
  background: var(--primary);
  color: white;
  z-index: 9999;
}
.skip-link:focus {
  top: 0;
}
```

### 13. Externalizar JavaScript
Mover o JS inline de todas as páginas para um arquivo `script.js` separado. Carregar com `defer`:
```html
<script src="script.js" defer></script>
```

### 14. Adicionar `aria-label` nas sections
Cada `<section>` deve ter um `aria-label` descritivo:
```html
<section class="hero" aria-label="Introdução">
<section class="section-card" aria-label="Sobre o Manas Investem">
<section class="section-investem" aria-label="Dados sobre mulheres investidoras">
```

### 15. Adicionar focus-visible em links e botões
Adicionar no CSS um estilo de foco visível para navegação por teclado:
```css
a:focus-visible,
button:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}
```

---

## Prioridade Baixa

### 16. Adicionar Structured Data (JSON-LD)
Adicionar no `<head>` da homepage:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Manas Investem",
  "url": "https://manasinvestem.com.br",
  "description": "Educação financeira independente para mulheres brasileiras",
  "sameAs": [
    "https://instagram.com/manasinvestem",
    "https://www.tiktok.com/@manasinvestem",
    "https://www.linkedin.com/company/manas-investem/"
  ]
}
</script>
```
Nas páginas de evento, adicionar também schema `Event`.

### 17. Adicionar print stylesheet
```css
@media print {
  header, footer, .menu-toggle, .btn { display: none; }
  body { font-size: 12pt; color: #000; }
  a { text-decoration: underline; }
}
```

### 18. Limpar font weights não utilizados
Há 23 font weights declarados mas apenas 5 são carregados. Reduzir os @font-face do DM Sans para apenas os weights usados (400, 600, 700) para reduzir o CSS.

### 19. Adicionar ícones SVG nas redes sociais do footer
Os links de Instagram, TikTok, LinkedIn e Newsletter no footer são apenas texto. Adicionar ícones SVG inline para melhorar a usabilidade visual.

### 20. Melhorar a página de Contato
A página atual mostra apenas um e-mail. Considerar adicionar um formulário de contato simples (Google Forms) e/ou links diretos para as redes sociais.

### 21. Adicionar Content Security Policy
Adicionar meta tag CSP no `<head>`:
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data:; frame-src https://docs.google.com; script-src 'self'">
```
Nota: só funciona plenamente após externalizar o JS (item 13).
