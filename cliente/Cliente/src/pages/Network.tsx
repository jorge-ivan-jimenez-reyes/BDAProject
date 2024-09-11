import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const Network = () => {
  const [trafficData, setTrafficData] = useState([]);
  const [responseTimes, setResponseTimes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const resTraffic = await fetch('/api/networkTraffic');
      const resResponseTimes = await fetch('/api/responseTimes');
      const dataTraffic = await resTraffic.json();
      const dataResponseTimes = await resResponseTimes.json();

      setTrafficData(dataTraffic);
      setResponseTimes(dataResponseTimes);
    };
    
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Network Traffic</h2>

      {/* Tráfico de red por IP */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={trafficData}>
          <XAxis dataKey="ip_address" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total_bytes" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>

      {/* Tiempo de respuesta promedio */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={responseTimes}>
          <XAxis dataKey="request_url" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="avg_response_time" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Network;
