import { Box, Card, CardContent, FormControlLabel, Switch, TextField, Typography } from '@mui/material';
import type { AnnouncementBarConfig, SiteSettings } from '../../../config/siteSettingsTypes';

export interface AnnouncementEditorProps {
  config: AnnouncementBarConfig;
  onChange: (patch: Partial<Pick<SiteSettings, 'announcementBar'>>) => void;
}

export default function AnnouncementEditor({ config, onChange }: AnnouncementEditorProps) {
  const update = (patch: Partial<AnnouncementBarConfig>) => {
    onChange({ announcementBar: { ...config, ...patch } });
  };

  return (
    <Card variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
      <CardContent sx={{ '&:last-child': { pb: 2 } }}>
        <Typography sx={{ fontWeight: 900, fontSize: 16, color: '#0f172a', mb: 2 }}>Announcement Bar</Typography>
        <FormControlLabel
          control={<Switch checked={config.enabled} onChange={(e) => update({ enabled: e.target.checked })} />}
          label="Show announcement bar"
          sx={{ display: 'block', mb: 1.5 }}
        />
        <Box sx={{ display: 'grid', gap: 1.5 }}>
          <TextField
            size="small"
            label="Promo text"
            value={config.promoText}
            onChange={(e) => update({ promoText: e.target.value })}
            fullWidth
            placeholder="Get 30% Off On Selected Items"
          />
          <TextField
            size="small"
            label="Email"
            value={config.email}
            onChange={(e) => update({ email: e.target.value })}
            fullWidth
            placeholder="support@localroots.com"
          />
          <TextField
            size="small"
            label="Secondary text (e.g. Up to 60% off)"
            value={config.secondaryText || ''}
            onChange={(e) => update({ secondaryText: e.target.value })}
            fullWidth
          />
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <TextField
              size="small"
              label="Currency"
              value={config.currency}
              onChange={(e) => update({ currency: e.target.value })}
              sx={{ flex: 1 }}
            />
            <TextField
              size="small"
              label="Language"
              value={config.language}
              onChange={(e) => update({ language: e.target.value })}
              sx={{ flex: 1 }}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
