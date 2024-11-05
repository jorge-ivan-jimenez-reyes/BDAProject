import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';

interface SecurityIncident {
  incident_type: string;
  count: number;
}

interface Props {
  data: SecurityIncident[];
}

// Función para agrupar los datos de incidentes por tipo
const aggregateIncidentData = (data: SecurityIncident[]): SecurityIncident[] => {
  const incidentMap: { [key: string]: number } = {};

  data.forEach((incident) => {
    if (incidentMap[incident.incident_type]) {
      incidentMap[incident.incident_type] += incident.count;
    } else {
      incidentMap[incident.incident_type] = incident.count;
    }
  });

  return Object.entries(incidentMap).map(([incident_type, count]) => ({
    incident_type,
    count,
  }));
};

const SecurityIncidentsChart: React.FC<Props> = ({ data }) => {
  const aggregatedData = aggregateIncidentData(data);

  return (
    <div className="mb-6 p-4 border-2 border-bright-cyan rounded-lg shadow-lg bg-cyber-dark">
      <h2 className="text-2xl font-bold mb-4 text-neon-green text-center">Incidentes de Seguridad Agrupados por Tipo</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={aggregatedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1B263B" />
          <XAxis dataKey="incident_type" tick={{ fill: '#8F00FF' }} />
          <YAxis tick={{ fill: '#8F00FF' }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1B263B', borderColor: '#00FF9F' }}
            labelStyle={{ color: '#00FF9F' }}
            itemStyle={{ color: '#C0C0C0' }}
          />
          <Legend wrapperStyle={{ color: '#00FF9F' }} />
          <Bar dataKey="count" fill="#00FF9F" barSize={30} />
        </BarChart>
      </ResponsiveContainer>
      <p className="text-xs text-neon-pink mt-2 text-center">
        * Los incidentes de seguridad se muestran por tipo y cantidad.
      </p>
    </div>
  );
};

export default SecurityIncidentsChart;
