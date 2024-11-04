import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Paper, Grid, CircularProgress } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts';

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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  const barChartData = sessionStats.map((stat) => ({
    user_id: `User ${stat.user_id}`,
    total_interactions: stat.total_interactions,
  }));

  const lineChartData = sessionStats.map((stat) => ({
    user_id: `User ${stat.user_id}`,
    avg_session: stat.avg_session_duration ?? 0,
  }));

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#00FF9F', textAlign: 'center', fontWeight: 'bold', marginBottom: 3 }}>
        Estadísticas de Sesiones de Usuario
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={3}>
          <Paper elevation={6} sx={{ padding: 1, borderRadius: 3, backgroundColor: '#1B263B', color: '#B3B3B3', height: '100%' }}>
            <Typography variant="h6" sx={{ color: '#00FF9F', textAlign: 'center', fontWeight: 'bold', marginBottom: 1 }}>
              Resumen de Sesiones
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#0A0F29' }}>
                  <TableCell sx={{ fontWeight: 'bold', color: '#00E5FF', padding: '4px' }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#00E5FF', padding: '4px' }}>Interacciones</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#00E5FF', padding: '4px' }}>Dur. Máx (s)</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#00E5FF', padding: '4px' }}>Dur. Mín (s)</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#00E5FF', padding: '4px' }}>Dur. Prom (s)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sessionStats.map((stat) => (
                  <TableRow key={stat.user_id} hover>
                    <TableCell sx={{ padding: '4px' }}>{stat.user_id}</TableCell>
                    <TableCell sx={{ padding: '4px' }}>{stat.total_interactions}</TableCell>
                    <TableCell sx={{ padding: '4px' }}>
                      {typeof stat.max_session_duration === 'number' ? stat.max_session_duration.toFixed(2) : 'N/A'}
                    </TableCell>
                    <TableCell sx={{ padding: '4px' }}>
                      {typeof stat.min_session_duration === 'number' ? stat.min_session_duration.toFixed(2) : 'N/A'}
                    </TableCell>
                    <TableCell sx={{ padding: '4px' }}>
                      {typeof stat.avg_session_duration === 'number' ? stat.avg_session_duration.toFixed(2) : 'N/A'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>

        <Grid item xs={12} md={9}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Paper
                elevation={6}
                sx={{
                  padding: 3,
                  borderRadius: 5,
                  backgroundColor: '#0A0F29',
                  boxShadow: '0px 10px 30px rgba(0,255,159,0.2)',
                  '&:hover': { boxShadow: '0px 12px 40px rgba(0,255,159,0.4)' },
                }}
              >
                <Typography variant="h5" gutterBottom sx={{ color: '#00FF9F', textAlign: 'center', fontWeight: 'bold' }}>
                  Total de Interacciones por Usuario
                </Typography>
                <ResponsiveContainer width="100%" height={450}>
                  <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorInteractions" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8F00FF" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8F00FF" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1B263B" />
                    <XAxis dataKey="user_id" tick={{ fill: '#B3B3B3' }} />
                    <YAxis tick={{ fill: '#B3B3B3' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0A0F29', borderColor: '#00FF9F', borderRadius: 10 }}
                      labelStyle={{ color: '#00FF9F' }}
                      itemStyle={{ color: '#B3B3B3' }}
                    />
                    <Legend wrapperStyle={{ color: '#00FF9F', fontWeight: 'bold' }} />
                    <Bar dataKey="total_interactions" fill="url(#colorInteractions)" name="Interacciones Totales" barSize={50} radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper
                elevation={6}
                sx={{
                  padding: 3,
                  borderRadius: 5,
                  backgroundColor: '#0A0F29',
                  boxShadow: '0px 10px 30px rgba(143,0,255,0.2)',
                  '&:hover': { boxShadow: '0px 12px 40px rgba(143,0,255,0.4)' },
                }}
              >
                <Typography variant="h5" gutterBottom sx={{ color: '#8F00FF', textAlign: 'center', fontWeight: 'bold' }}>
                  Duración Promedio de Sesión por Usuario
                </Typography>
                <ResponsiveContainer width="100%" height={450}>
                  <LineChart data={lineChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorAvgSession" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#00E5FF" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1B263B" />
                    <XAxis dataKey="user_id" tick={{ fill: '#B3B3B3' }} />
                    <YAxis tick={{ fill: '#B3B3B3' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0A0F29', borderColor: '#00E5FF', borderRadius: 10 }}
                      labelStyle={{ color: '#8F00FF' }}
                      itemStyle={{ color: '#B3B3B3' }}
                    />
                    <Legend wrapperStyle={{ color: '#8F00FF', fontWeight: 'bold' }} />
                    <Line
                      type="monotone"
                      dataKey="avg_session"
                      stroke="url(#colorAvgSession)"
                      strokeWidth={3}
                      name="Duración Promedio (s)"
                      dot={{ r: 6, strokeWidth: 2, fill: '#00E5FF' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserSessionStatsComponent;
