# 03. Objetos, Arrays e Inferência de Tipos

Nos capítulos anteriores, aprendemos a validar valores primitivos isolados (como
strings, números e datas) e compreendemos o papel do Zod na porta de entrada da
aplicação.

No entanto, no desenvolvimento web real, os dados trafegam organizados em
estruturas compostas: usuários com endereços aninhados, listas de produtos no
carrinho de compras, payloads de requisições e respostas de bancos de dados.

Tradicionalmente, os desenvolvedores enfrentavam um dilema cansativo: escrever
uma `interface` no TypeScript para ter tipagem estática e, simultaneamente,
escrever uma rotina de validação para checar os mesmos campos em runtime. Essa
duplicação frequentemente causava dessincronização e bugs silenciosos.

Neste capítulo, você aprenderá a modelar estruturas completas com **Schemas de
Objetos** e **Arrays**, dominará os modificadores de propriedades e descobrirá o
recurso mais celebrado do Zod: a **inferência estática de tipos com `z.infer`**.

## Schemas de Objetos (`z.object`)

O método `z.object()` permite declarar a forma e os tipos esperados de cada
propriedade de um objeto JavaScript:

```typescript
import { z } from "zod";

const UserProfileSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(3).max(100),
  email: z.email(),
  isActive: z.boolean(),
  // Objetos aninhados
  address: z.object({
    street: z.string(),
    city: z.string(),
    zipCode: z.string().length(8),
  }),
});
```

Ao validar um objeto com `.parse()` ou `.safeParse()`, o Zod valida
recursivamente cada uma das propriedades e objetos aninhados.

## O Santo Graal: Inferência Estática com `z.infer`

No TypeScript tradicional, você precisaria criar uma interface manualmente para
espelhar o schema:

```typescript
// ❌ Duplicação manual: se você alterar o schema, precisa lembrar de alterar a interface!
interface UserProfile {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  address: {
    street: string;
    city: string;
    zipCode: string;
  };
}
```

Com o Zod, o schema de validação em runtime torna-se a **Única Fonte da Verdade
(_Single Source of Truth_)**. Você extrai o tipo TypeScript correspondente com
apenas **uma linha de código** usando o utilitário **`z.infer`**:

```typescript
import { z } from "zod";

const UserProfileSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(3),
  email: z.email(),
  isActive: z.boolean(),
});

// ✅ O tipo TypeScript é gerado automaticamente pelo compilador!
type UserProfile = z.infer<typeof UserProfileSchema>;
```

Ao passar o mouse sobre `UserProfile` no seu editor, você verá exatamente o tipo
inferido:

```typescript
type UserProfile = {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
};
```

Se você alterar qualquer regra no schema (por exemplo, adicionar um novo campo),
o tipo `UserProfile` é atualizado instantaneamente em todo o projeto, sem nenhum
esforço manual.

## Modificadores de Propriedades

Nem todos os campos de uma entidade são obrigatórios ou possuem valores fixos. O
Zod fornece modificadores para flexibilizar a presença de propriedades:

### 1. Propriedades Opcionais (`.optional()`)

Indica que a chave pode ser omitida ou conter o valor `undefined` (equivalente
ao `campo?: string` do TypeScript):

```typescript
const ContactSchema = z.object({
  name: z.string(),
  phone: z.string().optional(), // string | undefined
});

ContactSchema.parse({ name: "Alice" }); // ✅ Válido
ContactSchema.parse({ name: "Alice", phone: "11999998888" }); // ✅ Válido
```

### 2. Propriedades Anuláveis (`.nullable()`)

Indica que a propriedade aceita o valor explícito `null` (equivalente a `campo:
string | null`):

```typescript
const PostSchema = z.object({
  title: z.string(),
  publishedAt: z.date().nullable(), // Date | null
});

PostSchema.parse({ title: "Introdução ao Zod", publishedAt: null }); // ✅ Válido
```

### 3. Propriedades Nullish (`.nullish()`)

É um atalho conveniente que combina `.optional()` e `.nullable()`, permitindo
tanto `null` quanto `undefined`:

```typescript
const ProfileSchema = z.object({
  nickname: z.string().nullish(), // string | null | undefined
});
```

### 4. Valores Padrão (`.default()`)

Se a propriedade for omitida ou chegar como `undefined`, o Zod injeta
automaticamente o valor padrão configurado durante a validação:

```typescript
const SettingsSchema = z.object({
  theme: z.enum(["light", "dark"]).default("light"),
  notificationsEnabled: z.boolean().default(true),
});

const config = SettingsSchema.parse({});
console.log(config);
// ✅ Saída: { theme: 'light', notificationsEnabled: true }
```

## Coleções e Listas com `z.array`

Para validar listas de elementos homogêneos, utilizamos o `z.array()`:

```typescript
import { z } from "zod";

// Array de strings primitivas
const TagsSchema = z.array(z.string());

// Array com restrições de tamanho
const NonEmptyTagsSchema = z
  .array(z.string())
  .min(1, "Informe ao menos uma tag.")
  .max(5, "O limite máximo é de 5 tags.");

const ProductItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number().positive(),
});

const ShoppingCartSchema = z.object({
  items: z
    // Array de objetos complexos
    .array(ProductItemSchema)
    .nonempty("O carrinho não pode estar vazio."),
});

type ShoppingCart = z.infer<typeof ShoppingCartSchema>;
```

## Manipulação e Derivação de Schemas de Objetos

Assim como no TypeScript usamos `extends`, `Pick` e `Omit` para reaproveitar
contratos de tipos, o Zod oferece métodos equivalentes para derivar schemas sem
duplicar código:

```typescript
import { z } from "zod";

const BaseUserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.email(),
  role: z.string(),
  createdAt: z.date(),
});

// 1. .extend(): Adiciona ou sobrescreve propriedades (equivalente a extends/interface)
const AdminUserSchema = BaseUserSchema.extend({
  permissions: z.array(z.string()),
});

// 2. .pick(): Seleciona apenas propriedades específicas (equivalente a Pick<T, K>)
const PublicProfileSchema = BaseUserSchema.pick({
  name: true,
  role: true,
});

// 3. .omit(): Remove propriedades específicas (equivalente a Omit<T, K>)
const CreateUserDtoSchema = BaseUserSchema.omit({
  id: true,
  createdAt: true,
});

// 4. .partial(): Torna todas as propriedades opcionais (equivalente a Partial<T>)
const UpdateUserDtoSchema = CreateUserDtoSchema.partial();
```

## Lidando com Chaves Desconhecidas

Quando um cliente envia um objeto com campos que não foram declarados no schema,
o Zod adota três comportamentos possíveis:

1. **`strip` (Padrão Recomendado):** Remove silenciosamente quaisquer
   propriedades não mapeadas no schema. É um excelente mecanismo de segurança
   que impede a injeção de campos indevidos em requisições.
2. **`.passthrough()`:** Valida os campos conhecidos e mantém os campos extras
   intactos no resultado.
3. **`.strict()`:** Lança um erro de validação caso o objeto contenha qualquer
   chave não reconhecida.

```typescript
const StrictUserSchema = z
  .object({
    name: z.string(),
  })
  .strict();

// ❌ Lança ZodError por conter a chave extra 'isAdmin'
StrictUserSchema.parse({ name: "Carlos", isAdmin: true });
```

## `z.input` vs. `z.output` (Diferença entre entrada e saída)

Quando usamos modificadores como `.default()`, o tipo do dado que **entra** no
`.parse()` é diferente do tipo do dado que **sai** validado.

O Zod exporta dois tipos utilitários para refletir isso:

- **`z.input<typeof Schema>`:** O tipo dos dados brutos esperados como entrada;
- **`z.output<typeof Schema>` (ou simplesmente `z.infer<typeof Schema>`):** O
  tipo final do dado limpo, transformado e com fallbacks aplicados.

```typescript
const FilterSchema = z.object({
  page: z.coerce.number().default(1),
});

type FilterInput = z.input<typeof FilterSchema>;
// type FilterInput = { page?: number | string | undefined }

type FilterOutput = z.infer<typeof FilterSchema>;
// type FilterOutput = { page: number }
```

## O Que Vem a Seguir?

Neste capítulo, aprendemos a estruturar dados complexos com schemas de objetos e
arrays, manipular propriedades e extrair tipos automáticos com `z.infer`.

No próximo capítulo, exploraremos a modelagem de tipos literais, enums e o
poderoso conceito de **Discriminated Unions (Uniões Discriminadas)** no Zod.

---

<a href="02-schemas-primitivos-validacoes-e-coercao.md">← Schemas Primitivos,
Validações e Coerção</a>

<p align="right"><a href="04-unions-enums-e-discriminated-unions.md">Próximo: Unions, Enums e Discriminated Unions →</a></p>
