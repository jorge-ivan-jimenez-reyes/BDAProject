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
      'Fallo en el Router',
      'Problemas de Cableado',
      'Error en la Aplicación',
      'Problemas de Configuración',
      'Congestión de Red',
      'Interrupciones',
      'Conexiones Lentas',
    ],
    datasets: [
      {
        label: 'Hardware',
        data: [700, 400, 300, 500, 450, 700, 600],
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
        data: [500, 250, 450, 300, 400, 500, 550],
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
        data: [300, 500, 200, 400, 300, 400, 500],
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
          label: (context: any) => `${context.dataset.label}: ${context.raw}`,
        },
      },
    },
  };

  return (
    <div className="p-8 bg-cyber-dark shadow-lg rounded-lg w-full max-w-4xl mx-auto"> {/* Increased max-width */}
      <h2 className="text-4xl font-bold text-center mb-6 text-light-gray">Análisis de Problemas en Telecomunicaciones</h2>
      <div className="relative" style={{ height: '700px' }}> {/* Increased height */}
        <Radar data={data} options={options} />
      </div>
    </div>
  );
};

export default ProblemFractalChart;
