import React from 'react';
import ReactMapGL, { Source, Layer } from 'react-map-gl';

interface HeatmapData {
  latitude: number;
  longitude: number;
  weight: number;
}

interface Props {
  data: HeatmapData[];
}

const HeatmapOverlay: React.FC<Props> = ({ data }) => {
  // Validar si los datos están correctamente formateados
  if (!Array.isArray(data) || data.length === 0) {
    return null; // No renderiza si no hay datos válidos
  }

  // Formatear los datos en GeoJSON
  const heatmapDataGeoJSON = {
    type: 'FeatureCollection',
    features: data.map(({ latitude, longitude, weight }) => ({
      type: 'Feature',
      properties: { weight },
      geometry: {
        type: 'Point',
        coordinates: [longitude, latitude],
      },
    })),
  };

  // Validar si el objeto GeoJSON tiene características válidas
  if (!heatmapDataGeoJSON.features || heatmapDataGeoJSON.features.length === 0) {
    return null;
  }

  return (
    <ReactMapGL
      initialViewState={{
        latitude: 20.0,
        longitude: 0.0,
        zoom: 2,
      }}
      style={{ width: '100%', height: '600px' }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN} // Asegúrate de configurar tu token correctamente
    >
      <Source id="heatmap" type="geojson" data={heatmapDataGeoJSON}>
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

export default HeatmapOverlay;
