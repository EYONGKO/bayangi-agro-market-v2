// Image storage API simulation
// In a real app, this would upload to a server, but for now we'll use base64 encoding

export interface StoredImage {
  id: string;
  name: string;
  type: string;
  size: number;
  data: string; // base64 encoded image data
  uploadedAt: string;
}

const IMAGE_STORAGE_KEY = 'local-roots-images';

// Convert file to base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

// Save image to storage
export const saveImage = async (file: File): Promise<StoredImage> => {
  try {
    // Convert file to base64
    const base64Data = await fileToBase64(file);
    
    // Create image object
    const image: StoredImage = {
      id: Date.now().toString(),
      name: file.name,
      type: file.type,
      size: file.size,
      data: base64Data,
      uploadedAt: new Date().toISOString()
    };
    
    // Get existing images
    const existingImages = getStoredImages();
    
    // Add new image
    const updatedImages = [...existingImages, image];
    
    // Save to localStorage
    localStorage.setItem(IMAGE_STORAGE_KEY, JSON.stringify(updatedImages));
    
    console.log('Image saved successfully:', image.name);
    return image;
  } catch (error) {
    console.error('Error saving image:', error);
    throw new Error('Failed to save image');
  }
};

// Get all stored images
export const getStoredImages = (): StoredImage[] => {
  try {
    const stored = localStorage.getItem(IMAGE_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading stored images:', error);
  }
  return [];
};

// Get image by ID
export const getImageById = (id: string): StoredImage | null => {
  const images = getStoredImages();
  return images.find(img => img.id === id) || null;
};

// Delete image by ID
export const deleteImage = (id: string): boolean => {
  try {
    const images = getStoredImages();
    const filteredImages = images.filter(img => img.id !== id);
    
    if (filteredImages.length === images.length) {
      return false; // Image not found
    }
    
    localStorage.setItem(IMAGE_STORAGE_KEY, JSON.stringify(filteredImages));
    console.log('Image deleted successfully:', id);
    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
};

// Get image URL for display
export const getImageUrl = (imageId: string): string => {
  // If it's a full URL, return as-is
  if (imageId.startsWith('http')) {
    return imageId;
  }
  
  // If it starts with / (backend path), prepend production backend URL
  if (imageId.startsWith('/')) {
    // Use production URL for deployed app, localhost for development
    const isProduction = import.meta.env.PROD || window.location.hostname !== 'localhost';
    const backendUrl = isProduction 
      ? 'https://bayangi-agro-market-backend-production.up.railway.app'
      : 'http://localhost:3001';
    
    return `${backendUrl}${imageId}`;
  }
  
  // Otherwise, try to find in localStorage
  const image = getImageById(imageId);
  return image ? image.data : '';
};

// Clean up unused images (images not referenced by any artisan)
export const cleanupUnusedImages = (usedImageIds: string[]): number => {
  const allImages = getStoredImages();
  const unusedImages = allImages.filter(img => !usedImageIds.includes(img.id));
  
  if (unusedImages.length > 0) {
    const remainingImages = allImages.filter(img => usedImageIds.includes(img.id));
    localStorage.setItem(IMAGE_STORAGE_KEY, JSON.stringify(remainingImages));
    console.log(`Cleaned up ${unusedImages.length} unused images`);
  }
  
  return unusedImages.length;
};
