import React, { useEffect, useState } from 'react';
import { Bubble } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Box, Typography, CircularProgress } from '@mui/material';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

interface PredictedIncident {
  prediction_id: number;
  incident_type: string;
  likelihood: number;
  impact_estimate: string;
  predicted_time: string;
}

const IncidentBubbleChart: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/predictedIncidents');
        const predictedIncidents: PredictedIncident[] = await response.json();

        const chartData = predictedIncidents.map((incident) => ({
          x: incident.likelihood,
          y: incident.impact_estimate.toLowerCase() === 'low' ? 1 : incident.impact_estimate.toLowerCase() === 'medium' ? 2 : 3,
          r: Math.random() * 10 + 5,
          label: incident.incident_type,
        }));

        setData({
          datasets: [
            {
              label: 'Predicción de Incidentes',
              data: chartData,
              backgroundColor: 'rgba(255, 99, 132, 0.6)',
              borderColor: 'rgba(255, 99, 132, 1)',
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching incident data:', error);
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

  return (
    <Box sx={{ padding: 4, backgroundColor: '#0A0F29', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#00FF9F', fontWeight: 'bold', textAlign: 'center', mb: 4 }}>
        Análisis de Incidentes Predichos
      </Typography>
      <Typography variant="subtitle1" sx={{ color: '#B3B3B3', textAlign: 'center', mb: 4 }}>
        Este gráfico muestra la probabilidad de ocurrencia y el impacto estimado de incidentes predichos en los servidores.
      </Typography>
      <Box sx={{ textAlign: 'center', color: '#B3B3B3', mb: 2 }}>
        <Typography variant="body1">
          <strong>Eje X - Probabilidad:</strong> Indica la probabilidad de ocurrencia del incidente (0 a 1).
        </Typography>
        <Typography variant="body1">
          <strong>Eje Y - Impacto:</strong> Muestra el nivel de impacto: <br/>
          1: Bajo (Low), 2: Medio (Medium), 3: Alto (High)
        </Typography>
      </Box>
      <div style={{ height: '700px', width: '100%' }}>
        <Bubble
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top' as const,
                labels: { color: '#B3B3B3' },
              },
              tooltip: {
                callbacks: {
                  label: (context: any) => `${context.raw.label}: ${context.raw.x} probabilidad, ${context.raw.y} impacto`,
                },
              },
            },
            scales: {
              x: {
                title: { display: true, text: 'Probabilidad', color: '#B3B3B3', font: { size: 16 } },
                min: 0,
                max: 1,
                ticks: { color: '#B3B3B3' },
              },
              y: {
                title: { display: true, text: 'Impacto (1 = Bajo, 3 = Alto)', color: '#B3B3B3', font: { size: 16 } },
                min: 0,
                max: 3,
                ticks: { color: '#B3B3B3' },
              },
            },
          }}
        />
      </div>
    </Box>
  );
};

export default IncidentBubbleChart;
