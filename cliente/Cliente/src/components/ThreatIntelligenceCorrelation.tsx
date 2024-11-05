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

interface IncidentData {
  threat_type: string;
  incident_type: string;
  severity: string;
  incident_count: number;
}

const ThreatIntelligenceCorrelation: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/threatIntelligenceCorrelation');
        const incidentData: IncidentData[] = await response.json();

        const chartData = {
          datasets: incidentData.map((item) => {
            let severityValue: number;
            switch (item.severity.toLowerCase()) {
              case 'high':
                severityValue = 3;
                break;
              case 'medium':
                severityValue = 2;
                break;
              case 'low':
                severityValue = 1;
                break;
              default:
                severityValue = 0;
            }

            return {
              label: item.incident_type,
              data: [{
                x: item.threat_type === 'DDoS' ? 95 : item.threat_type === 'Malware' ? 80 : 75, // Example threat score
                y: severityValue,
                r: item.incident_count / 10 // Scale down the incident count for bubble size
              }],
              backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.6)`, // Random color for each incident type
            };
          }),
        };

        setData(chartData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, backgroundColor: '#0A0F29' }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#00FF9F', fontWeight: 'bold', textAlign: 'center', mb: 4 }}>
        Correlación de Inteligencia de Amenazas
      </Typography>
      <div style={{ height: '500px' }}>
        <Bubble
          data={{
            datasets: data?.datasets || [],
          }}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
                labels: {
                  color: '#B3B3B3',
                },
              },
              tooltip: {
                callbacks: {
                  label: (context: any) => `${context.dataset.label}: ${context.raw.x} threat score, ${context.raw.y} severity, ${context.raw.r} incidents`,
                },
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Threat Score',
                  color: '#B3B3B3',
                },
                ticks: {
                  color: '#B3B3B3',
                },
              },
              y: {
                title: {
                  display: true,
                  text: 'Severity Level',
                  color: '#B3B3B3',
                },
                ticks: {
                  color: '#B3B3B3',
                },
              },
            },
          }}
        />
      </div>
    </Box>
  );
};

export default ThreatIntelligenceCorrelation;
