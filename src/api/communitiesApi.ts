const API_BASE_URL = 'http://localhost:8080';

export interface Community {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export const getCommunities = async (): Promise<Community[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/communities`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching communities:', error);
    throw error;
  }
};
