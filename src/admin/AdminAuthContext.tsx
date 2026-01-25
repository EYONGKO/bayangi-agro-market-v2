import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { adminLogin, adminRegister } from '../api/adminApi';
import { ADMIN_EMAIL, ADMIN_TOKEN_KEY } from './adminConstants';

type AdminAuthContextType = {
  token: string;
  isAuthenticated: boolean;
  signIn: (input: { email: string; password: string }) => Promise<void>;
  register: (input: { name: string; email: string; password: string }) => Promise<void>;
  signOut: () => void;
};

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

function decodeJwt(token: string): any {
  try {
    const p = token.split('.')[1];
    const base64 = p.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState('');

  useEffect(() => {
    const existing = window.localStorage.getItem(ADMIN_TOKEN_KEY) || '';
    if (existing) setToken(existing);
  }, []);

  const signIn = async (input: { email: string; password: string }) => {
    const res = await adminLogin(input);
    const decoded = decodeJwt(res.token);
    const tokEmail = String(decoded?.email || '').toLowerCase();
    if (tokEmail !== ADMIN_EMAIL) throw new Error('Not authorized as admin');
    window.localStorage.setItem(ADMIN_TOKEN_KEY, res.token);
    setToken(res.token);
  };

  const register = async (input: { name: string; email: string; password: string }) => {
    const res = await adminRegister(input);
    const decoded = decodeJwt(res.token);
    const tokEmail = String(decoded?.email || '').toLowerCase();
    if (tokEmail !== ADMIN_EMAIL) throw new Error('Not authorized as admin');
    window.localStorage.setItem(ADMIN_TOKEN_KEY, res.token);
    setToken(res.token);
  };

  const signOut = () => {
    window.localStorage.removeItem(ADMIN_TOKEN_KEY);
    setToken('');
  };

  const value = useMemo(
    () => ({
      token,
      isAuthenticated: Boolean(token),
      signIn,
      register,
      signOut
    }),
    [token]
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}
