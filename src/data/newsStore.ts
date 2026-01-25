export type NewsArticle = {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  author: string;
  date: string;
  tags: string[];
  content: string[];
};

const NEWS_KEY = 'local-roots-news-v1';

const canUseStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

function load(): NewsArticle[] {
  if (!canUseStorage()) return newsArticles;
  try {
    const raw = window.localStorage.getItem(NEWS_KEY);
    if (!raw) return newsArticles;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : newsArticles;
  } catch {
    return newsArticles;
  }
}

function save(items: NewsArticle[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(NEWS_KEY, JSON.stringify(items));
}

export function getAllNewsArticles(): NewsArticle[] {
  return load();
}

export function createNewsArticle(input: Omit<NewsArticle, 'id'>): NewsArticle {
  const all = load();
  const nextId = all.reduce((max, a) => Math.max(max, a.id), 0) + 1;
  const created: NewsArticle = { ...input, id: nextId };
  const next = [created, ...all];
  save(next);
  return created;
}

export function updateNewsArticle(id: number, patch: Partial<Omit<NewsArticle, 'id'>>): NewsArticle {
  const all = load();
  const idx = all.findIndex((a) => a.id === id);
  if (idx < 0) throw new Error('Article not found');
  const updated: NewsArticle = { ...all[idx], ...patch, id: all[idx].id };
  const next = [...all];
  next[idx] = updated;
  save(next);
  return updated;
}

export function deleteNewsArticle(id: number) {
  const next = load().filter((a) => a.id !== id);
  save(next);
}

export const NEWS_CATEGORIES = ['All', 'Community Success', 'Agriculture', 'Platform Updates', 'Awards', 'Business'] as const;

export const newsArticles: NewsArticle[] = [
  {
    id: 1,
    title: 'Kendem Artisans Expand Global Reach with New Collection',
    excerpt:
      'Local craftspeople from Kendem community are seeing unprecedented success with their handmade products reaching markets across three continents.',
    category: 'Community Success',
    image: '/kendem-hero.jpg',
    author: 'Sarah Johnson',
    date: 'Jan 20, 2026',
    tags: ['Kendem', 'Success Story', 'Global Market'],
    content: [
      'Kendem artisans are celebrating a breakthrough season as their handcrafted goods gain traction in international markets.',
      'Through improved product presentation, community training, and easier access to online buyers, creators have increased sales while preserving cultural craftsmanship.',
      'Local Roots continues to support these communities by expanding logistics partnerships and highlighting verified vendors across the platform.',
    ],
  },
  {
    id: 2,
    title: 'Sustainable Farming Practices Transform Mamfe Agriculture',
    excerpt:
      'Farmers in Mamfe are implementing innovative sustainable practices that are increasing yields while protecting the environment.',
    category: 'Agriculture',
    image: '/mamfe-hero.jpg',
    author: 'Michael Chen',
    date: 'Jan 18, 2026',
    tags: ['Mamfe', 'Sustainability', 'Farming'],
    content: [
      'In Mamfe, farmers are adopting soil health programs, composting, and improved water management to stabilize yields year-round.',
      'These changes reduce costs and make supply more reliable for local and international buyers.',
      'The next phase focuses on cooperative packaging and quality grading to secure better pricing for producers.',
    ],
  },
  {
    id: 3,
    title: 'New Marketplace Features Make Selling Easier for Local Vendors',
    excerpt:
      'Local Roots platform introduces new tools designed to help artisans and farmers streamline their online sales and reach more customers.',
    category: 'Platform Updates',
    image: '/hero section.jpg',
    author: 'Emily Rodriguez',
    date: 'Jan 15, 2026',
    tags: ['Technology', 'Updates', 'Features'],
    content: [
      'A new seller flow and improved dashboards are helping vendors manage listings, track demand, and respond to customers faster.',
      'We also introduced smarter discovery and better category browsing to connect buyers with the right products at the right time.',
      'More improvements are coming, including shipment status tracking and vendor verification badges.',
    ],
  },
  {
    id: 4,
    title: 'Widikum Weavers Win International Craft Award',
    excerpt:
      'Traditional textile artisans from Widikum community receive prestigious recognition for their exceptional craftsmanship and cultural preservation.',
    category: 'Awards',
    image: '/widikum-hero.jpg',
    author: 'David Okonkwo',
    date: 'Jan 12, 2026',
    tags: ['Widikum', 'Awards', 'Crafts'],
    content: [
      'Widikum weavers have earned international recognition for their mastery of traditional patterns and modern quality standards.',
      'The award highlights the value of cultural craftsmanship and creates new commercial opportunities for local producers.',
      'Local Roots will feature a special collection showcasing the winning designs and the artisans behind them.',
    ],
  },
  {
    id: 5,
    title: 'Community Trading: Connecting Local Producers to Global Markets',
    excerpt: 'How digital platforms are revolutionizing the way local communities sell their products internationally.',
    category: 'Business',
    image: '/fonjo-hero.jpg',
    author: 'Lisa Anderson',
    date: 'Jan 10, 2026',
    tags: ['Business', 'Global Trade', 'Digital'],
    content: [
      'Digital commerce is reducing barriers for local producers by enabling discovery, secure payment, and logistics coordination.',
      'For communities, this means predictable demand and better price transparency—key ingredients for sustainable growth.',
      'The biggest winners are those who invest in product quality, storytelling, and consistency over time.',
    ],
  },
  {
    id: 6,
    title: 'Membe Coffee Farmers Report Record Harvest Season',
    excerpt:
      'Coffee producers in Membe celebrate their best harvest in a decade, with quality and quantity exceeding all expectations.',
    category: 'Agriculture',
    image: '/membe-hero.jpg',
    author: 'James Mbaku',
    date: 'Jan 8, 2026',
    tags: ['Membe', 'Coffee', 'Agriculture'],
    content: [
      'Membe coffee farms reported stronger yields and improved bean quality thanks to pruning, soil enrichment, and better post-harvest handling.',
      'Buyers are already placing forward orders for the upcoming season, boosting confidence for the community.',
      'The next step is expanding drying infrastructure to preserve quality at scale.',
    ],
  },
];

export function getNewsArticleById(id: number) {
  return load().find((a) => a.id === id) ?? null;
}
