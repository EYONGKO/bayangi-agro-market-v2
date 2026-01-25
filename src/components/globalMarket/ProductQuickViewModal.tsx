import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, X, Star } from 'lucide-react';
import type { Product } from '../../context/CartContext';
import SellerContactWidget from '../chat/SellerContactWidget';
import { theme } from '../../theme/colors';

type Props = {
  open: boolean;
  product: Product | null;
  isWishlisted: boolean;
  onClose: () => void;
  onToggleWishlist: () => void;
  onAddToCart: () => void;
};

const ProductQuickViewModal = ({ open, product, isWishlisted, onClose, onToggleWishlist, onAddToCart }: Props) => {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open || !product) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.55)',
        zIndex: 3000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '18px'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(980px, 100%)',
          background: 'white',
          borderRadius: '18px',
          overflow: 'hidden',
          boxShadow: '0 24px 80px rgba(0,0,0,0.35)'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '14px 14px 10px',
            borderBottom: '1px solid #e5e7eb'
          }}
        >
          <div style={{ fontSize: '14px', fontWeight: 900, color: '#111827' }}>Quick view</div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '10px',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#111827'
            }}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)',
            gap: '0',
            alignItems: 'stretch'
          }}
        >
          <div style={{ background: '#f3f4f6', position: 'relative' }}>
            <img
              src={product.image}
              alt={product.name}
              style={{ width: '100%', height: '520px', objectFit: 'cover', display: 'block' }}
            />
          </div>

          <div style={{ padding: '16px 16px 18px' }}>
            <div style={{ fontSize: '16px', fontWeight: 900, color: '#111827', lineHeight: 1.25 }}>
              {product.name}
            </div>

            <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ fontSize: '18px', fontWeight: 900, color: '#111827' }}>
                {product.price.toLocaleString()} CFA
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#111827' }}>
                <Star size={14} color="#111827" fill="#111827" />
                <span style={{ fontSize: '12px', fontWeight: 900 }}>{product.rating ?? 0}</span>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>({product.reviews ?? 0})</span>
              </div>
            </div>

            <div style={{ marginTop: '10px', fontSize: '12px', color: '#6b7280', lineHeight: 1.5 }}>
              {product.description}
            </div>

            <div style={{ marginTop: '14px', display: 'flex', gap: '10px' }}>
              <button
                onClick={onToggleWishlist}
                style={{
                  flex: '0 0 auto',
                  width: '46px',
                  height: '46px',
                  borderRadius: '999px',
                  border: '1px solid #e5e7eb',
                  background: 'white',
                  color: isWishlisted ? '#ff4757' : '#111827',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                aria-label="Toggle wishlist"
              >
                <Heart size={18} style={{ fill: isWishlisted ? 'currentColor' : 'transparent' }} />
              </button>

              <button
                onClick={onAddToCart}
                style={{
                  flex: '1 1 auto',
                  background: '#111827',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px 14px',
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px'
                }}
              >
                <ShoppingCart size={18} color={theme.colors.primary.main} />
                Add to cart
              </button>
            </div>

            <Link
              to={`/product/${product.id}`}
              state={{ product }}
              style={{
                marginTop: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                padding: '12px 14px',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                color: '#111827',
                textDecoration: 'none',
                fontWeight: 900
              }}
            >
              View details
            </Link>
          </div>
        </div>
      </div>
      <SellerContactWidget
        product={product}
        sellerName={product.vendor}
        sellerId={product.sellerId}
        sellerPhone={product.sellerPhone}
        sellerWhatsApp={product.sellerWhatsApp}
      />
    </div>
  );
};

export default ProductQuickViewModal;
