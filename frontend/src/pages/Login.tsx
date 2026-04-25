import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const styles = {
  gradientBackground: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    minHeight: '100vh',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '20px',
  },
  card: {
    width: '100%',
    maxWidth: '380px',
    padding: '40px 32px',
    borderRadius: '20px',
    backdropFilter: 'blur(20px)',
    background: 'rgba(255, 255, 255, 0.15)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    textAlign: 'center' as const,
    color: 'white',
    animation: 'fadeIn 0.5s ease',
  },
  title: {
    marginBottom: '8px',
    fontWeight: 700,
    fontSize: '28px',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    opacity: 0.85,
    marginBottom: '32px',
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    marginBottom: '16px',
    borderRadius: '12px',
    border: 'none',
    outline: 'none',
    fontSize: '15px',
    background: 'rgba(255, 255, 255, 0.15)',
    color: 'white',
    boxSizing: 'border-box' as const,
    transition: 'all 0.3s ease',
  },
  inputFocus: {
    background: 'rgba(255, 255, 255, 0.25)',
    boxShadow: '0 0 0 3px rgba(255, 255, 255, 0.2)',
  },
  inputPlaceholder: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  googleBtn: {
    width: '100%',
    padding: '14px',
    borderRadius: '12px',
    border: 'none',
    background: 'white',
    color: '#333',
    fontWeight: 600,
    fontSize: '15px',
    cursor: 'pointer',
    marginBottom: '20px',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
  },
  loginBtn: {
    width: '100%',
    padding: '14px',
    borderRadius: '12px',
    border: 'none',
    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    color: 'white',
    fontWeight: 600,
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '8px',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(79, 172, 254, 0.4)',
  },
  error: {
    background: 'rgba(239, 68, 68, 0.2)',
    color: '#fca5a5',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '14px',
  },
  homeLink: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    color: 'white',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    textDecoration: 'none',
    opacity: 0.85,
    transition: 'opacity 0.3s',
  },
};

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, loading, error } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [inputFocus, setInputFocus] = useState<{ [key: string]: boolean }>({});

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
    <div style={styles.gradientBackground}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .google-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        }
        .login-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(79, 172, 254, 0.5);
        }
        input::placeholder {
          color: rgba(255, 255, 255, 0.7);
        }
      `}</style>
      
      <button onClick={goHome} style={styles.homeLink}>
        ← Back to Home
      </button>
      
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>🎓 Smart Campus</h1>
          <p style={styles.subtitle}>Operations Hub</p>
          
          {(error || localError) && (
            <div style={styles.error}>{error || localError}</div>
          )}
          
          <button
            onClick={handleGoogleLogin}
            className="google-btn"
            style={styles.googleBtn}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.96 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.96 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </button>

          <div style={{ marginBottom: '24px', fontSize: '13px', opacity: 0.7 }}>
            or continue with username
          </div>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={() => setInputFocus({ username: true })}
              onBlur={() => setInputFocus({ username: false })}
              style={{
                ...styles.input,
                ...(inputFocus.username ? styles.inputFocus : {}),
              }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setInputFocus({ password: true })}
              onBlur={() => setInputFocus({ password: false })}
              style={{
                ...styles.input,
                ...(inputFocus.password ? styles.inputFocus : {}),
              }}
            />
            <button
              type="submit"
              disabled={loading}
              className="login-btn"
              style={styles.loginBtn}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}