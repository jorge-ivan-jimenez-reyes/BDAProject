import React, { useEffect, useState } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import BoxHeader from "../components/BoxHeader";

// Interface to define the structure of event log data
interface EventLogData {
  event_time: string;
  hour: number;
}

const EventHeatmap: React.FC = () => {
  const [eventData, setEventData] = useState<EventLogData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/realTimeMonitoring");
        const data = await response.json();
        if (data.eventLogs && Array.isArray(data.eventLogs)) {
          setEventData(data.eventLogs);
        } else {
          console.error("Unexpected data format:", data);
        }
      } catch (error) {
        console.error("Error fetching event log data:", error);
      }
    };

    fetchData();
  }, []);

  // Transform the event data into a format suitable for the heatmap
  const heatmapData = eventData.reduce((acc, log) => {
    const date = new Date(log.event_time).toISOString().split("T")[0];
    const existing = acc.find((item) => item.date === date);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ date, count: 1 });
    }
    return acc;
  }, [] as { date: string; count: number }[]);

  return (
    <div className="p-2 bg-white rounded-md shadow-sm max-w-xl mx-auto">
      <BoxHeader title="Event Heatmap" sideText="Last 30 Days" />
      <div className="flex justify-center overflow-x-auto">
        <CalendarHeatmap
          startDate={new Date(new Date().setDate(new Date().getDate() - 30))}
          endDate={new Date()}
          values={heatmapData}
          classForValue={(value) => {
            if (!value) return "bg-gray-200";
            if (value.count === 1) return "bg-green-200";
            if (value.count === 2) return "bg-green-400";
            if (value.count === 3) return "bg-green-600";
            return "bg-green-800";
          }}
          
          tooltipDataAttrs={(value) => ({
            'aria-label': value && value.date ? `Date: ${value.date}, Count: ${value.count}` : 'No data',
          })}
          showWeekdayLabels={false}
          horizontal={true}
        />
      </div>
      <div className="mt-2 flex justify-center space-x-1 text-xs">
        <span className="flex items-center">
          <span className="w-2 h-2 bg-gray-200 inline-block mr-1"></span> No data
        </span>
        <span className="flex items-center">
          <span className="w-2 h-2 bg-green-200 inline-block mr-1"></span> Low
        </span>
        <span className="flex items-center">
          <span className="w-2 h-2 bg-green-400 inline-block mr-1"></span> Medium
        </span>
        <span className="flex items-center">
          <span className="w-2 h-2 bg-green-600 inline-block mr-1"></span> High
        </span>
        <span className="flex items-center">
          <span className="w-2 h-2 bg-green-800 inline-block mr-1"></span> Very High
        </span>
      </div>
      <div className="mt-2 text-xs text-gray-500 text-center">
        <p><strong>Note:</strong> The heatmap represents event frequency over the past 30 days.</p>
      </div>
    </div>
  );
};

export default EventHeatmap;
