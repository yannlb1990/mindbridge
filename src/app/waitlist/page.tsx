'use client';

import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Modal } from '@/components/ui/Modal';
import { useClients, Client } from '@/hooks/useClients';
import { useAuthStore } from '@/stores/authStore';
import { isEffectiveDemo } from '@/lib/supabase';
import { formatDate } from '@/lib/utils';
import {
  Clock,
  Mail,
  Phone,
  CheckCircle,
  UserPlus,
  AlertCircle,
  Loader2,
  ChevronUp,
  ChevronDown,
  Search,
  Users,
  ArrowRight,
} from 'lucide-react';

const DEMO_WAITLIST: Client[] = [
  {
    id: 'wl-1', user_id: 'u1', email: 'james.b@email.com',
    first_name: 'James', last_name: 'Burton',
    date_of_birth: '1988-05-14', phone: '0412 345 678',
    current_risk_level: 'low', status: 'waitlist',
    session_count: 0, created_at: new Date(Date.now() - 21 * 86400000).toISOString(),
    primary_diagnosis: 'Generalised Anxiety Disorder',
    referral_source: 'GP Referral',
  },
  {
    id: 'wl-2', user_id: 'u2', email: 'priya.k@email.com',
    first_name: 'Priya', last_name: 'Krishnamurthy',
    date_of_birth: '1995-11-03', phone: '0423 567 890',
    current_risk_level: 'moderate', status: 'waitlist',
    session_count: 0, created_at: new Date(Date.now() - 14 * 86400000).toISOString(),
    primary_diagnosis: 'Major Depressive Disorder',
    referral_source: 'Self-referral',
  },
  {
    id: 'wl-3', user_id: 'u3', email: 'tom.r@email.com',
    first_name: 'Tom', last_name: 'Richardson',
    date_of_birth: '2003-07-22', phone: '0434 789 012',
    current_risk_level: 'low', status: 'waitlist',
    session_count: 0, created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    primary_diagnosis: 'ADHD',
    referral_source: 'Paediatrician',
  },
];

function daysWaiting(createdAt: string) {
  return Math.floor((Date.now() - new Date(createdAt).getTime()) / 86400000);
}

export default function WaitlistPage() {
  const { user } = useAuthStore();
  const { clients: hookClients } = useClients();
  const [searchQuery, setSearchQuery] = useState('');
  const [promoting, setPromoting] = useState<string | null>(null);
  const [promoted, setPromoted] = useState<string[]>([]);
  const [confirmClient, setConfirmClient] = useState<Client | null>(null);
  const [sortBy, setSortBy] = useState<'oldest' | 'newest' | 'risk'>('oldest');

  const isDemo = isEffectiveDemo(user?.id);

  const allWaitlist: Client[] = isDemo
    ? DEMO_WAITLIST
    : hookClients.filter((c) => c.status === 'waitlist');

  const waitlist = allWaitlist
    .filter((c) => !promoted.includes(c.id))
    .filter((c) =>
      `${c.first_name} ${c.last_name} ${c.email}`.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      const riskOrder = { critical: 0, high: 1, moderate: 2, low: 3 };
      return riskOrder[a.current_risk_level] - riskOrder[b.current_risk_level];
    });

  const handlePromote = async (client: Client) => {
    setConfirmClient(null);
    setPromoting(client.id);
    try {
      const res = await fetch('/api/waitlist/promote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId: client.id, email: client.email, firstName: client.first_name }),
      });
      if (res.ok || isDemo) {
        setPromoted((prev) => [...prev, client.id]);
      }
    } catch {
      // For demo, still mark as promoted
      if (isDemo) setPromoted((prev) => [...prev, client.id]);
    } finally {
      setPromoting(null);
    }
  };

  const riskVariant = (level: Client['current_risk_level']) =>
    ({ low: 'success', moderate: 'warning', high: 'error', critical: 'error' } as const)[level];

  return (
    <div className="min-h-screen">
      <Header
        title="Waitlist"
        subtitle={`${waitlist.length} client${waitlist.length !== 1 ? 's' : ''} waiting`}
      />

      <div className="p-6 max-w-4xl">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-beige rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sage"
            />
          </div>
          <div className="flex gap-2">
            {(['oldest', 'newest', 'risk'] as const).map((opt) => (
              <button
                key={opt}
                onClick={() => setSortBy(opt)}
                className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${
                  sortBy === opt
                    ? 'bg-sage text-white border-sage'
                    : 'bg-white text-text-secondary border-beige hover:bg-sand'
                }`}
              >
                {opt === 'oldest' ? 'Longest wait' : opt === 'newest' ? 'Recent' : 'By risk'}
              </button>
            ))}
          </div>
        </div>

        {/* Empty state */}
        {waitlist.length === 0 && (
          <Card>
            <CardContent className="py-16 text-center">
              <Users className="w-12 h-12 text-text-muted mx-auto mb-4" />
              <p className="text-text-primary font-medium mb-1">No clients on the waitlist</p>
              <p className="text-text-muted text-sm">
                When you add a client with status set to &ldquo;Waitlist&rdquo;, they&apos;ll appear here.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Waitlist cards */}
        <div className="space-y-3">
          {waitlist.map((client, idx) => {
            const days = daysWaiting(client.created_at);
            const isPromoting = promoting === client.id;
            return (
              <Card key={client.id} className="hover:shadow-md transition-shadow">
                <CardContent className="py-4">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <Avatar firstName={client.first_name} lastName={client.last_name} size="md" />
                      <span className="absolute -top-1 -left-2 w-5 h-5 bg-sage text-white text-xs flex items-center justify-center rounded-full font-semibold">
                        {idx + 1}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-semibold text-text-primary">
                          {client.first_name} {client.last_name}
                        </span>
                        <Badge variant={riskVariant(client.current_risk_level)} size="sm">
                          {client.current_risk_level} risk
                        </Badge>
                        {days >= 14 && (
                          <Badge variant="warning" size="sm">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Long wait
                          </Badge>
                        )}
                      </div>
                      {client.primary_diagnosis && (
                        <p className="text-sm text-text-secondary mb-2">{client.primary_diagnosis}</p>
                      )}
                      <div className="flex flex-wrap gap-4 text-xs text-text-muted">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          Waiting {days} day{days !== 1 ? 's' : ''} — added {formatDate(client.created_at)}
                        </span>
                        {client.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5" />
                            {client.email}
                          </span>
                        )}
                        {client.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5" />
                            {client.phone}
                          </span>
                        )}
                        {client.referral_source && (
                          <span className="flex items-center gap-1">
                            <UserPlus className="w-3.5 h-3.5" />
                            {client.referral_source}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        variant="primary"
                        size="sm"
                        leftIcon={isPromoting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                        onClick={() => setConfirmClient(client)}
                        disabled={!!promoting}
                      >
                        Activate
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recently promoted */}
        {promoted.length > 0 && (
          <div className="mt-6">
            <p className="text-sm text-text-muted mb-3 font-medium">Activated this session</p>
            <div className="space-y-2">
              {promoted.map((id) => {
                const c = allWaitlist.find((w) => w.id === id);
                if (!c) return null;
                return (
                  <div key={id} className="flex items-center gap-3 px-4 py-3 bg-sage/10 rounded-xl border border-sage/20">
                    <CheckCircle className="w-4 h-4 text-sage flex-shrink-0" />
                    <span className="text-sm text-text-primary font-medium">{c.first_name} {c.last_name}</span>
                    <span className="text-xs text-text-muted">— activated, notification sent</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Confirm promote modal */}
      <Modal
        isOpen={!!confirmClient}
        onClose={() => setConfirmClient(null)}
        title="Activate client"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setConfirmClient(null)}>Cancel</Button>
            <Button
              variant="primary"
              leftIcon={<CheckCircle className="w-4 h-4" />}
              onClick={() => confirmClient && handlePromote(confirmClient)}
            >
              Activate &amp; notify
            </Button>
          </div>
        }
      >
        {confirmClient && (
          <div className="space-y-3">
            <p className="text-text-secondary text-sm">
              This will set <strong>{confirmClient.first_name} {confirmClient.last_name}</strong>&apos;s status
              to <strong>Active</strong> and send them a notification email.
            </p>
            <div className="bg-sage/10 rounded-xl p-4 text-sm text-text-primary">
              <p className="font-medium mb-1">What happens next:</p>
              <ul className="space-y-1 text-text-secondary">
                <li>• Client status updated to &ldquo;Active&rdquo;</li>
                <li>• Welcome email sent to {confirmClient.email}</li>
                <li>• Client moves off this waitlist view</li>
                <li>• You can now book sessions for them</li>
              </ul>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
