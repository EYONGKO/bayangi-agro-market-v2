import { Send, Paperclip } from 'lucide-react';
import type { ChatThread, ChatMessage } from '../../utils/chatStore';

interface ChatViewProps {
  thread: ChatThread | null;
  messages: ChatMessage[];
  draft: string;
  onDraftChange: (draft: string) => void;
  onSend: () => void;
}

export default function ChatView({
  thread,
  messages,
  draft,
  onDraftChange,
  onSend
}: ChatViewProps) {
  const formatMessageTime = (msg: ChatMessage) => {
    const timestamp = msg.timestamp || new Date(msg.createdAt).getTime();
    const date = new Date(timestamp);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    if (messageDate.getTime() === today.getTime()) {
      return `Today ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const groupedMessages = () => {
    if (messages.length === 0) return [];
    
    const groups: Array<{ date: string; messages: ChatMessage[] }> = [];
    let currentDate = '';
    
    messages.forEach((msg) => {
      const timestamp = msg.timestamp || new Date(msg.createdAt).getTime();
      const msgDate = new Date(timestamp);
      const dateStr = msgDate.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
      
      if (dateStr !== currentDate) {
        currentDate = dateStr;
        groups.push({ date: dateStr, messages: [] });
      }
      
      groups[groups.length - 1].messages.push(msg);
    });
    
    return groups;
  };

  if (!thread) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-white rounded-2xl border border-slate-200 flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Send className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-700 font-semibold">Select a conversation</p>
          <p className="text-sm text-slate-500 mt-2">Choose a chat from the list to start messaging</p>
        </div>
      </div>
    );
  }

  const groups = groupedMessages();

  return (
    <div className="h-full flex flex-col bg-white/70 backdrop-blur">
      {/* Header */}
      <div className="p-5 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center font-extrabold text-white shadow-sm">
            {thread.sellerAvatarText}
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 leading-tight">{thread.sellerName}</h3>
            {thread.productName && (
              <p className="text-sm text-slate-600">{thread.productName}</p>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
        {groups.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500 text-sm">No messages yet. Say hello!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {groups.map((group, groupIdx) => (
              <div key={groupIdx}>
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-white px-4 py-1 rounded-full border border-slate-200 shadow-sm">
                    <span className="text-xs font-semibold text-slate-600">{group.date}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  {group.messages.map((msg) => {
                    const isMine = msg.sender === 'buyer';
                    return (
                      <div key={msg.id} className={`flex items-start gap-3 ${isMine ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${
                          isMine
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white border border-slate-200 text-slate-700'
                        }`}>
                          {isMine ? 'You' : thread.sellerAvatarText}
                        </div>
                        <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} max-w-md`}>
                          <div className={`px-4 py-2 rounded-lg ${
                            isMine
                              ? 'bg-emerald-600 text-white'
                              : 'bg-white border border-slate-200 text-slate-900'
                          }`}>
                            <p className="text-sm">{msg.body}</p>
                          </div>
                          <span className="text-xs text-slate-500 mt-1 px-1">
                            {formatMessageTime(msg)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-5 border-t border-slate-200 bg-white/90 backdrop-blur">
        <div className="flex items-center gap-3">
          <button className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors" aria-label="Attach file">
            <Paperclip className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={draft}
            onChange={(e) => onDraftChange(e.target.value)}
            placeholder="Write your message"
            className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 outline-none bg-white"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSend();
              }
            }}
          />
          <button
            onClick={onSend}
            disabled={!draft.trim()}
            className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}
