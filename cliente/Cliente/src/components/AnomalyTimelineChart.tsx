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
  severity: number; // Numeric value for plotting
  description: string;
  anomaly_type: string;
  resolved: boolean; // Indicates if the anomaly has been resolved
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
      <div className="bg-gray-900 border border-cyan-400 p-3 rounded shadow-lg text-white">
        <p><strong>Tiempo:</strong> {new Date(detection_time).toLocaleString()}</p>
        <p><strong>Severidad:</strong> <span className="text-red-400">{severity}</span></p>
        <p><strong>Tipo de Anomalía:</strong> <span className="text-purple-400">{anomaly_type}</span></p>
        <p><strong>Descripción:</strong> {description}</p>
        <p><strong>Estado:</strong> <span className={resolved ? 'text-green-400' : 'text-yellow-400'}>
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
    <div className="mb-6 p-4 border-2 border-cyan-500 rounded-lg shadow-[0_0_15px_rgba(0,255,255,0.6)] bg-gray-800">
      <h2 className="text-2xl font-bold mb-4 text-cyan-400">Línea de Tiempo de Detección de Anomalías</h2>
      <p className="text-sm text-cyan-300 mb-4">
        Esta gráfica muestra la severidad y la frecuencia de las anomalías detectadas a lo largo del tiempo, junto con su estado de resolución.
      </p>
      <ResponsiveContainer width="100%" height={500}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" />
          <XAxis
            dataKey="detection_time"
            tickFormatter={(time) => new Date(time).toLocaleDateString()}
            label={{ value: 'Fecha de Detección', position: 'insideBottomRight', offset: -5, fill: '#00FFFF' }}
            tick={{ fill: '#00FFFF' }}
          />
          <YAxis
            label={{ value: "Nivel de Severidad (1=Bajo, 2=Medio, 3=Alto)", angle: -90, position: 'insideLeft', fill: '#00FFFF' }}
            domain={[1, 3]}
            tickFormatter={(value) => `Nivel ${value}`}
            tick={{ fill: '#00FFFF' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" height={36} wrapperStyle={{ color: '#00FFFF' }} />
          <Line type="monotone" dataKey="severity" stroke="#FF00FF" dot={{ r: 5 }} name="Nivel de Severidad" />
          <ScatterChart>
            <Scatter data={data} dataKey="resolved" fill="#00C49F" name="Estado de Resolución" />
          </ScatterChart>
          <ReferenceLine x="2024-11-01" stroke="cyan" label={{ value: "Inicio del Incidente", fill: '#00FFFF' }} />
        </LineChart>
      </ResponsiveContainer>
      <p className="text-xs text-cyan-300 mt-2">
        * Los niveles de severidad se representan numéricamente: 1 para bajo, 2 para medio, y 3 para alto. Los puntos marcados indican si la anomalía ha sido resuelta.
      </p>
    </div>
  );
};

export default AnomalyTimelineChart;
