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
import { NEWS_CATEGORIES } from '../../data/newsStore';
import { createPost, deletePost, listPosts, type PostRecord, updatePost } from '../../api/adminApi';
import { useAdminAuth } from '../AdminAuthContext';
import AdminImagePicker from '../components/AdminImagePicker';

const CATEGORY_OPTIONS = NEWS_CATEGORIES.filter((c) => c !== 'All');

export default function PostsAdminPage() {
  const { token } = useAdminAuth();

  const [posts, setPosts] = useState<PostRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<PostRecord | null>(null);
  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    category: CATEGORY_OPTIONS[0] ?? 'Platform Updates',
    image: '',
    author: '',
    date: '',
    tagsText: '',
    contentText: ''
  });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setError(null);
    setLoading(true);
    try {
      setPosts(await listPosts());
    } catch (e: any) {
      setError(e?.message || 'Failed to load posts');
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
      title: '',
      excerpt: '',
      category: CATEGORY_OPTIONS[0] ?? 'Platform Updates',
      image: '',
      author: '',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      tagsText: '',
      contentText: ''
    });
    setEditorOpen(true);
  };

  const openEdit = (p: PostRecord) => {
    setEditing(p);
    setError(null);
    const cat = CATEGORY_OPTIONS.includes(p.category as any) ? (p.category as (typeof CATEGORY_OPTIONS)[number]) : (CATEGORY_OPTIONS[0] ?? 'Platform Updates');
    setForm({
      title: p.title,
      excerpt: p.excerpt,
      category: cat,
      image: p.image,
      author: p.author,
      date: p.date,
      tagsText: (p.tags || []).join(', '),
      contentText: (p.content || []).join('\n')
    });
    setEditorOpen(true);
  };

  const parseTags = (value: string) => {
    return value
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
  };

  const parseContent = (value: string) => {
    return value
      .split('\n')
      .map((p) => p.trim())
      .filter(Boolean);
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      if (!form.title.trim()) throw new Error('Title is required');
      if (!form.excerpt.trim()) throw new Error('Excerpt is required');

      const payload = {
        title: form.title.trim(),
        excerpt: form.excerpt.trim(),
        category: form.category,
        image: form.image.trim() || '/hero section.jpg',
        author: form.author.trim() || 'Local Roots',
        date: form.date.trim() || new Date().toISOString(),
        tags: parseTags(form.tagsText),
        content: parseContent(form.contentText)
      };

      if (editing) {
        await updatePost(token, editing._id, payload);
      } else {
        await createPost(token, payload);
      }

      setEditorOpen(false);
      await load();
    } catch (e: any) {
      setError(e?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const removeOne = async (p: PostRecord) => {
    if (!window.confirm(`Delete "${p.title}"?`)) return;
    setError(null);
    try {
      await deletePost(token, p._id);
      await load();
    } catch (e: any) {
      setError(e?.message || 'Delete failed');
    }
  };

  const summary = useMemo(() => {
    const total = posts.length;
    const categories = new Set(posts.map((p) => p.category));
    return { total, categories: categories.size };
  }, [posts]);

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <Box>
          <Typography sx={{ fontWeight: 950, fontSize: 24, color: '#0f172a' }}>News / Posts</Typography>
          <Typography sx={{ mt: 0.25, fontSize: 13, fontWeight: 800, color: '#64748b' }}>
            Total: {summary.total} · Categories: {summary.categories}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.25, flexWrap: 'wrap' }}>
          <Button variant="outlined" onClick={load} disabled={loading} sx={{ borderRadius: 3, fontWeight: 900 }}>
            Refresh
          </Button>
          <Button variant="contained" onClick={openCreate} disabled={loading} sx={{ borderRadius: 3, fontWeight: 950 }}>
            New Post
          </Button>
        </Box>
      </Box>

      {error && <Box sx={{ mt: 2, color: '#991b1b', fontWeight: 800, fontSize: 13 }}>{error}</Box>}

      <Box sx={{ mt: 2, border: '1px solid rgba(15,23,42,0.10)', borderRadius: 3, background: '#fff' }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 170px',
            gap: 2,
            px: 2,
            py: 1.5,
            borderBottom: '1px solid rgba(15,23,42,0.08)'
          }}
        >
          <Box sx={{ fontWeight: 900, fontSize: 12, color: '#64748b' }}>Title</Box>
          <Box sx={{ fontWeight: 900, fontSize: 12, color: '#64748b' }}>Category</Box>
          <Box sx={{ fontWeight: 900, fontSize: 12, color: '#64748b' }}>Date</Box>
          <Box sx={{ fontWeight: 900, fontSize: 12, color: '#64748b', textAlign: 'right' }}>Actions</Box>
        </Box>

        {posts.map((p) => (
          <Box
            key={p._id}
            sx={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 170px',
              gap: 2,
              px: 2,
              py: 1.5,
              borderBottom: '1px solid rgba(15,23,42,0.06)'
            }}
          >
            <Box sx={{ fontWeight: 900, fontSize: 13, color: '#0f172a' }}>{p.title}</Box>
            <Box sx={{ fontWeight: 800, fontSize: 13, color: '#334155' }}>{p.category}</Box>
            <Box sx={{ fontWeight: 800, fontSize: 13, color: '#334155' }}>{p.date}</Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button size="small" variant="outlined" onClick={() => openEdit(p)} disabled={loading} sx={{ borderRadius: 2, fontWeight: 900 }}>
                Edit
              </Button>
              <Button size="small" variant="outlined" color="error" onClick={() => removeOne(p)} disabled={loading} sx={{ borderRadius: 2, fontWeight: 900 }}>
                Delete
              </Button>
            </Box>
          </Box>
        ))}

        {posts.length === 0 && (
          <Box sx={{ px: 2, py: 3, color: '#64748b', fontWeight: 800, fontSize: 13 }}>No posts yet.</Box>
        )}
      </Box>

      <Dialog open={editorOpen} onClose={() => setEditorOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 950 }}>{editing ? 'Edit Post' : 'New Post'}</DialogTitle>
        <DialogContent sx={{ pt: 1, display: 'grid', gap: 1.5 }}>
          <TextField label="Title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} fullWidth />
          <TextField
            label="Category"
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as (typeof CATEGORY_OPTIONS)[number] }))}
            fullWidth
            select
            SelectProps={{ native: true }}
          >
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </TextField>
          <TextField label="Excerpt" value={form.excerpt} onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))} fullWidth multiline minRows={2} />
          <AdminImagePicker
            token={token}
            value={form.image}
            onChange={(url) => setForm((f) => ({ ...f, image: url }))}
            label="Image"
            disabled={saving}
          />
          <TextField label="Author" value={form.author} onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))} fullWidth />
          <TextField label="Date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} fullWidth />
          <TextField
            label="Tags (comma separated)"
            value={form.tagsText}
            onChange={(e) => setForm((f) => ({ ...f, tagsText: e.target.value }))}
            fullWidth
          />
          <TextField
            label="Content (one paragraph per line)"
            value={form.contentText}
            onChange={(e) => setForm((f) => ({ ...f, contentText: e.target.value }))}
            fullWidth
            multiline
            minRows={5}
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
