import { useEffect, useState } from "react";
import { observarPosicao, pedirPermissao } from "../services/localizacao";
import { calcularDistancia } from "../services/calcularDistancia";
// ! hook / ferramenta para pedir permissao e chamar calulo e repassar infomaçoes
export function useDistanciaAoDestino(destino){
    const [ distancia, setDistancia ] = useState(null)
    const [ erro, setErro ] = useState(null)

    useEffect(() => {
        let ativo = true;
        let sub;

        (async () => {
            try {
            const permitido = await pedirPermissao();
            if (!permitido) {
                setErro('Permissão de localização negada');
                return;
            }
            setErro(null); // <- a linha que faltava
            sub = await observarPosicao((coords) =>
                setDistancia(calcularDistancia(coords, destino))
            );
            if (!ativo) sub.remove();
            } catch (e) {
            console.log('erro de localização:', e);
            setErro(String(e));
            }
        })();

        return () => {
            ativo = false;
            sub?.remove();
        };
    }, [destino.latitude, destino.longitude]);

    return { distancia, erro }
}