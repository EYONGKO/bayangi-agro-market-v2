/**
 * API client for site settings (GET public, PUT admin).
 * Used by frontend consumers and admin Site Settings page.
 */

import type { SiteSettings } from '../config/siteSettingsTypes';

const API_BASE = (import.meta as any).env?.VITE_API_URL ?? '';

export async function fetchSiteSettings(): Promise<Partial<SiteSettings>> {
  const res = await fetch(`${API_BASE}/api/settings`, {
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    throw new Error(res.status === 503 ? 'Service unavailable' : 'Failed to load site settings');
  }
  const data = await res.json();
  return (data && typeof data === 'object') ? data : {};
}

export async function updateSiteSettings(token: string, payload: Partial<SiteSettings>): Promise<Partial<SiteSettings>> {
  const res = await fetch(`${API_BASE}/api/settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string })?.error || 'Failed to update site settings');
  }
  const data = await res.json();
  return (data && typeof data === 'object') ? data : {};
}
