'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { useClients } from '@/hooks/useClients';
import { useAssessments } from '@/hooks/useAssessments';
import { isEffectiveDemo } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import { formatDate } from '@/lib/utils';
import { Plus, ClipboardList, TrendingDown, TrendingUp, Minus, Send, X, CheckCircle, Clock, Loader2 } from 'lucide-react';

const assessmentTypes = [
  { id: 'PHQ-9', name: 'PHQ-9', description: 'Depression severity', questions: 9 },
  { id: 'GAD-7', name: 'GAD-7', description: 'Anxiety severity', questions: 7 },
  { id: 'EDE-Q', name: 'EDE-Q', description: 'Eating disorder behaviors', questions: 28 },
  { id: 'K10', name: 'K10', description: 'Psychological distress', questions: 10 },
  { id: 'DASS-21', name: 'DASS-21', description: 'Depression, anxiety, stress', questions: 21 },
  { id: 'CORE-10', name: 'CORE-10', description: 'Clinical outcomes in routine evaluation', questions: 10 },
];

const demoRecentAssessments = [
  { id: 1, client_name: 'Emma Thompson', assessment_type: 'PHQ-9', score: 12, severity: 'Moderate', created_at: new Date(Date.now() - 604800000).toISOString(), status: 'completed' as const, completed_at: new Date(Date.now() - 604800000).toISOString() },
  { id: 2, client_name: 'Sophie Williams', assessment_type: 'EDE-Q', score: 3.2, severity: 'Above Clinical Threshold', created_at: new Date(Date.now() - 1209600000).toISOString(), status: 'completed' as const, completed_at: new Date(Date.now() - 1209600000).toISOString() },
  { id: 3, client_name: 'Mia Patel', assessment_type: 'GAD-7', score: 8, severity: 'Mild', created_at: new Date(Date.now() - 1814400000).toISOString(), status: 'completed' as const, completed_at: new Date(Date.now() - 1814400000).toISOString() },
  { id: 4, client_name: 'Liam Nguyen', assessment_type: 'K10', score: 22, severity: 'Moderate', created_at: new Date(Date.now() - 2419200000).toISOString(), status: 'completed' as const, completed_at: new Date(Date.now() - 2419200000).toISOString() },
];

export default function AssessmentsPage() {
  const { user } = useAuthStore();
  const { clients } = useClients();
  const { assessments: realAssessments, isLoading, sendAssessment } = useAssessments();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedAssessmentType, setSelectedAssessmentType] = useState('');
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const demo = isEffectiveDemo(user?.id);
  const displayAssessments = demo ? demoRecentAssessments : realAssessments;
  const completedAssessments = displayAssessments.filter((a) => a.status === 'completed');
  const pendingAssessments = displayAssessments.filter((a) => a.status === 'pending');

  const openModal = (assessmentId = '') => {
    setSelectedAssessmentType(assessmentId);
    setSelectedClient('');
    setSent(false);
    setModalOpen(true);
  };

  const handleSend = async () => {
    if (!selectedClient || !selectedAssessmentType) return;
    if (demo) {
      setSent(true);
      setTimeout(() => setModalOpen(false), 1800);
      return;
    }
    setSending(true);
    const ok = await sendAssessment(selectedClient, selectedAssessmentType);
    setSending(false);
    if (ok) {
      setSent(true);
      setTimeout(() => setModalOpen(false), 1800);
    }
  };

  function getSeverityVariant(severity: string | null) {
    if (!severity) return 'default' as const;
    const s = severity.toLowerCase();
    if (s.includes('minimal') || s.includes('low') || s.includes('mild') || s.includes('healthy') || s.includes('below')) return 'success' as const;
    if (s.includes('moderate') || s.includes('subclinical')) return 'warning' as const;
    return 'error' as const;
  }

  return (
    <div className="min-h-screen">
      <Header
        title="Assessments"
        subtitle="Standardized psychological assessments"
        actions={
          <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => openModal()}>
            Send Assessment
          </Button>
        }
      />

      <div className="p-6 space-y-6">
        {/* Assessment Types */}
        <Card>
          <CardHeader>
            <CardTitle>Available Assessments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assessmentTypes.map((assessment) => (
                <div
                  key={assessment.id}
                  className="p-4 border border-beige rounded-xl hover:border-sage hover:bg-sage-50/30 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="p-2 bg-sage-50 rounded-lg">
                      <ClipboardList className="w-5 h-5 text-sage" />
                    </div>
                    <Badge variant="default" size="sm">{assessment.questions} questions</Badge>
                  </div>
                  <h3 className="font-semibold text-text-primary">{assessment.name}</h3>
                  <p className="text-sm text-text-muted">{assessment.description}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-3"
                    leftIcon={<Send className="w-3 h-3" />}
                    onClick={() => openModal(assessment.id)}
                  >
                    Send to Client
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Assessments */}
        {pendingAssessments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-warning" />
                Awaiting Client Response ({pendingAssessments.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingAssessments.map((assessment) => (
                  <div key={assessment.id} className="flex items-center gap-4 p-4 bg-warning/5 border border-warning/20 rounded-xl">
                    <Avatar
                      firstName={(assessment.client_name || '').split(' ')[0]}
                      lastName={(assessment.client_name || '').split(' ')[1]}
                      size="md"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-text-primary">{assessment.client_name}</p>
                      <p className="text-sm text-text-muted">Sent {formatDate(assessment.created_at)}</p>
                    </div>
                    <Badge variant="default">{assessment.assessment_type}</Badge>
                    <Badge variant="warning">Pending</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Completed Assessments */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Results</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-text-muted" />
              </div>
            ) : completedAssessments.length === 0 ? (
              <p className="text-text-muted text-center py-8">No completed assessments yet</p>
            ) : (
              <div className="space-y-3">
                {completedAssessments.map((assessment) => (
                  <div key={assessment.id} className="flex items-center gap-4 p-4 bg-sand rounded-xl">
                    <Avatar
                      firstName={(assessment.client_name || '').split(' ')[0]}
                      lastName={(assessment.client_name || '').split(' ')[1]}
                      size="md"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-text-primary">{assessment.client_name}</p>
                      <p className="text-sm text-text-muted">{formatDate(assessment.completed_at || assessment.created_at)}</p>
                    </div>
                    <Badge variant="default">{assessment.assessment_type}</Badge>
                    <div className="text-right">
                      <p className="font-semibold text-text-primary">
                        Score: {assessment.score ?? '—'}
                      </p>
                      {assessment.severity && (
                        <Badge variant={getSeverityVariant(assessment.severity)} size="sm">
                          {assessment.severity}
                        </Badge>
                      )}
                    </div>
                    <div className="p-2 rounded-full bg-sand text-text-muted">
                      <Minus className="w-4 h-4" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Send Assessment Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-large w-full max-w-md p-6">
            {sent ? (
              <div className="text-center py-6">
                <CheckCircle className="w-14 h-14 text-sage mx-auto mb-3" />
                <h3 className="text-xl font-semibold text-text-primary mb-1">Assessment Sent!</h3>
                <p className="text-text-muted text-sm">
                  The client will be prompted to complete the assessment in their portal.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-semibold text-text-primary">Send Assessment</h3>
                  <button onClick={() => setModalOpen(false)} className="p-1.5 hover:bg-sand rounded-lg transition-colors">
                    <X className="w-4 h-4 text-text-muted" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">Assessment Type</label>
                    <select
                      value={selectedAssessmentType}
                      onChange={(e) => setSelectedAssessmentType(e.target.value)}
                      className="w-full px-4 py-2.5 border border-beige rounded-lg bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-sage"
                    >
                      <option value="">Select assessment...</option>
                      {assessmentTypes.map((a) => (
                        <option key={a.id} value={a.id}>{a.name} — {a.description}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">Send to Client</label>
                    <select
                      value={selectedClient}
                      onChange={(e) => setSelectedClient(e.target.value)}
                      className="w-full px-4 py-2.5 border border-beige rounded-lg bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-sage"
                    >
                      <option value="">Select client...</option>
                      {clients.map((c) => (
                        <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>
                      ))}
                    </select>
                  </div>

                  <p className="text-xs text-text-muted bg-sand rounded-lg p-3">
                    The client will see this assessment in their portal. Results appear in Recent Results once submitted.
                  </p>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button variant="secondary" className="flex-1" onClick={() => setModalOpen(false)}>Cancel</Button>
                  <Button
                    className="flex-1"
                    leftIcon={sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    disabled={!selectedClient || !selectedAssessmentType || sending}
                    onClick={handleSend}
                  >
                    {sending ? 'Sending...' : 'Send Assessment'}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
