import React, { useEffect, useState } from 'react';
import SecurityIncidentsChart from '../components/SecurityIncidentsChart';
import IncidentResolutionPieChart from '../components/IncidentResolutionPieChart';
import AnomalyTimelineChart from '../components/AnomalyTimelineChart';

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
  severity: number; // Ensure severity is numeric for chart compatibility
  resolved: boolean;
}

interface SecurityData {
  securityIncidents: SecurityIncident[];
  incidentResolutionLogs: IncidentResolutionLog[];
  anomalyDetectionLogs: AnomalyDetectionLog[];
}

const Security: React.FC = () => {
  const [data, setData] = useState<SecurityData>({
    securityIncidents: [],
    incidentResolutionLogs: [],
    anomalyDetectionLogs: [],
  });

  const mapSeverityToNumber = (severity: string): number => {
    switch (severity.toLowerCase()) {
      case 'high':
        return 3;
      case 'medium':
        return 2;
      case 'low':
        return 1;
      default:
        return 0; // For unexpected or unhandled severity levels
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/securityIncidentAnalysis');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
    
        // Convert string counts to numbers and map severity
        const securityIncidents = result.securityIncidents.map((incident: SecurityIncident) => ({
          ...incident,
          count: parseInt(incident.count.toString(), 10),
        }));
        const incidentResolutionLogs = result.incidentResolutionLogs.map((log: IncidentResolutionLog) => ({
          ...log,
          count: parseInt(log.count.toString(), 10),
        }));
        const anomalyDetectionLogs = result.anomalyDetectionLogs.map((log: Omit<AnomalyDetectionLog, 'severity'> & { severity: string }) => ({
          ...log,
          severity: mapSeverityToNumber(log.severity).toString(), // Convert numeric value to string if needed
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
    </div>
  );
};

export default Security;
