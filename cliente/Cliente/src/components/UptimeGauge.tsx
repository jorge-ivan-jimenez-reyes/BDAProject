import React, { useEffect, useState } from "react";
import GaugeChart from "react-gauge-chart";
import BoxHeader from "../components/BoxHeader";

const UptimeGauge: React.FC = () => {
  const [uptimePercentage, setUptimePercentage] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/realTimeMonitoring");
        const data = await response.json();
        if (data.uptimeMonitor) {
          const percentage = data.uptimeMonitor.is_online ? 1 : 0; // Simplified to show online status as 100% or 0%
          setUptimePercentage(percentage);
        } else {
          console.error("Unexpected data format:", data);
        }
      } catch (error) {
        console.error("Error fetching uptime data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <BoxHeader title="Uptime Percentage" sideText="Real-Time" />
      <GaugeChart
        id="uptime-gauge"
        nrOfLevels={10}
        percent={uptimePercentage}
        textColor="#000"
      />
    </div>
  );
};

export default UptimeGauge;
