# 02. Métodos de Persistência de Sessão

No [Capítulo 02 de Comunicação e
Protocolos](../comunicacao-e-protocolos/02-o-protocolo-http-e-https.md),
aprendemos que o protocolo HTTP é, por definição e projeto, um protocolo
**_Stateless_ (Sem Estado)**. Isso significa que cada requisição feita ao
servidor é tratada como um evento isolado, independente e sem memória do
passado.

O servidor web não sabe se a requisição que acabou de chegar veio de um
visitante anônimo ou de um estudante da FATEC que acabou de digitar seu usuário
e senha há dois segundos atrás.

No entanto, as aplicações modernas exigem continuidade: precisamos manter o
carrinho de compras do usuário preenchido, permitir que ele navegue entre telas
sem refazer o login a cada clique e proteger áreas administrativas restritas.

Para resolver esse dilema, a indústria desenvolveu dois grandes modelos
arquiteturais para **manter o estado e a identidade do usuário na Web**: as
**Sessões Tradicionais no Servidor (_Stateful Session_)** e a **Autenticação
Baseada em Tokens (_Stateless JWT_)**.

Neste capítulo, você compreenderá a anatomia desses dois modelos, entenderá a
estrutura interna de um **JSON Web Token (JWT)**, comparará suas vantagens e
desvantagens e saberá quando adotar cada abordagem na arquitetura de software.

## A Dor: O Protocolo Sem Memória

Imagine a experiência do usuário se a Web não possuísse mecanismos de sessão:

1. O usuário acessa `/login`, digita suas credenciais e o servidor valida com
   sucesso.
2. Em seguida, ele clica no link para visualizar o `/extrato-bancario`.
3. O navegador dispara uma nova requisição HTTP para `/extrato-bancario`.
4. Como o HTTP não tem memória, o servidor responde: _"Quem é você? Não conheço
   essa requisição. Faça login novamente."_

```mermaid
sequenceDiagram
    autonumber
    actor Usuario as Usuário
    participant Browser as Navegador (Frontend)
    participant Server as Servidor Backend

    Usuario->>Browser: 1. Digita login e senha
    Browser->>Server: POST /login (Credenciais válidas)
    Server-->>Browser: HTTP 200 OK ("Login efetuado com sucesso!")

    Usuario->>Browser: 2. Clica em "Ver Extrato"
    Browser->>Server: GET /extrato (Requisição isolada sem contexto)
    Server-->>Browser: HTTP 401 Unauthorized ("Quem é você? Faça login!")
```

Para que o usuário não precise reenviar login e senha a cada interação, o
servidor precisa emitir um **"comprovante de identidade"** no momento da
autenticação, que será reenviado pelo cliente em todas as requisições seguintes.

A grande divisão arquitetural está em **onde** e **como** esse comprovante é
armazenado e validado.

## Modelo 1: Sessões Tradicionais no Servidor (_Stateful Session_)

No modelo tradicional (muito comum em aplicações com arquitetura monolítica como
PHP, Spring MVC, ASP.NET e Rails):

1. O usuário envia suas credenciais no login.
2. O servidor valida a senha, cria um registro de sessão na sua própria
   **memória RAM ou em um banco de dados de cache (como Redis)**, e associa os
   dados do usuário (ex: `userId: 42`, `role: "admin"`).
3. O servidor gera uma chave aleatória e opaca (o **Session ID**, ex:
   `sess_8a7d9f823a4b`) e a envia de volta no cabeçalho `Set-Cookie`.
4. Em todas as próximas requisições, o navegador envia esse Cookie
   automaticamente.
5. O servidor recebe o `Session ID`, busca na sua tabela de sessões interna e
   recupera quem é o usuário.

```mermaid
sequenceDiagram
    autonumber
    participant Browser as Navegador
    participant Server as Servidor Web
    participant Storage as Banco de Sessões (Redis / Memória)

    Browser->>Server: 1. POST /login (user: "carlos", pass: "123")
    Server->>Storage: 2. Cria sessão e salva { id: 42, role: "admin" }
    Storage-->>Server: Retorna Session ID: "sess_99a8b7"
    Server-->>Browser: 3. Resposta com Cookie: Set-Cookie: sid=sess_99a8b7

    Note over Browser,Server: Próximas requisições automáticas com Cookie
    Browser->>Server: 4. GET /extrato (Cookie: sid=sess_99a8b7)
    Server->>Storage: 5. Consulta: "A quem pertence o sid sess_99a8b7?"
    Storage-->>Server: Retorna { id: 42, role: "admin" }
    Server-->>Browser: 6. HTTP 200 OK com os dados do extrato
```

### Vantagens e Desvantagens do Modelo Stateful

- **✅ Revogação Instantânea de Acesso:** Como o estado reside no servidor, se um
  administrador bloquear a conta do usuário ou se ele clicar em "Sair de todos
  os dispositivos", o servidor simplesmente apaga o registro do Redis e a sessão
  é invalidada no mesmo milissegundo.
- **❌ Gargalo de Escalabilidade Horizontal:** Se a sua aplicação crescer e você
  precisar de 10 instâncias do servidor backend rodando em paralelo, todas as
  máquinas precisam acessar o mesmo banco centralizado de sessões (Redis) a cada
  mísera requisição, criando um ponto único de falha e latência de rede.

## Modelo 2: Autenticação Baseada em Tokens (_Stateless JWT_)

Com a ascensão de arquiteturas modernas baseadas em APIs REST, Microsserviços e
aplicações Frontend desacopladas (SPAs e Mobile), o modelo **_Stateless_** se
tornou o padrão dominante da indústria:

1. O usuário envia suas credenciais no login.
2. O servidor valida a senha e, em vez de salvar uma sessão no banco, gera um
   **Token assinado digitalmente** contendo os dados do usuário dentro dele
   mesmo (geralmente um **JWT — JSON Web Token**).
3. O servidor devolve esse token para o cliente.
4. O cliente anexa o token no cabeçalho HTTP de todas as requisições:
   ```http
   Authorization: Bearer <seu-jwt-aqui>
   ```
5. Quando o servidor recebe a requisição, ele **não precisa consultar nenhum
   banco de dados de sessão**. Ele apenas valida matematicamente a assinatura
   criptográfica do token usando sua chave secreta. Se a assinatura for válida,
   o servidor confia nos dados contidos no próprio token!

```mermaid
sequenceDiagram
    autonumber
    participant Browser as Navegador (Frontend)
    participant Server as Servidor Backend (API)

    Browser->>Server: 1. POST /login (user: "carlos", pass: "123")
    Note over Server: Valida credenciais e GERA o JWT<br/>assinado com chave secreta
    Server-->>Browser: 2. HTTP 200 OK com { token: "eyJhbGciOi..." }

    Note over Browser,Server: Próximas requisições com Header Authorization
    Browser->>Server: 3. GET /extrato<br/>Header: Authorization: Bearer eyJhbGciOi...
    Note over Server: Valida a assinatura matematicamente!<br/>(Sem consultar banco de sessões)
    Server-->>Browser: 4. HTTP 200 OK com os dados do extrato
```

## Anatomia de um JSON Web Token (JWT)

Um **JSON Web Token (JWT)** é uma string longa e compacta composta por **três
partes separadas por pontos (`.`)**:

```text
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTYiLCJuYW1lIjoiQ2FybG9zIiwiYWRtaW4iOnRydWUsImV4cCI6MTcxODAwMDAwMH0.s7r9FkX_q_u7-8Tq0Jv4x2Y3w1z8A9B_C1D2E3F4G5H
└──────────────────────────────────┘.└─────────────────────────────────────────────────────────────────────────────────┘.└─────────────────────────────────────────┘
       1. Header (Cabeçalho)                                     2. Payload (Carga Útil)                                            3. Signature (Assinatura)
```

```mermaid
flowchart TD
    JWT["<b>JSON Web Token (JWT)</b>"]

    H["🔴 <b>1. Header (Cabeçalho)</b><br/>Define o algoritmo de hash e o tipo de token.<br/><code>{ 'alg': 'HS256', 'typ': 'JWT' }</code>"]
    P["🔵 <b>2. Payload (Carga Útil)</b><br/>Contém as informações e permissões do usuário (Claims).<br/><code>{ 'sub': '42', 'name': 'Carlos', 'exp': 1718000000 }</code>"]
    S["🟢 <b>3. Signature (Assinatura)</b><br/>Hash criptográfico gerado pelo servidor para evitar adulteração.<br/><code>HMACSHA256(Base64(H) + '.' + Base64(P), secretKey)</code>"]

    JWT --> H
    JWT --> P
    JWT --> S
```

### 1. Header (Cabeçalho)

Define os metadados técnicos do token, indicando o tipo do objeto (`JWT`) e qual
algoritmo criptográfico foi utilizado para gerar a assinatura (ex: `HS256` para
chave simétrica ou `RS256` para par de chaves pública/privada):

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

### 2. Payload (Carga Útil / _Claims_)

Contém as declarações sobre o usuário e a validade daquele token:

- **`sub` (_Subject_):** O identificador único do usuário (ex: ID no banco).
- **`exp` (_Expiration Time_):** Timestamp Unix de quando o token expira
  obrigatoriamente.
- **`iat` (_Issued At_):** Timestamp Unix de quando o token foi gerado.
- **Campos Customizados:** Nome, e-mail, perfil de acesso (`role: "admin"`).

```json
{
  "sub": "usr_9981",
  "name": "Carlos Silva",
  "role": "instructor",
  "iat": 1717000000,
  "exp": 1717003600
}
```

> **⚠️ REGRA DE OURO VITAL DE SEGURANÇA:**
>
> O formato mais popular de JWT utilizado na Web é o **JWS (_JSON Web
> Signature_)**: ele é **assinado, mas não é criptografado**! O Header e o
> Payload são apenas codificados em Base64URL. Qualquer pessoa que interceptar o
> token pode decodificá-lo e ler todas as informações contidas no payload em
> milissegundos.
>
> **NUNCA armazene senhas, códigos de segurança, chaves secretas ou dados
> bancários no payload de um JWT tradicional.**

<details>
<summary>🔍 <strong>E se eu realmente precisar de um token com dados confidenciais e criptografados?</strong></summary>

Quando uma arquitetura exige que o conteúdo do payload seja confidencial e
completamente ilegível para o cliente ou para terceiros, utilizam-se padrões de
**Tokens Criptografados**:

1. **JWE (_JSON Web Encryption_ — RFC 7516):** É o irmão criptografado do JWT.
   Em vez de apenas assinar, o servidor cifra todo o payload com algoritmos
   criptográficos robustos (como AES-GCM ou RSA-OAEP). Somente quem possui a
   chave privada de decifração no backend consegue enxergar o JSON interno.
2. **PASETO (_Platform-Agnostic Security Tokens_):** Uma alternativa moderna ao
   padrão JWT/JOSE que elimina escolhas perigosas de algoritmos fracos e
   disponibiliza nativamente tokens no modo **`local`**, onde o payload é sempre
   cifrado com criptografia autenticada (AEAD / XChaCha20-Poly1305).

</details>

### 3. Signature (Assinatura Criptográfica)

A assinatura é a garantia de que o token é autêntico e não foi adulterado no
caminho.

O servidor pega o Header em Base64, junta com o Payload em Base64, e aplica uma
função de hash criptográfico utilizando a sua **Chave Secreta privada** (_Secret
Key_):

```text
Assinatura = HMAC-SHA256( Base64(Header) + "." + Base64(Payload), SECRET_KEY )
```

Se um usuário malicioso tentar alterar o seu `role` de `"student"` para
`"admin"` no payload, a assinatura matemática deixará de bater com os dados
adulterados e o servidor rejeitará a requisição instantaneamente como inválida.

## Tabela Comparativa: Stateful vs. Stateless

| Critério                      | Sessões no Servidor (_Stateful_)                                | Tokens JWT (_Stateless_)                                             |
| :---------------------------- | :-------------------------------------------------------------- | :------------------------------------------------------------------- |
| **Onde o estado reside?**     | No servidor backend (Memória / Redis / SQL).                    | No próprio cliente (dentro do payload do token).                     |
| **Escalabilidade Horizontal** | Exige banco de cache compartilhado (Redis) entre os servidores. | **Excelente:** qualquer servidor valida o token sem consultar banco. |
| **Revogação Imediata**        | **Fácil e instantânea:** basta deletar a sessão no servidor.    | **Complexa:** o token é válido até o seu timestamp `exp` expirar.    |
| **Sobrecarga de Rede**        | Mínima (trafega apenas uma string curta de Session ID).         | Maior (o JWT carrega todos os dados do payload a cada requisição).   |
| **Aplicações Desacopladas**   | Mais complexo de integrar com SPAs e Mobile.                    | **Padrão da indústria** para SPAs, APIs REST e Mobile.               |

<details>
<summary>🔍 <strong>Aprofundamento: O Padrão da Indústria (Access Token + Refresh Token)</strong></summary>

Como tokens JWT não podem ser revogados facilmente antes de expirarem, uma boa
prática de arquitetura em produção é dividir a autenticação em dois tokens com
ciclos de vida diferentes:

1. **Access Token (Curta Duração — ex: 15 minutos):**
   - É o JWT enviado no cabeçalho `Authorization` para consumir as APIs.
   - Como expira rapidamente, se for interceptado por alguém, o estrago é
     limitado a poucos minutos.
2. **Refresh Token (Longa Duração — ex: 7 a 30 dias):**
   - É armazenado de forma segura e utilizado **exclusivamente para pedir um
     novo Access Token** quando o anterior expirar, sem forçar o usuário a
     digitar a senha novamente.
   - O Refresh Token pode ser registrado no banco de dados do servidor,
     permitindo que administradores revoguem o acesso de longo prazo a qualquer
     momento.

</details>

---

<a href="01-same-origin-policy-e-cors.md">← Same-Origin Policy e CORS</a>

<p align="right"><a href="03-armazenamento-de-tokens-e-seguranca-no-frontend.md">Próximo: Armazenamento de Tokens e Segurança no Frontend →</a></p>
