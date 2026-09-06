# 26. Generics

Ao longo deste módulo, aprendemos a definir contratos estritos para dados
específicos: usuários, produtos, pedidos e respostas de APIs. No entanto, no
desenvolvimento de software profissional, frequentemente precisamos construir
**funções, coleções e utilitários reutilizáveis** capazes de operar sobre
múltiplos tipos de dados diferentes.

Se tentarmos resolver essa necessidade duplicando código para cada tipo ou
apelando para o tipo `any`, caímos em armadilhas de manutenção ou destruímos a
segurança de compilação.

Para resolver esse dilema de forma elegante e segura, o TypeScript oferece os
**_Generics_** (Tipos Genéricos).

Neste capítulo, você aprenderá o que são generics, como utilizá-los em funções e
interfaces, como modelar envelopes reais de APIs Web (`ApiResponse<T>`) e como
aplicar restrições inteligentes com a palavra-chave `extends`.

## A Falsa Escolha: Duplicação de Código vs. `any`

Imagine que você precisa criar uma função utilitária simples que recebe um item
qualquer e o envelopa dentro de um array:

### 1. Tentativa 1: Duplicação por Tipo (Inviável)

```typescript
function wrapString(value: string): string[] {
  return [value];
}

function wrapNumber(value: number): number[] {
  return [value];
}

// ❌ Explosão de código: teríamos que criar uma função para cada tipo existente!
```

### 2. Tentativa 2: Uso de `any` (Perda Total de Tipagem)

```typescript
function wrapAny(value: any): any[] {
  return [value];
}

const result = wrapAny("Fatec Web");
// ❌ PROBLEMA: 'result' tem o tipo 'any[]'.
// O TypeScript perdeu o rastreamento de que o array contém strings!
// result[0].metodoInexistente(); // Compila sem erro e quebra em produção!
```

Com `any`, perdemos o autocompletar do editor e a garantia de tipos.

## O Que São Generics? (Parâmetros de Tipo)

A melhor forma de entender os _Generics_ é fazer uma analogia direta com as
funções que você já conhece:

- **Funções tradicionais** recebem **valores como argumentos** em tempo de
  execução e os associam a parâmetros (`(value: string)`).
- **Generics** permitem que funções, tipos e interfaces recebam **tipos como
  argumentos** em tempo de compilação (`<T>`).

O identificador **`T`** funciona como uma "variável de tipo" temporária (um
_placeholder_):

```typescript
// Declaramos a variável de tipo <T> antes dos parâmetros da função:
function wrapInArray<T>(value: T): T[] {
  return [value];
}

// 1. Passando um texto: o TypeScript deduz automaticamente que T é 'string'
const stringArray = wrapInArray("Fatec Web"); // Tipo inferido: string[]

// 2. Passando um número: o TypeScript deduz automaticamente que T é 'number'
const numberArray = wrapInArray(42); // Tipo inferido: number[]

// 3. Passando um objeto:
const userArray = wrapInArray({ id: "usr_1", name: "Lucas" });
// Tipo inferido: { id: string; name: string }[]
```

### Inferência Automática de Argumentos de Tipo

Na maioria das vezes, você não precisa escrever `wrapInArray<string>("Fatec")`
explicitamente. O compilador do TypeScript analisa o argumento passado e
**infere o tipo `T` automaticamente**.

## Interfaces e Type Aliases Genéricos

O verdadeiro poder dos _Generics_ na Web brilha ao modelar estruturas de dados e
respostas assíncronas de servidores.

### Modelando Envelopes de APIs Web (`ApiResponse<T>`)

Em aplicações reais, quase todas as rotas de uma API HTTP retornam um formato
padrão de resposta (_envelope_), variando apenas o dado central (`data`):

```typescript
// Interface genérica que aceita qualquer tipo T para a propriedade 'data':
interface ApiResponse<T> {
  data: T;
  statusCode: number;
  timestamp: number;
  message?: string;
}

// Entidades de domínio da nossa aplicação:
type Product = { id: string; title: string; price: number };
type UserProfile = { id: string; name: string; email: string };

// 1. Resposta de busca de um produto:
const productResponse: ApiResponse<Product> = {
  statusCode: 200,
  timestamp: Date.now(),
  data: {
    id: "prod_101",
    title: "Monitor Ultrawide",
    price: 1800.0,
  },
};

// 2. Resposta de perfil de usuário:
const userResponse: ApiResponse<UserProfile> = {
  statusCode: 200,
  timestamp: Date.now(),
  data: {
    id: "usr_55",
    name: "Ana Beatriz",
    email: "ana@empresa.com",
  },
};
```

Com apenas uma única interface genérica `ApiResponse<T>`, conseguimos tipar com
100% de precisão qualquer endpoint da nossa aplicação!

### Listas Paginadas (`PaginatedResult<T>`)

Outro padrão indispensável em qualquer painel administrativo ou catálogo Web:

```typescript
interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
}

const catalogPage: PaginatedResult<Product> = {
  items: [
    { id: "p1", title: "Teclado", price: 150 },
    { id: "p2", title: "Mouse", price: 80 },
  ],
  totalCount: 50,
  page: 1,
  pageSize: 2,
  hasNextPage: true,
};
```

## Múltiplos Parâmetros de Tipo (`<T, U>`)

Uma função ou interface pode receber mais de um tipo genérico simultaneamente,
bastando separá-los por vírgula dentro dos colchetes angulares `<>`:

```typescript
// Função que junta dois valores de tipos quaisquer em uma Tupla tipada:
function createPair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

const pair = createPair("ChavePix", 1250.5); // Tipo inferido: [string, number]
const userStatusPair = createPair({ id: "U1" }, true); // Tipo inferido: [{ id: string }, boolean]
```

## Restrições em Generics com `extends` (_Generic Constraints_)

Por padrão, quando declaramos `<T>`, `T` pode ser **absolutamente qualquer
coisa** (`number`, `string`, `null`, `undefined`, objeto, função).

No entanto, há cenários onde precisamos garantir que o tipo `T` possua **ao
menos determinadas propriedades**. Para impor essa regra, utilizamos a cláusula
**`T extends Contrato`**:

```typescript
// Contrato mínimo: precisa possuir uma propriedade 'id' do tipo string
interface Identifiable {
  id: string;
}

// 'T' DEVE satisfazer o contrato 'Identifiable'
function printEntityId<T extends Identifiable>(entity: T): void {
  console.log(`Identificador da entidade: ${entity.id}`);
}

// ✅ Válido: ambos possuem 'id: string'
printEntityId({ id: "usr_99", name: "Mariana" });
printEntityId({ id: "prod_01", price: 99.9, stock: 10 });

// ❌ ERRO DE COMPILAÇÃO: não possui 'id'
// printEntityId({ name: "Objeto Sem ID" });
// Erro: Property 'id' is missing in type '{ name: string; }' but required in type 'Identifiable'.
```

## Valores Padrão para Generics (_Default Type Parameters_)

Assim como funções comuns podem ter valores padrão para parâmetros (`function
sayHello(name = "Mundo")`), tipos genéricos podem especificar um tipo padrão
caso o consumidor não informe nenhum:

```typescript
// Se nenhum tipo for informado, T assume 'string' por padrão:
interface ApiResponseWithDefault<T = string> {
  data: T;
  success: boolean;
}

// 1. Usa o tipo padrão (string):
const simpleResponse: ApiResponseWithDefault = {
  success: true,
  data: "Operação executada com sucesso!",
};

// 2. Sobrescreve com um tipo customizado:
const complexResponse: ApiResponseWithDefault<{ token: string }> = {
  success: true,
  data: { token: "jwt_fatec_secret" },
};
```

> **Convenções de Nomenclatura para Generics:**
>
> Na comunidade TypeScript, é padrão utilizar letras maiúsculas únicas como
> marcadores de tipo:
>
> - **`T`** (_Type_): O tipo genérico padrão.
> - **`U`**, **`V`**: Segundo e terceiro tipos genéricos em uma lista.
> - **`K`** (_Key_): Tipos que representam chaves de objetos (usado com
>   `keyof`).
> - **`V`** (_Value_): Tipos que representam valores em estruturas de
>   dicionário/mapa.
> - **`E`** (_Element_): Tipos que representam elementos de arrays ou coleções.
>
> Em contratos com múltiplos parâmetros, também é comum adotar **nomes
> semânticos com prefixo `T`** (ex.: `TData`, `TError`, `TResult`).

## O Que Vem a Seguir?

Com o domínio de _Generics_, você agora possui todas as ferramentas para criar
abstrações escaláveis e reutilizáveis sem perder a segurança dos tipos
estáticos.

Para fechar com chave de ouro o **Bloco 4**, aprenderemos no **[Capítulo 27:
Tipos Utilitários](27-tipos-utilitarios.md)** como o próprio TypeScript utiliza
_Generics_ internamente para disponibilizar ferramentas nativas poderosíssimas
de transformação de contratos, como `Partial<T>`, `Required<T>`, `Pick<T, K>`,
`Omit<T, K>`, `Record<K, V>` e `Readonly<T>`.

---

<a href="25-type-narrowing-e-type-guards.md">← Type Narrowing e Type Guards</a>

<p align="right"><a href="27-tipos-utilitarios.md">Próximo: Tipos Utilitários →</a></p>
