import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface IncidentResolutionLog {
  status: string;
  count: number;
}

interface Props {
  data: IncidentResolutionLog[];
}

// Cibernetic color palette
const COLORS = ['#00FF9F', '#8F00FF', '#00E5FF', '#FF007A']; // Neon-like colors from your palette

const CustomTooltip: React.FC<{ active?: boolean; payload?: any[] }> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { status, count } = payload[0].payload;
    return (
      <div className="bg-cyber-dark border border-neon-green p-2 rounded-md text-light-gray shadow-lg">
        <p className="font-bold">
          Estado: <span className="text-neon-green">{status}</span>
        </p>
        <p>Conteo: {count}</p>
      </div>
    );
  }
  return null;
};

const IncidentResolutionPieChart: React.FC<Props> = ({ data }) => {
  return (
    <div className="mb-6 p-4 border-2 border-neon-green rounded-lg shadow-[0_0_15px_0_rgba(0,255,159,0.6)] bg-cyber-dark">
      <h2 className="text-2xl font-semibold mb-4 text-neon-green">Estado de Resolución de Incidentes</h2>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie data={data} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={150} label>
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IncidentResolutionPieChart;
