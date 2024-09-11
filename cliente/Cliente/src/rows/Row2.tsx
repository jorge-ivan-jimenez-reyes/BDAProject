import React, { useEffect, useState } from "react";
import {
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";
import BoxHeader from "../components/BoxHeader";

interface NetworkTrafficData {
  request_url: string;
  status_code: number;
}

const Row2: React.FC = () => {
  const [networkTrafficData, setNetworkTrafficData] = useState<NetworkTrafficData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/getDashboardData");
        const data = await response.json();
        setNetworkTrafficData(data.networkTraffic);
      } catch (error) {
        console.error("Error fetching network traffic data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <BoxHeader title="Status Codes per URL" sideText="Updated 5s ago" />
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={networkTrafficData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="request_url" 
            tickFormatter={(value: string) => value.substring(0, 15)} 
          />
          <YAxis />
          <Tooltip />
          <Bar dataKey="status_code" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Row2;
