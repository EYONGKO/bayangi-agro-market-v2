export type UserProfile = {
  name: string;
  email: string;
  phone?: string;
  verifiedSeller?: boolean;
  sellerId?: string;
  role: 'buyer' | 'seller' | 'both';
};

const PROFILE_KEY = 'local-roots-profile-v1';

const defaultProfile: UserProfile = {
  name: 'Local Roots Seller',
  email: 'seller@example.com',
  phone: '+237650000001',
  verifiedSeller: true,
  sellerId: 'local-artisan',
  role: 'both'
};

const canUseStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

export function loadProfile(): UserProfile {
  if (!canUseStorage()) return defaultProfile;
  try {
    const raw = window.localStorage.getItem(PROFILE_KEY);
    if (!raw) return defaultProfile;
    const parsed = JSON.parse(raw);
    return parsed ?? defaultProfile;
  } catch {
    return defaultProfile;
  }
}

export function saveProfile(profile: UserProfile) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

