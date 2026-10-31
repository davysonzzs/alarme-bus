import { useEffect, useState } from 'react';
import { Button, Text, View } from 'react-native';
import {
  alarmeAtivo,
  ativarAlarme,
  cancelarAlarme,
  dispararNotificacao,
  pedirPermissoes,
} from './services/alarme';

const DESTINO = { latitude: -4.050817, longitude: -39.449561 };
const RAIO_METROS = 200;

export default function App() {
  const [ativo, setAtivo] = useState(false);
  const [aviso, setAviso] = useState('');

  // o geofence continua ativo mesmo se o app recarregar, então lemos o estado real
  useEffect(() => {
    alarmeAtivo().then(setAtivo);
  }, []);

  async function ligar() {
    if (!(await pedirPermissoes())) {
      setAviso('Permissões negadas');
      return;
    }
    await ativarAlarme(DESTINO, RAIO_METROS);
    setAtivo(true);
    setAviso('');
  }

  async function desligar() {
    await cancelarAlarme();
    setAtivo(false);
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, backgroundColor: 'white' }}>
      <Text style={{ fontSize: 22, color: 'black' }}>{ativo ? 'Alarme ligado' : 'Alarme desligado'}</Text>
      {aviso ? <Text style={{ color: 'red' }}>{aviso}</Text> : null}
      <Button title={ativo ? 'Desligar' : 'Ligar alarme'} onPress={ativo ? desligar : ligar} />
      <Button title="Testar som agora" onPress={dispararNotificacao} />
    </View>
  );
}