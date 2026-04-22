import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { User } from '../types/User';

const TOKEN_KEY = 'smartcampus_token';
const USER_KEY = 'smartcampus_user';

export const useAuth = () => {
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
      localStorage.setItem(USER_KEY, JSON.stringify({ username: data.username }));
      setToken(data.token);
      setUser({ username: data.username } as User);
      return true;
    } catch (err) {
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
  }, []);

  const isAuthenticated = useCallback(() => {
    return !!token;
  }, [token]);

  return { user, token, loading, error, login, logout, isAuthenticated };
};