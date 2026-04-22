import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Smart Campus</Link>
        <div className="flex gap-4 items-center">
          {isAuthenticated() ? (
            <>
              <Link to="/notifications" className="hover:underline">Notifications</Link>
              <span className="text-sm opacity-75">{user?.username}</span>
              <button onClick={logout} className="bg-blue-700 px-3 py-1 rounded hover:bg-blue-800">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="bg-white text-blue-600 px-3 py-1 rounded">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}