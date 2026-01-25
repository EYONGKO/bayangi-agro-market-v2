export interface Review {
  id: string;
  productId: number;
  rating: number;
  title: string;
  body: string;
  author: string;
  createdAt: string;
}

type ReviewsByProductId = Record<string, Review[]>;

const STORAGE_KEY = 'reviews';

const safeParse = (value: string | null): ReviewsByProductId => {
  if (!value) return {};
  try {
    const parsed = JSON.parse(value) as unknown;
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as ReviewsByProductId;
    }
  } catch {
    return {};
  }
  return {};
};

const loadAll = (): ReviewsByProductId => {
  if (typeof window === 'undefined') return {};
  return safeParse(localStorage.getItem(STORAGE_KEY));
};

const saveAll = (data: ReviewsByProductId) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const getReviewsForProduct = (productId: number): Review[] => {
  const all = loadAll();
  return all[String(productId)] ?? [];
};

export const addReviewForProduct = (
  productId: number,
  input: Omit<Review, 'id' | 'productId' | 'createdAt'>
): Review => {
  const all = loadAll();
  const next: Review = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    productId,
    rating: Math.max(1, Math.min(5, Math.round(input.rating))),
    title: input.title.trim(),
    body: input.body.trim(),
    author: input.author.trim() || 'Anonymous',
    createdAt: new Date().toISOString()
  };

  const key = String(productId);
  const existing = all[key] ?? [];
  all[key] = [next, ...existing];
  saveAll(all);
  return next;
};

export const getReviewStatsForProduct = (productId: number) => {
  const reviews = getReviewsForProduct(productId);
  const count = reviews.length;
  const avg = count === 0 ? 0 : reviews.reduce((sum, r) => sum + r.rating, 0) / count;
  return { count, avg };
};
