import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';

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

  const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];

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
    <motion.div
      className="p-6 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-md shadow-lg"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <h2 className="text-2xl font-bold text-white mb-4 text-center">Security Incidents by Severity</h2>
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            innerRadius={60}
            fill="#8884d8"
            paddingAngle={5}
            label={(entry) => `${entry.name} (${entry.value})`}
            isAnimationActive={true}
          >
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ backgroundColor: '#333', color: '#fff' }} />
          <Legend layout="vertical" align="right" verticalAlign="middle" />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default Row4;
