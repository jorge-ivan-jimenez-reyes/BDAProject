// PolarChart.tsx
import React, { useEffect, useState } from 'react';
import { PolarArea } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, Tooltip, Legend, ArcElement } from 'chart.js';
import axios from 'axios';

// Registrar los componentes de Chart.js
ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

const PolarChart: React.FC = () => {
  const [data, setData] = useState<any>(null);

  // Función para obtener datos del backend
  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/securityIncidentPolarData');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching polar chart data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Configuración de datos y opciones para el gráfico polar
  const chartData = {
    labels: data?.labels || ['Red', 'Green', 'Yellow', 'Grey', 'Blue'],
    datasets: [
      {
        label: 'Conteo de Incidentes',
        data: data?.datasets[0].data || [11, 16, 7, 3, 14], // Datos de ejemplo
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 205, 86, 0.6)',
          'rgba(201, 203, 207, 0.6)',
          'rgba(54, 162, 235, 0.6)',
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(75, 192, 192)',
          'rgb(255, 205, 86)',
          'rgb(201, 203, 207)',
          'rgb(54, 162, 235)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#C0C0C0', // metallic-silver color para el texto de la leyenda
        },
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        ticks: {
          color: '#B3B3B3', // light-gray color para las etiquetas
          font: { size: 16 }, // Aumenta el tamaño de las etiquetas de los ejes
        },
        grid: {
          color: '#1B263B', // dark-blue para las líneas de la cuadrícula
        },
      },
    },
  };

  if (!data) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-light-gray">Cargando datos...</p>
      </div>
    );
  }

  return (
    <div className="p-12 bg-gray-800 rounded-lg shadow-lg flex justify-center items-center" style={{ height: '800px' }}>
      <h2 className="absolute text-center text-4xl font-bold mb-4 text-cyan-400 top-10">
        Análisis de Incidentes de Seguridad
      </h2>
      <div style={{ height: '700px', width: '700px' }}>
        <PolarArea data={chartData} options={options} />
      </div>
    </div>
  );
};

export default PolarChart;
