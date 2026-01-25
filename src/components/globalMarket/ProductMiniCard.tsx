import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../../context/CartContext';
import { theme } from '../../theme/colors';

type Props = {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
  onAddToCart: () => void;
  style?: React.CSSProperties;
};

const ProductMiniCard = ({ product, isWishlisted, onToggleWishlist, onAddToCart, style }: Props) => {
  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatReviewCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') navigate(`/product/${product.id}`);
      }}
      role="button"
      tabIndex={0}
      style={{
        flex: '0 0 auto',
        width: '240px',
        textDecoration: 'none',
        color: 'inherit',
        cursor: 'pointer',
        outline: 'none',
        background: 'transparent',
        borderRadius: '8px',
        overflow: 'hidden',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        border: '1px solid rgba(226, 232, 240, 1)',
        ...style
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{ position: 'relative', width: '100%', height: '340px', background: '#f1f5f9' }}>
        <img
          src={product.image}
          alt={product.name}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block'
          }}
          loading="lazy"
        />

        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            padding: '12px',
            background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 70%, rgba(0,0,0,0.78) 100%)',
            color: '#ffffff'
          }}
        >
          <div
            style={{
              fontSize: '14px',
              fontWeight: 800,
              marginBottom: '6px',
              lineHeight: 1.35,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {product.name}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Star size={14} color={theme.colors.ui.white} fill={theme.colors.ui.white} />
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff' }}>
                  {product.rating?.toFixed(1) ?? '0.0'}
                </span>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>
                  ({formatReviewCount(product.reviews ?? 0)})
                </span>
              </div>
              <div style={{ marginTop: '6px', fontSize: '16px', fontWeight: 900, color: '#ffffff' }}>
                {formatPrice(product.price)} FCFA
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onAddToCart();
              }}
              style={{
                height: '40px',
                padding: '0 12px',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.35)',
                background: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(8px)',
                color: '#ffffff',
                fontWeight: 900,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              aria-label="Add to cart"
            >
              <ShoppingCart size={16} color={theme.colors.primary.main} />
              Add
            </button>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleWishlist();
          }}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: 'none',
            background: 'rgba(255, 255, 255, 0.35)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 3,
            transition: 'all 0.2s ease'
          }}
          aria-label="Add to wishlist"
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.6)';
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.35)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Heart 
              size={24} 
              color={isWishlisted ? theme.colors.primary.main : theme.colors.neutral[600]} 
              fill={isWishlisted ? theme.colors.primary.main : 'none'}
              strokeWidth={2}
              style={{ 
                display: 'block',
                pointerEvents: 'none'
              }}
            />
            <span style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '10px',
              fontWeight: '700',
              color: isWishlisted ? '#ffffff' : '#374151',
              pointerEvents: 'none',
              lineHeight: 1
            }}>
              {(product.likes ?? 0) + (isWishlisted ? 1 : 0)}
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default ProductMiniCard;
