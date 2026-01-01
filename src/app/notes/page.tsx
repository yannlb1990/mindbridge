'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { useDemoData } from '@/hooks/useDemoData';
import { formatDate, formatRelativeTime } from '@/lib/utils';
import {
  Plus,
  Search,
  Filter,
  FileText,
  CheckCircle,
  Clock,
  Mic,
  ChevronRight,
} from 'lucide-react';

// Demo clinical notes
const demoNotes = [
  {
    id: 'note-1',
    client_id: 'client-1',
    client_name: 'Emma Thompson',
    note_format: 'SOAP',
    is_signed: true,
    signed_at: new Date(Date.now() - 86400000).toISOString(),
    ai_generated: false,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    preview: 'Client presented with improved mood. Discussed progress with meal planning...',
  },
  {
    id: 'note-2',
    client_id: 'client-2',
    client_name: 'Liam Nguyen',
    note_format: 'DAP',
    is_signed: true,
    signed_at: new Date(Date.now() - 172800000).toISOString(),
    ai_generated: true,
    created_at: new Date(Date.now() - 172800000).toISOString(),
    preview: 'Reviewed anxiety management techniques. Client reported using breathing exercises...',
  },
  {
    id: 'note-3',
    client_id: 'client-3',
    client_name: 'Sophie Williams',
    note_format: 'SOAP',
    is_signed: false,
    signed_at: null,
    ai_generated: true,
    created_at: new Date(Date.now() - 3600000).toISOString(),
    preview: 'Risk assessment conducted. Updated safety plan with new coping strategies...',
  },
  {
    id: 'note-4',
    client_id: 'client-4',
    client_name: 'Oliver Chen',
    note_format: 'BIRP',
    is_signed: true,
    signed_at: new Date(Date.now() - 259200000).toISOString(),
    ai_generated: false,
    created_at: new Date(Date.now() - 259200000).toISOString(),
    preview: 'Social skills practice session. Role-played conversation scenarios...',
  },
  {
    id: 'note-5',
    client_id: 'client-5',
    client_name: 'Mia Patel',
    note_format: 'narrative',
    is_signed: true,
    signed_at: new Date(Date.now() - 345600000).toISOString(),
    ai_generated: false,
    created_at: new Date(Date.now() - 345600000).toISOString(),
    preview: 'Follow-up session focusing on cognitive restructuring. Client identified...',
  },
];

export default function NotesPage() {
  const { clients } = useDemoData();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFormat, setFilterFormat] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredNotes = demoNotes.filter((note) => {
    const matchesSearch =
      note.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.preview.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFormat = filterFormat === 'all' || note.note_format === filterFormat;
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'signed' && note.is_signed) ||
      (filterStatus === 'unsigned' && !note.is_signed);

    return matchesSearch && matchesFormat && matchesStatus;
  });

  const unsignedCount = demoNotes.filter((n) => !n.is_signed).length;

  return (
    <div className="min-h-screen">
      <Header
        title="Clinical Notes"
        subtitle={`${unsignedCount} notes awaiting signature`}
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" leftIcon={<Mic className="w-4 h-4" />}>
              AI Scribe
            </Button>
            <Button leftIcon={<Plus className="w-4 h-4" />}>
              New Note
            </Button>
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
                  <option value="SOAP">SOAP</option>
                  <option value="DAP">DAP</option>
                  <option value="BIRP">BIRP</option>
                  <option value="narrative">Narrative</option>
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

        {/* Unsigned Notes Alert */}
        {unsignedCount > 0 && (
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
            <Button size="sm">Review All</Button>
          </div>
        )}

        {/* Notes List */}
        <div className="space-y-3">
          {filteredNotes.map((note) => (
            <Card key={note.id} className="hover:shadow-medium transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  {/* Client Avatar */}
                  <Avatar
                    firstName={note.client_name.split(' ')[0]}
                    lastName={note.client_name.split(' ')[1] || ''}
                    size="md"
                  />

                  {/* Note Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-text-primary">{note.client_name}</h3>
                      <Badge variant="default" size="sm">{note.note_format}</Badge>
                      {note.ai_generated && (
                        <Badge variant="info" size="sm">
                          <Mic className="w-3 h-3 mr-1" />
                          AI Generated
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
                      {note.preview}
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
                      <Button size="sm" variant="primary">
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
          ))}
        </div>
      </div>
    </div>
  );
}
