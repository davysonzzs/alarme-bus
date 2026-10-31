// Polígono de ~64 lados ao redor do centro; a Terra é tratada como esfera
export function circuloGeoJSON(centro, raioMetros, lados = 64) {
  const R = 6371000;
  const lat = (centro.latitude * Math.PI) / 180;
  const lon = (centro.longitude * Math.PI) / 180;
  const d = raioMetros / R;
  const pontos = [];

  for (let i = 0; i < lados; i++) {
    const ang = (2 * Math.PI * i) / lados;
    const lat2 = Math.asin(Math.sin(lat) * Math.cos(d) + Math.cos(lat) * Math.sin(d) * Math.cos(ang));
    const lon2 =
      lon +
      Math.atan2(Math.sin(ang) * Math.sin(d) * Math.cos(lat), Math.cos(d) - Math.sin(lat) * Math.sin(lat2));
    pontos.push([(lon2 * 180) / Math.PI, (lat2 * 180) / Math.PI]); // [lng, lat]
  }
  pontos.push(pontos[0]); // fecha o anel

  return { type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [pontos] } };
}