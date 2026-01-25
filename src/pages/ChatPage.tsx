import { useMemo, useState } from 'react';
import { Search, Send } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import { getThreadMessages, loadThreads, maybeAutoReply, sendBuyerMessage } from '../utils/chatStore';

export default function ChatPage() {
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [q, setQ] = useState('');
  const [draft, setDraft] = useState('');
  const [version, setVersion] = useState(0);

  const threads = useMemo(() => {
    const all = loadThreads();
    const qq = q.trim().toLowerCase();
    if (!qq) return all;
    return all.filter((t) => (t.sellerName + ' ' + (t.productName ?? '')).toLowerCase().includes(qq));
  }, [q, version]);

  const activeThread = useMemo(() => threads.find((t) => t.id === selectedThreadId) ?? null, [threads, selectedThreadId]);
  const messages = useMemo(() => (activeThread ? getThreadMessages(activeThread.id) : []), [activeThread, version]);

  const selectFirstIfNeeded = () => {
    if (!selectedThreadId && threads.length > 0) setSelectedThreadId(threads[0].id);
  };
  selectFirstIfNeeded();

  const handleSend = () => {
    if (!activeThread) return;
    const body = draft.trim();
    if (!body) return;
    setDraft('');
    sendBuyerMessage({
      threadId: activeThread.id,
      sellerId: activeThread.sellerId,
      sellerName: activeThread.sellerName,
      productId: activeThread.productId,
      productName: activeThread.productName,
      body
    });
    setVersion((v) => v + 1);
    window.setTimeout(() => {
      maybeAutoReply(activeThread.id, activeThread.sellerId, activeThread.productId);
      setVersion((v) => v + 1);
    }, 700);
  };

  return (
    <PageLayout showCategoryNav={false}>
      <div style={{ background: '#f8fafc', minHeight: 'calc(100vh - 160px)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '340px 1fr',
              gap: '18px',
              alignItems: 'stretch'
            }}
          >
            {/* Sidebar */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '16px',
                overflow: 'hidden',
                height: 'calc(100vh - 220px)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ padding: '14px 14px 10px', borderBottom: '1px solid #e5e7eb' }}>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#111827' }}>Chat</div>
                <div style={{ position: 'relative', marginTop: '10px' }}>
                  <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search chat"
                    style={{
                      width: '100%',
                      padding: '12px 12px 12px 40px',
                      borderRadius: '12px',
                      border: '1px solid #e5e7eb',
                      outline: 'none',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              <div style={{ overflowY: 'auto', padding: '10px' }}>
                {threads.length === 0 ? (
                  <div style={{ padding: '12px', color: '#6b7280', fontWeight: 700, fontSize: '13px' }}>
                    No messages yet. Open any product and click the chat bubble to start a conversation.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {threads.map((t) => {
                      const active = t.id === selectedThreadId;
                      return (
                        <button
                          key={t.id}
                          onClick={() => setSelectedThreadId(t.id)}
                          style={{
                            border: '1px solid #e5e7eb',
                            background: active ? '#111827' : '#ffffff',
                            color: active ? '#ffffff' : '#111827',
                            borderRadius: '14px',
                            padding: '12px',
                            cursor: 'pointer',
                            textAlign: 'left'
                          }}
                        >
                          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <div
                              style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '12px',
                                background: active ? 'rgba(255,255,255,0.16)' : '#f3f4f6',
                                border: active ? '1px solid rgba(255,255,255,0.22)' : '1px solid rgba(17,24,39,0.12)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 900
                              }}
                            >
                              {t.sellerAvatarText}
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontWeight: 900, fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {t.sellerName}
                              </div>
                              <div style={{ fontSize: '12px', opacity: active ? 0.8 : 0.7, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {t.productName ? `About: ${t.productName}` : 'General chat'}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Main */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '16px',
                overflow: 'hidden',
                height: 'calc(100vh - 220px)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ padding: '14px 16px', borderBottom: '1px solid #e5e7eb' }}>
                <div style={{ fontSize: '16px', fontWeight: 900, color: '#111827' }}>
                  {activeThread ? activeThread.sellerName : 'Select a chat'}
                </div>
                {activeThread?.productName && (
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#6b7280', marginTop: '2px' }}>
                    {activeThread.productName}
                  </div>
                )}
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: '16px', background: '#f9fafb' }}>
                {!activeThread ? (
                  <div style={{ color: '#6b7280', fontWeight: 700, fontSize: '13px' }}>Pick a conversation to start.</div>
                ) : messages.length === 0 ? (
                  <div style={{ color: '#6b7280', fontWeight: 700, fontSize: '13px' }}>
                    No messages yet. Say hello!
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {messages.map((m) => {
                      const mine = m.sender === 'buyer';
                      return (
                        <div key={m.id} style={{ display: 'flex', justifyContent: mine ? 'flex-end' : 'flex-start' }}>
                          <div
                            style={{
                              maxWidth: '70%',
                              padding: '10px 12px',
                              borderRadius: mine ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                              background: mine ? '#111827' : '#ffffff',
                              color: mine ? '#ffffff' : '#111827',
                              border: mine ? 'none' : '1px solid #e5e7eb',
                              boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
                              fontSize: '13px',
                              lineHeight: 1.5
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
                    disabled={!activeThread}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!activeThread}
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      border: 'none',
                      background: activeThread ? '#111827' : '#9ca3af',
                      color: '#ffffff',
                      cursor: activeThread ? 'pointer' : 'not-allowed',
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
                  Built-in chat demo (messages saved on this device).
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '12px', fontSize: '12px', color: '#6b7280', fontWeight: 700 }}>
            Tip: Buyers trust sellers more when they can chat directly. You can also use WhatsApp/Call from product pages.
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

