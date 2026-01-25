import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Search, User, Heart, ShoppingBag, Menu, X, ChevronDown } from 'lucide-react';
import { styled } from '@mui/material/styles';
import { Box, Container, Dialog, DialogTitle, DialogContent } from '@mui/material';
import { useCart } from '../context/CartContext';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { useMobileMenu } from '../context/MobileMenuContext';
import { DEFAULT_MARKET_PRICES, DEFAULT_NAV_LINKS, DEFAULT_PRICE_ITEMS, DEFAULT_SECTION_VISIBILITY } from '../config/siteSettingsTypes';
import type { PriceItem } from '../config/siteSettingsTypes';
import { theme, getColor } from '../theme/colors';

const NavWrapper = styled(Box)({
  borderTop: `1px solid ${theme.colors.neutral[200]}`,
  borderBottom: `1px solid ${theme.colors.neutral[200]}`,
  background: theme.colors.ui.white,
  width: '100%', // Full width like Etsy
});

const NavInner = styled(Container)({
  maxWidth: 'none', // No max width like Etsy
  width: '100%', // Full width
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px',
  padding: '10px 24px', // More padding like Etsy
  flexWrap: 'nowrap',
  '@media (max-width: 968px)': {
    flexWrap: 'wrap',
  },
  '@media (max-width: 768px)': {
    display: 'none', // Hidden on mobile, only MobileNavInner shows
  },
});

// Mobile version that shows when menu is clicked
const MobileNavInner = styled(Container, {
  shouldForwardProp: (prop) => prop !== '$mobileMenuOpen',
})<{ $mobileMenuOpen?: boolean }>(({ $mobileMenuOpen }) => ({
  maxWidth: '1400px',
  display: $mobileMenuOpen ? 'flex' : 'none', // Show when menu is open
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px',
  padding: '10px 16px',
  flexWrap: 'nowrap',
  position: 'relative', // Normal positioning, not fixed
  backgroundColor: theme.colors.ui.white,
  boxShadow: `0 4px 20px ${theme.colors.ui.shadow}`,
  borderBottom: `1px solid ${theme.colors.neutral[200]}`,
  '@media (max-width: 968px)': {
    flexWrap: 'wrap',
  },
  '@media (max-width: 768px)': {
    flexDirection: 'column',
    alignItems: 'stretch',
    padding: '12px 16px',
  },
}));

const CategoriesButton = styled('button')({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing.sm, // 10px
  padding: `${theme.spacing.sm} ${theme.spacing.md}`, // 10px 14px
  borderRadius: theme.borderRadius.full,
  border: 'none',
  cursor: 'pointer',
  background: `linear-gradient(135deg, ${theme.colors.primary.main} 0%, ${theme.colors.primary.dark} 100%)`,
  color: theme.colors.ui.white,
  fontWeight: 900,
  fontSize: theme.fontSizes.sm, // 13px
  transition: 'all 0.2s ease',
  whiteSpace: 'nowrap',
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: `0 4px 12px ${theme.colors.primary.main}66`, // Add alpha for shadow
  },
  '@media (max-width: 768px)': {
    width: '100%',
    justifyContent: 'center',
  },
});

const MenuLinks = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '14px',
  flexWrap: 'nowrap',
  flex: '1 1 auto',
  justifyContent: 'center',
  '@media (max-width: 968px)': {
    flexWrap: 'wrap',
    gap: '12px',
  },
  '@media (max-width: 768px)': {
    justifyContent: 'center', // Center-align on mobile like desktop
    gap: '12px',
    width: '100%',
    flexDirection: 'row', // Keep horizontal layout on mobile
    alignItems: 'center',
  },
});

const MenuLink = styled(Link, {
  shouldForwardProp: (prop) => prop !== '$active',
})<{ $active?: boolean }>(({ $active }) => ({
  textDecoration: 'none',
  color: $active ? theme.colors.primary.main : theme.colors.neutral[900],
  fontWeight: '500',
  fontSize: theme.fontSizes.base,
  textTransform: 'none',
  letterSpacing: 'normal',
  opacity: 1,
  transition: 'all 0.2s ease',
  whiteSpace: 'nowrap',
  flexShrink: 0,
  padding: `${theme.spacing.sm} ${theme.spacing.md}`, // 8px 12px
  borderRadius: theme.borderRadius.xl, // 20px
  '&:hover': {
    backgroundColor: theme.colors.primary.background,
    color: $active ? theme.colors.primary.main : theme.colors.neutral[900],
  },
  '@media (max-width: 768px)': {
    fontSize: theme.fontSizes.sm, // 13px
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    textAlign: 'center',
    width: 'auto',
    borderRadius: theme.borderRadius.xl,
  },
  '@media (max-width: 414px)': {
    fontSize: theme.fontSizes.sm, // 12px
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`, // 6px 10px
  },
  '@media (max-width: 375px)': {
    fontSize: theme.fontSizes.xs, // 11px
    padding: `${theme.spacing.xs} ${theme.spacing.xs}`, // 4px 8px
  },
}));

const CartInfo = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  flexShrink: 0,
  '@media (max-width: 768px)': {
    justifyContent: 'center',
    width: '100%',
    paddingTop: '8px',
    borderTop: `1px solid ${theme.colors.neutral[200]}`,
  },
});

const CartLabel = styled('div')({
  fontSize: '12px',
  fontWeight: 800,
  color: theme.colors.neutral[900],
  opacity: 0.75,
});

const CartTotal = styled('div')({
  fontSize: '12px',
  fontWeight: 900,
  color: theme.colors.neutral[900],
});

function PriceProductBlock({
  item,
  currency,
  formatPrice,
}: {
  item: PriceItem;
  currency: string;
  formatPrice: (n: number) => string;
}) {
  const unit = (item.unitLabel || '').trim();
  const suffix = unit ? (unit.startsWith(' ') ? unit : ' ' + unit) : '';
  const localVal = item.localPrice;
  const worldVal = item.worldPrice;

  return (
    <Box
      sx={{
        border: `1px solid ${theme.colors.neutral[200]}`,
        borderRadius: 4,
        p: { xs: 1.5, sm: 2 }, // Smaller padding on mobile
        background: theme.colors.ui.white,
        boxShadow: `0 10px 30px ${theme.colors.ui.shadow}`,
      }}
    >
      <Box sx={{ 
        fontWeight: 950, 
        fontSize: { xs: '12px', sm: '14px' }, // Smaller on mobile
        color: theme.colors.neutral[900] 
      }}>{item.name}</Box>
      <Box sx={{ 
        mt: { xs: 1, sm: 1.5 }, 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: { xs: 1, sm: 1.5 } 
      }}>
        <Box
          sx={{
            borderRadius: 3,
            background: `linear-gradient(135deg, ${theme.colors.primary.background} 0%, ${theme.colors.ui.white} 100%)`,
            border: `1px solid ${theme.colors.neutral[200]}`,
            p: { xs: 1, sm: 1.75 }, // Smaller padding on mobile
          }}
        >
          <Box sx={{ 
            fontSize: { xs: '10px', sm: '12px' }, 
            fontWeight: 900, 
            color: theme.colors.neutral[700] 
          }}>Local</Box>
          <Box sx={{ 
            mt: 0.5, 
            fontSize: { xs: '14px', sm: '16px' }, 
            fontWeight: 700, 
            color: theme.colors.neutral[900] 
          }}>
            {localVal != null ? `${formatPrice(localVal)} ${currency}${suffix}` : 'N/A'}
          </Box>
          {localVal == null && (
            <Box sx={{ 
              mt: 0.5, 
              fontSize: { xs: '10px', sm: '12px' }, 
              fontWeight: 700, 
              color: theme.colors.neutral[600] 
            }}>
              {item.localEmptyMessage || 'No local price'}
            </Box>
          )}
        </Box>
        <Box
          sx={{
            borderRadius: 3,
            background: `linear-gradient(135deg, ${theme.colors.primary.background} 0%, ${theme.colors.ui.white} 100%)`,
            border: `1px solid ${theme.colors.neutral[200]}`,
            p: { xs: 1, sm: 1.75 }, // Smaller padding on mobile
          }}
        >
          <Box sx={{ 
            fontSize: { xs: '10px', sm: '12px' }, 
            fontWeight: 900, 
            color: theme.colors.neutral[700] 
          }}>World</Box>
          <Box sx={{ 
            mt: 0.5, 
            fontSize: { xs: '16px', sm: '22px' }, // Smaller on mobile
            fontWeight: 950, 
            color: theme.colors.neutral[900], 
            letterSpacing: '-0.02em' 
          }}>
            {`${formatPrice(worldVal)} ${currency}${suffix}`}
          </Box>
          {item.worldReferenceLabel && (
            <Box sx={{ 
              mt: 0.5, 
              fontSize: { xs: '10px', sm: '12px' }, 
              fontWeight: 700, 
              color: theme.colors.neutral[600] 
            }}>
              {item.worldReferenceLabel}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default function CategoryNavigation() {
  const location = useLocation();
  const { getTotalPrice } = useCart();
  const { settings } = useSiteSettings();
  const { mobileMenuOpen } = useMobileMenu();
  
  console.log('CategoryNavigation - mobileMenuOpen:', mobileMenuOpen);
  console.log('CategoryNavigation - rendering MobileNavInner');
  const rawNavLinks = settings.navLinks?.length ? settings.navLinks : DEFAULT_NAV_LINKS;
  // Filter out placeholder/invalid links (empty labels, "New link", etc.)
  const navigationItems = rawNavLinks.filter((item) => {
    const label = (item.label || '').trim();
    const path = (item.path || '').trim();
    // Remove entries with empty labels or placeholder labels
    if (!label) return false;
    const labelLower = label.toLowerCase();
    if (labelLower === 'new link' || labelLower === 'new' || labelLower === 'newlink') return false;
    // Path must be valid (non-empty)
    if (!path) return false;
    return true;
  });
  const cartTotal = getTotalPrice();
  const [pricesOpen, setPricesOpen] = useState(false);
  const vis = { ...DEFAULT_SECTION_VISIBILITY, ...(settings.sectionVisibility ?? {}) };
  const showPricesBtn = vis.pricesButton !== false;
  const pricesLabel = (vis.pricesButtonLabel || 'PRICES').trim() || 'PRICES';
  const mp = settings.marketPrices ?? DEFAULT_MARKET_PRICES;
  const currency = (mp.currency || 'FCFA').trim() || 'FCFA';
  const priceItems = (mp.priceItems ?? DEFAULT_PRICE_ITEMS).filter((it) => (it.name ?? '').trim());

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <>
      <NavWrapper>
        <NavInner>
          {showPricesBtn && (
            <CategoriesButton type="button" onClick={() => setPricesOpen(true)}>
              <Menu size={18} />
              {pricesLabel}
              <ChevronDown size={16} />
            </CategoriesButton>
          )}

          <MenuLinks>
            {navigationItems.map((item) => (
              <MenuLink 
                key={item.path} 
                to={item.path}
                $active={location.pathname === item.path}
              >
                {item.label}
              </MenuLink>
            ))}
          </MenuLinks>

          <CartInfo>
            <CartLabel>My cart</CartLabel>
            <CartTotal>{formatPrice(cartTotal)} FCFA</CartTotal>
          </CartInfo>
        </NavInner>
      </NavWrapper>

      {/* Mobile version - shows when menu is clicked */}
      <MobileNavInner $mobileMenuOpen={mobileMenuOpen}>
        {showPricesBtn && (
          <CategoriesButton type="button" onClick={() => setPricesOpen(true)}>
            <Menu size={18} />
            {pricesLabel}
            <ChevronDown size={16} />
          </CategoriesButton>
        )}

        <MenuLinks>
          {navigationItems.map((item) => (
            <MenuLink 
              key={item.path} 
              to={item.path}
              $active={location.pathname === item.path}
            >
              {item.label}
            </MenuLink>
          ))}
        </MenuLinks>

        <CartInfo>
          <CartLabel>My cart</CartLabel>
          <CartTotal>{formatPrice(cartTotal)} FCFA</CartTotal>
        </CartInfo>
      </MobileNavInner>

      {/* Prices Modal */}
      <Dialog 
        open={pricesOpen} 
        onClose={() => setPricesOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            padding: '16px',
            margin: '16px', // Add margin for mobile
            maxHeight: '80vh', // Limit height on mobile
            overflow: 'auto', // Allow scrolling if needed
          }
        }}
      >
        <DialogTitle sx={{ 
          fontSize: { xs: '18px', sm: '20px' }, // Smaller on mobile
          fontWeight: 'bold', 
          textAlign: 'center',
          paddingBottom: { xs: '12px', sm: '16px' },
        }}>
          Market Prices
        </DialogTitle>
        <DialogContent sx={{ padding: { xs: '8px', sm: '16px' } }}>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, 
            gap: { xs: '12px', sm: '16px' }
          }}>
            {priceItems.map((item, index) => (
              <PriceProductBlock
                key={index}
                item={item}
                currency={currency}
                formatPrice={formatPrice}
              />
            ))}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
            
