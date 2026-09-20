# 09. Expressões Match (PHP 8+)

No capítulo anterior, estudamos o comando clássico `switch` para avaliar uma
variável contra múltiplos valores. Embora útil, o `switch` carrega limitações
históricas que frequentemente resultam em código verboso e suscetível a falhas:
obrigatoriedade de instruções `break`, comparações não estritas com coerção de
tipos (`==`) e o fato de ser uma declaração (_statement_), e não uma expressão
(_expression_).

Para modernizar o controle de fluxo e oferecer uma alternativa mais segura e
concisa, o **PHP 8.0 introduziu a expressão `match`**.

Neste capítulo, vamos entender a mecânica do `match`, suas garantias de
segurança com checagem estrita (`===`), exaustividade de casos e como utilizá-lo
para escrever código limpo e declarativo.

## Do `switch` ao `match`: A Evolução da Sintaxe

Considere o cenário clássico em que precisamos mapear um código de status HTTP
para uma mensagem legível.

Com a abordagem tradicional do `switch`, precisamos declarar uma variável prévia
vazia e atribuir o valor repetidamente em cada braço, tomando cuidado redobrado
para não esquecer os comandos `break`:

```php
<?php

$httpStatusCode = 200;
$statusMessage = "";

// ❌ Prolixo, repetitivo e com risco de esquecimento de break
switch ($httpStatusCode) {
    case 200:
        $statusMessage = "OK: Requisição processada com sucesso.";
        break;

    case 400:
        $statusMessage = "Bad Request: Dados inválidos enviados pelo cliente.";
        break;

    case 404:
        $statusMessage = "Not Found: O recurso solicitado não existe.";
        break;

    case 500:
        $statusMessage = "Internal Server Error: Falha inesperada no servidor.";
        break;

    default:
        $statusMessage = "Status desconhecido.";
        break;
}
```

Com a expressão **`match`**, o código torna-se imediatamente conciso e
expressivo. Como o `match` é uma **expressão** (ele avalia para um valor),
podemos atribuir seu resultado diretamente a uma variável:

```php
<?php

$httpStatusCode = 200;

// ✅ Conciso, direto e sem necessidade de break
$statusMessage = match ($httpStatusCode) {
    200 => "OK: Requisição processada com sucesso.",
    400 => "Bad Request: Dados inválidos enviados pelo cliente.",
    404 => "Not Found: O recurso solicitado não existe.",
    500 => "Internal Server Error: Falha inesperada no servidor.",
    default => "Status desconhecido.",
};

echo $statusMessage;
```

> **Atenção à Pontuação:** Como toda atribuição ou expressão no PHP, o bloco do
> `match` deve ser encerrado com um ponto e vírgula final: `};`.

## Comparação Estrita de Tipos (`===`)

Uma das maiores vantagens de segurança do `match` em relação ao `switch` é que o
`match` realiza **comparações estritas de identidade (`===`)**, verificando
simultaneamente o valor e o tipo de dado.

No `switch`, a coerção implícita pode causar execuções indesejadas:

```php
<?php

$userRole = "0"; // String contendo o caractere zero

// ❌ Perigo com switch (comparações soltas ==)
switch ($userRole) {
    case 0:
        echo "Perfil Numérico Zero (Executa se houver coerção fraca)";
        break;
    case "0":
        echo "Perfil String '0'";
        break;
}
```

Com o `match`, os tipos devem ser estritamente correspondentes:

```php
<?php

$userRole = "0";

$roleLabel = match ($userRole) {
    0 => "Identificador Inteiro Zero",
    "0" => "Identificador Texto '0'", // ✅ Apenas este braço corresponde
    default => "Outro formato",
};

echo $roleLabel; // Saída: Identificador Texto '0'
```

## Agrupamento de Múltiplos Padrões

No `switch`, múltiplos casos com a mesma ação dependem do encadeamento sem
`break`. No `match`, agrupamos valores no mesmo braço simplesmente separando-os
por **vírgulas**:

```php
<?php

$orderStatus = "shipped";

$deliveryCategory = match ($orderStatus) {
    "draft", "pending_payment" => "Aguardando confirmação",
    "processing", "shipped" => "Em andamento logístico",
    "delivered" => "Concluído",
    "canceled", "refunded" => "Encerrado",
    default => "Status não reconhecido",
};

echo $deliveryCategory; // Saída: Em andamento logístico
```

## Exaustividade e o Erro `UnhandledMatchError`

O `match` foi projetado para garantir que **sempre haja um retorno válido**.

Se você não definir um braço `default` e o valor testado não corresponder a
nenhuma das opções fornecidas, o PHP não ignorará o erro em silêncio: ele
lançará uma exceção nativa chamada **`UnhandledMatchError`**:

```php
<?php

$paymentMethod = "bitcoin";

// ⚠️ Se 'bitcoin' não está listado e não há default:
// Fatal error: Uncaught UnhandledMatchError: Unhandled match case 'bitcoin'
$feeRate = match ($paymentMethod) {
    "credit_card" => 0.03,
    "pix" => 0.00,
    "boleto" => 1.50,
};
```

Essa característica de **exaustividade obrigatória** é uma grande vantagem em
sistemas corporativos: caso um novo valor de domínio seja adicionado ao sistema
e você esqueça de tratá-lo, o interpretador acusará o erro imediatamente,
impedindo que a aplicação prossiga com variáveis indefinidas (`null`) ou estados
corrompidos.

## Padrão Avançado: `match (true)` para Condições Complexas

Embora o uso mais comum do `match` seja comparar uma variável contra valores
literais, podemos utilizá-lo para avaliar **expressões lógicas e faixas de
valores** passando `true` como valor de controle:

```php
<?php

$customerPoints = 350;

$loyaltyTier = match (true) {
    $customerPoints >= 500 => "Platina",
    $customerPoints >= 200 => "Ouro",
    $customerPoints >= 50 => "Prata",
    default => "Bronze",
};

echo $loyaltyTier; // Saída: Ouro
```

Nesse padrão, cada braço contém uma expressão booleana. O PHP avalia as
condições de cima para baixo e executa o primeiro braço cuja expressão for
estritamente igual a `true`.

## Comparativo: `switch` vs `match`

| Recurso                         | Declaração `switch`                  | Expressão `match` (PHP 8+)                     |
| :------------------------------ | :----------------------------------- | :--------------------------------------------- |
| **Natureza**                    | Declaração de controle (_statement_) | Expressão com retorno de valor (_expression_)  |
| **Tipo de Comparação**          | Igualdade fraca (`==`)               | Identidade estrita (`===`)                     |
| **Necessidade de `break`**      | Sim (risco de _fall-through_)        | Não (executa apenas o braço casado)            |
| **Agrupamento de Casos**        | `case A: case B:` em cascata         | `A, B => valor` separados por vírgula          |
| **Comportamento sem Casamento** | Continua a execução sem erro         | Lança `UnhandledMatchError` (se sem `default`) |
| **Sintaxe Final**               | Fecha com `}`                        | Fecha com `};`                                 |

> **Recomendação Profissional:** Em bases de código modernas (PHP 8.0+),
> **prefira `match` ao `switch`** para qualquer mapeamento de valores ou
> bifurcações diretas. Reserve o `switch` apenas para códigos legados ou
> cenários muito raros em que múltiplos blocos de instruções procedurais
> complexas precisam ser executados com efeitos colaterais.

## O Que Vem a Seguir?

Agora que dominamos como tomar decisões no fluxo de execução — desde o clássico
`if/else` até as modernas expressões `match` —, precisamos aprender a processar
volumes de dados e repetir tarefas.

No próximo capítulo, vamos explorar as **Estruturas de Repetição (`for`,
`while`, `do-while`)** e nos aprofundar no poderoso laço **`foreach`**, a
estrutura de iteração mais utilizada no ecossistema PHP.

---

<a href="08-estruturas-condicionais.md">← Estruturas Condicionais</a>

<p align="right"><a href="10-estruturas-de-repeticao.md">Próximo: Estruturas de Repetição →</a></p>
