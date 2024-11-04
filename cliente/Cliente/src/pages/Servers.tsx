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

interface PredictedIncident {
  prediction_id: number;
  incident_type: string;
  likelihood: number; // Ensure this is a number between 0 and 1
  impact_estimate: string;
  predicted_time: string;
}

interface HistoricalData {
  record_id: number;
  date: string; // Expecting a date string in a valid format
  average_traffic_volume: number; // Ensure this is a number
  uptime_percentage: number; // Ensure this is a number
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

        console.log('Predicted Data:', predictedData);
        console.log('Historical Data:', historicalData);

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
        <CircularProgress />
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
    date: new Date(record.date).toLocaleDateString(), // Ensure the date format is correct
  }));

  console.log('Formatted Predicted Incidents:', formattedPredictedIncidents);
  console.log('Formatted Historical Data:', formattedHistoricalData);

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold', marginBottom: 3 }}>
        Servidores - Predicción y Análisis Histórico
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={6} sx={{ padding: 3, borderRadius: 5, backgroundColor: '#ffffff' }}>
            <Typography variant="h5" gutterBottom sx={{ color: '#0d47a1', textAlign: 'center', fontWeight: 'bold' }}>
              Predicción de Incidentes
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" dataKey="likelihood" name="Probabilidad" domain={[0, 1]} />
                <YAxis type="number" dataKey="impact_value" name="Impacto" domain={[1, 3]} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="Incidentes" data={formattedPredictedIncidents} fill="#8884d8" />
              </ScatterChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={6} sx={{ padding: 3, borderRadius: 5, backgroundColor: '#ffffff' }}>
            <Typography variant="h5" gutterBottom sx={{ color: '#0d47a1', textAlign: 'center', fontWeight: 'bold' }}>
              Análisis de Datos Históricos
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={formattedHistoricalData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="average_traffic_volume" stroke="#8884d8" name="Tráfico Promedio" />
                <Line type="monotone" dataKey="uptime_percentage" stroke="#82ca9d" name="Uptime (%)" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Servers;
