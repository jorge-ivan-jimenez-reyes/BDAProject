import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface IncidentResolutionLog {
  status: string;
  count: number;
}

interface Props {
  data: IncidentResolutionLog[];
}

// Updated neon color palette for the chart
const COLORS = ['#06b6d4', '#d946ef', '#fde047', '#4ade80']; // Tailwind neon-like colors

const CustomTooltip: React.FC<{ active?: boolean; payload?: any[] }> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { status, count } = payload[0].payload;
    return (
      <div className="bg-gray-800 border border-cyan-500 p-2 rounded-md text-white shadow-lg">
        <p className="font-bold">Status: <span className="text-cyan-400">{status}</span></p>
        <p>Count: {count}</p>
      </div>
    );
  }
  return null;
};

const IncidentResolutionPieChart: React.FC<Props> = ({ data }) => {
  return (
    <div className="mb-6 p-4 border-2 border-cyan-500 rounded-lg shadow-[0_0_15px_0_rgba(0,255,255,0.6)]">
      <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Estado de resolución de incidentes</h2>
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
