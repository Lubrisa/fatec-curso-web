# 12. Funções de Primeira Classe e Callbacks

No capítulo anterior, dominamos a anatomia e a sintaxe de funções no TypeScript,
aprendendo a declarar parâmetros tipados, retornos e a escrever funções com a
sintaxe moderna de _Arrow Functions_.

Agora daremos um dos passos conceituais mais importantes da programação moderna:
compreender como o JavaScript e o TypeScript tratam funções como **cidadãs de
primeira classe** (_First-Class Citizens_).

Em vez de passar apenas dados estáticos (números, textos ou objetos) entre as
partes do sistema, podemos passar e retornar **comportamentos customizáveis**.
Essa capacidade é a base de todo o desenvolvimento web moderno — desde
manipulação de eventos no navegador e componentes reativos no React até
middlewares no backend e métodos funcionais de processamento de listas.

Neste capítulo, vamos aprender a definir **Tipos de Função** com Type Aliases,
dominar o padrão de **Callbacks**, executar invocações seguras com **`?.()`** e
compreender o que são **Funções de Alta Ordem** (_Higher-Order Functions_).

## O Que São Funções de Primeira Classe?

Dizer que funções são **cidadãs de primeira classe** (_First-Class Citizens_)
significa que elas são tratadas como **valores em si** (da mesma forma que
números, strings e objetos).

Elas desfrutam de todos os privilégios que qualquer outro dado possui na
linguagem:

1. Podem ser **armazenadas em variáveis e constantes**;
2. Podem ser **passadas como argumentos** para outras funções;
3. Podem ser **retornadas por outras funções** como resultado de um cálculo ou
   fábrica.

## Tipagem de Funções (_Function Types_)

Assim como usamos Type Aliases para descrever o contrato estrutural de objetos,
podemos utilizá-los para definir o contrato exato que uma função deve cumprir
(quais parâmetros ela recebe e qual tipo de retorno ela produz).

A sintaxe de um **Tipo de Função** utiliza o formato de seta (`=>`):

```typescript
// 1. Contrato: recebe dois números e retorna um número
type MathOperation = (firstValue: number, secondValue: number) => number;

// 2. Contrato: recebe um texto e não retorna nada (apenas executa uma ação)
type Logger = (message: string) => void;

// 3. Contrato: recebe um texto e retorna um booleano (predicado de validação)
type StringPredicate = (text: string) => boolean;
```

Com o tipo definido, podemos garantir que qualquer função atribuída a uma
variável siga rigorosamente esse contrato:

```typescript
// ✅ Válido: cumpre a assinatura (number, number) => number
const sum: MathOperation = (a, b) => a + b;
const multiply: MathOperation = (a, b) => a * b;

console.log(sum(10, 5)); // 15
console.log(multiply(10, 5)); // 50
```

> **Auto-Documentação nos Parâmetros do Tipo:**
>
> Na declaração `(firstValue: number, secondValue: number) => number`, os nomes
> `firstValue` e `secondValue` servem para documentar a intenção da função. A
> função real que implementa o tipo pode nomear seus parâmetros livremente (como
> `(a, b) => a + b`).

## O Padrão de Callbacks: Passando Comportamentos como Argumento

Um **Callback** (ou _função de retorno_) é uma função passada como argumento
para outra função, com o objetivo de ser executada (_"chamada de volta"_) em um
momento oportuno.

Esse padrão permite criar funções genéricas cujo comportamento específico pode
ser customizado por quem as invoca.

### Exemplo Prático: Formatador de Mensagens

Imagine uma função responsável por processar e exibir notificações. Em vez de
engessar a formatação do texto, ela recebe um callback de transformação:

```typescript
type TextTransformer = (rawText: string) => string;

function displayNotification(
  message: string,
  transform: TextTransformer,
): void {
  const formattedMessage = transform(message);
  console.log(`[NOTIFICAÇÃO]: ${formattedMessage}`);
}

// 1. Definindo comportamentos específicos:
const toShouting: TextTransformer = (text) => text.toUpperCase() + "!!!";
const toWhisper: TextTransformer = (text) => text.toLowerCase() + "...";

// 2. Passando funções previamente declaradas como argumentos:
displayNotification("Atenção ao prazo de matrícula", toShouting);
// Saída: [NOTIFICAÇÃO]: ATENÇÃO AO PRAZO DE MATRÍCULA!!!

displayNotification("Servidor em manutenção preventiva", toWhisper);
// Saída: [NOTIFICAÇÃO]: servidor em manutenção preventiva...

// 3. Passando uma Arrow Function anônima diretamente na chamada:
displayNotification("Sucesso", (text) => `✨ ${text} ✨`);
// Saída: [NOTIFICAÇÃO]: ✨ Sucesso ✨
```

Observe o poder do desacoplamento: a função `displayNotification` não precisa
saber _como_ o texto será formatado. Ela apenas sabe que receberá uma função que
cumpre o contrato `TextTransformer`.

## Invocação Segura de Callbacks Opcionais (`?.()`)

Em muitas bibliotecas e aplicações reais (como cliques de botões ou respostas de
APIs), um callback pode ser **opcional**.

Se tentarmos invocar um callback que não foi fornecido (`undefined`) de forma
direta, o runtime lançará um erro fatal:

> `TypeError: callback is not a function`

Para invocar callbacks opcionais com segurança, combinamos o operador de chamada
com o **Encadeamento Opcional no formato `?.()`**:

```typescript
type ActionCallback = (status: string) => void;

function executeTask(taskName: string, onComplete?: ActionCallback): void {
  console.log(`Executando tarefa: ${taskName}...`);

  // ✅ Invocação segura: executa apenas se 'onComplete' for uma função definida
  onComplete?.("sucesso");
}

// 1. Chamada passando o callback:
executeTask("Backup do Banco", (status) => {
  console.log(`Tarefa finalizada com status: ${status}`);
});

// 2. Chamada omitindo o callback opcional (executa sem travar o programa):
executeTask("Limpeza de Cache");
```

## Funções de Alta Ordem: Retornando Funções (Fábricas)

Funções que recebem outras funções como argumentos ou que **retornam novas
funções** são chamadas na ciência da computação de **Funções de Alta Ordem**
(_Higher-Order Functions_ ou HOFs).

Uma função pode atuar como uma **fábrica geradora de funções especializadas**:

```typescript
type Multiplier = (value: number) => number;

// Fábrica que gera funções multiplicadoras sob medida:
function createMultiplier(factor: number): Multiplier {
  return (value: number): number => value * factor;
}

// Criando funções especializadas a partir da fábrica:
const double = createMultiplier(2);
const triple = createMultiplier(3);
const applyTenPercentTax = createMultiplier(1.1);

console.log(double(10)); // 20
console.log(triple(10)); // 30
console.log(applyTenPercentTax(100)); // 110
```

Quando criamos `const double = createMultiplier(2)`, a função interna "lembra"
que o `factor` recebido foi `2`. Esse mecanismo de retenção de memória é chamado
de **Closure** e será investigado a fundo no próximo capítulo!

<details>
<summary>🔍 Aprofundamento: Expressões Invocadas Imediatamente (IIFE)</summary>

Como funções anônimas e Arrow Functions são expressões (produzem uma função como
valor imediatamente), podemos declará-las e executá-las no mesmíssimo instante
da sua criação. Esse padrão é chamado de **IIFE** (_Immediately Invoked Function
Expression_):

```typescript
// IIFE com Arrow Function:
((appVersion: string) => {
  console.log(`Iniciando sistema na versão ${appVersion}...`);
})("2.4.0");
```

No JavaScript histórico (anterior ao ES6), as IIFEs eram amplamente utilizadas
para criar escopos isolados e evitar que variáveis vazassem para o escopo
global. No TypeScript moderno, o uso de módulos (`import`/`export`) e
`const`/`let` tornou o uso de IIFEs raro, mas elas continuam sendo uma
demonstração clara de que funções são expressões executáveis.

</details>

## O Que Vem a Seguir?

No exemplo da fábrica de multiplicadores, vimos que a função interna conseguiu
acessar a variável `factor` mesmo depois que a função `createMultiplier` já
havia sido executada.

> _"Como o JavaScript sabe quais variáveis uma função pode acessar e por quanto
> tempo elas permanecem vivas na memória?"_

No próximo capítulo, vamos desvendar os mistérios de **Escopo, Hoisting e
Closures**, entendendo a diferença entre escopo de bloco e de função, a
_Temporal Dead Zone (TDZ)_ e a mecânica das Closures na memória.

---

<a href="11-funcoes-anatomia-e-sintaxe.md">← Funções: Anatomia e Sintaxe</a>

<p align="right"><a href="13-escopo-hoisting-e-closures.md">Próximo: Escopo, Hoisting e Closures →</a></p>
