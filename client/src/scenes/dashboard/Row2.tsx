import { useState, useEffect, useMemo } from "react";
import BoxHeader from "@/components/BoxHeader";
import DashboardBox from "@/components/DashboardBox";
import { useTheme, CircularProgress, Box } from "@mui/material";
import {
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Definir la estructura de los datos de las tablas
interface SecurityIncidentsData {
  incident_time: string;
  description: string;
  severity: string;
}

interface EventLogsData {
  event_time: string;
  description: string;
  event_type: string;
}

interface DashboardData {
  securityIncidents: SecurityIncidentsData[];
  eventLogs: EventLogsData[];
  uptimeMonitor: any[]; // Puedes definir esto mejor si lo necesitas
}

const Row2 = () => {
  const { palette } = useTheme();
  
  // Estado para almacenar los datos obtenidos desde el backend
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  // Efecto para hacer la petición al backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/getDashboardData");
        const data: DashboardData = await response.json();
        setDashboardData(data);
        setLoading(false); // Detener el indicador de carga cuando se obtienen los datos
      } catch (error) {
        console.error("Error al obtener los datos del dashboard:", error);
        setLoading(false); // Detener la carga aunque haya error
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  // Mapear los datos de security_incidents para mostrar la severidad
  const securityIncidentsData = useMemo(() => {
    if (!dashboardData || !dashboardData.securityIncidents) return [];
    return dashboardData.securityIncidents.map((item: SecurityIncidentsData) => ({
      time: item.incident_time.substring(0, 10), // Fecha del incidente
      severity: item.severity, // Severidad del incidente
      description: item.description, // Descripción del incidente
    }));
  }, [dashboardData]);

  // Mapear los datos de event_logs para mostrar los eventos recientes
  const eventLogsData = useMemo(() => {
    if (!dashboardData || !dashboardData.eventLogs) return [];
    return dashboardData.eventLogs.map((item: EventLogsData) => ({
      time: item.event_time.substring(0, 10), // Fecha del evento
      type: item.event_type, // Tipo de evento
      description: item.description, // Descripción del evento
    }));
  }, [dashboardData]);

  // Configuración de los colores para la gráfica de Pie (severidad)
  const pieColors = [palette.error.main, palette.warning.main, palette.success.main];

  // Generar los datos para la gráfica de severidad de incidentes
  const pieData = useMemo(() => {
    const critical = securityIncidentsData.filter(item => item.severity === "Critical").length;
    const warning = securityIncidentsData.filter(item => item.severity === "Warning").length;
    const info = securityIncidentsData.filter(item => item.severity === "Info").length;

    return [
      { name: "Critical", value: critical },
      { name: "Warning", value: warning },
      { name: "Info", value: info },
    ];
  }, [securityIncidentsData]);

  // Mostrar estado de carga si los datos no están listos
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Mostrar mensaje si no hay datos disponibles
  if (!dashboardData || (!securityIncidentsData.length && !eventLogsData.length)) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <p>No hay datos disponibles.</p>
      </Box>
    );
  }

  return (
    <>
      {/* Gráfica de Incidentes de Seguridad */}
      <DashboardBox gridArea="d">
        <BoxHeader title="Security Incidents" subtitle="Distribución por severidad" sideText="Actualizado" />
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              innerRadius={40}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={pieColors[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </DashboardBox>

      {/* Gráfica de Eventos Recientes */}
      <DashboardBox gridArea="e">
        <BoxHeader title="Recent Events" subtitle="Log de eventos recientes" sideText="Últimos 30 días" />
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={eventLogsData}
            margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
            barSize={40}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="description" fill={palette.primary.main} />
          </BarChart>
        </ResponsiveContainer>
      </DashboardBox>

      {/* Gráfica de Logs por Tipo de Evento */}
      <DashboardBox gridArea="f">
        <BoxHeader title="Events by Type" subtitle="Cantidad de eventos por tipo" sideText="Actualizado" />
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={eventLogsData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="type" stroke={palette.secondary.main} />
          </LineChart>
        </ResponsiveContainer>
      </DashboardBox>
    </>
  );
};

export default Row2;
