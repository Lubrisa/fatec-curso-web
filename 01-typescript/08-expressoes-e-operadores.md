# 8. Expressões e Operadores

Nos capítulos anteriores, aprendemos como armazenar e estruturar dados na
memória com tipos primitivos, objetos literais e Type Aliases.

Agora daremos o próximo passo fundamental: **como transformar, calcular,
comparar e avaliar esses dados em tempo de execução**.

Neste capítulo, vamos compreender o que são **Expressões** e **Operadores**,
explorar as diferentes categorias de operadores, dominar os recursos modernos
como o **Encadeamento Opcional (`?.`)** e a **Coalescência Nula (`??`)** e
desvendar as regras de **Precedência e Associatividade**.

## O Que São Expressões e Operadores?

Para entender como o código executa instruções, precisamos diferenciar dois
conceitos essenciais:

### 1. Expressão

Uma **expressão** é qualquer pedaço de código válido que **produz ou se resolve
em um valor**.

```typescript
// Exemplos de expressões:
true; // Produz o valor true
5 + 3; // Produz o valor 8
"Desenvolvimento " + "Web"; // Produz "Desenvolvimento Web"
Math.max(10, 20); // Produz 20
userScore >= 60; // Produz true ou false
```

Sempre que o TypeScript ou o JavaScript encontram uma expressão, eles a
"avaliam" para encontrar seu resultado final.

### 2. Operador

Um **operador** é um símbolo especial que instrui o interpretador a realizar uma
operação específica sobre um ou mais valores (chamados de **operandos**).

Podemos classificar os operadores a partir de diferentes critérios:

- **Quantidade de Operandos (Aridade):**
  - **Unários:** Operam sobre um único operando (ex: `!isLoggedIn`,
    `-temperature`);
  - **Binários:** Operam sobre dois operandos (ex: `total + shipping`, `a === b`);
  - **Ternários:** Operam sobre três operandos (ex: `score >= 60 ? "Aprovado" : "Reprovado"`).
- **Tipo de Operação e Finalidade:** A natureza do cálculo ou transformação
  realizada (operações matemáticas, comparações lógicas, atribuições, navegação
  em dados, etc.);
- **Precedência e Associatividade:** A ordem de prioridade e a direção de
  avaliação quando múltiplos operadores aparecem juntos em uma mesma expressão.

A seguir, vamos explorar os operadores mais utilizados no desenvolvimento
moderno organizados pelo **tipo de operação** que realizam.

## Operadores Aritméticos

São utilizados para realizar cálculos matemáticos com valores numéricos:

```typescript
const basePrice = 100;
const taxRate = 0.15;

const subtotal = basePrice * 2; // Multiplicação: 200
const finalPrice = subtotal + subtotal * taxRate; // Adição e multiplicação: 230
const divisionResult = 10 / 4; // Divisão: 2.5
const remainder = 10 % 3; // Módulo (Resto da divisão inteira): 1
const exponential = 2 ** 3; // Exponenciação (2³): 8
```

### Incremento (`++`) e Decremento (`--`)

Os operadores unários `++` e `--` adicionam ou subtraem `1` de uma variável:

```typescript
let counter = 0;

counter++; // Incremento: equivale a counter = counter + 1 (agora vale 1)
counter--; // Decremento: equivale a counter = counter - 1 (agora vale 0)
```

> **Prefixado vs. Posfixado:**
>
> Quando usados em expressões, `++counter` (prefixado) incrementa o valor
> **antes** de avaliá-lo, enquanto `counter++` (posfixado) retorna o valor atual
> e incrementa **depois**. Em código moderno, a boa prática é usá-los em linhas
> isoladas ou optar pela atribuição explícita `counter += 1`.

## Operadores de Atribuição

Permitem armazenar ou atualizar valores em variáveis:

```typescript
let currentScore = 50; // Atribuição simples

// Atribuição Composta (atalhos de operação + atribuição):
currentScore += 10; // Equivalente a: currentScore = currentScore + 10 (60)
currentScore -= 5; // Equivalente a: currentScore = currentScore - 5 (55)
currentScore *= 2; // Equivalente a: currentScore = currentScore * 2 (110)
currentScore /= 2; // Equivalente a: currentScore = currentScore / 2 (55)
```

## Concatenação de Strings (`+`)

Além de somar números, o operador binário `+` pode ser utilizado para unir
textos:

```typescript
const firstName = "Luigi";
const lastName = "França";

const fullName = firstName + " " + lastName; // "Luigi França"
```

> **Lembrete:** Conforme vimos no [Capítulo 03: String e Template
> Literals](03-string-e-template-literals.md), no TypeScript moderno priorizamos
> **Template Literals** (`` `${firstName} ${lastName}` ``) para montar textos
> dinâmicos, reservando o operador `+` para operações matemáticas.

## Operadores de Comparação e Igualdade

Permitem comparar dois valores e retornam sempre um resultado booleano (`true`
ou `false`).

### Operadores Relacionais

```typescript
const studentGrade = 8.5;

console.log(studentGrade > 7.0); // true (Maior que)
console.log(studentGrade < 6.0); // false (Menor que)
console.log(studentGrade >= 8.5); // true (Maior ou igual a)
console.log(studentGrade <= 10.0); // true (Menor ou igual a)
```

### Igualdade Estrita (`===` e `!==`)

A **igualdade estrita (`===`)** e a **desigualdade estrita (`!==`)** comparam
simultaneamente o **valor** e o **tipo** dos dados, sem realizar conversões
automáticas:

```typescript
// ✅ RECOMENDADO: Comparações estritas e seguras
console.log(10 === 10); // true
console.log(10 === "10"); // false (number !== string)
console.log(10 !== 20); // true
```

### A Armadilha da Igualdade Fraca (`==` e `!=`)

No JavaScript clássico, os operadores `==` e `!=` realizam **coerção implícita
de tipos** (_Type Coercion_), tentando converter os valores antes de
compará-los. Isso gera comportamentos perigosos e inconsistentes:

```javascript
// ❌ EVITE: Igualdade fraca com coerção automática
console.log(0 == ""); // true (0 é igual a texto vazio?!)
console.log(0 == "0"); // true (número 0 é igual a texto '0'!)
console.log(false == "0"); // true (falso é igual a texto '0'!)
console.log(null == undefined); // true
console.log([] == false); // true (array vazio é falso?!)
```

O TypeScript ajuda a prevenir esses problemas alertando erros no editor caso
você tente comparar tipos sem nenhuma sobreposição:

```typescript
const studentAge: number = 20;

// if (studentAge === "20") { ... }
// ❌ Erro: This comparison appears to be unintentional because the types 'number' and 'string' have no overlap.
```

### Igualdade de Objetos: Comparando Referências

Uma dúvida clássica surge ao comparar objetos com o operador `===`. Como
aprendemos no [Capítulo 06: Tipos por Referência e
Memória](06-tipos-por-referencia-e-memoria.md), variáveis de objetos armazenam
**endereços de memória na Stack** apontando para o dado na Heap.

Por isso, o operador `===` ao comparar objetos **não verifica se as propriedades
internas são idênticas**, mas sim se ambas as variáveis apontam para o
**mesmíssimo endereço de memória**:

```typescript
type User = {
  name: string;
};

// Dois objetos distintos criados na Heap (endereços diferentes):
const userA: User = { name: "Luigi" };
const userB: User = { name: "Luigi" };

// Uma variável recebendo a referência de userA (mesmo endereço):
const userC: User = userA;

console.log(userA === userB); // false (conteúdos idênticos, mas endereços de memória diferentes!)
console.log(userA === userC); // true (ambas as variáveis apontam para o mesmo objeto na Heap)
```

## Operadores Lógicos e Curto-Circuito

Os operadores lógicos combinam condições booleanas:

- **`&&` (E lógico / AND):** Retorna verdadeiro se **ambos** os operandos forem
  verdadeiros;
- **`||` (OU lógico / OR):** Retorna verdadeiro se **ao menos um** dos operandos
  for verdadeiro;
- **`!` (NÃO lógico / NOT):** Inverte o valor lógico (`!true` $\rightarrow$
  `false`).

```typescript
const isUserAuthenticated = true;
const hasAdminPermission = false;

const canAccessSettings = isUserAuthenticated && hasAdminPermission; // false
const canViewPublicPage = isUserAuthenticated || hasAdminPermission; // true
const isGuestUser = !isUserAuthenticated; // false
```

### Valores _Truthy_ e _Falsy_

No JavaScript e no TypeScript, qualquer tipo de dado pode ser avaliado em um
**contexto lógico** — ou seja, quando é combinado com operadores lógicos (`&&`,
`||`, `!`) ou quando alimenta decisões em estruturas condicionais e laços de
repetição (que estudaremos nos próximos capítulos).

Quando um valor não-booleano é testado em um contexto lógico, ele é
implicitamente interpretado como `true` (**Truthy**) ou `false` (**Falsy**).

Existem apenas **6 valores Falsy** na linguagem:

1. `false` (o próprio booleano falso)
2. `0` (e `-0`)
3. `""` (string vazia)
4. `null`
5. `undefined`
6. `NaN` (Not-a-Number / cálculo numérico inválido)

**Todos os demais valores são Truthy**, incluindo números negativos (`-10`),
textos com espaço (`" "`), objetos vazios `{}` e arrays vazios `[]`!

### Avaliação de Curto-Circuito (_Short-Circuit_)

Uma característica fundamental dos operadores `&&` e `||` é a **avaliação de
curto-circuito**: o interpretador avalia as expressões da esquerda para a
direita e **interrompe a execução assim que o resultado puder ser determinado**,
sem avaliar as expressões seguintes.

- **Curto-circuito com `&&`:** Se a primeira expressão for **Falsy**, o operador
  para imediatamente e não executa o restante (pois a operação inteira já não
  pode ser verdadeira). Esse comportamento é amplamente usado como **mecanismo de
  proteção** para só acessar um dado se a condição anterior for válida:

  ```typescript
  type User = {
    name: string;
  };

  const loggedUser: User | null = null;

  // Como loggedUser é null (Falsy), a verificação para imediatamente.
  // O lado direito nem chega a ser executado, evitando erros de leitura:
  const isUserValid = loggedUser !== null && loggedUser.name.length > 0;
  console.log(isUserValid); // false
  ```

- **Curto-circuito com `||`:** Se a primeira expressão for **Truthy**, o
  operador para imediatamente e ignora o restante (pois um único valor verdadeiro
  já é suficiente). Esse comportamento é muito utilizado para fornecer **valores
  de substituição (fallbacks)**:

  ```typescript
  const userInputName = ""; // String vazia é Falsy

  // Como o primeiro valor é Falsy, o operador avança e assume a alternativa:
  const displayName = userInputName || "Usuário Anônimo";
  console.log(displayName); // "Usuário Anônimo"
  ```

> **Conexão:** Nas próximas seções, vamos conhecer operadores modernos como o
> **Encadeamento Opcional (`?.`)** e a **Coalescência Nula (`??`)**, criados
> justamente para tornar esses padrões de proteção e valores padrão muito mais
> robustos e seguros.

## Operadores Modernos da Web

### 1. Operador Ternário (`condicao ? valorSeVerdadeiro : valorSeFalso`)

O operador ternário é uma expressão compacta de decisão baseada em uma condição:

- Se a condição for **verdadeira** (Truthy), o valor da **esquerda** dos
  dois-pontos (`:`) é selecionado;
- Se a condição for **falsa** (Falsy), o valor da **direita** é selecionado.

```typescript
const score = 75;

// Como (75 >= 60) é verdadeiro, seleciona o valor da esquerda ("Aprovado"):
const statusResult = score >= 60 ? "Aprovado" : "Reprovado";
console.log(statusResult); // "Aprovado"
```

### 2. Encadeamento Opcional (`?.` — _Optional Chaining_)

Ao navegar por propriedades de objetos aninhados, acessar um campo de um objeto
inexistente gerava o temido erro:

> `TypeError: Cannot read properties of undefined (reading 'street')`

O operador **`?.`** interrompe a navegação e retorna `undefined` com segurança
caso a propriedade anterior seja `null` ou `undefined`:

```typescript
type Address = {
  street?: string;
  city?: string;
};

type UserProfile = {
  name: string;
  address?: Address;
};

const userProfile: UserProfile = {
  name: "Luigi",
  // 'address' é opcional e não foi definido
};

// Navegação segura:
const streetName = userProfile.address?.street;
console.log(streetName); // undefined (sem travar a aplicação!)
```

### 3. Coalescência Nula (`??` — _Nullish Coalescing_)

O operador `||` é frequentemente usado para definir valores padrão, mas possui
uma armadilha grave: **ele trata `0`, `""` e `false` como inválidos**.

Veja o problema em um contador de mensagens:

```typescript
// ❌ O PROBLEMA DO '||':
const unreadAlerts = 0; // O usuário leu tudo, possui 0 alertas pendentes

// Como 0 é Falsy, o '||' assume o padrão por engano!
const badgeCount = unreadAlerts || 10;
console.log(badgeCount); // 10 (Incorreto! Deveria ser 0)
```

O **Operador de Coalescência Nula (`??`)** resolve isso verificando estritamente
se o valor é **`null`** ou **`undefined`**, preservando valores válidos como
`0`, `""` ou `false`:

```typescript
// ✅ A SOLUÇÃO COM '??':
const unreadAlerts = 0;

// O '??' só aplica o padrão se for null ou undefined:
const badgeCount = unreadAlerts ?? 10;
console.log(badgeCount); // 0 (Correto! O 0 foi preservado)

const customPrefix = "";
const finalPrefix = customPrefix ?? "padrao_";
console.log(finalPrefix); // "" (A string vazia foi preservada)
```

## Precedência e Associatividade de Operadores

Agora que conhecemos todas as categorias de operadores, o que acontece quando
combinamos vários deles na mesma expressão?

### 1. Precedência de Operadores

A **precedência** dita a ordem de prioridade no cálculo, de forma análoga às
regras da matemática (multiplicações e divisões ocorrem antes de somas e
subtrações):

```typescript
// Multiplicação (*) tem maior precedência que adição (+):
const total = 10 + 5 * 2;
console.log(total); // 20 (e não 30!)
```

### 2. Associatividade

Quando dois operadores possuem a **mesma precedência**, a **associatividade**
define a direção em que a expressão é avaliada:

- **Da esquerda para a direita (Maioria dos operadores):**

  ```typescript
  // A subtração avalia da esquerda para a direita: (20 - 5) - 2 = 13
  const result = 20 - 5 - 2;
  console.log(result); // 13
  ```

- **Da direita para a esquerda (Atribuição e Exponenciação):**

  ```typescript
  // A exponenciação (**) avalia da direita para a esquerda: 2 ** (3 ** 2) = 2 ** 9 = 512
  const powerResult = 2 ** (3 ** 2);
  console.log(powerResult); // 512

  // A atribuição (=) avalia da direita para a esquerda:
  let scoreA: number;
  let scoreB: number;
  scoreA = scoreB = 100; // scoreB recebe 100, e depois scoreA recebe 100
  ```

### O Uso de Parênteses `()`

> **Boas Práticas:** Em vez de forçar a equipe a memorizar tabelas complexas de
> precedência, **use parênteses `()`** para deixar a intenção do cálculo
> perfeitamente clara:
>
> ```typescript
> const finalAmount = (basePrice + shippingFee) * (1 - discountPercentage);
> ```

## O Que Vem a Seguir?

Agora que dominamos a avaliação de expressões, operadores aritméticos, lógicos e
de igualdade estrita, estamos prontos para controlar o fluxo de execução dos
nossos programas.

No próximo capítulo, vamos explorar as **Estruturas de Decisão (`if`, `else if`,
`else`, `switch`)** e aprender uma das técnicas de código limpo mais valorizadas
pela indústria: as **Guard Clauses (Cláusulas de Guarda / Early Return)**.

---

<a href="07-type-aliases.md">← Type Aliases</a>

<p align="right"><a href="09-estruturas-condicionais.md">Próximo: Estruturas Condicionais →</a></p>
