import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import MapaDestino from './components/MapaDestino';
import SeletorRaio from './components/SeletorRaio';
import {
  alarmeAtual,
  ativarAlarme,
  cancelarAlarme,
  pedirPermissoes,
  pedirPrimeiroPlano,
  localizacaoLigada,
  localizacaoDisponivel
} from './services/alarme';

export default function App() {
  const [destino, setDestino] = useState(null);
  const [raio, setRaio] = useState(1000);
  const [ativo, setAtivo] = useState(false);
  const [podeLocalizar, setPodeLocalizar] = useState(false);
  const [aviso, setAviso] = useState('');

  const verificar = () => localizacaoDisponivel().then(setPodeLocalizar);

  useEffect(() => {
    pedirPrimeiroPlano().then(verificar);
    // o geofence continua ativo com o app fechado: restaura destino e raio dele
    alarmeAtual().then((regiao) => {
      if (!regiao) return;
      setDestino({ latitude: regiao.latitude, longitude: regiao.longitude });
      setRaio(regiao.radius);
      setAtivo(true);
    });  
  }, []);

  useEffect(() => {
    if (podeLocalizar) return;
    const id = setInterval(verificar, 2000);
    return () => clearInterval(id);
  }, [podeLocalizar]);

  async function ligar() {
    if (!(await localizacaoLigada())) {
      setAviso('Ligue a localização do celular para o alarme funcionar');
      return;
    }      
    if (!destino) {
      setAviso('Toque e segure no mapa para escolher o destino');
      return;
    }
    if (!(await pedirPermissoes())) {
      setAviso('Permissões negadas');
      return;
    }
    await ativarAlarme(destino, raio);
    setAtivo(true);
    setAviso('');
  }

  async function desligar() {
    await cancelarAlarme();
    setAtivo(false);
  }

  return (
    <View style={styles.tela}>
      <MapaDestino
        key={podeLocalizar ? 'com' : 'sem'}
        destino={destino}
        raio={raio}
        podeLocalizar={podeLocalizar}
        onEscolherDestino={ativo ? undefined : setDestino}
      />
      <View style={styles.painel}>
        {aviso ? <Text style={styles.aviso}>{aviso}</Text> : null}
        {!ativo && <SeletorRaio raio={raio} onMudar={setRaio} />}
        <Button title={ativo ? 'Desligar alarme' : 'Ligar alarme'} onPress={ativo ? desligar : ligar} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1 },
  painel: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: 16, gap: 12, backgroundColor: 'white' },
  aviso: { color: 'red', textAlign: 'center' },
});