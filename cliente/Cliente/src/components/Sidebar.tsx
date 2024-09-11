import { FaTachometerAlt, FaServer, FaNetworkWired, FaUserShield } from "react-icons/fa";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="bg-gradient-to-b from-gray-900 to-black min-h-screen text-white flex flex-col w-64 shadow-lg">
      {/* Logo */}
      <div className="text-center py-5">
        <h1 className="text-3xl font-bold tracking-widest text-cyan-400">CYBER DASH</h1>
      </div>

      {/* Links */}
      <nav className="mt-10 flex flex-col space-y-4">
        <Link to="/" className="sidebar-link flex items-center px-6 py-3 hover:bg-gray-700 transition">
          <FaTachometerAlt className="mr-3" />
          Dashboard
        </Link>
        <Link to="/network" className="sidebar-link flex items-center px-6 py-3 hover:bg-gray-700 transition">
          <FaNetworkWired className="mr-3" />
          Network Traffic
        </Link>
        <Link to="/servers" className="sidebar-link flex items-center px-6 py-3 hover:bg-gray-700 transition">
          <FaServer className="mr-3" />
          Server Status
        </Link>
        <Link to="/security" className="sidebar-link flex items-center px-6 py-3 hover:bg-gray-700 transition">
          <FaUserShield className="mr-3" />
          Security Incidents
        </Link>
      </nav>

      {/* Footer */}
      <div className="mt-auto p-4 text-center border-t border-gray-700">
        <p className="text-gray-400 text-xs">&copy; 2024 Cyber Dash. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Sidebar;
