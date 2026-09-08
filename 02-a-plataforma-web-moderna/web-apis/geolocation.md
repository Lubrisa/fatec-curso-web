# Geolocation API

A **Geolocation API** permite que as aplicações web acessem a localização
geográfica física do dispositivo do usuário (como latitude, longitude, altitude,
precisão e velocidade de deslocamento).

Essa capacidade é essencial para funcionalidades como mapas interativos, busca
de unidades ou lojas físicas mais próximas, cálculo de fretes e rotas de
entrega, e serviços de previsão meteorológica local.

Neste capítulo do catálogo, você aprenderá como utilizar o objeto
`navigator.geolocation`, como tratar erros de permissão e como encapsular
leituras e monitoramentos contínuos de posição com TypeScript.

## Requisitos de Segurança e Privacidade

O acesso à localização física é considerado um dado altamente sensível. Por essa
razão, os navegadores modernos impõem regras rígidas para sua execução:

1. **Contexto Seguro Obrigatório (HTTPS):** A Geolocation API só funciona em
   páginas servidas sob o protocolo seguro **HTTPS** (com exceção de `localhost`
   para ambiente de desenvolvimento). Em páginas HTTP convencionais, o objeto
   `navigator.geolocation` fica desabilitado.
2. **Consentimento Explícito do Usuário:** Toda vez que a aplicação tenta ler a
   posição pela primeira vez, o navegador exibe um prompt nativo obrigatório de
   permissão (**Permitir** ou **Bloquear**). O código JavaScript não consegue
   burlar ou forçar essa autorização.

## Métodos da Geolocation API

A interface `Geolocation` é acessível globalmente através de
`navigator.geolocation` e fornece três métodos fundamentais:

| Método                 | Assinatura TypeScript                                 | Descrição                                                                                                                                                     |
| :--------------------- | :---------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `getCurrentPosition()` | `getCurrentPosition(success, error?, options?): void` | Obtém uma leitura pontual única da posição geográfica atual do dispositivo.                                                                                   |
| `watchPosition()`      | `watchPosition(success, error?, options?): number`    | Inicia o monitoramento contínuo da posição, disparando a função de callback sempre que o dispositivo se mover. Retorna um identificador numérico (`watchId`). |
| `clearWatch()`         | `clearWatch(watchId: number): void`                   | Interrompe um monitoramento contínuo previamente iniciado com `watchPosition()`.                                                                              |

### Opções de Configuração (`PositionOptions`)

Ambos os métodos de leitura aceitam um objeto opcional de configuração:

| Propriedade          | Tipo      | Padrão     | Descrição                                                                                                                                                              |
| :------------------- | :-------- | :--------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `enableHighAccuracy` | `boolean` | `false`    | Se `true`, solicita ao dispositivo o método mais preciso disponível (como ligar o chip de GPS em smartphones), o que consome mais bateria e pode demorar mais.         |
| `timeout`            | `number`  | `Infinity` | Tempo máximo de espera em milissegundos antes de disparar um erro de tempo esgotado.                                                                                   |
| `maximumAge`         | `number`  | `0`        | Idade máxima aceitável (em milissegundos) para reaproveitar uma posição salva em cache. Se definido como `0`, o navegador é forçado a obter uma nova leitura imediata. |

<details>
<summary>🔍 <strong>Aprofundamento: Como o navegador determina a sua localização?</strong></summary>

O navegador utiliza uma combinação de diferentes tecnologias de hardware e rede
para estimar as coordenadas do dispositivo:

- **GPS (Global Positioning System):** Comunicação direta com satélites. É o
  método mais preciso (margem de poucos metros), mas requer linha de visada com
  o céu e consome mais energia em celulares.
- **Triangulação de Redes Wi-Fi:** O navegador envia a lista de roteadores Wi-Fi
  próximos e suas potências de sinal para serviços de localização (como o Google
  Location Service), que consultam um banco de dados global de posições de
  roteadores. É rápido e funciona muito bem em ambientes fechados.
- **Triangulação de Antenas Celulares:** Em dispositivos móveis, calcula a
  posição aproximada com base nas torres de telefonia conectadas.
- **Geolocalização por IP:** Quando nenhuma das opções anteriores está
  disponível (como em desktops conectados via cabo de rede), o navegador estima
  a cidade ou região com base no endereço IP fornecido pelo provedor de internet
  (margem de erro de vários quilômetros).

</details>

## Estrutura dos Dados e Tratamento de Erros

### O Objeto `GeolocationPosition`

Quando a leitura é bem-sucedida, o callback de sucesso recebe um objeto com os
seguintes dados:

```typescript
// Estrutura simplificada do tipo nativo GeolocationPosition
interface GeolocationPosition {
  readonly coords: {
    readonly latitude: number; // Graus decimais (-90.0 a 90.0)
    readonly longitude: number; // Graus decimais (-180.0 a 180.0)
    readonly accuracy: number; // Nível de precisão estimado em metros
    readonly altitude: number | null; // Altitude em metros acima do nível do mar (ou null)
    readonly altitudeAccuracy: number | null; // Precisão da altitude em metros (ou null)
    readonly heading: number | null; // Direção do movimento em graus (0 a 360, norte = 0)
    readonly speed: number | null; // Velocidade instantânea em metros por segundo
  };
  readonly timestamp: number; // Momento da leitura (milissegundos desde a Unix Epoch)
}
```

### O Objeto `GeolocationPositionError`

Se o usuário recusar a permissão ou a leitura falhar, o callback de erro recebe
um objeto com a propriedade `code`:

| Código | Constante Numérica     | Descrição                                                                                      |
| :----: | :--------------------- | :--------------------------------------------------------------------------------------------- |
|  `1`   | `PERMISSION_DENIED`    | O usuário clicou em "Bloquear" ou desabilitou o acesso à localização no navegador.             |
|  `2`   | `POSITION_UNAVAILABLE` | O dispositivo não conseguiu determinar a posição (ex: sem sinal de GPS e sem conexão de rede). |
|  `3`   | `TIMEOUT`              | O tempo limite configurado na propriedade `timeout` expirou antes que a posição fosse obtida.  |

## Aplicação Prática com TypeScript

### 1. Leitura Pontual com Promises (`async/await`)

A API nativa utiliza callbacks tradicionais. No TypeScript moderno, podemos
encapsular a chamada em uma `Promise` tipada e reutilizável:

```typescript
export interface SimpleCoordinates {
  latitude: number;
  longitude: number;
  accuracyInMeters: number;
}

/**
 * Obtém as coordenadas atuais do dispositivo de forma assíncrona.
 */
export function getCurrentCoordinates(
  options?: PositionOptions,
): Promise<SimpleCoordinates> {
  return new Promise((resolve, reject) => {
    // 1. Verificação defensiva de suporte no ambiente
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      reject(new Error("Geolocation API não suportada neste navegador."));
      return;
    }

    // 2. Chamada nativa com callbacks mapeados para resolve/reject
    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracyInMeters: position.coords.accuracy,
        });
      },
      (error: GeolocationPositionError) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(new Error("Permissão de localização negada pelo usuário."));
            break;
          case error.POSITION_UNAVAILABLE:
            reject(new Error("Sinal de localização indisponível."));
            break;
          case error.TIMEOUT:
            reject(new Error("Tempo limite para obter localização esgotado."));
            break;
          default:
            reject(new Error(`Erro desconhecido: ${error.message}`));
        }
      },
      options,
    );
  });
}
```

#### Consumindo a Função

```typescript
async function showUserLocation(): Promise<void> {
  try {
    console.log("Solicitando localização...");

    const coords = await getCurrentCoordinates({
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    });

    console.log(`Latitude: ${coords.latitude}`);
    console.log(`Longitude: ${coords.longitude}`);
    console.log(`Precisão: ±${coords.accuracyInMeters.toFixed(1)} metros`);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Falha ao obter localização:", error.message);
    }
  }
}
```

### 2. Monitoramento Contínuo de Rota com `watchPosition`

Para aplicações de rastreamento em tempo real (como aplicativos de corrida ou
navegação ponto a ponto), usamos `watchPosition` e retornamos uma função de
cancelamento (_cleanup_):

```typescript
type PositionListener = (coords: SimpleCoordinates) => void;
type ErrorListener = (error: Error) => void;
type UnsubscribeFunction = () => void;

/**
 * Monitora continuamente o deslocamento do usuário e retorna uma função para encerrar a escuta.
 */
export function trackMovement(
  onPositionChange: PositionListener,
  onError?: ErrorListener,
  options?: PositionOptions,
): UnsubscribeFunction {
  if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
    if (onError) {
      onError(new Error("Geolocation API não suportada neste navegador."));
    }
    return () => {};
  }

  const watchId = navigator.geolocation.watchPosition(
    (position) => {
      onPositionChange({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracyInMeters: position.coords.accuracy,
      });
    },
    (error) => {
      if (onError) {
        onError(new Error(`Erro no rastreamento: ${error.message}`));
      }
    },
    options,
  );

  // Retorna uma função de encerramento limpa
  return () => {
    navigator.geolocation.clearWatch(watchId);
    console.log(`Monitoramento (watchId: ${watchId}) encerrado.`);
  };
}
```

#### Exemplo de Uso do Monitoramento

```typescript
// Inicia o monitoramento
const stopTracking = trackMovement(
  (coords) => {
    console.log(
      `Nova posição: Lat ${coords.latitude}, Long ${coords.longitude}`,
    );
  },
  (error) => {
    console.error(error.message);
  },
  { enableHighAccuracy: true },
);

// Após 30 segundos (ou quando o usuário sair da tela), encerra o monitoramento:
setTimeout(() => {
  stopTracking();
}, 30000);
```

<details>
<summary>🔍 <strong>Inspecionando e Simulando Coordenadas no DevTools</strong></summary>

Você não precisa sair fisicamente de casa para testar coordenadas diferentes na
sua aplicação. Os navegadores possuem um painel nativo de emulação de sensores:

1. Abra o DevTools (`F12`).
2. Pressione `Ctrl + Shift + P` (ou `Cmd + Shift + P` no Mac) para abrir o menu
   de comandos.
3. Digite **"Show Sensors"** e pressione Enter.
4. No painel **Sensors** que se abrirá, localize a opção **Location**.
5. Selecione cidades pré-definidas (como _Tokyo_, _London_, _São Paulo_) ou
   escolha **Other...** para digitar manualmente qualquer latitude e longitude.
6. Você também pode selecionar a opção **Location unavailable** para testar como
   sua aplicação reage a erros de sinal indisponível.

</details>

---

<a href="01-o-que-sao-web-apis.md">← O Que São Web APIs</a>
