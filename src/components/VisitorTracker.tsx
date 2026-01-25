import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { recordVisit } from '../api/visitsApi';

/**
 * Tracks page visits by sending path + userAgent to /api/visits.
 * Mount inside Router. Fire-and-forget; no UI.
 */
export default function VisitorTracker() {
  const location = useLocation();
  const prevPath = useRef<string | null>(null);

  useEffect(() => {
    const path = location.pathname || '/';
    if (prevPath.current === path) return;
    prevPath.current = path;
    recordVisit({ path, userAgent: navigator?.userAgent ?? '' });
  }, [location.pathname]);

  return null;
}
