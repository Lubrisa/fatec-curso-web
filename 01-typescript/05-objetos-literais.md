# 5. Objetos Literais

No capítulo anterior, dominamos as regras de declaração com `const` e `let` e
vimos como o TypeScript infere tipos automaticamente para dados primitivos.

No entanto, no desenvolvimento de aplicações reais, as informações quase nunca
andam sozinhas. Um sistema precisa representar entidades completas — como um
estudante com nome, idade e matrícula, ou um produto com título, preço e
estoque.

Neste capítulo, vamos entender o que são **Objetos Literais**, como acessar e
modificar suas propriedades e como definir **contratos de tipos estáticos**
utilizando propriedades opcionais (`?`) e imutáveis (`readonly`).

## O Que São Objetos Literais?

### A Dor: Variáveis Primitivas Desconexas

Imagine que precisamos registrar os dados de três estudantes no nosso sistema.
Se utilizarmos apenas tipos primitivos isolados, o código rapidamente se torna
desorganizado e difícil de manter:

```typescript
// ❌ DADOS DESCONEXOS: Difícil de agrupar e passar para outras partes do sistema
const student1Name: string = "Luigi";
const student1Age: number = 22;
const student1Course: string = "Desenvolvimento Web";

const student2Name: string = "Ana";
const student2Age: number = 20;
const student2Course: string = "Banco de Dados";

const student3Name: string = "Carlos";
const student3Age: number = 21;
const student3Course: string = "Engenharia de Software";
```

Conforme a entidade ganha novos campos (endereço, telefone, notas), gerenciar
essas variáveis soltas se torna inviável.

### A Coesão do Objeto Literal (`{}`)

Um **Objeto Literal** é uma estrutura de dados que agrupa múltiplos pares de
**chave-valor** (_key-value_) sob um único identificador. As chaves são chamadas
de **propriedades** do objeto:

```typescript
// ✅ ESTRUTURA COESA: Todas as informações pertencem à mesma entidade
const studentProfile = {
  name: "Luigi",
  age: 22,
  course: "Desenvolvimento Web",
  isEnrolled: true,
};
```

Agora, o estudante é uma unidade coesa que pode ser manipulada e passada no
código como um único bloco.

### Acessando e Modificando Propriedades

Existem duas formas de acessar e alterar as propriedades de um objeto:

#### 1. Notação de Ponto (`.`)

É a forma mais comum e idiomática no dia a dia:

```typescript
// Leitura de propriedades:
console.log(studentProfile.name); // "Luigi"
console.log(studentProfile.age); // 22

// Modificação de propriedades existentes:
studentProfile.age = 23;
```

#### 2. Notação de Colchetes (`[]`)

Útil quando o nome da propriedade é dinâmico ou vem armazenado em uma variável:

```typescript
const propertyToRead = "course";

// Acessa dinamicamente a propriedade guardada na variável:
console.log(studentProfile[propertyToRead]); // "Desenvolvimento Web"
```

## Modelagem e Tipagem de Objetos no TypeScript

No JavaScript puro, objetos são totalmente livres e maleáveis: você pode
adicionar ou remover propriedades a qualquer momento, sem nenhuma garantia de
consistência.

No TypeScript, definimos **contratos de tipo estáticos** para garantir que um
objeto contenha exatamente a estrutura esperada.

### Tipagem Explícita de Objeto

Podemos declarar a estrutura esperada do objeto diretamente na definição da
variável:

```typescript
// 1. Declarando o formato (contrato estático) que a variável deve seguir:
let courseInstructor: {
  name: string;
  subject: string;
  workloadHours: number;
  isActive: boolean;
};

// ✅ Atribuição válida: todas as propriedades e tipos correspondem ao contrato
courseInstructor = {
  name: "Carlos Eduardo",
  subject: "Estruturas de Dados",
  workloadHours: 80,
  isActive: true,
};

// ❌ Atribuição inválida: o compilador bloqueia propriedades faltantes ou tipos incompatíveis
// courseInstructor = {
//   name: "Carlos Eduardo",
//   subject: "Estruturas de Dados",
//   workloadHours: 80,
//   isActive: "sim", // ❌ Erro: Type 'string' is not assignable to type 'boolean'.
// };
```

### Propriedades Opcionais (`?`)

Nem todas as propriedades de uma entidade precisam existir obrigatoriamente em
todos os momentos. Por exemplo, o telefone de contato ou o link do avatar de um
usuário podem ser opcionais:

```typescript
const registeredUser: {
  id: number;
  email: string;
  phoneNumber?: string; // Propriedade opcional (string | undefined)
} = {
  id: 1,
  email: "usuario@fatec.sp.gov.br",
  // 'phoneNumber' pode ser omitido sem nenhum erro de compilação!
};
```

O símbolo `?` indica que a propriedade pode conter o tipo indicado ou ser
`undefined` (como vimos no [Capítulo 02: Tipos Primitivos e
Especiais](02-tipos-primitivos-e-especiais.md)).

### Propriedades Somente Leitura com `readonly`

Em muitas regras de negócio, certos campos nunca devem ser alterados após a
criação do objeto (como o ID de um registro no banco de dados ou o CPF do
cliente).

Para proteger uma propriedade contra alterações acidentais, usamos o modificador
**`readonly`**:

```typescript
const systemAccount: {
  readonly accountId: number; // Campo imutável
  holderName: string;
  balance: number;
} = {
  accountId: 98765,
  holderName: "Mariana Souza",
  balance: 1500.0,
};

systemAccount.balance += 200.0; // ✅ Permitido: 'balance' é mutável

// systemAccount.accountId = 11111;
// ❌ Erro: Cannot assign to 'accountId' because it is a read-only property.
```

## Resumo da Sintaxe

| Recurso                    | Sintaxe de Exemplo           | Finalidade                               |
| :------------------------- | :--------------------------- | :--------------------------------------- |
| **Objeto Literal**         | `{ name: "Luigi", age: 22 }` | Agrupa propriedades em pares chave-valor |
| **Notação de Ponto**       | `user.name`                  | Acesso e modificação direta              |
| **Notação de Colchetes**   | `user["name"]`               | Acesso dinâmico por chave                |
| **Propriedade Opcional**   | `phone?: string`             | Permite que o campo seja `undefined`     |
| **Propriedade `readonly`** | `readonly id: number`        | Bloqueia reatribuição da propriedade     |

> **Regra de Ouro:**
>
> Use contratos de objetos para documentar e blindar a estrutura dos dados da
> sua aplicação. Utilize `?` para campos opcionais e `readonly` para proteger
> identificadores e dados sensíveis contra mutações acidentais.

## O Que Vem a Seguir?

Agora que dominamos como criar, acessar e tipar objetos literais, surge uma
questão fundamental:

> _"O que acontece por baixo dos panos na memória do computador quando passamos
> um objeto de uma variável para outra?"_

No próximo capítulo, vamos entender a mecânica dos **Tipos por Referência e a
Divisão de Memória (Stack vs. Heap)**, desvendando por que objetos sofrem
mutações compartilhadas e como cloná-los com segurança.

---

<a href="04-variaveis.md">← Variáveis</a>

<p align="right"><a href="06-tipos-por-referencia-e-memoria.md">Próximo: Tipos por Referência e Memória →</a></p>
