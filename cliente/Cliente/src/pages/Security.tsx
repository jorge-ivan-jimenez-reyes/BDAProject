import React, { useEffect, useState } from 'react';
import SecurityIncidentsChart from '../components/SecurityIncidentsChart';
import IncidentResolutionPieChart from '../components/IncidentResolutionPieChart';
import AnomalyTimelineChart from '../components/AnomalyTimelineChart';
import RadarChart from '../components/RadarChart'; // Importa el RadarChart

interface SecurityIncident {
  incident_type: string;
  severity: string;
  count: number;
}

interface IncidentResolutionLog {
  status: string;
  count: number;
}

interface AnomalyDetectionLog {
  anomaly_id: number;
  detection_time: string;
  anomaly_type: string;
  description: string;
  related_metric: string;
  severity: number; // Asegúrate de que la severidad sea numérica para la compatibilidad del gráfico
  resolved: boolean;
}

interface APIResponse {
  securityIncidents: SecurityIncident[];
  incidentResolutionLogs: IncidentResolutionLog[];
  anomalyDetectionLogs: AnomalyDetectionLog[];
}

const Security: React.FC = () => {
  const [data, setData] = useState<APIResponse>({
    securityIncidents: [],
    incidentResolutionLogs: [],
    anomalyDetectionLogs: [],
  });

  const mapSeverityToNumber = (severity: string): number => {
    switch (severity.toLowerCase()) {
      case 'high':
      case 'crítico':
      case 'critical':
        return 3;
      case 'medium':
      case 'medio':
        return 2;
      case 'low':
      case 'bajo':
        return 1;
      default:
        return 0;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/securityIncidentAnalysis');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result: APIResponse = await response.json();

        // Convertir conteos de incidentes a números
        const securityIncidents = result.securityIncidents.map((incident) => ({
          ...incident,
          count: parseInt(incident.count.toString(), 10),
        }));

        const incidentResolutionLogs = result.incidentResolutionLogs.map((log) => ({
          ...log,
          count: parseInt(log.count.toString(), 10),
        }));

        const anomalyDetectionLogs = result.anomalyDetectionLogs.map((log) => ({
          ...log,
          severity: mapSeverityToNumber(log.severity.toString()),
        }));

        setData({
          securityIncidents,
          incidentResolutionLogs,
          anomalyDetectionLogs,
        });
      } catch (error) {
        console.error('Error fetching security data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-4">
      {data.securityIncidents.length > 0 && (
        <SecurityIncidentsChart data={data.securityIncidents} />
      )}
      {data.incidentResolutionLogs.length > 0 && (
        <IncidentResolutionPieChart data={data.incidentResolutionLogs} />
      )}
      {data.anomalyDetectionLogs.length > 0 && (
        <AnomalyTimelineChart data={data.anomalyDetectionLogs} />
      )}
      {/* Agregar el RadarChart aquí */}
      {data.securityIncidents.length > 0 && (
        <RadarChart />
      )}
    </div>
  );
};

export default Security;
