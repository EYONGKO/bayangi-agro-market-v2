import { Search } from 'lucide-react';
import type { ChatThread } from '../../utils/chatStore';
import { getThreadMessages } from '../../utils/chatStore';

interface ChatListProps {
  threads: ChatThread[];
  selectedThreadId: string | null;
  onSelectThread: (threadId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function ChatList({
  threads,
  selectedThreadId,
  onSelectThread,
  searchQuery,
  onSearchChange
}: ChatListProps) {
  const formatDate = (timestamp: number | undefined) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const threadDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    if (threadDate.getTime() === today.getTime()) {
      return 'Today';
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (threadDate.getTime() === yesterday.getTime()) {
      return 'Yesterday';
    }
    
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear().toString().slice(-2)}`;
  };

  return (
    <div className="h-full flex flex-col bg-white border-r border-slate-200">
      {/* Header */}
      <div className="p-5 border-b border-slate-200">
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 leading-tight">Chat</h2>
            <div className="text-xs font-semibold text-slate-500">Your conversations</div>
          </div>
          <div className="text-xs font-bold text-slate-500">{threads.length}</div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search Chat"
            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 outline-none"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {threads.length === 0 ? (
          <div className="p-6 text-center text-slate-500">
            <p className="text-sm">No conversations yet</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {threads.map((thread) => {
              const isActive = thread.id === selectedThreadId;
              const lastMessage = getThreadMessages(thread.id).slice(-1)[0];
              const preview = lastMessage?.body || thread.productName || 'General chat';
              return (
                <button
                  key={thread.id}
                  onClick={() => onSelectThread(thread.id)}
                  className={`w-full text-left p-4 transition-colors ${
                    isActive ? 'bg-emerald-600' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-sm flex-shrink-0 ring-1 ${
                      isActive ? 'bg-white text-emerald-700 ring-white/60' : 'bg-emerald-100 text-emerald-700 ring-emerald-200'
                    }`}>
                      {thread.sellerAvatarText}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-semibold text-sm truncate ${
                          isActive ? 'text-white' : 'text-slate-900'
                        }`}>
                          {thread.sellerName}
                        </span>
                        <span className={`text-xs ml-2 flex-shrink-0 ${isActive ? 'text-white/80' : 'text-slate-500'}`}>
                          {formatDate(thread.lastMessageAt || new Date(thread.updatedAt).getTime())}
                        </span>
                      </div>
                      <p className={`text-sm truncate ${isActive ? 'text-white/90' : 'text-slate-600'}`}>
                        {preview}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
