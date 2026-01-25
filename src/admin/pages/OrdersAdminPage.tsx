import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography
} from '@mui/material';
import { createOrder, deleteOrder, listOrders, type OrderRecord, updateOrder } from '../../api/adminApi';
import { useAdminAuth } from '../AdminAuthContext';

const STATUS_OPTIONS: OrderRecord['status'][] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function OrdersAdminPage() {
  const { token } = useAdminAuth();

  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<OrderRecord | null>(null);
  const [form, setForm] = useState({
    buyerName: '',
    buyerEmail: '',
    sellerId: '',
    total: '',
    status: 'pending' as OrderRecord['status'],
    itemsJson: '[]'
  });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setError(null);
    setLoading(true);
    try {
      setOrders(await listOrders(token));
    } catch (e: any) {
      setError(e?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const openCreate = () => {
    setEditing(null);
    setError(null);
    setForm({
      buyerName: '',
      buyerEmail: '',
      sellerId: '',
      total: '',
      status: 'pending',
      itemsJson: '[]'
    });
    setEditorOpen(true);
  };

  const openEdit = (o: OrderRecord) => {
    setEditing(o);
    setError(null);
    setForm({
      buyerName: o.buyerName,
      buyerEmail: o.buyerEmail,
      sellerId: o.sellerId || '',
      total: String(o.total),
      status: o.status,
      itemsJson: JSON.stringify(o.items ?? [], null, 2)
    });
    setEditorOpen(true);
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const totalNum = Number(form.total);
      if (!Number.isFinite(totalNum)) throw new Error('Total must be a number');

      let items: any[] = [];
      try {
        const parsed = JSON.parse(form.itemsJson || '[]');
        if (!Array.isArray(parsed)) throw new Error('Items JSON must be an array');
        items = parsed;
      } catch {
        throw new Error('Items JSON is invalid');
      }

      if (editing) {
        const updated = await updateOrder(token, editing._id, {
          buyerName: form.buyerName,
          buyerEmail: form.buyerEmail,
          sellerId: form.sellerId,
          total: totalNum,
          status: form.status,
          items: items as any
        });
        setOrders((prev) => prev.map((x) => (x._id === updated._id ? updated : x)));
      } else {
        const created = await createOrder(token, {
          buyerName: form.buyerName,
          buyerEmail: form.buyerEmail,
          sellerId: form.sellerId,
          total: totalNum,
          status: form.status,
          items: items as any
        });
        setOrders((prev) => [created, ...prev]);
      }

      setEditorOpen(false);
    } catch (e: any) {
      setError(e?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const removeOne = async (o: OrderRecord) => {
    if (!window.confirm(`Delete order "${o._id}"?`)) return;
    setError(null);
    try {
      await deleteOrder(token, o._id);
      setOrders((prev) => prev.filter((x) => x._id !== o._id));
    } catch (e: any) {
      setError(e?.message || 'Delete failed');
    }
  };

  const summary = useMemo(() => {
    const totalOrders = orders.length;
    const pending = orders.filter((o) => o.status === 'pending').length;
    return { totalOrders, pending };
  }, [orders]);

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <Box>
          <Typography sx={{ fontWeight: 950, fontSize: 24, color: '#0f172a' }}>Orders</Typography>
          <Typography sx={{ mt: 0.25, fontSize: 13, fontWeight: 800, color: '#64748b' }}>
            Total: {summary.totalOrders} · Pending: {summary.pending}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.25, flexWrap: 'wrap' }}>
          <Button variant="outlined" onClick={load} disabled={loading} sx={{ borderRadius: 3, fontWeight: 900 }}>
            Refresh
          </Button>
          <Button variant="contained" onClick={openCreate} sx={{ borderRadius: 3, fontWeight: 950 }}>
            New Order
          </Button>
        </Box>
      </Box>

      {error && <Box sx={{ mt: 2, color: '#991b1b', fontWeight: 800, fontSize: 13 }}>{error}</Box>}

      <Box sx={{ mt: 2, border: '1px solid rgba(15,23,42,0.10)', borderRadius: 3, background: '#fff' }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1.3fr 1.2fr 1fr 1fr 170px',
            gap: 2,
            px: 2,
            py: 1.5,
            borderBottom: '1px solid rgba(15,23,42,0.08)'
          }}
        >
          <Box sx={{ fontWeight: 900, fontSize: 12, color: '#64748b' }}>Order</Box>
          <Box sx={{ fontWeight: 900, fontSize: 12, color: '#64748b' }}>Buyer</Box>
          <Box sx={{ fontWeight: 900, fontSize: 12, color: '#64748b' }}>Status</Box>
          <Box sx={{ fontWeight: 900, fontSize: 12, color: '#64748b', textAlign: 'right' }}>Total</Box>
          <Box sx={{ fontWeight: 900, fontSize: 12, color: '#64748b', textAlign: 'right' }}>Actions</Box>
        </Box>

        {orders.map((o) => (
          <Box
            key={o._id}
            sx={{
              display: 'grid',
              gridTemplateColumns: '1.3fr 1.2fr 1fr 1fr 170px',
              gap: 2,
              px: 2,
              py: 1.5,
              borderBottom: '1px solid rgba(15,23,42,0.06)'
            }}
          >
            <Box sx={{ fontWeight: 900, fontSize: 13, color: '#0f172a' }}>{o._id}</Box>
            <Box sx={{ fontWeight: 800, fontSize: 13, color: '#334155' }}>{o.buyerName}</Box>
            <Box sx={{ fontWeight: 900, fontSize: 13, color: '#0f172a' }}>{o.status}</Box>
            <Box sx={{ fontWeight: 900, fontSize: 13, color: '#0f172a', textAlign: 'right' }}>{o.total.toLocaleString()}</Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button size="small" variant="outlined" onClick={() => openEdit(o)} sx={{ borderRadius: 2, fontWeight: 900 }}>
                Edit
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="error"
                onClick={() => removeOne(o)}
                sx={{ borderRadius: 2, fontWeight: 900 }}
              >
                Delete
              </Button>
            </Box>
          </Box>
        ))}

        {orders.length === 0 && (
          <Box sx={{ px: 2, py: 3, color: '#64748b', fontWeight: 800, fontSize: 13 }}>No orders yet.</Box>
        )}
      </Box>

      <Dialog open={editorOpen} onClose={() => setEditorOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 950 }}>{editing ? 'Edit Order' : 'New Order'}</DialogTitle>
        <DialogContent sx={{ pt: 1, display: 'grid', gap: 1.5 }}>
          <TextField
            label="Buyer Name"
            value={form.buyerName}
            onChange={(e) => setForm((f) => ({ ...f, buyerName: e.target.value }))}
            fullWidth
          />
          <TextField
            label="Buyer Email"
            value={form.buyerEmail}
            onChange={(e) => setForm((f) => ({ ...f, buyerEmail: e.target.value }))}
            fullWidth
          />
          <TextField
            label="Seller ID"
            value={form.sellerId}
            onChange={(e) => setForm((f) => ({ ...f, sellerId: e.target.value }))}
            fullWidth
          />
          <TextField
            label="Status"
            value={form.status}
            onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as OrderRecord['status'] }))}
            fullWidth
            select
            SelectProps={{ native: true }}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </TextField>
          <TextField
            label="Total"
            value={form.total}
            onChange={(e) => setForm((f) => ({ ...f, total: e.target.value }))}
            fullWidth
          />
          <TextField
            label="Items (JSON array)"
            value={form.itemsJson}
            onChange={(e) => setForm((f) => ({ ...f, itemsJson: e.target.value }))}
            fullWidth
            multiline
            minRows={4}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button variant="outlined" onClick={() => setEditorOpen(false)} disabled={saving} sx={{ borderRadius: 3, fontWeight: 900 }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={save} disabled={saving} sx={{ borderRadius: 3, fontWeight: 950 }}>
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
