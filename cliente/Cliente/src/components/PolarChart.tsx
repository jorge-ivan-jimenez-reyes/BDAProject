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
          'rgba(0, 229, 255, 0.6)', // bright-cyan
          'rgba(255, 0, 122, 0.6)', // neon-pink
          'rgba(143, 0, 255, 0.6)', // neon-purple
          'rgba(16, 185, 129, 0.6)', // neon-green
          'rgba(153, 102, 255, 0.6)', // dark-blue
        ],
        borderColor: [
          'rgb(0, 229, 255)', // bright-cyan
          'rgb(255, 0, 122)', // neon-pink
          'rgb(143, 0, 255)', // neon-purple
          'rgb(16, 185, 129)', // neon-green
          'rgb(153, 102, 255)', // dark-blue
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
          font: { size: 20 }, // Tamaño aumentado para una mejor legibilidad
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
    <div className="p-12 bg-cyber-dark rounded-lg shadow-lg flex flex-col items-center" style={{ height: '1200px' }}>
      <h2 className="text-5xl font-bold mb-8 text-bright-cyan text-center">
        Distribución de Incidentes de Seguridad
      </h2>

      {/* Descripción del gráfico */}
      <div className="text-light-gray text-center max-w-3xl mb-8 text-lg">
        <p className="mb-4">
          Este gráfico polar representa la <span className="text-neon-green font-semibold">distribución de incidentes de seguridad</span> en diferentes categorías. Cada "sector" del gráfico corresponde a un tipo de incidente (como accesos no autorizados, ataques de red, etc.) y muestra el conteo de incidentes registrados para cada tipo.
        </p>
        <ul className="mb-4">
          <li><span className="text-bright-cyan font-semibold">Bright-cyan</span>: Primer tipo de incidente.</li>
          <li><span className="text-neon-pink font-semibold">Neon-pink</span>: Segundo tipo de incidente.</li>
          <li><span className="text-neon-purple font-semibold">Neon-purple</span>: Tercer tipo de incidente.</li>
          <li><span className="text-neon-green font-semibold">Neon-green</span>: Cuarto tipo de incidente.</li>
          <li><span className="text-dark-blue font-semibold">Dark-blue</span>: Quinto tipo de incidente.</li>
        </ul>
        <p>
          El tamaño de cada sector es proporcional a la frecuencia de cada tipo de incidente, permitiendo identificar rápidamente cuáles son los incidentes más comunes.
        </p>
      </div>

      {/* Gráfico polar más grande */}
      <div className="flex justify-center items-center" style={{ height: '1000px', width: '1000px' }}>
        <PolarArea data={chartData} options={options} />
      </div>
    </div>
  );
};

export default PolarChart;
