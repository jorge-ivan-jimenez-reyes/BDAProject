import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface HistoricalData {
  record_id: number;
  date: string;
  average_traffic_volume: number;
  uptime_percentage: number;
}

const HistoricalDataComponent: React.FC = () => {
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/historicalData');
        if (!response.ok) {
          throw new Error('Error fetching historical data');
        }
        const data: HistoricalData[] = await response.json();
        setHistoricalData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setLoading(false);
      }
    };
    fetchHistoricalData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">Datos Históricos</h2>
      <table className="min-w-full bg-white border rounded-lg mb-8">
        <thead>
          <tr className="bg-blue-200">
            <th className="py-3 px-5 border-b text-left font-semibold">Fecha</th>
            <th className="py-3 px-5 border-b text-left font-semibold">Tráfico Promedio</th>
            <th className="py-3 px-5 border-b text-left font-semibold">Porcentaje de Uptime</th>
          </tr>
        </thead>
        <tbody>
          {historicalData.map((data) => (
            <tr key={data.record_id} className="hover:bg-gray-100">
              <td className="py-3 px-5 border-b">{data.date}</td>
              <td className="py-3 px-5 border-b">{data.average_traffic_volume}</td>
              <td className="py-3 px-5 border-b">{data.uptime_percentage}%</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-8">
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={historicalData} margin={{ top: 20, right: 30, left: 20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="date" tick={{ fill: '#555' }} />
            <YAxis tick={{ fill: '#555' }} />
            <Tooltip contentStyle={{ backgroundColor: '#f0f8ff', borderColor: '#blue' }} />
            <Area type="monotone" dataKey="average_traffic_volume" stroke="#8884d8" fill="#8884d8" name="Tráfico Promedio" />
            <Area type="monotone" dataKey="uptime_percentage" stroke="#82ca9d" fill="#82ca9d" name="Porcentaje de Uptime" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HistoricalDataComponent;
