'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { useNotes, ClinicalNote } from '@/hooks/useNotes';
import { NoteEditor } from '@/components/notes/NoteEditor';
import { formatDate, formatRelativeTime } from '@/lib/utils';
import {
  Plus,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Mic,
  ChevronRight,
  Loader2,
  PenLine,
} from 'lucide-react';

export default function NotesPage() {
  const { notes, isLoading, signNote } = useNotes();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFormat, setFilterFormat] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<ClinicalNote | undefined>();

  const filteredNotes = notes.filter((note) => {
    const previewText = Object.values(note.content).join(' ').toLowerCase();
    const matchesSearch =
      (note.client_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      previewText.includes(searchQuery.toLowerCase());
    const matchesFormat = filterFormat === 'all' || note.note_format === filterFormat;
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'signed' && note.is_signed) ||
      (filterStatus === 'unsigned' && !note.is_signed);

    return matchesSearch && matchesFormat && matchesStatus;
  });

  const unsignedCount = notes.filter((n) => !n.is_signed).length;

  const getPreview = (note: ClinicalNote) => {
    const contentValues = Object.values(note.content || {});
    const text = contentValues.filter((v) => typeof v === 'string').join(' ');
    return text.substring(0, 150) + (text.length > 150 ? '...' : '');
  };

  const handleSignNote = async (noteId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await signNote(noteId);
  };

  const handleNoteClick = (note: ClinicalNote) => {
    setSelectedNote(note);
    setIsEditorOpen(true);
  };

  const handleNewNote = () => {
    setSelectedNote(undefined);
    setIsEditorOpen(true);
  };

  return (
    <div className="min-h-screen">
      <Header
        title="Clinical Notes"
        subtitle={`${unsignedCount} notes awaiting signature`}
        actions={
          <div className="flex gap-2">
            <Link href="/session-capture">
              <Button variant="secondary" leftIcon={<Mic className="w-4 h-4" />}>
                Session Capture
              </Button>
            </Link>
            <Link href="/notes/new">
              <Button leftIcon={<PenLine className="w-4 h-4" />}>
                Write Note
              </Button>
            </Link>
          </div>
        }
      />

      <div className="p-6">
        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-beige rounded-lg bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-sage focus:border-transparent"
                />
              </div>

              {/* Format Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-text-muted" />
                <select
                  value={filterFormat}
                  onChange={(e) => setFilterFormat(e.target.value)}
                  className="px-4 py-2.5 border border-beige rounded-lg bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-sage"
                >
                  <option value="all">All Formats</option>
                  <option value="soap">SOAP</option>
                  <option value="dap">DAP</option>
                  <option value="birp">BIRP</option>
                  <option value="narrative">Narrative</option>
                  <option value="brief">Brief</option>
                </select>
              </div>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2.5 border border-beige rounded-lg bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-sage"
              >
                <option value="all">All Status</option>
                <option value="signed">Signed</option>
                <option value="unsigned">Awaiting Signature</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-sage" />
          </div>
        )}

        {/* Unsigned Notes Alert */}
        {!isLoading && unsignedCount > 0 && (
          <div className="mb-6 p-4 bg-gold/20 border border-gold rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-gold-dark" />
              <div>
                <p className="font-medium text-text-primary">
                  {unsignedCount} note{unsignedCount > 1 ? 's' : ''} awaiting signature
                </p>
                <p className="text-sm text-text-secondary">
                  Please review and sign pending notes
                </p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => {
                const unsigned = notes.find((n) => !n.is_signed);
                if (unsigned) handleNoteClick(unsigned);
              }}
            >
              Review Next
            </Button>
          </div>
        )}

        {/* Notes List */}
        {!isLoading && (
          <div className="space-y-3">
            {filteredNotes.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Plus className="w-12 h-12 text-text-muted mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-text-primary mb-2">No notes found</h3>
                  <p className="text-text-secondary mb-4">
                    {searchQuery ? 'Try adjusting your search or filters' : 'Create your first clinical note'}
                  </p>
                  <Link href="/notes/new">
                    <Button leftIcon={<PenLine className="w-4 h-4" />}>
                      Write Note
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              filteredNotes.map((note) => (
                <Card
                  key={note.id}
                  className="hover:shadow-medium transition-shadow cursor-pointer"
                  onClick={() => handleNoteClick(note)}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      {/* Client Avatar */}
                      <Avatar
                        firstName={(note.client_name || 'Unknown').split(' ')[0]}
                        lastName={(note.client_name || 'Client').split(' ')[1] || ''}
                        size="md"
                      />

                      {/* Note Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-semibold text-text-primary">{note.client_name || 'Unknown Client'}</h3>
                          <Badge variant="default" size="sm">{note.note_format.toUpperCase()}</Badge>
                          {note.ai_generated && (
                            <Badge variant="info" size="sm">
                              <Mic className="w-3 h-3 mr-1" />
                              AI Generated
                            </Badge>
                          )}
                          {note.risk_level && note.risk_level !== 'low' && (
                            <Badge
                              variant={note.risk_level === 'high' || note.risk_level === 'critical' ? 'error' : 'warning'}
                              size="sm"
                            >
                              {note.risk_level} risk
                            </Badge>
                          )}
                          {note.is_signed ? (
                            <Badge variant="success" size="sm">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Signed
                            </Badge>
                          ) : (
                            <Badge variant="warning" size="sm">
                              <Clock className="w-3 h-3 mr-1" />
                              Pending
                            </Badge>
                          )}
                        </div>

                        <p className="text-sm text-text-secondary line-clamp-2 mb-2">
                          {getPreview(note)}
                        </p>

                        <p className="text-xs text-text-muted">
                          {formatRelativeTime(note.created_at)}
                          {note.is_signed && note.signed_at && (
                            <> · Signed {formatDate(note.signed_at)}</>
                          )}
                        </p>
                      </div>

                      {/* Action */}
                      <div className="flex items-center gap-2">
                        {!note.is_signed && (
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={(e) => handleSignNote(note.id, e)}
                          >
                            Sign Note
                          </Button>
                        )}
                        <Button size="sm" variant="ghost">
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>

      {/* Note Editor Modal */}
      <NoteEditor
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setSelectedNote(undefined);
        }}
        existingNote={selectedNote}
        onSuccess={() => {
          // Notes will auto-refresh via the hook
        }}
      />
    </div>
  );
}
