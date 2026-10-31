import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';

const TAREFA_GEOFENCE = 'alarme-geofence';
// id versionado: depois de criado, o canal só aceita mudar nome e descrição
const CANAL_ALARME = 'alarme-v1';

// Sem o handler, o Android não mostra/toca a notificação com o app aberto
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export function dispararNotificacao() {
  return Notifications.scheduleNotificationAsync({
    content: { title: 'Chegando no destino!', body: 'Acorde, seu ponto está perto.' },
    trigger: { channelId: CANAL_ALARME }, // dispara na hora, usando o canal de alarme
  });
}

// A tarefa precisa ficar no escopo de topo do arquivo
TaskManager.defineTask(TAREFA_GEOFENCE, ({ data, error }) => {
  if (error) {
    console.log('erro no geofence:', error.message);
    return;
  }
  if (data.eventType === Location.GeofencingEventType.Enter) {
    return dispararNotificacao();
  }
});

export async function pedirPermissoes() {
  // o canal vem antes: no Android 13+ o pedido de notificação só aparece depois dele
  await Notifications.setNotificationChannelAsync(CANAL_ALARME, {
    name: 'Alarme de destino',
    importance: Notifications.AndroidImportance.MAX,
    sound: 'default',
    vibrationPattern: [0, 500, 300, 500, 300, 500],
    bypassDnd: true,
    audioAttributes: {
      usage: Notifications.AndroidAudioUsage.ALARM,
      contentType: Notifications.AndroidAudioContentType.SONIFICATION,
    },
  });

  const notificacao = await Notifications.requestPermissionsAsync();
  const primeiroPlano = await Location.requestForegroundPermissionsAsync();
  if (!notificacao.granted || !primeiroPlano.granted) return false;

  // só depois do primeiro plano; no Android 11+ abre as configurações do sistema
  const segundoPlano = await Location.requestBackgroundPermissionsAsync();
  return segundoPlano.granted;
}

export function ativarAlarme(destino, raioMetros) {
  return Location.startGeofencingAsync(TAREFA_GEOFENCE, [
    {
      identifier: 'destino',
      latitude: destino.latitude,
      longitude: destino.longitude,
      radius: raioMetros,
      notifyOnEnter: true,
      notifyOnExit: false,
    },
  ]);
}

export function cancelarAlarme() {
  return Location.stopGeofencingAsync(TAREFA_GEOFENCE);
}

export function alarmeAtivo() {
  return Location.hasStartedGeofencingAsync(TAREFA_GEOFENCE);
}