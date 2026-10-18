import { Text, View } from 'react-native';
import { useDistanciaAoDestino } from './hooks/useDistanciaAoDestino';

const DESTINO = { latitude: -4.050817, longitude: -39.449561 };

export default function App() {
  const { distancia, erro } = useDistanciaAoDestino(DESTINO);
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
      <Text style={{ color: 'black', fontSize: 20 }}>
        {`distancia: ${distancia} | erro: ${erro}`}
      </Text>
    </View>
  );
}