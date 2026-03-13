'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase, isDemoMode } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_type: 'clinician' | 'client';
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface Conversation {
  id: string;
  clinician_id: string;
  client_id: string;
  last_message_at: string;
  last_message_preview: string | null;
  clinician_unread: number;
  client_unread: number;
  client_name?: string;
  client_email?: string;
  is_urgent?: boolean;
}

// Demo data
const DEMO_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1', clinician_id: 'demo-clinician-1', client_id: 'client-1',
    last_message_at: new Date(Date.now() - 3600000).toISOString(),
    last_message_preview: "Thank you for the homework exercises. I'll work on them this week.",
    clinician_unread: 0, client_unread: 0, client_name: 'Emma Thompson',
    client_email: 'emma.t@email.com', is_urgent: false,
  },
  {
    id: 'conv-2', clinician_id: 'demo-clinician-1', client_id: 'client-3',
    last_message_at: new Date(Date.now() - 1800000).toISOString(),
    last_message_preview: "I'm feeling really anxious about tomorrow. Can we talk?",
    clinician_unread: 2, client_unread: 0, client_name: 'Sophie Williams',
    client_email: 'sophie.w@email.com', is_urgent: true,
  },
  {
    id: 'conv-3', clinician_id: 'demo-clinician-1', client_id: 'client-2',
    last_message_at: new Date(Date.now() - 86400000).toISOString(),
    last_message_preview: 'Mum says I did really well with my breathing exercises!',
    clinician_unread: 1, client_unread: 0, client_name: 'Liam Nguyen',
    client_email: '', is_urgent: false,
  },
  {
    id: 'conv-4', clinician_id: 'demo-clinician-1', client_id: 'client-5',
    last_message_at: new Date(Date.now() - 172800000).toISOString(),
    last_message_preview: 'See you at our next session on Thursday.',
    clinician_unread: 0, client_unread: 0, client_name: 'Mia Patel',
    client_email: 'mia.patel@email.com', is_urgent: false,
  },
];

const DEMO_MESSAGES: Record<string, Message[]> = {
  'conv-1': [
    { id: 'm1', conversation_id: 'conv-1', sender_id: 'client-1', sender_type: 'client', content: 'Hi Dr. Mitchell, I completed the thought record you assigned.', is_read: true, created_at: new Date(Date.now() - 7200000).toISOString() },
    { id: 'm2', conversation_id: 'conv-1', sender_id: 'demo-clinician-1', sender_type: 'clinician', content: "That's wonderful, Emma! I'll review it before our next session. How did you find the exercise?", is_read: true, created_at: new Date(Date.now() - 6000000).toISOString() },
    { id: 'm3', conversation_id: 'conv-1', sender_id: 'client-1', sender_type: 'client', content: 'It was helpful to write things down. I noticed I have a lot of "should" thoughts.', is_read: true, created_at: new Date(Date.now() - 5400000).toISOString() },
    { id: 'm4', conversation_id: 'conv-1', sender_id: 'demo-clinician-1', sender_type: 'clinician', content: "That's a great observation! We'll explore those patterns together. Keep up the great work.", is_read: true, created_at: new Date(Date.now() - 4800000).toISOString() },
    { id: 'm5', conversation_id: 'conv-1', sender_id: 'client-1', sender_type: 'client', content: "Thank you for the homework exercises. I'll work on them this week.", is_read: true, created_at: new Date(Date.now() - 3600000).toISOString() },
  ],
  'conv-2': [
    { id: 'm6', conversation_id: 'conv-2', sender_id: 'client-3', sender_type: 'client', content: "I'm feeling really anxious about tomorrow. Can we talk?", is_read: false, created_at: new Date(Date.now() - 1800000).toISOString() },
    { id: 'm7', conversation_id: 'conv-2', sender_id: 'client-3', sender_type: 'client', content: 'The exam stress is getting to me. I used the breathing exercises but still feel overwhelmed.', is_read: false, created_at: new Date(Date.now() - 900000).toISOString() },
  ],
  'conv-3': [
    { id: 'm8', conversation_id: 'conv-3', sender_id: 'client-2', sender_type: 'client', content: 'Mum says I did really well with my breathing exercises!', is_read: false, created_at: new Date(Date.now() - 86400000).toISOString() },
  ],
  'conv-4': [
    { id: 'm9', conversation_id: 'conv-4', sender_id: 'demo-clinician-1', sender_type: 'clinician', content: 'Hi Mia, just a reminder about your session tomorrow at 2pm.', is_read: true, created_at: new Date(Date.now() - 259200000).toISOString() },
    { id: 'm10', conversation_id: 'conv-4', sender_id: 'client-5', sender_type: 'client', content: 'See you at our next session on Thursday.', is_read: true, created_at: new Date(Date.now() - 172800000).toISOString() },
  ],
};

export function useMessages() {
  const { user } = useAuthStore();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const subscriptionRef = useRef<any>(null);

  // Load conversations
  const fetchConversations = useCallback(async () => {
    if (!user) return;

    if (isDemoMode) {
      setConversations(DEMO_CONVERSATIONS);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          client:users!conversations_client_id_fkey (id, first_name, last_name, email),
          client_profile:client_profiles (date_of_birth)
        `)
        .eq('clinician_id', user.id)
        .order('last_message_at', { ascending: false });

      if (error) throw error;

      const formatted: Conversation[] = (data || []).map((c: any) => ({
        ...c,
        client_name: c.client ? `${c.client.first_name} ${c.client.last_name}` : 'Unknown',
        client_email: c.client?.email || '',
      }));

      setConversations(formatted);
    } catch (err) {
      console.error('fetchConversations error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Load messages for active conversation
  const fetchMessages = useCallback(async (conversationId: string) => {
    if (isDemoMode) {
      setMessages(DEMO_MESSAGES[conversationId] || []);
      return;
    }

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (!error) setMessages(data || []);

    // Mark as read
    await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('conversation_id', conversationId)
      .neq('sender_id', user?.id);
  }, [user]);

  // Select a conversation
  const selectConversation = useCallback((conversationId: string) => {
    setActiveConversationId(conversationId);
    fetchMessages(conversationId);

    // Subscribe to real-time updates for this conversation
    if (!isDemoMode) {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
      subscriptionRef.current = supabase
        .channel(`messages:${conversationId}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        }, (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        })
        .subscribe();
    }
  }, [fetchMessages]);

  // Send a message
  const sendMessage = useCallback(async (content: string, conversationId: string): Promise<boolean> => {
    if (!content.trim() || !user) return false;
    setIsSending(true);

    if (isDemoMode) {
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        conversation_id: conversationId,
        sender_id: user.id,
        sender_type: user.role === 'clinician' ? 'clinician' : 'client',
        content: content.trim(),
        is_read: false,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, newMessage]);
      setConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId
            ? { ...c, last_message_preview: content.trim(), last_message_at: new Date().toISOString() }
            : c
        )
      );
      setIsSending(false);
      return true;
    }

    try {
      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: conversationId,
          sender_id: user.id,
          sender_type: user.role === 'clinician' ? 'clinician' : 'client',
          content,
        }),
      });

      if (!response.ok) throw new Error('Send failed');

      // Refresh conversations to update preview
      await fetchConversations();
      return true;
    } catch (err) {
      console.error('sendMessage error:', err);
      return false;
    } finally {
      setIsSending(false);
    }
  }, [user, fetchConversations]);

  useEffect(() => {
    fetchConversations();
    return () => {
      subscriptionRef.current?.unsubscribe();
    };
  }, [fetchConversations]);

  const activeConversation = conversations.find((c) => c.id === activeConversationId) || null;
  const totalUnread = conversations.reduce((sum, c) => sum + (c.clinician_unread || 0), 0);

  return {
    conversations,
    messages,
    activeConversationId,
    activeConversation,
    isLoading,
    isSending,
    totalUnread,
    selectConversation,
    sendMessage,
    fetchConversations,
  };
}
