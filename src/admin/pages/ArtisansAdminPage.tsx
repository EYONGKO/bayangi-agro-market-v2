import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, IconButton, Chip, Avatar, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Edit, Trash2, Plus, Star, MapPin, Award, Image as ImageIcon, Upload } from 'lucide-react';
import { getArtisans, saveArtisans, addArtisan, updateArtisan, deleteArtisan, toggleArtisanVerification } from '../../data/artisansStore';
import { saveImage, getImageUrl } from '../../data/imageStorage';
import type { Artisan } from '../../data/artisansStore';

const communities = ['Kendem', 'Mamfe', 'Membe', 'Widikum', 'Fonjo', 'Moshie/Kekpoti', 'Bamenda', 'Buea', 'Douala', 'Yaoundé', 'Kumba', 'Limbe'];
const specialties = ['Vegetable Farming', 'Poultry Farming', 'Rice Cultivation', 'Fruit Farming', 'Livestock', 'Dairy Products', 'Honey Production', 'Fish Farming'];

export default function ArtisansAdminPage() {
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingArtisan, setEditingArtisan] = useState<Artisan | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    community: '',
    specialty: '',
    bio: '',
    rating: 4.0,
    verified: false,
    avatar: '',
    avatarFile: null as File | null
  });

  // Load artisans from store on component mount
  useEffect(() => {
    setArtisans(getArtisans());
  }, []);

  // Listen for artisans updates from other components
  useEffect(() => {
    const handleArtisansUpdate = (event: CustomEvent) => {
      setArtisans(event.detail);
    };

    window.addEventListener('artisansUpdated', handleArtisansUpdate as EventListener);
    
    return () => {
      window.removeEventListener('artisansUpdated', handleArtisansUpdate as EventListener);
    };
  }, []);

  const handleAddArtisan = () => {
    setEditingArtisan(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      community: '',
      specialty: '',
      bio: '',
      rating: 4.0,
      verified: false,
      avatar: '',
      avatarFile: null
    });
    setOpenDialog(true);
  };

  const handleEditArtisan = (artisan: Artisan) => {
    setEditingArtisan(artisan);
    setFormData({
      name: artisan.name,
      email: artisan.email,
      phone: artisan.phone,
      community: artisan.community,
      specialty: artisan.specialty,
      bio: artisan.bio,
      rating: artisan.rating,
      verified: artisan.verified,
      avatar: artisan.avatar,
      avatarFile: artisan.avatarFile || null
    });
    setOpenDialog(true);
  };

  const handleDeleteArtisan = (id: string) => {
    if (window.confirm('Are you sure you want to delete this artisan?')) {
      const success = deleteArtisan(id);
      if (success) {
        setArtisans(getArtisans());
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('Starting image upload for file:', file.name, 'size:', file.size, 'type:', file.type);
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file (JPEG, PNG, etc.)');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image file size should be less than 5MB');
        return;
      }
      
      try {
        console.log('Saving image to storage...');
        
        // Save image using the real image storage API
        const savedImage = await saveImage(file);
        
        console.log('Image saved successfully with ID:', savedImage.id);
        console.log('Image URL:', savedImage.data.substring(0, 50) + '...');
        
        setFormData({ 
          ...formData, 
          avatar: savedImage.id, // Store the image ID instead of blob URL
          avatarFile: file 
        });
        
        console.log('Form data updated with image ID:', savedImage.id);
        alert('Image uploaded successfully!');
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Error uploading image. Please try again.');
      }
    } else {
      console.log('No file selected');
    }
  };

  const handleRemoveImage = () => {
    // Clean up the image ID if it exists
    if (formData.avatar) {
      console.log('Removing image:', formData.avatar);
    }
    setFormData({ 
      ...formData, 
      avatar: '',
      avatarFile: null 
    });
  };

  const handleSaveArtisan = () => {
    console.log('Saving artisan data:', formData);
    console.log('Avatar ID:', formData.avatar);
    console.log('Avatar File:', formData.avatarFile?.name);
    
    if (editingArtisan) {
      // Update existing artisan
      console.log('Updating existing artisan with ID:', editingArtisan.id);
      const updatedArtisan = updateArtisan(editingArtisan.id, formData);
      if (updatedArtisan) {
        console.log('Artisan updated successfully');
        setArtisans(getArtisans());
      } else {
        console.error('Failed to update artisan');
      }
    } else {
      // Add new artisan
      console.log('Adding new artisan');
      const newArtisan = addArtisan(formData);
      if (newArtisan) {
        console.log('New artisan added successfully with ID:', newArtisan.id);
        setArtisans(getArtisans());
      } else {
        console.error('Failed to add new artisan');
      }
    }
    
    // No need to clean up blob URLs since we're using image IDs
    console.log('Artisan saved successfully');
    setOpenDialog(false);
    console.log('Dialog closed');
  };

  const handleToggleVerified = (id: string) => {
    toggleArtisanVerification(id);
    setArtisans(getArtisans());
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1f2937' }}>
          Top Artisans Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={handleAddArtisan}
          sx={{ backgroundColor: '#10b981', '&:hover': { backgroundColor: '#059669' } }}
        >
          Add Artisan
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f9fafb' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Artisan</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Contact</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Community</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Specialty</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Rating</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Sales</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {artisans.map((artisan) => (
              <TableRow key={artisan.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar src={artisan.avatar ? getImageUrl(artisan.avatar) : ''} sx={{ width: 40, height: 40 }}>
                      {artisan.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {artisan.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Joined {artisan.joinedDate}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{artisan.email}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {artisan.phone}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    icon={<MapPin style={{ fontSize: 16 }} />}
                    label={artisan.community}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{artisan.specialty}</Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Star style={{ fontSize: 16, color: '#fbbf24' }} />
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {artisan.rating}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ({artisan.reviews})
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {artisan.totalSales.toLocaleString()} CFA
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip
                      label={artisan.verified ? 'Verified' : 'Pending'}
                      color={artisan.verified ? 'success' : 'warning'}
                      size="small"
                      onClick={() => handleToggleVerified(artisan.id)}
                      sx={{ cursor: 'pointer' }}
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleEditArtisan(artisan)}
                      sx={{ color: '#3b82f6' }}
                    >
                      <Edit fontSize={16} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteArtisan(artisan.id)}
                      sx={{ color: '#ef4444' }}
                    >
                      <Trash2 fontSize={16} />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingArtisan ? 'Edit Artisan' : 'Add New Artisan'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gap: 2, pt: 1 }}>
            <TextField
              label="Name"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <TextField
              label="Phone"
              fullWidth
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>Community</InputLabel>
              <Select
                value={formData.community}
                label="Community"
                onChange={(e) => setFormData({ ...formData, community: e.target.value })}
              >
                {communities.map((community) => (
                  <MenuItem key={community} value={community}>
                    {community}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Specialty</InputLabel>
              <Select
                value={formData.specialty}
                label="Specialty"
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
              >
                {specialties.map((specialty) => (
                  <MenuItem key={specialty} value={specialty}>
                    {specialty}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Bio"
              multiline
              rows={3}
              fullWidth
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
            <TextField
              label="Rating"
              type="number"
              inputProps={{ min: 0, max: 5, step: 0.1 }}
              fullWidth
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
            />
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Artisan Image</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  src={formData.avatar ? getImageUrl(formData.avatar) : ''}
                  sx={{ width: 80, height: 80 }}
                >
                  {formData.name.charAt(0) || 'A'}
                </Avatar>
                <Box>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                    id="artisan-image-upload"
                  />
                  <label htmlFor="artisan-image-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<Upload size={18} />}
                      sx={{ cursor: 'pointer' }}
                    >
                      Upload Image
                    </Button>
                  </label>
                  {formData.avatar && (
                    <Button
                      variant="text"
                      size="small"
                      onClick={handleRemoveImage}
                      sx={{ color: '#ef4444' }}
                    >
                      Remove
                    </Button>
                  )}
                  {formData.avatar && (
                    <Typography variant="caption" color="text.secondary">
                      {formData.avatarFile?.name || 'Image uploaded'}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveArtisan} variant="contained" sx={{ backgroundColor: '#10b981' }}>
            {editingArtisan ? 'Update' : 'Add'} Artisan
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
