import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from "recharts";
import BoxHeader from "../components/BoxHeader";

interface ServerMetricsData {
  timestamp: string;
  cpu_usage: number;
  memory_usage: number;
}

const ServerPerformanceChart: React.FC = () => {
  const [serverMetricsData, setServerMetricsData] = useState<ServerMetricsData[]>([]);
  const [healthStatus, setHealthStatus] = useState("Healthy");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/realTimeMonitoring");
        const data = await response.json();
        if (data.serverMetrics && Array.isArray(data.serverMetrics)) {
          setServerMetricsData(data.serverMetrics);

          const latestData = data.serverMetrics[data.serverMetrics.length - 1];
          if (latestData.cpu_usage > 90 || latestData.memory_usage > 90) {
            setHealthStatus("Critical");
          } else if (latestData.cpu_usage > 75 || latestData.memory_usage > 75) {
            setHealthStatus("Warning");
          } else {
            setHealthStatus("Healthy");
          }
        } else {
          console.error("Unexpected data format:", data);
        }
      } catch (error) {
        console.error("Error fetching server metrics data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);

  const getLineColor = (value: number) => {
    if (value > 90) return "#FF007A"; // Critical
    if (value > 75) return "#FFA500"; // Warning
    return "#00FF9F"; // Healthy
  };

  return (
    <div className="p-4 bg-cyber-dark rounded-lg shadow-lg border border-cyan-500">
      <BoxHeader title="Monitoreo de Salud del Servidor" sideText="Actualizado cada 5s" />
      <div
        style={{
          marginBottom: "10px",
          fontSize: "18px",
          fontWeight: "bold",
          color:
            healthStatus === "Critical"
              ? "#FF007A"
              : healthStatus === "Warning"
              ? "#FFA500"
              : "#00FF9F",
        }}
      >
        Estado del servidor: {healthStatus}
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={serverMetricsData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1B263B" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={(value) => new Date(value).toLocaleTimeString()}
            tick={{ fill: "#B3B3B3" }}
          />
          <YAxis tick={{ fill: "#B3B3B3" }} />
          <Tooltip
            contentStyle={{ backgroundColor: "#0A0F29", borderColor: "#00E5FF" }}
            labelStyle={{ color: "#00FF9F" }}
            itemStyle={{ color: "#B3B3B3" }}
          />
          <Legend wrapperStyle={{ color: "#00E5FF" }} />
          <ReferenceLine y={75} stroke="#FFA500" strokeDasharray="3 3" label="75% (Warning)" />
          <ReferenceLine y={90} stroke="#FF007A" strokeDasharray="3 3" label="90% (Critical)" />
          <Line
            type="monotone"
            dataKey="cpu_usage"
            stroke={getLineColor(Math.max(...serverMetricsData.map((d) => d.cpu_usage)))}
            dot={{ r: 4, fill: getLineColor(Math.max(...serverMetricsData.map((d) => d.cpu_usage))) }}
            name="Uso de CPU (%)"
          />
          <Line
            type="monotone"
            dataKey="memory_usage"
            stroke={getLineColor(Math.max(...serverMetricsData.map((d) => d.memory_usage)))}
            dot={{ r: 4, fill: getLineColor(Math.max(...serverMetricsData.map((d) => d.memory_usage))) }}
            name="Uso de Memoria (%)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ServerPerformanceChart;
