import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

interface SecurityIncident {
  ip_address: string;
  resolution_status: string;
  incident_type: string;
}

const Row6 = () => {
  const [incidentStatusData, setIncidentStatusData] = useState<SecurityIncident[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/getSecurityIncidents');
      const data = await res.json();
      setIncidentStatusData(data.securityIncidents);
    };
    fetchData();
  }, []);

  return (
    <div className="p-6 bg-gray-800 rounded-md shadow-lg">
      <h2 className="text-xl text-white mb-4">Security Incidents by Resolution Status</h2>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ color: 'white' }}>IP Address</TableCell>
            <TableCell style={{ color: 'white' }}>Incident Type</TableCell>
            <TableCell style={{ color: 'white' }}>Resolution Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {incidentStatusData.map((incident, index) => (
            <TableRow key={index}>
              <TableCell style={{ color: 'white' }}>{incident.ip_address}</TableCell>
              <TableCell style={{ color: 'white' }}>{incident.incident_type}</TableCell>
              <TableCell style={{ color: 'white' }}>{incident.resolution_status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Row6;
