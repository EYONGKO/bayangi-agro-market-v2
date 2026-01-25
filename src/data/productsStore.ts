import type { Product } from '../context/CartContext';

const STORAGE_KEY = 'local-roots-web-products-v1';

type StoredProduct = Product & {
  images?: string[];
  createdAt?: string;
};

const defaultProducts: StoredProduct[] = [
  {
    id: 1,
    name: 'Traditional Basket',
    price: 15000,
    description: 'Handmade traditional basket crafted by local artisans using natural materials.',
    category: 'Crafts',
    vendor: 'Local Artisan',
    sellerId: 'local-artisan',
    sellerPhone: '+237650000001',
    sellerWhatsApp: '+237650000001',
    community: 'kendem',
    image: 'https://via.placeholder.com/800x600?text=Traditional+Basket',
    images: ['https://via.placeholder.com/800x600?text=Traditional+Basket'],
    stock: 10,
    rating: 4.8,
    reviews: 127,
    likes: 45,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Fresh Cocoa Beans',
    price: 8000,
    description: 'Freshly harvested cocoa beans sourced directly from community farmers.',
    category: 'Food',
    vendor: 'Farm Fresh',
    sellerId: 'farm-fresh',
    sellerPhone: '+237650000002',
    sellerWhatsApp: '+237650000002',
    community: 'kendem',
    image: 'https://via.placeholder.com/800x600?text=Fresh+Cocoa+Beans',
    images: ['https://via.placeholder.com/800x600?text=Fresh+Cocoa+Beans'],
    stock: 20,
    rating: 4.7,
    reviews: 18,
    likes: 12,
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    name: 'Wooden Carving',
    price: 25000,
    description: 'Detailed hand-carved wooden artwork made with traditional techniques.',
    category: 'Art',
    vendor: 'Master Craftsman',
    sellerId: 'master-craftsman',
    sellerPhone: '+237650000003',
    sellerWhatsApp: '+237650000003',
    community: 'kendem',
    image: 'https://via.placeholder.com/800x600?text=Wooden+Carving',
    images: ['https://via.placeholder.com/800x600?text=Wooden+Carving'],
    stock: 5,
    rating: 4.9,
    reviews: 25,
    likes: 89,
    createdAt: new Date().toISOString()
  },
  {
    id: 4,
    name: 'Palm Oil',
    price: 5000,
    description: 'Pure palm oil produced locally with careful processing for quality.',
    category: 'Food',
    vendor: 'Oil Producers',
    community: 'kendem',
    image: 'https://via.placeholder.com/800x600?text=Palm+Oil',
    images: ['https://via.placeholder.com/800x600?text=Palm+Oil'],
    stock: 12,
    rating: 4.6,
    reviews: 20,
    likes: 34,
    createdAt: new Date().toISOString()
  },
  {
    id: 5,
    name: 'Handwoven Textile',
    price: 18000,
    description: 'Beautiful handwoven textile featuring patterns inspired by local culture.',
    category: 'Textiles',
    vendor: 'Textile Guild',
    community: 'kendem',
    image: 'https://via.placeholder.com/800x600?text=Handwoven+Textile',
    images: ['https://via.placeholder.com/800x600?text=Handwoven+Textile'],
    stock: 8,
    rating: 4.8,
    reviews: 12,
    likes: 56,
    createdAt: new Date().toISOString()
  },
  {
    id: 6,
    name: 'Pottery Set',
    price: 12000,
    description: 'A handcrafted pottery set perfect for everyday use and gifting.',
    category: 'Crafts',
    vendor: 'Clay Masters',
    community: 'kendem',
    image: 'https://via.placeholder.com/800x600?text=Pottery+Set',
    images: ['https://via.placeholder.com/800x600?text=Pottery+Set'],
    stock: 6,
    rating: 4.5,
    reviews: 30,
    createdAt: new Date().toISOString()
  },
  {
    id: 101,
    name: 'African Art Sculpture',
    price: 45000,
    description: 'Handcrafted wooden sculpture from West Africa',
    image: 'https://via.placeholder.com/300x200?text=African+Art',
    category: 'Art',
    community: 'global',
    vendor: 'African Artisans',
    sellerId: 'african-artisans',
    sellerPhone: '+237650000101',
    sellerWhatsApp: '+237650000101',
    stock: 3,
    rating: 4.9,
    reviews: 25,
    createdAt: new Date().toISOString()
  },
  {
    id: 102,
    name: 'Organic Coffee Beans',
    price: 12000,
    description: 'Premium organic coffee from Ethiopian highlands',
    image: 'https://via.placeholder.com/300x200?text=Organic+Coffee',
    category: 'Food',
    community: 'global',
    vendor: 'Coffee Masters',
    stock: 15,
    rating: 4.7,
    reviews: 18,
    createdAt: new Date().toISOString()
  },
  {
    id: 103,
    name: 'Handwoven Textile',
    price: 25000,
    description: 'Traditional handwoven textile with unique patterns',
    image: 'https://via.placeholder.com/300x200?text=Handwoven+Textile',
    category: 'Textiles',
    community: 'global',
    vendor: 'Textile Weavers',
    stock: 8,
    rating: 4.8,
    reviews: 12,
    createdAt: new Date().toISOString()
  },
  {
    id: 104,
    name: 'Ceramic Pottery',
    price: 18000,
    description: 'Beautiful ceramic pottery with traditional designs',
    image: 'https://via.placeholder.com/300x200?text=Ceramic+Pottery',
    category: 'Crafts',
    community: 'global',
    vendor: 'Pottery Studio',
    sellerId: 'pottery-studio',
    sellerPhone: '+237650000104',
    sellerWhatsApp: '+237650000104',
    stock: 12,
    rating: 4.6,
    reviews: 20,
    createdAt: new Date().toISOString()
  },
  {
    id: 105,
    name: 'Handmade Jewelry',
    price: 35000,
    description: 'Exquisite handmade jewelry from local artisans',
    image: 'https://via.placeholder.com/300x200?text=Handmade+Jewelry',
    category: 'Crafts',
    community: 'global',
    vendor: 'Jewelry Makers',
    stock: 6,
    rating: 4.9,
    reviews: 15,
    createdAt: new Date().toISOString()
  },
  {
    id: 106,
    name: 'Spice Collection',
    price: 8000,
    description: 'Premium spice collection from around the world',
    image: 'https://via.placeholder.com/300x200?text=Spice+Collection',
    category: 'Food',
    community: 'global',
    vendor: 'Spice Traders',
    stock: 20,
    rating: 4.5,
    reviews: 30,
    createdAt: new Date().toISOString()
  }
];

const canUseStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const safeParseJson = (value: string | null): StoredProduct[] | null => {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

export const getAllProducts = (): StoredProduct[] => {
  const stored = canUseStorage() ? safeParseJson(window.localStorage.getItem(STORAGE_KEY)) : null;
  return stored ?? defaultProducts;
};

export const getProductsByCommunity = (communityId: string): StoredProduct[] => {
  return getAllProducts().filter(p => p.community === communityId);
};

export const getProductById = (id: number): StoredProduct | undefined => {
  return getAllProducts().find(p => p.id === id);
};

export const addProduct = (product: Omit<StoredProduct, 'id' | 'createdAt'>): StoredProduct => {
  const all = getAllProducts();
  const nextId = all.reduce((max, p) => Math.max(max, p.id), 0) + 1;

  const newProduct: StoredProduct = {
    ...product,
    id: nextId,
    createdAt: new Date().toISOString()
  };

  const next = [newProduct, ...all];
  if (canUseStorage()) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  return newProduct;
};
