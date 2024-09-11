import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

// Definimos el tipo para cada incidente de seguridad
interface SecurityIncident {
  severity: string;
  incident_type: string;
  description: string;
  ip_address: string;
  resolution_status: string;
}

const Row4 = () => {
  // Estado con tipificación explícita
  const [securityIncidents, setSecurityIncidents] = useState<SecurityIncident[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/getSecurityIncidents');
        const data = await res.json();
        setSecurityIncidents(data.securityIncidents);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const colors = ['#FF8042', '#0088FE', '#00C49F', '#FFBB28'];

  // Preparar los datos para el gráfico de Pie con tipos explícitos
  const severityCount: Record<string, number> = securityIncidents.reduce((acc: Record<string, number>, incident) => {
    const { severity } = incident;
    acc[severity] = (acc[severity] || 0) + 1; // Tipo explícito para las claves
    return acc;
  }, {}); // Inicialización correcta

  const chartData = Object.keys(severityCount).map((severity) => ({
    name: severity,
    value: severityCount[severity],
  }));

  return (
    <div className="p-6 bg-gray-800 rounded-md">
      <h2 className="text-xl text-white">Security Incidents by Severity</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
          >
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Row4;
