import { ChevronRight } from 'lucide-react';
import type { Product } from '../../context/CartContext';
import ProductMiniCard from './ProductMiniCard';

type Props = {
  label?: string;
  curatorName?: string;
  curatorLabel?: string;
  title: string;
  subtitle?: string;
  products: Product[];
  onBrowseAll: () => void;
  isWishlisted: (productId: number) => boolean;
  onToggleWishlist: (productId: number) => void;
  onAddToCart: (product: Product) => void;
};

const ProductCarouselSection = ({
  curatorName,
  title,
  subtitle,
  products,
  onBrowseAll,
  isWishlisted,
  onToggleWishlist,
  onAddToCart
}: Props) => {
  if (products.length === 0) return null;

  const avatarText = (curatorName ?? title).trim().slice(0, 1).toUpperCase();

  return (
    <div style={{ padding: '40px 0', background: 'white' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '24px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '10px',
                background: '#f3f4f6',
                border: '1px solid #e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '18px',
                color: '#111827',
                flexShrink: 0
              }}
            >
              {avatarText}
            </div>

            <div>
              <div style={{ fontSize: '22px', fontWeight: 700, color: '#111827', marginBottom: '4px', lineHeight: 1.2 }}>
                {title}
              </div>
              {subtitle && (
                <div style={{ fontSize: '15px', fontWeight: 400, color: '#6b7280' }}>
                  {subtitle}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={onBrowseAll}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#111827',
              fontWeight: 600,
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '8px 0',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#ef4444';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#111827';
            }}
          >
            Browse all
            <ChevronRight size={16} />
          </button>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '20px',
            overflowX: 'auto',
            padding: '8px 0 20px',
            scrollbarWidth: 'thin',
            scrollbarColor: '#e5e7eb transparent',
            WebkitOverflowScrolling: 'touch'
          }}
          onWheel={(e) => {
            e.currentTarget.scrollLeft += e.deltaY;
          }}
        >
          {products.map((p) => (
            <ProductMiniCard
              key={p.id}
              product={p}
              isWishlisted={isWishlisted(p.id)}
              onToggleWishlist={() => onToggleWishlist(p.id)}
              onAddToCart={() => onAddToCart(p)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCarouselSection;
