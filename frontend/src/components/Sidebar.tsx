import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  if (!isOpen) return null;

  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/resources', label: 'Resources' },
    { path: '/bookings', label: 'Bookings' },
    { path: '/tickets', label: 'Tickets' },
    { path: '/notifications', label: 'Notifications' },
  ];

  return (
    <div className="w-64 bg-blue-900 text-white min-h-screen p-5">
      
      
      <ul className="space-y-2">
        {navItems.map(item => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`block p-3 rounded transition ${
                isActive(item.path)
                  ? 'bg-blue-700'
                  : 'hover:bg-blue-800'
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}