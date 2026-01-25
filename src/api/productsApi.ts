import type { Product } from '../context/CartContext';

const API_BASE = (import.meta as any).env?.VITE_API_URL ?? '';

const PRODUCTS_CHANGED_EVENT = 'local-roots-products-changed';

export function notifyProductsChanged() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(PRODUCTS_CHANGED_EVENT));
}

export function subscribeProductsChanged(handler: () => void) {
  if (typeof window === 'undefined') return () => undefined;
  window.addEventListener(PRODUCTS_CHANGED_EVENT, handler);
  return () => window.removeEventListener(PRODUCTS_CHANGED_EVENT, handler);
}

type ProductRecord = {
  _id: string;
  name?: string;
  price?: number;
  description?: string;
  image?: string;
  category?: string;
  community?: string;
  vendor?: string;
  stock?: number;
  rating?: number;
  reviews?: number;
  likes?: number;
};

function stableNumericId(input: string): number {
  // 32-bit FNV-1a hash => stable number for wishlist/cart which currently use numeric ids.
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash);
}

function mapProduct(r: ProductRecord): Product {
  const id = stableNumericId(r._id);
  return {
    id,
    name: r.name || 'Untitled',
    price: Number(r.price || 0),
    description: r.description || '',
    image: r.image || 'https://via.placeholder.com/800x600?text=Product',
    category: r.category || 'Others',
    community: r.community || 'global',
    vendor: r.vendor || 'Local Roots',
    stock: r.stock,
    rating: r.rating,
    reviews: r.reviews,
    likes: r.likes
  };
}

export async function fetchAllProducts(): Promise<Product[]> {
  const res = await fetch(`${API_BASE}/api/products`);
  if (!res.ok) throw new Error('Failed to fetch products');
  const data = (await res.json()) as ProductRecord[];
  return data.map(mapProduct);
}
