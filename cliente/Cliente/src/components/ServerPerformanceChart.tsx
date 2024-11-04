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

          // Determine health status based on the latest data point
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
    const interval = setInterval(fetchData, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  const getLineColor = (value: number) => {
    if (value > 90) return "#FF0000"; // Critical
    if (value > 75) return "#FFA500"; // Warning
    return "#00FF00"; // Healthy
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <BoxHeader title="Monitoreo de Salud del Servidor" sideText="Actualizado cada 5s" />
      <div
        style={{
          marginBottom: "10px",
          fontSize: "18px",
          fontWeight: "bold",
          color:
            healthStatus === "Critical"
              ? "#FF0000"
              : healthStatus === "Warning"
              ? "#FFA500"
              : "#00FF00",
        }}
      >
        Estado del servidor: {healthStatus}
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={serverMetricsData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" tickFormatter={(value) => new Date(value).toLocaleTimeString()} />
          <YAxis />
          <Tooltip />
          <Legend />
          <ReferenceLine y={75} stroke="#FFA500" strokeDasharray="3 3" label="75% (Warning)" />
          <ReferenceLine y={90} stroke="#FF0000" strokeDasharray="3 3" label="90% (Critical)" />
          <Line
            type="monotone"
            dataKey="cpu_usage"
            stroke={getLineColor(Math.max(...serverMetricsData.map((d) => d.cpu_usage)))}
          />
          <Line
            type="monotone"
            dataKey="memory_usage"
            stroke={getLineColor(Math.max(...serverMetricsData.map((d) => d.memory_usage)))}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ServerPerformanceChart;
