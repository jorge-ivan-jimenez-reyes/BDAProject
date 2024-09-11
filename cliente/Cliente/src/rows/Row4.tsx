import React, { useEffect, useState } from "react";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";
import BoxHeader from "../components/BoxHeader";

interface SecurityIncidentsData {
  incident_type: string;
  count: number;
}

const Row4: React.FC = () => {
  const [securityIncidentsData, setSecurityIncidentsData] = useState<SecurityIncidentsData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/getSecurityIncidents");
        const data = await response.json();
        setSecurityIncidentsData(data);
      } catch (error) {
        console.error("Error fetching security incidents:", error);
      }
    };
    fetchData();
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <BoxHeader title="Security Incidents" subtitle="Incidentes por tipo" />
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={securityIncidentsData}
            dataKey="count"
            nameKey="incident_type"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {securityIncidentsData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Row4;
