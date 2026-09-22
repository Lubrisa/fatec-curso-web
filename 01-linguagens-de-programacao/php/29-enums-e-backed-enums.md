# 29. Enums e Backed Enums

Nos blocos anteriores, construímos as bases da Orientação a Objetos, o ciclo de
vida HTTP nativo e a organização modular com namespaces e Composer.

Conforme as regras de negócio de uma aplicação web se tornam mais ricas,
frequentemente precisamos representar um **conjunto fixo e fechado de valores
possíveis**: os status de um pedido (`Pending`, `Paid`, `Shipped`, `Canceled`),
os níveis de acesso de um usuário (`Admin`, `Editor`, `Viewer`), ou as bandeiras
de um cartão de crédito.

Antes do PHP 8.1, os desenvolvedores eram obrigados a recorrer a constantes de
classe ou strings mágicas soltas, abrindo brechas para erros de digitação e
comportamentos imprevisíveis.

Neste capítulo, aprenderemos o funcionamento dos **Enums nativos** do PHP 8.1+,
a diferença entre **Pure Enums** e **Backed Enums** (`string`/`int`), o uso dos
métodos `from()` e `tryFrom()`, a inclusão de métodos e interfaces em
enumerações, e como combiná-los com a expressão `match` para criar código seguro
e autoexplicativo.

## A Dor: O Perigo das Strings Mágicas e Constantes Soltas

Imagine que um serviço de checkout recebe o status de um pagamento através de
uma string comum:

```php
<?php

declare(strict_types=1);

final class LegacyPaymentService
{
    // ❌ Constantes de classe ajudam, mas o tipo aceito ainda é uma string genérica:
    public const STATUS_PENDING = 'PENDING';
    public const STATUS_PAID = 'PAID';
    public const STATUS_CANCELED = 'CANCELED';

    public function updateStatus(int $paymentId, string $status): void
    {
        // O PHP aceita QUALQUER string aqui: "PAID", "paid", "pago", "BANANA"
        echo "Atualizando pagamento #{$paymentId} para: {$status}\n";
    }
}
```

Essa abordagem tradicional gera três grandes problemas de confiabilidade:

1. **Ausência de Segurança de Tipos:** A assinatura aceita qualquer valor do
   tipo `string`. Um erro de digitação (`'PAIDD'` ou `'paid'`) passará
   silenciosamente pela checagem de tipos e só explodirá no banco de dados.
2. **Falta de Semântica:** Não há como o autocompletar da IDE ou o analisador
   estático garantir quais são os únicos valores permitidos para aquela
   operação.
3. **Lógica de Domínio Dispersa:** Regras como _"qual é a cor deste status no
   painel?"_ ou _"este status permite cancelamento?"_ acabam espalhadas em
   funções utilitárias e múltiplos blocos `if/else`.

## O Que São Enums?

Introduzidos no **PHP 8.1**, os **Enums** (_Enumerations_) são tipos de primeira
classe que definem um conjunto restrito e enumerado de valores possíveis.

Sob o capô do PHP, cada caso de um Enum é uma **instância única e imutável**
(_Singleton_) daquele tipo, garantindo comparações estritas de identidade com
`===`.

### 1. Pure Enums (Enumerações Puras)

Um **Pure Enum** define casos nominais sem nenhum valor primitivo subjacente
associado:

```php
<?php

declare(strict_types=1);

namespace App\Domain\Enums;

enum OrderStatus
{
    case Pending;
    case Processing;
    case Shipped;
    case Delivered;
    case Canceled;
}
```

#### Propriedades Nativas dos Pure Enums

Cada caso de um Enum possui automaticamente a propriedade somente leitura
**`->name`**, que retorna o nome do caso como `string`:

```php
<?php

declare(strict_types=1);

use App\Domain\Enums\OrderStatus;

$status = OrderStatus::Pending;

// 1. Acesso ao nome do caso:
echo $status->name; // Imprime: "Pending"

// 2. Comparação estrita de tipos:
if ($status === OrderStatus::Pending) {
    echo "O pedido está aguardando confirmação.\n";
}

// 3. Listando todos os casos disponíveis com ::cases():
/** @var array<OrderStatus> $allCases */
$allCases = OrderStatus::cases();

foreach ($allCases as $case) {
    echo "- Caso: {$case->name}\n";
}
```

### 2. Backed Enums (Enumerações com Valor Escalar)

Na maioria das aplicações web, precisamos persistir o valor do Enum no banco de
dados ou transmiti-lo em payloads JSON de APIs REST. Para isso, utilizamos os
**Backed Enums**.

Um Backed Enum associa cada caso a um valor escalar primitivo equivalente, que
deve ser estritamente do tipo **`string`** ou **`int`**:

```php
<?php

declare(strict_types=1);

namespace App\Domain\Enums;

// Backed Enum tipado como string:
enum UserRole: string
{
    case Admin = 'admin';
    case Editor = 'editor';
    case Viewer = 'viewer';
}

// Backed Enum tipado como int:
enum HttpStatusCode: int
{
    case Ok = 200;
    case Created = 201;
    case BadRequest = 400;
    case NotFound = 404;
    case InternalServerError = 500;
}
```

#### As Propriedades `->name` e `->value`

Em Backed Enums, além de `->name`, temos acesso à propriedade **`->value`**, que
retorna o valor primitivo configurado:

```php
<?php

declare(strict_types=1);

use App\Domain\Enums\UserRole;

$role = UserRole::Admin;

echo "Nome do Caso: {$role->name}\n";   // "Admin"
echo "Valor Escalar: {$role->value}\n"; // "admin"
```

## Conversão Segura de Dados: `from()` e `tryFrom()`

Ao receber dados de formulários (`$_POST`), URLs (`$_GET`) ou payloads JSON
(`php://input`), recebemos strings brutas. Os Backed Enums oferecem dois métodos
estáticos nativos para converter strings em instâncias seguras de Enum:

### 1. `Enum::from(string|int $value)`

Tenta converter o valor escalar. Caso o valor **não exista** entre os casos do
Enum, o PHP dispara imediatamente uma exceção nativa **`ValueError`**:

```php
<?php

declare(strict_types=1);

use App\Domain\Enums\UserRole;

// ✅ Conversão bem-sucedida:
$role = UserRole::from('admin'); // Retorna UserRole::Admin

// ❌ Valor inexistente lança ValueError:
try {
    $invalidRole = UserRole::from('super_user');
} catch (ValueError $e) {
    echo "Erro: Valor 'super_user' não é um papel válido no sistema.\n";
}
```

### 2. `Enum::tryFrom(string|int $value)`

Tenta converter o valor escalar. Se o valor for válido, retorna a instância do
Enum; caso contrário, **retorna `null`** sem lançar exceções (ideal para
validação de entradas de usuário com operadores de coalescência):

```php
<?php

declare(strict_types=1);

use App\Domain\Enums\UserRole;

$input = (string) ($_POST['role'] ?? 'guest');

// Retorna UserRole ou null se não for reconhecido:
$role = UserRole::tryFrom($input) ?? UserRole::Viewer;

echo "Papel atribuído: {$role->value}\n";
```

## Métodos e Comportamentos em Enums

Diferente de enums em linguagens mais simples como C ou TypeScript básico, no
PHP os Enums **podem conter métodos públicos, protegidos e estáticos**,
permitindo encapsular regras de negócio diretamente no tipo:

```php
<?php

declare(strict_types=1);

namespace App\Domain\Enums;

enum PaymentStatus: string
{
    case Pending = 'pending';
    case Authorized = 'authorized';
    case Paid = 'paid';
    case Refunded = 'refunded';
    case Failed = 'failed';

    // Método que retorna um rótulo legível para exibição em interfaces:
    public function label(): string
    {
        return match ($this) {
            self::Pending    => 'Aguardando Pagamento',
            self::Authorized => 'Autorizado pela Operadora',
            self::Paid       => 'Pagamento Confirmado',
            self::Refunded   => 'Valor Estornado',
            self::Failed     => 'Falha no Processamento',
        };
    }

    // Regra de negócio encapsulada no próprio Enum:
    public function canBeCancelled(): bool
    {
        return match ($this) {
            self::Pending, self::Authorized => true,
            self::Paid, self::Refunded, self::Failed => false,
        };
    }
}
```

Consumindo o Enum com métodos:

```php
<?php

declare(strict_types=1);

use App\Domain\Enums\PaymentStatus;

$status = PaymentStatus::Pending;

echo "Status: {$status->label()}\n"; // "Aguardando Pagamento"

if ($status->canBeCancelled()) {
    echo "O pedido pode ser cancelado pelo cliente.\n";
}
```

## Implementando Interfaces em Enums

Enums no PHP podem implementar **`interface`**, permitindo que casos de
enumeração participem de contratos polimórficos de arquitetura:

```php
<?php

declare(strict_types=1);

namespace App\Domain\Contracts;

interface HasBadgeInterface
{
    public function getBadgeColor(): string;
}
```

Implementando o contrato no Enum:

```php
<?php

declare(strict_types=1);

namespace App\Domain\Enums;

use App\Domain\Contracts\HasBadgeInterface;

enum TicketPriority: string implements HasBadgeInterface
{
    case Low = 'low';
    case Medium = 'medium';
    case High = 'high';
    case Critical = 'critical';

    public function getBadgeColor(): string
    {
        return match ($this) {
            self::Low      => 'badge-secondary',
            self::Medium   => 'badge-info',
            self::High     => 'badge-warning',
            self::Critical => 'badge-danger',
        };
    }
}
```

## Enums e a Expressão `match`: Checagem Exaustiva

A combinação de **Enums** com a expressão **`match`** (que estudamos no Capítulo 09) é um dos padrões mais poderosos do PHP moderno.

Quando você passa um Enum para o `match`, o analisador estático e a engine do
PHP verificam se todos os casos foram cobertos. Se algum caso for esquecido e
não houver `default`, um erro `UnhandledMatchError` é disparado, garantindo que
novos status futuros sejam obrigatoriamente tratados:

```php
<?php

declare(strict_types=1);

use App\Domain\Enums\PaymentStatus;

function processCommission(PaymentStatus $status, float $amount): float
{
    return match ($status) {
        PaymentStatus::Paid       => $amount * 0.05,
        PaymentStatus::Refunded   => -($amount * 0.05),
        PaymentStatus::Pending,
        PaymentStatus::Authorized,
        PaymentStatus::Failed     => 0.0,
    };
}
```

## Exemplo Completo do Domínio: Máquina de Estados de Pagamentos

Vejamos um exemplo integrador completo que modela a transição de estados de uma
transação financeira utilizando Backed Enums, métodos de validação e tratamento
de exceções:

```php
<?php

declare(strict_types=1);

// 1. Enum com regras de transição de estado:
enum TransactionStatus: string
{
    case Created = 'CREATED';
    case Processing = 'PROCESSING';
    case Approved = 'APPROVED';
    case Rejected = 'REJECTED';

    /**
     * @return array<TransactionStatus>
     */
    public function allowedNextStates(): array
    {
        return match ($this) {
            self::Created    => [self::Processing, self::Rejected],
            self::Processing => [self::Approved, self::Rejected],
            self::Approved,
            self::Rejected   => [], // Estados finais não permitem novas transições
        };
    }

    public function canTransitionTo(self $nextState): bool
    {
        return in_array($nextState, $this->allowedNextStates(), true);
    }
}

// 2. Entidade de Domínio protegida por Tipagem Estrita:
final class Transaction
{
    public function __construct(
        public readonly string $id,
        public readonly float $amount,
        private TransactionStatus $status = TransactionStatus::Created
    ) {}

    public function getStatus(): TransactionStatus
    {
        return $this->status;
    }

    public function transitionTo(TransactionStatus $newStatus): void
    {
        if (!$this->status->canTransitionTo($newStatus)) {
            throw new DomainException(
                "Transição inválida: Não é permitido mudar de [{$this->status->value}] para [{$newStatus->value}]."
            );
        }

        $this->status = $newStatus;
        echo "Transação #{$this->id}: Status alterado para [{$this->status->value}]\n";
    }
}

// 3. Execução do Cenário de Negócio:
$tx = new Transaction(id: 'TX-5001', amount: 850.00);

// Transição válida: Created -> Processing
$tx->transitionTo(TransactionStatus::Processing);

// Transição válida: Processing -> Approved
$tx->transitionTo(TransactionStatus::Approved);

// Tentativa de transição inválida: Approved -> Rejected (Estado terminal)
try {
    $tx->transitionTo(TransactionStatus::Rejected);
} catch (DomainException $e) {
    echo "⚠️ Bloqueio de Negócio: {$e->getMessage()}\n";
}
```

### Saída no Terminal

```text
Transação #TX-5001: Status alterado para [PROCESSING]
Transação #TX-5001: Status alterado para [APPROVED]
⚠️ Bloqueio de Negócio: Transição inválida: Não é permitido mudar de [APPROVED] para [REJECTED].
```

## Comparativo: Formas de Representar Conjuntos no PHP

| Critério                          | Constantes de Classe (`const`)            | Pure Enums (`enum Status`)      | Backed Enums (`enum Status: string`)     |
| :-------------------------------- | :---------------------------------------- | :------------------------------ | :--------------------------------------- |
| **Segurança de Tipo**             | ❌ Frágil (aceita qualquer valor escalar) | ✅ Forte (tipo nominal estrito) | ✅ Forte (tipo nominal estrito)          |
| **Valor Escalar Subjacente**      | ✅ Sim                                    | ❌ Não (apenas identificadores) | ✅ Sim (`string` ou `int` em `->value`)  |
| **Serialização Fácil (JSON/DB)**  | ✅ Sim                                    | 🟡 Requer conversão manual      | ✅ Direta com `->value`                  |
| **Conversão a partir de Entrada** | ❌ Manual (com `in_array`)                | ❌ Apenas pelo nome             | ✅ Nativa com `::from()` e `::tryFrom()` |
| **Métodos e Interfaces**          | ❌ Não suporta                            | ✅ Suporta                      | ✅ Suporta                               |

## O Que Vem a Seguir?

Neste capítulo, aprendemos como os **Enums nativos** do PHP 8.1+ trazem
segurança de tipos, legibilidade e encapsulamento para conjuntos finitos de
dados, substituindo strings mágicas e constantes frágeis.

Agora que dominamos estruturas de dados fechadas, precisamos resolver outro
desafio de Orientação a Objetos: **como compartilhar código entre classes
totalmente distintas sem cair nas armadilhas da herança múltipla?**

No **[Capítulo 30: Traits e Composição
Horizontal](30-traits-e-composicao-horizontal.md)**, aprenderemos como utilizar
**`trait`**, a resolução de conflitos com **`insteadof`** e **`as`**, e quando a
composição horizontal é a solução ideal para reaproveitamento de comportamentos.

---

<a href="28-gerenciamento-de-pacotes-com-composer.md">← Gerenciamento de Pacotes
com Composer</a>

<p align="right"><a href="30-traits-e-composicao-horizontal.md">Próximo: Traits e Composição Horizontal →</a></p>
