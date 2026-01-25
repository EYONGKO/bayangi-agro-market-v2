import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import { Trash2, Plus } from 'lucide-react';
import type { FeatureItem, SiteSettings } from '../../../config/siteSettingsTypes';
import { DEFAULT_FEATURES } from '../../../config/siteSettingsTypes';

const ICON_IDS = ['headphones', 'shield', 'truck', 'gift'] as const;

export interface FeaturesEditorProps {
  features: FeatureItem[];
  onChange: (patch: Partial<Pick<SiteSettings, 'features'>>) => void;
}

export default function FeaturesEditor({ features, onChange }: FeaturesEditorProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const items = features.length ? features : [...DEFAULT_FEATURES];

  const updateFeature = (index: number, patch: Partial<FeatureItem>) => {
    const next = items.map((f, i) => (i === index ? { ...f, ...patch } : f));
    onChange({ features: next });
  };

  const addFeature = () => {
    const ids = items.map((f) => f.id);
    let id = 'feature-' + Date.now();
    while (ids.includes(id)) id = 'feature-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6);
    onChange({
      features: [...items, { id, iconId: 'gift', title: '', subtitle: '', bgColor: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' }],
    });
  };

  const removeFeature = (index: number) => {
    const next = items.filter((_, i) => i !== index);
    onChange({ features: next.length ? next : DEFAULT_FEATURES });
    setEditingId(null);
  };

  return (
    <Card variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
      <CardContent sx={{ '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography sx={{ fontWeight: 900, fontSize: 16, color: '#0f172a' }}>Feature Highlights</Typography>
          <Button startIcon={<Plus size={16} />} variant="outlined" size="small" onClick={addFeature} sx={{ borderRadius: 2, fontWeight: 800 }}>
            Add feature
          </Button>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {items.map((f, index) => (
            <Box
              key={f.id}
              sx={{
                border: '1px solid rgba(15,23,42,0.10)',
                borderRadius: 2,
                p: 1.5,
                background: editingId === f.id ? 'rgba(239,68,68,0.04)' : '#fafafa',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography sx={{ fontWeight: 800, fontSize: 13, color: '#64748b' }}>{f.title || 'Untitled'}</Typography>
                <IconButton size="small" color="error" onClick={() => removeFeature(index)} disabled={items.length <= 1} sx={{ p: 0.5, ml: 'auto' }}>
                  <Trash2 size={16} />
                </IconButton>
                <Button size="small" onClick={() => setEditingId(editingId === f.id ? null : f.id)} sx={{ fontWeight: 800 }}>
                  {editingId === f.id ? 'Collapse' : 'Expand'}
                </Button>
              </Box>
              {editingId === f.id && (
                <Box sx={{ display: 'grid', gap: 1.5, mt: 1 }}>
                  <TextField
                    size="small"
                    label="Title"
                    value={f.title}
                    onChange={(e) => updateFeature(index, { title: e.target.value })}
                    fullWidth
                  />
                  <TextField
                    size="small"
                    label="Subtitle"
                    value={f.subtitle}
                    onChange={(e) => updateFeature(index, { subtitle: e.target.value })}
                    fullWidth
                  />
                  <TextField
                    size="small"
                    label="Icon"
                    select
                    SelectProps={{ native: true }}
                    value={f.iconId}
                    onChange={(e) => updateFeature(index, { iconId: e.target.value })}
                    fullWidth
                  >
                    {ICON_IDS.map((id) => (
                      <option key={id} value={id}>{id}</option>
                    ))}
                  </TextField>
                  <TextField
                    size="small"
                    label="Background (CSS gradient)"
                    value={f.bgColor}
                    onChange={(e) => updateFeature(index, { bgColor: e.target.value })}
                    fullWidth
                    placeholder="linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
                  />
                </Box>
              )}
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
