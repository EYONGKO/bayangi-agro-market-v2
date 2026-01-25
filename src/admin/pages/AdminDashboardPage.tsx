import { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { Package, ShoppingCart, Users, Eye, Settings, DollarSign } from 'lucide-react';
import { listProducts, listOrders, listUsers } from '../../api/adminApi';
import { listVisits } from '../../api/visitsApi';
import { useAdminAuth } from '../AdminAuthContext';

type StatCard = { label: string; value: number; to: string; icon: React.ReactNode };

export default function AdminDashboardPage() {
  const { token } = useAdminAuth();
  const [products, setProducts] = useState(0);
  const [orders, setOrders] = useState(0);
  const [users, setUsers] = useState(0);
  const [visits, setVisits] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setError(null);
    Promise.all([
      listProducts().then((p) => p.length).catch(() => 0),
      listOrders(token).then((o) => o.length).catch(() => 0),
      listUsers(token).then((u) => u.length).catch(() => 0),
      listVisits(token, 10_000).then((v) => v.length).catch(() => 0),
    ])
      .then(([p, o, u, v]) => {
        setProducts(p);
        setOrders(o);
        setUsers(u);
        setVisits(v);
      })
      .catch((e) => setError(e?.message ?? 'Failed to load stats'))
      .finally(() => setLoading(false));
  }, [token]);

  const cards: StatCard[] = [
    { label: 'Products', value: products, to: '/admin/products', icon: <Package size={24} /> },
    { label: 'Orders', value: orders, to: '/admin/orders', icon: <ShoppingCart size={24} /> },
    { label: 'Users', value: users, to: '/admin/users', icon: <Users size={24} /> },
    { label: 'Visitors (tracked)', value: visits, to: '/admin/visitors', icon: <Eye size={24} /> },
  ];

  return (
    <Box>
      <Typography sx={{ fontWeight: 950, fontSize: 24, color: '#0f172a', mb: 1 }}>Dashboard</Typography>
      <Typography sx={{ fontSize: 14, color: '#64748b', fontWeight: 700, mb: 3 }}>
        Overview of products, orders, users, and site visitors.
      </Typography>

      {error && (
        <Box sx={{ mb: 2, p: 1.5, borderRadius: 2, background: 'rgba(239,68,68,0.08)', color: '#991b1b', fontWeight: 800, fontSize: 13 }}>
          {error}
        </Box>
      )}

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 2 }}>
        {cards.map((c) => (
          <Card
            key={c.to}
            component={Link}
            to={c.to}
            variant="outlined"
            sx={{
              borderRadius: 3,
              textDecoration: 'none',
              color: 'inherit',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: 'rgba(239,68,68,0.4)',
                boxShadow: '0 8px 24px rgba(15,23,42,0.08)',
              },
            }}
          >
            <CardContent sx={{ '&:last-child': { pb: 2 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <Box sx={{ color: '#64748b' }}>{c.icon}</Box>
                <Typography sx={{ fontWeight: 800, fontSize: 14, color: '#64748b' }}>{c.label}</Typography>
              </Box>
              <Typography sx={{ fontWeight: 950, fontSize: 28, color: '#0f172a' }}>
                {loading ? '—' : c.value}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box sx={{ mt: 3 }}>
        <Typography sx={{ fontWeight: 900, fontSize: 16, color: '#0f172a', mb: 1.5 }}>Quick links</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {cards.map((c) => (
            <Box
              key={c.to}
              component={Link}
              to={c.to}
              sx={{
                px: 2,
                py: 1,
                borderRadius: 2,
                background: '#f1f5f9',
                color: '#0f172a',
                fontWeight: 800,
                fontSize: 13,
                textDecoration: 'none',
                '&:hover': { background: 'rgba(239,68,68,0.1)', color: '#dc2626' },
              }}
            >
              {c.label}
            </Box>
          ))}
          <Box
            component={Link}
            to="/admin/prices"
            sx={{
              px: 2,
              py: 1,
              borderRadius: 2,
              background: '#f1f5f9',
              color: '#0f172a',
              fontWeight: 800,
              fontSize: 13,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              '&:hover': { background: 'rgba(239,68,68,0.1)', color: '#dc2626' },
            }}
          >
            <DollarSign size={14} />
            Prices
          </Box>
          <Box
            component={Link}
            to="/admin/site-settings"
            sx={{
              px: 2,
              py: 1,
              borderRadius: 2,
              background: '#f1f5f9',
              color: '#0f172a',
              fontWeight: 800,
              fontSize: 13,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              '&:hover': { background: 'rgba(239,68,68,0.1)', color: '#dc2626' },
            }}
          >
            <Settings size={14} />
            Site Settings
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
