// ProblemFractalChart.tsx
import React from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const ProblemFractalChart: React.FC = () => {
  const data = {
    labels: [
      'Errores de Capa Física',
      'Errores de Capa de Enlace de Datos',
      'Errores de Capa de Red',
      'Problemas de Capa de Transporte',
      'Errores de Capa de Sesión',
      'Problemas de Capa de Presentación',
      'Errores de Capa de Aplicación',
    ],
    datasets: [
      {
        label: 'Hardware',
        data: [800, 500, 200, 300, 450, 400, 700],
        fill: true,
        backgroundColor: 'rgba(0, 255, 159, 0.2)', // neon-green with transparency
        borderColor: '#00FF9F', // neon-green
        pointBackgroundColor: '#00FF9F',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#00FF9F',
      },
      {
        label: 'Software',
        data: [300, 250, 450, 600, 200, 350, 500],
        fill: true,
        backgroundColor: 'rgba(143, 0, 255, 0.2)', // neon-purple with transparency
        borderColor: '#8F00FF', // neon-purple
        pointBackgroundColor: '#8F00FF',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#8F00FF',
      },
      {
        label: 'Red',
        data: [100, 700, 400, 500, 300, 250, 300],
        fill: true,
        backgroundColor: 'rgba(0, 229, 255, 0.2)', // bright-cyan with transparency
        borderColor: '#00E5FF', // bright-cyan
        pointBackgroundColor: '#00E5FF',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#00E5FF',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      line: {
        borderWidth: 2,
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        suggestedMin: 0,
        suggestedMax: 1000,
        angleLines: {
          color: '#1B263B', // dark-blue for the angle lines
        },
        grid: {
          color: '#1B263B', // dark-blue for the grid lines
        },
        pointLabels: {
          font: {
            size: 16, // Increased font size for better readability
          },
          color: '#B3B3B3', // light-gray for point labels
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 16, // Larger font size for the legend
          },
          color: '#B3B3B3', // light-gray for legend text
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.dataset.label} (Capa ${context.label}): ${context.raw} problemas`,
        },
      },
    },
  };

  return (
    <div className="p-8 bg-cyber-dark shadow-lg rounded-lg w-full max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-6 text-light-gray">Análisis de Problemas en Capas de Red</h2>
      <p className="text-light-gray text-center mb-8 max-w-3xl mx-auto">
        Este gráfico radar ilustra la distribución de problemas en las diferentes capas del modelo OSI, categorizados en hardware, software y red. Los valores altos en una capa particular
        indican una mayor cantidad de problemas en esa área. Utiliza esta información para identificar qué capas y qué aspectos (hardware, software, red) requieren más atención.
      </p>
      <div className="relative" style={{ height: '800px' }}>
        <Radar data={data} options={options} />
      </div>
    </div>
  );
};

export default ProblemFractalChart;
