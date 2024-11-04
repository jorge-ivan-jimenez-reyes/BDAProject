import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

interface AnomalyDetectionLog {
  detection_time: string;
  severity: number; // Ensure severity is defined as a number if that's what you're using
  description: string;
}

interface Props {
  data: AnomalyDetectionLog[];
}

const AnomalyTimelineChart: React.FC<Props> = ({ data }) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Anomaly Detection Timeline</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="detection_time" tickFormatter={(time) => new Date(time).toLocaleDateString()} />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="severity" stroke="#FF0000" /> {/* Make sure this is okay to be numeric */}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnomalyTimelineChart;
