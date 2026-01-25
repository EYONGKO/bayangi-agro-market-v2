import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import type { Product } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { fetchAllProducts, subscribeProductsChanged } from '../api/productsApi';
import BrowseByInterestPills from '../components/globalMarket/BrowseByInterestPills';
import ProductCarouselSection from '../components/globalMarket/ProductCarouselSection';
import { GIFT_MODE_INTERESTS } from '../data/giftModeInterests';
import PageLayout from '../components/PageLayout';
import { theme } from '../theme/colors';

const GlobalMarketPage = () => {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [searchParams] = useSearchParams();

  const [searchQuery] = useState('');
  const [selectedInterestId, setSelectedInterestId] = useState<string>('all');

  // Get category from URL parameter
  const urlCategory = searchParams.get('category');

  const [allProducts, setAllProducts] = useState<Product[]>([]);

  const loadProducts = () => {
    let mounted = true;
    fetchAllProducts()
      .then((data) => {
        if (mounted) setAllProducts(data);
      })
      .catch(() => {
        if (mounted) setAllProducts([]);
      });
    return () => {
      mounted = false;
    };
  };

  useEffect(() => {
    const cleanupLoad = loadProducts();
    const unsubscribe = subscribeProductsChanged(() => {
      loadProducts();
    });
    return () => {
      cleanupLoad();
      unsubscribe();
    };
  }, []);

  const selectedInterest = useMemo(() => {
    if (selectedInterestId === 'all') return null;
    return GIFT_MODE_INTERESTS.find((i) => i.id === selectedInterestId) ?? null;
  }, [selectedInterestId]);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const categories = selectedInterest?.categories ?? null;

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

    // Get the expected category name from the URL slug
    const expectedCategoryName = urlCategory ? slugToNameMap[urlCategory] : null;

    return allProducts.filter((product) => {
      const matchesSearch =
        q === '' ||
        product.name.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q);

      // Check if URL category matches product category (using name mapping)
      const matchesUrlCategory = !urlCategory || 
        !expectedCategoryName || 
        product.category === expectedCategoryName ||
        product.category.toLowerCase() === urlCategory.replace('-', ' ');
      
      // Check if selected interest matches product category
      const matchesInterest = !categories || categories.includes(product.category);

      return matchesSearch && matchesUrlCategory && matchesInterest;
    });
  }, [allProducts, searchQuery, selectedInterest, urlCategory]);

  const latestProducts = useMemo(() => {
    return allProducts.slice(0, 12);
  }, [allProducts]);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  const pillItems = useMemo(() => {
    return [{ id: 'all', label: 'All' }, ...GIFT_MODE_INTERESTS.map((i) => ({ id: i.id, label: i.label }))];
  }, []);

  const sectionInterests = useMemo(() => {
    if (selectedInterestId !== 'all') {
      const interest = GIFT_MODE_INTERESTS.find((i) => i.id === selectedInterestId);
      return interest ? [interest] : [];
    }
    return GIFT_MODE_INTERESTS.slice(0, 8);
  }, [selectedInterestId]);

  // Generate curator names and subtitles based on interests
  const getCuratorInfo = (interestId: string) => {
    const curatorMap: Record<string, { name: string; subtitle: string }> = {
      reading: { name: 'The Bookworm', subtitle: 'Custom Book Art' },
      'pop-culture': { name: 'The Theater Kid', subtitle: 'Shakespeare Gifts' },
      music: { name: 'The Music Lover', subtitle: 'Musical Gifts' },
      'health-fitness': { name: 'The Fitness Enthusiast', subtitle: 'Health & Wellness' },
      hosting: { name: 'The Host', subtitle: 'Entertaining Essentials' },
      pets: { name: 'The Pet Parent', subtitle: 'Pet Lover Gifts' },
      science: { name: 'The Scientist', subtitle: 'Science & Discovery' },
      plants: { name: 'The Gardener', subtitle: 'Plant Lover Gifts' },
      tech: { name: 'The Tech Enthusiast', subtitle: 'Tech & Gadgets' },
      'beer-wine': { name: 'The Connoisseur', subtitle: 'Beverage Gifts' },
      crafting: { name: 'The Crafter', subtitle: 'DIY & Handmade' },
      collectibles: { name: 'The Collector', subtitle: 'Unique Collectibles' },
      art: { name: 'The Art Lover', subtitle: 'Artistic Gifts' },
      'useful-gifts': { name: 'The Practical One', subtitle: 'Useful & Functional' },
      fashion: { name: 'The Fashionista', subtitle: 'Style & Accessories' },
      astrology: { name: 'The Stargazer', subtitle: 'Astrology Gifts' },
      cooking: { name: 'The Chef', subtitle: 'Culinary Gifts' },
      humor: { name: 'The Comedian', subtitle: 'Funny & Quirky' },
      jewelry: { name: 'The Jewelry Lover', subtitle: 'Handcrafted Jewelry' },
      romance: { name: 'The Romantic', subtitle: 'Romantic Gifts' },
    };

    return curatorMap[interestId] || { name: 'Local Roots', subtitle: 'Curated Collection' };
  };

  return (
    <PageLayout>
      <div style={{ minHeight: '100vh', background: `linear-gradient(135deg, ${theme.colors.primary.background} 0%, ${theme.colors.primary.light}40% 50%, ${theme.colors.primary.main} 100%)` }}>
        <BrowseByInterestPills
          title="Browse by interest for the best gifts!"
          items={pillItems}
          selectedId={selectedInterestId}
          onSelect={(id: string) => setSelectedInterestId(id)}
          showMore={false}
        />

        <div style={{ background: theme.colors.ui.white, paddingBottom: '80px' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            {latestProducts.length > 0 && (
              <ProductCarouselSection
                key="latest"
                curatorName="All Communities"
                curatorLabel="New listings"
                title="Latest products"
                subtitle="Fresh listings from Kendem and all communities"
                products={latestProducts}
                onBrowseAll={() => setSelectedInterestId('all')}
                isWishlisted={isWishlisted}
                onToggleWishlist={(productId) => toggleWishlist(productId)}
                onAddToCart={(product) => handleAddToCart(product)}
              />
            )}

            {sectionInterests.map((interest) => {
              const products = filteredProducts
                .filter((p) => interest.categories.includes(p.category))
                .slice(0, 12);

              if (products.length === 0) return null;

              const curatorInfo = getCuratorInfo(interest.id);

              return (
                <ProductCarouselSection
                  key={interest.id}
                  curatorName={curatorInfo.name}
                  curatorLabel="Curated by"
                  title={curatorInfo.name}
                  subtitle={curatorInfo.subtitle}
                  products={products}
                  onBrowseAll={() => setSelectedInterestId(interest.id)}
                  isWishlisted={isWishlisted}
                  onToggleWishlist={(productId) => toggleWishlist(productId)}
                  onAddToCart={(product) => handleAddToCart(product)}
                />
              );
            })}

            {selectedInterestId !== 'all' && sectionInterests.length === 0 && (
              <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: 600, color: '#6b7280', marginBottom: '8px' }}>
                  No products found
                </div>
                <div style={{ fontSize: '14px', color: '#9ca3af' }}>
                  Try selecting a different interest category
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </PageLayout>
  );
};

export default GlobalMarketPage;
