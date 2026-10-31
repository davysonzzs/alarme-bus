import { Camera, GeoJSONSource, Layer, Map as MapaLibre, Marker, UserLocation } from '@maplibre/maplibre-react-native';
import { View } from 'react-native';
import { circuloGeoJSON } from '../services/circuloGeoJSON';

const ESTILO = 'https://tiles.openfreemap.org/styles/liberty';

export default function MapaDestino({ destino, raio, podeLocalizar, onEscolherDestino }) {
  function aoSegurar(evento) {
    if (!onEscolherDestino) return;
    const [longitude, latitude] = evento.nativeEvent.lngLat;
    onEscolherDestino({ latitude, longitude });
  }

  return (
    <MapaLibre mapStyle={ESTILO} onLongPress={aoSegurar}>
      <Camera trackUserLocation={podeLocalizar ? 'default' : undefined} initialViewState={{ zoom: 14 }} />
      {podeLocalizar && <UserLocation accuracy />}

      {destino && (
        <>
          <GeoJSONSource id="area-alarme" data={circuloGeoJSON(destino, raio)}>
            <Layer type="fill" id="area-preenchimento" source="area-alarme"
              paint={{ 'fill-color': '#e53935', 'fill-opacity': 0.2 }} />
            <Layer type="line" id="area-borda" source="area-alarme"
              paint={{ 'line-color': '#e53935', 'line-width': 2 }} />
          </GeoJSONSource>
          <Marker lngLat={[destino.longitude, destino.latitude]}>
            <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: '#e53935', borderWidth: 3, borderColor: 'white' }} />
          </Marker>
        </>
      )}
    </MapaLibre>
  );
}