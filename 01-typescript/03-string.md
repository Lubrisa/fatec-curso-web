# 3. String

No capítulo anterior, conhecemos o catálogo de tipos primitivos e aprendemos a
blindar nosso código contra dados inesperados.

Entre todos os primitivos, o tipo **`string`** é, sem dúvida, o mais presente no
dia a dia do desenvolvimento Web: formulários de cadastro, parâmetros de URL,
mensagens de erro, cabeçalhos HTTP e respostas de APIs trafegam
predominantemente como texto.

Neste capítulo, vamos dominar a manipulação moderna de strings, desvendar o
princípio da **imutabilidade** em memória, explorar os métodos essenciais de
inspeção, limpeza e transformação e conhecer a elegância dos **Template
Literals**.

## 1. Princípio Fundamental: Strings São Imutáveis

Um dos conceitos mais importantes que todo desenvolvedor Web precisa
internalizar é que, no JavaScript e no TypeScript, **strings são primitivos 100%
imutáveis**.

Isso significa que **nenhum método de string altera o texto original na
memória**. Todos os métodos sempre calculam e retornam uma **nova string**.

Veja o erro clássico de quem está iniciando:

```typescript
let studentName: string = "ana silva";

// ❌ ERRO COMUM: Achar que o método altera a variável original
studentName.toUpperCase();
console.log(studentName); // Imprime "ana silva" (NADA MUDOU!)

// ✅ FORMA CORRETA: Atribuir o retorno a uma nova constante ou reatribuir a variável
const formattedStudentName = studentName.toUpperCase();
console.log(formattedStudentName); // Imprime "ANA SILVA"
```

## 2. Métodos Essenciais de Manipulação

O JavaScript e o TypeScript fornecem um conjunto robusto de métodos nativos para
manipular textos com eficiência e segurança.

### Inspeção e Busca

Quando recebemos dados de formulários ou de APIs externas, frequentemente
precisamos verificar se determinados padrões existem dentro do texto:

```typescript
const documentName: string = "relatorio-final-2026.pdf";

// 1. includes(): Verifica se o texto contém uma substring (case-sensitive)
const isReport: boolean = documentName.includes("relatorio"); // true
const isDraft: boolean = documentName.includes("rascunho"); // false

// 2. startsWith() e endsWith(): Verificações de prefixo e sufixo
const hasValidPrefix: boolean = documentName.startsWith("relatorio-"); // true
const isPdfFile: boolean = documentName.endsWith(".pdf"); // true

// 3. indexOf(): Retorna o índice da primeira ocorrência (ou -1 se não encontrar)
const extensionIndex: number = documentName.indexOf(".pdf"); // 20
```

### Limpeza e Sanitização

Dados digitados por usuários em caixas de texto costumam vir acompanhados de
espaços em branco indesejados nas extremidades. A limpeza desses dados é
essencial antes de salvar no banco ou enviar para uma API:

```typescript
const userInputEmail: string = "   estudante@fatec.sp.gov.br   \n";

// trim(): Remove espaços e quebras de linha no início e no final
const sanitizedEmail: string = userInputEmail.trim();
console.log(sanitizedEmail); // "estudante@fatec.sp.gov.br"

// trimStart() e trimEnd(): Removem apenas em uma das extremidades
const rawCode: string = "   ABC-123";
console.log(rawCode.trimStart()); // "ABC-123"
```

### Transformação e Substituição

Alterar a caixa das letras ou trocar trechos de texto é uma operação rotineira:

```typescript
const rawCity: string = "são paulo";

console.log(rawCity.toUpperCase()); // "SÃO PAULO"
console.log(rawCity.toLowerCase()); // "são paulo"

const rawPhone: string = "11-99999-8888";

// replace(): Substitui apenas a primeira ocorrência encontrada
const partialCleanPhone: string = rawPhone.replace("-", ""); // "1199999-8888"

// replaceAll(): Substitui todas as ocorrências no texto inteiro
const cleanPhone: string = rawPhone.replaceAll("-", ""); // "11999998888"
```

> **Dica Prática: Uso com Expressões Regulares (RegEx)**
>
> Os métodos `replace` e `replaceAll` também aceitam expressões regulares para
> localizar padrões avançados. Por exemplo, para remover qualquer caractere que
> não seja número de um telefone ou CPF, usamos a expressão `/\D/g`:
>
> ```typescript
> const formattedDocument: string = "123.456.789-00";
> const rawNumbersOnly: string = formattedDocument.replace(/\D/g, "");
> console.log(rawNumbersOnly); // "12345678900"
> ```

### Fatiamento e Divisão

Permitem extrair partes específicas de uma string ou dividi-la em listas:

```typescript
const courseCode: string = "FATEC-DSM-2026";

// slice(inicio, fim): Extrai do índice 0 até o índice 5 (exclusivo)
const institutionPrefix: string = courseCode.slice(0, 5); // "FATEC"

// slice(inicio): Extrai do índice 6 até o final do texto
const courseDetails: string = courseCode.slice(6); // "DSM-2026"

// Índices negativos contam a partir do final:
const yearSuffix: string = courseCode.slice(-4); // "2026"

// split(delimitador): Divide o texto em um array de strings (string[])
const csvRow: string = "Node.js,TypeScript,React,PostgreSQL";
const technologyStack: string[] = csvRow.split(",");
console.log(technologyStack); // ["Node.js", "TypeScript", "React", "PostgreSQL"]

// Muito utilizado para gerar slugs amigáveis de URLs:
const articleTitle: string = "Introdução Completa ao TypeScript Moderno";
const urlSlug: string = articleTitle.toLowerCase().split(" ").join("-");
console.log(urlSlug); // "introdução-completa-ao-typescript-moderno"
```

### Preenchimento e Formatação

Preenchem o início ou o final do texto até que ele atinja um tamanho desejado.
Muito útil para formatar números de pedidos, datas e códigos:

```typescript
const orderNumber: number = 42;

// padStart(tamanhoAlvo, caractereDePreenchimento)
const formattedOrderCode: string = String(orderNumber).padStart(6, "0");
console.log(formattedOrderCode); // "000042"

// Mascarar dados sensíveis (ex: cartão de crédito final 1234):
const lastDigits: string = "1234";
const maskedCard: string = lastDigits.padStart(16, "*");
console.log(maskedCard); // "************1234"
```

### Resumo dos Métodos Mais Utilizados

| Método                       | Finalidade                              | Exemplo de Código                           | Resultado       |
| :--------------------------- | :-------------------------------------- | :------------------------------------------ | :-------------- |
| **`trim()`**                 | Remove espaços das pontas               | `" fatec ".trim()`                          | `"fatec"`       |
| **`toLowerCase()`**          | Converte tudo para minúsculas           | `"FATEC".toLowerCase()`                     | `"fatec"`       |
| **`toUpperCase()`**          | Converte tudo para maiúsculas           | `"web".toUpperCase()`                       | `"WEB"`         |
| **`includes(termo)`**        | Checa se contém o termo                 | `"fatec-web".includes("web")`               | `true`          |
| **`startsWith(prefixo)`**    | Checa se inicia com o prefixo           | `"https://fatec.br".startsWith("https://")` | `true`          |
| **`endsWith(sufixo)`**       | Checa se termina com o sufixo           | `"foto.png".endsWith(".png")`               | `true`          |
| **`replace(alvo, novo)`**    | Substitui a 1ª ocorrência               | `"a-b-c".replace("-", "/")`                 | `"a/b-c"`       |
| **`replaceAll(alvo, novo)`** | Substitui todas as ocorrências          | `"a-b-c".replaceAll("-", "/")`              | `"a/b/c"`       |
| **`slice(inicio, fim)`**     | Extrai fatia de texto                   | `"TypeScript".slice(0, 4)`                  | `"Type"`        |
| **`split(delimitador)`**     | Divide texto em array                   | `"a,b,c".split(",")`                        | `["a","b","c"]` |
| **`padStart(tam, pad)`**     | Preenche à esquerda até atingir tamanho | `"7".padStart(3, "0")`                      | `"007"`         |

> **Regra de Ouro:**
>
> Métodos de string **nunca** alteram a variável original. Sempre capture o
> retorno do método em uma nova constante (`const clean = raw.trim();`) ou
> reatribua a variável para evitar bugs silenciosos de dados não sanitizados.

## 3. Interpolação de Strings: Textos Dinâmicos

Agora que conhecemos as operações sobre strings individuais, como compomos
textos dinâmicos complexos?

### A Dor: Concatenação Frágil com `+`

No JavaScript clássico (antes do padrão ES6 em 2015), montar textos dinâmicos
exigia o operador de soma (`+`), o que tornava o código confuso e frágil:

```javascript
// ❌ JAVASCRIPT LEGADO: Concatenação com operador '+'
function createWelcomeCard(userName, role, unreadMessages) {
  var message =
    "Olá, " +
    userName +
    "!\n" +
    "Seu perfil: " +
    role +
    ".\n" +
    "Você possui " +
    unreadMessages +
    " mensagem(ns) pendente(s).";

  return message;
}

console.log(createWelcomeCard("Luigi", "Instrutor", 3));
```

Essa abordagem apresenta dores graves no dia a dia:

1. **Dificuldade de leitura:** A profusão de aspas (`" + variable + "`) polui o
   código visualmente;
2. **Espaçamentos acidentais:** É fácil esquecer espaços entre palavras ou
   vírgulas;
3. **Quebras de linha manuais:** O uso constante de caracteres de escape como
   `\n` e `\t` dificulta a manutenção de templates longos.

### A Solução Moderna: Template Literals (`` `...` ``)

Os **Template Literals** (delimitados por crases `` ` ``) revolucionaram a forma
como manipulamos textos na Web. Eles oferecem dois superpoderes: **interpolação
de expressões** e **suporte nativo a múltiplas linhas**.

```typescript
// ✅ TYPESCRIPT MODERNO: Template Literals elegantes e tipados
function createWelcomeCard(
  userName: string,
  role: string,
  unreadMessages: number,
): string {
  // O texto preserva quebras de linha e espaços exatamente como digitados:
  return `Olá, ${userName}!
Seu perfil: ${role.toUpperCase()}.
Status: ${unreadMessages > 0 ? `Você possui ${unreadMessages} mensagem(ns) não lida(s).` : "Caixa de entrada limpa!"}`;
}

const cardContent = createWelcomeCard("Luigi", "Instrutor", 3);
console.log(cardContent);
```

#### O Que Pode Entrar no `${...}`?

Dentro do bloco de interpolação `${...}`, você pode inserir qualquer expressão
válida do JavaScript/TypeScript:

```typescript
const itemPrice: number = 49.9;
const itemQuantity: number = 3;

// Cálculos matemáticos:
console.log(`Total: R$ ${(itemPrice * itemQuantity).toFixed(2)}`);

// Operadores ternários:
const isStockAvailable: boolean = true;
console.log(`Disponibilidade: ${isStockAvailable ? "Em estoque" : "Esgotado"}`);

// Chamadas de funções e métodos:
const rawUsername: string = "  aluno_fatec  ";
console.log(`Usuário sanitizado: @${rawUsername.trim().toLowerCase()}`);
```

<details>
<summary>🔍 Aprofundamento: O Que São "Tagged Template Literals"?</summary>

Além do uso convencional com `${...}`, o JavaScript e o TypeScript possuem um
recurso avançado chamado **Tagged Template Literals** (Templates Etiquetados).

Esse recurso permite criar funções que interceptam os pedaços estáticos e os
valores dinâmicos de um template literal antes que eles sejam transformados em
uma string final. Note que a sintaxe é diferente de uma invocação de função
comum:

```typescript
taggerFunction`Texto estático ${dinamicValue} texto estático`;
```

### Como isso funciona por baixo dos panos?

Em vez de simplesmente concatenar tudo em um texto final, o runtime divide a
expressão e entrega duas coisas para a sua função:

1. **Pedaços de texto fixo (1º parâmetro):** Um array contendo os textos
   estáticos que estavam ao redor das variáveis;
2. **Valores interpolados (parâmetros seguintes):** Os valores que você passou
   dentro de cada `${...}`.

Veja um exemplo direto e intuitivo:

```typescript
// A função 'tag' intercepta os pedaços estáticos e a variável interpolada:
function uppercaseTag(pieces: TemplateStringsArray, name: string): string {
  const firstPart = pieces[0]; // "Olá, "
  const secondPart = pieces[1]; // "! Bem-vindo ao curso."
  const interpolatedValue = name; // "Luigi"

  // A função pode transformar o valor antes de montar o resultado:
  return `${firstPart}${interpolatedValue.toUpperCase()}${secondPart}`;
}

const studentName: string = "Luigi";

// Invocamos a função diretamente antes das crases (sem parênteses):
const customMessage = uppercaseTag`Olá, ${studentName}! Bem-vindo ao curso.`;

console.log(customMessage);
// Saída: "Olá, LUIGI! Bem-vindo ao curso."
```

### Por que isso é útil na Web?

Mais adiante em seus estudos, você notará que esse mecanismo é a base de muitas
ferramentas populares do ecossistema Web:

- **Segurança:** Sanitizar e escapar dados de formulários antes de inseri-los em
  bancos de dados;
- **Estilização:** Processar blocos de CSS dinamicamente;
- **Tradução:** Traduzir textos de interfaces automaticamente para múltiplos
  idiomas mantendo as variáveis intactas.

</details>

## O Que Vem a Seguir?

Agora que dominamos a manipulação de primitivos textuais e sua imutabilidade, é
hora de entender como o JavaScript e o TypeScript gerenciam estruturas mais
complexas na memória do computador.

No próximo capítulo, vamos analisar a diferença crucial entre **cópia por
valor** (primitivos) e **cópia por referência** (objetos e arrays), visualizando
a divisão entre **Stack** e **Heap** no runtime.

---

<a href="02-tipos-primitivos-e-especiais.md">← Tipos Primitivos e Especiais</a>

<p align="right"><a href="04-variaveis-e-constantes.md">Próximo: Variáveis e Constantes →</a></p>
