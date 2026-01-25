import { useEffect, useMemo, useRef, useState } from 'react';
import { X, Send } from 'lucide-react';
import type { Product } from '../../context/CartContext';
import { getThreadMessages, makeThreadId, maybeAutoReply, sendBuyerMessage } from '../../utils/chatStore';

type Props = {
  open: boolean;
  onClose: () => void;
  product?: Product;
  sellerId: string;
  sellerName: string;
};

export default function ChatDrawer({ open, onClose, product, sellerId, sellerName }: Props) {
  const threadId = useMemo(() => makeThreadId(sellerId, product?.id), [sellerId, product?.id]);
  const [draft, setDraft] = useState('');
  const [version, setVersion] = useState(0);
  const listRef = useRef<HTMLDivElement | null>(null);

  const messages = useMemo(() => getThreadMessages(threadId), [threadId, version]);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
    }, 0);
    return () => window.clearTimeout(t);
  }, [open, messages.length]);

  if (!open) return null;

  const handleSend = () => {
    const body = draft.trim();
    if (!body) return;
    setDraft('');
    sendBuyerMessage({
      threadId,
      sellerId,
      sellerName,
      productId: product?.id,
      productName: product?.name,
      body
    });
    setVersion((v) => v + 1);

    window.setTimeout(() => {
      maybeAutoReply(threadId, sellerId, product?.id);
      setVersion((v) => v + 1);
    }, 700);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.35)',
        zIndex: 4000,
        display: 'flex',
        justifyContent: 'flex-end'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(420px, 100%)',
          height: '100%',
          background: '#ffffff',
          boxShadow: '-20px 0 60px rgba(0,0,0,0.25)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div
          style={{
            padding: '14px 14px 12px',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px'
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '14px', fontWeight: 900, color: '#111827', lineHeight: 1.2 }}>
              Chat with {sellerName}
            </div>
            {product?.name && (
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#6b7280', marginTop: '2px' }}>
                About: {product.name}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              background: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label="Close chat"
          >
            <X size={18} />
          </button>
        </div>

        <div
          ref={listRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '14px',
            background: '#f9fafb'
          }}
        >
          {messages.length === 0 ? (
            <div style={{ color: '#6b7280', fontWeight: 700, fontSize: '13px', padding: '10px 2px' }}>
              Say hello to the seller. Ask about availability, delivery, or product details.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {messages.map((m) => {
                const mine = m.sender === 'buyer';
                return (
                  <div
                    key={m.id}
                    style={{
                      display: 'flex',
                      justifyContent: mine ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <div
                      style={{
                        maxWidth: '85%',
                        padding: '10px 12px',
                        borderRadius: mine ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                        background: mine ? '#111827' : '#ffffff',
                        color: mine ? '#ffffff' : '#111827',
                        border: mine ? 'none' : '1px solid #e5e7eb',
                        boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
                        fontSize: '13px',
                        lineHeight: 1.5,
                        whiteSpace: 'pre-wrap'
                      }}
                    >
                      {m.body}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div style={{ padding: '12px', borderTop: '1px solid #e5e7eb', background: '#ffffff' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Write your message"
              style={{
                flex: 1,
                padding: '12px 12px',
                borderRadius: '12px',
                border: '1px solid #d1d5db',
                outline: 'none',
                fontSize: '14px'
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
            />
            <button
              onClick={handleSend}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                border: 'none',
                background: '#111827',
                color: '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              aria-label="Send"
            >
              <Send size={18} />
            </button>
          </div>
          <div style={{ marginTop: '8px', fontSize: '11px', color: '#9ca3af', fontWeight: 700 }}>
            This is a built-in chat demo (messages saved on this device).
          </div>
        </div>
      </div>
    </div>
  );
}

