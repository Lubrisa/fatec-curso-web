# 27. Tipos Utilitários

No [Capítulo 26](26-generics.md), aprendemos como os _Generics_ nos permitem
construir estruturas e funções flexíveis que aceitam tipos como parâmetros.

No desenvolvimento de aplicações Web reais, uma entidade central de negócio
(como `User`, `Product` ou `Order`) quase nunca é utilizada em um único formato.
Precisamos de variações dessa mesma estrutura para diferentes etapas do ciclo de
vida dos dados:

- **Criação de registro:** não deve conter `id` ou `createdAt` (gerados pelo
  banco).
- **Atualização parcial (`PATCH`):** todos os campos devem ser opcionais.
- **Visualização pública:** campos sensíveis (como `passwordHash`) devem ser
  ocultados.
- **Configurações imutáveis:** todos os campos devem ser somente leitura
  (`readonly`).

Se criássemos uma interface separada manualmente para cada uma dessas
necessidades, violaríamos o princípio **DRY (_Don't Repeat Yourself_)**:
qualquer alteração no modelo principal exigiria atualizar manualmente dezenas de
interfaces duplicadas.

Para resolver essa dor, o TypeScript oferece os **_Utility Types_ (Tipos
Utilitários)**: ferramentas genéricas nativas que transformam e derivam novos
contratos a partir de tipos existentes.

Neste capítulo, você dominará os principais tipos utilitários do TypeScript,
aprenderá a compô-los para construir DTOs profissionais e descobrirá como eles
funcionam internamente.

## A Entidade Base de Exemplo

Para demonstrar todos os utilitários de forma prática, utilizaremos o contrato
de um usuário de e-commerce como referência:

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "customer" | "seller";
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Utilitários de Mutabilidade e Opcionalidade

### 1. `Partial<T>`: Tornando Todas as Propriedades Opcionais

O utilitário **`Partial<T>`** recebe um tipo `T` e retorna uma nova estrutura
onde **todas as propriedades se tornam opcionais (`?`)**.

É o padrão da indústria para operações de **atualização parcial** (como métodos
HTTP `PATCH` ou formulários de edição):

```typescript
// Todos os campos de User se tornam opcionais:
type UpdateUserDto = Partial<User>;

function updateUser(userId: string, changes: UpdateUserDto): void {
  console.log(`Atualizando usuário ${userId} com os campos:`, changes);
}

// ✅ Válido: podemos passar apenas o que mudou!
updateUser("usr_01", { name: "Novo Nome" });
updateUser("usr_01", { email: "novo@email.com", role: "admin" });
```

### 2. `Required<T>`: Exigindo Todas as Propriedades

O utilitário **`Required<T>`** faz o inverso de `Partial`: ele remove o
modificador opcional (`?`) de todas as propriedades, tornando-as **estritamente
obrigatórias**.

```typescript
type FormState = {
  name?: string;
  email?: string;
  acceptedTerms?: boolean;
};

// Exige que TODOS os campos estejam preenchidos antes de salvar:
type CompletedFormState = Required<FormState>;

const submittedForm: CompletedFormState = {
  name: "Carlos",
  email: "carlos@email.com",
  acceptedTerms: true, // ❌ Se faltar qualquer campo, o compilador acusa erro!
};
```

### 3. `Readonly<T>`: Congelando Propriedades contra Mutação

O utilitário **`Readonly<T>`** adiciona o modificador `readonly` a todas as
propriedades de `T`, impedindo qualquer reatribuição após a criação do objeto:

```typescript
type AppConfig = {
  apiUrl: string;
  maxRetries: number;
};

const config: Readonly<AppConfig> = {
  apiUrl: "https://api.fatec.sp.gov.br/v1",
  maxRetries: 3,
};

// ❌ ERRO DE COMPILAÇÃO:
// config.maxRetries = 5; // Erro: Cannot assign to 'maxRetries' because it is a read-only property.
```

## Utilitários de Seleção e Exclusão de Chaves

### 1. `Pick<T, K>`: Selecionando um Subconjunto de Propriedades

O utilitário **`Pick<T, K>`** constrói um novo tipo selecionando **apenas as
propriedades especificadas em `K`** a partir de `T`:

```typescript
// Selecionando apenas 'name' e 'email' para um resumo público:
type UserSummaryDto = Pick<User, "name" | "email">;

const summary: UserSummaryDto = {
  name: "Mariana Costa",
  email: "mariana@empresa.com",
};
```

### 2. `Omit<T, K>`: Removendo Propriedades Indesejadas

O utilitário **`Omit<T, K>`** constrói um novo tipo contendo todas as
propriedades de `T`, **exceto aquelas listadas em `K`**.

É perfeito para criar DTOs de cadastro ou respostas que não devem expor dados
sensíveis:

```typescript
// Criando o DTO de inserção (sem campos gerados pelo banco e sem senha exposta):
type CreateUserDto = Omit<
  User,
  "id" | "passwordHash" | "createdAt" | "updatedAt"
>;

const newUser: CreateUserDto = {
  name: "Fernando Silva",
  email: "fernando@empresa.com",
  role: "customer",
};
```

> **💡 Regra de Escolha entre `Pick` e `Omit`:**
>
> - Use **`Pick`** quando você precisar de **poucas propriedades** de uma
>   entidade grande.
> - Use **`Omit`** quando você precisar da **maioria das propriedades**,
>   descartando apenas 1 ou 2 campos específicos.

## Utilitário de Mapeamento: `Record<K, V>`

O utilitário **`Record<K, V>`** é utilizado para modelar dicionários e mapas de
dados onde as chaves pertencem ao tipo `K` e os valores pertencem ao tipo `V`:

```typescript
type UserRole = "admin" | "customer" | "seller";

type Permission = {
  canRead: boolean;
  canWrite: boolean;
  canDelete: boolean;
};

// Dicionário mapeando cada UserRole para suas respectivas permissões:
const rolePermissions: Record<UserRole, Permission> = {
  admin: { canRead: true, canWrite: true, canDelete: true },
  seller: { canRead: true, canWrite: true, canDelete: false },
  customer: { canRead: true, canWrite: false, canDelete: false },
};

// ❌ Se faltar qualquer role da união, o TypeScript acusa erro de compilação!
```

## Utilitários de Extração de Funções: `ReturnType<T>` e `Parameters<T>`

Em muitas ocasiões, queremos tipar variáveis a partir de funções utilitárias ou
bibliotecas existentes sem precisar reescrever suas assinaturas manualmente:

```typescript
function buildUserSession(userId: string, ipAddress: string) {
  return {
    sessionId: `sess_${Date.now()}`,
    userId,
    ipAddress,
    createdAt: new Date(),
  };
}

// 1. Extrai o tipo retornado pela função:
type UserSession = ReturnType<typeof buildUserSession>;
// Tipo resultante: { sessionId: string; userId: string; ipAddress: string; createdAt: Date; }

// 2. Extrai os parâmetros da função em formato de Tupla:
type BuildSessionParams = Parameters<typeof buildUserSession>;
// Tipo resultante: [userId: string, ipAddress: string]
```

## Compondo Múltiplos Tipos Utilitários

Como todos os tipos utilitários recebem e retornam tipos, você pode
**combiná-los livremente** em uma única linha para modelar regras complexas:

```typescript
// DTO para atualizar produto:
// 1. Removemos 'id' e 'createdAt' (campos imutáveis)
// 2. Tornamos todo o restante opcional (para permitir updates parciais)
type UpdateUserFields = Partial<Omit<User, "id" | "createdAt">>;

const payload: UpdateUserFields = {
  name: "Nome Atualizado",
  // Todos os outros campos são válidos e opcionais!
};
```

<details>
<summary>🔍 <b>Aprofundamento: Como os Tipos Utilitários Funcionam (O Operador `keyof` e Mapped Types)</b></summary>

Você já se perguntou como o TypeScript constrói utilitários como `Partial<T>`,
`Readonly<T>` ou `Pick<T, K>` internamente?

A mágica acontece combinando **_Generics_**, o operador **`keyof`** e **_Mapped
Types_** (Tipos Mapeados).

### 1. O Operador `keyof`

O operador **`keyof`** extrai todas as chaves públicas de um tipo e as une em um
**Tipo Literal de União**:

```typescript
type UserKeys = keyof User;
// Resultado: "id" | "name" | "email" | "role" | "passwordHash" | "createdAt" | "updatedAt"
```

### 2. Mapped Types (Iterando sobre Chaves)

Assim como usamos um laço `for..in` para percorrer propriedades de um objeto em
JavaScript, o TypeScript permite iterar sobre os tipos das chaves usando a
sintaxe `[K in keyof T]`:

```typescript
// Implementação exata do Partial<T> nativo:
type CustomPartial<T> = {
  [K in keyof T]?: T[K]; // Para cada chave K de T, torne-a opcional (?) e preserve o tipo original T[K]
};

// Implementação exata do Readonly<T> nativo:
type CustomReadonly<T> = {
  readonly [K in keyof T]: T[K]; // Adiciona 'readonly' em cada chave de T
};

// Implementação do Pick<T, K>:
type CustomPick<T, K extends keyof T> = {
  [P in K]: T[P]; // Itera apenas sobre o subconjunto de chaves K
};
```

Compreender que os tipos utilitários são apenas construções genéricas elegantes
desmistifica o compilador e nos mostra o poder expressivo do sistema de tipos do
TypeScript!

</details>

## O Que Vem a Seguir?

Com este capítulo, concluímos com êxito o **Bloco 4: Tipagem Avançada &
Contratos**. Ao longo deste bloco, você dominou:

- Definição de contratos com `interface` e sua comparação com `type alias`.
- O paradigma revolucionário da **Tipagem Estrutural (_Duck Typing_)** e a
  checagem de propriedades excessivas.
- **Uniões Literais**, a preferência de `as const` sobre Enums e o poder de
  **Uniões Discriminadas**.
- **Afunilamento de Tipos (_Type Narrowing_)** com validadores nativos,
  predicados de tipo (`val is Tipo`) e funções de asserção.
- A flexibilidade de **_Generics_** e a derivação de contratos com **Tipos
  Utilitários**.

No próximo bloco, entraremos na reta final do nosso primeiro módulo: **Bloco 5:
Módulos, Orientação a Objetos & Assincronismo**.

Iniciaremos pelo **[Capítulo 28: Sistema de
Módulos](28-sistema-de-modulos.md)**, onde aprenderemos como organizar arquivos,
gerenciar importações e exportações nomeadas vs. padrão, utilizar `import type`
e configurar `"type": "module"` no `package.json` para projetos profissionais na
Web.

---

<a href="26-generics.md">← Generics</a>

<p align="right"><a href="28-sistema-de-modulos.md">Próximo: Sistema de Módulos →</a></p>
