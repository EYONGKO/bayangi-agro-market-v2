const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  productCount?: number;
}

export async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`);
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}
