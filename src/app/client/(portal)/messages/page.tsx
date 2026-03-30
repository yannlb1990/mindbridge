'use client';

import { useRef, useEffect, useState } from 'react';
import { useMessages } from '@/hooks/useMessages';
import { useAuthStore } from '@/stores/authStore';
import { useAgeTheme } from '@/components/client/AgeThemeProvider';
import { formatRelativeTime } from '@/lib/utils';
import { Send, Loader2, MessageSquare, AlertTriangle, CheckCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ClientMessagesPage() {
  const { user } = useAuthStore();
  const theme = useAgeTheme();
  const {
    conversations,
    messages,
    activeConversationId,
    activeConversation,
    isLoading,
    isSending,
    selectConversation,
    sendMessage,
  } = useMessages();

  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-select the first (and usually only) conversation
  useEffect(() => {
    if (conversations.length > 0 && !activeConversationId) {
      selectConversation(conversations[0].id);
    }
  }, [conversations, activeConversationId, selectConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !activeConversationId) return;
    const content = newMessage;
    setNewMessage('');
    await sendMessage(content, activeConversationId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-sage" />
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6">
        <div className="text-center max-w-sm">
          <MessageSquare className="w-12 h-12 text-text-muted mx-auto mb-4" />
          <p className="font-medium text-text-primary mb-1">No messages yet</p>
          <p className="text-sm text-text-muted">
            Your clinician will send you a message here when you have something to discuss.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen max-h-screen">
      {/* Header */}
      <div className={cn('px-6 py-4 border-b border-beige flex items-center gap-3', theme.primaryBg)}>
        <div className={cn('w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm', 'bg-sage')}>
          {activeConversation?.client_name?.[0] || 'C'}
        </div>
        <div>
          <p className={cn('font-semibold', theme.primaryText)}>
            Messages with your clinician
          </p>
          <p className="text-xs text-text-muted">Secure &amp; private</p>
        </div>
        {activeConversation?.is_urgent && (
          <span className="ml-auto flex items-center gap-1 text-xs text-error font-medium">
            <AlertTriangle className="w-3.5 h-3.5" />
            Urgent
          </span>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center py-12 text-text-muted text-sm">
            No messages yet. Say hello!
          </div>
        ) : (
          messages.map((msg) => {
            const isFromClient = msg.sender_type === 'client';
            return (
              <div
                key={msg.id}
                className={cn('flex', isFromClient ? 'justify-end' : 'justify-start')}
              >
                <div
                  className={cn(
                    'max-w-[75%] rounded-2xl px-4 py-2.5 text-sm',
                    isFromClient
                      ? cn(theme.primaryBg, theme.primaryText, 'rounded-br-sm')
                      : 'bg-white border border-beige text-text-primary rounded-bl-sm'
                  )}
                >
                  <p className="leading-relaxed">{msg.content}</p>
                  <div className={cn('flex items-center gap-1 mt-1', isFromClient ? 'justify-end' : 'justify-start')}>
                    <span className={cn('text-xs', isFromClient ? 'text-white/70' : 'text-text-muted')}>
                      {formatRelativeTime(msg.created_at)}
                    </span>
                    {isFromClient && msg.is_read && (
                      <CheckCheck className="w-3.5 h-3.5 text-white/70" />
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-4 border-t border-beige bg-white">
        <div className="flex gap-2 items-end">
          <textarea
            className="flex-1 border border-beige rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-sage max-h-32"
            placeholder="Type a message…"
            rows={1}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <button
            onClick={handleSend}
            disabled={isSending || !newMessage.trim()}
            className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors',
              newMessage.trim()
                ? cn(theme.primaryBg, 'text-white')
                : 'bg-beige text-text-muted cursor-not-allowed'
            )}
          >
            {isSending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
        <p className="text-xs text-text-muted text-center mt-2">
          Messages are encrypted and only visible to you and your clinician.
        </p>
      </div>
    </div>
  );
}
