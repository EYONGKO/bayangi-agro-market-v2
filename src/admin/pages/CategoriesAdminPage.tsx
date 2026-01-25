import { useEffect, useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import {
  createCategory,
  deleteCategory,
  listCategories,
  type CategoryRecord,
  updateCategory
} from '../../api/adminApi';
import { useAdminAuth } from '../AdminAuthContext';

export default function CategoriesAdminPage() {
  const { token } = useAdminAuth();

  const [items, setItems] = useState<CategoryRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<CategoryRecord | null>(null);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setError(null);
    setLoading(true);
    try {
      const categories = await listCategories();
      setItems(categories);
    } catch (e: any) {
      setError(e?.message || 'Failed to load categories');
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
    setName('');
    setEditorOpen(true);
  };

  const openEdit = (c: CategoryRecord) => {
    setEditing(c);
    setError(null);
    setName(c.name);
    setEditorOpen(true);
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      if (!name.trim()) throw new Error('Name is required');

      if (editing) {
        await updateCategory(token, editing._id, { name });
      } else {
        await createCategory(token, { name });
      }

      setEditorOpen(false);
      await load();
    } catch (e: any) {
      setError(e?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const removeOne = async (c: CategoryRecord) => {
    if (!window.confirm(`Delete category "${c.name}"?`)) return;
    setError(null);
    try {
      await deleteCategory(token, c._id);
      await load();
    } catch (e: any) {
      setError(e?.message || 'Delete failed');
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <Box>
          <Typography sx={{ fontWeight: 950, fontSize: 24, color: '#0f172a' }}>Categories</Typography>
          <Typography sx={{ mt: 0.25, fontSize: 13, fontWeight: 800, color: '#64748b' }}>Total: {items.length}</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.25, flexWrap: 'wrap' }}>
          <Button variant="outlined" onClick={load} disabled={loading} sx={{ borderRadius: 3, fontWeight: 900 }}>
            Refresh
          </Button>
          <Button variant="contained" onClick={openCreate} disabled={loading} sx={{ borderRadius: 3, fontWeight: 950 }}>
            New Category
          </Button>
        </Box>
      </Box>

      {error && <Box sx={{ mt: 2, color: '#991b1b', fontWeight: 800, fontSize: 13 }}>{error}</Box>}

      <Box sx={{ mt: 2, border: '1px solid rgba(15,23,42,0.10)', borderRadius: 3, background: '#fff' }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 2fr 170px',
            gap: 2,
            px: 2,
            py: 1.5,
            borderBottom: '1px solid rgba(15,23,42,0.08)'
          }}
        >
          <Box sx={{ fontWeight: 900, fontSize: 12, color: '#64748b' }}>ID</Box>
          <Box sx={{ fontWeight: 900, fontSize: 12, color: '#64748b' }}>Name</Box>
          <Box sx={{ fontWeight: 900, fontSize: 12, color: '#64748b', textAlign: 'right' }}>Actions</Box>
        </Box>

        {items.map((c) => (
          <Box
            key={c._id}
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 2fr 170px',
              gap: 2,
              px: 2,
              py: 1.5,
              borderBottom: '1px solid rgba(15,23,42,0.06)'
            }}
          >
            <Box sx={{ fontWeight: 900, fontSize: 13, color: '#0f172a' }}>{c._id}</Box>
            <Box sx={{ fontWeight: 800, fontSize: 13, color: '#334155' }}>{c.name}</Box>
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
          <Box sx={{ px: 2, py: 3, color: '#64748b', fontWeight: 800, fontSize: 13 }}>No categories yet.</Box>
        )}
      </Box>

      <Dialog open={editorOpen} onClose={() => setEditorOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 950 }}>{editing ? 'Edit Category' : 'New Category'}</DialogTitle>
        <DialogContent sx={{ pt: 1, display: 'grid', gap: 1.5 }}>
          <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
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
