import React, { useEffect, useState } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import BoxHeader from "../components/BoxHeader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
          throw new Error(`Error HTTP! Estado: ${response.status}`);
        }

        const data: EventFrequencyData[] = await response.json();
        console.log("Datos obtenidos de la API:", data);
        const formattedData = data.map(item => ({
          date: item.event_date.split('T')[0],
          count: Number(item.event_count),
        }));
        console.log("Datos formateados:", formattedData);
        setHeatmapData(formattedData);
      } catch (error) {
        console.error("Error al obtener los datos de frecuencia de eventos:", error);
      }
    };

    fetchData();
  }, []);

  const handleClick = (value: { date: string; count: number } | undefined) => {
    if (value && value.date) {
      toast.info(
        `🗓 Fecha: ${value.date}\n📊 Número de eventos: ${value.count}\n✨ Intensidad: ${
          value.count > 500 ? 'Extremadamente alta' :
          value.count > 100 ? 'Muy alta' :
          value.count > 50 ? 'Alta' :
          value.count > 20 ? 'Media' :
          value.count > 0 ? 'Baja' : 'Ninguna'
        }`,
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-5xl mx-auto">
      <BoxHeader title="📅 Mapa de Calor de Frecuencia de Eventos - Todo el Año" sideText="🕒 Último Año" />
      <p className="text-sm text-gray-600 mt-2 text-center">
        Este gráfico muestra la frecuencia de eventos registrados a lo largo de un año. Cada recuadro representa un día del año, y el color indica la intensidad de la actividad:
      </p>
      <div className="flex justify-center overflow-x-auto mt-4">
        <CalendarHeatmap
          startDate={new Date(new Date().getFullYear(), 0, 1)}
          endDate={new Date(new Date().getFullYear(), 11, 31)}
          values={heatmapData.map(item => ({ date: item.date, count: item.count }))}
          classForValue={(value) => {
            if (!value) return "color-empty";
            if (value.count === 0) return "color-empty";
            if (value.count > 500) return "color-scale-5"; // Nueva clase para extremadamente alta
            if (value.count > 100) return "color-scale-4"; // Muy alta
            if (value.count > 50) return "color-scale-3"; // Alta
            if (value.count > 20) return "color-scale-2"; // Media
            return "color-scale-1"; // Baja
          }}
          tooltipDataAttrs={(value) => ({
            'aria-label': value && value.date
              ? `Fecha: ${value.date}\nNúmero de eventos: ${value.count}`
              : 'Sin datos',
          })}
          onClick={handleClick}
          showWeekdayLabels={true}
          horizontal={true}
        />
      </div>
      <div className="mt-4 flex justify-center space-x-4 text-xs">
        <span className="flex items-center">
          <span className="w-3 h-3 bg-gray-200 inline-block mr-1"></span> Sin datos
        </span>
        <span className="flex items-center">
          <span className="w-3 h-3 bg-green-200 inline-block mr-1"></span> Baja
        </span>
        <span className="flex items-center">
          <span className="w-3 h-3 bg-green-400 inline-block mr-1"></span> Media
        </span>
        <span className="flex items-center">
          <span className="w-3 h-3 bg-green-600 inline-block mr-1"></span> Alta
        </span>
        <span className="flex items-center">
          <span className="w-3 h-3 bg-green-800 inline-block mr-1"></span> Muy alta
        </span>
        <span className="flex items-center">
          <span className="w-3 h-3 bg-green-900 inline-block mr-1"></span> Extremadamente alta
        </span>
      </div>
      <div className="mt-2 text-xs text-gray-500 text-center">
        <p><strong>Nota:</strong> Este mapa de calor visualiza la frecuencia de eventos registrados a lo largo del último año.</p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EventHeatmap;
