/**
 * Provides site-wide settings (hero, features, header, footer, etc.) to the app.
 * Fetches from /api/settings and merges with defaults. Used by layout components
 * and admin Site Settings page.
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { fetchSiteSettings } from '../api/siteSettingsApi';
import { mergeWithDefaults, type SiteSettings } from '../config/siteSettingsTypes';

type SiteSettingsContextValue = {
  settings: SiteSettings;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

const SiteSettingsContext = createContext<SiteSettingsContextValue | undefined>(undefined);

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [raw, setRaw] = useState<Partial<SiteSettings> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSiteSettings();
      setRaw(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load settings');
      setRaw(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const settings = useMemo(() => {
    return mergeWithDefaults(raw);
  }, [raw]);
  const value = useMemo<SiteSettingsContextValue>(
    () => ({ settings, loading, error, refetch }),
    [settings, loading, error, refetch]
  );

  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const ctx = useContext(SiteSettingsContext);
  if (!ctx) throw new Error('useSiteSettings must be used within SiteSettingsProvider');
  return ctx;
}
