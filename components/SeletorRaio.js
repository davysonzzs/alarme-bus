import { Pressable, StyleSheet, Text, View } from 'react-native';

const OPCOES = [500, 1000, 2000];
const rotulo = (m) => (m >= 1000 ? `${m / 1000} km` : `${m} m`);

export default function SeletorRaio({ raio, onMudar }) {
  return (
    <View style={styles.linha}>
      {OPCOES.map((m) => (
        <Pressable key={m} onPress={() => onMudar(m)} style={[styles.botao, raio === m && styles.ativo]}>
          <Text style={raio === m ? styles.textoAtivo : styles.texto}>{rotulo(m)}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  linha: { flexDirection: 'row', gap: 8, justifyContent: 'center' },
  botao: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1, borderColor: '#999' },
  ativo: { backgroundColor: '#e53935', borderColor: '#e53935' },
  texto: { color: 'black' },
  textoAtivo: { color: 'white', fontWeight: 'bold' },
});