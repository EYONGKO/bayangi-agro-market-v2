import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

interface WishlistContextType {
  wishlistIds: number[];
  addToWishlist: (productId: number) => void;
  removeFromWishlist: (productId: number) => void;
  toggleWishlist: (productId: number) => void;
  isWishlisted: (productId: number) => boolean;
  clearWishlist: () => void;
  getTotalWishlisted: () => number;
}

const STORAGE_KEY = 'wishlist';

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

interface WishlistProviderProps {
  children: ReactNode;
}

export const WishlistProvider = ({ children }: WishlistProviderProps) => {
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        setWishlistIds(parsed.filter((x) => typeof x === 'number'));
      }
    } catch (error) {
      console.error('Error loading wishlist from storage:', error);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  const addToWishlist = (productId: number) => {
    setWishlistIds((prev) => (prev.includes(productId) ? prev : [productId, ...prev]));
  };

  const removeFromWishlist = (productId: number) => {
    setWishlistIds((prev) => prev.filter((id) => id !== productId));
  };

  const toggleWishlist = (productId: number) => {
    setWishlistIds((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [productId, ...prev]));
  };

  const isWishlisted = (productId: number) => wishlistIds.includes(productId);

  const clearWishlist = () => setWishlistIds([]);

  const getTotalWishlisted = () => wishlistIds.length;

  const value = useMemo<WishlistContextType>(
    () => ({
      wishlistIds,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      isWishlisted,
      clearWishlist,
      getTotalWishlisted
    }),
    [wishlistIds]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
