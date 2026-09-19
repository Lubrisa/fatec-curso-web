# 03. Conteúdo e Atributos Dinâmicos no JSX

No capítulo anterior, aprendemos a anatomia de um componente React e vimos como
estruturar árvores visuais limpas utilizando a sintaxe JSX.

No entanto, até agora, todos os nossos componentes exibiram apenas textos e tags
com valores fixos (estáticos). No desenvolvimento web real, quase nada é
completamente estático: uma interface precisa exibir o nome do usuário logado,
calcular totais de compras, carregar avatares de URLs dinâmicas e aplicar cores
ou estilos de acordo com o estado do sistema.

> _"Como podemos misturar marcação visual com variáveis, expressões matemáticas,
> objetos e regras dinâmicas do TypeScript dentro do JSX?"_

Neste capítulo, você descobrirá o poder das **chaves (`{}`) como a janela para o
JavaScript no JSX**, aprenderá a renderizar dados de variáveis, manipulará
**atributos dinâmicos (`src`, `alt`, `href`, `disabled`, `className`)** e
desmistificará de uma vez por todas a sintaxe de estilos inline com
**`style={{}}`**.

## A Chave de Tudo: O Uso das Chaves (`{}`)

No JSX, o caractere de **chaves `{}`** funciona como um portal mágico: sempre
que você abre uma chave dentro de uma tag, você está dizendo ao React:

> _"Atenção: pause a leitura da marcação visual por um instante e avalie esta
> expressão JavaScript/TypeScript!"_

```tsx
// ✅ As chaves abrem uma janela para o TypeScript dentro do JSX
function Greeting() {
  const studentName = "Carlos Eduardo";
  const currentSemester = 4;

  return (
    <div className="card">
      <h2>Olá, {studentName}!</h2>
      <p>Você está cursando o {currentSemester}º semestre da FATEC.</p>
      <p>Cálculo direto: 2 + 2 é igual a {2 + 2}.</p>
    </div>
  );
}
```

O navegador exibirá o texto já processado com os valores correspondentes das
variáveis e expressões calculadas!

### O Que PODE Entrar Dentro das Chaves?

Dentro de `{}` no JSX, você pode colocar **qualquer expressão válida do
JavaScript/TypeScript** que produza um valor:

- Variáveis simples: `{userName}`;
- Propriedades de objetos: `{user.email}`;
- Expressões matemáticas e lógicas: `{price * quantity}`, `{isOnline ? "Sim" : "Não"}`;
- Chamadas de métodos: `{userName.toUpperCase()}`, `{items.length}`;
- Chamadas de funções utilitárias: `{formatCurrency(totalPrice)}`;
- Template Literals: ``{`Bem-vindo, ${userName}!`}``.

### O Que NÃO PODE Entrar Dentro das Chaves?

Você **não pode** colocar declarações de controle que não retornam um valor
imediato (como blocos `if/else` soltos ou laços `for` tradicionais):

```tsx
// ❌ ERRO DE SINTAXE: 'if' não é uma expressão que produz um valor direto
<p>{if (isOnline) { "Disponível" }}</p>

// ✅ CORRETO: O operador ternário produz um valor direto
<p>{isOnline ? "Disponível" : "Indisponível"}</p>
```

## Como o JSX Trata Diferentes Tipos de Dados

Ao renderizar valores dentro de `{}` no corpo do JSX, o React adota regras
específicas para cada tipo primitivo:

| Tipo de Dado             | Exemplo                 | Comportamento no JSX                                                     |
| :----------------------- | :---------------------- | :----------------------------------------------------------------------- |
| **`string` / `number`**  | `{"FATEC"}`, `{42}`     | Renderiza o texto ou número diretamente na tela                          |
| **`boolean`**            | `{true}`, `{false}`     | **Não renderiza nada** (invisível no DOM)                                |
| **`null` / `undefined`** | `{null}`, `{undefined}` | **Não renderiza nada** (invisível no DOM)                                |
| **`object`**             | `{{ name: "Ana" }}}`    | 💥 **Gera erro!** Objetos não podem ser impressos diretamente como texto |
| **`Array`**              | `{["A", "B", "C"]}`     | Concatena e renderiza os elementos do array lado a lado                  |

> **Por que booleans, null e undefined são invisíveis?**
>
> Esse comportamento é uma funcionalidade intencional do React para facilitar a
> renderização condicional: se uma condição for falsa, o React simplesmente não
> desenha nada no DOM, sem você precisar tratar com `""` vazias.

## Atributos Dinâmicos com Variáveis

Além de exibir texto no interior dos elementos, frequentemente precisamos que as
**propriedades das tags HTML** recebam valores de variáveis do TypeScript.

Para passar uma variável como atributo de uma tag, **substituímos as aspas por
chaves `{}`**:

```tsx
// ✅ Passando variáveis diretamente para os atributos das tags
function UserAvatar() {
  const avatarUrl = "https://avatars.githubusercontent.com/u/1024025";
  const userName = "Mariana Souza";
  const profileLink = "https://github.com/mariana-fatec";
  const isAccountBlocked = false;

  return (
    <div className="avatar-box">
      {/* Imagem dinâmica */}
      <img src={avatarUrl} alt={`Foto de perfil de ${userName}`} />

      {/* Link dinâmico */}
      <a href={profileLink}>Ver perfil completo</a>

      {/* Atributo booleano dinâmico */}
      <button disabled={isAccountBlocked}>Enviar Mensagem</button>
    </div>
  );
}
```

### A Pegadinha Comum: Aspas vs. Chaves em Atributos

Uma das dúvidas mais comuns entre iniciantes é misturar aspas com chaves. Veja a
diferença:

```tsx
// ❌ ERRADO: O React entenderá o texto literal "{avatarUrl}" como o endereço da imagem!
<img src="{avatarUrl}" alt="Avatar" />

// ✅ CORRETO COM VALOR ESTÁTICO (Texto puro):
<img src="https://site.com/foto.jpg" alt="Avatar" />

// ✅ CORRETO COM VALOR DINÂMICO (Variável do TypeScript):
<img src={avatarUrl} alt={userName} />
```

## Classes CSS Dinâmicas (`className`)

Podemos combinar o atributo `className` com expressões JavaScript para aplicar
classes CSS condicionalmente:

```tsx
function NotificationBadge() {
  const unreadCount = 5;
  const isUrgent = true;

  return (
    // Template string com interpolação dentro das chaves {}
    <span className={`badge ${isUrgent ? "badge-danger" : "badge-default"}`}>
      {unreadCount} notificações
    </span>
  );
}
```

<details>
<summary>🔍 Podemos passar um Array de classes diretamente no className?</summary>

Em alguns outros frameworks (como o Vue.js), é comum passar arrays diretamente
para vincular múltiplas classes (`:class="['badge', 'badge-danger']"`).

No **React nativo**, o atributo `className` espera estritamente uma
**`string`**. Se você passar um array de strings diretamente:

```tsx
// ❌ CUIDADO NO REACT: O JavaScript converterá o array chamando .toString()
<span className={["badge", "badge-danger"]}>...</span>
```

O HTML final gerado no navegador será `<span class="badge,badge-danger">` (com
as classes separadas por **vírgula** em vez de espaço), o que **impede** o
navegador de reconhecer e aplicar os estilos CSS!

Para utilizar listas ou arrays de classes no React puro, você deve juntá-los
manualmente com **`.join(" ")`**:

```tsx
// ✅ RECOMENDADO COM ARRAY: Junta os elementos separados por espaço
const classes = ["badge", isUrgent ? "badge-danger" : "badge-default"];

<span className={classes.join(" ")}>...</span>;
```

> **Dica do Ecossistema:** Em projetos reais e no mercado, é muito comum
> utilizar bibliotecas utilitárias consagradas como **`clsx`** ou
> **`classnames`**, que permitem combinar arrays e objetos de classes
> condicionais com limpeza automática: `className={clsx("badge", { "badge-danger": isUrgent })}`.

</details>

## Desmistificando o `style={{}}` (Estilos Inline)

No HTML tradicional, estilizamos elementos inline passando uma string com regras
separadas por ponto e vírgula: `<div style="color: red; font-size: 16px;">`.

No React, o atributo `style` funciona de maneira diferente: **ele recebe um
objeto JavaScript contendo propriedades CSS**.

É por isso que a sintaxe de estilos inline utiliza **chaves duplas `{{ ... }}`**:

```tsx
// ✅ Estilos inline no React com objeto JavaScript
function AlertBox() {
  return (
    <div
      style={{
        backgroundColor: "#fee2e2",
        color: "#991b1b",
        padding: "16px",
        borderRadius: "8px",
        border: "1px solid #f87171",
      }}
    >
      <strong>Atenção:</strong> O prazo de entrega do trabalho encerra hoje!
    </div>
  );
}
```

### A Anatomia das Duas Chaves

Para não esquecer o porquê das duas chaves, veja o que cada uma representa:

```text
              ┌── 2ª chave (interna): Objeto JavaScript com os estilos ──┐
              │                                                          │
              ▼                                                          ▼
<div style={  {   color: "red", fontSize: 16                             }  } />
           ▲                                                                ▲
           │                                                                │
           └── 1ª chave (externa): Abre a janela para o JavaScript no JSX ──┘
```

Você também pode declarar o objeto de estilos separadamente em uma constante do
TypeScript, o que deixa o código ainda mais limpo:

```tsx
const cardStyle: React.CSSProperties = {
  backgroundColor: "#f8fafc",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
};

function StyledCard() {
  return <div style={cardStyle}>Conteúdo com estilo organizado</div>;
}
```

### Regras das Propriedades de Estilo no React

1. **Nomes em camelCase:** Propriedades CSS que usavam hífen no CSS padrão viram
   _camelCase_ no React:
   - `background-color` $\rightarrow$ `backgroundColor`
   - `font-size` $\rightarrow$ `fontSize`
   - `border-radius` $\rightarrow$ `borderRadius`
   - `z-index` $\rightarrow$ `zIndex`
2. **Valores Numéricos:** Propriedades dimensionais aceitam números puros, e o
   React infere automaticamente em pixels (`padding: 16` equivale a `padding: "16px"`).
   Para outras unidades (`rem`, `%`, `vh`), passe como string (`width: "100%"`).

## Exemplo Integrado: Um Cartão de Estudante Completo

Vamos juntar todos os conceitos deste capítulo em um componente realista e
tipado com TypeScript:

```tsx
// 1. Contrato dos dados do estudante
type Student = {
  id: number;
  fullName: string;
  ra: string;
  course: string;
  averageGrade: number;
  isActive: boolean;
  avatarUrl: string;
};

// 2. Componente que consome e renderiza os dados dinamicamente
function StudentCard() {
  // Simulando dados vindos de uma fonte externa
  const student: Student = {
    id: 101,
    fullName: "Beatriz Cristina",
    ra: "12345678-9",
    course: "Desenvolvimento de Software Multiplataforma",
    averageGrade: 8.75,
    isActive: true,
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
  };

  const isApproved = student.averageGrade >= 6.0;

  return (
    <article
      className={`student-card ${student.isActive ? "active" : "inactive"}`}
    >
      <img
        src={student.avatarUrl}
        alt={`Foto de ${student.fullName}`}
        style={{ width: 80, height: 80, borderRadius: "50%" }}
      />

      <div className="student-info">
        <h3>{student.fullName}</h3>
        <p>
          <strong>RA:</strong> {student.ra}
        </p>
        <p>
          <strong>Curso:</strong> {student.course}
        </p>

        <p>
          <strong>Situação: </strong>
          <span
            style={{
              color: isApproved ? "#16a34a" : "#dc2626",
              fontWeight: "bold",
            }}
          >
            {isApproved ? "Aprovado(a)" : "Em Recuperação"} (
            {student.averageGrade.toFixed(1)})
          </span>
        </p>

        <button disabled={!student.isActive}>
          {student.isActive ? "Acessar Histórico" : "Matrícula Trancada"}
        </button>
      </div>
    </article>
  );
}

export default StudentCard;
```

## Tabela Sintética: Sintaxe Estática vs. Dinâmica no JSX

| Elemento              | Sintaxe Estática (Texto Fixo)        | Sintaxe Dinâmica (Com Variáveis)              |
| :-------------------- | :----------------------------------- | :-------------------------------------------- |
| **Texto de Elemento** | `<p>Olá Aluno</p>`                   | `<p>Olá, {student.name}</p>`                  |
| **Caminho de Imagem** | `<img src="foto.jpg" alt="Foto" />`  | `<img src={user.photoUrl} alt={user.name} />` |
| **Endereço de Link**  | `<a href="https://site.com">...</a>` | `<a href={externalLink}>...</a>`              |
| **Classes CSS**       | `<div className="card">`             | `<div className={`card ${status}`}>`          |
| **Desabilitar Botão** | `<button disabled>`                  | `<button disabled={isFormInvalid}>`           |
| **Estilos Inline**    | _(Evite strings manuais)_            | `<div style={{ color: themeColor }}>`         |

<details>
<summary>🔍 O JSX é seguro contra ataques de injeção (XSS)?</summary>

Uma das maiores vantagens do React é a segurança de dados por padrão.

Quando você renderiza uma variável dentro de `{}` no JSX:

```tsx
const userInput = "<script>alert('Ataque XSS!');</script>";

return <div>{userInput}</div>;
```

O React **escapa automaticamente todos os caracteres especiais** antes de
desenhá-los na tela. Em vez de executar a tag `<script>`, o navegador exibirá o
texto puro literalmente na tela, neutralizando qualquer tentativa de injeção de
código malicioso (**Cross-Site Scripting - XSS**).

</details>

## O Que Vem a Seguir?

Neste capítulo, aprendemos a alimentar nossos componentes com variáveis,
expressões calculadas, atributos dinâmicos e estilos inline no JSX.

Agora que nossa tela consegue exibir dados de forma dinâmica e expressiva, o
próximo passo essencial é torná-la **interativa**: como reagir quando o usuário
clica em um botão, digita em um campo ou envia um formulário?

No próximo capítulo, aprenderemos como funcionam os **Eventos no React
(`onClick`, `onChange`)**, a diferença entre **passar uma função por referência
vs invocá-la imediatamente** e como o React manipula eventos com o
**`SyntheticEvent`**!

---

<a href="02-o-ponto-de-entrada-e-componentes.md">← O Ponto de Entrada e a Árvore
de Componentes</a>

<p align="right"><a href="04-eventos-no-react.md">Próximo: Eventos no React: Escutando Interações →</a></p>
