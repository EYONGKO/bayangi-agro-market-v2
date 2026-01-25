import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

export type UserRole = 'buyer' | 'seller' | 'both';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  verifiedSeller?: boolean;
};

type AuthContextType = {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  register: (input: { name: string; email: string; password: string; role: UserRole }) => Promise<AuthUser>;
  signIn: (input: { email: string; password: string }) => Promise<AuthUser>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = 'local-roots-auth-users';
const SESSION_KEY = 'local-roots-auth-session';

type StoredUser = AuthUser & { password: string };

const canUseStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

function loadUsers(): StoredUser[] {
  if (!canUseStorage()) return [];
  try {
    const raw = window.localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function loadSession(): AuthUser | null {
  if (!canUseStorage()) return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed ?? null;
  } catch {
    return null;
  }
}

function saveSession(user: AuthUser | null) {
  if (!canUseStorage()) return;
  if (user) {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } else {
    window.localStorage.removeItem(SESSION_KEY);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const session = loadSession();
    if (session) setCurrentUser(session);
  }, []);

  const register = async (input: { name: string; email: string; password: string; role: UserRole }) => {
    const users = loadUsers();
    const exists = users.find((u) => u.email.toLowerCase() === input.email.toLowerCase());
    if (exists) {
      throw new Error('Email already registered');
    }
    const user: StoredUser = {
      id: `user-${Date.now()}`,
      name: input.name,
      email: input.email,
      password: input.password,
      role: input.role,
      verifiedSeller: input.role !== 'buyer'
    };
    const next = [user, ...users];
    saveUsers(next);
    const session: AuthUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      verifiedSeller: user.verifiedSeller
    };
    saveSession(session);
    setCurrentUser(session);
    return session;
  };

  const signIn = async (input: { email: string; password: string }) => {
    const users = loadUsers();
    const found = users.find((u) => u.email.toLowerCase() === input.email.toLowerCase());
    if (!found || found.password !== input.password) {
      throw new Error('Invalid credentials');
    }
    const session: AuthUser = {
      id: found.id,
      name: found.name,
      email: found.email,
      role: found.role,
      verifiedSeller: found.verifiedSeller
    };
    saveSession(session);
    setCurrentUser(session);
    return session;
  };

  const signOut = () => {
    saveSession(null);
    setCurrentUser(null);
  };

  const value: AuthContextType = useMemo(
    () => ({
      currentUser,
      isAuthenticated: Boolean(currentUser),
      register,
      signIn,
      signOut
    }),
    [currentUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

