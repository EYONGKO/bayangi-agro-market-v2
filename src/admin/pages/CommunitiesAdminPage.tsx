import { useEffect, useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import { RefreshCw } from 'lucide-react';
import {
  createCommunity,
  deleteCommunity,
  listCommunities,
  type CommunityRecord,
  updateCommunity
} from '../../api/adminApi';
import { useAdminAuth } from '../AdminAuthContext';
import AdminImagePicker from '../components/AdminImagePicker';

const DEFAULT_COMMUNITIES = [
  { name: 'Kendem', slug: 'kendem', description: 'Handcrafted goods and artisan stories', image: '/kendem-hero.jpg' },
  { name: 'Mamfe', slug: 'mamfe', description: 'Sustainable agriculture and farm produce', image: '/mamfe-hero.jpg' },
  { name: 'Membe', slug: 'membe', description: 'Coffee farming and harvest communities', image: '/membe-hero.jpg' },
  { name: 'Widikum', slug: 'widikum', description: 'Traditional weaving and textile heritage', image: '/widikum-hero.jpg' },
  { name: 'Fonjo', slug: 'fonjo', description: 'Renowned for textiles and traditional weaving', image: '/fonjo-hero.jpg' },
  { name: 'Moshie/Kekpoti', slug: 'moshie-kekpoti', description: 'Fusion of tradition and innovation', image: '/moshie-kekpoti-hero.png' },
];

export default function CommunitiesAdminPage() {
  const { token } = useAdminAuth();

  const [items, setItems] = useState<CommunityRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<CommunityRecord | null>(null);
  const [form, setForm] = useState({ name: '', description: '', image: '' });
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const load = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      setItems(await listCommunities());
    } catch (e: any) {
      setError(e?.message || 'Failed to load communities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const openCreate = () => {
    setEditing(null);
    setError(null);
    setForm({ name: '', description: '', image: '' });
    setEditorOpen(true);
  };

  const openEdit = (c: CommunityRecord) => {
    setEditing(c);
    setError(null);
    setForm({ name: c.name, description: c.description || '', image: c.image || '' });
    setEditorOpen(true);
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      if (!form.name.trim()) throw new Error('Name is required');

      if (editing) {
        await updateCommunity(token, editing._id, {
          name: form.name,
          description: form.description,
          image: form.image
        });
      } else {
        await createCommunity(token, { name: form.name, description: form.description, image: form.image });
      }

      setEditorOpen(false);
      await load();
    } catch (e: any) {
      setError(e?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const removeOne = async (c: CommunityRecord) => {
    if (!window.confirm(`Delete community "${c.name}"?`)) return;
    setError(null);
    try {
      await deleteCommunity(token, c._id);
      await load();
    } catch (e: any) {
      setError(e?.message || 'Delete failed');
    }
  };

  const syncDefaults = async () => {
    if (!token) return;
    setSyncing(true);
    setError(null);
    setSuccess(null);
    try {
      const existing = await listCommunities();
      const existingSlugs = new Set(existing.map((c) => c.slug));
      let created = 0;
      const createdNames: string[] = [];
      for (const def of DEFAULT_COMMUNITIES) {
        if (!existingSlugs.has(def.slug)) {
          try {
            await createCommunity(token, {
              name: def.name,
              description: def.description,
              image: def.image,
              slug: def.slug,
            });
            created++;
            createdNames.push(def.name);
          } catch (e: any) {
            // Skip if already exists (race condition) or other error
            console.warn(`Failed to create ${def.name}:`, e?.message);
          }
        }
      }
      if (created > 0) {
        setSuccess(`Created ${created} default communit${created === 1 ? 'y' : 'ies'}: ${createdNames.join(', ')}`);
        await load();
      } else {
        setSuccess('All default communities already exist.');
      }
    } catch (e: any) {
      setError(e?.message || 'Sync failed');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <Box>
          <Typography sx={{ fontWeight: 950, fontSize: 24, color: '#0f172a' }}>Communities</Typography>
          <Typography sx={{ mt: 0.25, fontSize: 13, fontWeight: 800, color: '#64748b' }}>Total: {items.length}</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.25, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            startIcon={<RefreshCw size={16} />}
            onClick={load}
            disabled={loading}
            sx={{ borderRadius: 3, fontWeight: 900 }}
          >
            Refresh
          </Button>
          <Button
            variant="outlined"
            onClick={syncDefaults}
            disabled={loading || syncing}
            sx={{ borderRadius: 3, fontWeight: 900 }}
          >
            {syncing ? 'Syncing…' : 'Sync Defaults'}
          </Button>
          <Button variant="contained" onClick={openCreate} disabled={loading} sx={{ borderRadius: 3, fontWeight: 950 }}>
            New Community
          </Button>
        </Box>
      </Box>

      {error && (
        <Box sx={{ mt: 2, p: 1.5, borderRadius: 2, background: 'rgba(239,68,68,0.08)', color: '#991b1b', fontWeight: 800, fontSize: 13 }}>
          {error}
        </Box>
      )}
      {success && (
        <Box sx={{ mt: 2, p: 1.5, borderRadius: 2, background: 'rgba(34,197,94,0.08)', color: '#166534', fontWeight: 800, fontSize: 13 }}>
          {success}
        </Box>
      )}

      <Box sx={{ mt: 2, border: '1px solid rgba(15,23,42,0.10)', borderRadius: 3, background: '#fff' }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 2fr 2fr 170px',
            gap: 2,
            px: 2,
            py: 1.5,
            borderBottom: '1px solid rgba(15,23,42,0.08)'
          }}
        >
          <Box sx={{ fontWeight: 900, fontSize: 12, color: '#64748b' }}>ID</Box>
          <Box sx={{ fontWeight: 900, fontSize: 12, color: '#64748b' }}>Name</Box>
          <Box sx={{ fontWeight: 900, fontSize: 12, color: '#64748b' }}>Description</Box>
          <Box sx={{ fontWeight: 900, fontSize: 12, color: '#64748b', textAlign: 'right' }}>Actions</Box>
        </Box>

        {items.map((c) => (
          <Box
            key={c._id}
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 2fr 2fr 170px',
              gap: 2,
              px: 2,
              py: 1.5,
              borderBottom: '1px solid rgba(15,23,42,0.06)'
            }}
          >
            <Box sx={{ fontWeight: 900, fontSize: 13, color: '#0f172a' }}>{c._id}</Box>
            <Box sx={{ fontWeight: 800, fontSize: 13, color: '#334155' }}>{c.name}</Box>
            <Box sx={{ fontWeight: 800, fontSize: 13, color: '#334155' }}>{c.description || '-'}</Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button size="small" variant="outlined" onClick={() => openEdit(c)} disabled={loading} sx={{ borderRadius: 2, fontWeight: 900 }}>
                Edit
              </Button>
              <Button size="small" variant="outlined" color="error" onClick={() => removeOne(c)} disabled={loading} sx={{ borderRadius: 2, fontWeight: 900 }}>
                Delete
              </Button>
            </Box>
          </Box>
        ))}

        {items.length === 0 && (
          <Box sx={{ px: 2, py: 3, color: '#64748b', fontWeight: 800, fontSize: 13 }}>No communities yet.</Box>
        )}
      </Box>

      <Dialog open={editorOpen} onClose={() => setEditorOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 950 }}>{editing ? 'Edit Community' : 'New Community'}</DialogTitle>
        <DialogContent sx={{ pt: 1, display: 'grid', gap: 1.5 }}>
          <TextField
            label="Name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            fullWidth
          />
          <TextField
            label="Description"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            fullWidth
            multiline
            minRows={2}
          />
          <AdminImagePicker
            token={token}
            value={form.image}
            onChange={(url) => setForm((f) => ({ ...f, image: url }))}
            label="Image"
            disabled={saving}
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
