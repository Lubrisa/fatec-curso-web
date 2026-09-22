# 35. Herança e Sobrescrita de Métodos

No capítulo anterior, aprendemos a proteger o estado de nossas classes com
modificadores de acesso, campos privados, métodos estáticos e métodos de acesso
(`get`/`set`).

Entretanto, conforme as regras de negócio de um sistema se expandem, é natural
que diferentes entidades compartilhem dados, fluxos e validações idênticas. Se
não estruturarmos essas entidades de forma adequada, caímos rapidamente na
armadilha do código duplicado e de cascatas de condicionais difíceis de manter.

Neste capítulo, faremos uma jornada construtivista: sairemos de um código
duplicado e acoplado, passaremos pela padronização de contratos com
**Interfaces**, e evoluiremos para o reaproveitamento e especialização de código
utilizando **Herança** (`extends`), o construtor com chamada à superclasse
(`super`) e a sobrescrita segura com **`override`**.

## A Dor Inicial: Código Duplicado e Condicionais Acopladas

Imagine uma plataforma de e-commerce que precisa processar pagamentos via
**Cartão de Crédito** e **Pix**.

Inicialmente, cada meio de pagamento é escrito como uma classe isolada:

```typescript
// ❌ Abordagem Inicial: Classes isoladas sem padronização nem reuso

export class CreditCardPayment {
  public readonly id: string;
  public readonly amountInCents: number;
  public readonly createdAt: Date;
  public readonly cardNumber: string;

  constructor(id: string, amountInCents: number, cardNumber: string) {
    if (amountInCents <= 0) {
      throw new Error("O valor da cobrança deve ser positivo.");
    }
    this.id = id;
    this.amountInCents = amountInCents;
    this.createdAt = new Date();
    this.cardNumber = cardNumber;
  }

  payWithCreditCard(): boolean {
    console.log(`[AUDITORIA] Registrando transação ${this.id}...`);
    console.log(
      `Cobrando R$ ${(this.amountInCents / 100).toFixed(2)} no cartão final ${this.cardNumber.slice(-4)}`,
    );
    console.log(`[AUDITORIA] Transação ${this.id} concluída com sucesso.`);
    return true;
  }
}

export class PixPayment {
  public readonly id: string;
  public readonly amountInCents: number;
  public readonly createdAt: Date;
  public readonly pixKey: string;

  constructor(id: string, amountInCents: number, pixKey: string) {
    if (amountInCents <= 0) {
      throw new Error("O valor da cobrança deve ser positivo.");
    }
    this.id = id;
    this.amountInCents = amountInCents;
    this.createdAt = new Date();
    this.pixKey = pixKey;
  }

  payWithPix(): boolean {
    console.log(`[AUDITORIA] Registrando transação ${this.id}...`);
    console.log(
      `Gerando QR Code Pix de R$ ${(this.amountInCents / 100).toFixed(2)} para ${this.pixKey}`,
    );
    console.log(`[AUDITORIA] Transação ${this.id} concluída com sucesso.`);
    return true;
  }
}
```

O código consumidor que precisa finalizar a compra sofre diretamente com essa
falta de estrutura:

```typescript
// ❌ O consumidor precisa saber qual método chamar com base no tipo
function processCheckout(payment: CreditCardPayment | PixPayment): boolean {
  if (payment instanceof CreditCardPayment) {
    return payment.payWithCreditCard();
  } else {
    return payment.payWithPix();
  }
}
```

Se adicionarmos Boleto, Transferência ou Criptoativos, teremos que alterar a
função `processCheckout` com mais ramificações `else if`, ferindo diretamente o
princípio de extensibilidade.

## Passo 1: Padronizando com Interfaces

Como vimos no [Capítulo 25: Interfaces](25-interfaces.md), podemos resolver a
cascata de `if-else` criando um **contrato unificado** com `interface`:

```typescript
export interface PaymentMethod {
  id: string;
  amountInCents: number;
  process(): boolean;
}
```

Agora, as classes se comprometem a ter o mesmo método `process()` através da
palavra-chave **`implements`**:

```typescript
export class CreditCardPayment implements PaymentMethod {
  public readonly id: string;
  public readonly amountInCents: number;
  public readonly cardNumber: string;

  constructor(id: string, amountInCents: number, cardNumber: string) {
    if (amountInCents <= 0) {
      throw new Error("O valor da cobrança deve ser positivo.");
    }
    this.id = id;
    this.amountInCents = amountInCents;
    this.cardNumber = cardNumber;
  }

  process(): boolean {
    console.log(`[AUDITORIA] Registrando transação ${this.id}...`);
    console.log(`Cobrando no cartão final ${this.cardNumber.slice(-4)}`);
    console.log(`[AUDITORIA] Transação ${this.id} concluída com sucesso.`);
    return true;
  }
}

export class PixPayment implements PaymentMethod {
  public readonly id: string;
  public readonly amountInCents: number;
  public readonly pixKey: string;

  constructor(id: string, amountInCents: number, pixKey: string) {
    if (amountInCents <= 0) {
      throw new Error("O valor da cobrança deve ser positivo.");
    }
    this.id = id;
    this.amountInCents = amountInCents;
    this.pixKey = pixKey;
  }

  process(): boolean {
    console.log(`[AUDITORIA] Registrando transação ${this.id}...`);
    console.log(`Gerando QR Code Pix para ${this.pixKey}`);
    console.log(`[AUDITORIA] Transação ${this.id} concluída com sucesso.`);
    return true;
  }
}
```

A função consumidora agora é perfeitamente desacoplada e polimórfica:

```typescript
// ✅ O consumidor agora depende apenas do contrato comum:
function processCheckout(payment: PaymentMethod): boolean {
  return payment.process();
}
```

### O Problema Residual das Interfaces

A interface resolveu a padronização e o acoplamento do consumidor. Porém,
observe com atenção o interior das classes `CreditCardPayment` e `PixPayment`:

1. **Estado Duplicado:** As propriedades `id`, `amountInCents` e o construtor
   com a validação `amountInCents <= 0` são repetidos identicamente em ambas.
2. **Lógica e Comportamento Duplicados:** O log de auditoria inicial e final
   precisou ser copiado manualmente linha por linha.

> ⚠️ **Limitação das Interfaces:**
>
> Interfaces definem a **forma (o que fazer)**, mas **não compartilham estado
> nem código (como fazer)**.

Para reaproveitar estado e comportamento comum entre classes relacionadas,
precisamos de **Herança**.

## Passo 2: Reutilizando Estado e Lógica com Herança (`extends`)

A palavra-chave **`extends`** estabelece uma relação de parentesco (_"É UM"_)
entre uma classe pai (**superclasse**) e uma classe filha (**subclasse**). A
subclasse adquire automaticamente todas as propriedades e métodos públicos e
protegidos da superclasse.

### Sintaxe Básica de Herança

Para fazer uma classe herdar de outra, basta utilizar a cláusula `extends`:

```typescript
// 1. Superclasse (Classe Pai)
export class BaseEntity {
  public id: string = "id_padrao";
  public createdAt: Date = new Date();

  public printSummary(): void {
    console.log(
      `Entidade ${this.id} criada em ${this.createdAt.toISOString()}`,
    );
  }
}

// 2. Subclasse (Classe Filha)
export class UserAccount extends BaseEntity {
  public name: string = "Usuário Anônimo";
}

// ✅ A subclasse já nasce com todo o comportamento e estado da superclasse:
const account = new UserAccount();
account.id = "usr_4401";
account.name = "Carlos Santana";
account.printSummary(); // "Entidade usr_4401 criada em 2026-..."
```

### O Construtor e a Chamada `super(...)`

Quando a subclasse define seu próprio `constructor`, o TypeScript **obriga** a
chamada de **`super(...)`** na primeira linha. A instrução `super(...)` executa
o construtor da superclasse, inicializando seu estado antes que a subclasse
acesse `this`:

```typescript
// 1. Superclasse com estado e validações compartilhadas:
export class BasePayment {
  public readonly id: string;
  public readonly amountInCents: number;
  public readonly createdAt: Date;
  protected status: "pending" | "approved" | "rejected" = "pending";

  constructor(id: string, amountInCents: number) {
    if (amountInCents <= 0) {
      throw new Error("O valor da cobrança deve ser positivo.");
    }
    this.id = id;
    this.amountInCents = amountInCents;
    this.createdAt = new Date();
  }

  public getFormattedAmount(): string {
    return `R$ ${(this.amountInCents / 100).toFixed(2)}`;
  }

  public getStatus(): string {
    return this.status;
  }
}

// 2. Subclasse que herda de BasePayment:
export class PixPayment extends BasePayment {
  public readonly pixKey: string;

  constructor(id: string, amountInCents: number, pixKey: string) {
    // ⚠️ Obrigatório: repassa os parâmetros para inicializar BasePayment
    super(id, amountInCents);
    this.pixKey = pixKey;
  }

  public generateQrCode(): string {
    // Acesso ao método herdado getFormattedAmount() e à propriedade 'status':
    this.status = "approved";
    return `payload-pix://${this.pixKey}?amount=${this.getFormattedAmount()}`;
  }
}
```

```typescript
const pix = new PixPayment("tx_9901", 8500, "financeiro@fatec.sp.gov.br");

console.log(pix.id); // "tx_9901" (herdado de BasePayment)
console.log(pix.getFormattedAmount()); // "R$ 85.00" (herdado de BasePayment)
console.log(pix.generateQrCode()); // "payload-pix://financeiro@fatec.sp.gov.br?amount=R$ 85.00"
```

### O Modificador `protected` na Herança

Como vimos no [Capítulo 34: Modificadores](34-modificadores.md):

- Propriedades **`private`** pertencem exclusivamente à própria classe e **não
  são acessíveis pelas subclasses**.
- Propriedades **`protected`** continuam ocultas do mundo externo, mas **podem
  ser lidas e alteradas livremente pelas classes filhas**.

No exemplo acima, `status` é declarado como `protected`, permitindo que
`PixPayment` atualize seu valor para `"approved"` dentro de `generateQrCode()`,
enquanto código externo só pode consultar através de `getStatus()`.

> ⚠️ **Aviso de Design: Proteja as Invariantes com `protected`**
>
> Marcar um campo como `protected` **não significa que ele está 100%
> encapsulado**. Se uma superclasse expuser propriedades mutáveis sensíveis como
> `protected` (ex: `protected status: string`), qualquer subclasse poderá
> alterá-las livremente sem passar por validações, **violando as invariantes de
> negócio da classe base por dentro da própria hierarquia**.
>
> **Boas Práticas:**
>
> 1. **Prefira `protected readonly`** para campos que as subclasses apenas
>    precisam ler (como identificadores imutáveis ou configurações fixas).
> 2. **Para estados mutáveis críticos, mantenha-os `private`** e forneça métodos
>    `protected` controlados com validação (ex: `protected updateStatus(...)`)
>    em vez de permitir reatribuição direta pelas subclasses.

### Sobrescrita de Métodos

Uma subclasse pode modificar ou complementar o comportamento de um método
herdado da superclasse. No TypeScript moderno, utilizamos a palavra-chave
**`override`** para indicar explicitamente a sobrescrita:

```typescript
export class BasePayment {
  // ...
  public logAudit(): void {
    console.log(`[AUDITORIA PADRÃO] Transação ${this.id}`);
  }
}

export class AuditedCreditCardPayment extends BasePayment {
  // ✅ Sobrescreve e complementa chamando super.logAudit()
  public override logAudit(): void {
    super.logAudit(); // Executa o comportamento base da superclasse
    console.log(`[AUDITORIA ADICIONAL] Verificação anti-fraude executada.`);
  }
}
```

> 💡 **Por que o modificador `override` é essencial?**
>
> Se alguém renomear `logAudit()` para `recordAudit()` na superclasse:
>
> - **Sem `override`:** O método na classe filha viraria silenciosamente um
>   método novo e nunca seria chamado no fluxo da superclasse.
> - **Com `override`:** O compilador aponta um erro imediato: _"This member
>   cannot have an 'override' modifier because it is not declared in the base
>   class"_.

## Composição vs Herança: Quando Usar Cada Uma?

A herança é uma ferramenta poderosa, mas cria o nível mais forte de
**acoplamento** da Orientação a Objetos: a subclasse fica amarrada aos detalhes
internos de implementação da superclasse. Qualquer alteração ou chamada interna
na classe pai pode quebrar silenciosamente as subclasses — um fenômeno clássico
conhecido como o **Problema da Classe Base Frágil** (_Fragile Base Class
Problem_).

### O Risco da Herança Frágil na Prática

Considere uma classe utilitária de lista de usuários que gerencia inserções:

```typescript
export class UserList {
  protected users: string[] = [];

  public add(user: string): void {
    this.users.push(user);
  }

  public addAll(users: string[]): void {
    for (const user of users) {
      // A classe pai optou por reutilizar internamente seu próprio método add():
      this.add(user);
    }
  }

  public count(): number {
    return this.users.length;
  }
}
```

Agora, imagine que um desenvolvedor cria uma subclasse com o objetivo de
**contabilizar quantas tentativas de inserção foram feitas no sistema**:

```typescript
// ❌ HERANÇA FRÁGIL: A subclasse assume premissas sobre o funcionamento interno do pai
export class LoggedUserList extends UserList {
  private insertionCount: number = 0;

  public override add(user: string): void {
    this.insertionCount++;
    super.add(user);
  }

  public override addAll(users: string[]): void {
    // Incrementa pela quantidade total de usuários recebidos:
    this.insertionCount += users.length;
    super.addAll(users);
  }

  public getInsertionCount(): number {
    return this.insertionCount;
  }
}

const list = new LoggedUserList();
list.addAll(["Alice", "Bob", "Carlos"]);

console.log(`Total inserido registrado: ${list.getInsertionCount()}`);
// ❌ SAÍDA INESPERADA: Total inserido registrado: 6 (Contou em dobro!)
```

**Por que o erro aconteceu?**

Quando `LoggedUserList.addAll()` somou 3 e chamou `super.addAll()`, a classe pai
executou um laço chamando `this.add()` para cada elemento. Como `this` aponta
para a instância concreta da subclasse, o método sobrescrito `add()` foi
disparado mais 3 vezes, duplicando a contagem silenciosamente!

### A Solução com Composição

Se tivermos utilizado **Composição** (mantendo a lista interna como uma
dependência encapsulada e delegando as chamadas), esse efeito colateral oculto
jamais aconteceria:

```typescript
// ✅ COMPOSIÇÃO: Desacoplamento total dos detalhes internos da classe utilitária
export class SafeLoggedUserList {
  private readonly internalList = new UserList();
  private insertionCount: number = 0;

  public add(user: string): void {
    this.insertionCount++;
    this.internalList.add(user);
  }

  public addAll(users: string[]): void {
    this.insertionCount += users.length;
    this.internalList.addAll(users);
  }

  public getInsertionCount(): number {
    return this.insertionCount;
  }

  public count(): number {
    return this.internalList.count();
  }
}

const safeList = new SafeLoggedUserList();
safeList.addAll(["Alice", "Bob", "Carlos"]);

console.log(`Total inserido registrado: ${safeList.getInsertionCount()}`);
// ✅ SAÍDA CORRETA: Total inserido registrado: 3
```

> 💡 **Diretriz de Design:**
>
> Use herança apenas quando houver uma verdadeira relação conceitual de **"É
> UM"** (_um `PixPayment` é um `BasePayment`_).
>
> Quando a relação for de **"TEM UM"** ou **"FAZ USO DE"**, prefira
> **Composição** (receber ou encapsular a dependência internamente).

## O Que Vem a Seguir?

Embora a herança resolva a reutilização de código e estado, surge um dilema:
`BasePayment` representa um conceito genérico que **não deveria ser instanciado
diretamente com `new`**, e ainda não descobrimos como forçar as subclasses a
implementarem métodos específicos mantendo um esqueleto comum.

No **[Capítulo 36: Classes Abstratas](36-classes-abstratas.md)**, vamos
solucionar esse problema introduzindo a palavra-chave **`abstract`**, a
delegação de interfaces para subclasses e o clássico padrão de design **Template
Method**.

---

<a href="34-modificadores.md">← Modificadores de Acesso e Propriedades</a>

<p align="right"><a href="36-classes-abstratas.md">Próximo: Classes Abstratas e Template Method →</a></p>
