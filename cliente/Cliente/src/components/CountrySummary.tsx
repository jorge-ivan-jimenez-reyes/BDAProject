import React from 'react';
import ReactMapGL from 'react-map-gl';

interface UserActivity {
  country: string;
  event_count: number; // Asegúrate de que `event_count` sea un número si es posible
}

interface Props {
  data: UserActivity[];
}

const CountrySummary: React.FC<Props> = ({ data }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return <p className="text-center text-white">No hay datos disponibles.</p>; // Mensaje alternativo si no hay datos
  }

  return (
    <div className="country-summary">
      <h2 className="text-lg font-bold mb-4">Resumen por País</h2>
      
      {/* Mapa integrado */}
      <ReactMapGL
        initialViewState={{
          latitude: 37.7749,
          longitude: -122.4194,
          zoom: 2,
        }}
        style={{ width: '100%', height: '400px' }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
      />

      {/* Tabla de resumen */}
      <table className="w-full text-left mt-4">
        <thead>
          <tr>
            <th>País</th>
            <th>Cantidad de Eventos</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.country || 'N/A'}</td> {/* Verifica si `country` es válido */}
              <td>{item.event_count ?? 0}</td> {/* Muestra 0 si `event_count` es `null` o `undefined` */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CountrySummary;
