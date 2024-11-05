import React, { useEffect, useState } from 'react';
import HeatmapOverlay from '../components/HeatmapOverlay';

interface HeatmapData {
  latitude: number;
  longitude: number;
  weight: number;
  country?: string;
}

interface CountryCount {
  country: string;
  count: number;
}

const Network: React.FC = () => {
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([]);
  const [topCountries, setTopCountries] = useState<CountryCount[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/securityIncidentAnalysis');
        if (!response.ok) {
          throw new Error('Error fetching data');
        }
        const securityAnalysisJson = await response.json();
  
        const convertedHeatmapData = securityAnalysisJson.securityIncidents.map((incident: any) => ({
          latitude: parseFloat(incident.latitude),
          longitude: parseFloat(incident.longitude),
          weight: parseInt(incident.count, 10),
          country: incident.country,
        }));
  
        const countryCounts: { [key: string]: number } = convertedHeatmapData.reduce((acc, item) => {
          if (item.country) {
            acc[item.country] = (acc[item.country] || 0) + item.weight;
          }
          return acc;
        }, {});
  
        const sortedCountries = Object.entries(countryCounts)
          .map(([country, count]) => ({ country, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
  
        setTopCountries(sortedCountries);
        setHeatmapData(convertedHeatmapData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  
  if (loading) {
    return <p className="text-center text-white">Cargando...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <h1 className="text-4xl font-bold text-pink-400 mb-4">Mapa de Calor de Incidentes de Seguridad hacia la Red UP</h1>
      <p className="text-white text-center mb-8">
        Este mapa de calor muestra las ubicaciones geográficas desde donde se han registrado intentos de acceso o ataques a la red de la Universidad Panamericana. Las áreas de mayor intensidad representan un volumen más alto de incidentes provenientes de esas ubicaciones.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Contenedor principal del mapa de calor */}
        <div className="md:col-span-2">
          <HeatmapOverlay data={heatmapData} />
          <p className="text-light-gray mt-4">
            <strong>Nota:</strong> Los colores en el mapa indican la frecuencia de intentos de acceso; las áreas de mayor brillo representan un mayor volumen de actividad.
          </p>
        </div>

        {/* Panel de los Top Países con más Incidentes */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-white mb-4">Top 5 Países con Mayor Actividad hacia la Red de la UP</h2>
          <p className="text-light-gray mb-4">
            Esta lista muestra los cinco países desde donde se han registrado más intentos de acceso o incidentes de seguridad dirigidos hacia la red de la Universidad Panamericana. Estos datos ayudan a identificar las regiones que representan un mayor riesgo de actividad de seguridad.
          </p>
          <ul className="space-y-2">
            {topCountries.map((country, index) => (
              <li key={index} className="flex justify-between text-white">
                <span>{index + 1}. {country.country}</span>
                <span className="font-bold">{country.count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Network;
