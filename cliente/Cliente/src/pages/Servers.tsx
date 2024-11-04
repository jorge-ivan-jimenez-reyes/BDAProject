import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Grid, CircularProgress } from '@mui/material';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import ProblemFractalChart from '../components/ProblemFractalChart';

interface PredictedIncident {
  prediction_id: number;
  incident_type: string;
  likelihood: number;
  impact_estimate: string;
  predicted_time: string;
}

interface HistoricalData {
  record_id: number;
  date: string;
  average_traffic_volume: number;
  uptime_percentage: number;
}

const Servers: React.FC = () => {
  const [predictedIncidents, setPredictedIncidents] = useState<PredictedIncident[]>([]);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const predictedResponse = await fetch('http://localhost:5000/api/predictedIncidents');
        const historicalResponse = await fetch('http://localhost:5000/api/historicalData');

        if (!predictedResponse.ok || !historicalResponse.ok) {
          throw new Error('Error fetching data');
        }

        const predictedData: PredictedIncident[] = await predictedResponse.json();
        const historicalData: HistoricalData[] = await historicalResponse.json();

        setPredictedIncidents(predictedData);
        setHistoricalData(historicalData);
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  const formattedPredictedIncidents = predictedIncidents.map((incident) => ({
    ...incident,
    impact_value:
      incident.impact_estimate.toLowerCase() === 'low'
        ? 1
        : incident.impact_estimate.toLowerCase() === 'medium'
        ? 2
        : 3,
  }));

  const formattedHistoricalData = historicalData.map((record) => ({
    ...record,
    date: new Date(record.date).toLocaleDateString(),
  }));

  return (
    <Box sx={{ padding: 4, backgroundColor: '#0A0F29' }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#00FF9F', fontWeight: 'bold', textAlign: 'center', mb: 4 }}>
        Servidores - Predicción y Análisis Histórico
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={6} sx={{ padding: 3, borderRadius: 4, backgroundColor: '#1B263B' }}>
            <Typography variant="h5" gutterBottom sx={{ color: '#8F00FF', textAlign: 'center', fontWeight: 'bold' }}>
              Predicción de Incidentes
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis type="number" dataKey="likelihood" name="Probabilidad" domain={[0, 1]} tick={{ fill: '#00E5FF' }} />
                <YAxis type="number" dataKey="impact_value" name="Impacto" domain={[1, 3]} tick={{ fill: '#00E5FF' }} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#1B263B', borderColor: '#8F00FF' }} />
                <Scatter name="Incidentes" data={formattedPredictedIncidents} fill="#FF007A" />
              </ScatterChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={6} sx={{ padding: 3, borderRadius: 4, backgroundColor: '#1B263B' }}>
            <ProblemFractalChart />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={6} sx={{ padding: 3, borderRadius: 4, backgroundColor: '#1B263B' }}>
            <Typography variant="h5" gutterBottom sx={{ color: '#8F00FF', textAlign: 'center', fontWeight: 'bold' }}>
              Análisis de Datos Históricos
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
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
