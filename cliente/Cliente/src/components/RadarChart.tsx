// RadarChart.tsx
import React, { useEffect, useState } from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

// Registrar los componentes de Chart.js
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const RadarChart: React.FC = () => {
  const [data, setData] = useState<any>(null);

  // Función para obtener datos del backend
  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/securityIncidentRadarData');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching radar chart data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Configuración de datos y opciones para el gráfico
  const chartData = {
    labels: data?.labels || [],
    datasets: [
      {
        label: 'Conteo de Incidentes por Severidad',
        data: data?.datasets[0].data || [],
        fill: true,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgb(255, 99, 132)',
        pointBackgroundColor: 'rgb(255, 99, 132)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(255, 99, 132)',
      },
      {
        label: 'Otra Métrica',
        data: [3, 2, 1, 4], // Placeholder para otro conjunto de datos
        fill: true,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgb(54, 162, 235)',
        pointBackgroundColor: 'rgb(54, 162, 235)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(54, 162, 235)',
      },
    ],
  };

  const options = {
    elements: {
      line: {
        borderWidth: 3, // Ancho de las líneas
      },
    },
    scales: {
      r: {
        angleLines: {
          display: true, // Muestra las líneas angulares
        },
        suggestedMin: 0,
        suggestedMax: 5,
      },
    },
  };

  if (!data) {
    return <div className="flex justify-center items-center h-full"><p>Cargando datos...</p></div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-center text-2xl font-bold mb-4">Análisis de Incidentes de Seguridad</h2>
      <Radar data={chartData} options={options} />
    </div>
  );
};

export default RadarChart;
