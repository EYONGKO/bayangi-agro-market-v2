import { Heart, ShoppingCart, ArrowLeft } from 'lucide-react';
import { theme } from '../../theme/colors';

type Props = {
  title: string;
  cartCount: number;
  wishlistCount: number;
  onBack: () => void;
  onGoToCart: () => void;
  onGoToWishlist: () => void;
};

const GlobalMarketHeader = ({ title, cartCount, wishlistCount, onBack, onGoToCart, onGoToWishlist }: Props) => {
  return (
    <div
      style={{
        background: 'white',
        padding: '14px 18px',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        borderBottom: '1px solid #e9ecef'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto'
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '10px',
            padding: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          aria-label="Back"
        >
          <ArrowLeft size={22} color={theme.colors.neutral[900]} />
        </button>

        <div style={{ fontSize: '18px', fontWeight: 800, color: theme.colors.neutral[900] }}>{title}</div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={onGoToWishlist}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '10px',
              padding: '10px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label="Wishlist"
          >
            <Heart size={22} color={theme.colors.neutral[900]} />
            {wishlistCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  background: theme.colors.primary.main,
                  color: 'white',
                  borderRadius: '999px',
                  minWidth: '18px',
                  height: '18px',
                  padding: '0 6px',
                  fontSize: '11px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {wishlistCount}
              </span>
            )}
          </button>

          <button
            onClick={onGoToCart}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '10px',
              padding: '10px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label="Cart"
          >
            <ShoppingCart size={22} color={theme.colors.neutral[900]} />
            {cartCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  background: theme.colors.primary.light,
                  color: 'white',
                  borderRadius: '999px',
                  minWidth: '18px',
                  height: '18px',
                  padding: '0 6px',
                  fontSize: '11px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GlobalMarketHeader;
