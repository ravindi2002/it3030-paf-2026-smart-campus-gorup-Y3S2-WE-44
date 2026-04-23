import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Sidebar() {
  return (
    <div className="w-64 bg-blue-900 text-white min-h-screen p-5">
      <h2 className="text-xl font-bold mb-5">Smart Campus</h2>
      <ul className="space-y-3">
        <li>
          <Link to="/" className="block py-2 px-3 rounded hover:bg-blue-800 transition">
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/resources" className="block py-2 px-3 rounded hover:bg-blue-800 transition">
            Resources
          </Link>
        </li>
        <li>
          <Link to="/bookings" className="block py-2 px-3 rounded hover:bg-blue-800 transition">
            Bookings
          </Link>
        </li>
        <li>
          <Link to="/tickets" className="block py-2 px-3 rounded hover:bg-blue-800 transition">
            Tickets
          </Link>
        </li>
        <li>
          <Link to="/notifications" className="block py-2 px-3 rounded hover:bg-blue-800 transition">
            Notifications
          </Link>
        </li>
      </ul>
    </div>
  );
}