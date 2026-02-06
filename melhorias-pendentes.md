# Melhorias Pendentes — Manas Investem

## Prioridade Alta — Impacto grande, esforço baixo

- [ ] **1. Extrair JavaScript duplicado para `script.js`** — O mesmo bloco de ~40 linhas (scroll, menu, dropdown, smooth scroll) está copiado em 6 páginas. Um arquivo externo com `defer` resolve e melhora cache.

- [ ] **2. Adicionar skip-link para acessibilidade** — Falta um link "Pular para o conteúdo" para navegação por teclado. Essencial para WCAG.

- [ ] **3. Adicionar `focus-visible` no CSS** — Links e botões não têm indicador visual de foco para quem navega por teclado.

- [ ] **4. Adicionar `<link rel="canonical">` em todas as páginas** — Sem canonical, buscadores podem indexar duplicatas.

- [ ] **5. Adicionar `title` no iframe do Google Forms** — `evento-rj.html` e `evento-sp.html` têm iframes sem `title`, o que é um problema de acessibilidade.

- [ ] **6. Adicionar `rel="noreferrer"` nos links externos** — Os links sociais têm `rel="noopener"` mas falta `noreferrer`.

- [ ] **7. Remover estilos inline do `evento.html`** — O `<h2>` e o `<blockquote>` da página Agenda usam estilos inline longos que deveriam estar no CSS.

---

## Prioridade Média — Impacto médio, esforço moderado

- [ ] **8. Criar `sitemap.xml` e `robots.txt`** — Buscadores não conseguem crawlear o site eficientemente sem eles.

- [ ] **9. Adicionar JSON-LD (Schema.org)** — Schema `Organization` na homepage e `Event` nas páginas de evento para rich snippets no Google.

- [ ] **10. Melhorar carregamento de fontes** — O `@import` do Google Fonts no CSS é render-blocking. Trocar por `<link rel="preconnect">` + `<link>` no HTML.

- [ ] **11. Adicionar `aria-expanded` no menu mobile** — O botão do menu toggle não comunica seu estado para leitores de tela.

- [ ] **12. Remover CSS não utilizado** — `styles.css` tem ~500 linhas de estilos nunca usados (dashboard, auth, team-grid, etc.).

- [ ] **13. `@keyframes fadeInUp` duplicado** — Definido no `styles.css` e repetido nos `<style>` inline de 5 páginas.

- [ ] **14. Criar `404.html`** — Não existe página de erro para links quebrados.

- [ ] **15. Adicionar formatos adicionais de favicon** — Só tem SVG. Falta `apple-touch-icon.png` (180x180) para iOS e `.ico` para navegadores legados.

---

## Prioridade Baixa — Polimento

- [ ] **16. Criar `site.webmanifest`** — Para suporte a PWA e "Adicionar à tela inicial" no Android.

- [ ] **17. Debounce no evento de scroll** — O listener do header dispara a cada pixel de scroll, poderia ser otimizado.

- [ ] **18. Consolidar media queries no CSS** — Mesmos breakpoints espalhados em vários lugares do arquivo.

- [ ] **19. Remover comentário TODO de produção** — `evento-sp.html` tem `<!-- TODO: Substituir pelo link do Google Form -->` visível no código.

- [ ] **20. Links.html não usa `styles.css`** — Redefine variáveis de cor inline ao invés de importar o CSS principal.

---

## Já Concluído (2026-02-04)

- [x] Adicionar `<h1>` na homepage
- [x] Adicionar `<main id="main-content">` em todas as páginas
- [x] Adicionar `og:image` em todas as páginas
- [x] Verificar consistência de horário do evento RJ
- [x] Otimizar imagens (WebP + `<picture>` + nomes semânticos)
- [x] Adicionar `loading="lazy"` nas imagens abaixo do fold
- [x] Criar branch de backup `backup/pre-melhorias`
