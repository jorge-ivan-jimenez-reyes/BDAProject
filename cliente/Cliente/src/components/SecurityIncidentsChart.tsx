import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';

interface SecurityIncident {
  incident_type: string;
  count: number;
}

interface Props {
  data: SecurityIncident[];
}

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
    <div className="mb-6 p-4 border-2 border-pink-500 rounded-lg shadow-lg bg-gray-800">
      <h2 className="text-2xl font-bold mb-4 text-pink-400">Incidentes de Seguridad Agrupados por Tipo</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={aggregatedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" />
          <XAxis dataKey="incident_type" tick={{ fill: '#FF00FF' }} />
          <YAxis tick={{ fill: '#FF00FF' }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#2d2d2d', borderColor: '#FF00FF' }}
            labelStyle={{ color: '#FF00FF' }}
            itemStyle={{ color: '#FFFFFF' }}
          />
          <Legend wrapperStyle={{ color: '#FF00FF' }} />
          <Bar dataKey="count" fill="#FF00FF" barSize={30} />
        </BarChart>
      </ResponsiveContainer>
      <p className="text-xs text-pink-300 mt-2">
        * Los incidentes de seguridad se muestran por tipo y cantidad.
      </p>
    </div>
  );
};

export default SecurityIncidentsChart;
