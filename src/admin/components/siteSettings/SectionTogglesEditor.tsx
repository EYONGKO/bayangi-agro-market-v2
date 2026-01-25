import { Box, Card, CardContent, FormControlLabel, Switch, TextField, Typography } from '@mui/material';
import type { SectionVisibility, SiteSettings } from '../../../config/siteSettingsTypes';
import { DEFAULT_SECTION_VISIBILITY } from '../../../config/siteSettingsTypes';

export interface SectionTogglesEditorProps {
  sectionVisibility: SectionVisibility;
  onChange: (patch: Partial<Pick<SiteSettings, 'sectionVisibility'>>) => void;
}

const BOOL_TOGGLES: { key: keyof SectionVisibility; label: string }[] = [
  { key: 'announcementBar', label: 'Announcement bar' },
  { key: 'categoryNav', label: 'Category / nav bar' },
  { key: 'pricesButton', label: 'PRICES button (nav bar)' },
  { key: 'hero', label: 'Hero slider' },
  { key: 'features', label: 'Feature highlights' },
  { key: 'communities', label: 'Communities section' },
  { key: 'sellerSection', label: 'Seller CTA section' },
];

export default function SectionTogglesEditor({ sectionVisibility, onChange }: SectionTogglesEditorProps) {
  const vis = { ...DEFAULT_SECTION_VISIBILITY, ...sectionVisibility } as SectionVisibility;

  const toggle = (key: keyof SectionVisibility, value: boolean) => {
    onChange({ sectionVisibility: { ...vis, [key]: value } });
  };

  const setPricesLabel = (label: string) => {
    onChange({ sectionVisibility: { ...vis, pricesButtonLabel: label || DEFAULT_SECTION_VISIBILITY.pricesButtonLabel } });
  };

  return (
    <Card variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
      <CardContent sx={{ '&:last-child': { pb: 2 } }}>
        <Typography sx={{ fontWeight: 900, fontSize: 16, color: '#0f172a', mb: 2 }}>Section visibility</Typography>
        <Typography sx={{ fontSize: 13, color: '#64748b', fontWeight: 700, mb: 2 }}>
          Show or hide frontend sections. Control the PRICES button and nav bar from here.
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {BOOL_TOGGLES.map(({ key, label }) => (
            <FormControlLabel
              key={key}
              control={
                <Switch
                  checked={!!(vis as unknown as Record<string, unknown>)[key]}
                  onChange={(e) => toggle(key, e.target.checked)}
                  size="small"
                />
              }
              label={label}
              sx={{ m: 0 }}
            />
          ))}
        </Box>
        {vis.pricesButton && (
          <Box sx={{ mt: 2 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 800, color: '#0f172a', mb: 1 }}>PRICES button label</Typography>
            <TextField
              size="small"
              value={vis.pricesButtonLabel ?? DEFAULT_SECTION_VISIBILITY.pricesButtonLabel}
              onChange={(e) => setPricesLabel(e.target.value)}
              placeholder="PRICES"
              fullWidth
              sx={{ maxWidth: 280 }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
