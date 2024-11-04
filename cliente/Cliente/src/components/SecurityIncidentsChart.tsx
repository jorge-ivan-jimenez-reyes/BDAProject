import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';

interface SecurityIncident {
  incident_type: string;
  severity: string;
  count: number;
}

interface Props {
  data: SecurityIncident[];
}

const SecurityIncidentsChart: React.FC<Props> = ({ data }) => {
  return (
    <div className="mb-6 p-4 border-2 border-pink-500 rounded-lg shadow-[0_0_15px_rgba(255,20,147,0.6)] bg-gray-800">
      <h2 className="text-2xl font-bold mb-4 text-pink-400">Incidentes de Seguridad por Tipo y Cantidad</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
