# Relatório de Atualizações — Manas Investem

> Documento para conferência da Flávia das edições solicitadas no arquivo `Edições necessárias site.docx` e do esboço da nova navegação.

**Status:** em andamento — atualizado conforme cada item é finalizado.

---

## Resumo executivo

| # | Item solicitado | Status | Página(s) afetada(s) |
|---|---|---|---|
| 1 | Trocar foto Flávia + Fernanda na Home (estava escura) | ✅ feito | `index.html` |
| 2 | Quem Somos: juntar parágrafos em texto corrido | ✅ feito | `quem-somos.html` |
| 3 | Quem Somos: trocar foto da Flávia + reduzir altura | ✅ feito | `quem-somos.html` |
| 4 | Agenda: trocar foto de fundo (estava difícil de ler) | ✅ feito | `evento.html` |
| 5 | Agenda: tirar negrito da citação + adicionar referência | ✅ feito | `evento.html` |
| 6 | Evento SP: trocar "Lista de Espera" por "Evento Encerrado" | ✅ feito | `evento-sp.html` |
| 7 | Nova página "Eventos Passados" com layout do PDF | ✅ feito | `eventos-passados.html` (nova) |
| 8 | Nav suspensa hierárquica conforme esboço | ✅ feito | todas as páginas |

---

## Decisões tomadas durante a implementação

Algumas decisões foram tomadas com base em interpretação do briefing. Pontos que podem precisar de validação:

1. **Estrutura da nav (esboço manuscrito):** implementada literalmente como desenhada — `Agenda ▾ → [Aulas, Encontros ▸ → [Futuros, Passados]]`
   - "Aulas" ficou **não-clicável** com indicação visual "Em breve" (já que ainda não há página de aulas)
   - "Agenda" e "Encontros" são apenas rótulos que abrem dropdown — não navegam
   - "Futuros" → leva pra agenda atual (`evento.html`, com os 3 quadrinhos)
   - "Passados" → leva pra nova página de eventos passados

2. **Página Evento SP:** removemos a seção do formulário Google Forms (lista de espera) por completo, deixando coerente com o status "Evento Encerrado" (igual ao RJ).

3. **Lightbox da nova página:** implementado em JS puro vanilla (sem dependência externa), com setas para navegar e ESC para fechar.

4. **Curadoria de fotos:** todas as fotos disponíveis em cada pasta foram incluídas (descartando arquivos `.CR2` que são RAW de câmera, não exibíveis em browser). Quantidades:
   - Encontro RJ 28/02/2026: 15 fotos
   - Encontro Ativa Investimentos: 10 fotos
   - Encontro Lauro Rabha: 5 fotos
   - Coquetel SP 26/11/2025: 10 fotos
   - Café da manhã RJ 04/10/2025: 13 fotos

   Caso a Flávia queira reduzir a quantidade ou trocar fotos específicas, é fácil editar.

---

## Detalhes por item

### Item 1 — Foto Home (Flávia + Fernanda)

**Pedido:** "Foto Flávia e Fernanda rindo está escura, trocar para a foto que está no Drive com o nome 'Foto Flávia e Fernanda correta que está na home'."

**Feito:**
- Foto nova (`atualizacoes/Foto Flávia e Fernanda correta que esta na home.jpg`) foi otimizada e substituiu a versão escura.
- Versões geradas: `images/foto-flavia-fernanda.jpg` (249 KB) e `images/foto-flavia-fernanda.webp` (163 KB)
- Resolução final: 999×1500 px (suficiente para retina; original era 2031×3047 e desnecessariamente grande)

**Como conferir:** abrir `index.html`, descer até a seção "Manas quando investem, investem muito bem" — a foto da Flávia e Fernanda à direita deve ser a versão clara/correta.

### Item 2-3 — Quem Somos

**Pedido:**
- "No texto abaixo, eliminar os parágrafos do texto para colocar tudo corrido."
- "Alterar a foto da Flávia para foto nova que está no Drive com o nome 'Foto Flávia nova para Quem Somos'"
- "Também podemos diminuir a altura da foto para ela não ficar tao grande. De repente acompanhando a altura que ficou o texto que está à direita."

**Feito:**
- Os 3 parágrafos foram unificados em **um único parágrafo corrido** (mantendo `<strong>` em "Flávia Lanat" e `<em>` em "gap").
- Foto nova (`atualizacoes/Foto Flávia nova para Quem Somos.png`) foi otimizada e substituiu a anterior.
- Versões geradas: `images/flavia-lanat.jpg` (127 KB) e `images/flavia-lanat.webp` (56 KB) — antes 161/142 KB. Resolução 1066×1600 px.
- **Altura da foto agora acompanha o texto à direita** automaticamente: removi o `max-height: 1125px` fixo e mudei o grid para `align-items: stretch`, com `object-fit: cover` na imagem. Resultado: a foto se ajusta dinamicamente à altura do texto.
- Em mobile (largura < 768 px) mantive o `max-height: 400px` para não ficar uma foto gigante na vertical.

**Como conferir:** abrir `quem-somos.html` e descer até a seção "A mana por trás do Manas Investem". O texto deve aparecer como um único bloco corrido (sem quebras de parágrafo) ao lado da foto nova, com ambos os lados terminando aproximadamente na mesma linha.

### Item 4-5 — Agenda

**Pedido:**
- "O título da página e frase: 'No Manas Investem fazemos encontros periódicos…' estão difícies de ler por causa da cor da foto. Coloquei uma foto nova ajustada na pasta para substituir a atual que vai facilitar a leitura."
- "Tirar o negrito da frase: 'Algumas mulheres compram bolsas...' E inserir a referência da citação da frase, logo abaixo, 'Flávia Lanat, fundadora Manas Investem'."

**Feito:**
- Foto de fundo nova (`atualizacoes/Foto para Agenda de Eventos.png`) foi otimizada e substituiu a anterior. Versões: `images/evento-background.jpg` (220 KB) e `.webp` (106 KB), 1800×1199 px.
- A citação no fundo amarelo perdeu o negrito (passou de `font-weight: 700` para `400`).
- Logo abaixo da citação, adicionada a referência **Flávia Lanat, fundadora Manas Investem** com estilo discreto (DM Sans, peso 500, cor rosa, opacidade 70%) — mesmo padrão visual usado na página Quem Somos.

**Como conferir:** abrir `evento.html`. O hero deve estar mais legível com a nova foto. Descer até a seção amarela com a citação — o texto deve estar em peso normal (não-negrito), e logo abaixo aparece "Flávia Lanat, fundadora Manas Investem" em letras menores.

### Item 6 — Evento SP

**Pedido:** "Na página de inscrição do Evento SP, precisamos alterar o botão que está 'Lista de Espera', para 'Evento Encerrado' – para ficar igual ao evento do RJ."

**Feito:**
- Botão "Lista de Espera" trocado por **"Evento Encerrado"**, no mesmo formato visual desabilitado (opacidade 60%, sem cursor de clique) usado na página do Evento RJ.
- Como o botão não tem mais função (não há mais inscrição/lista de espera), **a seção do formulário Google Forms foi removida da página** — assim ela fica coerente com o status "encerrado" e visualmente igual à do RJ.
- Mantida a seção final com email de contato (`contato@manasinvestem.com.br`) para dúvidas.

**Como conferir:** abrir `evento-sp.html`. O botão rosa que era "Lista de Espera" agora aparece como "Evento Encerrado", sem ser clicável. Não deve mais aparecer o formulário do Google embutido na página.

### Item 7 — Nova página Eventos Passados

**Pedido:** "Sugestao de arte para a nova página que vai ter que se criada para os eventos 'passados' está na pasta do Drive."

**Feito:**

Nova página `eventos-passados.html` criada do zero seguindo o layout do PDF entregue pela Flávia. Estrutura:

1. **Hero (verde)** — fundo verde `#c6db9c` com símbolo "M" decorativo ao fundo
   - Título: "Como foram nossos últimos eventos?" (Playfair Display, sem negrito, rosa)
   - Subtítulo: "Quando uma mulher entende e controla suas finanças, ela amplia a sua liberdade." (DM Sans, rosa)

2. **5 blocos de eventos** com cores alternadas conforme o PDF:
   - **Encontro no Rio de Janeiro em 28/02/2026** — fundo amarelo, título rosa (16 fotos)
   - **Encontro do Dia das Mulheres na Ativa Investimentos** — fundo rosa, título lilás (10 fotos)
   - **Encontro para as advogadas do Lauro Rabha Advogados** — fundo verde, título rosa (5 fotos)
   - **Coquetel em São Paulo em 26/11/2025** — fundo lilás, título rosa (10 fotos)
   - **Café da manhã no Rio de Janeiro em 04/10/2025** — fundo rosa claro (blush), título marsala (13 fotos)

3. **2 CTAs entre os blocos:**
   - "Quero participar!" (fundo lilás) → leva para a Agenda atual
   - "Quero fazer um evento com o Manas Investem!" (fundo amarelo) → leva para Contato

4. **Lightbox interativo** — ao clicar em qualquer miniatura:
   - Abre a foto em modal escuro fullscreen
   - Navegação com setas ◀ ▶ (também via teclado)
   - Fecha com X, ESC ou clique fora da foto
   - Mostra contador "X / total"

5. **Otimização de imagens:**
   - 54 fotos dos eventos foram redimensionadas e comprimidas
   - Cada foto vira 3 arquivos: thumbnail WebP (~15 KB), full WebP (~80 KB) e fallback JPG (~150 KB)
   - Todas com `loading="lazy"` para não pesar no carregamento inicial
   - Arquivos `.CR2` (RAW de câmera) descartados automaticamente

**Diferenças do mock (PDF) na implementação atual** — a Flávia pode pedir ajuste se quiser:
- O mock mostra blocos com **metade colorida + metade decorativa** (cor sólida no lado oposto). Implementei com **bloco full-width** com a cor de fundo, conteúdo centralizado. Razões: (a) fica mais legível em mobile, (b) consistente com o resto do site, (c) economiza espaço vertical sem perder o ritmo de cores. Se ela preferir o split visual do PDF, é fácil ajustar.
- As notas do tipo "Fonte DM SANS tamanho 26 em negrito / Fundo amarelo" no PDF foram interpretadas como **instruções para o desenvolvedor** (e respeitadas), não como texto que aparece na página final.

**Como conferir:** abrir `eventos-passados.html`. Descer pela página inteira para ver os 5 blocos e CTAs. Clicar em qualquer foto para testar o lightbox. Testar setas (◀ ▶) e fechar (X / ESC).

### Item 8 — Nova navegação

**Pedido:** "Para colocarmos uma página 'Eventos Passados' por exemplo, penso que devemos fazer uma lista suspensa assim na barra de navegação do site." (acompanhado do esboço manuscrito)

**Feito:**

A navegação foi reorganizada em **todas as páginas** do site (Início, Quem Somos, Agenda, Encontro RJ, Encontro SP, Contato e a nova Eventos Passados) seguindo a hierarquia literal do esboço da Flávia:

```
Início | Quem Somos | Agenda ▾ | Contato
                       │
                       ├─ Aulas (Em breve, esmaecido, não-clicável)
                       │
                       └─ Encontros ▸
                                    │
                                    ├─ Futuros   → leva pra Agenda atual (com os 3 quadrinhos)
                                    └─ Passados  → leva pra nova página de Eventos Passados
```

**Comportamento:**
- **Desktop:** ao passar o mouse sobre "Agenda" abre o primeiro nível. Ao passar o mouse sobre "Encontros" abre o sub-menu lateral com Futuros / Passados.
- **Mobile:** ao tocar em "Agenda" expande inline; ao tocar em "Encontros" expande os sub-itens indentados abaixo.
- **"Aulas"** aparece esmaecido com a indicação "Em breve" — ainda não há aulas, então não é clicável.
- **"Agenda"** e **"Encontros"** são apenas rótulos que abrem dropdown, não navegam.

**Como conferir:** em qualquer página, passar o mouse sobre "Agenda" no topo. Em mobile, tocar em "Agenda" e depois em "Encontros".

---

## Ajustes pós-revisão da Flávia (02/05/2026)

Depois que a Flávia revisou a versão de staging, ela pediu mais 6 acertos pequenos. Todos aplicados:

1. **Quem Somos — formação acadêmica:** "MBA pela IE Business School" → **"certificação de MBA pela IE Business School"** (a Flávia esclareceu que é um programa específico da IE, não o MBA full).
2. **Quem Somos — trajetória:** "13 anos de atuação em disputas" → **"15 anos de atuação em contencioso"**.
3. **Eventos Passados — Ativa Investimentos:** removidas as 2 últimas fotos (de 10 → 8 fotos no grid).
4. **Eventos Passados — Lauro Rabha:** removida a última foto (de 5 → 4).
5. **Eventos Passados — Coquetel SP 26/11:** removida a 3ª foto (de 9 → 8). As demais foram renumeradas em sequência (sem buracos).
6. **Eventos Passados — Café da manhã RJ 04/10:** removida a última foto (de 13 → 12).

## Ajustes finais (após double-check com o briefing)

Conferi tudo de novo cotejando com o Word e o PDF originais. Apliquei 1 acerto:

- **Padronização da assinatura da Flávia:** o site tinha duas variantes ("fundadora do Manas Investem" no Quem Somos e "fundadora Manas Investem" na Agenda). Padronizei nas duas como **"fundadora Manas Investem"**, que é a forma exata do briefing.

### Pontos que respeitei como estão (não mudei)

- **Tamanho da fonte** dos títulos dos blocos: o PDF pede 26 px fixo, mas mantive responsivo (clamp) para não estourar em celular pequeno.
- **Cor `#562834` (marsala)** no título do bloco "Café da manhã RJ": o PDF traz `#563834`, provavelmente erro de digitação (1 caractere de diferença), mantive a variável de cor que já é usada em todo o site.
- **Subtítulo da nova página** "...amplia a sua liberdade." (com ponto final, mais natural em português; o PDF não tinha ponto).
- **Título do bloco RJ 28/02** "Encontro no Rio de Janeiro em 28/02/2026" (formato de data com 2 dígitos para o mês, padrão usado no resto do site).

---

## Como conferir

Quando todos os itens forem finalizados, basta abrir o site em qualquer browser. Páginas para conferir:

- `index.html` (Home) — foto Flávia + Fernanda nova
- `quem-somos.html` — texto corrido + foto nova com altura ajustada
- `evento.html` (Agenda) — foto de fundo nova + citação sem negrito com referência
- `evento-sp.html` — botão "Evento Encerrado" + sem formulário
- `eventos-passados.html` — nova página com 5 blocos de eventos
- Em qualquer página: passar mouse em "Agenda" no menu superior para testar dropdown hierárquico

Em mobile (largura < 768px): tap em "Agenda" expande inline; tap em "Encontros" expande sub-itens indentados.
