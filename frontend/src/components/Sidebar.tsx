import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
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
    <aside className="w-64 bg-gray-100 min-h-screen p-4">
      <ul className="space-y-2">
        {navItems.map(item => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`block p-3 rounded ${
                isActive(item.path)
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-200'
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}