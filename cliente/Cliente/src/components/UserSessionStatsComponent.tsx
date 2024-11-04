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
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#3f51b5', textAlign: 'center', fontWeight: 'bold', marginBottom: 3 }}>
        Estadísticas de Sesiones de Usuario
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={3}>
          <Paper elevation={6} sx={{ padding: 1, borderRadius: 3, backgroundColor: '#f3f6f9', height: '100%' }}>
            <Typography variant="h6" sx={{ color: '#1e88e5', textAlign: 'center', fontWeight: 'bold', marginBottom: 1 }}>
              Resumen de Sesiones
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#e3f2fd' }}>
                  <TableCell sx={{ fontWeight: 'bold', color: '#1e88e5', padding: '4px' }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#1e88e5', padding: '4px' }}>Interacciones</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#1e88e5', padding: '4px' }}>Dur. Máx (s)</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#1e88e5', padding: '4px' }}>Dur. Mín (s)</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#1e88e5', padding: '4px' }}>Dur. Prom (s)</TableCell>
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
                  backgroundColor: '#ffffff',
                  boxShadow: '0px 10px 30px rgba(0,0,0,0.1)',
                  transition: '0.3s',
                  '&:hover': {
                    boxShadow: '0px 12px 40px rgba(0,0,0,0.2)',
                  },
                }}
              >
                <Typography variant="h5" gutterBottom sx={{ color: '#0d47a1', textAlign: 'center', fontWeight: 'bold' }}>
                  Total de Interacciones por Usuario
                </Typography>
                <ResponsiveContainer width="100%" height={450}>
                  <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorInteractions" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#42a5f5" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#42a5f5" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#dce3ea" />
                    <XAxis dataKey="user_id" tick={{ fill: '#616161' }} />
                    <YAxis tick={{ fill: '#616161' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#f0f4f8', borderColor: '#42a5f5', borderRadius: 10 }}
                      labelStyle={{ color: '#0d47a1' }}
                      itemStyle={{ color: '#424242' }}
                    />
                    <Legend wrapperStyle={{ color: '#0d47a1', fontWeight: 'bold' }} />
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
                  backgroundColor: '#ffffff',
                  boxShadow: '0px 10px 30px rgba(0,0,0,0.1)',
                  transition: '0.3s',
                  '&:hover': {
                    boxShadow: '0px 12px 40px rgba(0,0,0,0.2)',
                  },
                }}
              >
                <Typography variant="h5" gutterBottom sx={{ color: '#0d47a1', textAlign: 'center', fontWeight: 'bold' }}>
                  Duración Promedio de Sesión por Usuario
                </Typography>
                <ResponsiveContainer width="100%" height={450}>
                  <LineChart data={lineChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorAvgSession" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ff7043" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#ff7043" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#dce3ea" />
                    <XAxis dataKey="user_id" tick={{ fill: '#616161' }} />
                    <YAxis tick={{ fill: '#616161' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#f0f4f8', borderColor: '#ff7043', borderRadius: 10 }}
                      labelStyle={{ color: '#0d47a1' }}
                      itemStyle={{ color: '#424242' }}
                    />
                    <Legend wrapperStyle={{ color: '#0d47a1', fontWeight: 'bold' }} />
                    <Line
                      type="monotone"
                      dataKey="avg_session"
                      stroke="url(#colorAvgSession)"
                      strokeWidth={3}
                      name="Duración Promedio (s)"
                      dot={{ r: 6, strokeWidth: 2, fill: '#ff7043' }}
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
