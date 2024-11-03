import React, { useEffect, useState } from "react";
import { AreaChart, XAxis, YAxis, Tooltip, Area, CartesianGrid, ResponsiveContainer } from "recharts";
import BoxHeader from "../components/BoxHeader";

interface ServerMetricsData {
  timestamp: string;
  cpu_usage: number;
  memory_usage: number;
}

const Row1: React.FC = () => {
  const [serverMetricsData, setServerMetricsData] = useState<ServerMetricsData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/realTimeMonitoring");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched data:", data);

        // Safely check for data structure
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
  }, []);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <BoxHeader title="Server Metrics" sideText="Updated every 5s" />
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={serverMetricsData}>
          <defs>
            <linearGradient id="colorCPU" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" tickFormatter={(value) => new Date(value).toLocaleTimeString()} />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="cpu_usage" stroke="#82ca9d" fill="url(#colorCPU)" />
          <Area type="monotone" dataKey="memory_usage" stroke="#8884d8" fill="url(#colorMemory)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Row1;
