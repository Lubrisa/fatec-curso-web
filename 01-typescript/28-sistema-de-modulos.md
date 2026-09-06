# 28. Sistema de Módulos

Até este ponto do curso, escrevemos nossos códigos e exemplos concentrados em
arquivos individuais. No entanto, em aplicações Web profissionais — compostas
por dezenas de componentes, serviços de API, validadores e modelos de banco de
dados — manter todo o código em um único arquivo cria um ambiente **impossível
de manter, testar e colaborar em equipe**.

Para organizar projetos escaláveis, o ecossistema moderno adota o padrão oficial
do JavaScript e TypeScript: os **ES Modules (ECMAScript Modules)**.

Neste capítulo, você aprenderá a dividir seu código em módulos independentes,
dominará a diferença prática entre exportações nomeadas e padrão, entenderá a
importância do **`import type`** e aprenderá a configurar o ambiente com
`"type": "module"`.

## A Dor do Código Monolítico

Imagine tentar construir uma aplicação de e-commerce mantendo regras de
autenticação, cálculos de frete, modelos de dados e chamadas de API dentro do
mesmo arquivo `index.ts`:

- **Poluição do Escopo Global:** Variáveis e funções de utilidade interna ficam
  visíveis para todo o projeto, causando colisões de nomes acidentais.
- **Dificuldade de Navegação:** Arquivos com milhares de linhas dificultam a
  localização de erros e a leitura por novos membros do time.
- **Impossibilidade de Reuso:** Não é possível reaproveitar uma função de
  cálculo em outro serviço sem duplicar seu código.

Com o sistema de módulos, **cada arquivo se torna um escopo isolado**: nada é
visível para o mundo externo a menos que você decida explicitamente exportar.

## Exportações Nomeadas (_Named Exports_)

Uma **Exportação Nomeada** permite disponibilizar múltiplas variáveis, funções,
classes ou interfaces a partir de um mesmo arquivo, identificando cada elemento
pelo seu nome exato:

```typescript
// mathUtils.ts
export const PI = 3.14159;

export function sum(a: number, b: number): number {
  return a + b;
}

export function multiply(a: number, b: number): number {
  return a * b;
}
```

### Importando Elementos Nomeados

Para consumir esses elementos em outro arquivo, utilizamos chaves `{}` contendo
os nomes correspondentes:

```typescript
// main.ts
import { sum, multiply, PI } from "./mathUtils";

console.log(sum(10, 5)); // 15
console.log(multiply(2, PI)); // 6.28318
```

### Renomeação com `as` (Evitando Conflitos)

Se você importar duas funções com o mesmo nome de módulos diferentes, utilize a
palavra-chave **`as`** para criar um apelido local:

```typescript
import { sum as addNumbers } from "./mathUtils";
import { sum as sumVectors } from "./vectorUtils";

console.log(addNumbers(5, 5));
```

## Exportação Padrão (_Default Export_)

Uma **Exportação Padrão** permite definir um único valor principal como o
representante oficial daquele arquivo:

```typescript
// AuthService.ts
export default class AuthService {
  login(email: string): boolean {
    console.log(`Autenticando ${email}...`);
    return true;
  }
}
```

Ao importar uma exportação padrão, **não utilizamos chaves `{}`**, e podemos
escolher qualquer nome no arquivo de destino:

```typescript
// main.ts (sem chaves {} na importação padrão)
import AuthService from "./AuthService";

const auth = new AuthService();
auth.login("aluno@fatec.sp.gov.br");
```

### 💡 Por que a indústria prefere Exportações Nomeadas?

Embora o `export default` seja suportado nativamente, a maioria dos times de
engenharia de software e guias de estilo modernos prefere **Exportações Nomeadas
por padrão**:

1. **Autocomplete Preciso:** Ao digitar o nome do que você deseja importar
   (variável, função, classe, interface, etc.) no editor, o TypeScript sugere e
   importa automaticamente o arquivo correto.
2. **Refatoração Segura:** Ao renomear algo, o editor consegue editar todas as
   ocorrências automaticamente em todo o projeto. No `export default`, cada
   arquivo pode ter dado um nome arbitrário diferente, quebrando a consistência.

## O Padrão de Barril (_Barrel Pattern_ com `index.ts`)

Conforme sua pasta de código ganha muitos arquivos, importar cada módulo
individualmente pode deixar o cabeçalho do arquivo poluído:

```typescript
// ❌ Muito verboso e repetitivo:
import { User } from "./models/user";
import { Product } from "./models/product";
import { Order } from "./models/order";
```

Para simplificar o consumo, utilizamos o **_Barrel Pattern_** (Padrão de
Barril). Criamos um arquivo `index.ts` dentro da pasta que **re-exporta** todos
os módulos internos:

```typescript
// models/index.ts (re-exportando tudo de forma centralizada)
export * from "./user";
export * from "./product";
export * from "./order";
```

Agora, quem consome a pasta `models` pode importar tudo de uma única fonte
limpa:

```typescript
// ✅ Importação limpa e centralizada:
import { User, Product, Order } from "./models";
```

## Importação Exclusiva de Tipos: `import type`

No TypeScript, tipos e interfaces existem **exclusivamente em tempo de
compilação**. Quando o código é transpilado para JavaScript puro, todos os
`type` e `interface` são 100% apagados (_Type Erasure_).

No entanto, em ferramentas modernas de empacotamento rápido (como Vite, esbuild
e Babel), o compilador às vezes não sabe se um identificador importado é um
valor JavaScript real ou apenas um tipo.

Para garantir que o empacotador saiba que aquilo nunca deve gerar código
JavaScript no _bundle_ final, utilizamos **`import type`**:

```typescript
// Importando o tipo apenas para verificação estática (zero impacto no JS final):
import type { UserRole } from "./models/user";

// Importando uma função executável real:
import { createAdminUser } from "./services/userService";

const role: UserRole = "admin";
createAdminUser("Carlos", role);
```

Também é possível usar a palavra-chave `type` dentro de chaves combinadas:

```typescript
import { createAdminUser, type UserRole } from "./services/userService";
```

> **Regra de Ouro:** Sempre que estiver importando **apenas** interfaces ou
> `type aliases` sem código executável, dê preferência ao `import type`. Isso
> melhora a velocidade do _bundler_ e previne importações circulares fantasmas.

## Do Legado CommonJS aos ES Modules Modernos

Antes da padronização dos ES Modules, o ecossistema Node.js utilizava amplamente
o formato **CommonJS** (CJS). Embora novos projetos utilizem ES Modules por
padrão, você ainda encontrará a sintaxe CommonJS em bases de código legadas,
arquivos de configuração antigos e bibliotecas tradicionais:

```javascript
// 📦 CommonJS (Padrão Legado do Node.js):

// 1. Exportando (mathUtils.js):
module.exports = {
  sum: (a, b) => a + b,
  PI: 3.14159,
};

// 2. Importando (main.js):
const { sum, PI } = require("./mathUtils");
```

### Por que a Web migrou para ES Modules?

1. **Padrão Universal:** ES Modules funcionam nativamente tanto no **navegador**
   quanto no **Node.js/Deno/Bun**.
2. **Análise Estática (_Tree Shaking_):** Como as declarações `import` e
   `export` ficam no topo dos arquivos, ferramentas como Vite e Webpack
   conseguem identificar e eliminar código morto antes de enviar o arquivo final
   para o usuário.
3. **Suporte a Tipos Nativos:** Permite recursos exclusivos do TypeScript como
   `import type`.

### Configuração Moderna: `"type": "module"` no `package.json`

Para indicar ao runtime que os arquivos `.js` e `.ts` do seu projeto devem ser
interpretados nativamente como ES Modules (habilitando `import` e `export` sem
gambiarras), adicionamos `"type": "module"` no `package.json`:

```json
{
  "name": "fatec-web-app",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx src/main.ts"
  }
}
```

Isso garante interoperabilidade moderna em todo o fluxo de desenvolvimento.

<details>
<summary>🔍 <b>Aprofundamento: Importações Dinâmicas (Lazy Loading e Code Splitting)</b></summary>

Além das importações estáticas que ficam no topo do arquivo, o JavaScript
suporta **Importações Dinâmicas** por meio da função `import()`:

```typescript
async function loadAnalyticsModule() {
  // O módulo só é baixado e executado quando a função é chamada:
  const { trackEvent } = await import("./analyticsService");
  trackEvent("user_clicked_checkout");
}
```

### Por que isso é revolucionário na Web?

Em navegadores, carregar todos os módulos de uma aplicação pesada logo na página
inicial deixa o site lento.

Com importações dinâmicas, podemos aplicar **_Lazy Loading_ (carregamento sob
demanda)** e **_Code Splitting_ (divisão de código)**: o navegador baixa apenas
os módulos estritamente necessários para a tela atual, baixando relatórios e
telas administrativas somente se o usuário navegar até elas. Esse é o alicerce
que torna frameworks como React e Next.js tão rápidos!

</details>

## O Que Vem a Seguir?

Agora que você compreende como modularizar e organizar seus arquivos com ES
Modules e `import type`, estamos prontos para explorar a modelagem orientada a
objetos no TypeScript.

No **[Capítulo 29: Classes](29-classes.md)**, aprenderemos a criar classes
modernas no TypeScript, compreendendo propriedades, métodos, construtores e o
atalho de atribuição automática em parâmetros (`Parameter Properties`).

---

<a href="27-tipos-utilitarios.md">← Tipos Utilitários</a>

<p align="right"><a href="29-classes.md">Próximo: Classes →</a></p>
