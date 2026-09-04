# 1. Instalação e Primeiro Programa em TypeScript

No módulo anterior, construímos todo o mapa conceitual da Web moderna:
entendemos o papel dos runtimes, dos gerenciadores de pacotes, das linhas de
montagem de código e por que a indústria adotou o TypeScript como padrão.

Agora é o momento de colocar a mão na massa.

Neste capítulo, vamos configurar do zero o ambiente de desenvolvimento,
desvendar a anatomia do arquivo `tsconfig.json` e compilar nosso primeiro
programa em TypeScript.

Ao final desta aula, você terá um fluxo de trabalho profissional funcionando
diretamente no seu terminal e editor de código.

## A Estrutura do Nosso Projeto

Antes de rodar qualquer comando, vamos visualizar a estrutura de pastas e
arquivos que iremos construir:

```text
meu-projeto-ts/
├── node_modules/         <-- Bibliotecas instaladas pelo NPM (não commitada no Git)
├── src/                  <-- Onde escrevemos nosso código TypeScript (.ts)
│   └── index.ts
├── dist/                 <-- Onde o compilador gera o JavaScript puro (.js)
│   └── index.js
├── package.json          <-- Manifesto do projeto e scripts de execução
├── package-lock.json     <-- Trava de versões exatas das dependências
└── tsconfig.json         <-- Configurações do compilador TypeScript
```

Vamos construir esse ambiente passo a passo.

## Passo 1: Inicializando o Projeto com o NPM

Abra o terminal na pasta onde você deseja criar o projeto e execute o comando de
inicialização do NPM:

```bash
npm init -y
```

> **A flag `-y` (_yes_):**
>
> Ao executar apenas `npm init`, o terminal faz uma série de perguntas
> interativas (nome, versão, descrição, autor). A flag `-y` responde
> automaticamente "sim" para todos os valores padrão, gerando o arquivo de forma
> instantânea.

Isso criará o arquivo `package.json` básico.

Abra o `package.json` no seu editor (como o VS Code) e adicione a propriedade
`"type": "module"` para garantir que o Node.js utilize o padrão moderno de
módulos:

```json
{
  "name": "meu-projeto-ts",
  "version": "1.0.0",
  "type": "module",
  "scripts": {},
  "dependencies": {},
  "devDependencies": {}
}
```

## Passo 2: Instalando o TypeScript e as Definições de Tipos

Agora vamos instalar duas ferramentas essenciais utilizando a flag `-D`
(dependências de desenvolvimento):

```bash
npm install -D typescript @types/node
```

Vamos entender o que cada uma faz:

1. **`typescript`:** O compilador oficial da Microsoft (`tsc`), responsável por
   checar os tipos e traduzir arquivos `.ts` para `.js`;
2. **`@types/node`:** Um pacote que ensina ao TypeScript quais são os objetos
   globais nativos do Node.js (como `process`, `console` e módulos de sistema).
   Sem ele, o TypeScript não saberia que o `process` existe fora do navegador.

## Passo 3: Criando e Configurando o `tsconfig.json`

O arquivo **`tsconfig.json`** é o cérebro do compilador TypeScript: ele dita
quais regras de rigor aplicar, para qual versão do JavaScript converter e onde
salvar os arquivos finais.

Para gerar esse arquivo com as configurações padrão, execute no terminal:

```bash
npx tsc --init
```

_(O utilitário `npx` permite executar comandos de ferramentas instaladas
localmente na pasta `node_modules` sem precisar instalá-las globalmente no
sistema operacional)._

### Desmistificando o `tsconfig.json`

Ao abrir o `tsconfig.json` gerado, você verá um arquivo com dezenas de opções
comentadas. Não se assuste! No dia a dia, precisamos nos concentrar em apenas
**5 opções fundamentais**.

Podemos substituir o conteúdo do `tsconfig.json` por esta configuração enxuta e
moderna:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"]
}
```

Vamos entender o papel de cada uma dessas opções:

| Opção                             | O Que Faz?                                     | Por Que É Importante?                                                                         |
| :-------------------------------- | :--------------------------------------------- | :-------------------------------------------------------------------------------------------- |
| **`target`**                      | Define a versão do JavaScript final gerada.    | `ES2022` gera código limpo e moderno suportado por qualquer versão recente do Node.           |
| **`module` / `moduleResolution`** | Define o sistema de módulos.                   | `NodeNext` garante total compatibilidade com o padrão moderno ES Modules (`import`/`export`). |
| **`rootDir`**                     | Indica onde estão os arquivos de código-fonte. | Aponta para a pasta `./src`, mantendo nosso projeto organizado.                               |
| **`outDir`**                      | Indica onde salvar o JavaScript compilado.     | Aponta para a pasta `./dist`, separando o código de produção do código-fonte.                 |
| **`strict`**                      | Ativa a checagem rigorosa de tipos.            | Garante a máxima proteção contra `null`, `undefined` e variáveis sem tipo definido.           |

## Passo 4: Escrevendo o Primeiro Código TypeScript

Crie uma pasta chamada **`src`** na raiz do projeto e, dentro dela, crie um
arquivo chamado **`index.ts`**:

```typescript
function createWelcomeMessage(name: string, semester: number): string {
  return `Olá, ${name}! Bem-vindo ao ${semester}º semestre de Desenvolvimento Web.`;
}

const studentName: string = "Luigi";
const currentSemester: number = 4;

const message = createWelcomeMessage(studentName, currentSemester);
console.log(message);
```

Observe que já estamos utilizando anotações de tipo explícitas (`: string`, `:
number`) nos parâmetros e no retorno da função.

## Passo 5: Compilando e Executando

Agora vamos transformar nosso código TypeScript em JavaScript executável.

No terminal, execute o compilador do TypeScript:

```bash
npx tsc
```

Ao rodar esse comando, você notará que uma nova pasta chamada **`dist`** surgiu
no seu projeto contendo o arquivo **`dist/index.js`**.

Abra o arquivo `dist/index.js` gerado e veja a mágica:

```javascript
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createWelcomeMessage(name, semester) {
  return `Olá, ${name}! Bem-vindo ao ${semester}º semestre de Desenvolvimento Web.`;
}
const studentName = "Luigi";
const currentSemester = 4;
const message = createWelcomeMessage(studentName, currentSemester);
console.log(message);
```

> **Perceba o detalhe vital:**
>
> Todas as anotações `: string` e `: number` **desapareceram**! O compilador
> verificou a integridade de tudo e removeu os "andaimes", gerando um JavaScript
> puro, leve e pronto para rodar.

Agora, execute o arquivo gerado utilizando o Node.js:

```bash
node dist/index.js
```

**Saída no terminal:**

```text
Olá, Luigi! Bem-vindo ao 4º semestre de Desenvolvimento Web.
```

## Passo 6: Automatizando o Fluxo com Scripts no `package.json`

Ficar digitando `npx tsc` e `node dist/index.js` manualmente a cada alteração
cansa rápido.

Abra novamente o seu arquivo **`package.json`** e adicione os seguintes comandos
dentro da seção `"scripts"`:

```jsonc
{
  // ...
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "tsc && node dist/index.js",
  },
  // ...
}
```

Agora você pode usar comandos padronizados:

- **`npm run build`:** Compila todo o código da pasta `src/` para `dist/`;
- **`npm start`:** Executa o código compilado em produção (o NPM permite rodar
  `npm start` direto, sem a palavra `run`);
- **`npm run dev`:** Compila e executa o código em um único comando no terminal.

<details>
<summary>🔍 Dica de Produtividade: Executando TypeScript diretamente com TSX</summary>

Durante o desenvolvimento rápido ou ao resolver exercícios práticos, compilar
para a pasta `dist/` a cada teste pode ser repetitivo.

Existe uma ferramenta leve e ultrarrápida da comunidade chamada **`tsx`**
(_TypeScript Execute_) que roda arquivos `.ts` diretamente na memória em
milissegundos sem precisar gerar a pasta `dist/`:

```bash
# 1. Instalação como dependência de desenvolvimento
npm install -D tsx

# 2. Executar diretamente qualquer arquivo .ts
npx tsx src/index.ts
```

Essa ferramenta é amplamente utilizada em projetos modernos de backend com
Node.js para agilizar o fluxo de desenvolvimento local.

</details>

## Resumo dos Comandos do Setup

| Ação                      | Comando no Terminal                     |
| :------------------------ | :-------------------------------------- |
| **Inicializar projeto**   | `npm init -y`                           |
| **Instalar TypeScript**   | `npm install -D typescript @types/node` |
| **Gerar `tsconfig.json`** | `npx tsc --init`                        |
| **Compilar projeto**      | `npx tsc` _(ou `npm run build`)_        |
| **Executar resultado**    | `node dist/index.js` _(ou `npm start`)_ |

## O Que Vem a Seguir?

Seu ambiente de desenvolvimento TypeScript está perfeitamente configurado,
profissional e funcional!

Agora que dominamos o ciclo de compilação e execução, é hora de mergulharmos nas
entranhas da linguagem:

> _"Como o TypeScript categoriza e manipula os tipos de dados fundamentais
> (`number`, `string`, `boolean`, `null`, `undefined`) e como ele infere tipos
> automaticamente sem que precisemos digitar tudo manualmente?"_

No próximo capítulo, vamos explorar os **Tipos Primitivos e a Inferência
Estática de Tipos**.

---

<a href="../00-ferramental/05-o-que-e-typescript-e-por-que-ele-existe.md">← O
Que É o TypeScript e Por Que Ele Existe?</a>

<p align="right"><a href="02-tipos-primitivos.md">Próximo: Tipos Primitivos em TypeScript →</a></p>
