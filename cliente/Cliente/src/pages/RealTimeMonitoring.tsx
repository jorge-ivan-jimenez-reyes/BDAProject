import React from "react";
import ServerPerformanceChart from "../components/ServerPerformanceChart";
import UptimeGauge from "../components/UptimeGauge";
import EventHeatmap from "../components/EventHeatmap";

const RealTimeMonitor: React.FC = () => {
  return (
    <div className="space-y-8 px-6 py-8 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-800">Real-Time Monitoring and Performance Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-4 bg-white shadow-lg rounded-lg">
          <ServerPerformanceChart />
        </div>
        <div className="p-4 bg-white shadow-lg rounded-lg">
          <UptimeGauge />
        </div>
      </div>
      <div className="p-4 bg-white shadow-lg rounded-lg mt-8">
        <EventHeatmap />
      </div>
    </div>
  );
};

export default RealTimeMonitor;
