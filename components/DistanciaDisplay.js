import { StyleSheet, Text, View } from "react-native";
// ! display da distancia restante do destino
export default function DistanciaDisplay({ distancia, erro }){
    // teste ternario para verfique se deu erro e exibir a distancia
    const texto = erro ?? (distancia === null ? 'buscando localização...' : `${Math.round(distancia)} m do destino`)

    return(
        <>
        <View style={styles.container}>
            <Text style={styles.texto}>{texto}</Text>
        </View>
        </>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  texto: { fontSize: 24, color: 'black' },
});