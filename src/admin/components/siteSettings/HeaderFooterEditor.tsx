import { Box, Button, Card, CardContent, IconButton, TextField, Typography } from '@mui/material';
import { Plus, Trash2 } from 'lucide-react';
import type { HeaderConfig, FooterConfig, FooterLink, SiteSettings } from '../../../config/siteSettingsTypes';

export interface HeaderFooterEditorProps {
  header: HeaderConfig;
  footer: FooterConfig;
  onChange: (patch: Partial<Pick<SiteSettings, 'header' | 'footer'>>) => void;
}

export default function HeaderFooterEditor({ header, footer, onChange }: HeaderFooterEditorProps) {
  const updateHeader = (patch: Partial<HeaderConfig>) => {
    onChange({ header: { ...header, ...patch } });
  };
  const updateFooter = (patch: Partial<FooterConfig>) => {
    onChange({ footer: { ...footer, ...patch } });
  };

  const updateQuickLink = (index: number, patch: Partial<FooterLink>) => {
    const links = [...(footer.quickLinks || [])];
    links[index] = { ...links[index], ...patch };
    updateFooter({ quickLinks: links });
  };
  const addQuickLink = () => {
    updateFooter({ quickLinks: [...(footer.quickLinks || []), { label: 'New', path: '/' }] });
  };
  const removeQuickLink = (index: number) => {
    const links = (footer.quickLinks || []).filter((_, i) => i !== index);
    updateFooter({ quickLinks: links.length ? links : [{ label: 'Home', path: '/' }] });
  };
  const quickLinks = footer.quickLinks?.length ? footer.quickLinks : [{ label: 'Home', path: '/' }];

  return (
    <Box sx={{ display: 'grid', gap: 2 }}>
      <Card variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <CardContent sx={{ '&:last-child': { pb: 2 } }}>
          <Typography sx={{ fontWeight: 900, fontSize: 16, color: '#0f172a', mb: 2 }}>Header</Typography>
          <Box sx={{ display: 'grid', gap: 1.5 }}>
            <TextField
              size="small"
              label="Brand name"
              value={header.brandName}
              onChange={(e) => updateHeader({ brandName: e.target.value })}
              fullWidth
            />
            <TextField
              size="small"
              label="Brand mark (e.g. LR)"
              value={header.brandMark}
              onChange={(e) => updateHeader({ brandMark: e.target.value })}
              fullWidth
            />
            <TextField
              size="small"
              label="Search placeholder"
              value={header.searchPlaceholder}
              onChange={(e) => updateHeader({ searchPlaceholder: e.target.value })}
              fullWidth
            />
          </Box>
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <CardContent sx={{ '&:last-child': { pb: 2 } }}>
          <Typography sx={{ fontWeight: 900, fontSize: 16, color: '#0f172a', mb: 2 }}>Footer</Typography>
          <Box sx={{ display: 'grid', gap: 1.5 }}>
            <TextField
              size="small"
              label="Tagline"
              value={footer.tagline}
              onChange={(e) => updateFooter({ tagline: e.target.value })}
              fullWidth
            />
            <TextField
              size="small"
              label="Description"
              value={footer.description}
              onChange={(e) => updateFooter({ description: e.target.value })}
              fullWidth
              multiline
              rows={2}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
              <Typography sx={{ fontWeight: 800, fontSize: 13, color: '#64748b' }}>Quick links</Typography>
              <Button startIcon={<Plus size={16} />} size="small" onClick={addQuickLink} sx={{ fontWeight: 800 }}>Add</Button>
            </Box>
            {quickLinks.map((link, i) => (
              <Box key={i} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField size="small" label="Label" value={link.label} onChange={(e) => updateQuickLink(i, { label: e.target.value })} sx={{ flex: 1 }} />
                <TextField size="small" label="Path" value={link.path} onChange={(e) => updateQuickLink(i, { path: e.target.value })} sx={{ flex: 1 }} />
                <IconButton size="small" color="error" onClick={() => removeQuickLink(i)} disabled={quickLinks.length <= 1}><Trash2 size={16} /></IconButton>
              </Box>
            ))}
            <TextField
              size="small"
              label="Contact email"
              value={footer.contactEmail}
              onChange={(e) => updateFooter({ contactEmail: e.target.value })}
              fullWidth
            />
            <TextField
              size="small"
              label="Contact phone"
              value={footer.contactPhone}
              onChange={(e) => updateFooter({ contactPhone: e.target.value })}
              fullWidth
            />
            <TextField
              size="small"
              label="Contact address"
              value={footer.contactAddress}
              onChange={(e) => updateFooter({ contactAddress: e.target.value })}
              fullWidth
            />
            <TextField
              size="small"
              label="Bottom line"
              value={footer.bottomLine}
              onChange={(e) => updateFooter({ bottomLine: e.target.value })}
              fullWidth
              placeholder="Empowering local communities • Connecting global markets"
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
