import React, { useEffect, useState } from "react";
import {
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";
import BoxHeader from "../components/BoxHeader";

interface UptimeMonitorData {
  check_time: string;
  is_online: boolean;
}

const Row3: React.FC = () => {
  const [uptimeMonitorData, setUptimeMonitorData] = useState<UptimeMonitorData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/getDashboardData");
        const data = await response.json();
        setUptimeMonitorData(data.uptimeMonitor);
      } catch (error) {
        console.error("Error fetching uptime monitor data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <BoxHeader title="Uptime Monitor" sideText="Updated 5s ago" />
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={uptimeMonitorData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="check_time" 
            tickFormatter={(value: string) => value.substring(0, 10)} 
          />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="is_online" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Row3;
