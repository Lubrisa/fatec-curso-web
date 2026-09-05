# 7. Condicionais

No capítulo anterior, aprendemos a calcular valores e avaliar expressões
booleanas (`isLogged && hasAccess`, `age >= 18`).

No entanto, um programa não executa apenas uma linha após a outra de forma
linear. A essência do desenvolvimento de software é a **capacidade de tomar
decisões**: executar um bloco de código se o usuário for administrador, exibir
uma mensagem de erro se o saldo for insuficiente ou redirecionar o fluxo se o
pagamento for confirmado.

Neste capítulo, vamos dominar as principais estruturas de fluxo de controle do
TypeScript: **`if` / `else if` / `else`** e **`switch / case`**, entendendo
quando aplicar cada uma delas para manter seu código claro e expressivo.

## A Estrutura `if` e `else`

A estrutura condicional `if` avalia uma expressão booleana. Se a condição for
verdadeira (_Truthy_), o bloco de código dentro das chaves `{ ... }` é
executado:

```typescript
const studentScore = 7.5;

if (studentScore >= 6.0) {
  console.log("Estudante aprovado!");
}
```

### O Bloco `else`

Quando precisamos definir uma ação alternativa caso a condição seja falsa,
adicionamos o bloco `else`:

```typescript
const isUserAuthenticated = false;

if (isUserAuthenticated) {
  console.log("Acesso liberado ao painel principal.");
} else {
  console.log("Por favor, faça login para continuar.");
}
```

> **Boas Práticas:** Mesmo quando o bloco possui apenas uma linha, **sempre
> utilize chaves `{ ... }`**. Omitir chaves pode gerar bugs graves caso novas
> instruções sejam adicionadas posteriormente.

## Encadeamento com `else if`

Quando existem múltiplos cenários mutuamente exclusivos, encadeamos condições
com `else if` e finalizamos com um `else` como fallback padrão:

```typescript
const currentTrafficLight = "yellow";

if (currentTrafficLight === "green") {
  console.log("Siga em frente.");
} else if (currentTrafficLight === "yellow") {
  console.log("Atenção: prepare-se para parar.");
} else if (currentTrafficLight === "red") {
  console.log("Pare o veículo.");
} else {
  console.log("Semáforo com defeito.");
}
```

### Ordem de Avaliação

O interpretador avalia as condições de cima para baixo. **A primeira condição
verdadeira é executada**, e todas as condições seguintes são imediatamente
ignoradas, mesmo que também fossem verdadeiras:

```typescript
const customerPoints = 120;

if (customerPoints >= 100) {
  console.log("Categoria Ouro!"); // Executa aqui e encerra a estrutura
} else if (customerPoints >= 50) {
  console.log("Categoria Prata!"); // Não será avaliado
}
```

## A Estrutura `switch / case` para Múltiplas Escolhas

Quando precisamos avaliar **uma única variável contra vários valores constantes
ou literais**, o comando `switch` oferece uma alternativa mais limpa e legível
do que uma longa cadeia de `else if`:

```typescript
const userRole = "editor";

switch (userRole) {
  case "admin":
    console.log("Acesso total ao sistema.");
    break;

  case "editor":
    console.log("Permissão para criar e editar publicações.");
    break;

  case "viewer":
    console.log("Permissão apenas para leitura.");
    break;

  default:
    console.log("Perfil desconhecido ou sem permissões.");
    break;
}
```

### O Perigo do Esquecimento do `break`

A instrução **`break`** interrompe a execução do `switch`. Se você esquecer o
`break`, o interpretador continuará executando os blocos dos casos seguintes
automaticamente (comportamento conhecido como _fall-through_):

```typescript
const chosenTier = "gold";

switch (chosenTier) {
  case "gold":
    console.log("Ganha 20% de desconto!"); // Executa

  // Sem break: o código continua executando o caso de baixo!
  case "silver":
    console.log("Ganha frete grátis!"); // Também executa por engano!
    break;
}
```

### Agrupamento de Casos Intencional

Podemos aproveitar o _fall-through_ de forma consciente para aplicar a mesma
lógica a múltiplos casos:

```typescript
const selectedDay = "sábado";

switch (selectedDay) {
  case "segunda":
  case "terça":
  case "quarta":
  case "quinta":
  case "sexta":
    console.log("Dia útil de atendimento comercial.");
    break;

  case "sábado":
  case "domingo":
    console.log("Fim de semana: escritório fechado.");
    break;

  default:
    console.log("Dia inválido.");
    break;
}
```

## Resumo das Estruturas de Decisão

| Estrutura           | Quando Utilizar?                                         | Exemplo de Uso                         |
| :------------------ | :------------------------------------------------------- | :------------------------------------- |
| **`if / else`**     | Condições lógicas simples, booleanas ou faixas numéricas | `if (score >= 6.0) { ... }`            |
| **`else if`**       | Múltiplas regras de negócio mutuamente exclusivas        | `else if (temp > 30) { ... }`          |
| **`switch / case`** | Comparação de um único valor contra opções constantes    | `switch (status) { case "paid": ... }` |

> **Regra de Ouro:**
>
> 1. **Sempre utilize chaves `{ ... }`** em blocos `if` e `else` para garantir
>    clareza e evitar erros em manutenções futuras.
> 2. Use **`if / else if`** quando as condições envolverem expressões lógicas
>    complexas ou faixas numéricas (`>=`, `<=`), e prefira **`switch`** quando
>    estiver comparando uma mesma variável contra valores literais discretos.

## O Que Vem a Seguir?

Agora que dominamos como bifurcar e tomar decisões no nosso código, precisamos
aprender a repetir instruções com eficiência.

No próximo capítulo, vamos explorar as **Estruturas de Repetição (`for`,
`while`, `do-while`)**, desvendar a diferença crucial entre **`for..of`** e
**`for..in`**, e entender quando usar comandos de controle como `break` e
`continue`.

---

<a href="06-expressoes-e-operadores.md">← Expressões e Operadores</a>

<p align="right"><a href="08-lacos.md">Próximo: Laços →</a></p>
