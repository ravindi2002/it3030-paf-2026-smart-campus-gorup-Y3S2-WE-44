import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  
  // Get user from localStorage
  const storedUser = localStorage.getItem('smartcampus_user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  
  // Handle role check - can be string or RoleType enum
  const userRole = user?.role;
  const isAdmin = userRole === 'ADMIN' || userRole === 'RoleType.ADMIN';
  const isTechnician = userRole === 'TECHNICIAN' || userRole === 'RoleType.TECHNICIAN';

  const isActive = (path: string) => location.pathname === path;

  const hideSidebar = location.pathname === '/login';

  // Navbar - shows on all pages except login
  const showNav = location.pathname !== '/login';

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      {/* Navbar - Always visible at top */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '56px',
        background: showNav ? 'white' : 'transparent',
        borderBottom: showNav ? '1px solid #e5e7eb' : 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: showNav ? '0 24px' : '0',
        zIndex: 9998,
        boxShadow: showNav ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
      }}>
        {showNav && (
          <>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e3a8a' }}>
                🎓 Smart Campus
              </h1>
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ color: '#4b5563', fontSize: '14px' }}>
                👤 {user?.username || user?.fullName || localStorage.getItem('smartcampus_user') ? JSON.parse(localStorage.getItem('smartcampus_user') || '{}').username : 'User'}
              </span>
              <button 
                onClick={() => {
                  localStorage.clear();
                  window.location.href = '/login';
                }}
                style={{ 
                  background: '#ef4444', 
                  color: 'white', 
                  padding: '8px 16px', 
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Logout
              </button>
            </div>
          </>
        )}
      </nav>

      {/* Sidebar Toggle Button */}
      {showNav && (
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            position: 'fixed',
            top: '72px',
            left: sidebarOpen ? '260px' : '16px',
            zIndex: 9999,
            background: '#1e3a8a',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            transition: 'left 0.3s ease',
            fontWeight: 500
          }}
        >
          {sidebarOpen ? '◀ Hide' : '▶ Menu'}
        </button>
      )}

      {/* Sidebar */}
      {showNav && (
        <div style={{
          position: 'fixed',
          left: 0,
          top: '56px',
          height: 'calc(100vh - 56px)',
          width: sidebarOpen ? '280px' : '0px',
          overflow: 'hidden',
          transition: 'width 0.3s ease',
          background: sidebarOpen ? 'linear-gradient(180deg, #1e3a8a, #1e40af)' : 'transparent',
          zIndex: 100
        }}>
          {sidebarOpen && (
            <div style={{ padding: '24px 16px', color: 'white', height: '100%', overflowY: 'auto' }}>
              <p style={{ fontSize: '12px', opacity: 0.8, marginBottom: '32px' }}>{isAdmin ? 'Admin Panel' : isTechnician ? 'Staff Portal' : 'Operations Hub'}</p>

              <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {isAdmin ? (
                  // Admin sidebar - only management links
                  <>
                    <Link to="/admin" style={navLinkStyle(isActive('/admin'))}>🏠 Dashboard</Link>
                    <Link to="/admin/resources" style={navLinkStyle(isActive('/admin/resources') || isActive('/resources'))}>📦 Manage Resources</Link>
                    <Link to="/admin/tickets" style={navLinkStyle(isActive('/admin/tickets'))}>🎫 Manage Tickets</Link>
                    <Link to="/admin/users" style={navLinkStyle(isActive('/admin/users'))}>👥 Manage Users</Link>
                    <Link to="/admin/bookings" style={navLinkStyle(isActive('/admin/bookings'))}>📅 Manage Bookings</Link>
                    <Link to="/bookings" style={navLinkStyle(isActive('/bookings'))}>📋 All Bookings</Link>
                  </>
                ) : isTechnician ? (
                  // Technician sidebar
                  <>
                    <Link to="/staff/dashboard" style={navLinkStyle(isActive('/staff/dashboard'))}>👷 Staff Dashboard</Link>
                    <Link to="/tickets/create" style={navLinkStyle(isActive('/tickets/create'))}>🚨 Report Issue</Link>
                    <Link to="/tickets" style={navLinkStyle(isActive('/tickets'))}>🎫 My Tickets</Link>
                    <Link to="/resources" style={navLinkStyle(isActive('/resources'))}>📦 Resources</Link>
                    <Link to="/bookings/create" style={navLinkStyle(isActive('/bookings/create'))}>📅 Book Resource</Link>
                    <Link to="/bookings" style={navLinkStyle(isActive('/bookings'))}>📋 My Bookings</Link>
                    <Link to="/notifications" style={navLinkStyle(isActive('/notifications'))}>🔔 Notifications</Link>
                  </>
                ) : (
                  // Regular user sidebar
                  <>
                    <Link to="/tickets/create" style={navLinkStyle(isActive('/tickets/create'))}>🚨 Report Issue</Link>
                    <Link to="/tickets" style={navLinkStyle(isActive('/tickets'))}>🎫 My Tickets</Link>
                    <Link to="/resources" style={navLinkStyle(isActive('/resources'))}>📦 Resources</Link>
                    <Link to="/bookings/create" style={navLinkStyle(isActive('/bookings/create'))}>📅 Book Resource</Link>
                    <Link to="/bookings" style={navLinkStyle(isActive('/bookings'))}>📋 My Bookings</Link>
                    <Link to="/notifications" style={navLinkStyle(isActive('/notifications'))}>🔔 Notifications</Link>
                  </>
                )}
                
                <button 
                  onClick={() => {
                    localStorage.clear();
                    window.location.href = '/login';
                  }}
                  style={{ ...navLinkStyle(false), marginTop: '32px', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left' }}
                >
                  🚪 Logout
                </button>
              </nav>
            </div>
          )}
        </div>
      )}

      {/* Main Content */}
      <div style={{
        marginTop: '56px',
        marginLeft: showNav && sidebarOpen ? '280px' : showNav ? '0px' : '0px',
        transition: 'margin-left 0.3s ease',
        padding: '24px'
      }}>
        <AppRoutes />
      </div>
    </div>
  );
}

function navLinkStyle(active: boolean) {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '8px',
    color: active ? 'white' : 'rgba(255,255,255,0.8)',
    background: active ? 'rgba(255,255,255,0.2)' : 'transparent',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    fontWeight: active ? 600 : 400
  };
}