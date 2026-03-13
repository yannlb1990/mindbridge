'use client';

import { useRef, useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { useMessages } from '@/hooks/useMessages';
import { formatRelativeTime } from '@/lib/utils';
import {
  Search,
  Send,
  AlertTriangle,
  CheckCheck,
  Loader2,
  Info,
} from 'lucide-react';

export default function MessagesPage() {
  const {
    conversations,
    messages,
    activeConversation,
    activeConversationId,
    isLoading,
    isSending,
    totalUnread,
    selectConversation,
    sendMessage,
  } = useMessages();

  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const filteredConversations = conversations.filter((conv) =>
    (conv.client_name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !activeConversationId) return;
    const content = newMessage;
    setNewMessage('');
    await sendMessage(content, activeConversationId);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        title="Messages"
        subtitle={totalUnread > 0 ? `${totalUnread} unread message${totalUnread > 1 ? 's' : ''}` : 'Secure internal messaging with your clients'}
      />

      <div className="flex-1 flex overflow-hidden" style={{ height: 'calc(100vh - 73px)' }}>

        {/* Conversations sidebar */}
        <div className="w-80 border-r border-beige bg-white flex flex-col flex-shrink-0">
          <div className="p-4 border-b border-beige">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-beige rounded-lg bg-sand text-sm focus:outline-none focus:ring-2 focus:ring-sage focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-sage" />
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-6 text-center text-text-muted text-sm">No conversations yet</div>
            ) : (
              filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => selectConversation(conv.id)}
                  className={`p-4 border-b border-beige cursor-pointer hover:bg-sand transition-colors ${
                    activeConversationId === conv.id ? 'bg-sage/10 border-l-2 border-l-sage' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative flex-shrink-0">
                      <Avatar
                        firstName={(conv.client_name || '').split(' ')[0]}
                        lastName={(conv.client_name || '').split(' ')[1] || ''}
                        size="md"
                      />
                      {conv.is_urgent && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-coral rounded-full flex items-center justify-center">
                          <AlertTriangle className="w-2.5 h-2.5 text-white" />
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <p className="font-medium text-text-primary truncate text-sm">
                          {conv.client_name}
                        </p>
                        <span className="text-xs text-text-muted flex-shrink-0 ml-1">
                          {formatRelativeTime(conv.last_message_at)}
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary truncate">
                        {conv.last_message_preview || 'No messages yet'}
                      </p>
                    </div>
                    {(conv.clinician_unread || 0) > 0 && (
                      <span className="w-5 h-5 bg-sage rounded-full text-white text-xs flex items-center justify-center flex-shrink-0">
                        {conv.clinician_unread}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Message thread */}
        <div className="flex-1 flex flex-col bg-cream min-w-0">
          {activeConversation ? (
            <>
              {/* Chat header */}
              <div className="p-4 bg-white border-b border-beige flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3">
                  <Avatar
                    firstName={(activeConversation.client_name || '').split(' ')[0]}
                    lastName={(activeConversation.client_name || '').split(' ')[1] || ''}
                    size="md"
                  />
                  <div>
                    <p className="font-medium text-text-primary">{activeConversation.client_name}</p>
                    {activeConversation.client_email ? (
                      <p className="text-xs text-text-muted">{activeConversation.client_email}</p>
                    ) : (
                      <p className="text-xs text-text-muted">No email on file</p>
                    )}
                  </div>
                </div>
                {activeConversation.is_urgent && (
                  <Badge variant="error" size="sm">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Urgent
                  </Badge>
                )}
              </div>

              {/* Email notification notice */}
              <div className="px-4 py-2 bg-sage/5 border-b border-beige flex items-center gap-2">
                <Info className="w-3.5 h-3.5 text-sage flex-shrink-0" />
                <p className="text-xs text-text-muted">
                  {activeConversation.client_email
                    ? 'Client will receive email notifications for your messages (if 18+).'
                    : 'No email on file — client will not receive email notifications.'}
                </p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-text-muted text-sm">No messages yet. Say hello!</p>
                  </div>
                ) : (
                  messages.map((message) => {
                    const isMe = message.sender_type === 'clinician';
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${
                            isMe
                              ? 'bg-sage text-white rounded-br-md'
                              : 'bg-white text-text-primary rounded-bl-md shadow-soft'
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{message.content}</p>
                          <div className={`flex items-center gap-1 mt-1 ${isMe ? 'justify-end' : ''}`}>
                            <span className={`text-xs ${isMe ? 'text-white/70' : 'text-text-muted'}`}>
                              {new Date(message.created_at).toLocaleTimeString('en-AU', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                            {isMe && message.is_read && (
                              <CheckCheck className="w-3 h-3 text-white/70" />
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
              <div className="p-4 bg-white border-t border-beige flex-shrink-0">
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      rows={1}
                      className="w-full px-4 py-2.5 border border-beige rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-sage focus:border-transparent text-sm"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                    />
                  </div>
                  <Button
                    size="sm"
                    onClick={handleSend}
                    disabled={!newMessage.trim() || isSending}
                    isLoading={isSending}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-text-muted mt-2">
                  Messages are stored securely and comply with Australian Privacy Principles. Press Enter to send.
                </p>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-sand rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-text-muted" />
                </div>
                <p className="font-medium text-text-primary mb-1">Select a conversation</p>
                <p className="text-sm text-text-secondary">
                  Choose a client from the list to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
