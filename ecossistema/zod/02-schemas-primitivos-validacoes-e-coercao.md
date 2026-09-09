# 02. Schemas Primitivos, Validações e Coerção

No capítulo anterior, compreendemos a necessidade fundamental de validar dados
em tempo de execução e vimos como criar schemas primitivos simples com
`z.string()` e `z.number()`.

No entanto, em aplicações reais, apenas saber que um dado é uma `string` ou um
`number` raramente é suficiente:

- Um endereço de e-mail não pode ser qualquer texto aleatório;
- Uma senha precisa ter um comprimento mínimo seguro;
- O preço de um produto não pode ser negativo;
- Parâmetros recebidos de URLs (`?page=2`) ou formulários HTML chegam ao
  JavaScript como texto (`string`), mesmo quando representam números ou datas.

Neste capítulo, você dominará o catálogo de tipos primitivos do **Zod**,
aprenderá a encadear validadores fluentes, personalizará mensagens de erro em
português e descobrirá como utilizar a **coerção automática de tipos**
(`z.coerce`).

## Catálogo de Tipos Primitivos

O Zod oferece schemas equivalentes a todos os tipos primitivos e fundamentais do
JavaScript/TypeScript:

```typescript
import { z } from "zod";

// Tipos primitivos clássicos
const TextSchema = z.string();
const NumberSchema = z.number();
const BooleanSchema = z.boolean();
const BigIntSchema = z.bigint();
const DateSchema = z.date();

// Tipos literais de ausência de valor
const NullSchema = z.null();
const UndefinedSchema = z.undefined();

// Tipos curingas e especiais
const AnySchema = z.any();
const UnknownSchema = z.unknown();
const NeverSchema = z.never();
```

## Validadores Fluentes para Strings

O schema `z.string()` disponibiliza métodos encadeáveis para validação de
comprimento, expressões regulares e sanitização:

```typescript
import { z } from "zod";

// 1. Regras de comprimento
const UsernameSchema = z
  .string()
  .min(3) // Mínimo de 3 caracteres
  .max(20); // Máximo de 20 caracteres

const ExactCodeSchema = z.string().length(6); // Exatamente 6 caracteres

// 2. Expressões regulares e prefixos/sufixos
const AlphaNumericSchema = z.string().regex(/^[A-Z0-9]+$/i); // Apenas caracteres alfanuméricos
const TagSchema = z.string().startsWith("#"); // Começa com #

// 3. Sanitização e normalização de texto
const CleanTextSchema = z
  .string()
  .trim() // Remove espaços em branco nas pontas automaticamente
  .toLowerCase(); // Converte todo o texto para minúsculas
```

## Schemas Especializados de Formato

Para formatos de texto padronizados da Web, o Zod disponibiliza schemas
especializados diretamente a partir do objeto raiz `z`:

```typescript
import { z } from "zod";

// Formatos comuns da Web chamados diretamente no objeto 'z'
const EmailSchema = z.email(); // Validação de formato de e-mail
const WebsiteSchema = z.url(); // URL válida (http/https)
const IdSchema = z.uuidv4(); // UUID v4 válido
const IsoDateSchema = z.datetime(); // String ISO 8601 (ex: "2026-09-08T20:00:00Z")
const IpAddressSchema = z.ip(); // Endereço IP (v4 ou v6)
const TokenSchema = z.jwt(); // Formato de JWT estruturado
```

```typescript
console.log(EmailSchema.safeParse("aluno@fatec.sp.gov.br").success); // true
console.log(EmailSchema.safeParse("nao-e-um-email").success); // false
```

## Validadores Fluentes para Números

Assim como para strings, o `z.number()` oferece métodos encadeáveis para
restringir valores numéricos:

```typescript
import { z } from "zod";

// 1. Intervalos e limites
const PercentageSchema = z
  .number()
  .min(0) // Maior ou igual a 0 (ou .gte(0))
  .max(100); // Menor ou igual a 100 (ou .lte(100))

// 2. Regras de sinal e tipo
const QuantitySchema = z.number().int().positive(); // Inteiro maior que zero (> 0)
const BalanceSchema = z.number().nonnegative(); // Número maior ou igual a zero (>= 0)
const DiscountSchema = z.number().negative(); // Número estritamente menor que zero (< 0)

// 3. Múltiplos e limites de precisão
const MultipleOfFiveSchema = z.number().multipleOf(5); // 5, 10, 15, 20...
const FiniteNumberSchema = z.number().finite(); // Impede Infinity / -Infinity
```

## Mensagens de Erro Customizadas

Por padrão, o Zod gera mensagens de erro em inglês (como `"Invalid email"` ou
`"Number must be greater than or equal to 0"`). Você pode personalizar as
mensagens diretamente na declaração de cada método ou schema de formato:

```typescript
import { z } from "zod";

const RegistrationFormSchema = z.object({
  // Mensagens customizadas no construtor do tipo
  name: z
    .string({
      required_error: "O nome completo é obrigatório.",
      invalid_type_error: "O nome deve ser um texto válido.",
    })
    .min(3, "O nome deve conter pelo menos 3 caracteres.")
    .max(100, "O nome não pode exceder 100 caracteres."),

  // Mensagens em schemas de formato especializados
  email: z.email("Informe um endereço de e-mail válido."),

  age: z
    .number({ required_error: "A idade é obrigatória." })
    .int("A idade deve ser um número inteiro.")
    .min(18, "Você precisa ter pelo menos 18 anos para se cadastrar."),
});
```

Quando a validação falhar, o objeto `ZodError` trará exatamente o texto
configurado:

```typescript
const result = RegistrationFormSchema.safeParse({
  name: "Al",
  email: "email-invalido",
  age: 15,
});

if (!result.success) {
  result.error.issues.forEach((issue) => {
    console.log(`- ${issue.message}`);
  });
  // Saída:
  // - O nome deve conter pelo menos 3 caracteres.
  // - Informe um endereço de e-mail válido.
  // - Você precisa ter pelo menos 18 anos para se cadastrar.
}
```

## Coerção Automática de Tipos (`z.coerce`)

Na Web, dados frequentemente chegam na aplicação encapsulados como texto
(`string`):

- Parâmetros de busca em URLs (`URLSearchParams` ou `req.query`);
- Entradas de formulários HTML nativos (`FormData`);
- Variáveis de ambiente (`process.env`).

Para evitar a necessidade de converter manualmente cada campo com
`Number(input)` ou `new Date(input)` antes de validar, o Zod fornece o namespace
**`z.coerce`**.

A coerção executa a conversão JavaScript nativa correspondente **antes** de
aplicar as validações do schema:

```typescript
import { z } from "zod";

// 1. Coerção para número (executa Number(input))
const PageSchema = z.coerce.number().int().positive();

console.log(PageSchema.parse("5")); // ✅ Retorna o número 5 (tipo: number)
console.log(PageSchema.parse(5)); // ✅ Retorna o número 5 (tipo: number)

// 2. Coerção para data (executa new Date(input))
const EventDateSchema = z.coerce.date();

const event = EventDateSchema.parse("2026-10-15T14:30:00.000Z");
console.log(event instanceof Date); // ✅ true

// 3. Coerção para boolean e string
const ToggleSchema = z.coerce.boolean();
const TextCoerceSchema = z.coerce.string();
```

### Exemplo Prático: Validando Parâmetros de Paginação de URL

Imagine uma rota de API que recebe parâmetros de consulta via URL
(`?page=2&limit=20`):

```typescript
import { z } from "zod";

const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

// Simulando parâmetros extraídos de window.location.search
const queryParams = {
  page: "3", // Chegou como string!
  limit: "50", // Chegou como string!
};

const validated = PaginationQuerySchema.parse(queryParams);

console.log(validated);
// ✅ Saída: { page: 3, limit: 50 } (com tipos TypeScript estritamente definidos como 'number')
```

<details>
<summary>🔍 <strong>Aprofundamento: A Pegadinha do <code>z.coerce.boolean()</code></strong></summary>

Em JavaScript nativo, a função `Boolean("false")` retorna **`true`**, pois
qualquer string não-vazia é considerada um valor _truthy_.

Por essa razão, o `z.coerce.boolean().parse("false")` retornará `true`!

Se você estiver lidando com checkboxes ou formulários web onde strings `"true"`
e `"false"` precisam ser convertidas fielmente para valores booleanos, uma
abordagem segura é utilizar uma união ou pré-processamento:

```typescript
import { z } from "zod";

// ✅ Schema seguro para converter strings "true"/"false" e valores booleanos nativos
const SafeBooleanSchema = z.union([
  z.boolean(),
  z.literal("true").transform(() => true),
  z.literal("false").transform(() => false),
]);

console.log(SafeBooleanSchema.parse("false")); // false ✅
console.log(SafeBooleanSchema.parse("true")); // true  ✅
console.log(SafeBooleanSchema.parse(false)); // false ✅
```

</details>

## O Que Vem a Seguir?

Neste capítulo, dominamos como validar tipos primitivos individuais e aplicar
coerções de tipo inteligentes.

No próximo capítulo, avançaremos para a modelagem de estruturas complexas com
**Schemas de Objetos e Arrays**, aprenderemos a lidar com campos opcionais e
nulos, e desvendaremos o recurso mais poderoso do Zod: a **inferência estática
automática de tipos com `z.infer`**.

---

<a href="01-o-problema-do-runtime-e-introducao-ao-zod.md">← O Problema do
Runtime e Introdução ao Zod</a>

<p align="right"><a href="03-objetos-arrays-e-inferencia-de-tipos.md">Próximo: Objetos, Arrays e Inferência de Tipos →</a></p>
