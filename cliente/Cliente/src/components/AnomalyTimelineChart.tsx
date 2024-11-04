import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
  Scatter,
  ScatterChart,
} from 'recharts';

interface AnomalyDetectionLog {
  detection_time: string;
  severity: number;
  description: string;
  anomaly_type: string;
  resolved: boolean;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: {
    payload: AnomalyDetectionLog;
  }[];
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { detection_time, severity, anomaly_type, description, resolved } = payload[0].payload;
    return (
      <div className="bg-cyber-dark border border-cyan-400 p-3 rounded shadow-lg text-light-gray">
        <p><strong>Tiempo:</strong> {new Date(detection_time).toLocaleString()}</p>
        <p><strong>Severidad:</strong> <span className="text-neon-pink">{severity}</span></p>
        <p><strong>Tipo de Anomalía:</strong> <span className="text-neon-purple">{anomaly_type}</span></p>
        <p><strong>Descripción:</strong> {description}</p>
        <p><strong>Estado:</strong> <span className={resolved ? 'text-neon-green' : 'text-bright-cyan'}>
          {resolved ? 'Resuelto' : 'No Resuelto'}
        </span></p>
      </div>
    );
  }
  return null;
};

interface Props {
  data: AnomalyDetectionLog[];
}

const AnomalyTimelineChart: React.FC<Props> = ({ data }) => {
  return (
    <div className="mb-6 p-4 border-2 border-cyan-500 rounded-lg shadow-lg bg-cyber-dark">
      <h2 className="text-2xl font-bold mb-4 text-bright-cyan">Línea de Tiempo de Detección de Anomalías</h2>
      <p className="text-sm text-neon-green mb-4">
        Esta gráfica muestra la severidad y la frecuencia de las anomalías detectadas a lo largo del tiempo, junto con su estado de resolución.
      </p>
      <ResponsiveContainer width="100%" height={500}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1B263B" />
          <XAxis
            dataKey="detection_time"
            tickFormatter={(time) => new Date(time).toLocaleDateString()}
            label={{ value: 'Fecha de Detección', position: 'insideBottomRight', offset: -5, fill: '#00E5FF' }}
            tick={{ fill: '#00E5FF' }}
          />
          <YAxis
            label={{ value: "Nivel de Severidad (1=Bajo, 2=Medio, 3=Alto)", angle: -90, position: 'insideLeft', fill: '#00E5FF' }}
            domain={[1, 3]}
            tickFormatter={(value) => `Nivel ${value}`}
            tick={{ fill: '#00E5FF' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" height={36} wrapperStyle={{ color: '#00FF9F' }} />
          <Line type="monotone" dataKey="severity" stroke="#FF007A" dot={{ r: 5 }} name="Nivel de Severidad" />
          <ScatterChart>
            <Scatter data={data} dataKey="resolved" fill="#8F00FF" name="Estado de Resolución" />
          </ScatterChart>
          <ReferenceLine x="2024-11-01" stroke="#00FF9F" label={{ value: "Inicio del Incidente", fill: '#00E5FF' }} />
        </LineChart>
      </ResponsiveContainer>
      <p className="text-xs text-neon-green mt-2">
        * Los niveles de severidad se representan numéricamente: 1 para bajo, 2 para medio, y 3 para alto. Los puntos marcados indican si la anomalía ha sido resuelta.
      </p>
    </div>
  );
};

export default AnomalyTimelineChart;
