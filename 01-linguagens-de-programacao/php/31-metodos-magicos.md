# 31. Métodos Mágicos

Nos capítulos anteriores, aprendemos a definir contratos com interfaces,
reaproveitar código com herança e traits, e modelar conjuntos fechados com
enums. Em todas essas estruturas, as operações foram declaradas de forma
estática e explícita através de métodos convencionais.

No entanto, o PHP possui uma poderosa camada de **metaprogramação e
interceptação dinâmica**: os **Métodos Mágicos** (_Magic Methods_).

Os métodos mágicos são métodos especiais reservados pela linguagem (todos
iniciados com duplo sublinhado `__`) que são **executados automaticamente pelo
interpretador PHP** em resposta a determinadas ações realizadas sobre um objeto
— como convertê-lo para string, chamá-lo como se fosse uma função ou acessar
propriedades e métodos dinamicamente.

Neste capítulo, estudaremos os métodos mágicos mais importantes do PHP moderno
(`__toString`, `__invoke`, `__get`/`__set`, `__call`, `__debugInfo`), seus casos
de uso legítimos na arquitetura de software e os cuidados necessários para não
comprometer a manutenibilidade do código.

## O Que São Métodos Mágicos?

Você já utiliza métodos mágicos desde os primeiros capítulos de Orientação a
Objetos:

- **`__construct()`:** Invocado automaticamente na instanciação com `new`.
- **`__clone()`:** Invocado automaticamente ao clonar um objeto com `clone`.

Diferente de métodos comuns, os métodos mágicos **não costumam ser chamados
diretamente pelo desenvolvedor** (evita-se `$obj->__toString()`). Em vez disso,
o runtime do PHP os dispara de forma transparente quando uma operação específica
é executada sobre a instância.

```mermaid
graph LR
    A["Operação do Desenvolvedor<br>(echo $obj, $obj(), $obj->x)"] --> B{"Runtime PHP"}
    B -->|echo $obj| C["__toString()"]
    B -->|$obj()| D["__invoke()"]
    B -->|$obj->inexistente| E["__get()"]
    B -->|var_dump($obj)| F["__debugInfo()"]
```

## 1. Conversão para Texto: `__toString()`

O método `__toString(): string` é acionado automaticamente sempre que um objeto
é tratado no contexto de uma string (como em `echo`, concatenação com `.`,
interpolação `"{$obj}"` ou coerção de tipos `(string) $obj`).

### Caso de Uso Clássico: Objetos de Valor (_Value Objects_)

Na modelagem de domínio rica, evitamos usar strings primitivas soltas para
conceitos com regras de validação (como CPF, e-mail, dinheiro ou UUIDs). O
`__toString()` permite que esses objetos sejam impressos de forma natural e
formatada:

```php
<?php

declare(strict_types=1);

namespace App\Domain\ValueObjects;

use InvalidArgumentException;

final readonly class Cpf
{
    private string $cleanNumber;

    public function __construct(string $rawCpf)
    {
        // Remove pontuações e valida se contém exatamente 11 dígitos:
        $digits = preg_replace('/\D/', '', $rawCpf) ?? '';

        if (strlen($digits) !== 11) {
            throw new InvalidArgumentException("CPF inválido: Deve conter exatamente 11 dígitos.");
        }

        $this->cleanNumber = $digits;
    }

    public function getUnmasked(): string
    {
        return $this->cleanNumber;
    }

    // Disparado automaticamente ao converter o objeto para string:
    public function __toString(): string
    {
        // Retorna formatado: 000.000.000-00
        return sprintf(
            '%s.%s.%s-%s',
            substr($this->cleanNumber, 0, 3),
            substr($this->cleanNumber, 3, 3),
            substr($this->cleanNumber, 6, 3),
            substr($this->cleanNumber, 9, 2)
        );
    }
}
```

Consumindo o objeto de valor:

```php
<?php

declare(strict_types=1);

use App\Domain\ValueObjects\Cpf;

$cpf = new Cpf('12345678901');

// 1. Interpolação direta em strings:
echo "Cliente cadastrado com o CPF: {$cpf}\n";
// Imprime: "Cliente cadastrado com o CPF: 123.456.789-01"

// 2. Coerção explícita:
$formattedString = (string) $cpf;
```

## 2. Objetos Invocáveis (_Functors_): `__invoke()`

O método `__invoke(...$args): mixed` permite que uma instância de classe seja
**executada diretamente como se fosse uma função**: `$objeto($arg1, $arg2)`.

Uma classe que implementa `__invoke()` é considerada um **_Invokable_** e é
automaticamente compatível com o tipo nativo **`callable`** do PHP.

### Caso de Uso: Controladores de Ação Única e Handlers de Comando

Em arquiteturas modernas (como Clean Architecture e CQRS), é uma excelente
prática criar classes que executam apenas **uma única ação de negócio coesa**:

```php
<?php

declare(strict_types=1);

namespace App\Domain\Actions;

use App\Domain\ValueObjects\Cpf;

final readonly class RegisterUserAction
{
    public function __invoke(string $name, Cpf $cpf): array
    {
        // Executa a lógica de cadastro da ação:
        echo "Registrando usuário: {$name} | CPF: {$cpf}\n";

        return [
            'id' => bin2hex(random_bytes(4)),
            'name' => $name,
            'cpf' => (string) $cpf,
            'status' => 'ACTIVE'
        ];
    }
}
```

Executando o objeto como uma função:

```php
<?php

declare(strict_types=1);

use App\Domain\Actions\RegisterUserAction;
use App\Domain\ValueObjects\Cpf;

$action = new RegisterUserAction();
$cpf = new Cpf('98765432100');

// Executa a instância diretamente:
$user = $action(name: 'Beatriz Lima', cpf: $cpf);

echo "ID gerado: {$user['id']}\n";
```

> 💡 **É possível fazer Sobrecarga (_Overload_) de `__invoke()`?**
>
> Assim como qualquer outro método no PHP, **não é possível ter múltiplas
> declarações de `__invoke()` com assinaturas diferentes na mesma classe** (o
> PHP emitirá o erro fatal `Cannot redeclare Class::__invoke()`).
>
> Para aceitar múltiplos formatos ou tipos de entrada em um invocável,
> utilizamos os recursos modernos de tipagem do PHP 8+:
>
> 1. **Union Types (`TipoA|TipoB`):** `public function
__invoke(int|string|UserDto $input)` combinado com checagem de tipos
>    (`is_int()`, `instanceof`).
> 2. **Parâmetros Opcionais e Nomeados:** Definir valores padrão para parâmetros
>    secundários (`?string $role = null`).
> 3. **Argumentos Variádicos (`...$args`):** `public function __invoke(mixed
...$args)`.

## 3. Acesso Dinâmico a Propriedades: `__get()` e `__set()`

Os métodos `__get()` e `__set()` são acionados pelo PHP ao tentar ler ou gravar
em propriedades que **não existem** ou que **são inacessíveis** (privadas ou
protegidas) a partir do escopo atual:

- **`__get(string $name): mixed`:** Disparado ao ler
  `$obj->propriedadeInexistente`.
- **`__set(string $name, mixed $value): void`:** Disparado ao atribuir
  `$obj->propriedadeInexistente = $valor`.
- **`__isset(string $name): bool`:** Disparado ao executar `isset($obj->prop)`
  ou `empty($obj->prop)`.
- **`__unset(string $name): void`:** Disparado ao executar `unset($obj->prop)`.

### Exemplo: Contêiner de Dados Imutável / DTO Flexível

```php
<?php

declare(strict_types=1);

namespace App\Infrastructure;

use OutOfRangeException;

final class DynamicParameters
{
    /** @var array<string, mixed> */
    private array $storage = [];

    public function __set(string $name, mixed $value): void
    {
        $this->storage[$name] = $value;
    }

    public function __get(string $name): mixed
    {
        if (!array_key_exists($name, $this->storage)) {
            throw new OutOfRangeException("A propriedade [{$name}] não foi configurada.");
        }

        return $this->storage[$name];
    }

    public function __isset(string $name): bool
    {
        return isset($this->storage[$name]);
    }
}

$params = new DynamicParameters();
$params->timeout = 30;
$params->environment = 'staging';

echo "Timeout configurado: {$params->timeout}s\n"; // 30s
echo "Ambiente: {$params->environment}\n";         // staging
```

> ⚠️ **Aviso de Arquitetura:**
>
> Com a introdução de **Constructor Property Promotion** e propriedades
> **`readonly`** no PHP 8.1+, o uso de `__get` e `__set` para simular
> propriedades deve ser evitado em entidades centrais de domínio, pois eles
> ocultam os tipos da IDE e de ferramentas de análise estática como o PHPStan.

## 4. Interceptação de Chamadas de Métodos: `__call()` e `__callStatic()`

- **`__call(string $name, array $arguments): mixed`:** Disparado ao chamar um
  método de instância que não existe.
- **`__callStatic(string $name, array $arguments): mixed`:** Disparado ao chamar
  um método estático inexistente (`Classe::metodoInexistente()`).

### Caso de Uso: Padrão Decorator / Proxy (Delegação Dinâmica)

```php
<?php

declare(strict_types=1);

namespace App\Infrastructure\Logging;

final class LoggingProxy
{
    public function __construct(
        private readonly object $targetInstance
    ) {}

    /**
     * @param array<int, mixed> $arguments
     */
    public function __call(string $methodName, array $arguments): mixed
    {
        echo "[LOG]: Executando método [{$methodName}()]...\n";

        // Delega a execução para o objeto real encapsulado:
        return $this->targetInstance->$methodName(...$arguments);
    }
}

class EmailSender
{
    public function send(string $to, string $subject): bool
    {
        echo "Enviando e-mail para {$to} com assunto '{$subject}'\n";
        return true;
    }
}

$realSender = new EmailSender();
$proxy = new LoggingProxy($realSender);

// Chama o método 'send' através do Proxy que intercepta a chamada:
$proxy->send('diretoria@fatec.sp.gov.br', 'Relatório Semestral');
```

**Saída do programa:**

```text
[LOG]: Executando método [send()]
Enviando e-mail para diretoria@fatec.sp.gov.br com assunto 'Relatório Semestral'
```

## 5. Proteção de Dados Sensíveis: `__debugInfo()`

Ao executar `var_dump()` ou inspecionar um objeto em ferramentas de depuração e
logs de erro, o PHP exibe todas as propriedades internas do objeto por padrão.

O método `__debugInfo(): array` permite **customizar ou mascarar quais dados são
exibidos na depuração**, evitando o vazamento acidental de senhas, chaves de API
ou tokens de cartão de crédito em logs:

```php
<?php

declare(strict_types=1);

namespace App\Security;

final class DatabaseCredentials
{
    public function __construct(
        public readonly string $host,
        public readonly string $user,
        private readonly string $password,
        private readonly string $apiSecretToken
    ) {}

    // Mascara campos sensíveis na depuração:
    public function __debugInfo(): array
    {
        return [
            'host' => $this->host,
            'user' => $this->user,
            'password' => '******** (REDACTED)',
            'apiSecretToken' => '******** (REDACTED)',
        ];
    }
}

$creds = new DatabaseCredentials('db.fatec.sp.gov.br', 'admin', 'SuperSecret@123', 'tok_live_9988');

// A senha e o token nunca são impressos em texto claro no log:
var_dump($creds);
```

**Saída da Inspeção:**

```text
object(App\Security\DatabaseCredentials)#1 (4) {
  ["host"]=>
  string(19) "db.fatec.sp.gov.br"
  ["user"]=>
  string(5) "admin"
  ["password"]=>
  string(21) "******** (REDACTED)"
  ["apiSecretToken"]=>
  string(21) "******** (REDACTED)"
}
```

## Exemplo Completo do Domínio: Pipeline de Pagamento Seguro

Vejamos um exemplo que integra `__toString()`, `__invoke()` e `__debugInfo()` em
um fluxo profissional de processamento de pagamentos:

```php
<?php

declare(strict_types=1);

// 1. Objeto de Valor com representação em texto:
final readonly class Money
{
    public function __construct(
        public int $amountInCents,
        public string $currency = 'BRL'
    ) {}

    public function __toString(): string
    {
        return sprintf('%s %.2f', $this->currency, $this->amountInCents / 100);
    }
}

// 2. Objeto Seguro com proteção contra vazamento em logs:
final readonly class CreditCardPayload
{
    public function __construct(
        public string $holderName,
        private string $cardNumber,
        private string $cvv
    ) {}

    public function __debugInfo(): array
    {
        return [
            'holderName' => $this->holderName,
            'cardNumber' => '**** **** **** ' . substr($this->cardNumber, -4),
            'cvv' => '***',
        ];
    }
}

// 3. Ação Invocável (Functor) que processa a transação:
final readonly class ProcessPaymentAction
{
    public function __invoke(CreditCardPayload $card, Money $total): void
    {
        echo "Processando cobrança no valor de [{$total}] para o titular [{$card->holderName}]...\n";
        echo "Pagamento aprovado com sucesso!\n";
    }
}

// 4. Execução do fluxo:
$price = new Money(amountInCents: 14990); // R$ 149,90
$card = new CreditCardPayload('Lucas Ferreira', '4111222233334444', '123');
$processor = new ProcessPaymentAction();

// Invocação direta do handler:
$processor($card, $price);

// Log seguro:
var_dump($card);
```

## Tabela Resumo dos Métodos Mágicos

| Método Mágico             | Gatilho de Execução                        | Retorno Esperado | Cenário de Uso Recomendado                     |
| :------------------------ | :----------------------------------------- | :--------------- | :--------------------------------------------- |
| **`__construct()`**       | Instanciação com `new`                     | `void`           | Inicialização de dependências e estado inicial |
| **`__clone()`**           | Clonagem com `clone`                       | `void`           | Deep copy de objetos aninhados                 |
| **`__toString()`**        | Contexto de string (`echo`, interpolação)  | `string`         | Formatação de Value Objects (`Cpf`, `Money`)   |
| **`__invoke()`**          | Execução da instância como função `$obj()` | `mixed`          | Handlers de Ação Única, Functors e Middlewares |
| **`__debugInfo()`**       | Depuração com `var_dump()`                 | `array`          | Ocultar senhas, tokens e dados sensíveis       |
| **`__get()` / `__set()`** | Leitura/escrita em propriedade inacessível | `mixed` / `void` | Proxies, DTOs dinâmicos e adaptadores          |
| **`__call()`**            | Chamada a método inacessível               | `mixed`          | Delegação dinâmica e decoradores               |

## O Que Vem a Seguir?

Neste capítulo, desmistificamos os **Métodos Mágicos** do PHP, aprendendo a
utilizá-los para transformar objetos em texto (`__toString`), criar ações
invocáveis (`__invoke`) e sanitizar logs de depuração (`__debugInfo`).

No **[Capítulo 32: Atributos e Metadados
Nativos](32-atributos-metadados-nativos.md)**, aprenderemos como substituir
anotações de texto em comentários docblock por **`#[Attribute]`** tipados, e
como frameworks leem metadados através da API de Reflexão do PHP.

---

<a href="30-traits-e-composicao-horizontal.md">← Traits e Composição
Horizontal</a>

<p align="right"><a href="32-atributos-metadados-nativos.md">Próximo: Atributos e Metadados Nativos →</a></p>
