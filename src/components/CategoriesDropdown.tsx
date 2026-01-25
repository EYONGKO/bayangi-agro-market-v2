import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Grid3x3 } from 'lucide-react';
import { Box, Button, Menu as MuiMenu, MenuItem, Typography, CircularProgress } from '@mui/material';
import { getCategories, type Category } from '../api/categoriesApi';

export default function CategoriesDropdown() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);

  const open = Boolean(anchorEl);
  
  // Update category when URL changes using a more reliable method
  useEffect(() => {
    const updateCategory = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const category = urlParams.get('category') || searchParams.get('category');
      setCurrentCategory(category);
      
      console.log('=== URL UPDATE ===');
      console.log('Current URL:', window.location.href);
      console.log('Window search params:', Object.fromEntries(urlParams.entries()));
      console.log('Setting currentCategory to:', category);
    };

    // Initial update
    updateCategory();
    
    // Listen for popstate events (browser back/forward)
    window.addEventListener('popstate', updateCategory);
    
    // Custom event listener for programmatic navigation
    const handleCustomNavigation = () => {
      setTimeout(updateCategory, 50); // Small delay to ensure URL is updated
    };
    window.addEventListener('navigation', handleCustomNavigation);
    
    return () => {
      window.removeEventListener('popstate', updateCategory);
      window.removeEventListener('navigation', handleCustomNavigation);
    };
  }, [searchParams]);

  // Create a mapping of slugs to category names for better matching
  const slugToNameMap: Record<string, string> = {
    'agriculture': 'Agriculture',
    'community-success': 'Community Success',
    'platform-updates': 'Platform Updates',
    'marketplace': 'Marketplace',
    'resources': 'Resources',
    'art': 'Art',
    'crafts': 'Crafts',
    'food': 'Food',
    'textiles': 'Textiles',
    'electronics': 'Electronics',
    'health-wellness': 'Health & Wellness',
    'education': 'Education',
    'technology': 'Technology',
    'fashion': 'Fashion',
    'home-garden': 'Home & Garden',
    'sports-fitness': 'Sports & Fitness',
    'beauty-personal-care': 'Beauty & Personal Care',
    'toys-games': 'Toys & Games',
    'books-media': 'Books & Media',
    'automotive': 'Automotive',
    'business-services': 'Business & Services',
    'entertainment': 'Entertainment',
    'travel-tourism': 'Travel & Tourism',
    'pet-supplies': 'Pet Supplies',
    'office-supplies': 'Office Supplies',
    'industrial': 'Industrial',
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCategoryClick = (category: Category) => {
    // Debug: Log before navigation
    console.log('=== BEFORE NAVIGATION ===');
    console.log('Clicked category:', category);
    console.log('Navigating to:', `/global-market?category=${category.slug}`);
    
    // Navigate to global market with category filter using React Router
    navigate(`/global-market?category=${category.slug}`);
    handleClose();
    
    // Manually trigger update after navigation
    setTimeout(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const newCategory = urlParams.get('category');
      setCurrentCategory(newCategory);
      
      console.log('=== AFTER NAVIGATION (MANUAL UPDATE) ===');
      console.log('Current URL:', window.location.href);
      console.log('Window search params:', Object.fromEntries(urlParams.entries()));
      console.log('Manually setting currentCategory to:', newCategory);
    }, 100);
  };

  return (
    <>
      <Button
        startIcon={<Grid3x3 size={18} />}
        onClick={handleClick}
        sx={{
          textTransform: 'none',
          color: open ? 'primary.main' : 'inherit',
        }}
      >
        Categories
      </Button>

      <MuiMenu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            minWidth: '280px',
            maxHeight: '500px', // Increased height for better scrolling
            overflow: 'auto', // Ensure scrolling works
            '& .MuiList-root': {
              padding: '8px',
            },
          },
        }}
      >
        <Box sx={{ px: 2, py: 1, borderBottom: '1px solid #e5e7eb' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Browse Categories
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {categories.length} categories available
          </Typography>
          {currentCategory && (
            <Typography variant="caption" color="primary" sx={{ fontSize: '10px', mt: 0.5, display: 'block' }}>
              Currently viewing: {slugToNameMap[currentCategory] || currentCategory}
            </Typography>
          )}
        </Box>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress size={20} />
          </Box>
        )}

        {error && (
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="body2" color="error" sx={{ fontSize: '12px' }}>
              {error}
            </Typography>
          </Box>
        )}

        {!loading && !error && categories.map((category) => (
          <MenuItem
            key={category._id}
            onClick={() => handleCategoryClick(category)}
            sx={{
              borderRadius: '4px',
              mx: 1,
              my: 0.5,
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
              <Box component="span" sx={{ color: '#666', display: 'flex', alignItems: 'center' }}>
                <Grid3x3 size={14} />
              </Box>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {category.name}
                </Typography>
                {category.description && (
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '10px' }}>
                    {category.description.length > 40 
                      ? `${category.description.substring(0, 40)}...`
                      : category.description
                    }
                  </Typography>
                )}
              </Box>
            </Box>
          </MenuItem>
        ))}
      </MuiMenu>
    </>
  );
}
