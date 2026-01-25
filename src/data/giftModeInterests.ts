export type GiftModeInterest = {
  id: string;
  label: string;
  categories: string[];
};

export const GIFT_MODE_INTERESTS: GiftModeInterest[] = [
  { id: 'reading', label: 'Reading', categories: ['Art', 'Crafts'] },
  { id: 'tech', label: 'Tech', categories: ['Crafts', 'Electronics'] },
  { id: 'beer-wine', label: 'Beer, Wine & Cocktails', categories: ['Food', 'Crafts'] },
  { id: 'pets', label: 'Pets', categories: ['Crafts', 'Textiles'] },
  { id: 'crafting', label: 'Crafting', categories: ['Crafts', 'Art'] },
  { id: 'collectibles', label: 'Collectibles', categories: ['Art', 'Crafts'] },
  { id: 'art', label: 'Art', categories: ['Art'] },
  { id: 'useful-gifts', label: 'Useful Gifts', categories: ['Crafts', 'Food', 'Textiles'] },
  { id: 'plants', label: 'Plants', categories: ['Food', 'Crafts'] },
  { id: 'fashion', label: 'Fashion', categories: ['Textiles', 'Crafts'] },
  { id: 'astrology', label: 'Astrology', categories: ['Art', 'Crafts', 'Textiles'] },
  { id: 'health-fitness', label: 'Health & Fitness', categories: ['Food', 'Crafts'] },
  { id: 'cooking', label: 'Cooking & Baking', categories: ['Food', 'Crafts'] },
  { id: 'hosting', label: 'Hosting', categories: ['Crafts', 'Food'] },
  { id: 'humor', label: 'Humor', categories: ['Art', 'Crafts'] },
  { id: 'science', label: 'Science', categories: ['Art', 'Crafts'] },
  { id: 'pop-culture', label: 'Pop Culture', categories: ['Art', 'Crafts'] },
  { id: 'music', label: 'Music', categories: ['Crafts', 'Art'] },
  { id: 'jewelry', label: 'Jewelry', categories: ['Crafts'] },
  { id: 'romance', label: 'Romance', categories: ['Art', 'Crafts', 'Textiles'] },
];
