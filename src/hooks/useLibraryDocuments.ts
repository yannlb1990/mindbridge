'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase, isEffectiveDemo } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';

export interface LibraryDocument {
  id: string;
  clinician_id?: string;
  name: string;
  type: 'pdf' | 'doc' | 'image' | 'video' | 'link';
  category: string;
  tags: string[];
  size_bytes?: number;
  size?: string; // display string e.g. "2.4 MB"
  storage_path?: string;
  url?: string;
  starred: boolean;
  uploaded_at: string;
  last_accessed_at: string;
}

const DEMO_DOCUMENTS: LibraryDocument[] = [
  {
    id: 'doc-1',
    name: 'CBT-E Treatment Manual',
    type: 'pdf',
    category: 'Treatment Protocols',
    tags: ['CBT-E', 'Eating Disorders', 'Manual'],
    size: '2.4 MB',
    starred: true,
    uploaded_at: '2025-11-15',
    last_accessed_at: '2025-12-28',
  },
  {
    id: 'doc-2',
    name: 'FBT Phase 1 Guidelines',
    type: 'pdf',
    category: 'Treatment Protocols',
    tags: ['FBT', 'Family Therapy', 'Eating Disorders'],
    size: '1.8 MB',
    starred: true,
    uploaded_at: '2025-10-20',
    last_accessed_at: '2025-12-30',
  },
  {
    id: 'doc-3',
    name: 'PHQ-9 Scoring Guide',
    type: 'pdf',
    category: 'Assessment Tools',
    tags: ['PHQ-9', 'Depression', 'Assessment'],
    size: '450 KB',
    starred: false,
    uploaded_at: '2025-09-01',
    last_accessed_at: '2025-12-25',
  },
  {
    id: 'doc-4',
    name: 'GAD-7 Administration',
    type: 'pdf',
    category: 'Assessment Tools',
    tags: ['GAD-7', 'Anxiety', 'Assessment'],
    size: '380 KB',
    starred: false,
    uploaded_at: '2025-09-01',
    last_accessed_at: '2025-12-20',
  },
  {
    id: 'doc-5',
    name: 'EDE-Q Interpretation Guide',
    type: 'pdf',
    category: 'Assessment Tools',
    tags: ['EDE-Q', 'Eating Disorders', 'Assessment'],
    size: '1.2 MB',
    starred: true,
    uploaded_at: '2025-08-15',
    last_accessed_at: '2025-12-29',
  },
  {
    id: 'doc-6',
    name: 'Safety Plan Template',
    type: 'doc',
    category: 'Clinical Templates',
    tags: ['Safety Plan', 'Crisis', 'Template'],
    size: '125 KB',
    starred: false,
    uploaded_at: '2025-07-10',
    last_accessed_at: '2025-12-22',
  },
  {
    id: 'doc-7',
    name: 'Meal Planning Worksheet',
    type: 'pdf',
    category: 'Client Resources',
    tags: ['Eating Disorders', 'Meal Planning', 'Worksheet'],
    size: '280 KB',
    starred: false,
    uploaded_at: '2025-11-01',
    last_accessed_at: '2025-12-27',
  },
  {
    id: 'doc-8',
    name: 'Thought Record Template',
    type: 'pdf',
    category: 'Client Resources',
    tags: ['CBT', 'Thought Record', 'Worksheet'],
    size: '195 KB',
    starred: true,
    uploaded_at: '2025-10-05',
    last_accessed_at: '2025-12-31',
  },
  {
    id: 'doc-10',
    name: 'DBT Skills Handbook',
    type: 'pdf',
    category: 'Treatment Protocols',
    tags: ['DBT', 'Skills', 'Manual'],
    size: '4.1 MB',
    starred: true,
    uploaded_at: '2025-05-15',
    last_accessed_at: '2025-12-28',
  },
];

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function useLibraryDocuments() {
  const { user } = useAuthStore();
  const [documents, setDocuments] = useState<LibraryDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDocuments = useCallback(async () => {
    if (!user) return;

    if (isEffectiveDemo(user.id)) {
      setDocuments(DEMO_DOCUMENTS);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('clinician_library_documents')
        .select('*')
        .eq('clinician_id', user.id)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;

      const mapped: LibraryDocument[] = (data || []).map((row: any) => ({
        id: row.id,
        clinician_id: row.clinician_id,
        name: row.name,
        type: row.type as LibraryDocument['type'],
        category: row.category,
        tags: row.tags ?? [],
        size_bytes: row.size_bytes ?? undefined,
        size: row.size_bytes ? formatSize(row.size_bytes) : undefined,
        storage_path: row.storage_path ?? undefined,
        url: row.url ?? undefined,
        starred: row.starred ?? false,
        uploaded_at: row.uploaded_at,
        last_accessed_at: row.last_accessed_at,
      }));

      setDocuments(mapped);
    } catch (err) {
      console.error('Error fetching library documents:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const uploadDocument = async (
    file: File,
    metadata: {
      category?: string;
      tags?: string[];
    } = {}
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'Not authenticated' };

    if (isEffectiveDemo(user.id)) {
      const newDoc: LibraryDocument = {
        id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name.replace(/\.[^/.]+$/, ''),
        type: file.type.includes('pdf')
          ? 'pdf'
          : file.type.includes('image')
          ? 'image'
          : 'doc',
        category: metadata.category ?? 'Uploads',
        tags: metadata.tags ?? ['Uploaded'],
        size_bytes: file.size,
        size: formatSize(file.size),
        starred: false,
        uploaded_at: new Date().toISOString().split('T')[0],
        last_accessed_at: new Date().toISOString().split('T')[0],
      };
      setDocuments((prev) => [newDoc, ...prev]);
      return { success: true };
    }

    try {
      const ext = file.name.split('.').pop() ?? 'bin';
      const storagePath = `${user.id}/${Date.now()}-${file.name}`;

      const { error: storageError } = await supabase.storage
        .from('clinician-documents')
        .upload(storagePath, file, { upsert: false });

      if (storageError) throw storageError;

      const { data: urlData } = supabase.storage
        .from('clinician-documents')
        .getPublicUrl(storagePath);

      const docType: LibraryDocument['type'] = file.type.includes('pdf')
        ? 'pdf'
        : file.type.includes('image')
        ? 'image'
        : file.type.includes('video')
        ? 'video'
        : 'doc';

      const { data, error: insertError } = await supabase
        .from('clinician_library_documents')
        .insert({
          clinician_id: user.id,
          name: file.name.replace(/\.[^/.]+$/, ''),
          type: docType,
          category: metadata.category ?? 'Uploads',
          tags: metadata.tags ?? ['Uploaded'],
          size_bytes: file.size,
          storage_path: storagePath,
          url: urlData?.publicUrl ?? null,
          starred: false,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setDocuments((prev) => [
        {
          id: data.id,
          clinician_id: data.clinician_id,
          name: data.name,
          type: data.type as LibraryDocument['type'],
          category: data.category,
          tags: data.tags ?? [],
          size_bytes: data.size_bytes ?? undefined,
          size: data.size_bytes ? formatSize(data.size_bytes) : undefined,
          storage_path: data.storage_path ?? undefined,
          url: data.url ?? undefined,
          starred: data.starred ?? false,
          uploaded_at: data.uploaded_at,
          last_accessed_at: data.last_accessed_at,
        },
        ...prev,
      ]);

      return { success: true };
    } catch (err: any) {
      console.error('Error uploading document:', err);
      return { success: false, error: err.message };
    }
  };

  const toggleStar = async (id: string) => {
    if (!user) return;

    const doc = documents.find((d) => d.id === id);
    if (!doc) return;

    const newStarred = !doc.starred;

    // Optimistic update
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, starred: newStarred } : d))
    );

    if (isEffectiveDemo(user.id)) return;

    try {
      const { error } = await supabase
        .from('clinician_library_documents')
        .update({ starred: newStarred })
        .eq('id', id)
        .eq('clinician_id', user.id);

      if (error) throw error;
    } catch (err) {
      console.error('Error toggling star:', err);
      setDocuments((prev) =>
        prev.map((d) => (d.id === id ? { ...d, starred: !newStarred } : d))
      );
    }
  };

  const deleteDocument = async (id: string) => {
    if (!user) return;

    const doc = documents.find((d) => d.id === id);

    // Optimistic update
    setDocuments((prev) => prev.filter((d) => d.id !== id));

    if (isEffectiveDemo(user.id)) return;

    try {
      // Delete from storage if path exists
      if (doc?.storage_path) {
        await supabase.storage
          .from('clinician-documents')
          .remove([doc.storage_path]);
      }

      const { error } = await supabase
        .from('clinician_library_documents')
        .delete()
        .eq('id', id)
        .eq('clinician_id', user.id);

      if (error) throw error;
    } catch (err) {
      console.error('Error deleting document:', err);
      fetchDocuments();
    }
  };

  const updateLastAccessed = async (id: string) => {
    if (!user || isEffectiveDemo(user.id)) return;

    // Optimistic
    const now = new Date().toISOString();
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, last_accessed_at: now } : d))
    );

    try {
      await supabase
        .from('clinician_library_documents')
        .update({ last_accessed_at: now })
        .eq('id', id)
        .eq('clinician_id', user.id);
    } catch (err) {
      console.error('Error updating last accessed:', err);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return {
    documents,
    isLoading,
    fetchDocuments,
    uploadDocument,
    toggleStar,
    deleteDocument,
    updateLastAccessed,
  };
}
