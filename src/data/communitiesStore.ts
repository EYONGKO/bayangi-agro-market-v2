export type CommunityRecord = {
  id: string;
  name: string;
  description?: string;
  image?: string;
};

const COMMUNITIES_KEY = 'local-roots-communities-v1';

const defaultCommunities: CommunityRecord[] = [
  { id: 'kendem', name: 'Kendem' },
  { id: 'mamfe', name: 'Mamfe' },
  { id: 'membe', name: 'Membe' },
  { id: 'widikum', name: 'Widikum' },
  { id: 'fonjo', name: 'Fonjo' },
  { id: 'moshie-kekpoti', name: 'Moshie/Kekpoti' }
];

const canUseStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

function load(): CommunityRecord[] {
  if (!canUseStorage()) return defaultCommunities;
  try {
    const raw = window.localStorage.getItem(COMMUNITIES_KEY);
    if (!raw) return defaultCommunities;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : defaultCommunities;
  } catch {
    return defaultCommunities;
  }
}

function save(communities: CommunityRecord[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(COMMUNITIES_KEY, JSON.stringify(communities));
}

export function getAllCommunities(): CommunityRecord[] {
  return load();
}

export function createCommunity(input: { name: string; description?: string; image?: string }): CommunityRecord {
  const id = input.name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/\//g, '-')
    .replace(/[^a-z0-9-]/g, '');

  const all = load();
  if (all.some((c) => c.id === id)) {
    throw new Error('Community already exists');
  }

  const created: CommunityRecord = {
    id,
    name: input.name.trim(),
    description: input.description?.trim() || undefined,
    image: input.image?.trim() || undefined
  };

  const next = [created, ...all];
  save(next);
  return created;
}

export function updateCommunity(id: string, input: { name: string; description?: string; image?: string }): CommunityRecord {
  const all = load();
  const idx = all.findIndex((c) => c.id === id);
  if (idx < 0) throw new Error('Community not found');

  const updated: CommunityRecord = {
    ...all[idx],
    name: input.name.trim(),
    description: input.description?.trim() || undefined,
    image: input.image?.trim() || undefined
  };

  const next = [...all];
  next[idx] = updated;
  save(next);
  return updated;
}

export function deleteCommunity(id: string) {
  const next = load().filter((c) => c.id !== id);
  save(next);
}
