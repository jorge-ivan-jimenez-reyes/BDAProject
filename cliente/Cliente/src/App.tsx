import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Network from "./pages/Network";
import Servers from "./pages/Servers";
import Security from "./pages/Security";
import Sidebar from "./components/Sidebar";
import RealTimeMonitor from "./pages/RealTimeMonitoring";

import 'mapbox-gl/dist/mapbox-gl.css';
import "./index.css";

function App() {
  return (
    <div className="flex min-h-screen bg-cyber-dark text-light-gray">
      <Router>
        <Sidebar />
        <div className="flex-grow p-6 bg-gradient-to-br from-cyber-dark to-dark-blue">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/network" element={<Network />} />
            <Route path="/servers" element={<Servers />} />
            <Route path="/security" element={<Security />} />
            <Route path="/realTimeMonitoring" element={<RealTimeMonitor />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
