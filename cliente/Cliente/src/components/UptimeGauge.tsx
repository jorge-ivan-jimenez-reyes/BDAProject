import React, { useEffect, useState } from "react";
import GaugeChart from "react-gauge-chart";
import BoxHeader from "../components/BoxHeader";

const UptimeGauge: React.FC = () => {
  const [uptimePercentage, setUptimePercentage] = useState(0);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Intentando conectar al servidor..."); // Log in Spanish for connection start
        const response = await fetch("http://localhost:5000/api/realTimeMonitoring");
        const data = await response.json();
        console.log("Datos recibidos del servidor:", data); // Log in Spanish for received data

        if (data.uptimeMonitor) {
          const percentage = data.uptimeMonitor.is_online ? 1 : 0; // 100% for online, 0% for offline
          setUptimePercentage(percentage);
          setIsOnline(data.uptimeMonitor.is_online);
        } else {
          console.error("Formato de datos inesperado:", data);
        }
      } catch (error) {
        console.error("Error al obtener datos de uptime:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md text-center">
      <BoxHeader title="Panel de Estado del Sistema" sideText="Actualizado cada 5 segundos" />
      <h2 style={{ fontSize: "20px", margin: "10px 0", color: "#333" }}>Estado Actual del Sistema</h2>
      <GaugeChart
        id="uptime-gauge"
        nrOfLevels={10}
        percent={uptimePercentage}
        textColor="#000"
        arcPadding={0.02}
        colors={["#FF0000", "#00FF00"]}
        animate={false}
      />
      <div style={{ marginTop: "15px", fontSize: "18px", fontWeight: "bold" }}>
        {isOnline ? (
          <span style={{ color: "green" }}>El sistema está en línea</span>
        ) : (
          <span style={{ color: "red" }}>El sistema está fuera de línea</span>
        )}
      </div>
      <h3 style={{ fontSize: "16px", margin: "20px 0 5px", color: "#555" }}>Métricas Detalladas</h3>
      <p style={{ fontSize: "14px", color: "#666" }}>
        El gráfico anterior representa el estado de uptime del sistema en tiempo real. Un gráfico lleno indica 100% de uptime, mientras que un gráfico vacío representa 0%.
      </p>
      <h3 style={{ fontSize: "16px", margin: "20px 0 5px", color: "#555" }}>Frecuencia de Actualización</h3>
      <p style={{ fontSize: "14px", color: "#666" }}>
        Este panel se actualiza cada 5 segundos para proporcionar monitoreo en tiempo real.
      </p>
    </div>
  );
};

export default UptimeGauge;
