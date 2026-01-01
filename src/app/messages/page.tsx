'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { useDemoData } from '@/hooks/useDemoData';
import { formatRelativeTime } from '@/lib/utils';
import {
  Search,
  Plus,
  Send,
  Paperclip,
  MoreVertical,
  Check,
  CheckCheck,
  AlertTriangle,
} from 'lucide-react';

// Demo messages
const demoConversations = [
  {
    id: 'conv-1',
    client_id: 'client-1',
    client_name: 'Emma Thompson',
    last_message: 'Thank you for the homework exercises. I\'ll work on them this week.',
    last_message_time: new Date(Date.now() - 3600000).toISOString(),
    unread_count: 0,
    is_urgent: false,
  },
  {
    id: 'conv-2',
    client_id: 'client-3',
    client_name: 'Sophie Williams',
    last_message: 'I\'m feeling really anxious about tomorrow. Can we talk?',
    last_message_time: new Date(Date.now() - 1800000).toISOString(),
    unread_count: 2,
    is_urgent: true,
  },
  {
    id: 'conv-3',
    client_id: 'client-2',
    client_name: 'Liam Nguyen',
    last_message: 'Mum says I did really well with my breathing exercises!',
    last_message_time: new Date(Date.now() - 86400000).toISOString(),
    unread_count: 1,
    is_urgent: false,
  },
  {
    id: 'conv-4',
    client_id: 'client-5',
    client_name: 'Mia Patel',
    last_message: 'See you at our next session on Thursday.',
    last_message_time: new Date(Date.now() - 172800000).toISOString(),
    unread_count: 0,
    is_urgent: false,
  },
];

const demoMessages = [
  {
    id: 'msg-1',
    sender: 'client',
    content: 'Hi Dr. Mitchell, I completed the thought record you assigned.',
    time: new Date(Date.now() - 7200000).toISOString(),
    is_read: true,
  },
  {
    id: 'msg-2',
    sender: 'clinician',
    content: 'That\'s wonderful, Emma! I\'ll review it before our next session. How did you find the exercise?',
    time: new Date(Date.now() - 6000000).toISOString(),
    is_read: true,
  },
  {
    id: 'msg-3',
    sender: 'client',
    content: 'It was helpful to write things down. I noticed I have a lot of "should" thoughts.',
    time: new Date(Date.now() - 5400000).toISOString(),
    is_read: true,
  },
  {
    id: 'msg-4',
    sender: 'clinician',
    content: 'That\'s a great observation! We\'ll explore those patterns together. Keep up the great work.',
    time: new Date(Date.now() - 4800000).toISOString(),
    is_read: true,
  },
  {
    id: 'msg-5',
    sender: 'client',
    content: 'Thank you for the homework exercises. I\'ll work on them this week.',
    time: new Date(Date.now() - 3600000).toISOString(),
    is_read: true,
  },
];

export default function MessagesPage() {
  const { clients } = useDemoData();
  const [selectedConversation, setSelectedConversation] = useState<string | null>('conv-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const filteredConversations = demoConversations.filter((conv) =>
    conv.client_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedConv = demoConversations.find((c) => c.id === selectedConversation);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    // In production, send message to backend
    setNewMessage('');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        title="Messages"
        subtitle="Secure messaging with your clients"
        actions={
          <Button leftIcon={<Plus className="w-4 h-4" />}>
            New Message
          </Button>
        }
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Conversations List */}
        <div className="w-80 border-r border-beige bg-white flex flex-col">
          {/* Search */}
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

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setSelectedConversation(conv.id)}
                className={`p-4 border-b border-beige cursor-pointer hover:bg-sand transition-colors ${
                  selectedConversation === conv.id ? 'bg-sage-50' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar
                      firstName={conv.client_name.split(' ')[0]}
                      lastName={conv.client_name.split(' ')[1] || ''}
                      size="md"
                    />
                    {conv.is_urgent && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-coral rounded-full flex items-center justify-center">
                        <AlertTriangle className="w-3 h-3 text-white" />
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-text-primary truncate">
                        {conv.client_name}
                      </p>
                      <span className="text-xs text-text-muted">
                        {formatRelativeTime(conv.last_message_time)}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary truncate">
                      {conv.last_message}
                    </p>
                  </div>
                  {conv.unread_count > 0 && (
                    <span className="w-5 h-5 bg-sage rounded-full text-white text-xs flex items-center justify-center">
                      {conv.unread_count}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 flex flex-col bg-cream">
          {selectedConv ? (
            <>
              {/* Chat Header */}
              <div className="p-4 bg-white border-b border-beige flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar
                    firstName={selectedConv.client_name.split(' ')[0]}
                    lastName={selectedConv.client_name.split(' ')[1] || ''}
                    size="md"
                  />
                  <div>
                    <p className="font-medium text-text-primary">{selectedConv.client_name}</p>
                    <p className="text-sm text-text-muted">Active now</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {demoMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'clinician' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                        message.sender === 'clinician'
                          ? 'bg-sage text-white rounded-br-md'
                          : 'bg-white text-text-primary rounded-bl-md shadow-soft'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <div className={`flex items-center gap-1 mt-1 ${
                        message.sender === 'clinician' ? 'justify-end' : ''
                      }`}>
                        <span className={`text-xs ${
                          message.sender === 'clinician' ? 'text-sage-light' : 'text-text-muted'
                        }`}>
                          {new Date(message.time).toLocaleTimeString('en-AU', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        {message.sender === 'clinician' && message.is_read && (
                          <CheckCheck className="w-3 h-3 text-sage-light" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 bg-white border-t border-beige">
                <div className="flex items-end gap-3">
                  <Button variant="ghost" size="sm">
                    <Paperclip className="w-5 h-5" />
                  </Button>
                  <div className="flex-1">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      rows={1}
                      className="w-full px-4 py-2 border border-beige rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-sage focus:border-transparent"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                  </div>
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-text-muted mt-2">
                  Messages are encrypted and comply with Australian Privacy Principles.
                </p>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-sand rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-text-muted" />
                </div>
                <p className="text-text-secondary">Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
