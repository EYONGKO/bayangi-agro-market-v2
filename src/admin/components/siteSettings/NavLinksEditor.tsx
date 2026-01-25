import { Box, Button, Card, CardContent, IconButton, TextField, Typography } from '@mui/material';
import { Plus, Trash2 } from 'lucide-react';
import type { NavLinkItem, SiteSettings } from '../../../config/siteSettingsTypes';
import { DEFAULT_NAV_LINKS } from '../../../config/siteSettingsTypes';

export interface NavLinksEditorProps {
  navLinks: NavLinkItem[];
  onChange: (patch: Partial<Pick<SiteSettings, 'navLinks'>>) => void;
}

export default function NavLinksEditor({ navLinks, onChange }: NavLinksEditorProps) {
  const items = navLinks.length ? navLinks : [...DEFAULT_NAV_LINKS];

  const updateLink = (index: number, patch: Partial<NavLinkItem>) => {
    const next = items.map((l, i) => (i === index ? { ...l, ...patch } : l));
    onChange({ navLinks: next });
  };

  const addLink = () => {
    onChange({ navLinks: [...items, { path: '/', label: '' }] });
  };

  const removeLink = (index: number) => {
    const next = items.filter((_, i) => i !== index);
    onChange({ navLinks: next.length ? next : DEFAULT_NAV_LINKS });
  };

  return (
    <Card variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
      <CardContent sx={{ '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography sx={{ fontWeight: 900, fontSize: 16, color: '#0f172a' }}>Navigation links</Typography>
          <Button startIcon={<Plus size={16} />} variant="outlined" size="small" onClick={addLink} sx={{ borderRadius: 2, fontWeight: 800 }}>
            Add link
          </Button>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {items.map((link, index) => {
            const isEmpty = !link.label?.trim();
            return (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  gap: 1,
                  alignItems: 'center',
                  border: isEmpty ? '1px solid rgba(239,68,68,0.30)' : '1px solid rgba(15,23,42,0.10)',
                  borderRadius: 2,
                  p: 1.5,
                  background: isEmpty ? 'rgba(239,68,68,0.04)' : '#fafafa',
                }}
              >
                <TextField
                  size="small"
                  label="Path"
                  value={link.path}
                  onChange={(e) => updateLink(index, { path: e.target.value })}
                  sx={{ flex: 1 }}
                  placeholder="/global-market"
                  error={!link.path?.trim()}
                />
                <TextField
                  size="small"
                  label="Label"
                  value={link.label}
                  onChange={(e) => updateLink(index, { label: e.target.value })}
                  sx={{ flex: 1 }}
                  placeholder="e.g. Home"
                  required
                  error={isEmpty}
                  helperText={isEmpty ? 'Label is required' : ''}
                />
                <IconButton size="small" color="error" onClick={() => removeLink(index)} disabled={items.length <= 1}>
                  <Trash2 size={16} />
                </IconButton>
              </Box>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
}
