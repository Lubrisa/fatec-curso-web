# 22. Interfaces

No [Capítulo 07](07-type-aliases.md), aprendemos a criar apelidos de tipos
utilizando a palavra-chave `type` para reaproveitar estruturas de dados e evitar
repetição. Conforme os projetos escalam e conectamos múltiplos módulos, serviços
e bibliotecas externas, a definição rigorosa de **contratos formais de dados**
se torna indispensável.

Para suprir essa necessidade de forma natural e altamente integrada ao paradigma
de orientação a objetos e tipagem de contratos, o TypeScript oferece a
palavra-chave **`interface`**.

Neste capítulo, você aprenderá a declarar interfaces, estruturar propriedades
opcionais e imutáveis, criar hierarquias de contratos com herança (`extends`) e
compreender os critérios práticos para escolher entre `interface` e `type
alias`.

## O Que É uma `interface`?

Uma **`interface`** é uma construção sintática do TypeScript dedicada a definir
a forma (_shape_) de um objeto. Ela funciona como um **contrato formal**:
qualquer objeto que declare atender àquela interface assume o compromisso de
fornecer as propriedades e métodos nela especificados.

```typescript
// 1. Declaração do contrato de um Usuário
interface User {
  readonly id: string; // Imutável após inicialização
  name: string;
  email: string;
  age?: number; // Propriedade opcional (number | undefined)
}

// 2. Objeto que implementa o contrato:
const userAlice: User = {
  id: "usr_01",
  name: "Alice",
  email: "alice@example.com",
};

// ❌ Erro de compilação: propriedade imutável
// userAlice.id = "usr_99"; // Erro: Cannot assign to 'id' because it is a read-only property.

// ❌ Erro de compilação: violação de contrato (falta propriedade 'name')
// const invalidUser: User = {
//   id: "usr_02",
//   email: "bob@example.com",
// };
```

### Assinaturas de Métodos em Interfaces

Além de dados e propriedades, interfaces podem descrever o comportamento de
funções e métodos pertencentes a um objeto:

```typescript
interface Logger {
  log(message: string): void;
  formatTimestamp?(date: Date): string; // Método opcional
}

const consoleLogger: Logger = {
  log(message: string) {
    console.log(`[LOG]: ${message}`);
  },
};

consoleLogger.log("Serviço de autenticação iniciado.");
```

## Extensão de Contratos com `extends`

Uma das maiores forças das interfaces é a capacidade de reutilizar e
especializar contratos existentes através da palavra-chave **`extends`**. Isso
permite criar estruturas hierárquicas e incrementais sem duplicar código:

```typescript
// Interface base de produto no e-commerce
interface Product {
  id: string;
  title: string;
  price: number;
}

// Interface especializada para cursos digitais
interface DigitalCourse extends Product {
  instructor: string;
  durationHours: number;
  downloadUrl: string;
}

// O objeto 'webCourse' deve fornecer todos os campos de Product + DigitalCourse
const webCourse: DigitalCourse = {
  id: "crs_web_01",
  title: "Desenvolvimento Web com TypeScript",
  price: 0,
  instructor: "FATEC",
  durationHours: 80,
  downloadUrl: "https://fatec.sp.gov.br/cursos/web",
};
```

### Múltipla Herança de Interfaces

No TypeScript, uma interface pode estender **duas ou mais interfaces**
simultaneamente, combinando múltiplos contratos menores em uma estrutura
completa:

```typescript
interface Identifiable {
  id: string;
}

interface Auditable {
  createdAt: Date;
  updatedAt: Date;
}

// Compondo um contrato completo a partir de interfaces modulares:
interface CustomerOrder extends Identifiable, Auditable {
  totalAmount: number;
  itemsCount: number;
}

const currentOrder: CustomerOrder = {
  id: "ord_1024",
  createdAt: new Date("2026-09-01"),
  updatedAt: new Date("2026-09-06"),
  totalAmount: 350.5,
  itemsCount: 3,
};
```

## Interfaces vs. Type Aliases: Qual Devo Usar?

Tanto `interface` quanto `type` podem ser utilizados para modelar objetos e
estruturas de dados com tipagem estática:

```typescript
// Modelagem com Type Alias:
type UserType = {
  id: string;
  name: string;
};

// Modelagem com Interface:
interface UserInterface {
  id: string;
  name: string;
}
```

Embora ambas alcancem o mesmo objetivo para a maioria dos objetos do dia a dia,
existem diferenças conceituais e de recursos entre elas:

### Tabela Comparativa

| Recurso / Capacidade                  | `interface`                                       | `type` (Type Alias)                             |
| :------------------------------------ | :------------------------------------------------ | :---------------------------------------------- |
| **Modelagem de Objetos e Métodos**    | Sim (`interface User { ... }`)                    | Sim (`type User = { ... }`)                     |
| **Extensão / Composição**             | Nativa e declarativa via `extends`                | Via Interseção (`&`)                            |
| **Tipos Primitivos e Apelidos**       | ❌ Não permitido                                  | ✅ Sim (`type ID = string \| number`)           |
| **Tipos de União (Unions `\|`)**      | ❌ Não permitido                                  | ✅ Sim (`type Status = "open" \| "closed"`)     |
| **Tuplas**                            | ❌ Não nativo                                     | ✅ Sim (`type Coord = [number, number]`)        |
| **Mesclagem (_Declaration Merging_)** | ✅ Sim (duas interfaces com mesmo nome se fundem) | ❌ Não (gera erro de identificador duplicado)   |
| **Clareza de Mensagens de Erro**      | Excelente (o TypeScript sempre exibe o nome)      | Tipos complexos com interseção podem ser longos |

### 💡 Guia de Decisão Prática

Para manter um padrão consistente em seus projetos:

1. **Use `interface` por padrão para modelar entidades de negócio, DTOs, objetos
   e contratos de módulos/APIs**. A sintaxe com `extends` é mais legível e a
   performance do compilador é ligeiramente superior para contratos com nome.
2. **Use `type` para Uniões (`|`), Interseções (`&`), Tipos Primitivos, Tuplas,
   Tipos Utilitários e Funções Isoladas**.

<details>
<summary>🔍 <b>Aprofundamento: Declaration Merging (Mesclagem de Declarações)</b></summary>

Um comportamento único das `interfaces` é o **_Declaration Merging_**. Se você
declarar duas ou mais interfaces com exatamente o mesmo nome no mesmo escopo, o
compilador do TypeScript **mescla automaticamente** todas as propriedades em um
único contrato:

```typescript
interface CartItem {
  id: string;
  name: string;
  price: number;
}

// Em outra parte do código ou arquivo:
interface CartItem {
  quantity: number; // Propriedade mesclada automaticamente!
}

// O tipo final CartItem exige todos os 4 campos:
const item: CartItem = {
  id: "prod_01",
  name: "Mouse Sem Fio",
  price: 120,
  quantity: 1,
};
```

#### Aplicação Real: Estendendo Tipos Globais e Bibliotecas

Esse recurso é fundamental no ecossistema Web para **estender interfaces nativas
do navegador ou de bibliotecas externas** sem alterar o código-fonte original
delas:

```typescript
// Adicionando uma propriedade personalizada ao objeto global Window:
interface Window {
  currentAppEnvironment?: "development" | "production";
}

// Válido em qualquer arquivo TypeScript do projeto:
window.currentAppEnvironment = "development";
```

Como o `type` gera um erro explícito de identificador duplicado (`Duplicate
identifier 'CartItem'`), ele não permite mesclagem acidental, garantindo que a
definição original permaneça imutável.

</details>

## O Que Vem a Seguir?

Agora que você domina a criação de contratos com `interface` e a composição de
hierarquias com `extends`, surge uma pergunta crucial: como o compilador do
TypeScript decide se um objeto qualquer é compatível com uma interface?

No **[Capítulo 23: Tipagem Estrutural e Duck
Typing](23-tipagem-estrutural-e-duck-typing.md)**, exploraremos o conceito mais
fascinante do sistema de tipos do TypeScript — a **Tipagem Estrutural** —,
compreendendo por que objetos que nunca declararam uma interface podem ser
aceitos com total segurança em tempo de compilação.

---

<a href="21-colecoes-set-e-map.md">← Coleções Nativas: Set e Map</a>

<p align="right"><a href="23-tipagem-estrutural-e-duck-typing.md">Próximo: Tipagem Estrutural e Duck Typing →</a></p>
