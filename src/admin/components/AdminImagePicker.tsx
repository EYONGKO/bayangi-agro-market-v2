import { useState, useRef } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { ImagePlus, Trash2 } from 'lucide-react';
import { uploadImage } from '../../api/adminApi';

export interface AdminImagePickerProps {
  token: string;
  value: string;
  onChange: (url: string) => void;
  label?: string;
  disabled?: boolean;
  /** Compact layout for use in dense forms (e.g. Hero slides). */
  compact?: boolean;
}

export default function AdminImagePicker({
  token,
  value,
  onChange,
  label = 'Image',
  disabled = false,
  compact = false,
}: AdminImagePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file?.type.startsWith('image/')) {
      setError('Please select an image file (JPEG, PNG, WebP, GIF).');
      return;
    }
    setError(null);
    setUploading(true);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(String(r.result));
        r.onerror = () => reject(new Error('Failed to read file'));
        r.readAsDataURL(file);
      });
      const { url } = await uploadImage(token, { dataUrl, filename: file.name });
      onChange(url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const clear = () => onChange('');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {label && (
        <Typography sx={{ fontSize: 13, fontWeight: 800, color: '#64748b' }}>{label}</Typography>
      )}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
        <Button
          variant="outlined"
          component="label"
          disabled={disabled || uploading}
          startIcon={<ImagePlus size={16} />}
          sx={{ borderRadius: 2, fontWeight: 800 }}
        >
          {uploading ? 'Uploading…' : 'Choose image'}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleFile}
          />
        </Button>
        {value && (
          <>
            <Box
              component="img"
              src={value}
              alt=""
              sx={{
                width: compact ? 56 : 80,
                height: compact ? 56 : 80,
                borderRadius: 2,
                objectFit: 'cover',
                border: '1px solid rgba(15,23,42,0.12)',
              }}
            />
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={clear}
              disabled={disabled}
              startIcon={<Trash2 size={14} />}
              sx={{ borderRadius: 2, fontWeight: 800 }}
            >
              Remove
            </Button>
          </>
        )}
      </Box>
      {error && (
        <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#991b1b' }}>{error}</Typography>
      )}
    </Box>
  );
}
