const API_BASE = (import.meta as any).env?.VITE_API_URL ?? '';

export async function recordVisit(payload: { path: string; userAgent?: string }): Promise<void> {
  const url = `${API_BASE}/api/visits`;
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: payload.path, userAgent: payload.userAgent ?? navigator?.userAgent ?? '' }),
    });
  } catch {
    // Fire-and-forget; ignore errors
  }
}

export type VisitRecord = { _id: string; path: string; userAgent?: string; createdAt: string };

export async function listVisits(token: string, limit = 100): Promise<VisitRecord[]> {
  const res = await fetch(`${API_BASE}/api/visits?limit=${limit}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to load visitors');
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function clearVisits(token: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/visits`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to clear visitors');
}
