import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import BoxHeader from "../components/BoxHeader";

interface ServerMetricsData {
  timestamp: string;
  cpu_usage: number;
  memory_usage: number;
}

const ServerPerformanceChart: React.FC = () => {
  const [serverMetricsData, setServerMetricsData] = useState<ServerMetricsData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/realTimeMonitoring");
        const data = await response.json();
        if (data.serverMetrics && Array.isArray(data.serverMetrics)) {
          setServerMetricsData(data.serverMetrics);
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

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <BoxHeader title="Server Performance (CPU & Memory Usage)" sideText="Updated every 5s" />
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={serverMetricsData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" tickFormatter={(value) => new Date(value).toLocaleTimeString()} />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="cpu_usage" stroke="#8884d8" />
          <Line type="monotone" dataKey="memory_usage" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ServerPerformanceChart;
