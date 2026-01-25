// Artisans data management
export interface Artisan {
  id: string;
  name: string;
  email: string;
  phone: string;
  community: string;
  specialty: string;
  rating: number;
  reviews: number;
  verified: boolean;
  avatar: string;
  avatarFile?: File;
  joinedDate: string;
  totalSales: number;
  bio: string;
}

// Initial artisans data
const initialArtisans: Artisan[] = [
  {
    id: '1',
    name: 'John Mbah',
    email: 'john.mbah@example.com',
    phone: '+237 123 456 789',
    community: 'Kendem',
    specialty: 'Vegetable Farming',
    rating: 4.8,
    reviews: 156,
    verified: true,
    avatar: '/avatars/john.jpg',
    joinedDate: '2024-01-15',
    totalSales: 25000,
    bio: 'Specialized in organic vegetable farming with over 10 years of experience.'
  },
  {
    id: '2',
    name: 'Mary Nkeng',
    email: 'mary.nkeng@example.com',
    phone: '+237 987 654 321',
    community: 'Mamfe',
    specialty: 'Poultry Farming',
    rating: 4.9,
    reviews: 203,
    verified: true,
    avatar: '/avatars/mary.jpg',
    joinedDate: '2024-02-20',
    totalSales: 35000,
    bio: 'Expert in poultry farming and egg production with sustainable practices.'
  },
  {
    id: '3',
    name: 'Peter Fon',
    email: 'peter.fon@example.com',
    phone: '+237 555 123 456',
    community: 'Membe',
    specialty: 'Rice Cultivation',
    rating: 4.7,
    reviews: 89,
    verified: false,
    avatar: '/avatars/peter.jpg',
    joinedDate: '2024-03-10',
    totalSales: 18000,
    bio: 'Traditional rice farmer using modern techniques for better yield.'
  }
];

// Local storage key
const ARTISANS_STORAGE_KEY = 'local-roots-artisans';

// Get artisans from localStorage
export const getArtisans = (): Artisan[] => {
  if (typeof window === 'undefined') return initialArtisans;
  
  try {
    const stored = localStorage.getItem(ARTISANS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading artisans from localStorage:', error);
  }
  
  return initialArtisans;
};

// Save artisans to localStorage
export const saveArtisans = (artisans: Artisan[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(ARTISANS_STORAGE_KEY, JSON.stringify(artisans));
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('artisansUpdated', { 
      detail: artisans 
    }));
  } catch (error) {
    console.error('Error saving artisans to localStorage:', error);
  }
};

// Add new artisan
export const addArtisan = (artisan: Omit<Artisan, 'id'>): Artisan => {
  const artisans = getArtisans();
  const newArtisan: Artisan = {
    ...artisan,
    id: Date.now().toString(),
    joinedDate: new Date().toISOString().split('T')[0],
    reviews: 0,
    totalSales: 0
  };
  
  const updatedArtisans = [...artisans, newArtisan];
  saveArtisans(updatedArtisans);
  return newArtisan;
};

// Update artisan
export const updateArtisan = (id: string, updates: Partial<Artisan>): Artisan | null => {
  const artisans = getArtisans();
  const index = artisans.findIndex(artisan => artisan.id === id);
  
  if (index === -1) return null;
  
  const updatedArtisan = { ...artisans[index], ...updates };
  const newArtisans = [...artisans];
  newArtisans[index] = updatedArtisan;
  
  saveArtisans(newArtisans);
  return updatedArtisan;
};

// Delete artisan
export const deleteArtisan = (id: string): boolean => {
  const artisans = getArtisans();
  const newArtisans = artisans.filter(artisan => artisan.id !== id);
  
  if (newArtisans.length === artisans.length) return false;
  
  saveArtisans(newArtisans);
  return true;
};

// Toggle artisan verification
export const toggleArtisanVerification = (id: string): boolean => {
  const artisan = updateArtisan(id, { verified: !getArtisans().find(a => a.id === id)?.verified });
  return artisan?.verified || false;
};
