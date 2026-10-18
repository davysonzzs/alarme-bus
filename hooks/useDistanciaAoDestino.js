import { useEffect, useState } from "react";
import { observarPosicao, pedirPermissao } from "../services/localizacao";
import { calcularDistancia } from "../services/calcularDistancia";
// ! hook / ferramenta para pedir permissao e chamar calulo e repassar infomaçoes
export function useDistanciaAoDestino(destino){
    const [ distancia, setDistancia ] = useState(null)
    const [ erro, setErro ] = useState(null)

    useEffect(() => {
        // ativo = permisão, usando na espera da permisao
        let ativo = true
        // sub = subcription
        let sub
        ( async () => {
            // permisao negada = error e sai da função
            if(!(await pedirPermissao())){
                setErro("Permissão negada")
                return
            }
            // criar o sub e faz calulo para retono
            sub = await observarPosicao((coords) => 
                setDistancia(calcularDistancia(coords, destino))
            )
            // desmonta enquanto esperar a permissao
            if(!ativo) sub.remove()
        })()
    return () => {
        ativo = false
        sub?.remove()
    }
    //quando função nao precisar mais ele se auto desmonta
    }, [ destino.latitude, destino.longitude])

    return { distancia, erro }
}