import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getMe } from '../services/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Re-validate token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { setLoading(false); return; }

    getMe()
      .then((res) => setUser(res.data.data.user))
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, []);

  const saveSession = useCallback((userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  const isAdmin = user?.role === 'admin';
  const isAnalyst = user?.role === 'analyst' || isAdmin;
  const isViewer = !!user;

  return (
    <AuthContext.Provider value={{ user, loading, saveSession, logout, isAdmin, isAnalyst, isViewer }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
