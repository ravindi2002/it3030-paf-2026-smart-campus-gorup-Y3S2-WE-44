import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, loading, error } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    const user = searchParams.get('user');
    if (token && user) {
      try {
        const userData = JSON.parse(decodeURIComponent(user));
        localStorage.setItem('smartcampus_token', token);
        localStorage.setItem('smartcampus_user', JSON.stringify(userData));
        window.location.href = '/';
      } catch (err) {
        console.error('Failed to parse user data:', err);
        setLocalError('Login failed. Please try again.');
      }
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(username, password);
    if (success) navigate('/');
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8081/oauth2/authorization/google';
  };

  const goHome = () => {
    window.location.href = '/';
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6' }}>
      <button onClick={goHome} style={{ position: 'absolute', top: '16px', left: '16px', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', textDecoration: 'none' }}>
        ← Back to Home
      </button>
      <div style={{ background: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', textAlign: 'center' }}>Smart Campus Login</h1>
        {(error || localError) && <p style={{ color: '#dc2626', marginBottom: '16px', textAlign: 'center' }}>{error || localError}</p>}
        
        <button
          onClick={handleGoogleLogin}
          style={{ width: '100%', background: '#dc2626', color: 'white', padding: '12px', borderRadius: '8px', border: 'none', cursor: 'pointer', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 600 }}
        >
          <svg style={{ width: '20px', height: '20px' }} viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.96 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.96 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign in with Google
        </button>

        <div style={{ position: 'relative', marginBottom: '24px' }}>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '100%', borderTop: '1px solid #d1d5db' }}></div>
          </div>
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <span style={{ padding: '0 8px', background: 'white', color: '#6b7280' }}>Or continue with username</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500, fontSize: '14px' }}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500, fontSize: '14px' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db' }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', background: loading ? '#93c5fd' : '#2563eb', color: 'white', padding: '10px', borderRadius: '6px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 600 }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}