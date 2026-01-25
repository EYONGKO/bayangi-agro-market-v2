import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Store, Package, ShieldCheck, Truck, Wallet, ShoppingBag } from 'lucide-react';
import SiteFooter from '../components/SiteFooter';
import AnnouncementBar from '../components/AnnouncementBar';
import EcommerceHeader from '../components/EcommerceHeader';
import CategoryNavigation from '../components/CategoryNavigation';
import EcommerceHeroSlider from '../components/EcommerceHeroSlider';
import FeatureHighlights from '../components/FeatureHighlights';
import { useAuth } from '../context/AuthContext';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { MobileMenuProvider } from '../context/MobileMenuContext';
import { DEFAULT_SECTION_VISIBILITY } from '../config/siteSettingsTypes';
import { listCommunities, type CommunityRecord } from '../api/adminApi';
import { styled } from '@mui/material/styles';
import { Box, Container } from '@mui/material';
import { theme } from '../theme/colors';

const PageWrapper = styled(Box)({
  minHeight: '100vh',
  background: '#f8f9fa',
});

const CommunitiesSection = styled(Box)({
  padding: '40px 20px',
  background: `linear-gradient(135deg, ${theme.colors.primary.background} 0%, ${theme.colors.primary.light}40% 50%, ${theme.colors.primary.main} 100%)`,
  position: 'relative',
  '@media (max-width: 768px)': {
    padding: '30px 16px',
  },
});

const SectionContainer = styled(Container)({
  width: '100%',
  maxWidth: '1800px',
  margin: '0 auto',
  paddingLeft: '24px',
  paddingRight: '24px',
  boxSizing: 'border-box',
  position: 'relative',
  zIndex: 2,
});

const SectionHeader = styled(Box)({
  textAlign: 'center',
  marginBottom: '30px',
  '@media (max-width: 768px)': {
    marginBottom: '20px',
  },
});

const SectionTitle = styled('h2')({
  fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
  fontWeight: 800,
  marginBottom: '20px',
  color: theme.colors.neutral[900], // Use neutral dark color for readability
  letterSpacing: '-0.02em',
  '@media (max-width: 768px)': {
    fontSize: '2rem',
  },
});

const SectionSubtitle = styled('p')({
  fontSize: 'clamp(1rem, 2vw, 1.2rem)',
  color: theme.colors.neutral[700], // Use neutral medium color for readability
  maxWidth: '700px',
  margin: '0 auto',
  lineHeight: 1.6,
  fontWeight: 300,
});

const CommunitiesGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: '26px',
  width: '100%',
  margin: '0 auto',
  '@media (max-width: 1200px)': {
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: '22px',
  },
  '@media (max-width: 768px)': {
    gridTemplateColumns: '1fr',
    gap: '18px',
  },
});

const CommunityCard = styled(Link)({
  borderRadius: '20px',
  overflow: 'hidden',
  boxShadow: `0 8px 32px ${theme.colors.ui.shadow}`,
  textDecoration: 'none',
  color: 'inherit',
  display: 'block',
  background: 'transparent',
  position: 'relative',
  transition: 'all 0.4s ease',
  minHeight: '320px',
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: `0 20px 50px ${theme.colors.ui.shadow}`,
    borderColor: theme.colors.primary.main,
  },
  border: `1px solid ${theme.colors.neutral[200]}`,
  '@media (max-width: 768px)': {
    minHeight: '260px',
  },
});

const CommunityBackground = styled(Box)<{ image: string }>(({ image }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.55)), url("${image}")`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  // Low bandwidth optimization: use lower quality for background images
  imageRendering: 'auto',
}));

const CommunityContent = styled(Box)({
  padding: '25px',
  position: 'absolute',
  inset: 0,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  alignItems: 'center',
  textAlign: 'center',
  gap: '14px',
  '@media (max-width: 768px)': {
    padding: '20px',
  },
});

const CommunityName = styled('h3')({
  fontSize: '26px',
  fontWeight: 700,
  margin: '0 0 6px 0',
  color: theme.colors.ui.white, // Keep white for visibility over background images
  textShadow: '0 2px 10px rgba(0,0,0,0.7)',
  textAlign: 'center',
  '@media (max-width: 768px)': {
    fontSize: '22px',
  },
});

const CommunityDescription = styled('p')({
  fontSize: '16px',
  margin: 0,
  color: theme.colors.ui.white, // Keep white for visibility over background images
  lineHeight: 1.5,
  textShadow: '0 2px 10px rgba(0,0,0,0.6)',
  textAlign: 'center',
  maxWidth: '92%',
  '@media (max-width: 768px)': {
    fontSize: '14px',
  },
});

const CommunityBadges = styled(Box)({
  display: 'flex',
  gap: '14px',
  flexWrap: 'wrap',
  justifyContent: 'center',
});

const CommunityBadge = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '14px',
  flexWrap: 'wrap',
  justifyContent: 'center',
  background: `rgba(255, 255, 255, 0.15)`,
  border: `1px solid rgba(255, 255, 255, 0.22)`,
  padding: '8px 15px',
  borderRadius: theme.borderRadius.full,
  backdropFilter: 'blur(6px)',
  '@media (max-width: 768px)': {
    padding: '6px 12px',
    fontSize: '13px',
  },
});

const BadgeText = styled('span')({
  fontWeight: 600,
  fontSize: '14px',
  color: theme.colors.ui.white, // Keep white for visibility over background images
  '@media (max-width: 768px)': {
    fontSize: '12px',
  },
});

const SellerSection = styled(Box)({
  padding: '70px 20px',
  background: `linear-gradient(135deg, ${theme.colors.primary.background} 0%, ${theme.colors.primary.light}40% 50%, ${theme.colors.primary.main} 100%)`, // Use website theme colors
  position: 'relative',
  overflow: 'hidden',
  '@media (max-width: 768px)': {
    padding: '56px 16px',
  },
});

const SellerCard = styled(Box)({
  borderRadius: '26px',
  border: `1px solid ${theme.colors.neutral[200]}`,
  background: theme.colors.ui.white,
  boxShadow: `0 30px 80px ${theme.colors.ui.shadow}`,
  backdropFilter: 'blur(10px)',
  padding: '34px',
  display: 'grid',
  gridTemplateColumns: '1.1fr 0.9fr',
  gap: '26px',
  '@media (max-width: 980px)': {
    gridTemplateColumns: '1fr',
    padding: '26px',
  },
});

const SellerTitle = styled('h2')({
  fontSize: 'clamp(2rem, 3.8vw, 3rem)',
  fontWeight: 900,
  letterSpacing: '-0.03em',
  color: theme.colors.neutral[900], // Use neutral dark color
  margin: 0,
});

const SellerSubtitle = styled('p')({
  margin: '14px 0 0 0',
  fontSize: 'clamp(1rem, 1.6vw, 1.15rem)',
  lineHeight: 1.7,
  color: theme.colors.neutral[700], // Use neutral medium color
  maxWidth: '720px',
});

const SellerSteps = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: '14px',
  marginTop: '18px',
  '@media (max-width: 900px)': {
    gridTemplateColumns: '1fr',
  },
});

const StepCard = styled(Box)({
  borderRadius: '18px',
  border: `1px solid ${theme.colors.neutral[200]}`,
  background: theme.colors.ui.white,
  padding: '16px 16px',
  display: 'flex',
  gap: '12px',
  alignItems: 'flex-start',
});

const StepTitle = styled('div')({
  fontWeight: 900,
  color: theme.colors.neutral[900], // Use neutral dark color
  fontSize: '15px',
  lineHeight: 1.2,
});

const StepText = styled('div')({
  marginTop: '6px',
  color: theme.colors.neutral[600], // Use neutral medium color
  fontSize: '13px',
  lineHeight: 1.5,
});

const SellerCTA = styled('button')({
  width: '100%',
  border: 'none',
  borderRadius: '16px',
  padding: '16px 18px',
  fontWeight: 900,
  fontSize: '15px',
  color: '#052e1a',
  background: 'linear-gradient(135deg, #34d399 0%, #22c55e 50%, #86efac 100%)',
  boxShadow: '0 18px 40px rgba(34,197,94,0.25)',
  cursor: 'pointer',
  transition: 'transform 0.2s ease, filter 0.2s ease',
  '&:hover': {
    transform: 'translateY(-1px)',
    filter: 'brightness(1.02)',
  },
  '&:active': {
    transform: 'translateY(0px)',
  },
});

const SellerSecondary = styled(Box)({
  marginTop: '12px',
  display: 'flex',
  justifyContent: 'center',
  gap: '10px',
  flexWrap: 'wrap',
  color: theme.colors.neutral[600], // Use neutral medium color
  fontSize: '13px',
});

const SellerLink = styled(Link)({
  color: theme.colors.primary.main, // Use primary green
  fontWeight: 800,
  textDecoration: 'none',
  borderBottom: `1px solid ${theme.colors.primary.light}40%`,
  paddingBottom: '2px',
  '&:hover': {
    borderBottomColor: theme.colors.primary.light,
  },
});

const FALLBACK_COMMUNITIES = [
  { id: 'kendem', name: 'Kendem', description: 'Rich in traditional crafts and agricultural products.', vendorCount: 60, productCount: 100, backgroundImage: '/kendem-hero.jpg' },
  { id: 'mamfe', name: 'Mamfe', description: 'Gateway to diverse local produce and crafts.', vendorCount: 50, productCount: 100, backgroundImage: '/mamfe-hero.jpg' },
  { id: 'membe', name: 'Membe', description: 'Home to exceptional pottery and traditional arts.', vendorCount: 50, productCount: 100, backgroundImage: '/membe-hero.jpg' },
  { id: 'widikum', name: 'Widikum', description: 'Known for vibrant textiles and handmade goods.', vendorCount: 50, productCount: 100, backgroundImage: '/widikum-hero.jpg' },
  { id: 'fonjo', name: 'Fonjo', description: 'Famous for organic produce and sustainable farming.', vendorCount: 50, productCount: 100, backgroundImage: '/fonjo-hero.jpg' },
  { id: 'moshie-kekpoti', name: 'Moshie/Kekpoti', description: 'Celebrated for unique cultural artifacts and crafts.', vendorCount: 50, productCount: 100, backgroundImage: '/moshie-kekpoti-hero.jpg' }
];

const HomePage = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();
  const { settings } = useSiteSettings();
  const visibility = settings.sectionVisibility ?? DEFAULT_SECTION_VISIBILITY;

  type CommunityItem = typeof FALLBACK_COMMUNITIES[number];
  const [communities, setCommunities] = useState<CommunityItem[]>([]);

  // Load communities from API on component mount
  useEffect(() => {
    const loadCommunities = async () => {
      try {
        const apiCommunities = await listCommunities();
        
        // Convert API communities to the format expected by the UI
        const formattedCommunities: CommunityItem[] = apiCommunities.map((community: CommunityRecord) => {
          // Find matching fallback data for additional info
          const fallbackData = FALLBACK_COMMUNITIES.find(fc => fc.id === community.slug);
          
          return {
            id: community.slug,
            name: community.name,
            description: community.description || fallbackData?.description || 'Discover unique products and support local artisans.',
            vendorCount: fallbackData?.vendorCount || 50,
            productCount: fallbackData?.productCount || 100,
            backgroundImage: community.image || fallbackData?.backgroundImage || '/default-community.jpg'
          };
        });
        
        setCommunities(formattedCommunities);
      } catch (error) {
        console.error('Error loading communities:', error);
        // Fallback to default communities if API fails
        setCommunities(FALLBACK_COMMUNITIES);
      }
    };

    loadCommunities();
    
    // Refresh communities every 30 seconds to get admin updates
    const interval = setInterval(loadCommunities, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const isSeller = Boolean(
    isAuthenticated &&
      currentUser &&
      (currentUser.role === 'seller' || currentUser.role === 'both' || currentUser.verifiedSeller)
  );

  const handleSellerCTA = () => {
    if (isSeller) {
      navigate('/seller');
      return;
    }
    navigate('/auth');
  };

  return (
    <PageWrapper>
      {visibility.announcementBar && <AnnouncementBar />}
      <EcommerceHeader />
      {visibility.categoryNav && <CategoryNavigation />}
      {visibility.hero && <EcommerceHeroSlider />}
      {visibility.features && <FeatureHighlights />}

      {visibility.communities && (
        <CommunitiesSection>
          <SectionContainer maxWidth={false} disableGutters>
            <SectionHeader>
              <SectionTitle>Choose Your Community</SectionTitle>
              <SectionSubtitle>
                Each community has its own unique marketplace showcasing local artisans and their authentic products
              </SectionSubtitle>
            </SectionHeader>

            <CommunitiesGrid>
              {communities.map((community) => (
                <CommunityCard key={community.id} to={`/community/${community.id}`}>
                  <CommunityBackground image={community.backgroundImage} />
                  <CommunityContent>
                    <div>
                      <CommunityName>{community.name}</CommunityName>
                      <CommunityDescription>{community.description}</CommunityDescription>
                    </div>
                    <CommunityBadges>
                      <CommunityBadge>
                        <Store size={18} color={theme.colors.ui.white} />
                        <BadgeText>{community.vendorCount}+ Vendors</BadgeText>
                      </CommunityBadge>
                      <CommunityBadge>
                        <ShoppingBag size={18} color={theme.colors.ui.white} />
                        <BadgeText>{community.productCount}+ Products</BadgeText>
                      </CommunityBadge>
                    </CommunityBadges>
                  </CommunityContent>
                </CommunityCard>
              ))}
            </CommunitiesGrid>
          </SectionContainer>
        </CommunitiesSection>
      )}

      {visibility.sellerSection && (
      <SellerSection>
        <SectionContainer maxWidth={false} disableGutters>
          <SellerCard>
            <Box>
              <SellerTitle>Start selling in minutes</SellerTitle>
              <SellerSubtitle>
                Turn your craft or harvest into income. Create a seller account, list your products, and reach buyers across communities
                and beyond.
              </SellerSubtitle>
              <SellerSteps>
                <StepCard>
                  <Box sx={{ color: 'rgba(167,243,208,0.95)', mt: '2px' }}>
                    <ShieldCheck size={20} />
                  </Box>
                  <Box>
                    <StepTitle>1. Create your seller profile</StepTitle>
                    <StepText>Sign in, choose “Seller”, and get verified to build buyer trust.</StepText>
                  </Box>
                </StepCard>
                <StepCard>
                  <Box sx={{ color: 'rgba(167,243,208,0.95)', mt: '2px' }}>
                    <Truck size={20} />
                  </Box>
                  <Box>
                    <StepTitle>2. Add products & delivery details</StepTitle>
                    <StepText>Upload photos, set pricing, and define how you ship or deliver.</StepText>
                  </Box>
                </StepCard>
                <StepCard>
                  <Box sx={{ color: 'rgba(167,243,208,0.95)', mt: '2px' }}>
                    <Wallet size={20} />
                  </Box>
                  <Box>
                    <StepTitle>3. Get paid & grow</StepTitle>
                    <StepText>Manage orders in your dashboard and scale with community exposure.</StepText>
                  </Box>
                </StepCard>
              </SellerSteps>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '12px' }}>
              <SellerCTA type="button" onClick={handleSellerCTA}>
                {isSeller ? 'Go to Seller Dashboard' : 'Become a Seller'}
              </SellerCTA>
              <SellerSecondary>
                <span>Already have an account?</span>
                <SellerLink to="/auth">Sign in</SellerLink>
                <span>or</span>
                <SellerLink to="/seller">Seller dashboard</SellerLink>
              </SellerSecondary>
            </Box>
          </SellerCard>
        </SectionContainer>
      </SellerSection>
      )}

      <SiteFooter />
    </PageWrapper>
  );
};

export default HomePage;
