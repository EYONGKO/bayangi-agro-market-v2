import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Box, Container } from '@mui/material';
import { Package, TrendingUp } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import { theme } from '../theme/colors';

const PageWrapper = styled(Box)({
  minHeight: '100vh',
  background: `linear-gradient(135deg, ${theme.colors.primary.background} 0%, ${theme.colors.primary.light}40% 50%, ${theme.colors.primary.main} 100%)`,
  paddingBottom: '80px',
});

const HeroSection = styled(Box)({
  background: `linear-gradient(135deg, ${theme.colors.primary.main} 0%, ${theme.colors.primary.dark} 100%)`,
  color: theme.colors.ui.white,
  padding: '60px 20px',
  marginBottom: '40px',
});

const HeroTitle = styled('h1')({
  fontSize: 'clamp(32px, 5vw, 48px)',
  fontWeight: 900,
  marginBottom: '16px',
  textAlign: 'center',
});

const HeroSubtitle = styled('p')({
  fontSize: '18px',
  opacity: 0.95,
  textAlign: 'center',
  maxWidth: '700px',
  margin: '0 auto',
  lineHeight: 1.6,
});

const ContentContainer = styled(Container)({
  width: '100%',
  maxWidth: '1800px',
  margin: '0 auto',
  paddingLeft: '24px',
  paddingRight: '24px',
  boxSizing: 'border-box',
});

const FilterBar = styled(Box)({
  display: 'flex',
  gap: '12px',
  marginBottom: '40px',
  flexWrap: 'wrap',
  justifyContent: 'center',
});

const FilterButton = styled('button')<{ active?: boolean }>(({ active }) => ({
  padding: '10px 20px',
  borderRadius: '999px',
  border: active ? 'none' : `2px solid ${theme.colors.neutral[200]}`,
  background: active ? `linear-gradient(135deg, ${theme.colors.primary.main} 0%, ${theme.colors.primary.dark} 100%)` : theme.colors.ui.white,
  color: active ? theme.colors.ui.white : theme.colors.neutral[600],
  fontWeight: 700,
  fontSize: '14px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: active ? `0 4px 12px ${theme.colors.primary.light}40%` : `0 2px 8px ${theme.colors.ui.shadow}`,
  },
}));

const CollectionsGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: '30px',
  '@media (max-width: 768px)': {
    gridTemplateColumns: '1fr',
  },
});

const CollectionCard = styled(Box)({
  background: theme.colors.ui.white,
  borderRadius: '16px',
  overflow: 'hidden',
  boxShadow: `0 4px 20px ${theme.colors.ui.shadow}`,
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: `0 12px 40px ${theme.colors.ui.shadow}`,
  },
});

const CollectionImage = styled('div')<{ image: string }>(({ image }) => ({
  height: '200px',
  backgroundImage: `url(${image})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  position: 'relative',
}));

const CollectionOverlay = styled('div')({
  position: 'absolute',
  inset: 0,
  background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)',
  display: 'flex',
  alignItems: 'flex-end',
  padding: '20px',
});

const CollectionBadge = styled('div')({
  position: 'absolute',
  top: '16px',
  right: '16px',
  padding: '6px 14px',
  borderRadius: '999px',
  background: `${theme.colors.primary.main}e6`,
  fontSize: '11px',
  fontWeight: 800,
  color: theme.colors.ui.white,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
});

const CollectionContent = styled(Box)({
  padding: '24px',
});

const CollectionTitle = styled('h3')({
  fontSize: '20px',
  fontWeight: 800,
  color: theme.colors.neutral[900],
  marginBottom: '8px',
  lineHeight: 1.3,
});

const CollectionDescription = styled('p')({
  fontSize: '14px',
  color: theme.colors.neutral[600],
  lineHeight: 1.6,
  marginBottom: '16px',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
});

const CollectionStats = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
  paddingTop: '16px',
  borderTop: `1px solid ${theme.colors.neutral[200]}`,
});

const StatItem = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '13px',
  fontWeight: 600,
  color: theme.colors.neutral[600],
});

const BrowseButton = styled('button')({
  width: '100%',
  padding: '12px',
  borderRadius: '10px',
  border: 'none',
  background: `linear-gradient(135deg, ${theme.colors.primary.main} 0%, ${theme.colors.primary.dark} 100%)`,
  color: theme.colors.ui.white,
  fontWeight: 800,
  fontSize: '14px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  marginTop: '16px',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 4px 12px ${theme.colors.primary.light}40%`,
  },
});

interface Collection {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  itemCount: number;
  featured: boolean;
}

const collections: Collection[] = [
  {
    id: 'handmade-crafts',
    name: 'Handmade Crafts',
    description: 'Unique artisan-made products crafted with traditional techniques and modern designs.',
    category: 'Crafts',
    image: '/kendem-hero.jpg',
    itemCount: 145,
    featured: true,
  },
  {
    id: 'agricultural-products',
    name: 'Agricultural Products',
    description: 'Fresh produce and agricultural goods from local farmers and communities.',
    category: 'Agriculture',
    image: '/mamfe-hero.jpg',
    itemCount: 89,
    featured: true,
  },
  {
    id: 'textiles-fabrics',
    name: 'Textiles & Fabrics',
    description: 'Beautiful handwoven textiles, traditional fabrics, and textile-based products.',
    category: 'Textiles',
    image: '/widikum-hero.jpg',
    itemCount: 67,
    featured: false,
  },
  {
    id: 'home-decor',
    name: 'Home & Decor',
    description: 'Decorative items and home accessories that bring cultural beauty to your space.',
    category: 'Home',
    image: '/membe-hero.jpg',
    itemCount: 112,
    featured: false,
  },
  {
    id: 'jewelry-accessories',
    name: 'Jewelry & Accessories',
    description: 'Handcrafted jewelry and fashion accessories made by skilled artisans.',
    category: 'Fashion',
    image: '/fonjo-hero.jpg',
    itemCount: 93,
    featured: true,
  },
  {
    id: 'food-beverages',
    name: 'Food & Beverages',
    description: 'Traditional foods, spices, and beverages from various local communities.',
    category: 'Food',
    image: '/moshie-kekpoti-hero.png',
    itemCount: 76,
    featured: false,
  },
  {
    id: 'pottery-ceramics',
    name: 'Pottery & Ceramics',
    description: 'Functional and decorative pottery pieces crafted using time-honored methods.',
    category: 'Crafts',
    image: '/kendem-hero.jpg',
    itemCount: 54,
    featured: false,
  },
  {
    id: 'woodwork',
    name: 'Woodwork & Carvings',
    description: 'Intricate wood carvings and furniture pieces showcasing masterful craftsmanship.',
    category: 'Crafts',
    image: '/mamfe-hero.jpg',
    itemCount: 48,
    featured: false,
  },
  {
    id: 'seasonal-gifts',
    name: 'Seasonal & Gift Items',
    description: 'Perfect gifts for any occasion, curated from our best-selling products.',
    category: 'Gifts',
    image: '/widikum-hero.jpg',
    itemCount: 128,
    featured: true,
  },
];

const categories = ['All', 'Crafts', 'Agriculture', 'Textiles', 'Home', 'Fashion', 'Food', 'Gifts'];

export default function AllCollectionsPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredCollections = selectedCategory === 'All'
    ? collections
    : collections.filter(collection => collection.category === selectedCategory);

  return (
    <PageLayout>
      <PageWrapper>
        <HeroSection>
          <HeroTitle>All Collections</HeroTitle>
          <HeroSubtitle>
            Explore our curated collections of authentic products from artisans and farmers around the world.
          </HeroSubtitle>
        </HeroSection>

        <ContentContainer maxWidth={false} disableGutters>
          <FilterBar>
            {categories.map((category) => (
              <FilterButton
                key={category}
                active={selectedCategory === category}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </FilterButton>
            ))}
          </FilterBar>

          <CollectionsGrid>
            {filteredCollections.map((collection) => (
              <CollectionCard key={collection.id} onClick={() => navigate('/global-market')}>
                <CollectionImage image={collection.image}>
                  {collection.featured && <CollectionBadge>Featured</CollectionBadge>}
                  <CollectionOverlay />
                </CollectionImage>
                <CollectionContent>
                  <CollectionTitle>{collection.name}</CollectionTitle>
                  <CollectionDescription>{collection.description}</CollectionDescription>
                  <CollectionStats>
                    <StatItem>
                      <Package size={16} />
                      {collection.itemCount} Items
                    </StatItem>
                    <StatItem>
                      <TrendingUp size={16} />
                      Popular
                    </StatItem>
                  </CollectionStats>
                  <BrowseButton onClick={(e) => {
                    e.stopPropagation();
                    navigate('/global-market');
                  }}>
                    Browse Collection
                  </BrowseButton>
                </CollectionContent>
              </CollectionCard>
            ))}
          </CollectionsGrid>

          {filteredCollections.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Box sx={{ fontSize: '18px', fontWeight: 600, color: theme.colors.neutral[700], mb: 1 }}>
                No collections found in this category.
              </Box>
              <Box sx={{ fontSize: '14px', color: theme.colors.neutral[600] }}>
                Try selecting a different category to explore more collections.
              </Box>
            </Box>
          )}
        </ContentContainer>
      </PageWrapper>
    </PageLayout>
  );
}
