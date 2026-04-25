import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { RoleType } from '../types/User';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname === path;
  const isAdmin = user?.role === RoleType.ADMIN;

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      {/* Sidebar Toggle Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{
          position: 'fixed',
          top: '16px',
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

      {/* Sidebar */}
      <div style={{
        position: 'fixed',
        left: 0,
        top: 0,
        height: '100vh',
        width: sidebarOpen ? '280px' : '0px',
        overflow: 'hidden',
        transition: 'width 0.3s ease',
        background: sidebarOpen ? 'linear-gradient(180deg, #1e3a8a, #1e40af)' : 'transparent',
        zIndex: 100
      }}>
        {sidebarOpen && (
          <div style={{ padding: '24px 16px', color: 'white', height: '100%', overflowY: 'auto' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
              🎓 Smart Campus
            </h1>
            <p style={{ fontSize: '12px', opacity: 0.8, marginBottom: '32px' }}>Operations Hub</p>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link to="/" style={navLinkStyle(isActive('/'))}>🏠 Home</Link>
              <Link to="/tickets/create" style={navLinkStyle(isActive('/tickets/create'))}>🚨 Report Issue</Link>
              <Link to="/tickets" style={navLinkStyle(isActive('/tickets'))}>🎫 My Tickets</Link>
              <Link to="/resources" style={navLinkStyle(isActive('/resources'))}>📦 Resources</Link>
              <Link to="/bookings/create" style={navLinkStyle(isActive('/bookings/create'))}>📅 Book Resource</Link>
              <Link to="/bookings" style={navLinkStyle(isActive('/bookings'))}>📋 My Bookings</Link>
              <Link to="/notifications" style={navLinkStyle(isActive('/notifications'))}>🔔 Notifications</Link>
              
              {isAdmin && (
                <>
                  <p style={{ fontSize: '12px', opacity: 0.7, marginTop: '24px', marginBottom: '8px' }}>ADMIN</p>
                  <Link to="/admin" style={navLinkStyle(isActive('/admin'))}>🏠 Dashboard</Link>
                  <Link to="/admin/tickets" style={navLinkStyle(isActive('/admin/tickets'))}>🎫 Manage Tickets</Link>
                  <Link to="/admin/users" style={navLinkStyle(isActive('/admin/users'))}>👥 Manage Users</Link>
                  <Link to="/admin/bookings" style={navLinkStyle(isActive('/admin/bookings'))}>📅 Manage Bookings</Link>
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

      {/* Main Content */}
      <div style={{
        marginLeft: sidebarOpen ? '280px' : '0px',
        transition: 'margin-left 0.3s ease',
        padding: '24px'
      }}>
        {children}
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