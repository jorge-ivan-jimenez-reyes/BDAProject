import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface IncidentResolutionLog {
  status: string;
  count: number;
}

interface Props {
  data: IncidentResolutionLog[];
}

const COLORS = ['#00C49F', '#FF8042', '#FFBB28', '#0088FE'];

const IncidentResolutionPieChart: React.FC<Props> = ({ data }) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Incident Resolution Status</h2>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie data={data} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={150} label>
            {data.map((_, index) => ( // Replace 'entry' with '_'
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IncidentResolutionPieChart;
