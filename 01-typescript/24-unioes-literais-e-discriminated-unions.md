# 24. Uniões Literais e Discriminated Unions

No desenvolvimento de software para a Web, sistemas raramente lidam com dados
estáticos e homogêneos. Uma requisição HTTP transita entre estados como
`"carregando"`, `"sucesso"` ou `"erro"`; um pagamento pode ser realizado via
`"pix"`, `"cartao_credito"` ou `"boleto"`; e um usuário pode ser um
`"visitante"`, `"cliente"` ou `"administrador"`.

Quando modelamos esses cenários com tipos genéricos como `string` pura ou
criamos objetos cheios de propriedades opcionais soltas, abrimos espaço para
**estados inválidos e bugs silenciosos** em produção.

Neste capítulo, você aprenderá a combinar tipos com **Union Types** (`|`) e
**Intersection Types** (`&`), restringir valores com **Tipos Literais**,
compreender a superioridade moderna de **`as const` sobre Enums**, e dominar o
padrão arquitetural mais elegante do TypeScript: as **Uniões Discriminadas
(_Discriminated Unions_)**.

## A Dor dos Estados Impossíveis

Imagine que você está construindo uma aplicação Web que consome dados de uma API
e precisa representar o estado da interface visual. Uma abordagem ingênua muito
comum entre iniciantes é criar uma "sacola de propriedades opcionais":

```typescript
// ❌ MODELAGEM PROBLEMÁTICA: Permite estados contraditórios e impossíveis!
type ApiResponse = {
  status: string; // Ex: 'loading', 'success', 'error'
  data?: string[]; // Presente apenas no sucesso?
  errorMessage?: string; // Presente apenas no erro?
  errorCode?: number; // Presente apenas no erro?
};
```

Observe a fragilidade dessa estrutura. O TypeScript aceitará perfeitamente
objetos que **não fazem nenhum sentido no mundo real**:

```typescript
// ❌ Bug silencioso: Está carregando, mas contém dados E mensagem de erro simultaneamente!
const brokenState: ApiResponse = {
  status: "loading",
  data: ["Produto 1", "Produto 2"],
  errorMessage: "Falha de conexão com o servidor",
  errorCode: 500,
};
```

Para a regra de negócio, um estado não pode ser `loading` e `error` ao mesmo
tempo. O compilador deveria nos **impedir** de escrever esse código.

O primeiro passo para resolver isso é abandonar a `string` genérica e adotar
**Tipos de União e Tipos Literais**.

## Tipos de União (`|`) e Tipos de Interseção (`&`)

O TypeScript oferece operadores de conjuntos para combinar tipos existentes:

### 1. Union Types (União `|`)

Uma **União** estabelece que um valor pode ser **um tipo OU outro**. É o
operador lógico de alternativas:

```typescript
// O identificador pode ser numérico ou texto:
type ID = string | number;

function printIdentifier(id: ID): void {
  console.log(`ID do registro: ${id}`);
}

printIdentifier(101); // ✅ Válido
printIdentifier("usr_889"); // ✅ Válido
// printIdentifier(true);     // ❌ Erro: Type 'boolean' is not assignable to type 'ID'.
```

### 2. Intersection Types (Interseção `&`)

Uma **Interseção** combina múltiplos tipos em um só. O valor resultante deve
satisfazer **todas** as propriedades exigidas por cada um dos tipos combinados:

```typescript
type Timestamps = {
  createdAt: Date;
  updatedAt: Date;
};

type Article = {
  id: string;
  title: string;
};

// Combinando Article com Timestamps via interseção (&):
type StoredArticle = Article & Timestamps;

const post: StoredArticle = {
  id: "art_01",
  title: "Aprenda TypeScript na FATEC",
  createdAt: new Date(),
  updatedAt: new Date(),
};
```

#### Interseção (`&`) vs. Herança de Interfaces (`extends`)

No [Capítulo 22](22-interfaces.md), vimos que interfaces utilizam a
palavra-chave `extends` para reaproveitar e especializar contratos. A interseção
(`&`) é o **equivalente direto do `extends` para `type aliases`**:

```typescript
// 1. Com Interface e 'extends' (Capítulo 22):
interface StoredArticleInterface extends Article, Timestamps {
  viewsCount?: number;
}

// 2. Com Type Alias e Interseção '&':
type StoredArticleType = Article &
  Timestamps & {
    viewsCount?: number;
  };
```

A grande vantagem da interseção com `&` é sua **extrema flexibilidade**: ela
permite fundir tanto `types` quanto `interfaces`, além de possibilitar a
composição de campos anônimos _inline_ diretamente na mesma expressão.

## Tipos Literais (_Literal Types_)

Um **Tipo Literal** restringe uma variável a um valor exato e imutável de texto,
número ou booleano, em vez de permitir qualquer valor daquele tipo primitivo:

```typescript
// Em vez de 'string' genérica (que aceita qualquer texto):
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

function requestApi(url: string, method: HttpMethod): void {
  console.log(`Disparando requisição ${method} para ${url}`);
}

requestApi("/api/products", "GET"); // ✅ Válido

// ❌ Erro de compilação: previne typos antes de o código rodar!
// requestApi("/api/products", "FETCH"); // Erro: Argument of type '"FETCH"' is not assignable to parameter of type 'HttpMethod'.
```

Tipos literais também funcionam com números (ex.: `type HttpSuccessStatus = 200
| 201 | 204`) e booleanos (`type Flag = true`).

## `as const` (Const Assertions) vs. Enums Clássicos

No início do TypeScript, a forma tradicional de definir conjuntos fixos de
constantes era através da palavra-chave `enum`:

```typescript
// Abordagem clássica: Enum
enum OrderStatusEnum {
  Pending = "PENDING",
  Paid = "PAID",
  Cancelled = "CANCELLED",
}
```

No entanto, nos últimos anos, a comunidade e a documentação oficial do
TypeScript passaram a **recomendar amplamente o uso de Objetos com `as const` e
Tipos Literais derivados**, em detrimento de `enum`.

### Por que preferir `as const` a Enums na Web?

1. **Zero Código em Tempo de Execução:** Quase todos os tipos do TypeScript são
   completamente removidos após a compilação. Os `enums` são uma rara exceção:
   eles geram código JavaScript extra no arquivo final, aumentando o tamanho do
   _bundle_.
2. **Integração Natural com Strings e APIs:** Quando uma API HTTP retorna um
   JSON com o campo `"paid"`, você pode comparar diretamente com a string
   `"paid"` com suporte total a _autocomplete_ do editor, sem ser obrigado a
   importar o objeto `Enum` em cada arquivo do projeto.

### O Padrão Moderno: Objeto Imutável com `as const`

Utilizando a asserção **`as const`**, informamos ao compilador que todas as
propriedades do objeto são literais estritos e somente leitura:

```typescript
// 1. Objeto de valores em tempo de execução (JS puro e leve):
const ORDER_STATUS = {
  PENDING: "pending",
  PAID: "paid",
  CANCELLED: "cancelled",
} as const;

// 2. Tipo derivado automaticamente a partir dos valores do objeto:
type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];
// Resultado do tipo: "pending" | "paid" | "cancelled"

// 3. Uso limpo e seguro:
function updateOrderStatus(id: string, status: OrderStatus): void {
  console.log(`Pedido ${id} atualizado para: ${status}`);
}

updateOrderStatus("ord_100", ORDER_STATUS.PAID); // ✅ Usando a constante
updateOrderStatus("ord_100", "cancelled"); // ✅ Ou a string literal pura diretamente!
```

Esse padrão oferece o melhor dos dois mundos: autocomplete no editor, zero
overhead no bundle JavaScript e compatibilidade total com JSON de APIs HTTP.

## Discriminated Unions: Tornando Estados Inválidos Impossíveis

Agora que dominamos Uniões e Tipos Literais, podemos aplicar a técnica mais
poderosa de modelagem de sistemas no TypeScript: as **Uniões Discriminadas**
(_Discriminated Unions_ ou _Tagged Unions_).

Uma União Discriminada é composta por três elementos:

1. Múltiplos tipos de objetos distintos.
2. Cada tipo possui uma **propriedade em comum com um Tipo Literal único**
   (chamada de _discriminador_ ou _tag_, como `status`, `kind`, `type` ou
   `method`).
3. Uma união (`|`) agrupando todas as variações possíveis.

### Exemplo Real 1: Modelando Estados de uma Requisição Web

Vamos redesenhar o exemplo defeituoso do início do capítulo:

```typescript
// Cada estado é um contrato estrito e autossuficiente:
type IdleState = {
  status: "idle";
};

type LoadingState = {
  status: "loading";
};

type SuccessState = {
  status: "success";
  data: string[]; // 'data' SÓ existe quando o status é 'success'!
};

type ErrorState = {
  status: "error";
  errorMessage: string; // 'errorMessage' SÓ existe quando o status é 'error'!
  errorCode: number;
};

// A união discriminada completa:
type RequestState = IdleState | LoadingState | SuccessState | ErrorState;
```

### A Magia do Afunilamento no Compilador

Quando verificamos o discriminador `status` dentro de um `if` ou `switch`, o
TypeScript **afunila automaticamente o tipo** em cada ramo do código:

```typescript
function renderUi(state: RequestState): void {
  switch (state.status) {
    case "idle":
      console.log("Clique no botão para carregar os dados.");
      break;

    case "loading":
      console.log("Carregando produtos, por favor aguarde...");
      break;

    case "success":
      // ✅ SEGURO: Aqui dentro, o TS garante que 'state.data' existe!
      console.log(`Total de itens recebidos: ${state.data.length}`);
      break;

    case "error":
      // ✅ SEGURO: Aqui dentro, o TS garante que 'errorMessage' existe!
      console.log(`Erro ${state.errorCode}: ${state.errorMessage}`);
      break;
  }
}
```

Se você tentar acessar `state.data` dentro do bloco `"loading"` ou `"error"`, o
compilador apontará um erro imediato: a propriedade não existe naquele estado!

### Exemplo Real 2: Métodos de Pagamento em um E-commerce

Veja como modelar gateways de pagamento com propriedades específicas para cada
modalidade:

```typescript
type PixPayment = {
  method: "pix";
  qrCode: string;
  expiresInMinutes: number;
};

type CreditCardPayment = {
  method: "credit_card";
  cardLast4Digits: string;
  installments: number;
};

type BoletoPayment = {
  method: "boleto";
  barCode: string;
  dueDate: Date;
};

type Payment = PixPayment | CreditCardPayment | BoletoPayment;

function processPayment(payment: Payment): void {
  if (payment.method === "pix") {
    console.log(`Gere o QR Code: ${payment.qrCode}`);
  } else if (payment.method === "credit_card") {
    console.log(
      `Cobrando cartão final ${payment.cardLast4Digits} em ${payment.installments}x`,
    );
  } else {
    console.log(`Código de barras do boleto: ${payment.barCode}`);
  }
}
```

Nenhum método pode acessar acidentalmente dados de outro: `installments` só é
visível para cartão de crédito, e `qrCode` só é visível para Pix.

<details>
<summary>🔍 <b>Aprofundamento: Checagem Exaustiva com o Tipo `never`</b></summary>

O que acontece se um novo método de pagamento (ex.: `"apple_pay"`) for
adicionado à união `Payment` no futuro, mas o desenvolvedor esquecer de tratar
esse novo caso na função `processPayment`?

Podemos instruir o compilador do TypeScript a **impedir a compilação do
projeto** caso algum caso da união seja esquecido, utilizando o tipo primitivo
**`never`**:

```typescript
function processPaymentStrict(payment: Payment): void {
  switch (payment.method) {
    case "pix":
      console.log(`Pix: ${payment.qrCode}`);
      break;

    case "credit_card":
      console.log(`Cartão: ${payment.cardLast4Digits}`);
      break;

    case "boleto":
      console.log(`Boleto: ${payment.barCode}`);
      break;

    default: {
      // 🛡️ GUARDA DE EXAUSTIVIDADE:
      // Se todos os casos foram tratados acima, a variável 'payment' aqui dentro tem o tipo 'never'.
      // Se alguém adicionar um novo método à união e esquecer de tratá-lo, o compilador acusará erro aqui!
      const _exhaustiveCheck: never = payment;
      throw new Error(`Método de pagamento não tratado: ${_exhaustiveCheck}`);
    }
  }
}
```

Se alguém adicionar `type CryptoPayment = { method: "crypto"; ... }` à união
`Payment`, o bloco `default` acusará instantaneamente: `Type 'CryptoPayment' is
not assignable to type 'never'`. O código não compilará até que o desenvolvedor
crie o `case "crypto"` no `switch`!

</details>

## O Que Vem a Seguir?

Vimos como o compilador do TypeScript é inteligente ao analisar o discriminador
de uma união e afunilar o tipo para a estrutura correta.

No entanto, o mecanismo de afunilamento vai muito além de propriedades de união.
No **[Capítulo 25: Type Narrowing e Type
Guards](25-type-narrowing-e-type-guards.md)**, aprenderemos todas as formas de
reduzir tipos amplos (`unknown`, `string | number`, objetos genéricos) para
tipos específicos utilizando operadores nativos (`typeof`, `instanceof`, `in`) e
**predicados customizados de tipo (`val is Tipo`)**.

---

<a href="23-tipagem-estrutural-e-duck-typing.md">← Tipagem Estrutural e Duck
Typing</a>

<p align="right"><a href="25-type-narrowing-e-type-guards.md">Próximo: Type Narrowing e Type Guards →</a></p>
