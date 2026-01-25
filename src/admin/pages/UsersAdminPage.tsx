import { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { listUsers, type AdminUserRecord } from '../../api/adminApi';
import { useAdminAuth } from '../AdminAuthContext';

export default function UsersAdminPage() {
  const { token } = useAdminAuth();

  const [items, setItems] = useState<AdminUserRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setError(null);
    setLoading(true);
    try {
      const users = await listUsers(token);
      setItems(users);
    } catch (e: any) {
      setError(e?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    load();
  }, [token]);

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <Box>
          <Typography sx={{ fontWeight: 950, fontSize: 24, color: '#0f172a' }}>Users</Typography>
          <Typography sx={{ mt: 0.25, fontSize: 13, fontWeight: 800, color: '#64748b' }}>Total: {items.length}</Typography>
        </Box>
        <Button variant="outlined" onClick={load} disabled={loading} sx={{ borderRadius: 3, fontWeight: 900 }}>
          Refresh
        </Button>
      </Box>

      {error && <Box sx={{ mt: 2, color: '#991b1b', fontWeight: 800, fontSize: 13 }}>{error}</Box>}

      <Box sx={{ mt: 2, border: '1px solid rgba(15,23,42,0.10)', borderRadius: 3, background: '#fff' }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1.4fr 1.8fr 1.2fr',
            gap: 2,
            px: 2,
            py: 1.5,
            borderBottom: '1px solid rgba(15,23,42,0.08)'
          }}
        >
          <Box sx={{ fontWeight: 900, fontSize: 12, color: '#64748b' }}>Name</Box>
          <Box sx={{ fontWeight: 900, fontSize: 12, color: '#64748b' }}>Email</Box>
          <Box sx={{ fontWeight: 900, fontSize: 12, color: '#64748b' }}>Created</Box>
        </Box>

        {items.map((u) => (
          <Box
            key={u._id}
            sx={{
              display: 'grid',
              gridTemplateColumns: '1.4fr 1.8fr 1.2fr',
              gap: 2,
              px: 2,
              py: 1.5,
              borderBottom: '1px solid rgba(15,23,42,0.06)'
            }}
          >
            <Box sx={{ fontWeight: 800, fontSize: 13, color: '#0f172a' }}>{u.name}</Box>
            <Box sx={{ fontWeight: 800, fontSize: 13, color: '#334155' }}>{u.email}</Box>
            <Box sx={{ fontWeight: 900, fontSize: 13, color: '#0f172a' }}>{new Date(u.createdAt).toLocaleString()}</Box>
          </Box>
        ))}

        {items.length === 0 && (
          <Box sx={{ px: 2, py: 3, color: '#64748b', fontWeight: 800, fontSize: 13 }}>No users yet.</Box>
        )}
      </Box>
    </Box>
  );
}
