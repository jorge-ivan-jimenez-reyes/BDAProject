import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';

interface SecurityIncident {
  ip_address: string;
  incident_type: string;
  description: string;
  severity: string;
  resolution_status: string;
  incident_time: string;
}

const Row8 = () => {
  const [criticalIncidents, setCriticalIncidents] = useState<SecurityIncident[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/getSecurityIncidents');
      const data = await res.json();
      const filteredIncidents = data.securityIncidents.filter(
        (incident: SecurityIncident) => incident.severity === 'Crítico' || incident.severity === 'Alto'
      );
      setCriticalIncidents(filteredIncidents);
    };
    fetchData();
  }, []);

  return (
    <div className="p-6 bg-gray-800 rounded-md shadow-lg">
      <Typography variant="h4" color="white" gutterBottom>Critical Security Incidents</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ color: 'white' }}>Incident Time</TableCell>
            <TableCell style={{ color: 'white' }}>IP Address</TableCell>
            <TableCell style={{ color: 'white' }}>Incident Type</TableCell>
            <TableCell style={{ color: 'white' }}>Severity</TableCell>
            <TableCell style={{ color: 'white' }}>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {criticalIncidents.map((incident, index) => (
            <TableRow key={index} style={{ backgroundColor: incident.severity === 'Crítico' ? '#ff6b6b' : '#ffcc00' }}>
              <TableCell style={{ color: 'white' }}>{new Date(incident.incident_time).toLocaleString()}</TableCell>
              <TableCell style={{ color: 'white' }}>{incident.ip_address}</TableCell>
              <TableCell style={{ color: 'white' }}>{incident.incident_type}</TableCell>
              <TableCell style={{ color: 'white' }}>{incident.severity}</TableCell>
              <TableCell style={{ color: 'white' }}>{incident.resolution_status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Row8;
