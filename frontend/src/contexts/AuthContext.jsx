import React, { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY = 'cinevault_auth';

function loadStoredAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(loadStoredAuth);

  const login = useCallback((authData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authData));
    setAuth(authData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setAuth(null);
  }, []);

  const isAuthenticated = Boolean(auth?.token);
  const isAdmin = auth?.role === 'ADMIN';
  const user = auth ? { id: auth.id, name: auth.name, email: auth.email, role: auth.role } : null;
  const token = auth?.token || null;

  return (
    <AuthContext.Provider value={{ auth, user, token, isAuthenticated, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthContext;
