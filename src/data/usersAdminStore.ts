import type { AuthUser, UserRole } from '../context/AuthContext';

type StoredUser = AuthUser & { password: string };

const USERS_KEY = 'local-roots-auth-users';

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

export type AdminUserRecord = AuthUser;

export function listUsers(): AdminUserRecord[] {
  return loadUsers().map(({ password: _pw, ...u }) => u);
}

export function updateUser(id: string, patch: { name?: string; email?: string; role?: UserRole; verifiedSeller?: boolean }) {
  const all = loadUsers();
  const idx = all.findIndex((u) => u.id === id);
  if (idx < 0) throw new Error('User not found');

  const next: StoredUser[] = [...all];
  next[idx] = {
    ...next[idx],
    name: patch.name ?? next[idx].name,
    email: patch.email ?? next[idx].email,
    role: patch.role ?? next[idx].role,
    verifiedSeller: patch.verifiedSeller ?? next[idx].verifiedSeller
  };
  saveUsers(next);
  return { ...next[idx], password: undefined } as any;
}

export function deleteUser(id: string) {
  const next = loadUsers().filter((u) => u.id !== id);
  saveUsers(next);
}
