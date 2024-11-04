import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { LinePlot } from '@mui/x-charts/LineChart';
import { CircularProgress, Typography, useTheme } from '@mui/material';
import { ResponsiveChartContainer } from '@mui/x-charts/ResponsiveChartContainer';
import { styled } from '@mui/material/styles';
import { useDrawingArea, useXScale, useYScale } from '@mui/x-charts/hooks';

interface PredictedIncident {
  prediction_id: number;
  predicted_time: string;
  incident_type: string;
  likelihood: number; // Expected to be between 0 and 1
  impact_estimate: string; // Expected values: 'low', 'medium', 'high'
}

const StyledPath = styled('path')<{ color: 'primary' | 'secondary' }>(
  ({ theme, color }) => ({
    fill: 'none',
    stroke: theme.palette.text[color],
    shapeRendering: 'crispEdges',
    strokeWidth: 1,
    pointerEvents: 'none',
  }),
);

function CartesianAxis() {
  const { left, top, width, height } = useDrawingArea();
  const yAxisScale = useYScale();
  const xAxisScale = useXScale();

  const yOrigin = yAxisScale(0);
  const xOrigin = xAxisScale(0);

  const yTicks = [-2, -1, 0, 1, 2, 3, 4, 5]; // Adjust yTicks based on your data
  const xTicks = [new Date(), new Date(Date.now() + 86400000)]; // Adjust for your time data

  return (
    <>
      {yTicks.map((value) => (
        <StyledPath key={value} d={`M ${left} ${yAxisScale(value)} l ${width} 0`} color="secondary" />
      ))}
      {xTicks.map((value) => (
        <StyledPath key={value.toString()} d={`M ${xAxisScale(value)} ${top} l 0 ${height}`} color="secondary" />
      ))}
      <StyledPath d={`M ${left} ${yOrigin} l ${width} 0`} color="primary" />
      <StyledPath d={`M ${xOrigin} ${top} l 0 ${height}`} color="primary" />
    </>
  );
}

const PredictedIncidentsComponent: React.FC = () => {
  const [predictedIncidents, setPredictedIncidents] = useState<PredictedIncident[]>([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchPredictedIncidents = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/predictedIncidents');
        if (!response.ok) {
          throw new Error('Error fetching predicted incidents');
        }
        const data: PredictedIncident[] = await response.json();
        setPredictedIncidents(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPredictedIncidents();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Prepare data for the Line Chart
  const timeData = predictedIncidents.map((incident) => new Date(incident.predicted_time));
  const likelihoodData = predictedIncidents.map((incident) => incident.likelihood * 100); // Convert to percentage
  const impactData = predictedIncidents.map((incident) =>
    incident.impact_estimate.toLowerCase() === 'low'
      ? 1
      : incident.impact_estimate.toLowerCase() === 'medium'
      ? 2
      : 3
  );

  const valueFormatter = (date: Date) =>
    date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

  const xAxisCommon = {
    data: timeData,
    scaleType: 'time',
    valueFormatter,
    title: {
      text: 'Fecha de Predicción',
      display: true,
      color: theme.palette.primary.main,
      font: {
        size: 16,
        weight: 'bold',
      },
    },
  } as const;

  const config = {
    series: [
      {
        type: 'line',
        data: likelihoodData,
        label: 'Probabilidad (%)',
        color: theme.palette.secondary.main,
        lineStyle: 'solid',
      },
      {
        type: 'line',
        data: impactData,
        label: 'Estimación de Impacto',
        color: '#ff7043',
        lineStyle: 'dashed',
      },
    ],
    height: 400,
    animation: {
      duration: 1500,
      easing: 'ease-in-out',
    },
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold', marginBottom: 3, color: theme.palette.primary.dark }}>
        Predicción de Incidentes - Análisis Visual
      </Typography>
      <Paper
        elevation={6}
        sx={{
          padding: 3,
          borderRadius: 5,
          backgroundColor: theme.palette.background.paper,
          boxShadow: '0px 10px 30px rgba(0,0,0,0.1)',
          transition: '0.3s',
          '&:hover': {
            boxShadow: '0px 12px 40px rgba(0,0,0,0.2)',
          },
        }}
      >
        <ResponsiveChartContainer height={400} margin={{ top: 5, left: 5, right: 5, bottom: 5 }} series={config.series}>
          <CartesianAxis />
          <LinePlot xAxis={[xAxisCommon]} {...config} />
        </ResponsiveChartContainer>
      </Paper>
    </Box>
  );
};

export default PredictedIncidentsComponent;
