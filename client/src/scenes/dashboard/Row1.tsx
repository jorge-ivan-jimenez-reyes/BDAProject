import { useState, useEffect, useMemo } from "react";
import BoxHeader from "@/components/BoxHeader";
import DashboardBox from "@/components/DashboardBox";
import { useTheme } from "@mui/material";
import {
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  BarChart,
  Bar,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  Line,
} from "recharts";

// Definir la estructura de los datos de network_traffic
interface NetworkTrafficData {
  ip_address: string;
  request_url: string;
  response_time: number;
  status_code: number;
}

// Definir la estructura de los datos de uptime_monitor
interface UptimeMonitorData {
  check_time: string;
  is_online: boolean;
  response_time: number;
  status_code: number;
}

// Definir la estructura de los datos del dashboard completo
interface DashboardData {
  networkTraffic: NetworkTrafficData[];
  uptimeMonitor: UptimeMonitorData[];
  eventLogs: any[]; // Puedes definir esto mejor si lo necesitas
}

const Row1 = () => {
  const { palette } = useTheme();
  
  // Estado para almacenar los datos obtenidos desde el backend
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  // Efecto para hacer la petición al backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/getDashboardData");
        const data: DashboardData = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error("Error al obtener los datos del dashboard:", error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  // Mapear los datos de network_traffic para mostrar el tiempo de respuesta y códigos de estado
  const networkTrafficData = useMemo(() => {
    return dashboardData?.networkTraffic.map((item: NetworkTrafficData) => ({
      name: item.request_url.substring(0, 15), // Usamos parte de la URL como nombre
      responseTime: item.response_time, // Tiempo de respuesta
      statusCode: item.status_code, // Código de estado (200 = OK, otros códigos = error)
    })) || [];
  }, [dashboardData]);

  // Mapear los datos de uptime_monitor para mostrar el tiempo de respuesta y si está online
  const uptimeMonitorData = useMemo(() => {
    return dashboardData?.uptimeMonitor.map((item: UptimeMonitorData) => ({
      name: item.check_time.substring(0, 10), // Fecha del chequeo
      responseTime: item.response_time, // Tiempo de respuesta
      isOnline: item.is_online ? 1 : 0, // 1 si está online, 0 si está offline
    })) || [];
  }, [dashboardData]);

  // Selección de color dinámico según la respuesta (más rápido es verde, más lento es rojo)
  const getColorByResponseTime = (responseTime: number) => {
    if (responseTime < 200) return palette.success.main; // Verde si el tiempo es menor de 200ms
    if (responseTime < 500) return palette.warning.main; // Amarillo si está entre 200 y 500ms
    return palette.error.main; // Rojo si es mayor a 500ms
  };

  return (
    <>
      {/* Gráfica de Tiempo de Respuesta por URL */}
      <DashboardBox gridArea="a">
        <BoxHeader
          title="Response Time per URL"
          subtitle="Tiempo de respuesta para cada URL monitoreada"
          sideText="Actualizado"
        />
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            width={500}
            height={400}
            data={networkTrafficData}
            margin={{ top: 15, right: 25, left: -10, bottom: 60 }}
          >
            <defs>
              {networkTrafficData.map((data, index) => (
                <linearGradient id={`colorResponseTime-${index}`} key={index} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={getColorByResponseTime(data.responseTime)} stopOpacity={0.5} />
                  <stop offset="95%" stopColor={getColorByResponseTime(data.responseTime)} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <XAxis dataKey="name" tickLine={false} style={{ fontSize: "10px" }} />
            <YAxis tickLine={false} axisLine={{ strokeWidth: "0" }} style={{ fontSize: "10px" }} />
            <Tooltip />
            {networkTrafficData.map((data, index) => (
              <Area
                key={index}
                type="monotone"
                dataKey="responseTime"
                dot={true}
                stroke={getColorByResponseTime(data.responseTime)}
                fillOpacity={1}
                fill={`url(#colorResponseTime-${index})`}
                animationDuration={800} // Animación suave
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </DashboardBox>

      {/* Gráfica de Status Code por URL */}
      <DashboardBox gridArea="b">
        <BoxHeader
          title="Status Code per URL"
          subtitle="Códigos de estado de las respuestas por URL"
          sideText="Actualizado"
        />
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={400}
            data={networkTrafficData}
            margin={{ top: 20, right: 0, left: -10, bottom: 55 }}
            barSize={30} // Ajuste del tamaño de la barra
          >
            <CartesianGrid vertical={false} stroke={palette.grey[800]} />
            <XAxis dataKey="name" tickLine={false} style={{ fontSize: "10px" }} />
            <YAxis tickLine={false} axisLine={false} style={{ fontSize: "10px" }} />
            <Tooltip />
            <Bar
              dataKey="statusCode"
              fill={palette.primary.main}
              radius={[5, 5, 0, 0]} // Bordes redondeados
              animationDuration={800} // Animación suave
            />
          </BarChart>
        </ResponsiveContainer>
      </DashboardBox>

      {/* Gráfica de Uptime por Fecha */}
      <DashboardBox gridArea="c">
        <BoxHeader
          title="Uptime Monitor"
          subtitle="Estado de los servidores (online / offline)"
          sideText="Actualizado"
        />
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={300}
            data={uptimeMonitorData}
            margin={{ top: 17, right: 15, left: -5, bottom: 58 }}
          >
            <CartesianGrid vertical={false} stroke={palette.grey[800]} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} style={{ fontSize: "10px" }} />
            <YAxis tickLine={false} axisLine={false} style={{ fontSize: "10px" }} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="isOnline"
              stroke={palette.success.main}
              animationDuration={800} // Animación suave
            />
          </LineChart>
        </ResponsiveContainer>

        {/* Indicador de Estado */}
        <div style={{ marginTop: '10px', textAlign: 'center' }}>
          {uptimeMonitorData.map((data) => (
            <div
              key={data.name}
              style={{
                display: 'inline-block',
                marginRight: '15px',
                padding: '5px 10px',
                backgroundColor: data.isOnline ? palette.success.main : palette.error.main,
                borderRadius: '5px',
                color: '#fff',
              }}
            >
              {data.name}: {data.isOnline ? 'Online' : 'Offline'}
            </div>
          ))}
        </div>
      </DashboardBox>
    </>
  );
};

export default Row1;
