import React from 'react';
import ReactMapGL, { Marker, Source, Layer } from 'react-map-gl';

interface LocationData {
  ip_address: string;
  country: string;
  latitude: number;
  longitude: number;
  event_count: number;
}

interface HeatmapData {
  latitude: number;
  longitude: number;
  weight: number;
}

interface Props {
  data: LocationData[];
  heatmapData: HeatmapData[];
}

const InteractiveMap: React.FC<Props> = ({ data, heatmapData }) => {
  return (
    <ReactMapGL
      initialViewState={{
        latitude: 20.0,
        longitude: 0.0,
        zoom: 1.5,
      }}
      style={{ width: '100%', height: '600px' }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN} // Acceso correcto a la variable de entorno con Vite
    >
      {/* Agrega marcadores y capas aquí si es necesario */}
      {data.map((location) => (
        <Marker key={location.ip_address} latitude={location.latitude} longitude={location.longitude}>
          <span role="img" aria-label="marker">📍</span>
        </Marker>
      ))}

      {/* Agrega tu capa de calor */}
      <Source
        id="heatmap"
        type="geojson"
        data={{
          type: 'FeatureCollection',
          features: heatmapData.map(({ latitude, longitude, weight }) => ({
            type: 'Feature',
            properties: { weight },
            geometry: {
              type: 'Point',
              coordinates: [longitude, latitude],
            },
          })),
        }}
      >
        <Layer
          id="heatmap-layer"
          type="heatmap"
          paint={{
            'heatmap-weight': ['get', 'weight'],
            'heatmap-intensity': 1,
            'heatmap-radius': 30,
            'heatmap-opacity': 0.6,
            'heatmap-color': [
              'interpolate',
              ['linear'],
              ['heatmap-density'],
              0, 'rgba(0, 0, 0, 0)',
              0.2, 'rgb(255, 255, 0)',
              0.4, 'rgb(255, 0, 0)',
              0.6, 'rgb(0, 0, 255)',
              0.8, 'rgb(0, 255, 255)',
              1, 'rgb(0, 0, 0)',
            ],
          }}
        />
      </Source>
    </ReactMapGL>
  );
};

export default InteractiveMap;
