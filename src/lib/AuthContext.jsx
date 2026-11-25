import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api, setCsrfToken } from './api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api('/auth/session').then((session) => {
      setCsrfToken(session.csrfToken);
      setUser(session.authenticated ? session.admin : null);
    }).catch(() => setUser(null)).finally(() => setLoading(false));
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    async login(email, password) {
      const result = await api('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
      setCsrfToken(result.csrfToken);
      setUser(result.admin);
    },
    async logout() {
      try {
        await api('/auth/logout', { method: 'POST' });
        setUser(null);
        const session = await api('/auth/session');
        setCsrfToken(session.csrfToken);
      } catch (error) {
        try {
          const session = await api('/auth/session');
          setCsrfToken(session.csrfToken);
          setUser(session.authenticated ? session.admin : null);
        } catch {
          setCsrfToken('');
          setUser(null);
        }
        throw error;
      }
    },
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider.');
  return value;
}
