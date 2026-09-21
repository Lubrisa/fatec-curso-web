# 19. Manipulação de JSON e Serialização

Nos [Capítulos 15 a 18](15-arrays-indexados-e-associativos.md), aprendemos a
modelar, desestruturar, filtrar, transformar e agregar dados estruturados usando
arrays indexados e associativos no PHP.

No entanto, no desenvolvimento web moderno, aplicações PHP não trabalham de
forma isolada: elas consomem e fornecem dados para navegadores, aplicativos
móveis e microsserviços através de **APIs REST**.

O formato padrão universal para esse intercâmbio de mensagens é o **JSON**
(_JavaScript Object Notation_). Neste capítulo, aprenderemos a converter
estruturas de dados do PHP em texto JSON (**serialização**) e transformar textos
JSON em estruturas manipuláveis no PHP (**desserialização**), aplicando as
melhores práticas de tratamento de erros com `JsonException` e flags de
segurança.

```mermaid
flowchart LR
    subgraph PHP ["Ambiente PHP (Memória)"]
        A["Array Associativo / Coleção"]
    end

    subgraph Formato ["Intercâmbio Web (HTTP)"]
        J["String JSON Formatada<br/><code>{\"status\": \"paid\"}</code>"]
    end

    A -->|"json_encode()"| J
    J -->|"json_decode(..., true)"| A
```

## Serialização: Convertendo Dados do PHP em JSON com `json_encode()`

A **serialização** (ou _encoding_) é o processo de transformar estruturas de
memória (como arrays e tipos primitivos) em uma sequência de texto padronizada
em formatos como JSON, XML, YAML, etc. Neste capítulo focaremos em JSON.

No PHP, isso é feito pela função **`json_encode()`**.

### Como o PHP Mapeia Tipos para JSON

O PHP converte automaticamente seus tipos internos para os tipos equivalentes do
padrão JSON:

| Tipo no PHP                              | Equivalente em JSON | Exemplo de Saída                  |
| :--------------------------------------- | :------------------ | :-------------------------------- |
| `int` / `float`                          | `number`            | `42` ou `19.99`                   |
| `string`                                 | `string`            | `"Fatec"`                         |
| `bool`                                   | `boolean`           | `true` ou `false`                 |
| `null`                                   | `null`              | `null`                            |
| **Array Indexado** (índices `0, 1, ...`) | **Array JSON**      | `["Mouse", "Teclado"]`            |
| **Array Associativo** (chaves string)    | **Objeto JSON**     | `{"name": "Mouse", "price": 150}` |

```php
<?php

declare(strict_types=1);

$product = [
    "id"          => 101,
    "name"        => "Monitor UltraWide 29pol",
    "price"       => 1250.90,
    "inStock"     => true,
    "tags"        => ["hardware", "monitores", "promocao"],
    "description" => null,
];

$jsonString = json_encode($product);

echo $jsonString . "\n";
// {"id":101,"name":"Monitor UltraWide 29pol","price":1250.9,"inStock":true,"tags":["hardware","monitores","promocao"],"description":null}
```

### ⚠️ A Armadilha das Chaves Numéricas Esparsas

Um detalhe vital que conecta este capítulo ao [Capítulo
18](18-funcoes-nativas-de-manipulacao-de-arrays.md): o PHP só converte um array
para **Lista JSON (`[...]`)** se seus índices numéricos forem **estritamente
sequenciais iniciando do zero (`0, 1, 2, ...`)**.

Se um array tiver índices faltando (por exemplo, após um `unset()` ou um
`array_filter()`), o PHP o converterá para um **Objeto JSON (`{...}`)**:

```php
<?php

declare(strict_types=1);

$tags = ["web", "php", "backend"]; // Índices: 0, 1, 2
unset($tags[1]);                   // Restam os índices: 0 e 2

// ❌ SEM REINDEXAÇÃO: Vira um Objeto JSON com chaves como strings!
echo json_encode($tags) . "\n";
// {"0":"web","2":"backend"}

// ✅ COM REINDEXAÇÃO (array_values): Volta a ser uma Lista JSON sequencial!
echo json_encode(array_values($tags)) . "\n";
// ["web","backend"]
```

## Flags Essenciais de Configuração no `json_encode()`

Por padrão, `json_encode()` escapa caracteres acentuados (transformando `"ação"`
em `"\u00e7\u00e3o"`) e barras (transformando `"https://site.com"` em
`"https:\/\/site.com"`).

No PHP moderno, combinamos **flags de configuração** usando o operador bitwise
`|` para gerar JSONs limpos e legíveis:

| Flag                         | Finalidade                                                               | Quando Usar                        |
| :--------------------------- | :----------------------------------------------------------------------- | :--------------------------------- |
| **`JSON_UNESCAPED_UNICODE`** | Preserva caracteres UTF-8 (acentos, emojis) sem converter para `\uXXXX`. | **Sempre em APIs modernas**.       |
| **`JSON_UNESCAPED_SLASHES`** | Evita o escape de barras `/` (como em URLs).                             | **Sempre em APIs modernas**.       |
| **`JSON_PRETTY_PRINT`**      | Formata o JSON com indentação e quebras de linha legíveis.               | Logs, depuração e ferramentas CLI. |
| **`JSON_THROW_ON_ERROR`**    | Lança uma `JsonException` em caso de falha em vez de retornar `false`.   | **Sempre (padrão de segurança)**.  |

### Exemplo Recomendado para Respostas de APIs

```php
<?php

declare(strict_types=1);

$apiResponse = [
    "status"  => "success",
    "message" => "Usuário autenticado com sucesso!",
    "profile" => [
        "name"     => "Júlia Müller",
        "avatar"   => "https://cdn.fatec.sp.gov.br/avatars/julia.png",
    ],
];

// ✅ Combinação recomendada para APIs REST:
$json = json_encode(
    $apiResponse,
    JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT | JSON_THROW_ON_ERROR
);

echo $json . "\n";
```

**Saída Formatada e Limpa:**

```json
{
  "status": "success",
  "message": "Usuário autenticado com sucesso!",
  "profile": {
    "name": "Júlia Müller",
    "avatar": "https://cdn.fatec.sp.gov.br/avatars/julia.png"
  }
}
```

## Desserialização: Decodificando JSON com `json_decode()`

A **desserialização** (ou _decoding_) é o processo inverso: receber uma string
em um formato como JSON (vinda de um payload HTTP `POST` ou de um arquivo
`.json`) e transformá-la em tipos nativos do PHP.

Isso é feito com a função **`json_decode()`**.

### A Escolha Crucial: Objeto `stdClass` vs Array Associativo

Por padrão, `json_decode($json)` converte objetos JSON em instâncias da classe
genérica **`stdClass`**.

Para decodificar objetos JSON como **Arrays Associativos**, devemos passar
`associative: true` (ou `true` como segundo argumento):

```php
<?php

declare(strict_types=1);

$jsonPayload = '{"id": 42, "title": "Aprender PHP 8", "completed": false}';

// 1. Padrão: Decodifica como objeto stdClass
$asObject = json_decode($jsonPayload);
echo $asObject->title . "\n"; // Acesso com seta: ->

// 2. Recomendado: Decodifica como Array Associativo ($associative = true)
$asArray = json_decode($jsonPayload, associative: true);
echo $asArray["title"] . "\n"; // Acesso com colchetes: ["title"]
```

### Qual Abordagem Utilizar?

No desenvolvimento de APIs e rotinas de backend:

- **Array Associativo (`associative: true`):** É a abordagem predominante no PHP
  porque permite usar todas as funções nativas de manipulação que aprendemos no
  [Capítulo 18](18-funcoes-nativas-de-manipulacao-de-arrays.md) (`array_map`,
  `array_filter`, desestruturação `[$a, $b]`, spread `...`).
- **Objetos `stdClass`:** São objetos genéricos sem métodos nem tipagem de
  propriedades; em código moderno orientado a objetos, quando queremos trabalhar
  com objetos tipados, mapeamos os dados para **Classes de Domínio / DTOs**
  customizadas (que estudaremos no [Capítulo 20](20-classes-e-objetos.md)).

## Tratamento Seguro de Erros: A Flag `JSON_THROW_ON_ERROR`

### A Dor Histórica: Falhas Silenciosas

Historicamente, quando `json_decode()` encontrava uma string JSON corrompida ou
inválida, ela simplesmente retornava `null`.

Isso gerava um problema crônico: **como diferenciar um JSON corrompido de um
JSON válido que continha literalmente o valor `"null"`?**

```php
<?php

// ❌ ABORDAGEM ANTIGA: Retorna null em ambos os casos, mascarando erros de sintaxe
$validNull   = json_decode('null');         // Retorna null (sucesso)
$brokenJson  = json_decode('{"name": "Ana'); // Retorna null (falha de sintaxe!)
```

### A Solução Moderna: `JsonException`

A partir do PHP 7.3+, podemos passar a flag **`JSON_THROW_ON_ERROR`**. Sempre
que o texto JSON for inválido ou a conversão falhar, o PHP lançará uma
**`JsonException`** nativa, permitindo o tratamento elegante com `try-catch`:

```php
<?php

declare(strict_types=1);

$invalidJson = '{"status": "active", "code": 100'; // Falta fechar a chave '}'

try {
    // ✅ Falhas de sintaxe lançam uma exceção tipada imediatamente
    $data = json_decode($invalidJson, associative: true, flags: JSON_THROW_ON_ERROR);
    echo "Dados processados com sucesso!\n";
} catch (JsonException $e) {
    echo "Falha ao processar payload JSON: " . $e->getMessage() . "\n";
    // Saída: Falha ao processar payload JSON: Syntax error
}
```

<details>
<summary>Aprofundamento: Objetos Customizados e a Interface JsonSerializable</summary>

Quando passamos um objeto para `json_encode()`, por padrão o PHP serializa
apenas suas propriedades públicas.

Se quisermos controlar exatamente quais propriedades (mesmo privadas) devem
aparecer no JSON e como devem ser formatadas, a classe deve implementar a
interface nativa **`JsonSerializable`**:

```php
<?php

declare(strict_types=1);

class UserAccount implements JsonSerializable
{
    public function __construct(
        private int $id,
        private string $name,
        private string $passwordHash, // Dado sensível que NÃO deve vazar no JSON
        private float $balance
    ) {}

    // Define a representação customizada que irá para o JSON
    public function jsonSerialize(): array
    {
        return [
            "id"      => $this->id,
            "name"    => $this->name,
            "balance" => "R$ " . number_format($this->balance, 2, ",", "."),
            // 'passwordHash' foi omitido com segurança!
        ];
    }
}

$user = new UserAccount(1, "Carlos Drummond", '$2y$10$abc...', 1450.0);
echo json_encode($user, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n";
```

</details>

## Exemplo Real: Endpoint Receptor de Webhooks / APIs

Vamos unir todos os conceitos em uma função realista de backend que recebe uma
string JSON de uma requisição externa, valida o payload e responde com uma
confirmação serializada:

```php
<?php

declare(strict_types=1);

function processPaymentWebhook(string $rawJsonBody): string
{
    try {
        // 1. Desserialização estrita com captura de erros
        $payload = json_decode(
            $rawJsonBody,
            associative: true,
            flags: JSON_THROW_ON_ERROR
        );

        // 2. Validação básica de campos obrigatórios
        if (!isset($payload["transactionId"], $payload["amount"], $payload["status"])) {
            throw new InvalidArgumentException("Campos obrigatórios ausentes no webhook.");
        }

        // 3. Processamento das regras de negócio
        $isSuccess = $payload["status"] === "approved";

        $responsePayload = [
            "success"       => true,
            "transactionId" => $payload["transactionId"],
            "processedAt"   => date("Y-m-d H:i:s"),
            "status"        => $isSuccess ? "CONFIRMED" : "REJECTED",
        ];

        // 4. Serialização limpa da resposta HTTP
        return json_encode(
            $responsePayload,
            JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR
        );

    } catch (JsonException $e) {
        // Resposta de erro de sintaxe JSON
        return json_encode([
            "success" => false,
            "error"   => "Payload JSON inválido: " . $e->getMessage(),
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

    } catch (InvalidArgumentException $e) {
        // Resposta de erro de validação
        return json_encode([
            "success" => false,
            "error"   => $e->getMessage(),
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }
}

// Teste com payload válido:
$webhookPayload = '{"transactionId": "TRX-9981", "amount": 250.0, "status": "approved"}';
echo processPaymentWebhook($webhookPayload) . "\n";
// {"success":true,"transactionId":"TRX-9981","processedAt":"...","status":"CONFIRMED"}
```

## Boas Práticas na Manipulação de JSON

1. **Sempre use `JSON_THROW_ON_ERROR`:** Nunca confie em verificações manuais de
   `null` após `json_decode()`. Trate exceções com `JsonException`.
2. **Adote `associative: true` por Padrão no Backend:** Arrays associativos
   permitem manipulação declarativa e segura com as funções nativas do PHP.
3. **Sempre ative `JSON_UNESCAPED_UNICODE` e `JSON_UNESCAPED_SLASHES` em APIs:**
   Isso reduz o tamanho do payload e mantém URLs e textos em português
   perfeitamente legíveis.
4. **Reindexe Arrays com `array_values()` antes do Encoding:** Evite que listas
   filtradas sejam acidentalmente serializadas como objetos `{ "0": ..., "2":
... }`.
5. **Nunca Serialize Dados Sensíveis Diretamente:** Sempre selecione os campos
   necessários (via DTOs, `array_map` ou `JsonSerializable`) para evitar o
   vazamento de senhas, hashes ou tokens de segurança.

## O Que Vem a Seguir?

Com este capítulo, concluímos com sucesso o **Bloco 4: Coleções & Manipulação de
Dados**, dominando desde a modelagem de arrays associativos até o tráfego de
mensagens JSON em APIs.

No **[Bloco 5: Orientação a Objetos Moderna (PHP
8+)](20-classes-e-objetos.md)**, iniciaremos uma nova fase: aprenderemos como o
PHP moderno estrutura domínios complexos com **Classes, Objetos, Construtores
com Property Promotion, Nullsafe (`?->`)** e modificadores de visibilidade
estritos.

---

<a href="18-funcoes-nativas-de-manipulacao-de-arrays.md">← Funções Nativas de
Manipulação de Arrays</a>

<p align="right"><a href="20-classes-e-objetos.md">Próximo: Classes e Objetos →</a></p>
