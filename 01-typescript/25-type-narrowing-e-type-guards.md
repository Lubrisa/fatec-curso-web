# 25. Type Narrowing e Type Guards

No [Capítulo 24](24-unioes-literais-e-discriminated-unions.md), aprendemos a
trabalhar com tipos de união (`string | number`) e uniões discriminadas. No
entanto, ao lidar com uniões amplas ou dados de entrada genéricos (`unknown`),
surge um obstáculo comum: o TypeScript nos impede de executar métodos que não
sejam compartilhados por todos os tipos possíveis daquela variável.

Tentar contornar esse bloqueio utilizando coerções forçadas como `as any` ou `as
string` anula a segurança do TypeScript e reintroduz falhas em tempo de
execução.

A abordagem correta e profissional é o **Afunilamento de Tipos (_Type
Narrowing_)**, realizado por meio de expressões de validação conhecidas como
**_Type Guards_**.

Neste capítulo, você aprenderá como o compilador analisa o fluxo de execução do
seu código, como utilizar os _Type Guards_ nativos do JavaScript (`typeof`,
`instanceof`, `in`) e como criar seus próprios **Predicados de Tipo Customizados
(`val is Tipo`)** e **Funções de Asserção (`asserts val is Tipo`)**.

## O Que É Type Narrowing?

**_Type Narrowing_** (afunilamento de tipos) é o processo pelo qual o TypeScript
analisa o fluxo de controle do código (_Control Flow Analysis_) e deduz um tipo
mais específico para uma variável dentro de um determinado bloco condicional.

Observe o exemplo a seguir:

```typescript
function formatPadding(value: string | number): string {
  // ❌ ERRO: O método .toFixed() não existe em 'string'
  // return value.toFixed(2);

  // ✅ AFUNILAMENTO COM TYPE GUARD (typeof):
  if (typeof value === "number") {
    // Aqui dentro, o TypeScript SABE que 'value' é estritamente 'number'
    return `${value.toFixed(2)}px`;
  }

  // A partir desta linha, o TypeScript DEDUZ que 'value' só pode ser 'string'
  return value.trim();
}
```

O compilador é inteligente o suficiente para rastrear _guard clauses_ e retornos
antecipados (`return`), ajustando a tipagem da variável linha a linha.

## Type Guards Nativos do JavaScript

O TypeScript reconhece operadores condicionais padrão do JavaScript e os
transforma em verificadores de tipo em tempo de compilação:

### 1. O Operador `typeof`

Utilizado para validar **tipos primitivos** (`"string"`, `"number"`,
`"boolean"`, `"symbol"`, `"bigint"`, `"undefined"` e `"function"`):

```typescript
function printValue(input: string | number | boolean): void {
  if (typeof input === "string") {
    console.log(`Texto: ${input.toUpperCase()}`);
  } else if (typeof input === "number") {
    console.log(`Número dobrado: ${input * 2}`);
  } else {
    console.log(`Booleano: ${input ? "Verdadeiro" : "Falso"}`);
  }
}
```

> **Cuidado com `null`:** Em JavaScript, a expressão histórica `typeof null`
> retorna `"object"`. Portanto, se você verificar apenas `typeof value ===
"object"`, a variável ainda poderá ser `null`. Para validar objetos com
> segurança, combine com `value !== null`.

### 2. O Operador `instanceof`

Utilizado para verificar se um objeto foi instanciado a partir de uma **classe
concreta ou construtor nativo** (`Date`, `Error`, `RegExp`, `HTMLElement`):

```typescript
function formatDateInput(input: string | Date): string {
  if (input instanceof Date) {
    // ✅ Aqui dentro, 'input' é do tipo Date:
    return input.toISOString().split("T")[0];
  }

  // ✅ Aqui fora, 'input' só pode ser string:
  return input.trim();
}

function handleApiError(error: unknown): void {
  if (error instanceof Error) {
    // ✅ Acesso seguro à propriedade .message de Error:
    console.error(`Erro operacional capturado: ${error.message}`);
  } else {
    console.error("Erro inesperado e sem mensagem padrão:", error);
  }
}
```

### 3. O Operador `in`

Utilizado para checar a **existência de propriedades específicas** em objetos
que pertencem a uniões:

```typescript
type RegisteredUser = {
  id: string;
  email: string;
  roles: string[];
};

type GuestUser = {
  sessionId: string;
};

type CurrentUser = RegisteredUser | GuestUser;

function authenticateAccess(user: CurrentUser): void {
  // Verificamos se a chave 'roles' existe no objeto:
  if ("roles" in user) {
    // ✅ Aqui dentro, 'user' é estritamente 'RegisteredUser'
    console.log(`Usuário logado com ${user.roles.length} permissões.`);
  } else {
    // ✅ Aqui dentro, 'user' é estritamente 'GuestUser'
    console.log(`Sessão temporária de convidado: ${user.sessionId}`);
  }
}
```

### 4. Checagens de Igualdade Estrita (`===`, `!==`)

A checagem direta de valores elimina `null` e `undefined` de tipos opcionais:

```typescript
function processScore(score: number | null | undefined): number {
  if (score === null || score === undefined) {
    return 0; // Fallback para pontuação vazia
  }

  // ✅ A partir daqui, 'score' é estritamente 'number'
  return score * 1.5;
}
```

## User-Defined Type Guards (Predicados de Tipo: `val is Tipo`)

À medida que as aplicações crescem, as validações nativas (`typeof`, `in`)
tornam-se repetitivas ou insuficientes para validar estruturas de dados mais
profundas (como objetos vindos de APIs externas).

Para encapsular lógicas de validação em funções reutilizáveis sem perder a
informação de tipo para o compilador, utilizamos um **Predicado de Tipo** (_Type
Predicate_) no retorno da função: `parametro is Tipo`.

### A Dor das Funções de Validação Comuns

Se você criar uma função booleana comum, o TypeScript **não** consegue inferir o
tipo no código que a chama:

```typescript
type Product = { id: string; price: number };

// ❌ Função booleana tradicional (NÃO afunila o tipo):
function isProductTraditional(item: any): boolean {
  return item !== null && typeof item === "object" && "price" in item;
}

function calculateTax(item: unknown) {
  if (isProductTraditional(item)) {
    // item.price; // ❌ Erro: 'item' continua sendo 'unknown'!
  }
}
```

### A Solução com Predicado de Tipo (`item is Product`)

Substituindo o retorno `boolean` por `item is Product`, informamos ao TypeScript
que, caso a função retorne `true`, a variável avaliada deve ser tratada como
`Product`:

```typescript
type Product = {
  id: string;
  price: number;
};

// ✅ Type Guard customizado com predicado de tipo:
function isProduct(item: unknown): item is Product {
  return (
    typeof item === "object" &&
    item !== null &&
    "id" in item &&
    typeof (item as Record<string, unknown>).id === "string" &&
    "price" in item &&
    typeof (item as Record<string, unknown>).price === "number"
  );
}

function processCheckoutItem(rawItem: unknown): void {
  if (isProduct(rawItem)) {
    // ✅ O TypeScript afunilou 'rawItem' com sucesso para 'Product'!
    console.log(
      `Processando produto ${rawItem.id} no valor de R$ ${rawItem.price.toFixed(2)}`,
    );
  } else {
    console.warn("Item inválido recebido no checkout:", rawItem);
  }
}
```

## Funções de Asserção (`asserts val is Tipo`)

Em muitas arquiteturas de software (especialmente em controladores e serviços de
validação), preferimos **lançar uma exceção imediata** se um dado estiver
inválido, em vez de envolver todo o código subsequente em blocos `if/else`.

Para esse padrão, o TypeScript disponibiliza as **Funções de Asserção**
(_Assertion Functions_) utilizando a sintaxe `asserts parametro is Tipo`:

```typescript
type AuthenticatedSession = {
  token: string;
  userId: string;
};

// Se a condição falhar, lança erro. Se passar, afunila a variável no escopo atual!
function assertAuthenticated(
  session: unknown,
): asserts session is AuthenticatedSession {
  if (
    typeof session !== "object" ||
    session === null ||
    !("token" in session) ||
    !("userId" in session)
  ) {
    throw new Error("Acesso negado: Sessão de usuário inválida ou expirada.");
  }
}

function executeProtectedAction(currentSession: unknown): void {
  // 1. Executa a asserção
  assertAuthenticated(currentSession);

  // 2. ✅ A partir deste ponto, 'currentSession' é estritamente 'AuthenticatedSession'!
  console.log(
    `Ação executada com sucesso pelo usuário: ${currentSession.userId}`,
  );
  console.log(`Token ativo: ${currentSession.token}`);
}
```

As funções de asserção limpam o código eliminando aninhamentos desnecessários e
garantindo segurança absoluta para todas as linhas seguintes.

## O Que Vem a Seguir?

Até agora, aprendemos a trabalhar com tipos específicos (`string`, `number`,
`User`), uniões de tipos e técnicas avançadas para afunilá-los com segurança.

No entanto, no desenvolvimento profissional, frequentemente precisamos criar
funções, classes e contratos que operem sobre **qualquer tipo de dado**, mas sem
perder a segurança e a precisão da checagem estática (sem recorrer a `any`).

No **[Capítulo 26: Generics](26-generics.md)**, entraremos no coração da
abstração do TypeScript, aprendendo a criar componentes reutilizáveis, modelar
envelopes de resposta de APIs (`ApiResponse<T>`) e aplicar restrições de tipo
com `extends`.

---

<a href="24-unioes-literais-e-discriminated-unions.md">← Uniões Literais e
Discriminated Unions</a>

<p align="right"><a href="26-generics.md">Próximo: Generics →</a></p>
