# 2. Tipos Primitivos em TypeScript

No capítulo anterior, preparamos o terreno: configuramos o compilador `tsc`,
desvendamos as opções do `tsconfig.json` e executamos nosso primeiro programa.

Agora começaremos a desvendar a linguagem pelo seu alicerce: **como os dados são
representados e protegidos em memória**.

No JavaScript puro, todo dado possui um tipo em tempo de execução, mas as
variáveis não possuem amarras estáticas. Isso permite que uma variável comece
guardando um número, passe a guardar um texto e termine como `undefined`,
gerando comportamentos imprevisíveis.

O TypeScript resolve esse problema introduzindo um sistema robusto de **tipagem
estática**, permitindo que você defina contratos claros e imutáveis para cada
dado da sua aplicação.

## A Dor: O Caos da Falta de Tipos Estáticos

Imagine uma função simples de cálculo de checkout em uma loja virtual escrita em
JavaScript comum:

```javascript
// ❌ JAVASCRIPT: Sem checagem de tipos estática
function calculateTotal(price, quantity, discount) {
  return price * quantity - discount;
}

// O que acontece quando dados inesperados chegam?
console.log(calculateTotal(100, "2", 10)); // Retorna 190 (coerção implícita perigosa)
console.log(calculateTotal(100, 2, "dez")); // Retorna NaN (Not a Number)
console.log(calculateTotal(100, 2)); // Retorna NaN (discount é undefined)
```

Nenhum erro foi acusado pelo editor antes de rodar o código. A aplicação
executou normalmente e gerou valores corrompidos que poderiam quebrar relatórios
financeiros ou travar o carrinho de compras do usuário.

Com o TypeScript, definimos contratos explícitos para os tipos primitivos:

```typescript
// ✅ TYPESCRIPT: Contratos claros e verificação em tempo de edição
function calculateTotal(
  price: number,
  quantity: number,
  discount: number = 0,
): number {
  return price * quantity - discount;
}

const total = calculateTotal(100, 2, 10); // ✅ Válido: 190

// O TypeScript impede o erro antes mesmo de você salvar o arquivo:
// calculateTotal(100, "2", 10);
// ❌ Argument of type 'string' is not assignable to parameter of type 'number'.
```

## O Catálogo de Tipos Primitivos

O TypeScript adota os 7 tipos primitivos fundamentais do JavaScript moderno e
adiciona anotações estáticas a cada um deles.

### 1. `number`

Em TypeScript e JavaScript, não existem tipos separados para inteiros (`int`),
ponto flutuante (`float`) ou números decimais (`double`). Todos os números são
representados pelo tipo **`number`** (ponto flutuante de precisão dupla de 64
bits no padrão IEEE 754).

```typescript
const studentAge: number = 22; // Inteiro
const courseRating: number = 4.85; // Ponto flutuante
const temperature: number = -3.5; // Número negativo

// Suporte a separadores numéricos (_) para facilitar a leitura:
const annualRevenue: number = 1_500_000; // 1 milhão e meio

// Bases numéricas alternativas:
const hexColor: number = 0xff0000; // Hexadecimal
const binaryFlags: number = 0b1010; // Binário
const octalPermissions: number = 0o755; // Octal

// Valores numéricos especiais (também pertencem ao tipo number):
const notANumber: number = NaN; // Not a Number (operações inválidas como 0 / 0)
const positiveInfinity: number = Infinity; // Divisão por zero (ex: 10 / 0)
const negativeInfinity: number = -Infinity; // Divisão negativa por zero (ex: -10 / 0)
```

Além dos valores convencionais, o tipo `number` engloba valores numéricos
especiais definidos pela especificação IEEE 754:

- **`NaN` (_Not a Number_):** Representa o resultado de cálculos matemáticos
  inválidos (como `0 / 0` ou tentar converter `"texto"` para número).
  _Curiosidade:_ Ironicamente, `typeof NaN` retorna `"number"`;
- **`Infinity` e `-Infinity`:** Representam infinitos positivo e negativo. No
  JavaScript/TypeScript, dividir um número por zero (`10 / 0`) não lança erro de
  execução, mas retorna `Infinity`.

### 2. `string`

Representa dados textuais. Pode ser delimitado por aspas simples (`'`), aspas
duplas (`"`) ou crases (`` ` ``) para _Template Literals_:

```typescript
const courseName: string = "Desenvolvimento Web";
const universityName: string = "FATEC";

// Template Literal com interpolação de variáveis:
const greetingMessage: string = `Bem-vindo ao curso de ${courseName} na ${universityName}!`;
```

### 3. `boolean`

Representa valores lógicos de verdade: apenas `true` ou `false`.

```typescript
const isEnrolled: boolean = true;
const hasSubmittedProject: boolean = false;

// Expressões lógicas resultam em boolean:
const canGraduate: boolean = isEnrolled && hasSubmittedProject;
```

### 4. `bigint`

O tipo `number` padrão do JavaScript só consegue representar números inteiros
seguros até $2^{53} - 1$ (o valor `9.007.199.254.740.991`, disponível em
`Number.MAX_SAFE_INTEGER`).

Para trabalhar com inteiros arbitrariamente grandes (como identificadores de
banco de dados de 64 bits ou criptografia), usamos o tipo **`bigint`**:

```typescript
// Criado adicionando o sufixo 'n' ao final do número:
const massiveId: bigint = 90071992547409923891273918237918237n;
const transactionCode: bigint = BigInt(987654321012345678);

// ⚠️ Atenção: Não é possível misturar 'number' e 'bigint' diretamente em operações:
// const invalidResult = studentAge + massiveId; // ❌ Erro de compilação
const validResult = BigInt(studentAge) + massiveId; // ✅ Válido após conversão explícita
```

### 5. `symbol`

Introduzido no ECMAScript 2015, o tipo **`symbol`** cria identificadores
primitivos que são garantidamente únicos e imutáveis:

```typescript
const uniqueKeyA: symbol = Symbol("identifier");
const uniqueKeyB: symbol = Symbol("identifier");

console.log(uniqueKeyA === uniqueKeyB); // false (cada Symbol é absolutamente único)
```

Symbols são comumente utilizados em bibliotecas avançadas para criar chaves de
propriedades em objetos que não sofrem colisão de nomes.

## Ausência de Valor: `undefined` vs `null`

No ecossistema JavaScript/TypeScript, existem duas formas de representar a
"ausência de valor". Compreender a diferença conceitual entre elas é vital:

```typescript
// 1. undefined: A variável existe, mas ainda NÃO foi inicializada com nenhum valor
let pendingAssignment: string | undefined = undefined;

// 2. null: Ausência INTENCIONAL e explícita de valor
let loggedUser: string | null = null; // O usuário deslogou intencionalmente
```

### O Salvador dos Projetos: `strictNullChecks`

No JavaScript clássico (e em muitas outras linguagens como Java ou C# sem flags
rigorosas), `null` e `undefined` podem ser atribuídos a qualquer tipo de dado.
Isso dá origem ao infame erro em tempo de execução:

> `TypeError: Cannot read properties of undefined (reading 'toUpperCase')`

No TypeScript moderno, ao configurarmos `"strict": true` no `tsconfig.json`
(como fizemos no capítulo anterior), ativamos automaticamente a regra
**`strictNullChecks`**.

Com ela, o TypeScript proíbe que `null` ou `undefined` sejam passados para
variáveis que esperam tipos normais:

```typescript
// Com "strict": true
let studentEmail: string = "aluno@fatec.sp.gov.br";

// studentEmail = null;
// ❌ Type 'null' is not assignable to type 'string'.

// studentEmail = undefined;
// ❌ Type 'undefined' is not assignable to type 'string'.

// Se a variável REALMENTE puder ser nula, declare explicitamente:
let optionalPhone: string | null = null; // ✅ Permitido
optionalPhone = "11999998888"; // ✅ Também permitido
```

## Os Tipos Especiais: O Perigo do `any` vs a Segurança do `unknown`

### O Tipo `any` (A "Porta dos Fundos" do Sistema de Tipos)

O tipo `any` desliga completamente o checador de tipos do TypeScript para aquela
variável. Ele diz ao compilador: _"Confie em mim, não faça checagem alguma nesta
variável"_.

```typescript
// ❌ EVITE O USO DE 'any'
let unrestrictedData: any = "Texto inicial";

unrestrictedData = 42; // Aceita qualquer tipo
unrestrictedData.nonExistentMethod(); // Compila sem erros, mas quebra em runtime!
unrestrictedData.toUpperCase(); // Quebra em runtime se virar um número!
```

> **Alerta:**
>
> Usar `any` em TypeScript é o equivalente a comprar um carro blindado e retirar
> todas as portas. Você perde todas as garantias de segurança que o TypeScript
> oferece e volta a ter os mesmos problemas do JavaScript puro.

### O Tipo `unknown` (A Alternativa Segura)

Se você realmente **não sabe** qual dado receberá (por exemplo, ao ler um dado
de uma API externa ou ler a entrada do usuário), utilize **`unknown`** em vez de
`any`.

O tipo `unknown` aceita qualquer valor, mas **obriga você a verificar o tipo**
antes de executar qualquer operação sobre ele:

```typescript
// ✅ RECOMENDADO: Usar 'unknown' para dados incertos
let externalApiResponse: unknown = "Mensagem vinda do servidor";

// externalApiResponse.toUpperCase();
// ❌ 'externalApiResponse' is of type 'unknown'. (O compilador protege você!)

// Para usar o valor, é obrigatório checar o tipo (Type Narrowing):
if (typeof externalApiResponse === "string") {
  console.log(externalApiResponse.toUpperCase()); // ✅ Seguro! O TypeScript sabe que aqui é string.
}
```

## Resumo dos Tipos Primitivos e Especiais

| Tipo        | O Que Representa?                     | Exemplo de Declaração              |
| :---------- | :------------------------------------ | :--------------------------------- |
| `number`    | Inteiros, floats e hexadecimais       | `const score: number = 9.5;`       |
| `string`    | Textos e templates interpolados       | `const title: string = "Aula 02";` |
| `boolean`   | Valores lógicos (`true` / `false`)    | `const isValid: boolean = true;`   |
| `bigint`    | Inteiros de precisão arbitrária       | `const id: bigint = 100n;`         |
| `symbol`    | Identificadores únicos imutáveis      | `const key: symbol = Symbol();`    |
| `undefined` | Variável não inicializada             | `let x: undefined = undefined;`    |
| `null`      | Ausência intencional de valor         | `let user: string \| null = null;` |
| `unknown`   | Tipo incerto com checagem obrigatória | `let input: unknown = fetch();`    |
| `any`       | ❌ Desativa a checagem de tipos       | _Evite ao máximo em código real_   |

> **Regra de Ouro:**
>
> Trate o `any` como uma dívida técnica. Sempre que encontrar um dado de tipo
> incerto vindo de fontes externas, prefira `unknown` acompanhado de validação
> de tipos (`typeof`), garantindo que sua aplicação nunca seja surpreendida em
> produção.

<details>
<summary>🔍 Curiosidade Técnica: Por que <code>typeof null === "object"</code> no JavaScript?</summary>

Se você abrir o terminal e rodar:

```javascript
console.log(typeof null); // "object"
```

Por que o operador `typeof` diz que `null` é um `"object"`, se acabamos de
aprender que ele é um tipo primitivo?

Essa é uma das anomalias históricas mais famosas da computação. Na primeira
versão do JavaScript (criada por Brendan Eich em apenas 10 dias em 1995), os
valores em memória eram representados por blocos com uma "etiqueta de tipo" nos
primeiros bits. A etiqueta `000` representava um ponteiro para um objeto. Como o
ponteiro nulo (`null`) apontava para o endereço de memória `0x00`, sua etiqueta
de tipo era lida como `000`, fazendo com que `typeof` retornasse `"object"`.

Uma proposta para corrigir esse bug chegou a ser escrita para o ECMAScript, mas
foi rejeitada porque a correção quebraria milhares de sites legados espalhados
pela internet que já contavam com esse comportamento.

No TypeScript, essa confusão desaparece: o sistema de tipos reconhece `null`
como um tipo primitivo próprio e independente.

</details>

## O Que Vem a Seguir?

Agora que conhecemos os tipos primitivos e como o compilador nos protege de
erros básicos, vamos nos aprofundar em um dos tipos mais utilizados em qualquer
aplicação Web: as **Strings**.

No próximo capítulo, vamos entender como manipular textos com segurança, a
imutabilidade de strings em memória e o poder dos métodos modernos de inspeção e
transformação.

---

<a href="01-instalacao-e-primeiro-programa.md">← Instalação e Primeiro Programa
em TypeScript</a>

<p align="right"><a href="03-string.md">Próximo: Manipulação de Strings e Template Literals →</a></p>
