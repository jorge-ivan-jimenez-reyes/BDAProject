import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Network from "./pages/Network";
import Servers from "./pages/Servers";
import Security from "./pages/Security";
import Sidebar from "./components/Sidebar";
import RealTimeMonitor from "./pages/RealTimeMonitoring";

function App() {
  return (
    <div className="flex">
      <Router>
        <Sidebar />
        <div className="flex-grow bg-gray-100 p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/network" element={<Network />} />
            <Route path="/servers" element={<Servers />} />
            <Route path="/security" element={<Security />} />
            <Route path="/RealTimeMonitoring" element={<RealTimeMonitor />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
