export type ChatMessage = {
  id: string;
  threadId: string;
  productId?: number;
  sellerId: string;
  sender: 'buyer' | 'seller';
  body: string;
  createdAt: string; // ISO
  timestamp?: number; // For easier date handling
};

export type ChatThread = {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerAvatarText: string;
  productId?: number;
  productName?: string;
  updatedAt: string; // ISO
  lastMessageAt?: number; // For easier date handling
};

const THREADS_KEY = 'local-roots-chat-threads-v1';
const MESSAGES_KEY = 'local-roots-chat-messages-v1';

const canUseStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function nowIso() {
  return new Date().toISOString();
}

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

export function makeThreadId(sellerId: string, productId?: number) {
  return productId ? `${sellerId}::product::${productId}` : `${sellerId}::inbox`;
}

export function loadThreads(): ChatThread[] {
  const parsed = canUseStorage() ? safeParse<ChatThread[]>(window.localStorage.getItem(THREADS_KEY)) : null;
  return Array.isArray(parsed) ? parsed : [];
}

export function saveThreads(threads: ChatThread[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(THREADS_KEY, JSON.stringify(threads));
}

export function loadMessages(): ChatMessage[] {
  const parsed = canUseStorage() ? safeParse<ChatMessage[]>(window.localStorage.getItem(MESSAGES_KEY)) : null;
  return Array.isArray(parsed) ? parsed : [];
}

export function saveMessages(messages: ChatMessage[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
}

export function upsertThread(input: Omit<ChatThread, 'id' | 'updatedAt'> & { id: string }): ChatThread {
  const threads = loadThreads();
  const existingIdx = threads.findIndex((t) => t.id === input.id);
  const updated: ChatThread = { 
    ...input, 
    updatedAt: nowIso(),
    lastMessageAt: Date.now()
  };

  const next =
    existingIdx >= 0
      ? [updated, ...threads.filter((t) => t.id !== input.id)]
      : [updated, ...threads];

  saveThreads(next);
  return updated;
}

export function getThreadMessages(threadId: string): ChatMessage[] {
  return loadMessages()
    .filter((m) => m.threadId === threadId)
    .map((m) => ({
      ...m,
      timestamp: m.timestamp || new Date(m.createdAt).getTime()
    }))
    .sort((a, b) => {
      const timeA = a.timestamp || new Date(a.createdAt).getTime();
      const timeB = b.timestamp || new Date(b.createdAt).getTime();
      return timeA - timeB;
    });
}

export function sendBuyerMessage(params: {
  threadId: string;
  sellerId: string;
  sellerName: string;
  productId?: number;
  productName?: string;
  body: string;
}): ChatMessage {
  const thread = upsertThread({
    id: params.threadId,
    sellerId: params.sellerId,
    sellerName: params.sellerName,
    sellerAvatarText: params.sellerName.trim().slice(0, 1).toUpperCase() || 'S',
    productId: params.productId,
    productName: params.productName
  });

  const msg: ChatMessage = {
    id: uid(),
    threadId: thread.id,
    sellerId: params.sellerId,
    productId: params.productId,
    sender: 'buyer',
    body: params.body.trim(),
    createdAt: nowIso(),
    timestamp: Date.now()
  };

  const messages = loadMessages();
  const next = [...messages, msg];
  saveMessages(next);
  return msg;
}

// Simple “auto-reply” to make the built-in chat feel functional without backend
export function maybeAutoReply(threadId: string, sellerId: string, productId?: number): ChatMessage | null {
  const templates = [
    'Thanks for reaching out! I’m here to help.',
    'Yes, it’s available. Do you want delivery or pickup?',
    'Great question — what quantity do you need?',
    'Sure! I can share more photos if you want.'
  ];
  const pick = templates[Math.floor(Math.random() * templates.length)];

  const msg: ChatMessage = {
    id: uid(),
    threadId,
    sellerId,
    productId,
    sender: 'seller',
    body: pick,
    createdAt: nowIso(),
    timestamp: Date.now()
  };

  const messages = loadMessages();
  saveMessages([...messages, msg]);
  return msg;
}

