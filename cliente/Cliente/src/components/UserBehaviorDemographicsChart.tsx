import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

interface UserActivityData {
  hour: number;
  activity_count: number;
}

interface UserDemographicsData {
  age_group: string;
  gender: string;
  user_count: number;
  color: string;
}

const UserBehaviorDemographicsChart: React.FC = () => {
  const [userActivity, setUserActivity] = useState<UserActivityData[]>([]);
  const [userDemographics, setUserDemographics] = useState<UserDemographicsData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/userBehaviorDemographics');
        const data = await response.json();
        setUserActivity(data.userBehaviorDemographics);
        setUserDemographics(data.userDemographics);
      } catch (error) {
        console.error('Error fetching user behavior and demographics data:', error);
      }
    };

    fetchData();
  }, []);

  const activityData = {
    labels: userActivity.map((item) => `${item.hour}:00`),
    datasets: [
      {
        label: 'Cantidad de Actividades',
        data: userActivity.map((item) => item.activity_count),
        backgroundColor: 'rgba(0, 229, 255, 0.7)',
        borderColor: 'rgba(0, 229, 255, 1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(0, 229, 255, 0.9)',
      },
    ],
  };

  const demographicsData = {
    labels: userDemographics.map((item) => `${item.age_group} - ${item.gender}`),
    datasets: [
      {
        label: 'Distribución Demográfica',
        data: userDemographics.map((item) => item.user_count),
        backgroundColor: userDemographics.map((item) => item.color),
        borderColor: userDemographics.map((item) => item.color.replace(/0.6\)/, '1)')),
        borderWidth: 1,
        hoverOffset: 10,
      },
    ],
  };

  const activityOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Actividad de Usuario por Hora',
        color: '#00FF9F', // neon-green
        font: { size: 20 },
      },
      legend: {
        position: 'top' as const,
        labels: {
          color: '#C0C0C0', // metallic-silver
          font: { size: 16 },
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: 'Hora del Día', color: '#C0C0C0' },
        ticks: { color: '#C0C0C0' },
        grid: { color: '#1B263B' }, // dark-blue
      },
      y: {
        title: { display: true, text: 'Número de Actividades', color: '#C0C0C0' },
        ticks: { color: '#C0C0C0' },
        grid: { color: '#1B263B' },
      },
    },
  };

  const demographicsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Distribución Demográfica',
        color: '#FF007A', // neon-pink
        font: { size: 20 },
      },
      legend: {
        position: 'top' as const,
        labels: {
          color: '#C0C0C0',
          font: { size: 16 },
        },
      },
    },
  };

  return (
    <div className="p-8 bg-cyber-dark rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-center mb-6 text-bright-cyan">
        Análisis de Comportamiento y Demografía de Usuarios
      </h2>

      {/* Gráfico de barras para actividad por hora */}
      <div className="my-8">
        <h3 className="text-xl font-semibold mb-4 text-light-gray">Actividad de Usuario por Hora</h3>
        <div style={{ height: '500px' }}>
          <Bar data={activityData} options={activityOptions} />
        </div>
      </div>

      {/* Gráfico de pie para distribución demográfica */}
      <div className="my-8">
        <h3 className="text-xl font-semibold mb-4 text-light-gray">Distribución Demográfica</h3>
        <div style={{ height: '500px' }}>
          <Pie data={demographicsData} options={demographicsOptions} />
        </div>
      </div>
    </div>
  );
};

export default UserBehaviorDemographicsChart;
