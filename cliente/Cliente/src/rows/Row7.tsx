import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface SecurityIncident {
  incident_type: string;
}

const Row7 = () => {
  const [incidentTypes, setIncidentTypes] = useState<{ name: string, value: number }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/getSecurityIncidents');
      const data = await res.json();
      const typeCount: Record<string, number> = {};
      
      data.securityIncidents.forEach((incident: SecurityIncident) => {
        typeCount[incident.incident_type] = (typeCount[incident.incident_type] || 0) + 1;
      });

      const chartData = Object.keys(typeCount).map(type => ({ name: type, value: typeCount[type] }));
      setIncidentTypes(chartData);
    };
    fetchData();
  }, []);

  const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="p-6 bg-gray-800 rounded-md shadow-lg">
      <h2 className="text-xl text-white">Incident Types</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={incidentTypes} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
            {incidentTypes.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Row7;
