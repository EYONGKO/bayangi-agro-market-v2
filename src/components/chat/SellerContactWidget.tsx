import { useMemo, useState } from 'react';
import { MessageCircle, Phone, X } from 'lucide-react';
import type { Product } from '../../context/CartContext';
import ChatDrawer from './ChatDrawer';
import { createPortal } from 'react-dom';
import { theme } from '../../theme/colors';

type Props = {
  product: Product;
  sellerName?: string;
  sellerId?: string;
  sellerPhone?: string;
  sellerWhatsApp?: string;
};

function normalizeE164(input?: string) {
  if (!input) return '';
  const trimmed = input.trim();
  if (trimmed.startsWith('+')) return trimmed;
  // if digits only, assume Cameroon +237
  const digits = trimmed.replace(/[^\d]/g, '');
  if (!digits) return '';
  return digits.startsWith('237') ? `+${digits}` : `+237${digits}`;
}

export default function SellerContactWidget({
  product,
  sellerName,
  sellerId,
  sellerPhone,
  sellerWhatsApp
}: Props) {
  const [open, setOpen] = useState(false);

  const resolvedSellerName = sellerName || product.vendor || 'Seller';
  const resolvedSellerId = sellerId || product.sellerId || (product.vendor ? product.vendor.toLowerCase().replace(/\s+/g, '-') : 'seller');
  const wa = normalizeE164(sellerWhatsApp || product.sellerWhatsApp || product.sellerPhone);
  const phone = normalizeE164(sellerPhone || product.sellerPhone || product.sellerWhatsApp);

  const waLink = useMemo(() => {
    if (!wa) return '';
    const digits = wa.replace(/[^\d]/g, '');
    const text = encodeURIComponent(
      `Hi ${resolvedSellerName}, I'm interested in "${product.name}". Is it available?`
    );
    return `https://wa.me/${digits}?text=${text}`;
  }, [wa, resolvedSellerName, product.name]);

  const ui = (
    <>
      <div
        style={{
          position: 'fixed',
          right: '18px',
          bottom: '18px',
          zIndex: 99999
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            background: '#ffffff',
            border: '1px solid rgba(17,24,39,0.12)',
            boxShadow: '0 14px 36px rgba(0,0,0,0.18)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          onClick={() => setOpen(true)}
          aria-label="Open chat"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') setOpen(true);
          }}
        >
          <MessageCircle size={24} color={theme.colors.primary.main} />
        </div>
      </div>

      {/* Compact actions bar when open */}
      {open && (
        <div
          style={{
            position: 'fixed',
            right: '18px',
            bottom: '92px',
            zIndex: 99999,
            display: 'flex',
            gap: '10px'
          }}
        >
          {waLink && (
            <a
              href={waLink}
              target="_blank"
              rel="noreferrer"
              style={{
                textDecoration: 'none',
                background: '#25D366',
                color: '#ffffff',
                padding: '10px 12px',
                borderRadius: '14px',
                fontWeight: 900,
                fontSize: '12px',
                boxShadow: '0 10px 24px rgba(0,0,0,0.18)'
              }}
            >
              WhatsApp
            </a>
          )}
          {phone && (
            <a
              href={`tel:${phone}`}
              style={{
                textDecoration: 'none',
                background: '#111827',
                color: '#ffffff',
                padding: '10px 12px',
                borderRadius: '14px',
                fontWeight: 900,
                fontSize: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 10px 24px rgba(0,0,0,0.18)'
              }}
            >
              <Phone size={16} />
              Call
            </a>
          )}
          <button
            onClick={() => setOpen(false)}
            style={{
              background: '#ffffff',
              border: '1px solid rgba(17,24,39,0.12)',
              color: '#111827',
              padding: '10px 12px',
              borderRadius: '14px',
              fontWeight: 900,
              fontSize: '12px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 10px 24px rgba(0,0,0,0.18)'
            }}
            aria-label="Close actions"
          >
            <X size={16} />
            Close
          </button>
        </div>
      )}

      <ChatDrawer
        open={open}
        onClose={() => setOpen(false)}
        product={product}
        sellerId={resolvedSellerId}
        sellerName={resolvedSellerName}
      />
    </>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(ui, document.body);
}

