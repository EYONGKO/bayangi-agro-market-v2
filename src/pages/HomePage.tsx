import { Link, useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ShoppingCart, Search, Globe, Star, Plus, Heart, User, Menu } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CommunityCard from '../components/CommunityCard';

const HeaderWrapper = styled(Box)({
  position: 'sticky',
  top: 0,
  width: '100%',
  zIndex: 1000,
  background: '#ffffff',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)'
});

const TopBar = styled(Box)({
  background: '#0f172a',
  color: 'rgba(255,255,255,0.92)',
  fontSize: '12px',
  fontWeight: 600
});

const TopBarInner = styled(Container)({
  maxWidth: '1400px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '8px 16px'
});

const HeaderMain = styled(Container)({
  maxWidth: '1400px',
  display: 'grid',
  gridTemplateColumns: '220px 1fr 220px',
  alignItems: 'center',
  gap: '16px',
  padding: '16px'
});

const Brand = styled(Link)({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  textDecoration: 'none',
  color: '#0f172a'
});

const BrandMark = styled('div')({
  width: '40px',
  height: '40px',
  borderRadius: '10px',
  background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  fontWeight: 900
});

const BrandText = styled('div')({
  fontSize: '18px',
  fontWeight: 900,
  letterSpacing: '-0.02em'
});

const SearchWrap = styled('div')({
  display: 'grid',
  gridTemplateColumns: '1fr 110px',
  gap: '10px',
  alignItems: 'center'
});

const SearchInput = styled('input')({
  width: '100%',
  padding: '12px 14px 12px 42px',
  border: '1px solid #e5e7eb',
  borderRadius: '999px',
  fontSize: '14px',
  outline: 'none'
});

const SearchButton = styled('button')({
  padding: '12px 14px',
  borderRadius: '999px',
  border: 'none',
  cursor: 'pointer',
  background: '#ef4444',
  color: 'white',
  fontWeight: 900,
  fontSize: '13px'
});

const HeaderIcons = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: '10px'
});

const IconButton = styled('button')({
  background: 'transparent',
  border: '1px solid rgba(15, 23, 42, 0.12)',
  padding: '10px',
  cursor: 'pointer',
  borderRadius: '12px',
  transition: 'background-color 0.2s ease',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#0f172a',
  '&:hover': {
    backgroundColor: 'rgba(15, 23, 42, 0.04)'
  }
});

const CartBadge = styled('span')({
  position: 'absolute',
  top: '-2px',
  right: '-2px',
  background: '#ff4757',
  color: 'white',
  borderRadius: '50%',
  width: '20px',
  height: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '12px',
  fontWeight: 700,
});

const HeaderBottom = styled(Box)({
  borderTop: '1px solid rgba(15, 23, 42, 0.08)',
  borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
  background: '#ffffff'
});

const HeaderBottomInner = styled(Container)({
  maxWidth: '1400px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '16px',
  padding: '10px 16px'
});

const CategoriesButton = styled('button')({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '10px 14px',
  borderRadius: '999px',
  border: 'none',
  cursor: 'pointer',
  background: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
  color: 'white',
  fontWeight: 900,
  fontSize: '13px'
});

const MenuLinks = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '18px',
  flexWrap: 'wrap'
});

const MenuLink = styled(Link)({
  textDecoration: 'none',
  color: '#0f172a',
  fontWeight: 800,
  fontSize: '13px',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  opacity: 0.9,
  '&:hover': {
    opacity: 1
  }
});

const SectionContainer = styled(Box)({
  padding: '80px 20px',
});

const SectionTitle = styled(Typography)({
  fontSize: '2.5rem',
  fontWeight: 700,
  color: '#333',
  textAlign: 'center',
  marginBottom: '1rem',
  '@media (max-width: 768px)': {
    fontSize: '2rem',
  },
});

const SectionSubtitle = styled(Typography)({
  fontSize: '1.1rem',
  color: '#666',
  textAlign: 'center',
  marginBottom: '3rem',
  lineHeight: 1.6,
  maxWidth: '800px',
  marginLeft: 'auto',
  marginRight: 'auto',
});

const CommunityGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
  gap: '2rem',
  maxWidth: '1200px',
  margin: '0 auto',
  '@media (max-width: 768px)': {
    gridTemplateColumns: '1fr',
  },
});

const CTASection = styled(Box)({
  background: 'linear-gradient(135deg, #f5f5f5, #e8f5e9)',
  padding: '80px 20px',
  textAlign: 'center',
});

const CTAButtons = styled(Stack)({
  marginTop: '2rem',
  justifyContent: 'center',
  gap: '1rem',
  flexDirection: 'row',
  flexWrap: 'wrap',
});

const PrimaryButton = styled(Button)({
  background: '#2ecc71',
  color: 'white',
  padding: '12px 36px',
  borderRadius: '25px',
  fontSize: '1rem',
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: '0 4px 15px rgba(46, 204, 113, 0.3)',
  '&:hover': {
    background: '#27ae60',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(46, 204, 113, 0.4)',
  },
});

const SecondaryButton = styled(Button)({
  background: 'transparent',
  color: '#2ecc71',
  padding: '12px 36px',
  border: '2px solid #2ecc71',
  borderRadius: '25px',
  fontSize: '1rem',
  fontWeight: 600,
  textTransform: 'none',
  '&:hover': {
    background: '#2ecc71',
    color: 'white',
  },
});

const QuickActionsContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  gap: '2rem',
  padding: '60px 20px',
  background: 'white',
  flexWrap: 'wrap',
});

const QuickActionButton = styled(Link)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '24px',
  textDecoration: 'none',
  color: '#2ecc71',
  transition: 'all 0.3s ease',
  borderRadius: '15px',
  minWidth: '120px',
  '&:hover': {
    background: '#f5f5f5',
    transform: 'translateY(-4px)',
  },
});

const QuickActionText = styled(Typography)({
  marginTop: '0.75rem',
  fontWeight: 500,
  fontSize: '0.95rem',
  color: '#333',
});

const Footer = styled(Box)({
  background: 'linear-gradient(180deg, #111827 0%, #0b1220 100%)',
  color: '#ffffff',
  padding: '64px 20px 28px',
  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
});

const FooterGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '2rem',
  maxWidth: '1200px',
  margin: '0 auto 2rem',
  textAlign: 'left',
});

const FooterSection = styled(Box)({
  '& h4': {
    marginBottom: '1rem',
    color: '#7cf6b1',
    fontSize: '1.05rem',
    fontWeight: 700,
    letterSpacing: '0.02em',
  },
  '& ul': {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  '& li': {
    marginBottom: '0.5rem',
  },
  '& a': {
    color: 'rgba(255,255,255,0.85)',
    textDecoration: 'none',
    transition: 'color 0.3s ease',
    '&:hover': {
      color: '#ffffff',
    },
  },
});

const FooterBottom = styled(Box)({
  marginTop: '2rem',
  paddingTop: '2rem',
  borderTop: '1px solid rgba(255, 255, 255, 0.12)',
  textAlign: 'center',
  color: 'rgba(255,255,255,0.75)',
});

const communities = [
  {
    id: 'kendem',
    name: 'Kendem',
    description: 'Discover unique products and support local artisans.',
    heroImage: '/assets/kendem-hero.jpg',
    vendorCount: 50,
    productCount: 100,
  },
  {
    id: 'mamfe',
    name: 'Mamfe',
    description: 'Discover unique products and support local artisans.',
    heroImage: '/assets/mamfe-hero.jpg',
    vendorCount: 50,
    productCount: 100,
  },
  {
    id: 'membe',
    name: 'Membe',
    description: 'Discover unique products and support local artisans.',
    heroImage: '/assets/membe-hero.jpg',
    vendorCount: 50,
    productCount: 100,
  },
  {
    id: 'widikum',
    name: 'Widikum',
    description: 'Discover unique products and support local artisans.',
    heroImage: '/assets/widikum-hero.jpg',
    vendorCount: 50,
    productCount: 100,
  },
  {
    id: 'fonjo',
    name: 'Fonjo',
    description: 'Discover unique products and support local artisans.',
    heroImage: '/assets/fonjo-hero.jpg',
    vendorCount: 50,
    productCount: 100,
  },
  {
    id: 'moshie-kekpoti',
    name: 'Moshie/Kekpoti',
    description: 'Discover unique products and support local artisans.',
    heroImage: '/assets/moshie-kekpoti-hero.png',
    vendorCount: 50,
    productCount: 100,
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { getTotalItems } = useCart();

  return (
    <Box>
      <HeaderWrapper>
        <TopBar>
          <TopBarInner>
            <div>Get 30% Off on Selected Items</div>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center', opacity: 0.95 }}>
              <span>support@localroots.com</span>
              <span style={{ opacity: 0.7 }}>|</span>
              <span>English</span>
            </div>
          </TopBarInner>
        </TopBar>

        <HeaderMain>
          <Brand to="/">
            <BrandMark>LR</BrandMark>
            <BrandText>Local Roots</BrandText>
          </Brand>

          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <SearchWrap>
              <SearchInput placeholder="Search products..." />
              <SearchButton type="button">SEARCH</SearchButton>
            </SearchWrap>
          </div>

          <HeaderIcons>
            <IconButton type="button" aria-label="Wishlist" onClick={() => navigate('/wishlist')}>
              <Heart size={20} />
            </IconButton>
            <IconButton type="button" aria-label="Account">
              <User size={20} />
            </IconButton>
            <IconButton type="button" aria-label="Cart" onClick={() => navigate('/cart')}>
              <ShoppingCart size={20} />
              {getTotalItems() > 0 && <CartBadge>{getTotalItems()}</CartBadge>}
            </IconButton>
          </HeaderIcons>
        </HeaderMain>

        <HeaderBottom>
          <HeaderBottomInner>
            <CategoriesButton type="button">
              <Menu size={18} />
              ALL CATEGORIES
            </CategoriesButton>
            <MenuLinks>
              <MenuLink to="/">Home</MenuLink>
              <MenuLink to="/global-market">Global Market</MenuLink>
              <MenuLink to="/all-collections">All Collections</MenuLink>
              <MenuLink to="/news">News</MenuLink>
              <MenuLink to="/dashboard">Dashboard</MenuLink>
            </MenuLinks>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', opacity: 0.75 }}>
                My cart
              </div>
              <div style={{ fontSize: '12px', fontWeight: 900, color: '#0f172a' }}>
                ₦ 0.00
              </div>
            </div>
          </HeaderBottomInner>
        </HeaderBottom>
      </HeaderWrapper>

      <section style={{ background: '#e9f1f5' }}>
        <Container style={{ maxWidth: '1400px', padding: '36px 16px 26px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.05fr 0.95fr',
            gap: '30px',
            alignItems: 'center',
            background: 'white',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
          }}>
            <div style={{ padding: '38px 34px' }}>
              <div style={{ fontSize: '13px', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
                New Collection
              </div>
              <div style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 900, color: '#0f172a', lineHeight: 1.05, marginBottom: '12px' }}>
                New Collection 2026
              </div>
              <div style={{ fontSize: '15px', color: '#475569', lineHeight: 1.7, maxWidth: '540px', marginBottom: '18px' }}>
                Discover authentic community products and artisan-made goods. Shop curated collections, support local vendors, and explore new arrivals.
              </div>
              <button
                type="button"
                onClick={() => navigate('/community')}
                style={{
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  padding: '12px 18px',
                  borderRadius: '10px',
                  fontWeight: 900,
                  cursor: 'pointer'
                }}
              >
                Shop Now
              </button>
            </div>

            <div style={{
              height: '320px',
              backgroundImage:
                "linear-gradient(90deg, rgba(233,241,245,0.0) 0%, rgba(233,241,245,0.6) 60%), url('/assets/mamfe-hero.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginTop: '18px' }}>
            {[{ t: '24/7 Support', s: 'Online support' }, { t: 'Money Back', s: 'Secure payment' }, { t: 'Shipping', s: 'Worldwide delivery' }, { t: 'Best Deals', s: 'Save on bundles' }].map((x) => (
              <div
                key={x.t}
                style={{
                  background: 'white',
                  borderRadius: '14px',
                  padding: '14px 16px',
                  border: '1px solid rgba(15,23,42,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(15,23,42,0.04)' }} />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 900, color: '#0f172a' }}>{x.t}</div>
                  <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 700 }}>{x.s}</div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Select Your Community Section */}
      <SectionContainer>
        <SectionTitle>Select Your Community</SectionTitle>
        <SectionSubtitle>
          Each community has its own unique global marketplace showcasing local
          artisans, farmers, and their authentic products
        </SectionSubtitle>

        <CommunityGrid>
          {communities.map((community) => (
            <CommunityCard key={community.id} {...community} />
          ))}
        </CommunityGrid>
      </SectionContainer>

      {/* CTA Section */}
      <CTASection>
        <SectionTitle>Ready to Start Your Global Business?</SectionTitle>
        <SectionSubtitle>
          Join thousands of artisans and farmers already selling their products
          worldwide through our platform
        </SectionSubtitle>

        <CTAButtons>
          <PrimaryButton>Register as Seller</PrimaryButton>
          <SecondaryButton>Learn More</SecondaryButton>
        </CTAButtons>
      </CTASection>

      {/* Quick Actions */}
      <QuickActionsContainer>
        <QuickActionButton to="/global-market">
          <Globe size={32} />
          <QuickActionText>Global Market</QuickActionText>
        </QuickActionButton>

        <QuickActionButton to="/top-artisans">
          <Star size={32} />
          <QuickActionText>Top Artisans</QuickActionText>
        </QuickActionButton>

        <QuickActionButton to="/add-product">
          <Plus size={32} />
          <QuickActionText>Add Product</QuickActionText>
        </QuickActionButton>
      </QuickActionsContainer>

      {/* Footer */}
      <Footer>
        <FooterGrid>
          <FooterSection>
            <h4>About Us</h4>
            <p>Connecting local communities with global markets.</p>
          </FooterSection>
          <FooterSection>
            <h4>Quick Links</h4>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/global-market">Global Market</Link>
              </li>
              <li>
                <Link to="/top-artisans">Top Artisans</Link>
              </li>
              <li>
                <Link to="/add-product">Add Product</Link>
              </li>
            </ul>
          </FooterSection>
          <FooterSection>
            <h4>Connect</h4>
            <Box sx={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <a href="#">Facebook</a>
              <a href="#">Twitter</a>
              <a href="#">Instagram</a>
            </Box>
          </FooterSection>
        </FooterGrid>
        <FooterBottom>
          <p>&copy; 2025 Local Roots Commerce. All rights reserved.</p>
        </FooterBottom>
      </Footer>
    </Box>
  );
}
