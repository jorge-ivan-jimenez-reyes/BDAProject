import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Grid, CircularProgress } from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';
import ProblemFractalChart from '../components/ProblemFractalChart';
import IncidentBubbleChart from '../components/IncidentBubbleChart';

interface HistoricalData {
  record_id: number;
  date: string;
  average_traffic_volume: number;
  uptime_percentage: number;
}

interface IncidentData {
  likelihood: number;
  impact: number;
  incident_type: string;
}

const Servers: React.FC = () => {
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [incidentData, setIncidentData] = useState<IncidentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const historicalResponse = await fetch('http://localhost:5000/api/historicalData');
        const incidentsResponse = await fetch('http://localhost:5000/api/predictedIncidents');

        if (!historicalResponse.ok || !incidentsResponse.ok) {
          throw new Error('Error fetching data');
        }

        const historicalData: HistoricalData[] = await historicalResponse.json();
        const incidentData: IncidentData[] = await incidentsResponse.json();

        setHistoricalData(historicalData);
        setIncidentData(
          incidentData.map((incident) => ({
            ...incident,
            impact: incident.impact_estimate === 'Low' ? 1 : incident.impact_estimate === 'Medium' ? 2 : 3,
          }))
        );
      } catch (error) {
        console.error('Error fetching server data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  const formattedHistoricalData = historicalData.map((record) => ({
    ...record,
    date: new Date(record.date).toLocaleDateString(),
  }));

  return (
    <Box sx={{ padding: 4, backgroundColor: '#0A0F29', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#00FF9F', fontWeight: 'bold', textAlign: 'center', mb: 4 }}>
        Servidores - Análisis de Incidentes y Datos Históricos
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} lg={6}>
          <Paper elevation={6} sx={{ padding: 3, borderRadius: 4, backgroundColor: '#1B263B', height: '100%' }}>
            <Typography variant="h5" gutterBottom sx={{ color: '#8F00FF', textAlign: 'center', fontWeight: 'bold' }}>
              Predicción de Incidentes - Gráfico de Burbujas
            </Typography>
            <IncidentBubbleChart data={incidentData} />
          </Paper>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Paper elevation={6} sx={{ padding: 3, borderRadius: 4, backgroundColor: '#1B263B', height: '100%' }}>
            <ProblemFractalChart />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={6} sx={{ padding: 3, borderRadius: 4, backgroundColor: '#1B263B' }}>
            <Typography variant="h5" gutterBottom sx={{ color: '#8F00FF', textAlign: 'center', fontWeight: 'bold' }}>
              Análisis de Datos Históricos
            </Typography>
            <ResponsiveContainer width="100%" height={500}>
              <LineChart data={formattedHistoricalData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="date" tick={{ fill: '#00E5FF' }} />
                <YAxis tick={{ fill: '#00E5FF' }} />
                <Tooltip contentStyle={{ backgroundColor: '#1B263B', borderColor: '#8F00FF' }} />
                <Legend wrapperStyle={{ color: '#00FF9F' }} />
                <Line type="monotone" dataKey="average_traffic_volume" stroke="#00FF9F" name="Tráfico Promedio" />
                <Line type="monotone" dataKey="uptime_percentage" stroke="#FF007A" name="Uptime (%)" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Servers;
