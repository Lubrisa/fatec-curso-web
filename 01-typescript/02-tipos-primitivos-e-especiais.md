# 2. Tipos Primitivos e Especiais

No capítulo anterior, preparamos o terreno: configuramos o compilador `tsc`,
desvendamos as opções do `tsconfig.json` e executamos nosso primeiro programa.

Agora, começamos a explorar a verdadeira essência do TypeScript: seu **sistema
de tipos estático**.

No JavaScript, os tipos existem apenas em tempo de execução. Ao escrever código,
ficamos dependentes da ajuda da IDE e de documentações sem garantias formais. O
TypeScript transforma esse cenário ao usar o sistema de tipos para blindar nossa
aplicação contra erros de lógica em tempo de edição.

Neste capítulo, vamos explorar o catálogo dos **tipos primitivos essenciais**,
como representar a ausência de valor com `null` e `undefined`, e conhecer os
tipos especiais `any` e `unknown`.

## Os Tipos Primitivos Essenciais da Web

No dia a dia do desenvolvimento Web com TypeScript (seja construindo interfaces
com React ou APIs com Node.js), a imensa maioria dos dados é representada por
três tipos primitivos:

### 1. `number`

Em TypeScript e JavaScript, não existem tipos separados para inteiros (`int`) ou
decimais (`float`/`double`). Todos os números são representados pelo tipo
**`number`**:

```typescript
const studentAge: number = 22; // Inteiro
const courseRating: number = 4.85; // Ponto flutuante / decimal
const temperature: number = -3.5; // Negativo

// Suporte a separadores numéricos (_) para facilitar a leitura de grandes valores:
const annualRevenue: number = 1_500_000; // 1 milhão e meio
```

> **Atenção ao `NaN` (_Not a Number_):**
>
> Quando uma operação matemática falha (por exemplo, tentar multiplicar um texto
> por um número em tempo de execução), o JavaScript produz o valor especial
> `NaN`. Ironicamente, `typeof NaN` é `"number"`.

### 2. `string`

Representa dados textuais. Pode ser delimitado por aspas simples (`'`), aspas
duplas (`"`) ou crases (`` ` ``) para _Template Literals_:

```typescript
const courseName: string = "Desenvolvimento Web";
const universityName: string = "FATEC";

// Template Literal com interpolação de variáveis:
const greetingMessage: string = `Bem-vindo ao curso de ${courseName} na ${universityName}!`;
// Resultado: `Bem-vindo ao curso de Desenvolvimento Web na FATEC!`
```

### 3. `boolean`

Representa valores lógicos de verdade: apenas `true` ou `false`.

```typescript
const isEnrolled: boolean = true;
const hasSubmittedProject: boolean = false;

// Expressões lógicas resultam em boolean:
const canGraduate: boolean = isEnrolled && hasSubmittedProject;
```

## Ausência de Valor: `undefined` vs `null`

No ecossistema JavaScript e TypeScript, existem duas formas de representar a
ausência de um dado. Embora pareçam similares à primeira vista, seus papéis
conceituais são bem diferentes.

### `undefined` (Não Inicializado ou Inexistente)

O tipo `undefined` indica que uma variável, propriedade ou retorno existe na
estrutura do código, mas **não possui nenhum valor atribuído**. É o estado
padrão gerado automaticamente pelo próprio motor do JavaScript:

```typescript
// 1. Variável declarada sem valor inicial:
let pendingScore: number | undefined;
console.log(pendingScore); // undefined

// 2. Propriedade opcional de um objeto que não foi informada:
const studentProfile: { name: string; course?: string } = { name: "Luigi" };
console.log(studentProfile.course); // undefined

// 3. Função sem retorno explícito:
function displayNotice(text: string): void {
  console.log(text);
}
const noticeResult = displayNotice("Aviso da aula!");
console.log(noticeResult); // undefined
```

### `null` (Ausência Intencional de Valor)

Diferente do `undefined`, o valor `null` **nunca é gerado automaticamente pelo
JavaScript**. Ele representa a ausência intencional e explícita de um valor,
atribuída conscientemente pelo programador para indicar que aquele campo está
vazio:

```typescript
// 1. Inicializar um campo opcional indicando ausência consciente de dados:
let activeCoupon: string | null = null; // Nenhum cupom aplicado no momento

// 2. Resetar intencionalmente um estado anterior da aplicação:
let loggedUser: string | null = "Luigi"; // Usuário realizou login
loggedUser = null; // Logout explícito (campo volta a ser intencionalmente vazio)

// 3. Função com retorno explícito de null quando uma busca não tem resultado:
function findStudentById(id: number): string | null {
  if (id === 1) {
    return "Luigi";
  }

  return null; // Ausência intencional de registro
}

const searchResult = findStudentById(99);
console.log(searchResult); // null
```

> **Em resumo:**
>
> - **`undefined`:** _"O sistema ainda não definiu o valor ou a informação não
>   existe."_
> - **`null`:** _"O programador definiu conscientemente que o valor é nenhum /
>   vazio."_

<details>
<summary>Opcional: O papel do <code>strictNullChecks</code> na prevenção de erros</summary>

Por padrão, o TypeScript não trata `null` e `undefined` como tipos
independentes. Isso permitiria atribuições enganosas como:

```typescript
// ❌ Sem verificação estrita: compila normalmente, mas mascara erros
const userName: string = undefined;
const userEmail: string = null;
```

Nesse cenário, o código afirma que as variáveis contêm textos, mas na prática
elas guardam ausência de valor.

Para tornar o compilador rigoroso e evitar esse problema, utilizamos a opção
**`strictNullChecks`** no `tsconfig.json` (que já ativamos no capítulo anterior
através da opção `"strict": true`). Com ela ativada, o compilador rejeita o
código acima:

```text
Type 'undefined' is not assignable to type 'string'.
Type 'null' is not assignable to type 'string'.
```

Para que o código seja aceito, somos incentivados a explicitar a união de tipos
(`string | undefined` ou `string | null`):

```typescript
// ✅ Com verificação estrita: contratos honestos e seguros
const userName: string | undefined = undefined;
const userEmail: string | null = null;
```

Essa exigência do compilador impede que métodos de texto sejam invocados
diretamente em valores nulos, eliminando um dos erros mais clássicos do
JavaScript:

> `TypeError: Cannot read properties of undefined (reading 'toUpperCase')`

</details>

## Os Tipos Especiais `any` e `unknown`

### `any` (A "Porta dos Fundos" do Sistema de Tipos)

O tipo `any` desliga completamente o checador de tipos do TypeScript para aquela
variável. Ele diz ao compilador: _"Confie em mim, não faça checagem alguma nesta
variável"_.

```typescript
// ❌ EVITE O USO DE 'any'
let unrestrictedData: any = "Texto inicial";

unrestrictedData = 42; // Aceita qualquer tipo

unrestrictedData.toUpperCase(); // Quebra em runtime pois esse método só existe em strings
```

> **Alerta:**
>
> Usar `any` em TypeScript é o equivalente a comprar um carro blindado e retirar
> todas as portas. Você perde todas as garantias de segurança que o TypeScript
> oferece e volta a ter os mesmos problemas do JavaScript puro.

### `unknown` (A Alternativa Segura)

Se você realmente **não sabe** qual dado receberá (por exemplo, ao ler um dado
de uma API externa ou resposta HTTP), utilize **`unknown`** em vez de `any`.

O tipo `unknown` aceita qualquer valor, mas **obriga você a verificar o tipo**
antes de executar qualquer operação sobre ele:

```typescript
// ✅ RECOMENDADO: Usar 'unknown' para dados de fontes externas
let externalApiResponse: unknown = "Mensagem vinda do servidor";

// externalApiResponse.toUpperCase();
// ❌ 'externalApiResponse' is of type 'unknown'. (O compilador protege você!)

// Para usar o valor, é obrigatório checar o tipo (Type Narrowing):
if (typeof externalApiResponse === "string") {
  console.log(externalApiResponse.toUpperCase()); // ✅ Seguro! O TypeScript sabe que aqui é string.
}
```

> **Regra de Ouro:**
>
> Trate o `any` como uma dívida técnica. Sempre que encontrar um dado de tipo
> incerto vindo de fontes externas, prefira `unknown` acompanhado de validação
> de tipos (`typeof`), garantindo que sua aplicação nunca quebre em produção.

## Resumo dos Tipos

| Tipo        | O Que Representa?                            | Exemplo de Declaração              |
| :---------- | :------------------------------------------- | :--------------------------------- |
| `number`    | Inteiros, decimais e negativos               | `const score: number = 9.5;`       |
| `string`    | Textos e templates interpolados              | `const title: string = "Aula 02";` |
| `boolean`   | Valores lógicos (`true` / `false`)           | `const isValid: boolean = true;`   |
| `undefined` | Variável não inicializada                    | `let x: undefined = undefined;`    |
| `null`      | Ausência intencional e explícita de valor    | `let user: string \| null = null;` |
| `unknown`   | Tipo incerto seguro com checagem obrigatória | `let input: unknown = ...;`        |
| `any`       | ❌ Desativa a checagem de tipos (evite usar) | _Evite ao máximo em código real_   |

> **Nota sobre `bigint` e `symbol`:**
>
> O JavaScript moderno também possui os tipos primitivos `bigint` (inteiros de
> precisão arbitrária) e `symbol` (identificadores únicos imutáveis). Omitimos
> ambos deste catálogo por serem extremamente especializados e raramente
> utilizados no dia a dia do desenvolvimento de aplicações Web.

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

<p align="right"><a href="03-string-e-template-literals.md">Próximo: String e Template Literals →</a></p>
