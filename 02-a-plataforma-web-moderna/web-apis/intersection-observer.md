# Intersection Observer API

A **Intersection Observer API** fornece uma maneira assíncrona e altamente
performática de monitorar quando um elemento do DOM entra, sai ou atinge uma
determinada porcentagem de visibilidade na tela do usuário (ou dentro de um
elemento contêiner com barra de rolagem).

Essa API é a base para a construção de padrões modernos de interface, como:

- **Carregamento sob Demanda (_Lazy Loading_):** Adiar o download de imagens e
  vídeos pesados até que o usuário role a página até próximo deles.
- **Rolagem Infinita (_Infinite Scrolling_):** Detectar quando o usuário se
  aproxima do fim de uma listagem para carregar automaticamente a próxima página
  de dados de uma API.
- **Animações Disparadas por Rolagem:** Iniciar transições visuais fluidas (como
  efeitos de surgimento e esmaecimento) apenas quando uma seção entra na área
  visível.
- **Métricas de Engajamento e Anúncios:** Registrar se um banner ou conteúdo
  permaneceu visível na tela por tempo suficiente para ser considerado
  visualizado.

Neste capítulo do catálogo, você aprenderá a arquitetura da Intersection
Observer API, compreenderá por que ela é muito mais rápida do que métodos
legados de rolagem e verá como implementar padrões práticos e tipados com
TypeScript.

## A Vantagem de Performance sobre Eventos de Rolagem

Antes do surgimento do `IntersectionObserver`, a única forma de verificar se um
elemento estava visível na tela era registrar um ouvinte para o evento `scroll`
da janela e calcular a posição manualmente:

```typescript
// ❌ ABORDAGEM LEGADA E PROBLEMÁTICA: Causa gargalos severos de renderização
window.addEventListener("scroll", () => {
  const element = document.querySelector("#banner");
  if (!element) return;

  // getBoundingClientRect() força o navegador a recalcular o layout da página inteira!
  const rect = element.getBoundingClientRect();
  const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;

  if (isVisible) {
    console.log("Elemento visível!");
  }
});
```

### Por que a abordagem antiga é prejudicial?

1. **Recálculos Forçados de Layout (_Reflow_):** O método
   `getBoundingClientRect()` é síncrono. Cada vez que ele é chamado dentro do
   evento de scroll (que dispara dezenas de vezes por segundo), o navegador é
   forçado a pausar e recalcular toda a geometria e posições da página.
2. **Queda de Taxa de Quadros (_Jank_):** O excesso de trabalho na thread
   principal faz a rolagem da página travar e perder a fluidez de 60 quadros por
   segundo (60 FPS), gerando uma experiência truncada para o usuário.

O **`IntersectionObserver`** elimina completamente esse problema: ele delega o
cálculo de visibilidade diretamente para o motor interno do navegador fora do
ciclo crítico de renderização e entrega as notificações de forma agrupada e
assíncrona.

## Instanciação e Opções de Configuração

Criamos um observador instanciando a classe `IntersectionObserver`, passando uma
função de callback e um objeto de opções opcional:

```typescript
const observer = new IntersectionObserver(
  (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
    // Código executado quando os elementos monitorados cruzam os limites de visibilidade
  },
  options,
);
```

### Opções de Configuração (`IntersectionObserverInit`)

| Propriedade  | Tipo                          | Padrão  | Descrição                                                                                                                                                                                                 |
| :----------- | :---------------------------- | :------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `root`       | `Element \| Document \| null` | `null`  | O elemento ancestral que serve como área de visualização. Se `null`, utiliza a **viewport inteira** da janela do navegador.                                                                               |
| `rootMargin` | `string`                      | `"0px"` | Margem virtual aplicada ao redor do `root` (usando sintaxe similar ao CSS: `"100px 0px"`). Permite antecipar o disparo antes mesmo do elemento encostar na tela.                                          |
| `threshold`  | `number \| number[]`          | `0`     | Um número ou array de números entre `0.0` e `1.0` indicando a fração de visibilidade do elemento necessária para disparar o callback (`0` = 1º pixel visível; `0.5` = 50% visível; `1.0` = 100% visível). |

### Métodos da Classe `IntersectionObserver`

| Método         | Assinatura TypeScript              | Descrição                                                                            |
| :------------- | :--------------------------------- | :----------------------------------------------------------------------------------- |
| `observe()`    | `observe(target: Element): void`   | Inicia o monitoramento de visibilidade do elemento informado.                        |
| `unobserve()`  | `unobserve(target: Element): void` | Encerra o monitoramento de um elemento específico.                                   |
| `disconnect()` | `disconnect(): void`               | Interrompe o monitoramento de **todos** os elementos registrados naquele observador. |

## A Anatomia do `IntersectionObserverEntry`

O callback do observador recebe uma lista de objetos
`IntersectionObserverEntry`, representando cada elemento que sofreu alteração em
sua visibilidade:

| Propriedade          | Tipo              | Descrição                                                                                            |
| :------------------- | :---------------- | :--------------------------------------------------------------------------------------------------- |
| `isIntersecting`     | `boolean`         | Retorna `true` se o elemento está atualmente cruzando ou dentro da área de visibilidade configurada. |
| `intersectionRatio`  | `number`          | Um valor de `0.0` a `1.0` que indica a porcentagem exata da área do elemento que está visível.       |
| `target`             | `Element`         | O elemento HTML específico do DOM que disparou a alteração.                                          |
| `boundingClientRect` | `DOMRectReadOnly` | O retângulo de dimensão e posição do elemento monitorado.                                            |
| `intersectionRect`   | `DOMRectReadOnly` | O retângulo correspondente apenas à parte do elemento que está visível dentro do `root`.             |
| `time`               | `number`          | Momento em que a interseção foi registrada (em milissegundos).                                       |

## Aplicações Práticas com TypeScript

### 1. Lazy Loading de Imagens com `data-src`

Um dos usos mais populares é carregar imagens de alta resolução apenas quando o
usuário rola a página até próximo delas, economizando dados e acelerando o
carregamento inicial da página:

```typescript
/**
 * Inicializa o Lazy Loading automático para todas as imagens com atributo data-src.
 */
export function setupLazyImages(): void {
  // 1. Configuração com margem preventiva de 200px para iniciar o download antes da imagem entrar na tela
  const imageObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        // Se a imagem entrou no raio de visão:
        if (entry.isIntersecting) {
          const imgElement = entry.target as HTMLImageElement;
          const realSrc = imgElement.getAttribute("data-src");

          if (realSrc) {
            imgElement.src = realSrc;
            imgElement.removeAttribute("data-src");
          }

          // 2. REGRA DE OURO: Desinscrever o elemento assim que ele for carregado
          observer.unobserve(imgElement);
        }
      });
    },
    {
      rootMargin: "200px 0px", // Pré-carrega 200px antes
      threshold: 0.01,
    },
  );

  // 3. Localiza e passa a monitorar todas as imagens marcadas
  const lazyImages =
    document.querySelectorAll<HTMLImageElement>("img[data-src]");
  lazyImages.forEach((img) => imageObserver.observe(img));
}
```

```html
<!-- Estrutura HTML: imagem leve de placeholder no src e URL real no data-src -->
<img
  src="placeholder.svg"
  data-src="https://imagens.fatec.sp.gov.br/campus-banner-hd.jpg"
  alt="Foto do Campus"
  class="lazy-image"
/>
```

### 2. Rolagem Infinita (_Infinite Scroll_) com Elemento Sentinela

Em vez de calcular distâncias na barra de rolagem, o padrão mais limpo e moderno
para rolagem infinita é posicionar um **elemento invisível (sentinela)** no
rodapé da listagem e observá-lo:

```typescript
type LoadPageCallback = () => Promise<boolean>; // Retorna false se não houver mais páginas

/**
 * Registra um sentinela no rodapé para carregar mais dados automaticamente.
 */
export function setupInfiniteScroll(
  sentinelElement: HTMLElement,
  onLoadMore: LoadPageCallback,
): () => void {
  let isLoading = false;
  let hasMorePages = true;

  const observer = new IntersectionObserver(
    async (entries) => {
      const [entry] = entries;

      // Se o sentinela ficou visível e não estamos em meio a uma requisição ativa:
      if (entry.isIntersecting && !isLoading && hasMorePages) {
        isLoading = true;
        try {
          hasMorePages = await onLoadMore();
          if (!hasMorePages) {
            // Se acabaram os dados da API, desconecta o observador
            observer.disconnect();
          }
        } catch (error) {
          console.error("Falha ao carregar novos itens da página:", error);
        } finally {
          isLoading = false;
        }
      }
    },
    {
      rootMargin: "300px", // Dispara 300px antes do usuário atingir o fim da página
      threshold: 0.1,
    },
  );

  observer.observe(sentinelElement);

  // Retorna função para desconectar o observador quando o componente for desmontado
  return () => observer.disconnect();
}
```

```html
<div id="product-list">
  <!-- Itens carregados dinamicamente entram aqui -->
</div>

<!-- Elemento sentinela no final da lista -->
<div id="scroll-sentinel" style="height: 20px;"></div>
```

### 3. Animações Disparadas por Rolagem (_Scroll-Triggered Animations_)

Podemos aplicar classes CSS para disparar animações de entrada quando seções
específicas surgem na tela:

```typescript
export function setupScrollAnimations(): void {
  const animationObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in-visible");
          // Desinscreve para a animação acontecer apenas uma vez
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2, // Dispara quando 20% do elemento estiver visível
    },
  );

  document
    .querySelectorAll(".animate-on-scroll")
    .forEach((el) => animationObserver.observe(el));
}
```

<details>
<summary>🔍 <strong>Aprofundamento: Atributo HTML nativo <code>loading="lazy"</code> vs. <code>IntersectionObserver</code></strong></summary>

Os navegadores modernos também suportam nativamente o atributo `loading="lazy"`
diretamente na tag HTML de imagens e iframes:

```html
<img src="foto-alta-resolucao.jpg" loading="lazy" alt="Paisagem" />
```

### Quando usar cada abordagem?

- **Use `loading="lazy"` nativo:** Para imagens estáticas comuns e páginas de
  conteúdo simples onde você deseja apenas adiar o download sem necessidade de
  lógica JavaScript ou transições visuais customizadas.
- **Use `IntersectionObserver`:** Quando você precisa de **controle fino sobre o
  carregamento** (como carregar com margens virtuais customizadas `rootMargin`),
  adicionar efeitos de esmaecimento (_fade-in_), exibir _placeholders_ com
  efeito _blur_, implementar rolagem infinita ou registrar métricas analíticas.

</details>

---

<a href="01-o-que-sao-web-apis.md">← O Que São Web APIs</a>
