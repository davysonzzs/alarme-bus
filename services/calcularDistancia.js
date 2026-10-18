// Calcular distancia entre o local atual e o destino

export function calcularDistancia(atual, destino) {
  // ! Formula de Haversine | calcular distancia na superficie de uma esfera
  // * R = raio medio da terra / constante
  const R = 6371000
  // * rad é função para converter para graus, melhora para trabalhar em JS
  const rad = (g) => (g * Math.PI) / 180
  // * sabemos a diferença entre dois raios (tando em latitude e longitude)
  const dLat = rad(destino.latitude - atual.latitude)
  const dLon = rad(destino.longitude - atual.longitude)
  // ! cerebro da formula
  // * difereça de latitude, diferençade longitude * cos das latitutes
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(atual.latitude)) * Math.cos(rad(destino.latitude)) * Math.sin(dLon / 2) ** 2
  // * aq da o angulo entre os dois pontos visto de centro da terra
  // * multiplicando pelo raio esse angulo vira metros
  return 2 * R * Math.asin(Math.sqrt(h))
}