# 08. Estruturas Condicionais

No capítulo anterior, aprendemos a avaliar expressões booleanas (`$isLogged &&
$hasAccess`, `$age >= 18`) e operar com valores lógicos.

No entanto, um programa não executa apenas uma linha após a outra de forma
linear. A essência do desenvolvimento web é a **capacidade de tomar decisões**:
executar um bloco de código se o usuário for administrador, exibir uma mensagem
de erro se o saldo for insuficiente ou redirecionar o fluxo se o pagamento for
confirmado.

Neste capítulo, vamos dominar as estruturas de controle de fluxo fundamentais do
PHP: **`if` / `elseif` / `else`** e **`switch / case`**, explorando boas
práticas de legibilidade como as **Cláusulas de Guarda** e compreendendo as
nuances de comparação da linguagem.

## A Estrutura `if` e `else`

A estrutura condicional `if` avalia uma expressão booleana. Se a condição for
resolvida como verdadeira (_truthy_), o bloco de código delimitado por chaves `{
... }` é executado:

```php
<?php

declare(strict_types=1);

$studentScore = 7.5;

if ($studentScore >= 6.0) {
    echo "Estudante aprovado!";
}
```

### O Bloco `else`

Quando precisamos definir uma ação alternativa caso a condição seja falsa
(_falsy_), adicionamos o bloco `else`:

```php
<?php

declare(strict_types=1);

$isUserAuthenticated = false;

if ($isUserAuthenticated) {
    echo "Acesso liberado ao painel principal.";
} else {
    echo "Por favor, faça login para continuar.";
}
```

> **Boas Práticas:** Mesmo quando o bloco possui apenas uma única instrução,
> **sempre utilize chaves `{ ... }`**. A omissão de chaves é uma fonte comum de
> erros graves durante refatorações futuras.

## Encadeamento com `elseif`

Quando existem múltiplos cenários mutuamente exclusivos, encadeamos novas
condições utilizando a palavra-chave `elseif` e finalizamos com um `else` como
tratamento padrão (_fallback_):

```php
<?php

declare(strict_types=1);

$currentTrafficLight = "yellow";

if ($currentTrafficLight === "green") {
    echo "Siga em frente.";
} elseif ($currentTrafficLight === "yellow") {
    echo "Atenção: prepare-se para parar.";
} elseif ($currentTrafficLight === "red") {
    echo "Pare o veículo.";
} else {
    echo "Semáforo com defeito ou status desconhecido.";
}
```

### Ordem de Avaliação

O interpretador do PHP avalia as condições sequencialmente, de cima para baixo.
**A primeira condição verdadeira é executada**, e todas as condições
subsequentes são imediatamente ignoradas, mesmo que também fossem verdadeiras:

```php
<?php

declare(strict_types=1);

$customerPoints = 120;

if ($customerPoints >= 100) {
    echo "Categoria Ouro!"; // Executa aqui e encerra a estrutura
} elseif ($customerPoints >= 50) {
    echo "Categoria Prata!"; // Não é avaliado, mesmo que 120 >= 50 seja true
}
```

<details>
<summary><code>elseif</code> ou <code>else if</code>: existe diferença no PHP?</summary>

No PHP moderno com blocos delimitados por chaves `{ ... }`, tanto `elseif`
(junto) quanto `else if` (separado) produzem exatamente o mesmo resultado de
execução.

No entanto, o padrão oficial da comunidade (**PSR-12 / PER Coding Style**)
recomenda fortemente o uso da palavra-chave unificada **`elseif`**.

Além disso, se você utilizar a sintaxe alternativa do PHP (comum em arquivos de
template com `:` e `endif;`), o PHP **obriga** o uso de `elseif`:

```php
<!-- Sintaxe alternativa para templates -->
<?php if ($role === "admin"): ?>
    <p>Painel Administrativo</p>
<?php elseif ($role === "editor"): ?>
    <p>Painel do Editor</p>
<?php endif; ?>
```

Por consistência e conformidade com os padrões da linguagem, adote sempre
**`elseif`** em seu código.

</details>

## A Estrutura `switch / case` para Múltiplas Escolhas

Quando precisamos avaliar **uma mesma variável ou expressão contra múltiplos
valores constantes ou literais**, o comando `switch` organiza o código em ramos
chamados `case`, evitando longas cadeias repetitivas de `if / elseif`:

```php
<?php

declare(strict_types=1);

$userRole = "editor";

switch ($userRole) {
    case "admin":
        echo "Acesso total ao sistema.";
        break;

    case "editor":
        echo "Permissão para criar e editar publicações.";
        break;

    case "viewer":
        echo "Permissão apenas para leitura de conteúdo.";
        break;

    default:
        echo "Perfil desconhecido ou sem permissões atribuídas.";
        break;
}
```

### O Funcionamento do `break` e o Risco de _Fall-through_

A instrução **`break`** interrompe a execução e sai do bloco `switch`. Se o
comando `break` for omitido, o interpretador continuará executando as instruções
dos casos seguintes em cascata, independentemente de seus valores coincidirem
(comportamento conhecido como _fall-through_):

```php
<?php

declare(strict_types=1);

$chosenTier = "gold";

switch ($chosenTier) {
    case "gold":
        echo "Ganha 20% de desconto!\n"; // Executa

    // Sem break: o interpretador continua "caindo" no próximo bloco!
    case "silver":
        echo "Ganha frete grátis!\n";   // Executa indevidamente!
        break;
}
```

### Agrupamento Intencional de Casos

Podemos utilizar o _fall-through_ a nosso favor quando múltiplos valores devem
executar exatamente a mesma regra de negócio:

```php
<?php

declare(strict_types=1);

$selectedDay = "sábado";

switch ($selectedDay) {
    case "segunda":
    case "terça":
    case "quarta":
    case "quinta":
    case "sexta":
        echo "Dia útil comercial.";
        break;

    case "sábado":
    case "domingo":
        echo "Fim de semana: atendimento fechado.";
        break;

    default:
        echo "Dia inválido.";
        break;
}
```

### Atenção: `switch` Utiliza Comparação Fraca (`==`)

Um detalhe técnico vital sobre o `switch` no PHP é que as comparações entre o
valor testado e cada `case` são realizadas utilizando **igualdade fraca
(`==`)**, e não identidade estrita (`===`).

```php
<?php

declare(strict_types=1);

$inputStatus = 0;

switch ($inputStatus) {
    case "pendente": // Em versões legadas do PHP, 0 == "pendente" avaliava como true!
        echo "Status pendente";
        break;

    case 0:
        echo "Status numérico zero";
        break;
}
```

> **Nota de Modernidade:** A partir do PHP 8.0, o comportamento de comparações
> fracas entre strings e números foi significativamente aprimorado. Ainda assim,
> para comparações estritas com checagem de tipos sem o risco de esquecimento de
> `break`, o PHP 8+ introduziu a expressão **`match`**, que estudaremos
> detalhadamente no próximo capítulo!

## Cláusulas de Guarda (_Guard Clauses_) e _Early Return_

À medida que as regras de negócio crescem, é muito comum cairmos na armadilha de
aninhar múltiplos blocos `if / else`, criando o que a engenharia de software
chama de _código em formato de flecha_ (ou _Hadouken anti-pattern_):

```php
<?php

// ❌ Difícil leitura e alto acoplamento visual (aninhamento profundo)
function processPayment(bool $isAccountActive, float $accountBalance, float $orderAmount): string
{
    if ($isAccountActive) {
        if ($orderAmount > 0) {
            if ($accountBalance >= $orderAmount) {
                return "Pagamento de R$ {$orderAmount} processado com sucesso!";
            } else {
                return "Erro: Saldo insuficiente.";
            }
        } else {
            return "Erro: Valor do pedido deve ser maior que zero.";
        }
    } else {
        return "Erro: Conta do cliente está inativa.";
    }
}
```

A técnica de **Cláusulas de Guarda (_Guard Clauses_)** inverte a lógica:
tratamos as condições de erro e casos excepcionais **primeiro**, interrompendo a
execução imediatamente com um retorno antecipado (_early return_). O caminho
feliz (_happy path_) permanece sempre no nível principal de indentação:

```php
<?php

declare(strict_types=1);

// ✅ Legibilidade linear, rápida compreensão e fácil manutenção
function processPayment(bool $isAccountActive, float $accountBalance, float $orderAmount): string
{
    if (!$isAccountActive) {
        return "Erro: Conta do cliente está inativa.";
    }

    if ($orderAmount <= 0) {
        return "Erro: Valor do pedido deve ser maior que zero.";
    }

    if ($accountBalance < $orderAmount) {
        return "Erro: Saldo insuficiente.";
    }

    return "Pagamento de R$ {$orderAmount} processado com sucesso!";
}
```

## Resumo das Estruturas de Decisão

| Estrutura               | Quando Utilizar?                                          | Exemplo Típico                           |
| :---------------------- | :-------------------------------------------------------- | :--------------------------------------- |
| **`if / else`**         | Decisões booleanas simples ou bifurcações binárias        | `if ($score >= 6.0) { ... }`             |
| **`elseif`**            | Múltiplas faixas numéricas ou condições lógicas compostas | `elseif ($score >= 5.0 && $score < 6.0)` |
| **`switch / case`**     | Mapeamento clássico de um único valor contra literais     | `switch ($role) { case 'admin': ... }`   |
| **Cláusulas de Guarda** | Validações prévias e tratamento antecipado de erros       | `if (!$isValid) { return false; }`       |

> **Regras de Ouro:**
>
> 1. **Sempre utilize chaves `{ ... }`** em blocos condicionais para garantir
>    clareza e evitar efeitos colaterais.
> 2. **Adote `elseif`** (palavra unificada) para seguir as recomendações de
>    estilo PSR-12.
> 3. **Prefira Cláusulas de Guarda** em funções e métodos para manter o código
>    linear e reduzir a complexidade ciclomática.

## O Que Vem a Seguir?

No PHP 8.0, a linguagem recebeu uma das suas funcionalidades mais celebradas: a
expressão **`match`**.

No próximo capítulo, vamos explorar como o **`match`** substitui com elegância o
`switch` tradicional, trazendo avaliação estrita (`===`), retorno direto de
valores como expressão e eliminação completa do risco de _fall-through_.

---

<a href="07-operadores-e-expressoes.md">← Operadores e Expressões</a>

<p align="right"><a href="09-expressoes-match.md">Próximo: Expressões Match (PHP 8+) →</a></p>
