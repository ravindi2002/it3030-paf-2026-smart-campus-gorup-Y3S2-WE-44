import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface NavbarProps {
  toggle: () => void;
  isOpen: boolean;
}

export default function Navbar({ toggle, isOpen }: NavbarProps) {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'SmartUni';
      case '/resources': return 'SmartUni';
      case '/bookings': return 'SmartUni';
      case '/tickets': return 'SmartUni';
      case '/notifications': return 'SmartUni';
      default: return 'SmartUni';
    }
  };

  return (
    <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <button 
        onClick={toggle} 
        className="text-xl text-gray-600 hover:text-gray-900 p-2 rounded hover:bg-gray-100"
      >
        {isOpen ? '✕' : '☰'}
      </button>
      
      <h1 className="font-bold text-xl text-gray-800">{getPageTitle()}</h1>
      
      <div className="flex items-center gap-4">
        {isAuthenticated() ? (
          <>
            <span className="text-gray-600">{user?.username}</span>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Login
          </Link>
        )}
      </div>
    </div>
  );
}