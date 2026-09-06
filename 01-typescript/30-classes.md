# 30. Classes

Agora que alinhamos o papel da Orientação a Objetos na Web moderna, é hora de
aprender a sintaxe técnica e os recursos que o TypeScript oferece para criar e
estruturar **Classes**.

No TypeScript, uma classe atua com um papel duplo:

1. **Em tempo de execução (JavaScript):** Funciona como um **molde**
   (_blueprint_) para instanciar objetos na memória.
2. **Em tempo de compilação (TypeScript):** Gera automaticamente um **tipo
   estático** com a forma pública da classe, permitindo que você a use como
   anotação de tipo em qualquer parte da aplicação (`const user: User = ...`).

## Anatomia de uma Classe

Uma classe reúne **propriedades** (o estado e dados que o objeto armazena) e
**métodos** (as funções que definem as ações e comportamentos desse objeto):

```typescript
export class User {
  // 1. Declaração de propriedades tipadas:
  name: string;
  email: string;
  isActive: boolean = true; // Valor padrão de inicialização inline

  // 2. Construtor: inicializa a instância
  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
  }

  // 3. Métodos de instância:
  deactivate(): void {
    this.isActive = false;
  }

  getSummary(): string {
    const status = this.isActive ? "ativo" : "inativo";
    return `${this.name} (${this.email}) - Status: ${status}`;
  }
}

// Instanciando objetos a partir do molde:
const student = new User("Alice Silva", "alice@fatec.sp.gov.br");
console.log(student.getSummary()); // Alice Silva (alice@fatec.sp.gov.br) - Status: ativo

student.deactivate();
console.log(student.getSummary()); // Alice Silva (alice@fatec.sp.gov.br) - Status: inativo
```

## Compreendendo a Palavra-chave `this`

Dentro do corpo de uma classe, a palavra-chave **`this`** representa a
**instância concreta e individual** que está executando aquele código no
momento.

Quando criamos múltiplos objetos a partir da mesma classe, cada um possui sua
própria cópia de dados na memória. O `this` é a forma pela qual o objeto acessa
seus próprios dados e métodos:

```typescript
const user1 = new User("Alice", "alice@fatec.sp.gov.br");
const user2 = new User("Bruno", "bruno@fatec.sp.gov.br");

// Quando chamamos user1.getSummary(), o 'this' interno aponta para user1.
// Quando chamamos user2.getSummary(), o 'this' interno aponta para user2.
```

### Evitando Ambiguidade de Nomes

No construtor e nos métodos, é comum que o parâmetro recebido tenha o mesmo nome
da propriedade da classe. O `this.` serve para diferenciar o membro da instância
da variável local/parâmetro:

```typescript
class Product {
  price: number;

  constructor(price: number) {
    // this.price -> A propriedade pertencente à instância do objeto
    // price      -> O argumento recebido pelo parâmetro da função
    this.price = price;
  }
}
```

### O Contexto do `this`: Funções Tradicionais vs Arrow Functions

Um dos comportamentos mais importantes no JavaScript e TypeScript é entender
como o `this` se vincula às funções. Existem duas regras fundamentais:

1. **Funções Tradicionais (`function declaration`, `function expression` e
   métodos padrão de classe):**
   - Possuem um **`this` dinâmico**.
   - O valor de `this` **não** depende de onde a função foi escrita, mas sim de
     **como ela foi chamada**.
   - Se um método tradicional for extraído do objeto e passado como função de
     retorno (_callback_) para um timer ou evento, o vínculo com a instância é
     perdido, fazendo o `this` se tornar `undefined` em modo estrito.

2. **Arrow Functions (`() => {}`):**
   - Possuem um **`this` léxico**.
   - Elas **não criam** seu próprio contexto de `this`. Em vez disso, capturam e
     prendem permanentemente o `this` do escopo onde foram definidas.
   - Isso garante que, mesmo quando passadas como callback para outros locais,
     elas continuam apontando com segurança para a instância correta.

Veja o contraste na prática:

```typescript
// 1. Classe com Método Tradicional (this dinâmico):
export class StandardTimer {
  seconds: number = 0;

  tick(): void {
    this.seconds++;
    console.log(`Segundos: ${this.seconds}`);
  }
}

const timer = new StandardTimer();

// Chamada direta: o chamador antes do ponto é 'timer', então o 'this' funciona:
timer.tick(); // Segundos: 1

// ❌ Problema: Extraindo a função para uma variável ou passando como callback:
const detachedTick = timer.tick;
// detachedTick(); // 💥 Erro em runtime: Cannot read properties of undefined (reading 'seconds')

// Historicamente (antes do ES6), corrigíamos isso criando uma função com vínculo fixo via .bind():
const boundTick = timer.tick.bind(timer);
boundTick(); // Segundos: 3

// Outros métodos de funções podem alterar o contexto de 'this':
detachedTick.call(timer); // Força explicitamente o 'this' a ser a instância 'timer' -> Segundos: 2
detachedTick.call({ seconds: 99 }); // Injeta um objeto totalmente diferente -> Segundos: 100!
```

```typescript
// 2. Classe com Propriedade de Arrow Function (this léxico permanente):
export class SafeTimer {
  seconds: number = 0;

  // A arrow function prende o 'this' da instância no momento em que ela é criada:
  tick = (): void => {
    this.seconds++;
    console.log(`Segundos seguros: ${this.seconds}`);
  };
}

const safeTimer = new SafeTimer();

// Chamada direta através da instância:
safeTimer.tick(); // Segundos seguros: 1

// ✅ Solução moderna: Mesmo desacoplada, a função NUNCA perde o 'this':
const detachedSafeTick = safeTimer.tick;
detachedSafeTick(); // Segundos seguros: 2
```

> **💡 Regra de Ouro da Web Moderna:**
>
> Sempre que precisar passar uma função como _callback_ (seja em `setTimeout`,
> ouvintes de eventos do DOM como `addEventListener`, métodos funcionais de
> array como `.map()` ou callbacks em componentes React/Vue), **use sempre Arrow
> Functions** (declaradas como propriedade de classe ou criadas inline `() => timer.tick()`).
>
> Como o `this` de uma _Arrow Function_ é léxico e imutável, você elimina
> completamente a perda acidental de contexto e a necessidade de usar
> `.bind(this)`. Esse é o motivo primordial pelo qual _Arrow Functions_ se
> tornaram o padrão dominante para funções anônimas e manipuladores na Web
> moderna.

## O Método `constructor` em Detalhes

O **`constructor`** é um método especial de ciclo de vida executado
automaticamente no instante em que usamos o operador **`new`** para criar uma
nova instância.

Sua função principal é alocar recursos e garantir que o objeto nasça em um
estado válido e consistente.

### Regras Fundamentais do Construtor

1. **Construtor Padrão Implícito:** Se você não declarar nenhum construtor em
   uma classe, o JavaScript cria automaticamente um construtor vazio sem
   parâmetros:

   ```typescript
   class EmptyLogger {
     // Construtor implícito gerado pelo runtime: constructor() {}
     log(msg: string): void {
       console.log(msg);
     }
   }
   const logger = new EmptyLogger(); // Funciona normalmente
   ```

2. **Sem Tipo de Retorno:** O construtor **nunca** possui anotação de tipo de
   retorno (nem mesmo `: void`). O retorno da instrução `new MyClass()` é sempre
   a própria instância recém-construída.
3. **Apenas Um Construtor por Classe:** Diferente de linguagens como Java ou C#,
   o JavaScript não suporta múltiplos construtores em tempo de execução. Cada
   classe possui exatamente **uma única implementação de construtor**.

### Inicialização Estrita de Propriedades (`strictPropertyInitialization`)

Por padrão, quando o modo estrito do TypeScript está habilitado (`"strict":
true` no `tsconfig.json`), o compilador ativa a regra
`strictPropertyInitialization`.

Essa regra garante que nenhuma propriedade declarada fique acidentalmente com
`undefined` sem que o construtor a tenha inicializado:

```typescript
// ❌ Erro de compilação: 'role' não foi inicializada no construtor
class Account {
  name: string;
  role: string; // 🚨 Type error: Property 'role' has no initializer and is not definitely assigned in the constructor.

  constructor(name: string) {
    this.name = name;
  }
}
```

```typescript
// ✅ Declaração aceita pelo compilador:
class Account {
  name: string;
  role: string = "student"; // Solução 1: Valor inicial inline
  bio?: string; // Solução 2: Tornar opcional (string | undefined)

  constructor(name: string) {
    this.name = name;
  }
}
```

## O Que Vem a Seguir?

Agora que compreendemos a estrutura de classes, o papel do `this` e o ciclo de
vida do construtor, o próximo passo é proteger o estado interno dos nossos
objetos e eliminar repetições de código.

No **[Capítulo 31: Modificadores](31-modificadores.md)**, vamos aprender a
controlar a visibilidade e o comportamento de propriedades e métodos com
`public`, `private`, `protected`, `readonly`, `static`, campos privados nativos
(`#`), métodos de acesso (`get`/`set`) e o poderoso atalho de **_Parameter
Properties_**.

---

<a href="29-o-paradigma-orientado-a-objetos-na-web.md">← O Paradigma Orientado a
Objetos na Web</a>

<p align="right"><a href="31-modificadores.md">Próximo: Modificadores →</a></p>
