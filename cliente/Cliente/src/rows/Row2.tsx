import React, { useEffect, useState } from "react";
import {
  ScatterChart,
  XAxis,
  YAxis,
  Tooltip,
  Scatter,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  Legend
} from "recharts";
import BoxHeader from "../components/BoxHeader";

interface NetworkTrafficData {
  request_url: string;
  status_code: number;
  request_count: number;
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
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);

  const getColorByRequestCount = (request_count: number) => {
    if (request_count > 50) return "rgba(255, 0, 0, 0.8)"; // Red for high frequency
    if (request_count > 20) return "rgba(255, 165, 0, 0.8)"; // Orange for medium frequency
    return "rgba(70, 130, 180, 0.8)"; // Blue for low frequency
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <BoxHeader title="Request Frequency per URL" sideText="Updated every 5s" />
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="request_url"
            tickFormatter={(value: string) => value.substring(0, 15)}
            name="Request URL"
            label={{ value: "Request URL", position: "insideBottom", offset: -5 }}
          />
          <YAxis
            dataKey="status_code"
            name="Status Code"
            label={{ value: "Status Code", angle: -90, position: "insideLeft" }}
          />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            formatter={(value: number, name: string) => [`${value}`, name === "request_count" ? "Request Count" : name]}
            labelFormatter={(label) => `URL: ${label}`}
          />
          <Legend />
          <Scatter name="Request Count" data={networkTrafficData} shape="circle">
            {networkTrafficData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getColorByRequestCount(entry.request_count)}
                radius={Math.min(entry.request_count * 1.5, 60)}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Row2;
