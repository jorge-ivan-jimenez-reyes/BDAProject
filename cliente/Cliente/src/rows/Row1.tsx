import React, { useEffect, useState } from "react";
import { AreaChart, XAxis, YAxis, Tooltip, Area, CartesianGrid, ResponsiveContainer } from "recharts";
import BoxHeader from "../components/BoxHeader";

interface NetworkTrafficData {
  request_url: string;
  response_time: number;
}

const Row1: React.FC = () => {
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
      <BoxHeader title="Network Traffic" sideText="Updated 5s ago" />
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={networkTrafficData}>
          <defs>
            <linearGradient id="colorResponseTime" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="request_url" tickFormatter={(value) => value.substring(0, 15)} />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="response_time" stroke="#8884d8" fillOpacity={1} fill="url(#colorResponseTime)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Row1;
