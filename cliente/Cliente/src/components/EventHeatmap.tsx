import React, { useEffect, useState } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import BoxHeader from "../components/BoxHeader";

// Interfaz para definir la estructura de los datos de eventos
interface EventFrequencyData {
  event_date: string; // Fecha del evento
  event_count: string; // Conteo de eventos como string
}

// Interfaz para el formato del mapa de calor
interface HeatmapData {
  date: string; // Fecha en formato "YYYY-MM-DD"
  count: number; // Conteo de eventos
}

const EventHeatmap: React.FC = () => {
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/eventFrequency");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: EventFrequencyData[] = await response.json();
        const formattedData = data.map(item => ({
          date: item.event_date.split('T')[0], // Obtener solo la parte de la fecha
          count: Number(item.event_count), // Convertir count a número
        }));
        setHeatmapData(formattedData);
        console.log("Formatted heatmap data:", formattedData);
      } catch (error) {
        console.error("Error fetching event frequency data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md max-w-lg mx-auto">
      <BoxHeader title="Event Frequency Heatmap" sideText="Last 30 Days" />
      <div className="flex justify-center overflow-x-auto mt-4">
        <CalendarHeatmap
          startDate={new Date(new Date().setDate(new Date().getDate() - 30))}
          endDate={new Date()}
          values={heatmapData.map(item => ({ date: item.date, count: item.count }))}
          classForValue={(value) => {
            if (!value) return "color-empty"; // Sin datos
            if (value.count === 0) return "color-empty"; // Sin eventos
            if (value.count === 1) return "color-scale-1"; // Baja actividad
            if (value.count === 2) return "color-scale-2"; // Actividad media
            if (value.count === 3) return "color-scale-3"; // Alta actividad
            return "color-scale-4"; // Muy alta actividad
          }}
          tooltipDataAttrs={(value) => ({
            'aria-label': value && value.date ? `Date: ${value.date}, Count: ${value.count}` : 'No data',
          })}
          showWeekdayLabels={true}
          horizontal={true}
        />
      </div>
      <div className="mt-4 flex justify-center space-x-2 text-xs">
        <span className="flex items-center">
          <span className="w-3 h-3 color-empty inline-block mr-1"></span> No data
        </span>
        <span className="flex items-center">
          <span className="w-3 h-3 color-scale-1 inline-block mr-1"></span> Low
        </span>
        <span className="flex items-center">
          <span className="w-3 h-3 color-scale-2 inline-block mr-1"></span> Medium
        </span>
        <span className="flex items-center">
          <span className="w-3 h-3 color-scale-3 inline-block mr-1"></span> High
        </span>
        <span className="flex items-center">
          <span className="w-3 h-3 color-scale-4 inline-block mr-1"></span> Very High
        </span>
      </div>
      <div className="mt-2 text-xs text-gray-500 text-center">
        <p><strong>Note:</strong> The heatmap represents event frequency from logs over the past 30 days.</p>
      </div>
    </div>
  );
};

export default EventHeatmap;
