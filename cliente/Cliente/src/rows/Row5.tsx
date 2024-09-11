import { useEffect, useState } from 'react';
import { HeatMapGrid } from 'react-grid-heatmap';

interface SecurityIncident {
  ip_address: string;
}

const Row5 = () => {
  const [heatmapData, setHeatmapData] = useState<number[][]>([]);
  const [xLabels, setXLabels] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);  // Estado para verificar la carga
  const [error, setError] = useState<string | null>(null);  // Estado para manejar errores

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('api/getSecurityIncidents');
        if (!res.ok) {
          throw new Error('Error fetching data from API');
        }

        const data = await res.json();
        const ipFrequency: Record<string, number> = {};

        data.securityIncidents.forEach((incident: SecurityIncident) => {
          ipFrequency[incident.ip_address] = (ipFrequency[incident.ip_address] || 0) + 1;
        });

        const values = Object.values(ipFrequency);
        const labels = Object.keys(ipFrequency);

        setHeatmapData([values]);
        setXLabels(labels);
      } catch (error: unknown) {  // Cambiamos el tipo de error a 'unknown' en lugar de 'any'
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-white">Loading data...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 bg-gray-800 rounded-md shadow-lg">
      <h2 className="text-xl text-white mb-4">Incident Frequency by IP</h2>
      {heatmapData.length === 0 ? (
        <div className="text-white">No data available</div>
      ) : (
        <HeatMapGrid
          data={heatmapData}
          xLabels={xLabels}
          yLabels={['IP Frequency']}
          cellRender={(value) => <div>{value}</div>}
          cellStyle={(_, value) => ({
            background: `rgba(255, 0, 0, ${value / Math.max(...heatmapData[0])})`,
            color: 'white',
            textAlign: 'center',
            fontSize: '12px',
          })}
          cellHeight="25px"
        />
      )}
    </div>
  );
};

export default Row5;
