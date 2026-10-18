import * as Location from "expo-location"
// ! Pedindo permissao ao usuario
// * localização é usada apenas para funcionalidades legais do sistemas!
export async function pedirPermissao() {
    // pedir permisão
    const { status } = await Location.requestForegroundPermissionsAsync()
    // se aceita, retorna true / granted
    return status === "granted"
}

// * promisse da subcription / monitoriar posição
// * pode remover com remove();

export function observarPosicao(onPosicao){
    return Location.watchPositionAsync(
        // passando paramentros para monitar, e definindo o intevalo
        { accuracy: Location.Accuracy.High, distanceInterval: 1, timeInterval: 1000 },
        // apos isso, retorna posição atual
        (pos) => onPosicao(pos.coords)
    )
}
