import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { RoleType } from '../types/User';

interface SidebarProps {
  isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  if (!isOpen) return null;

  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/tickets', label: 'Tickets' },
  ];

  const adminNavItems = [
    { path: '/admin', label: 'Admin Dashboard' },
    { path: '/admin/tickets', label: 'Manage Tickets' },
    { path: '/admin/users', label: 'Manage Users' },
  ];

  const isAdmin = user?.role === RoleType.ADMIN;

  return (
    <div className="w-64 bg-blue-900 text-white min-h-screen p-5">
      <h2 className="text-xl font-bold mb-5">Smart Campus</h2>
      
      <ul className="space-y-2">
        <li className="text-xs font-semibold text-blue-300 uppercase">Menu</li>
        {navItems.map(item => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`block p-3 rounded transition ${
                isActive(item.path) ? 'bg-blue-700' : 'hover:bg-blue-800'
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}

        {isAdmin && (
          <>
            <li className="text-xs font-semibold text-yellow-300 uppercase pt-4">Admin</li>
            {adminNavItems.map(item => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`block p-3 rounded transition ${
                    isActive(item.path) ? 'bg-yellow-600' : 'hover:bg-yellow-600'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </>
        )}
      </ul>

      <div className="mt-auto pt-6 border-t border-blue-700">
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = '/login';
          }}
          className="w-full p-3 text-left rounded hover:bg-blue-800 transition text-sm"
        >
          Logout
        </button>
      </div>
    </div>
  );
}