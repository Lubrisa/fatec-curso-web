# Notification API

A **Notification API** permite que as aplicações web exibam **notificações
nativas do sistema operacional** diretamente na área de trabalho ou na central
de alertas do dispositivo do usuário (como no Windows, macOS, Linux ou Android).

Essa funcionalidade é especialmente valiosa porque os alertas continuam sendo
entregues e exibidos mesmo quando a aba da sua aplicação estiver minimizada ou
em segundo plano enquanto o usuário navega em outros sites ou utiliza outros
softwares.

Neste capítulo do catálogo, você aprenderá como funciona o fluxo de permissão
para notificações, como instanciar e customizar alertas nativos com ícones e
tags, como reagir a cliques do usuário e como estruturar um serviço de
notificação tipado com TypeScript.

## Requisitos de Segurança e Boas Práticas de UX

Para proteger os usuários contra spam visual e abusos, os navegadores modernos
impõem restrições rigorosas ao uso de notificações:

1. **Contexto Seguro Obrigatório (HTTPS):** A Notification API está disponível
   apenas sob conexões seguras **HTTPS** (com exceção de `localhost` em ambiente
   de desenvolvimento).
2. **Exigência de Interação do Usuário (_User Gesture_):** Os navegadores
   bloqueiam ou ignoram chamadas a `Notification.requestPermission()` que sejam
   executadas automaticamente no carregamento da página (`onload`). A
   solicitação de permissão **deve partir de um gesto intencional do usuário**
   (como o clique em um botão de "Ativar Alertas" ou "Habilitar Notificações").

## O Ciclo de Consentimento e Solicitação de Permissão

Antes de disparar qualquer alerta, é mandatório verificar se a aplicação possui
autorização:

```typescript
// 1. Verifica se o navegador possui suporte à API
if (!("Notification" in window)) {
  console.warn("Este navegador não suporta notificações nativas.");
}

// 2. Consulta o status síncrono atual da permissão
console.log(Notification.permission); // "default" | "granted" | "denied"
```

A propriedade estática **`Notification.permission`** pode retornar três valores:

| Valor           | Significado                                            | Comportamento                                                   |
| :-------------- | :----------------------------------------------------- | :-------------------------------------------------------------- |
| **`"default"`** | O usuário ainda não tomou uma decisão (estado neutro). | O navegador exibirá o diálogo de autorização quando solicitado. |
| **`"granted"`** | O usuário autorizou expressamente as notificações.     | Notificações podem ser criadas e exibidas imediatamente.        |
| **`"denied"`**  | O usuário bloqueou as notificações deste site.         | O navegador rejeita tentativas de exibição silenciosamente.     |

### Solicitando Permissão de Forma Assíncrona

Quando o usuário clica no elemento interativo correspondente, chamamos o método
estático **`Notification.requestPermission()`**:

```typescript
async function requestNotificationAccess(): Promise<boolean> {
  if (!("Notification" in window)) return false;

  // Se já estiver concedida, não precisa solicitar novamente
  if (Notification.permission === "granted") return true;

  // Solicita autorização (abre o prompt nativo do navegador)
  const permission = await Notification.requestPermission();
  return permission === "granted";
}
```

## Criando e Customizando Notificações

Uma notificação é disparada instanciando a classe `Notification`, informando um
título obrigatório e um objeto opcional de opções:

```typescript
const notification = new Notification("Nova mensagem recebida", {
  body: "Carlos enviou um arquivo no canal do projeto.",
  icon: "/icons/chat-icon.png",
});
```

### Opções de Configuração (`NotificationOptions`)

| Propriedade | Tipo      | Descrição                                                                                                                                                                                            |
| :---------- | :-------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `body`      | `string`  | O texto descritivo principal exibido no corpo da notificação.                                                                                                                                        |
| `icon`      | `string`  | URL da imagem ou ícone da aplicação exibido ao lado do texto.                                                                                                                                        |
| `image`     | `string`  | URL de uma imagem de destaque em tamanho maior exibida dentro do corpo do alerta.                                                                                                                    |
| `badge`     | `string`  | URL de um ícone pequeno monocromático para a barra de status (utilizado principalmente em dispositivos móveis).                                                                                      |
| `tag`       | `string`  | Identificador único de agrupamento. Se uma nova notificação for disparada com a mesma `tag` de uma anterior, a antiga será **substituída** pela nova em vez de empilhar centenas de alertas na tela. |
| `renotify`  | `boolean` | Se `true`, o dispositivo emitirá som ou vibração novamente mesmo ao substituir uma notificação por `tag`.                                                                                            |
| `silent`    | `boolean` | Se `true`, exibe o alerta visualmente de forma totalmente silenciosa, sem emitir sons ou vibrações.                                                                                                  |
| `data`      | `any`     | Objeto com dados arbitrários anexados à notificação para serem resgatados durante o clique.                                                                                                          |

### O Papel Vital da Propriedade `tag`

Imagine um chat onde o usuário recebe 10 mensagens em sequência rápida. Se você
disparar 10 notificações sem `tag`, o sistema operacional exibirá 10 cartões
empilhados poluindo a tela.

Ao utilizar a mesma `tag` (ex: `tag: "chat_room_42"`), o navegador mantém apenas
**um único cartão ativo**, atualizando o texto com a mensagem mais recente:

```typescript
function notifyChatMessage(senderName: string, messageText: string): void {
  if (Notification.permission !== "granted") return;

  new Notification(`Mensagem de ${senderName}`, {
    body: messageText,
    icon: "/icons/avatar.png",
    tag: "chat_room_42", // Substitui notificações anteriores desta mesma sala
    renotify: true, // Emite novo bipe/som ao atualizar
  });
}
```

## Ciclo de Eventos e Interações do Usuário

O objeto instanciado de `Notification` emite eventos que permitem sincronizar a
interface e reagir ao clique do usuário:

| Evento  | Propriedade | Momento de Disparo                                                       |
| :------ | :---------- | :----------------------------------------------------------------------- |
| `click` | `onclick`   | Disparado quando o usuário clica no corpo da notificação.                |
| `close` | `onclose`   | Disparado quando a notificação é fechada (pelo usuário ou pelo sistema). |
| `error` | `onerror`   | Disparado se o sistema operacional falhar ao renderizar a notificação.   |

### Exemplo: Focando na Aba ao Clicar e Fechamento Automático

```typescript
function showInteractiveAlert(taskId: string, taskTitle: string): void {
  if (Notification.permission !== "granted") return;

  const notification = new Notification("Tarefa Próxima do Prazo!", {
    body: `A tarefa "${taskTitle}" vence em 15 minutos.`,
    icon: "/icons/calendar.png",
    data: { taskId, targetUrl: `/tasks/${taskId}` },
  });

  // 1. Ao clicar na notificação, foca a janela do navegador e redireciona
  notification.onclick = () => {
    window.focus();
    console.log(`Navegando para a tarefa: ${notification.data.targetUrl}`);
    notification.close();
  };

  // 2. Fechamento automático programático após 6 segundos
  setTimeout(() => {
    notification.close();
  }, 6000);
}
```

## Aplicação Prática com TypeScript

Podemos organizar essas responsabilidades em um serviço tipado e defensivo:

```typescript
export interface AppNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  tag?: string;
  data?: unknown;
  onClick?: () => void;
  autoCloseMs?: number;
}

export class LocalNotificationManager {
  /**
   * Verifica se o navegador atual possui suporte a notificações.
   */
  public static isSupported(): boolean {
    return typeof window !== "undefined" && "Notification" in window;
  }

  /**
   * Solicita autorização do usuário de forma segura.
   */
  public static async requestPermission(): Promise<boolean> {
    if (!this.isSupported()) return false;
    if (Notification.permission === "granted") return true;

    try {
      const result = await Notification.requestPermission();
      return result === "granted";
    } catch (error) {
      console.error("Falha ao solicitar permissão de notificação:", error);
      return false;
    }
  }

  /**
   * Dispara uma notificação local configurada.
   */
  public static notify(payload: AppNotificationPayload): Notification | null {
    if (!this.isSupported() || Notification.permission !== "granted") {
      return null;
    }

    const notification = new Notification(payload.title, {
      body: payload.body,
      icon: payload.icon ?? "/favicon.ico",
      tag: payload.tag,
      data: payload.data,
    });

    if (payload.onClick) {
      notification.onclick = () => {
        window.focus();
        payload.onClick?.();
        notification.close();
      };
    }

    if (payload.autoCloseMs && payload.autoCloseMs > 0) {
      setTimeout(() => notification.close(), payload.autoCloseMs);
    }

    return notification;
  }
}
```

### Consumindo o Serviço em um Botão da Interface

```typescript
const alertButton =
  document.querySelector<HTMLButtonElement>("#btn-enable-alerts");

if (alertButton) {
  alertButton.addEventListener("click", async () => {
    const granted = await LocalNotificationManager.requestPermission();

    if (granted) {
      LocalNotificationManager.notify({
        title: "Notificações Ativadas!",
        body: "Você receberá avisos sobre novos cursos e prazos da FATEC.",
        tag: "welcome_alert",
        autoCloseMs: 5000,
        onClick: () =>
          console.log("Usuário interagiu com o alerta de boas-vindas!"),
      });
    } else {
      alert(
        "Para receber alertas, habilite as notificações nas configurações do seu navegador.",
      );
    }
  });
}
```

<details>
<summary>🔍 <strong>Aprofundamento: Notificações Locais vs. Web Push Notifications</strong></summary>

Existe uma distinção arquitetural importante entre duas formas de notificar na
Web:

1. **Notificações Locais (`new Notification()`):**
   - Disparadas diretamente pela aba ativa através do código JavaScript da
     página.
   - Funcionam perfeitamente com a aba em segundo plano ou minimizada, mas
     **deixam de funcionar se o usuário fechar a aba ou o navegador**.
2. **Web Push Notifications (Push API + Service Workers):**
   - Utilizam um servidor remoto (_Push Service_) que envia mensagens cifradas
     para o navegador através do protocolo Web Push padronizado.
   - O navegador acorda um **Service Worker** em segundo plano, permitindo
     exibir a notificação com `registration.showNotification()` **mesmo que o
     site e o navegador estejam completamente fechados**.

</details>

---

<a href="01-o-que-sao-web-apis.md">← O Que São Web APIs</a>
