// HeatmapOverlay.tsx
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
  if (!Array.isArray(data) || data.length === 0) {
    return null; // No renderiza si no hay datos válidos
  }

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
      mapStyle="mapbox://styles/mapbox/dark-v10"
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
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
              0, 'rgba(0, 0, 0, 0)',            // Transparent at zero density
              0.2, '#00FF9F',                   // neon-green for low density
              0.4, '#8F00FF',                   // neon-purple for moderate density
              0.6, '#00E5FF',                   // bright-cyan for high density
              0.8, '#FF007A',                   // neon-pink for very high density
              1, '#0A0F29',                     // cyber-dark for max density
            ],
          }}
        />
      </Source>
    </ReactMapGL>
  );
};

export default HeatmapOverlay;
