import React, { useEffect, useState } from "react";
import GaugeChart from "react-gauge-chart";
import BoxHeader from "../components/BoxHeader";

const UptimeGauge: React.FC = () => {
  const [uptimePercentage, setUptimePercentage] = useState(0);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Intentando conectar al servidor...");
        const response = await fetch("http://localhost:5000/api/realTimeMonitoring");
        const data = await response.json();
        console.log("Datos recibidos del servidor:", data);

        if (data.uptimeMonitor) {
          const percentage = data.uptimeMonitor.is_online ? 1 : 0;
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
    <div className="p-4 bg-cyber-dark rounded-lg shadow-md text-center border border-metallic-silver">
      <BoxHeader title="🖥️ Panel de Estado del Sistema" sideText="🔄 Actualizado cada 5 segundos" />
      <h2 className="text-2xl font-semibold text-bright-cyan mt-3 mb-1">Estado Actual del Sistema</h2>
      <GaugeChart
        id="uptime-gauge"
        nrOfLevels={10}
        percent={uptimePercentage}
        textColor="#B3B3B3"
        arcPadding={0.02}
        colors={["#FF007A", "#00FF9F"]}
        animate={false}
      />
      <div className="mt-4 text-lg font-bold">
        {isOnline ? (
          <span style={{ color: "#00FF9F" }}>🟢 El sistema está en línea</span>
        ) : (
          <span style={{ color: "#FF007A" }}>🔴 El sistema está fuera de línea</span>
        )}
      </div>
      <h3 className="text-xl font-semibold text-neon-purple mt-5 mb-1">📊 Métricas Detalladas</h3>
      <p className="text-sm text-light-gray">
        El gráfico anterior representa el estado de uptime del sistema en tiempo real. Un gráfico lleno indica 100% de uptime, mientras que un gráfico vacío representa 0%.
      </p>
      <h3 className="text-xl font-semibold text-neon-purple mt-5 mb-1">🕒 Frecuencia de Actualización</h3>
      <p className="text-sm text-light-gray">
        Este panel se actualiza cada 5 segundos para proporcionar monitoreo en tiempo real.
      </p>
    </div>
  );
};

export default UptimeGauge;
