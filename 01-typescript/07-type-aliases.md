# 7. Type Aliases

Nos capítulos anteriores, aprendemos a tipar dados primitivos e a estabelecer
contratos estruturais para objetos literais diretamente na declaração de cada
variável.

No entanto, conforme nossas aplicações crescem e começamos a manipular dados
mais realistas (como usuários, produtos e pedidos de um e-commerce), definir a
forma de cada objeto diretamente no local onde ele é criado gera repetição,
dificuldade de manutenção e poluição visual.

Neste capítulo, vamos entender a dor das anotações estruturais repetitivas e
aprender a utilizar os **Type Aliases** (`type`) para criar nomes semânticos,
reutilizáveis e limpos para os contratos de tipos do nosso sistema.

## A Dor: A Poluição das Anotações Inline Repetitivas

Imagine um sistema universitário que precisa lidar com informações de alunos em
diferentes variáveis ao longo do código:

```typescript
// ❌ Anotação estrutural repetida manualmente em cada variável:
const activeStudent: {
  readonly id: number;
  name: string;
  email: string;
  course: string;
  semester: number;
} = {
  id: 101,
  name: "Luigi",
  email: "luigi@fatec.sp.gov.br",
  course: "Desenvolvimento de Software",
  semester: 4,
};

const pendingStudent: {
  readonly id: number;
  name: string;
  email: string;
  course: string;
  semester: number;
} = {
  id: 102,
  name: "Mariana",
  email: "mariana@fatec.sp.gov.br",
  course: "Desenvolvimento de Software",
  semester: 1,
};
```

Observe os problemas evidentes dessa abordagem:

1. **Duplicação de Código (Violação do Princípio DRY):** O mesmo contrato com 5
   propriedades foi redigitado linha por linha para cada variável criada;
2. **Fragilidade na Manutenção:** Se a instituição decidir adicionar um campo
   novo (como `registrationNumber: string`), teremos que caçar e alterar todas
   as anotações manuais espalhadas pelo projeto;
3. **Poluição Visual:** A declaração de tipos consome mais espaço e atenção do
   que a própria lógica de negócio.

Como resolvemos isso de forma elegante? Criando um **Type Alias**.

## O Que São Type Aliases?

Um **Type Alias** (ou _Apelido de Tipo_) é uma funcionalidade central do
TypeScript que nos permite dar um **nome significativo e reutilizável** a
qualquer formato de tipo existente.

Para criar um Type Alias, utilizamos a palavra-chave **`type`**:

```typescript
// ✅ Definindo o contrato de tipo uma única vez:
type Student = {
  readonly id: number;
  name: string;
  email: string;
  course: string;
  semester: number;
};
```

Com o tipo `Student` definido, podemos tipar quantas variáveis forem necessárias
com uma sintaxe limpa, expressiva e concisa:

```typescript
const activeStudent: Student = {
  id: 101,
  name: "Luigi",
  email: "luigi@fatec.sp.gov.br",
  course: "Desenvolvimento de Software",
  semester: 4,
};

const pendingStudent: Student = {
  id: 102,
  name: "Mariana",
  email: "mariana@fatec.sp.gov.br",
  course: "Desenvolvimento de Software",
  semester: 1,
};
```

> **Convenção de Nomenclatura (PascalCase):**
>
> Por convenção universal no TypeScript, nomes de tipos sempre utilizam
> **PascalCase** (primeira letra de cada palavra maiúscula, como `Student`,
> `UserProfile`, `PaymentResponse`), enquanto nomes de variáveis e funções usam
> **camelCase** (`activeStudent`, `calculateTotal`).

### Centralização e Segurança na Manutenção

Se o modelo de dados de `Student` precisar evoluir, alteramos apenas a definição
do `type`. O compilador do TypeScript automaticamente propaga a validação para
todas as variáveis que utilizam esse contrato:

```typescript
type Student = {
  readonly id: number;
  name: string;
  email: string;
  course: string;
  semester: number;
  phone?: string; // ✅ Campo opcional adicionado em um único local!
};
```

## Type Aliases Além de Objetos

Embora sejam frequentemente utilizados para modelar estruturas de dados e
objetos, os Type Aliases são extremamente flexíveis e podem ser aplicados a
qualquer tipo do TypeScript:

### 1. Apelidos Semânticos para Primitivos

Podemos criar tipos para documentar a **intenção de negócio** de um valor
primitivo, tornando a leitura do código muito mais expressiva:

```typescript
// Documenta o propósito do dado no domínio do negócio:
type BrazilianCpf = string;
type PixKey = string;
type PriceInCents = number;

const userTaxId: BrazilianCpf = "123.456.789-00";
const orderAmount: PriceInCents = 4990; // R$ 49,90 representado em centavos
```

Tecnicamente, para o compilador do TypeScript, `userTaxId` continua sendo uma
`string` comum e `orderAmount` continua sendo um `number`. Criar esse tipo de
apelido não altera a estrutura dos dados nem adiciona validações automáticas de
formato, mas serve como uma excelente forma de **documentar a intenção e o
significado do código** para a equipe de desenvolvimento.

### 2. Composição de Uniões Simples

Podemos criar apelidos para tipos que aceitam mais de uma forma (Unions):

```typescript
type Identifier = string | number;

let accountId: Identifier = 1042;
accountId = "usr_883921"; // ✅ Válido: aceita tanto string quanto number
```

## Composição de Tipos Aninhados

Em projetos reais, os dados raramente são planos. Um cliente possui um endereço,
um pedido possui itens, e um produto possui categorias.

Type Aliases brilham ao permitir **compor estruturas complexas a partir de
pequenos blocos legíveis**, evitando o pesadelo de anotações aninhadas inline:

```typescript
// 1. Tipo menor e focado:
type Address = {
  street: string;
  city: string;
  state: string;
  zipCode: string;
};

// 2. Tipo composto reutilizando o tipo menor:
type Customer = {
  readonly id: number;
  name: string;
  email: string;
  address: Address; // ✅ Composição limpa e legível
};

const customerProfile: Customer = {
  id: 1,
  name: "Luigi",
  email: "luigi@fatec.sp.gov.br",
  address: {
    street: "Av. Tiradentes, 615",
    city: "São Paulo",
    state: "SP",
    zipCode: "01101-010",
  },
};
```

Essa granularidade torna a modelagem do sistema modular e fácil de reutilizar
tanto no frontend quanto no backend.

## O Que Vem a Seguir?

Agora que dominamos como declarar variáveis, objetos e dar nomes expressivos aos
nossos tipos com Type Aliases, precisamos aprender a manipular esses valores
através de cálculos, lógicas de comparação e transformações.

No próximo capítulo, vamos explorar as **Expressões e Operadores**, aprendendo a
diferença entre igualdade estrita (`===`) e coerção fraca (`==`), além de
operadores modernos da linguagem como o encadeamento opcional (`?.`) e a
coalescência nula (`??`).

---

<a href="06-tipos-por-referencia-e-memoria.md">← Tipos por Referência e
Memória</a>

<p align="right"><a href="08-expressoes-e-operadores.md">Próximo: Expressões e Operadores →</a></p>
