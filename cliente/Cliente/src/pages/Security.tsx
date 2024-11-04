import React, { useEffect, useState } from 'react';
import SecurityIncidentsChart from '../components/SecurityIncidentsChart';
import IncidentResolutionPieChart from '../components/IncidentResolutionPieChart';
import AnomalyTimelineChart from '../components/AnomalyTimelineChart';
import RadarChart from '../components/RadarChart';

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
  severity: number;
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
    <div className="p-8 bg-cyber-dark min-h-screen space-y-8">
      <h1 className="text-4xl font-bold text-center text-neon-green mb-8">
        Análisis de Incidentes de Seguridad
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {data.securityIncidents.length > 0 && (
          <div className="p-4 bg-dark-blue shadow-[0_0_20px_rgba(255,0,122,0.5)] rounded-lg">
            <SecurityIncidentsChart data={data.securityIncidents} />
          </div>
        )}
        {data.incidentResolutionLogs.length > 0 && (
          <div className="p-4 bg-dark-blue shadow-[0_0_20px_rgba(143,0,255,0.5)] rounded-lg">
            <IncidentResolutionPieChart data={data.incidentResolutionLogs} />
          </div>
        )}
      </div>

      {data.anomalyDetectionLogs.length > 0 && (
        <div className="p-4 bg-dark-blue shadow-[0_0_20px_rgba(0,229,255,0.5)] rounded-lg">
          <AnomalyTimelineChart data={data.anomalyDetectionLogs} />
        </div>
      )}

      <div className="p-4 bg-dark-blue shadow-[0_0_20px_rgba(0,255,159,0.5)] rounded-lg">
        <RadarChart />
      </div>
    </div>
  );
};

export default Security;
