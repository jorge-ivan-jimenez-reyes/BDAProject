// EventFrequencyChart.tsx
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, PointElement);

interface EventData {
  event_date: string;
  event_count: number;
}

const calculateMovingAverage = (data: number[], windowSize: number) => {
  const movingAvg = [];
  for (let i = 0; i < data.length; i++) {
    if (i < windowSize - 1) {
      movingAvg.push(null);
    } else {
      const windowData = data.slice(i - windowSize + 1, i + 1);
      const avg = windowData.reduce((a, b) => a + b, 0) / windowSize;
      movingAvg.push(avg);
    }
  }
  return movingAvg;
};

const calculateStandardDeviation = (data: number[], movingAvg: number[], windowSize: number) => {
  const deviations = [];
  for (let i = 0; i < data.length; i++) {
    if (i < windowSize - 1 || movingAvg[i] === null) {
      deviations.push(null);
    } else {
      const windowData = data.slice(i - windowSize + 1, i + 1);
      const mean = movingAvg[i];
      const variance = windowData.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / windowSize;
      deviations.push(Math.sqrt(variance));
    }
  }
  return deviations;
};

const EventFrequencyChart: React.FC = () => {
  const [eventData, setEventData] = useState<EventData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/eventFrequency');
        const data = await response.json();
        setEventData(data);
      } catch (error) {
        console.error('Error fetching event frequency data:', error);
      }
    };
    fetchData();
  }, []);

  const dates = eventData.map((item) => new Date(item.event_date).toLocaleDateString());
  const counts = eventData.map((item) => item.event_count);
  const windowSize = 7;

  const movingAvg = calculateMovingAverage(counts, windowSize);
  const stdDeviation = calculateStandardDeviation(counts, movingAvg, windowSize);
  const upperBand = movingAvg.map((avg, i) => (avg !== null && stdDeviation[i] !== null ? avg + stdDeviation[i] : null));
  const lowerBand = movingAvg.map((avg, i) => (avg !== null && stdDeviation[i] !== null ? avg - stdDeviation[i] : null));

  const data = {
    labels: dates,
    datasets: [
      {
        label: 'Frecuencia de Eventos',
        data: counts,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        fill: true,
        tension: 0.2,
      },
      {
        label: 'Media Móvil (7 días)',
        data: movingAvg,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        fill: false,
        borderDash: [5, 5],
        pointStyle: 'rect',
        tension: 0.2,
      },
      {
        label: 'Banda Superior',
        data: upperBand,
        borderColor: 'rgba(255, 206, 86, 0.5)',
        backgroundColor: 'rgba(255, 206, 86, 0.1)',
        fill: '-1',
        borderDash: [2, 2],
        tension: 0.2,
      },
      {
        label: 'Banda Inferior',
        data: lowerBand,
        borderColor: 'rgba(255, 206, 86, 0.5)',
        backgroundColor: 'rgba(255, 206, 86, 0.1)',
        fill: '-1',
        borderDash: [2, 2],
        tension: 0.2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Frecuencia de Eventos con Media Móvil y Desviación Estándar',
        color: '#00FF9F',
        font: { size: 18, weight: 'bold' },
      },
      legend: {
        position: 'top' as const,
        labels: {
          color: '#e2e8f0',
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label || '';
            const value = context.raw || 0;
            return `${label}: ${value.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Fecha',
          color: '#e2e8f0',
          font: { size: 14 },
        },
        ticks: {
          color: '#e2e8f0',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Cantidad de Eventos',
          color: '#e2e8f0',
          font: { size: 14 },
        },
        ticks: {
          color: '#e2e8f0',
        },
      },
    },
  };

  return (
    <div style={{ padding: '1rem', backgroundColor: '#0A0F29', borderRadius: '8px', boxShadow: '0px 4px 12px rgba(0,0,0,0.2)', width: '100%' }}>
      <h2 style={{ color: '#00FF9F', textAlign: 'center', marginBottom: '1rem' }}>Análisis de Frecuencia de Eventos</h2>
      <div style={{ width: '100%', height: '500px' }}>
        <Line data={data} options={options} />
      </div>

      {/* Explicación de la Gráfica */}
      <div style={{ marginTop: '2rem', color: '#e2e8f0', fontSize: '0.9rem' }}>
        <h3>Descripción de la Gráfica</h3>
        <ul>
          <li><strong>Frecuencia de Eventos (Línea Azul):</strong> Representa la cantidad de eventos ocurridos en cada fecha específica.</li>
          <li><strong>Media Móvil (Línea Roja con Puntos):</strong> Calcula el promedio de eventos en una ventana móvil de 7 días, suavizando fluctuaciones y mostrando la tendencia general.</li>
          <li><strong>Bandas de Desviación Estándar (Amarillo):</strong> Muestran una desviación estándar por encima y por debajo de la media móvil, ayudando a identificar periodos de actividad inusualmente alta o baja.</li>
        </ul>

        <h3>Interpretación</h3>
        <ul>
          <li><strong>Observación de Picos:</strong> La media móvil (línea roja) destaca picos y caídas en la frecuencia de eventos. Cuando la frecuencia de eventos supera la banda superior, se observa un periodo de actividad anormalmente alta; si cae por debajo de la banda inferior, indica actividad anormalmente baja.</li>
          <li><strong>Variaciones y Cambios en la Tendencia:</strong> La línea de media móvil permite visualizar tendencias, como aumentos o disminuciones sostenidas, proporcionando una vista clara de los cambios en la frecuencia de eventos.</li>
          <li><strong>Soporte en la Toma de Decisiones:</strong> Al analizar los patrones de la media móvil y las bandas de desviación estándar, se pueden predecir periodos futuros de alta o baja actividad, lo cual es útil para ajustar estrategias o recursos de acuerdo con la variabilidad observada.</li>
        </ul>
      </div>
    </div>
  );
};

export default EventFrequencyChart;
