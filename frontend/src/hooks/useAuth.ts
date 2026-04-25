import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { User, RoleType } from '../types/User';

const TOKEN_KEY = 'smartcampus_token';
const USER_KEY = 'smartcampus_user';

export const useAuth = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(USER_KEY);
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.login(username, password);
      localStorage.setItem(TOKEN_KEY, data.token);
      const userData = { 
        username: data.username, 
        role: data.role || RoleType.USER,
        id: data.id
      };
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      setToken(data.token);
      setUser(userData as User);
      return true;
    } catch {
      setError('Invalid credentials');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
    navigate('/login');
  }, [navigate]);

  const isAuthenticated = useCallback(() => {
    return !!token;
  }, [token]);

  const isAdmin = useCallback(() => {
    const role = user?.role;
    return role === RoleType.ADMIN || role === 'ADMIN' || role === 'RoleType.ADMIN';
  }, [user]);

  return { user, token, loading, error, login, logout, isAuthenticated, isAdmin };
};