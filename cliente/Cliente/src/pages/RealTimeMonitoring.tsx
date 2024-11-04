import React from "react";
import ServerPerformanceChart from "../components/ServerPerformanceChart";
import UptimeGauge from "../components/UptimeGauge";
import EventHeatmap from "../components/EventHeatmap";

const RealTimeMonitor: React.FC = () => {
  return (
    <div className="space-y-8 px-6 py-8 bg-cyber-dark min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center text-neon-green">Monitoreo en Tiempo Real y Desempeño</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 bg-dark-blue shadow-[0_0_20px_rgba(0,255,159,0.5)] rounded-lg transition duration-300 hover:shadow-[0_0_30px_rgba(0,255,159,0.7)]">
          <ServerPerformanceChart />
        </div>
        <div className="p-6 bg-dark-blue shadow-[0_0_20px_rgba(143,0,255,0.5)] rounded-lg transition duration-300 hover:shadow-[0_0_30px_rgba(143,0,255,0.7)]">
          <UptimeGauge />
        </div>
      </div>
      <div className="p-6 bg-dark-blue shadow-[0_0_20px_rgba(0,229,255,0.5)] rounded-lg mt-8 transition duration-300 hover:shadow-[0_0_30px_rgba(0,229,255,0.7)]">
        <EventHeatmap />
      </div>
    </div>
  );
};

export default RealTimeMonitor;
