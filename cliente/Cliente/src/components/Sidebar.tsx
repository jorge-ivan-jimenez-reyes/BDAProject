import { FaTachometerAlt, FaServer, FaNetworkWired, FaUserShield } from "react-icons/fa";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="bg-cyber-dark min-h-screen text-light-gray flex flex-col w-64 shadow-lg border-r border-metallic-silver">
      {/* Logo */}
      <div className="text-center py-6 border-b border-metallic-silver">
        <h1 className="text-3xl font-bold tracking-widest text-bright-cyan">Panel de Monitoreo</h1>
      </div>

      {/* Links */}
      <nav className="mt-10 flex flex-col space-y-4">
        <Link to="/" className="sidebar-link flex items-center px-6 py-3 hover:bg-neon-purple hover:text-neon-green transition duration-300">
          <FaTachometerAlt className="mr-3 text-neon-green" />
          <span className="font-semibold">Dashboard</span>
        </Link>
        <Link to="/network" className="sidebar-link flex items-center px-6 py-3 hover:bg-neon-purple hover:text-neon-green transition duration-300">
          <FaNetworkWired className="mr-3 text-neon-green" />
          <span className="font-semibold">Network Traffic</span>
        </Link>
        <Link to="/servers" className="sidebar-link flex items-center px-6 py-3 hover:bg-neon-purple hover:text-neon-green transition duration-300">
          <FaServer className="mr-3 text-neon-green" />
          <span className="font-semibold">Server Status</span>
        </Link>
        <Link to="/security" className="sidebar-link flex items-center px-6 py-3 hover:bg-neon-purple hover:text-neon-green transition duration-300">
          <FaUserShield className="mr-3 text-neon-green" />
          <span className="font-semibold">Security Incidents</span>
        </Link>
        <Link to="/RealTimeMonitoring" className="sidebar-link flex items-center px-6 py-3 hover:bg-neon-purple hover:text-neon-green transition duration-300">
          <FaUserShield className="mr-3 text-neon-green" />
          <span className="font-semibold">Real Time Monitoring</span>
        </Link>
      </nav>

      {/* Footer */}
      <div className="mt-auto p-4 text-center border-t border-metallic-silver">
        <p className="text-light-gray text-xs">&copy; 2024 Cyber Dash. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Sidebar;
