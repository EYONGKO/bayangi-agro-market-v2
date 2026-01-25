import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { Save, RefreshCw, ExternalLink, Plus, Trash2 } from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { useAdminAuth } from '../AdminAuthContext';
import { updateSiteSettings } from '../../api/siteSettingsApi';
import type { MarketPricesConfig, PriceItem, SiteSettings } from '../../config/siteSettingsTypes';
import { DEFAULT_MARKET_PRICES, DEFAULT_PRICE_ITEMS, mergeWithDefaults } from '../../config/siteSettingsTypes';

function newItemId() {
  return `item-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function PricesAdminPage() {
  const { token } = useAdminAuth();
  const { settings, loading, error, refetch } = useSiteSettings();
  const [local, setLocal] = useState<MarketPricesConfig>(() => ({ ...DEFAULT_MARKET_PRICES }));
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const merged = mergeWithDefaults(settings as Partial<SiteSettings>);
    setLocal({ ...DEFAULT_MARKET_PRICES, ...merged.marketPrices });
  }, [settings]);

  const update = (patch: Partial<MarketPricesConfig>) => {
    setLocal((prev) => ({ ...prev, ...patch }));
  };

  const updateItem = (index: number, patch: Partial<PriceItem>) => {
    const next = (local.priceItems ?? []).map((it, i) =>
      i === index ? { ...it, ...patch } : it
    );
    update({ priceItems: next });
  };

  const addItem = () => {
    const next: PriceItem[] = [
      ...(local.priceItems ?? []),
      {
        id: newItemId(),
        name: '',
        unitLabel: '',
        localPrice: null,
        worldPrice: 0,
      },
    ];
    update({ priceItems: next });
  };

  const removeItem = (index: number) => {
    const next = (local.priceItems ?? []).filter((_, i) => i !== index);
    update({ priceItems: next.length ? next : [...DEFAULT_PRICE_ITEMS] });
  };

  const handleSave = async () => {
    if (!token) return;
    setSaving(true);
    setSaveError(null);
    setSuccess(null);
    try {
      const full = mergeWithDefaults(settings as Partial<SiteSettings>);
      await updateSiteSettings(token, { ...full, marketPrices: local });
      await refetch();
      setSuccess('Prices saved. The Prices modal on the site will use these values.');
      setTimeout(() => setSuccess(null), 5000);
    } catch (e: unknown) {
      setSaveError(e instanceof Error ? e.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const items = local.priceItems ?? DEFAULT_PRICE_ITEMS;

  return (
    <Box sx={{ maxWidth: 720, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography sx={{ fontWeight: 950, fontSize: 24, color: '#0f172a' }}>Prices</Typography>
          <Typography sx={{ mt: 0.25, fontSize: 13, fontWeight: 700, color: '#64748b' }}>
            Edit the Prices modal and add products (Cocoa, Palm oil, etc.) with Local and World prices.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.25, flexWrap: 'wrap' }}>
          <Button variant="outlined" startIcon={<RefreshCw size={16} />} onClick={() => refetch()} disabled={loading} sx={{ borderRadius: 2, fontWeight: 900 }}>
            Refresh
          </Button>
          <Button component={Link} to="/" target="_blank" rel="noopener noreferrer" variant="outlined" startIcon={<ExternalLink size={16} />} sx={{ borderRadius: 2, fontWeight: 900 }}>
            View site
          </Button>
          <Button variant="contained" startIcon={<Save size={16} />} onClick={handleSave} disabled={saving} sx={{ borderRadius: 2, fontWeight: 950 }}>
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </Box>
      </Box>

      {error && (
        <Box sx={{ mb: 2, p: 1.5, borderRadius: 2, background: 'rgba(239,68,68,0.08)', color: '#991b1b', fontWeight: 800, fontSize: 13 }}>
          {error}
        </Box>
      )}
      {saveError && (
        <Box sx={{ mb: 2, p: 1.5, borderRadius: 2, background: 'rgba(239,68,68,0.08)', color: '#991b1b', fontWeight: 800, fontSize: 13 }}>
          {saveError}
        </Box>
      )}
      {success && (
        <Box sx={{ mb: 2, p: 1.5, borderRadius: 2, background: 'rgba(34,197,94,0.12)', color: '#166534', fontWeight: 800, fontSize: 13 }}>
          {success}
        </Box>
      )}

      <Card variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden', mb: 3 }}>
        <CardContent sx={{ '&:last-child': { pb: 3 } }}>
          <Typography sx={{ fontWeight: 900, fontSize: 16, color: '#0f172a', mb: 2 }}>Modal</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField size="small" label="Modal title" value={local.modalTitle} onChange={(e) => update({ modalTitle: e.target.value })} fullWidth />
            <TextField size="small" label="Modal subtitle" value={local.modalSubtitle} onChange={(e) => update({ modalSubtitle: e.target.value })} fullWidth placeholder="World vs Local market snapshot" />
          </Box>
          <Typography sx={{ fontWeight: 900, fontSize: 16, color: '#0f172a', mt: 3, mb: 2 }}>Explanation</Typography>
          <TextField
            size="small"
            label="Explanation text"
            value={local.explanationText}
            onChange={(e) => update({ explanationText: e.target.value })}
            fullWidth
            multiline
            rows={3}
            placeholder="Local price is averaged from…"
          />
          <TextField size="small" label="Currency" value={local.currency} onChange={(e) => update({ currency: e.target.value })} fullWidth sx={{ mt: 2 }} placeholder="FCFA" />
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <CardContent sx={{ '&:last-child': { pb: 3 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography sx={{ fontWeight: 900, fontSize: 16, color: '#0f172a' }}>Products</Typography>
            <Button startIcon={<Plus size={16} />} variant="outlined" size="small" onClick={addItem} sx={{ borderRadius: 2, fontWeight: 800 }}>
              Add product
            </Button>
          </Box>
          <Typography sx={{ fontSize: 13, color: '#64748b', fontWeight: 700, mb: 2 }}>
            Each product appears in the Prices modal with Local and World prices. Add Cocoa, Palm oil, or any other product.
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {items.map((it, index) => (
              <Box
                key={it.id}
                sx={{
                  border: '1px solid rgba(15,23,42,0.12)',
                  borderRadius: 2,
                  p: 2,
                  background: '#fafafa',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: 14, color: '#0f172a' }}>
                    {it.name || `Product ${index + 1}`}
                  </Typography>
                  <IconButton size="small" color="error" onClick={() => removeItem(index)} disabled={items.length <= 1}>
                    <Trash2 size={16} />
                  </IconButton>
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                  <TextField
                    size="small"
                    label="Product name"
                    value={it.name}
                    onChange={(e) => updateItem(index, { name: e.target.value })}
                    placeholder="e.g. Cocoa, Palm oil"
                    fullWidth
                  />
                  <TextField
                    size="small"
                    label="Unit (e.g. /1Kg, 35 liter of oil)"
                    value={it.unitLabel}
                    onChange={(e) => updateItem(index, { unitLabel: e.target.value })}
                    placeholder="/1Kg or 35 liter of oil"
                    fullWidth
                  />
                  <TextField
                    type="number"
                    size="small"
                    label="Local price"
                    value={it.localPrice == null ? '' : it.localPrice}
                    onChange={(e) => {
                      const v = e.target.value.trim();
                      updateItem(index, { localPrice: v === '' ? null : Math.max(0, parseInt(v, 10) || 0) });
                    }}
                    placeholder="Leave empty for N/A"
                    fullWidth
                  />
                  <TextField
                    type="number"
                    size="small"
                    label="World price"
                    value={it.worldPrice}
                    onChange={(e) => updateItem(index, { worldPrice: Math.max(0, parseInt(e.target.value, 10) || 0) })}
                    fullWidth
                  />
                  <TextField
                    size="small"
                    label="Local empty message (when no local price)"
                    value={it.localEmptyMessage ?? ''}
                    onChange={(e) => updateItem(index, { localEmptyMessage: e.target.value || undefined })}
                    placeholder="No local cocoa product yet"
                    fullWidth
                    sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}
                  />
                  <TextField
                    size="small"
                    label="World reference label (optional)"
                    value={it.worldReferenceLabel ?? ''}
                    onChange={(e) => updateItem(index, { worldReferenceLabel: e.target.value || undefined })}
                    placeholder="Using reference price"
                    fullWidth
                    sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
