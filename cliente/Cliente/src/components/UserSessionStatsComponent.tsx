import React, { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, LineChart, Line, LabelList } from 'recharts';

interface UserSessionStats {
  user_id: number;
  total_interactions: number;
  max_session_duration: number | null;
  min_session_duration: number | null;
  avg_session_duration: number | null;
}

const UserSessionStatsComponent: React.FC = () => {
  const [sessionStats, setSessionStats] = useState<UserSessionStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessionStats = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/userSessionStats');
        if (!response.ok) {
          throw new Error(`Error fetching session stats: ${response.statusText}`);
        }
        const data: UserSessionStats[] = await response.json();
        setSessionStats(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching session stats:', error);
        setLoading(false);
      }
    };

    fetchSessionStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <CircularProgress />
      </div>
    );
  }

  // Prepare data for charts
  const barChartData = sessionStats.map((stat) => ({
    user_id: `User ${stat.user_id}`,
    total_interactions: stat.total_interactions,
  }));

  const lineChartData = sessionStats.map((stat) => ({
    user_id: `User ${stat.user_id}`,
    avg_session: stat.avg_session_duration ?? 0,
  }));

  return (
    <div className="p-6 bg-cyber-dark min-h-screen text-light-gray">
      <h1 className="text-5xl text-neon-green font-bold text-center mb-10">Estadísticas de Sesiones de Usuario</h1>

      <p className="text-light-gray text-center mb-12 text-lg">
        Este análisis detalla la actividad de los usuarios, mostrando la frecuencia de interacciones y la duración promedio de sesiones para cada usuario. Estos gráficos y tablas ayudan a comprender el nivel de actividad y el compromiso de los usuarios.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Tabla de Sesiones */}
        <div className="col-span-1 md:col-span-2 bg-dark-blue text-light-gray p-6 rounded-lg shadow-md">
          <h2 className="text-3xl text-neon-purple text-center font-semibold mb-4">Resumen de Sesiones</h2>
          <p className="text-md text-center mb-6">
            Esta tabla muestra información clave para cada usuario, como el total de interacciones realizadas y las duraciones de sus sesiones en segundos. La "Dur. Máx" indica la sesión más larga registrada, mientras que la "Dur. Mín" muestra la más corta. La "Dur. Prom" es el promedio de todas las sesiones para el usuario.
          </p>
          <table className="w-full text-left text-lg">
            <thead className="bg-cyber-dark text-neon-green">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Interacciones</th>
                <th className="p-4">Dur. Máx (s)</th>
                <th className="p-4">Dur. Mín (s)</th>
                <th className="p-4">Dur. Prom (s)</th>
              </tr>
            </thead>
            <tbody>
              {sessionStats.map((stat) => (
                <tr key={stat.user_id} className="hover:bg-light-gray hover:bg-opacity-10">
                  <td className="p-4">{stat.user_id}</td>
                  <td className="p-4">{stat.total_interactions}</td>
                  <td className="p-4">
                    {typeof stat.max_session_duration === 'number'
                      ? stat.max_session_duration.toFixed(2)
                      : 'N/A'}
                  </td>
                  <td className="p-4">
                    {typeof stat.min_session_duration === 'number'
                      ? stat.min_session_duration.toFixed(2)
                      : 'N/A'}
                  </td>
                  <td className="p-4">
                    {typeof stat.avg_session_duration === 'number'
                      ? stat.avg_session_duration.toFixed(2)
                      : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Gráficos */}
        <div className="col-span-1 md:col-span-2 grid grid-cols-1 gap-6">
          {/* Gráfico de Barras */}
          <div className="bg-dark-blue p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-3xl text-neon-purple text-center font-bold mb-6">Total de Interacciones por Usuario</h2>
            <p className="text-light-gray text-center mb-4">
              Este gráfico de barras muestra la cantidad total de interacciones realizadas por cada usuario. Es útil para identificar los usuarios más activos en términos de interacciones.
            </p>
            <ResponsiveContainer width="100%" height={500}>
              <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#B3B3B3" />
                <XAxis dataKey="user_id" tick={{ fill: '#B3B3B3' }} label={{ value: "Usuarios", position: "insideBottom", offset: -10, fill: "#B3B3B3" }} />
                <YAxis tick={{ fill: '#B3B3B3' }} label={{ value: "Interacciones Totales", angle: -90, position: "insideLeft", fill: "#B3B3B3" }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1B263B', borderColor: '#8F00FF', borderRadius: 10 }}
                  labelStyle={{ color: '#8F00FF' }}
                  itemStyle={{ color: '#C0C0C0' }}
                />
                <Legend wrapperStyle={{ color: '#8F00FF', fontWeight: 'bold' }} />
                <Bar dataKey="total_interactions" fill="#8F00FF" name="Interacciones Totales" barSize={50} radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico de Línea */}
          <div className="bg-dark-blue p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-3xl text-bright-cyan text-center font-bold mb-6">Duración Promedio de Sesión por Usuario</h2>
            <p className="text-light-gray text-center mb-4">
              Este gráfico de líneas muestra la duración promedio de sesión en segundos para cada usuario, permitiendo analizar la intensidad de su compromiso en cada sesión. Los puntos en la línea indican la duración promedio para cada usuario específico.
            </p>
            <ResponsiveContainer width="100%" height={600}>
              <LineChart data={lineChartData} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#B3B3B3" />
                <XAxis dataKey="user_id" tick={{ fill: '#B3B3B3' }} label={{ value: "Usuarios", position: "insideBottom", offset: -10, fill: "#B3B3B3" }} />
                <YAxis tick={{ fill: '#B3B3B3' }} label={{ value: "Duración Prom (s)", angle: -90, position: "insideLeft", fill: "#B3B3B3" }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1B263B', borderColor: '#00E5FF', borderRadius: 10 }}
                  labelStyle={{ color: '#00E5FF' }}
                  itemStyle={{ color: '#C0C0C0' }}
                />
                <Legend wrapperStyle={{ color: '#00E5FF', fontWeight: 'bold' }} />
                <Line
                  type="monotone"
                  dataKey="avg_session"
                  stroke="#00E5FF"
                  strokeWidth={3}
                  name="Duración Promedio (s)"
                  dot={{ r: 6, strokeWidth: 2, fill: '#00E5FF' }}
                >
                  <LabelList dataKey="avg_session" position="top" style={{ fill: '#00E5FF', fontSize: 12 }} />
                </Line>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSessionStatsComponent;
