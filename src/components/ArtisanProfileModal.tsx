import { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Box, 
  Typography, 
  Chip,
  IconButton
} from '@mui/material';
import { 
  X, 
  MapPin, 
  Star, 
  Phone, 
  Mail, 
  Calendar, 
  Award, 
  Package,
  DollarSign,
  Maximize2
} from 'lucide-react';
import { theme } from '../theme/colors';
import type { Artisan } from '../data/artisansStore';

// API_BASE for consistent endpoint usage
const API_BASE = window.location.hostname === 'localhost' 
  ? 'http://localhost:8080' 
  : 'https://bayangi-agro-market-backend-production.up.railway.app';

interface ArtisanProfileModalProps {
  artisan: Artisan | null;
  open: boolean;
  onClose: () => void;
}

export default function ArtisanProfileModal({ artisan, open, onClose }: ArtisanProfileModalProps) {
  const [imageViewerOpen, setImageViewerOpen] = useState(false);

  const handleImageClick = () => {
    if (artisan?.avatar) {
      setImageViewerOpen(true);
    }
  };

  const handleImageViewerClose = () => {
    setImageViewerOpen(false);
  };

  if (!artisan) return null;

  return (
    <>
      {/* Verified Badge - Top Right Corner */}
      {artisan.verified && (
        <Box sx={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) translateX(320px) translateY(-240px)',
          zIndex: 1001
        }}>
          <Chip 
            icon={<Award size={12} />}
            label="Verified"
            size="small"
            sx={{ 
              bgcolor: '#16a34a',
              color: 'white',
              '& .MuiChip-label': { color: 'white' },
              fontWeight: 'bold',
              boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
              transform: 'scale(1.1)',
              fontSize: '0.75rem'
            }}
          />
        </Box>
      )}
      
      {/* Close Button - Top Left Corner */}
      <IconButton
        onClick={onClose}
        sx={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) translateX(-320px) translateY(-240px)',
          bgcolor: 'rgba(255,255,255,0.95)',
          '&:hover': { bgcolor: 'rgba(255,255,255,1)' },
          zIndex: 1000,
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          width: 40,
          height: 40
        }}
      >
        <X size={20} />
      </IconButton>
      
      <Dialog 
        open={open} 
        onClose={onClose} 
        maxWidth="md" 
        fullWidth
        sx={{
          '& .MuiDialog-container': {
            alignItems: 'center'
          },
          '& .MuiPaper-root': {
            margin: '24px',
            maxWidth: '800px'
          }
        }}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            overflow: 'visible',
            border: `2px solid ${theme.colors.primary.main}`,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
          }
        }}
      >
        <DialogTitle sx={{ 
          p: 0, 
          position: 'relative',
          height: '300px',
          bgcolor: theme.colors.primary.background
        }}>
          {/* Full Size Image Background */}
          <Box sx={{ 
            position: 'relative',
            height: '100%',
            width: '100%',
            overflow: 'hidden',
            cursor: artisan.avatar ? 'pointer' : 'default'
          }} onClick={handleImageClick}>
            {artisan.avatar ? (
              <>
                <img
                  src={(() => {
                    if (!artisan.avatar) return '';
                    // Handle base64 images (new approach)
                    if (artisan.avatar.startsWith('data:')) return artisan.avatar;
                    // Handle HTTP URLs (old approach)
                    if (artisan.avatar.startsWith('http')) return artisan.avatar;
                    // Handle relative paths (old approach)
                    if (artisan.avatar.startsWith('/')) return `${API_BASE}${artisan.avatar}`;
                    // Handle filenames (old approach)
                    return `${API_BASE}/uploads/${artisan.avatar}`;
                  })()}
                  alt={artisan.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                {/* Maximize Icon Overlay */}
                <Box sx={{
                  position: 'absolute',
                  bottom: '16px',
                  right: '16px',
                  bgcolor: 'rgba(0,0,0,0.6)',
                  borderRadius: '50%',
                  p: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0.8,
                  transition: 'opacity 0.2s'
                }}>
                  <Maximize2 size={16} color="white" />
                </Box>
              </>
            ) : (
              <Box sx={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, #2d5016 0%, #4a7c2e 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold' }}>
                  {artisan.name.charAt(0)}
                </Typography>
              </Box>
            )}
            
            {/* Overlay Gradient */}
            <Box sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '60%',
              background: 'linear-gradient(to top, rgba(45, 80, 22, 0.9) 0%, transparent 100%)',
              zIndex: 1
            }} />
            
            {/* Artisan Info Overlay */}
            <Box sx={{
              position: 'absolute',
              bottom: '24px',
              left: '24px',
              right: '24px',
              color: 'white',
              zIndex: 2
            }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                {artisan.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <MapPin size={16} />
                <Typography variant="body1">{artisan.community}</Typography>
              </Box>
            </Box>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ p: 3, bgcolor: theme.colors.primary.background }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 3 }}>
            {/* Left Column - Basic Info */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ 
                p: 2, 
                border: `2px solid ${theme.colors.primary.light}`, 
                borderRadius: 2,
                bgcolor: 'white'
              }}>
                <Typography variant="subtitle2" sx={{ mb: 2, color: theme.colors.primary.main, fontWeight: 'bold' }}>
                  Contact Information
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Mail size={16} style={{ color: theme.colors.primary.main }} />
                  <Typography variant="body2">{artisan.email}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Phone size={16} style={{ color: theme.colors.primary.main }} />
                  <Typography variant="body2">{artisan.phone}</Typography>
                </Box>
              </Box>

              <Box sx={{ 
                p: 2, 
                border: `2px solid ${theme.colors.primary.light}`, 
                borderRadius: 2,
                bgcolor: 'white'
              }}>
                <Typography variant="subtitle2" sx={{ mb: 2, color: theme.colors.primary.main, fontWeight: 'bold' }}>
                  Professional Details
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Package size={16} style={{ color: theme.colors.primary.main }} />
                  <Typography variant="body2">{artisan.specialty}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Calendar size={16} style={{ color: theme.colors.primary.main }} />
                  <Typography variant="body2">Joined {artisan.joinedDate}</Typography>
                </Box>
              </Box>
            </Box>

            {/* Right Column - Stats and Bio */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ 
                p: 2, 
                border: `2px solid ${theme.colors.primary.light}`, 
                borderRadius: 2,
                bgcolor: 'white'
              }}>
                <Typography variant="subtitle2" sx={{ mb: 2, color: theme.colors.primary.main, fontWeight: 'bold' }}>
                  Performance Metrics
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                  <Box sx={{ flex: 1, textAlign: 'center', p: 2, bgcolor: theme.colors.primary.background, borderRadius: 1, border: `1px solid ${theme.colors.primary.light}` }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
                      <Star size={16} style={{ color: '#fbbf24' }} />
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.colors.primary.main }}>
                        {artisan.rating}
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: theme.colors.primary.dark }}>
                      Rating ({artisan.reviews} reviews)
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1, textAlign: 'center', p: 2, bgcolor: theme.colors.primary.background, borderRadius: 1, border: `1px solid ${theme.colors.primary.light}` }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
                      <DollarSign size={16} style={{ color: '#16a34a' }} />
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.colors.primary.main }}>
                        {artisan.totalSales.toLocaleString()}
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: theme.colors.primary.dark }}>
                      Total Sales (CFA)
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ 
                p: 2, 
                border: `2px solid ${theme.colors.primary.light}`, 
                borderRadius: 2, 
                flexGrow: 1,
                bgcolor: 'white'
              }}>
                <Typography variant="subtitle2" sx={{ mb: 2, color: theme.colors.primary.main, fontWeight: 'bold' }}>
                  About {artisan.name}
                </Typography>
                <Typography variant="body2" sx={{ lineHeight: 1.6, color: theme.colors.neutral[700] }}>
                  {artisan.bio}
                </Typography>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 0, bgcolor: theme.colors.primary.background }}>
          <Button 
            onClick={onClose} 
            variant="outlined"
            sx={{ 
              borderColor: theme.colors.primary.main,
              color: theme.colors.primary.main,
              '&:hover': { 
                borderColor: theme.colors.primary.dark,
                color: theme.colors.primary.dark,
                bgcolor: 'rgba(45, 80, 22, 0.04)'
              }
            }}
          >
            Close
          </Button>
          <Button 
            variant="contained" 
            sx={{ 
              bgcolor: theme.colors.primary.main,
              color: 'white',
              '&:hover': { 
                bgcolor: theme.colors.primary.dark
              }
            }}
          >
            Contact Artisan
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Full Image Viewer Modal */}
      <Dialog 
        open={imageViewerOpen} 
        onClose={handleImageViewerClose} 
        maxWidth="lg" 
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'black',
            border: 'none',
            borderRadius: '8px',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ 
          p: 0, 
          position: 'relative',
          minHeight: '80vh',
          bgcolor: 'black'
        }}>
          {/* Close Button */}
          <IconButton
            onClick={handleImageViewerClose}
            sx={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              bgcolor: 'rgba(255,255,255,0.9)',
              '&:hover': { bgcolor: 'rgba(255,255,255,1)' },
              zIndex: 1000
            }}
          >
            <X size={24} />
          </IconButton>
          
          {/* Full Size Image */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            width: '100%',
            p: 2
          }}>
            {artisan?.avatar && (
              <img
                src={(() => {
                  if (!artisan.avatar) return '';
                  // Handle base64 images (new approach)
                  if (artisan.avatar.startsWith('data:')) return artisan.avatar;
                  // Handle HTTP URLs (old approach)
                  if (artisan.avatar.startsWith('http')) return artisan.avatar;
                  // Handle relative paths (old approach)
                  if (artisan.avatar.startsWith('/')) return `${API_BASE}${artisan.avatar}`;
                  // Handle filenames (old approach)
                  return `${API_BASE}/uploads/${artisan.avatar}`;
                })()}
                alt={artisan.name}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain'
                }}
              />
            )}
          </Box>
        </DialogTitle>
      </Dialog>
    </>
  );
}
