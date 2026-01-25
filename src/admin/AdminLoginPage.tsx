import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useAdminAuth } from './AdminAuthContext';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, register } = useAdminAuth();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const redirectTo = (location.state as any)?.redirectTo || '/admin/products';

  const onSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      if (mode === 'login') {
        await signIn({ email, password });
      } else {
        await register({ name: name || 'Admin', email, password });
      }
      navigate(redirectTo, { replace: true });
    } catch (e: any) {
      const msg = e?.message || 'Authentication failed';
      const isNetwork = /failed to fetch|network error|load failed/i.test(String(msg));
      setError(isNetwork
        ? 'Cannot reach the API. Run the backend first: cd local-roots-api && npm start (port 8080). Then restart the frontend dev server.'
        : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: '#f8fafc', display: 'grid', placeItems: 'center', px: 2, py: 6 }}>
      <Box sx={{ width: '100%', maxWidth: 520, borderRadius: 4, background: '#fff', border: '1px solid rgba(15,23,42,0.10)', p: 3 }}>
        <Typography sx={{ fontWeight: 950, fontSize: 22, color: '#0f172a' }}>Admin</Typography>
        <Typography sx={{ mt: 0.25, fontSize: 13, fontWeight: 700, color: '#64748b' }}>
          Sign in to manage Products, Orders, Users, Communities, Posts, Categories
        </Typography>

        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
          <Button
            variant={mode === 'login' ? 'contained' : 'outlined'}
            onClick={() => setMode('login')}
            sx={{ borderRadius: 3, fontWeight: 900 }}
          >
            Sign In
          </Button>
          <Button
            variant={mode === 'register' ? 'contained' : 'outlined'}
            onClick={() => setMode('register')}
            sx={{ borderRadius: 3, fontWeight: 900 }}
          >
            Register
          </Button>
        </Box>

        <Box sx={{ mt: 2.5, display: 'grid', gap: 1.5 }}>
          {mode === 'register' && (
            <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
          )}
          <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
          <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />
          {error && <Box sx={{ color: '#991b1b', fontWeight: 800, fontSize: 13 }}>{error}</Box>}
          <Button variant="contained" onClick={onSubmit} disabled={loading} sx={{ borderRadius: 3, fontWeight: 950 }}>
            {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Register'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
