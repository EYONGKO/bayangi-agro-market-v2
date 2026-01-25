import { useEffect, useState } from 'react';
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { RefreshCw, Trash2 } from 'lucide-react';
import { listVisits, type VisitRecord } from '../../api/visitsApi';
import { useAdminAuth } from '../AdminAuthContext';

function formatDate(s: string) {
  try {
    const d = new Date(s);
    return d.toLocaleString();
  } catch {
    return s;
  }
}

export default function VisitorsAdminPage() {
  const { token } = useAdminAuth();
  const [visits, setVisits] = useState<VisitRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clearing, setClearing] = useState(false);

  const load = async () => {
    if (!token) return;
    setError(null);
    setLoading(true);
    try {
      setVisits(await listVisits(token, 200));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load visitors');
      setVisits([]);
    } finally {
      setLoading(false);
    }
  };

  const clearAllVisits = async () => {
    if (!token) return;
    if (!window.confirm('Are you sure you want to clear all visitor records? This action cannot be undone.')) {
      return;
    }
    setError(null);
    setClearing(true);
    try {
      const response = await fetch(`${import.meta.env?.VITE_API_URL ?? ''}/api/visits`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('Clear result:', result);
      setVisits([]);
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to clear visitors';
      console.error('Clear visitors error:', e);
      setError(errorMessage);
    } finally {
      setClearing(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography sx={{ fontWeight: 950, fontSize: 24, color: '#0f172a' }}>Visitors</Typography>
          <Typography sx={{ mt: 0.25, fontSize: 13, fontWeight: 700, color: '#64748b' }}>
            People who visit the site. Tracked by path and timestamp.
          </Typography>
        </Box>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshCw size={16} />}
            onClick={load}
            disabled={loading || clearing}
            sx={{ borderRadius: 2, fontWeight: 900, mr: 1 }}
          >
            {loading ? 'Loading…' : 'Refresh'}
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Trash2 size={16} />}
            onClick={clearAllVisits}
            disabled={loading || clearing || visits.length === 0}
            sx={{ borderRadius: 2, fontWeight: 900 }}
          >
            {clearing ? 'Clearing…' : 'Clear All'}
          </Button>
        </Box>
      </Box>

      {error && (
        <Box sx={{ mb: 2, p: 1.5, borderRadius: 2, background: 'rgba(239,68,68,0.08)', color: '#991b1b', fontWeight: 800, fontSize: 13 }}>
          {error}
        </Box>
      )}

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ background: '#f8fafc' }}>
              <TableCell sx={{ fontWeight: 900, fontSize: 12 }}>Path</TableCell>
              <TableCell sx={{ fontWeight: 900, fontSize: 12 }}>User agent</TableCell>
              <TableCell sx={{ fontWeight: 900, fontSize: 12 }}>Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visits.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={3} sx={{ py: 4, textAlign: 'center', color: '#64748b', fontWeight: 700 }}>
                  No visits recorded yet.
                </TableCell>
              </TableRow>
            )}
            {visits.map((v) => (
              <TableRow key={v._id} hover>
                <TableCell sx={{ fontFamily: 'monospace', fontSize: 13 }}>{v.path || '/'}</TableCell>
                <TableCell sx={{ fontSize: 12, color: '#64748b', maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {v.userAgent || '—'}
                </TableCell>
                <TableCell sx={{ fontSize: 12, color: '#64748b' }}>{formatDate(v.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
