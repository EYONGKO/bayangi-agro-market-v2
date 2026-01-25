export type CategoryRecord = {
  id: string;
  name: string;
};

const CATEGORIES_KEY = 'local-roots-categories-v1';

const defaultCategories: CategoryRecord[] = [
  { id: 'crafts', name: 'Crafts' },
  { id: 'food', name: 'Food' },
  { id: 'textiles', name: 'Textiles' },
  { id: 'art', name: 'Art' },
  { id: 'fashion', name: 'Fashion' },
  { id: 'home-garden', name: 'Home & Garden' },
  { id: 'beauty', name: 'Beauty' },
  { id: 'electronics', name: 'Electronics' },
  { id: 'others', name: 'Others' }
];

const canUseStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

function load(): CategoryRecord[] {
  if (!canUseStorage()) return defaultCategories;
  try {
    const raw = window.localStorage.getItem(CATEGORIES_KEY);
    if (!raw) return defaultCategories;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : defaultCategories;
  } catch {
    return defaultCategories;
  }
}

function save(categories: CategoryRecord[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
}

export function getAllCategories(): CategoryRecord[] {
  return load();
}

export function createCategory(input: { name: string }): CategoryRecord {
  const id = input.name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/\//g, '-')
    .replace(/[^a-z0-9-]/g, '');

  const all = load();
  if (all.some((c) => c.id === id)) {
    throw new Error('Category already exists');
  }
  const created: CategoryRecord = { id, name: input.name.trim() };
  const next = [created, ...all];
  save(next);
  return created;
}

export function updateCategory(id: string, input: { name: string }): CategoryRecord {
  const all = load();
  const idx = all.findIndex((c) => c.id === id);
  if (idx < 0) throw new Error('Category not found');
  const updated: CategoryRecord = { ...all[idx], name: input.name.trim() };
  const next = [...all];
  next[idx] = updated;
  save(next);
  return updated;
}

export function deleteCategory(id: string) {
  const next = load().filter((c) => c.id !== id);
  save(next);
}
