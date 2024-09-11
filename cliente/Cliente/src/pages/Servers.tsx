import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Servers = () => {
  const [uptimeData, setUptimeData] = useState([]);
  const [serverStatus, setServerStatus] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const resUptime = await fetch('/api/uptimeData');
      const resStatus = await fetch('/api/serverStatus');
      const dataUptime = await resUptime.json();
      const dataStatus = await resStatus.json();

      setUptimeData(dataUptime);
      setServerStatus(dataStatus);
    };
    
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Server Status</h2>

      {/* Estado de los servidores */}
      <ResponsiveContainer width="50%" height={300}>
        <PieChart>
          <Pie data={serverStatus} dataKey="total" cx="50%" cy="50%" outerRadius={80}>
            <Cell fill="#82ca9d" />
            <Cell fill="#d84a4a" />
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      {/* Tiempo de actividad */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={uptimeData}>
          <XAxis dataKey="check_time" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="is_online" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Servers;
