# 13. Desestruturação, Operador Rest e Operador Spread

Nos capítulos anteriores, aprendemos a organizar dados em coleções (arrays e
tuplas) e vimos como é fundamental manipular esses dados de forma previsível e
segura. No entanto, no dia a dia do desenvolvimento de software — especialmente
ao consumir APIs, gerenciar formulários ou trabalhar com bibliotecas modernas
como o React —, é comum precisarmos extrair múltiplos valores de objetos e
arrays ou criar novas versões desses dados sem alterar os originais.

Historicamente, extrair dados ou mesclar estruturas exigia dezenas de linhas de
código repetitivo e propenso a erros. Para resolver isso, o JavaScript moderno
(ES6+) e o TypeScript introduziram três recursos complementares que
transformaram a legibilidade do código: a **Desestruturação** (_Destructuring_),
o operador **Rest** e o operador **Spread**.

## A Dor: O Acesso Manual e Verboso a Propriedades

Imagine que sua aplicação receba os dados de um cliente de um serviço web e
precise extrair o nome, o e-mail e as coordenadas de entrega:

```typescript
// ❌ CÓDIGO VERBOSO: Acesso manual repetitivo a cada propriedade
function processDelivery(user: {
  name: string;
  email: string;
  address: { city: string; coordinates: [number, number] };
}): void {
  const name = user.name;
  const email = user.email;
  const city = user.address.city;
  const latitude = user.address.coordinates[0];
  const longitude = user.address.coordinates[1];

  console.log(
    `Enviando pedido de ${name} (${email}) para ${city} [${latitude}, ${longitude}]`,
  );
}
```

Essa abordagem apresenta três grandes problemas:

1. **Código repetitivo (_Boilerplate_):** O nome do objeto ou array precisa ser
   redigitado para cada propriedade acessada.
2. **Poluição visual:** A lógica central da função fica enterrada sob uma pilha
   de declarações de variáveis intermediárias.
3. **Fragilidade na manipulação:** Criar cópias e mesclar informações sem
   acidentalmente modificar o objeto original exige rotinas manuais extensas.

A desestruturação e os operadores `...` existem exatamente para eliminar essa
fricção.

## 1. Desestruturação de Arrays (_Array Destructuring_)

A desestruturação de arrays permite desempacotar elementos de uma lista ou tupla
em variáveis individuais com base na sua **posição sequencial (índice)**, usando
a sintaxe de colchetes `[...]` no lado esquerdo da atribuição.

### Extração Posicional Básica

Em vez de acessar `items[0]` e `items[1]`, atribuímos as variáveis diretamente
na ordem em que os elementos aparecem:

```typescript
// ✅ RECOMENDADO: Extração direta por posição
const serverCoordinates: [number, number] = [-23.5505, -46.6333];

const [latitude, longitude] = serverCoordinates;

console.log(latitude); // -23.5505
console.log(longitude); // -46.6333
```

### Ignorando Posições Intermediárias

Se você precisa apenas de posições específicas, basta deixar os espaços entre as
vírgulas vazios:

```typescript
const ranking: string[] = ["Alice", "Bob", "Carlos", "Diana"];

// Ignoramos a primeira e a segunda posição com vírgulas
const [, , bronzeMedalist] = ranking;

console.log(bronzeMedalist); // "Carlos"
```

### Valores Padrão (_Default Values_)

Quando uma posição pode não existir (resultando em `undefined`), podemos definir
um valor de contingência (_fallback_) usando `=`:

```typescript
const userSettings: string[] = ["dark-mode"];

// O segundo elemento não existe na lista, então assume "pt-BR"
const [theme, language = "pt-BR"] = userSettings;

console.log(theme); // "dark-mode"
console.log(language); // "pt-BR" (valor padrão acionado)
```

### Inversão de Variáveis (_Swap_) sem Variável Temporária

Um padrão clássico na computação é inverter o conteúdo de duas variáveis. Com
desestruturação, isso é feito em uma única linha elegante:

```typescript
let primaryColor = "#000000";
let secondaryColor = "#FFFFFF";

// Troca atômica de valores
[primaryColor, secondaryColor] = [secondaryColor, primaryColor];

console.log(primaryColor); // "#FFFFFF"
console.log(secondaryColor); // "#000000"
```

## 2. Desestruturação de Objetos (_Object Destructuring_)

Enquanto a desestruturação de arrays se baseia em posições numéricas, a
desestruturação de objetos se baseia nos **nomes das propriedades (chaves)**,
usando a sintaxe de chaves `{...}` no lado esquerdo da atribuição.

### Extração por Nome de Propriedade

As variáveis criadas recebem exatamente o nome das chaves existentes no objeto:

```typescript
const developer = {
  name: "Lucas Silva",
  age: 24,
  role: "Frontend Engineer",
  active: true,
};

// ✅ Extraímos apenas as propriedades necessárias
const { name, role } = developer;

console.log(name); // "Lucas Silva"
console.log(role); // "Frontend Engineer"
```

### Renomeação de Variáveis (_Aliases_)

Caso o nome da propriedade colida com uma variável já existente no escopo ou
seja pouco descritivo, podemos renomeá-la usando a sintaxe `propriedadeOriginal:
novoNome`:

```typescript
const apiResponse = {
  id: "USR-9842",
  title: "Administrador de Sistemas",
};

// Renomeia 'id' para 'userId' e 'title' para 'jobTitle'
const { id: userId, title: jobTitle } = apiResponse;

console.log(userId); // "USR-9842"
console.log(jobTitle); // "Administrador de Sistemas"
```

> **Atenção à sintaxe no TypeScript:**
>
> Na desestruturação de objetos, os dois pontos (`:`) servem para **renomear a
> variável**, e **NÃO** para tipá-la! A tipagem do objeto desestruturado deve
> ser declarada separadamente ou inferida:
>
> ```typescript
> // ❌ ERRADO: O TypeScript interpretará 'string' como o novo nome da variável!
> // const { name: string } = developer;
>
> // ✅ CORRETO: Tipagem explícita após as chaves {} da desestruturação
> const { name }: { name: string } = developer;
> ```

### Valores Padrão em Objetos

Se uma propriedade for opcional ou puder ser `undefined`, podemos atribuir um
valor padrão:

```typescript
const currentUser: {
  username: string;
  theme?: string;
  notificationsEnabled?: boolean;
} = {
  username: "mariadevs",
};

// 'theme' e 'notificationsEnabled' recebem valores padrão caso não estejam definidos
const { username, theme = "system", notificationsEnabled = true } = currentUser;

console.log(theme); // "system"
console.log(notificationsEnabled); // true
```

### Desestruturação Direta em Parâmetros de Funções

Um dos usos mais frequentes e idiomáticos da desestruturação em TypeScript é
declarar as propriedades esperadas diretamente na assinatura da função:

```typescript
// ✅ RECOMENDADO: Desestruturação limpa com tipagem explícita no parâmetro
function sendEmail({
  recipient,
  subject,
  priority = "normal",
}: {
  recipient: string;
  subject: string;
  body: string;
  priority?: "low" | "normal" | "high";
}): void {
  console.log(
    `[Prioridade: ${priority}] Enviando e-mail para ${recipient}: "${subject}"`,
  );
}

sendEmail({
  recipient: "contato@fatec.sp.gov.br",
  subject: "Confirmação de Matrícula",
  body: "Sua matrícula foi confirmada com sucesso.",
});
```

Essa abordagem torna a chamada da função autoexplicativa e elimina a necessidade
de lembrar a ordem de múltiplos parâmetros individuais.

## 3. O Operador Rest (`...`): Coletando Sobras

O operador **Rest** (representado por três pontos `...`) tem a função de
**coletar e agrupar múltiplos elementos restantes** em uma única estrutura
(array ou objeto).

Pense no operador Rest como a gaveta onde você guarda "o restante das coisas".

### 1. Rest em Arrays

Quando desestruturamos os primeiros itens de um array, podemos agrupar todos os
demais em um novo sub-array:

```typescript
const scores: number[] = [100, 95, 88, 72, 65, 50];

// O primeiro valor vai para 'bestScore', o segundo para 'secondBest', e o resto para 'remainingScores'
const [bestScore, secondBest, ...remainingScores] = scores;

console.log(bestScore); // 100
console.log(secondBest); // 95
console.log(remainingScores); // [88, 72, 65, 50]
```

### 2. Rest em Objetos

Podemos extrair campos específicos de um objeto e coletar todas as outras
propriedades em um novo objeto. Isso é muito comum para **sanitizar dados**
(como remover senhas ou tokens antes de trafegar o objeto):

```typescript
const userAccount = {
  id: 101,
  username: "ana_clara",
  email: "ana@fatec.br",
  passwordHash: "a8f5c9e2b1",
  twoFactorEnabled: true,
};

// Remove 'passwordHash' e agrupa as demais propriedades em 'publicProfile'
const { passwordHash, ...publicProfile } = userAccount;

console.log(passwordHash); // "a8f5c9e2b1"
console.log(publicProfile); // { id: 101, username: "ana_clara", email: "ana@fatec.br", twoFactorEnabled: true }
```

### 3. Parâmetros Rest em Funções (_Rest Parameters_)

O operador Rest também pode ser aplicado no último parâmetro de uma função para
permitir que ela receba um número variável de argumentos, empacotando-os
automaticamente em um array tipado:

```typescript
// ✅ Recebe uma categoria obrigatória e N valores de preços adicionais
function calculateOrderTotal(category: string, ...prices: number[]): number {
  let total = 0;

  for (const price of prices) {
    total += price;
  }

  console.log(`Total calculado para a categoria "${category}": R$ ${total}`);

  return total;
}

calculateOrderTotal("Eletrônicos", 1500, 300, 80); // prices será [1500, 300, 80]
calculateOrderTotal("Livros", 50, 42); // prices será [50, 42]
```

> **Regra Obrigatória do Operador Rest:**
>
> O elemento com `...` deve ser **sempre o último** item na lista de
> desestruturação ou na lista de parâmetros da função. Colocar qualquer elemento
> após o Rest gerará um erro de compilação:
>
> ```typescript
> // ❌ ERRO DE COMPILAÇÃO: O Rest deve ser sempre o último parâmetro
> function processUser(name, ...rest, age) {
>   // Erro do compilador: A rest parameter must be last in a parameter list.
> }
> ```

## 4. O Operador Spread (`...`): Espalhando e Compondo Dados

Embora utilize a mesma sintaxe de três pontos (`...`), o operador **Spread** faz
o caminho **inverso** do Rest: ele **desempacota (espalha)** os elementos de uma
estrutura existente dentro de uma nova estrutura.

| Operador           | O que faz                                                    | Contexto de Uso                                                                           |
| :----------------- | :----------------------------------------------------------- | :---------------------------------------------------------------------------------------- |
| **Rest (`...`)**   | **Agrupa** múltiplos valores em uma única variável.          | Lado esquerdo de atribuições (`const [a, ...rest]`) ou parâmetros de funções (`...args`). |
| **Spread (`...`)** | **Espalha** elementos existentes dentro de uma nova coleção. | Lado direito de expressões (`[...list]`, `{ ...obj }`) ou argumentos de chamadas.         |

### 1. Composição e Clonagem Imutável de Arrays

O Spread permite criar novos arrays combinando elementos existentes sem recorrer
a métodos mutadores como `.push()` ou `.splice()`:

```typescript
const frontendTechs: string[] = ["HTML", "CSS", "TypeScript"];
const backendTechs: string[] = ["Node.js", "Express", "PostgreSQL"];

// Mesclando dois arrays em uma nova coleção
const fullStackTechs: string[] = [...frontendTechs, ...backendTechs];
console.log(fullStackTechs);
// ["HTML", "CSS", "TypeScript", "Node.js", "Express", "PostgreSQL"]

// Inserindo novos itens no início e no fim sem modificar o original
const extendedList: string[] = ["Git", ...frontendTechs, "Docker"];
console.log(extendedList);
// ["Git", "HTML", "CSS", "TypeScript", "Docker"]
```

### 2. Criação e Atualização Imutável de Objetos

No desenvolvimento moderno, atualizar o estado de uma aplicação exige criar um
**novo objeto** contendo as alterações, mantendo o objeto original intacto:

```typescript
const originalProduct = {
  id: "PROD-404",
  title: "Teclado Mecânico",
  price: 250,
  inStock: true,
};

// ✅ Cria uma cópia atualizada sobrescrevendo apenas 'price'
const updatedProduct = {
  ...originalProduct,
  price: 220, // Sobrescreve a propriedade 'price' copiada do original
};

console.log(originalProduct.price); // 250 (inalterado!)
console.log(updatedProduct.price); // 220 (novo estado)
```

> **Ordem de Precedência no Spread de Objetos:** Se houver propriedades com o
> mesmo nome, a que for declarada **por último** sobrescreverá a anterior:
>
> ```typescript
> const config = { theme: "light", fontSize: 14 };
> const customConfig = { fontSize: 16, ...config }; // theme: "light", fontSize: 14 (config sobrescreveu 16!)
> const correctedConfig = { ...config, fontSize: 16 }; // theme: "light", fontSize: 16 (16 sobrescreveu config!)
> ```

### 3. Espalhando Elementos como Argumentos de Funções

Se você possui um array de valores e precisa passá-los para uma função que
espera argumentos individuais:

```typescript
const coordinates: [number, number] = [-23.5505, -46.6333];

function setMapCenter(lat: number, lng: number): void {
  console.log(`Centralizando mapa em: Latitude ${lat}, Longitude ${lng}`);
}

// ✅ Espalha a tupla diretamente nos argumentos da função
// Equivalente a: setMapCenter(coordinates[0], coordinates[1]);
setMapCenter(...coordinates);
```

## Resumo Sintático

| Sintaxe                         | Nome                          | Onde é aplicada         | Objetivo Principal                            |
| :------------------------------ | :---------------------------- | :---------------------- | :-------------------------------------------- |
| `const [a, b] = array`          | **Desestruturação de Array**  | Declaração / Atribuição | Extrair itens por índice/posição.             |
| `const { x, y } = object`       | **Desestruturação de Objeto** | Declaração / Parâmetros | Extrair itens pelo nome da propriedade.       |
| `const [a, ...resto] = array`   | **Operador Rest**             | Declaração / Parâmetros | Agrupar as sobras em uma nova estrutura.      |
| `function sum(...nums)`         | **Parâmetros Rest**           | Assinatura de Funções   | Receber número indefinido de argumentos.      |
| `const clone = [...array]`      | **Operador Spread**           | Expressões literais     | Espalhar itens criando uma cópia/fusão.       |
| `const novo = { ...obj, k: v }` | **Operador Spread**           | Expressões literais     | Clonar e atualizar objetos de forma imutável. |

<details>
<summary>🔍 Aprofundamento: Cópia Rasa (<i>Shallow Copy</i>) vs Cópia Profunda (<i>Deep Copy</i>)</summary>

Ao utilizar o operador Spread (`...`) para clonar um objeto ou array, o
JavaScript realiza uma **Cópia Rasa (_Shallow Copy_)**.

Isso significa que as propriedades de tipos primitivos (`number`, `string`,
`boolean`) são copiadas por valor, mas objetos ou arrays aninhados têm apenas
suas **referências de memória** copiadas:

```typescript
const originalUser = {
  name: "Beatriz",
  preferences: {
    theme: "dark",
  },
};

// Clonagem rasa com Spread
const clonedUser = { ...originalUser };

// ⚠️ CUIDADO: Alterar o objeto aninhado afeta ambos!
clonedUser.preferences.theme = "light";

console.log(originalUser.preferences.theme); // "light" (o original foi alterado!)
```

### Como fazer uma Cópia Profunda (_Deep Copy_) Real?

Nos ambientes modernos de JavaScript/TypeScript e navegadores, a plataforma
fornece a função global nativa **`structuredClone()`**, que clona recursivamente
toda a árvore de objetos:

```typescript
// ✅ Cópia profunda completa e segura
const deeplyClonedUser = structuredClone(originalUser);

deeplyClonedUser.preferences.theme = "high-contrast";

console.log(originalUser.preferences.theme); // "light" (preservado!)
console.log(deeplyClonedUser.preferences.theme); // "high-contrast"
```

</details>

---

<a href="12-arrays-e-tuplas.md">← Arrays e Tuplas</a>

<p align="right"><a href="14-metodos-funcionais-de-array.md">Próximo: Métodos Funcionais de Array →</a></p>
