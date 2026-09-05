# 6. Expressões, Operadores e Coerção de Tipos

Nos capítulos anteriores, aprendemos como armazenar e estruturar dados na
memória, seja através de tipos primitivos ou de objetos literais.

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
"avaliam" (_evaluate_) para encontrar seu resultado final.

### 2. Operador

Um **operador** é um símbolo especial que instrui o interpretador a realizar uma
operação específica sobre um ou mais valores (chamados de **operandos**).

Os operadores são classificados pela quantidade de operandos que recebem:

- **Unários:** Operam sobre um único operando (ex: `!isLoggedIn`,
  `-temperature`);
- **Binários:** Operam sobre dois operandos (ex: `total + shipping`, `a === b`);
- **Ternários:** Operam sobre três operandos (ex: `score >= 60 ? "Aprovado" :
"Reprovado"`).

## Operadores Aritméticos e de Atribuição

São utilizados para cálculos numéricos e manipulação de valores:

```typescript
const basePrice = 100;
const taxRate = 0.15;

// Operações Aritméticas:
const subtotal = basePrice * 2; // Multiplicação: 200
const finalPrice = subtotal + subtotal * taxRate; // Soma e multiplicação: 230
const divisionResult = 10 / 4; // Divisão: 2.5
const remainder = 10 % 3; // Módulo (Resto da divisão inteira): 1
const exponential = 2 ** 3; // Exponenciação (2³): 8

// Atribuição Composta (atalhos de atualização):
let currentScore = 50;
currentScore += 10; // Equivalente a: currentScore = currentScore + 10 (60)
currentScore -= 5; // Equivalente a: currentScore = currentScore - 5 (55)
currentScore *= 2; // Equivalente a: currentScore = currentScore * 2 (110)
currentScore /= 2; // Equivalente a: currentScore = currentScore / 2 (55)
```

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
contexto lógico.

Existem apenas **6 valores Falsy** que são tratados como falso:

1. `false`
2. `0` (e `-0`)
3. `""` (string vazia)
4. `null`
5. `undefined`
6. `NaN`

**Todos os demais valores são Truthy**, incluindo objetos vazios `{}` e arrays
vazios `[]`!

### Avaliação de Curto-Circuito (_Short-Circuit_)

Os operadores `&&` e `||` não convertem o resultado para booleano; eles retornam
o **próprio valor** que determinou a parada da avaliação:

```typescript
// Curto-circuito com '&&': Para no primeiro Falsy ou retorna o último valor
const serverGreeting = isUserAuthenticated && "Bem-vindo de volta!";
// Se isUserAuthenticated for true, o resultado é "Bem-vindo de volta!"

// Curto-circuito com '||': Retorna o primeiro valor Truthy encontrado
const userInputName = "";
const displayName = userInputName || "Usuário Anônimo";
console.log(displayName); // "Usuário Anônimo" (pois "" é falsy)
```

## Operadores Modernos da Web

### 1. Operador Ternário (`condicao ? exprTrue : exprFalse`)

É uma expressão compacta de decisão que **retorna diretamente um valor**:

```typescript
const score = 75;

// Produz o valor "Aprovado" ou "Reprovado" em uma única linha:
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
const userProfile: {
  name: string;
  address?: {
    street?: string;
    city?: string;
  };
} = {
  name: "Luigi",
  // 'address' é opcional e não foi definido
};

// Navegação segura:
const streetName = userProfile.address?.street;
console.log(streetName); // undefined (sem travar a aplicação!)
```

Também pode ser usado em chamadas de métodos e índices de arrays:

```typescript
// Executa o método apenas se ele existir:
apiCallback?.();

// Acessa o índice apenas se o array existir:
itemsList?.[0];
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

## Resumo dos Operadores Mais Utilizados

| Operador | Categoria             | Exemplo                     | Finalidade / Comportamento                         |
| :------- | :-------------------- | :-------------------------- | :------------------------------------------------- |
| `===`    | Igualdade Estrita     | `5 === "5"`                 | `false` (Compara valor e tipo sem coerção)         |
| `!==`    | Desigualdade Estrita  | `10 !== 20`                 | `true`                                             |
| `**`     | Exponenciação         | `2 ** 3`                    | `8` ($2^3$)                                        |
| `%`      | Módulo (Resto)        | `10 % 3`                    | `1`                                                |
| `&&`     | E Lógico              | `isLogged && hasAccess`     | Retorna verdadeiro se ambos forem verdadeiros      |
| `\|\|`   | OU Lógico             | `isMobile \|\| isTablet`    | Retorna verdadeiro se ao menos um for verdadeiro   |
| `? :`    | Operador Ternário     | `age >= 18 ? "Sim" : "Não"` | Retorna um valor baseado em uma condição           |
| `?.`     | Encadeamento Opcional | `user?.address?.city`       | Navega em objetos aninhados com segurança          |
| `??`     | Coalescência Nula     | `count ?? 1`                | Aplica valor padrão apenas para `null`/`undefined` |

> **Regra de Ouro:**
>
> 1. **Sempre utilize igualdade estrita (`===` e `!==`)**. Abandone o uso de
>    `==` e `!=`.
> 2. **Para valores padrão, prefira `??` em vez de `||`**. Isso impede que o
>    número `0` ou textos vazios `""` sejam substituídos indevidamente.

## O Que Vem a Seguir?

Agora que dominamos a avaliação de expressões, operadores aritméticos, lógicos e
de igualdade estrita, estamos prontos para controlar o fluxo de execução dos
nossos programas.

No próximo capítulo, vamos explorar as **Estruturas de Decisão (`if`, `else if`,
`else`, `switch`)** e aprender uma das técnicas de código limpo mais valorizadas
pela indústria: as **Guard Clauses (Cláusulas de Guarda / Early Return)**.

---

<a href="05-tipos-por-referencia-e-objetos.md">← Tipos por Referência e Objetos
em Memória</a>

<p align="right"><a href="07-condicionais.md">Próximo: Estruturas de Decisão e Fluxo de Controle →</a></p>
