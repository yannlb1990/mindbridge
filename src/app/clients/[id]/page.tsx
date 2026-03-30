'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import { useDemoData } from '@/hooks/useDemoData';
import { useClients, Client } from '@/hooks/useClients';
import { useGoals } from '@/hooks/useGoals';
import { useSessions } from '@/hooks/useSessions';
import { useNotes } from '@/hooks/useNotes';
import { useHomework } from '@/hooks/useHomework';
import { useSafetyPlans } from '@/hooks/useSafetyPlans';
import { useClientMoodEntries } from '@/hooks/useClientMoodEntries';
import { useClientAssessments } from '@/hooks/useClientAssessments';
import { isEffectiveDemo } from '@/lib/supabase';
import { EditClientModal } from '@/components/clients/EditClientModal';
import { calculateAge, formatDate, getMoodEmoji, getMoodLabel } from '@/lib/utils';
import {
  ArrowLeft,
  Calendar,
  FileText,
  Phone,
  Mail,
  AlertTriangle,
  Shield,
  ClipboardList,
  TrendingUp,
  Edit,
  Plus,
  Clock,
  Video,
  MapPin,
  User,
  BookOpen,
  Target,
  AlertCircle,
  CheckCircle,
  Circle,
  ChevronRight,
  Sparkles,
  Heart,
  Users,
  ExternalLink,
  CreditCard,
  DollarSign,
  Receipt,
  Download,
  Send,
  Upload,
  File,
  FileImage,
  FilePlus,
  Trash2,
  Eye,
  Link2,
  Loader2,
  MoreVertical,
  Flag,
  Milestone,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Brain,
} from 'lucide-react';

type TabType = 'overview' | 'notes' | 'homework' | 'progress' | 'assessments' | 'goals' | 'billing' | 'documents' | 'crisis' | 'emotion';

// Types for Goals — snake_case to match Supabase / useGoals hook
interface TreatmentGoal {
  id: string;
  client_id: string;
  clinician_id: string;
  title: string;
  description: string;
  category: 'symptom_reduction' | 'behavioral' | 'cognitive' | 'interpersonal' | 'functional' | 'other';
  status: 'active' | 'achieved' | 'paused' | 'discontinued';
  priority: 'high' | 'medium' | 'low';
  target_date?: string;
  progress: number;
  milestones: GoalMilestone[];
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface GoalMilestone {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: string;
}

// Types for Documents
interface ClientDocument {
  id: string;
  name: string;
  type: 'consent' | 'referral' | 'report' | 'assessment' | 'correspondence' | 'other';
  fileType: string;
  size: number;
  uploadedAt: string;
  uploadedBy: string;
  url?: string;
}

// Types for Billing
interface ClientInvoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  items: { description: string; quantity: number; amount: number }[];
  total: number;
  paid: number;
  balance: number;
}

export default function ClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [sendingInvite, setSendingInvite] = useState(false);
  const [inviteSent, setInviteSent] = useState(false);
  const { clients: hookClients, fetchClients } = useClients();
  const { sessions: realSessions } = useSessions();
  const { notes: realNotes } = useNotes();
  const { homework: realHomework } = useHomework();
  const { getClientSafetyPlan } = useSafetyPlans();
  const {
    clients: demoClients,
    moodEntries: demoMoodEntries,
    assessments: demoAssessments,
    crisisEvents,
    safetyPlans: demoSafetyPlans,
  } = useDemoData();

  const clientIdParam = params.id as string;

  // Real hooks for per-client mood entries and assessments
  const { entries: realMoodEntries } = useClientMoodEntries(clientIdParam);
  const { assessments: realAssessments } = useClientAssessments(clientIdParam);

  // Use hook clients if available, otherwise demo
  const clients = hookClients.length > 0 ? hookClients : demoClients;
  const client = clients.find((c) => c.id === params.id) as Client | undefined;
  const clientSessions = realSessions.filter((s) => s.client_id === params.id);
  const clientNotes = realNotes.filter((n) => n.client_id === params.id);
  const clientHomework = realHomework.filter((h) => h.client_id === params.id);

  // For mood entries and assessments: use real data for non-demo, demo data as fallback
  const isCurrentDemo = isEffectiveDemo(undefined);
  const clientMoodEntries = isCurrentDemo
    ? demoMoodEntries.filter((m) => m.client_id === params.id)
    : realMoodEntries;
  const clientAssessments = isCurrentDemo
    ? demoAssessments.filter((a) => a.client_id === params.id)
    : realAssessments;

  const clientCrisisEvents = crisisEvents.filter((c) => c.client_id === params.id);
  const clientSafetyPlan = getClientSafetyPlan(clientIdParam) ?? demoSafetyPlans.find((s) => s.client_id === params.id);

  // Emotion Coach sessions — mood_entries with type:'emotion_coach' in notes
  const emotionSessions = clientMoodEntries.filter((e) => {
    try { return JSON.parse(e.notes ?? '{}').type === 'emotion_coach'; } catch { return false; }
  });

  // Demo data for new features
  const [goals, setGoals] = useState<TreatmentGoal[]>([
    {
      id: 'goal-1',
      client_id: 'demo', clinician_id: 'demo',
      title: 'Reduce anxiety symptoms',
      description: 'Decrease frequency and intensity of anxiety episodes through CBT techniques',
      category: 'symptom_reduction',
      status: 'active',
      priority: 'high',
      target_date: '2025-06-30',
      progress: 65,
      milestones: [
        { id: 'm1', title: 'Learn to identify anxiety triggers', completed: true, completedAt: '2025-01-15' },
        { id: 'm2', title: 'Practice breathing techniques daily', completed: true, completedAt: '2025-01-28' },
        { id: 'm3', title: 'Successfully use coping skills in 3 situations', completed: false },
        { id: 'm4', title: 'Reduce avoidance behaviors by 50%', completed: false },
      ],
      created_at: '2024-12-01',
      updated_at: '2025-02-10',
    },
    {
      id: 'goal-2',
      client_id: 'demo', clinician_id: 'demo',
      title: 'Improve social connections',
      description: 'Build and maintain meaningful relationships with peers',
      category: 'interpersonal',
      status: 'active',
      priority: 'medium',
      target_date: '2025-08-31',
      progress: 30,
      milestones: [
        { id: 'm5', title: 'Identify 3 potential social activities', completed: true, completedAt: '2025-02-01' },
        { id: 'm6', title: 'Attend one social event per fortnight', completed: false },
        { id: 'm7', title: 'Initiate conversation with new person', completed: false },
      ],
      created_at: '2025-01-10',
      updated_at: '2025-02-05',
    },
  ]);

  // Real goals from Supabase (for non-demo users)
  const {
    goals: dbGoals,
    setGoals: setDbGoals,
    fetchGoals,
    createGoal: dbCreateGoal,
    toggleMilestone: dbToggleMilestone,
    updateGoalProgress: dbUpdateGoalProgress,
    deleteGoal: dbDeleteGoal,
  } = useGoals(clientIdParam);

  // Fetch real goals on mount
  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  // For real users, replace local goals state with DB data
  const displayGoals = !isCurrentDemo && dbGoals.length > 0 ? dbGoals : goals;
  const displaySetGoals = !isCurrentDemo ? setDbGoals : setGoals;

  const [documents, setDocuments] = useState<ClientDocument[]>([
    {
      id: 'doc-1',
      name: 'Mental Health Treatment Plan',
      type: 'referral',
      fileType: 'pdf',
      size: 245000,
      uploadedAt: '2024-12-01',
      uploadedBy: 'Dr. Sarah Mitchell',
    },
    {
      id: 'doc-2',
      name: 'Consent Form - Telehealth',
      type: 'consent',
      fileType: 'pdf',
      size: 89000,
      uploadedAt: '2024-12-01',
      uploadedBy: 'Practice Admin',
    },
    {
      id: 'doc-3',
      name: 'Initial Assessment Report',
      type: 'assessment',
      fileType: 'pdf',
      size: 456000,
      uploadedAt: '2024-12-15',
      uploadedBy: 'Dr. Jane Smith',
    },
    {
      id: 'doc-4',
      name: 'School Letter - Attendance Support',
      type: 'correspondence',
      fileType: 'docx',
      size: 34000,
      uploadedAt: '2025-01-20',
      uploadedBy: 'Dr. Jane Smith',
    },
  ]);

  const [invoices, setInvoices] = useState<ClientInvoice[]>([
    {
      id: 'inv-1',
      invoiceNumber: 'INV-2025-001',
      date: '2025-02-01',
      dueDate: '2025-02-15',
      status: 'paid',
      items: [
        { description: 'Psychology Session (80110)', quantity: 1, amount: 134.55 },
      ],
      total: 134.55,
      paid: 134.55,
      balance: 0,
    },
    {
      id: 'inv-2',
      invoiceNumber: 'INV-2025-002',
      date: '2025-02-08',
      dueDate: '2025-02-22',
      status: 'sent',
      items: [
        { description: 'Psychology Session (80110)', quantity: 1, amount: 134.55 },
      ],
      total: 134.55,
      paid: 0,
      balance: 134.55,
    },
    {
      id: 'inv-3',
      invoiceNumber: 'INV-2025-003',
      date: '2025-02-15',
      dueDate: '2025-03-01',
      status: 'draft',
      items: [
        { description: 'Psychology Session - Extended (80115)', quantity: 1, amount: 179.35 },
      ],
      total: 179.35,
      paid: 0,
      balance: 179.35,
    },
  ]);

  if (!client) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-text-secondary">Client not found</p>
            <Link href="/clients">
              <Button variant="secondary" className="mt-4">
                Back to Clients
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const sendOnboardingInvite = async () => {
    if (!client?.email) return;
    setSendingInvite(true);
    try {
      const res = await fetch('/api/onboarding/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: client.id,
          email: client.email,
          firstName: client.first_name,
          clinicianName: 'Your clinician',
          clinicianId: client.clinician_id,
        }),
      });
      if (res.ok) {
        setInviteSent(true);
      }
    } finally {
      setSendingInvite(false);
    }
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'overview', label: 'Overview', icon: <User className="w-4 h-4" /> },
    { id: 'notes', label: 'Notes', icon: <FileText className="w-4 h-4" />, count: clientNotes.length },
    { id: 'goals', label: 'Goals', icon: <Target className="w-4 h-4" />, count: displayGoals.filter(g => g.status === 'active').length },
    { id: 'homework', label: 'Homework', icon: <BookOpen className="w-4 h-4" />, count: clientHomework.filter(h => h.status !== 'completed').length },
    { id: 'progress', label: 'Progress', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'assessments', label: 'Assessments', icon: <ClipboardList className="w-4 h-4" />, count: clientAssessments.length },
    { id: 'billing', label: 'Billing', icon: <CreditCard className="w-4 h-4" />, count: invoices.filter(i => i.status === 'sent').length },
    { id: 'documents', label: 'Documents', icon: <File className="w-4 h-4" />, count: documents.length },
    { id: 'crisis', label: 'Safety', icon: <Shield className="w-4 h-4" /> },
    { id: 'emotion', label: 'Emotion Coach', icon: <Brain className="w-4 h-4" />, count: emotionSessions.length },
  ];

  return (
    <div className="min-h-screen">
      <Header
        title=""
        actions={
          <div className="flex gap-2">
            {!client.onboarding_completed && (
              <Button
                variant="secondary"
                leftIcon={sendingInvite ? <Loader2 className="w-4 h-4 animate-spin" /> : inviteSent ? <CheckCircle className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                onClick={sendOnboardingInvite}
                disabled={sendingInvite || inviteSent || !client.email}
              >
                {inviteSent ? 'Invite sent' : 'Send Onboarding'}
              </Button>
            )}
            <Button variant="secondary" leftIcon={<Calendar className="w-4 h-4" />}>
              Schedule Session
            </Button>
            <Link href={`/notes/new?clientId=${client.id}`}>
              <Button leftIcon={<FileText className="w-4 h-4" />}>
                New Note
              </Button>
            </Link>
          </div>
        }
      />

      <div className="p-6">
        {/* Back Button */}
        <Link href="/clients" className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Clients
        </Link>

        {/* Client Header Card */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Avatar
                firstName={client.first_name}
                lastName={client.last_name}
                size="xl"
              />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-display font-semibold text-text-primary">
                    {client.first_name} {client.last_name}
                  </h1>
                  <Badge
                    variant={
                      client.current_risk_level === 'low'
                        ? 'success'
                        : client.current_risk_level === 'moderate'
                        ? 'warning'
                        : 'error'
                    }
                  >
                    {client.current_risk_level === 'high' || client.current_risk_level === 'critical' ? (
                      <AlertTriangle className="w-3 h-3 mr-1" />
                    ) : null}
                    {client.current_risk_level} risk
                  </Badge>
                  {client.status && (
                    <Badge variant={client.status === 'active' ? 'success' : 'default'}>
                      {client.status}
                    </Badge>
                  )}
                </div>

                <p className="text-text-secondary mb-4">
                  {client.date_of_birth ? `${calculateAge(client.date_of_birth)} years old` : ''}
                  {client.primary_diagnosis && ` • ${client.primary_diagnosis}`}
                  {client.pronouns && ` • ${client.pronouns}`}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  <div>
                    <p className="text-text-muted">Treatment</p>
                    <p className="text-text-primary font-medium">{client.treatment_approach || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-text-muted">Sessions</p>
                    <p className="text-text-primary font-medium">{client.session_count}</p>
                  </div>
                  <div>
                    <p className="text-text-muted">Started</p>
                    <p className="text-text-primary font-medium">
                      {client.treatment_start_date ? formatDate(client.treatment_start_date) : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-text-muted">Billing</p>
                    <p className="text-text-primary font-medium capitalize">{client.billing_type || 'Private'}</p>
                  </div>
                  <div>
                    <p className="text-text-muted">Medicare</p>
                    <p className="text-text-primary font-medium">{client.medicare_number || 'Not provided'}</p>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm" leftIcon={<Edit className="w-4 h-4" />} onClick={() => setIsEditModalOpen(true)}>
                Edit
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Navigation */}
        <div className="flex gap-1 mb-6 bg-sand rounded-lg p-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white text-text-primary shadow-sm'
                  : 'text-text-secondary hover:text-text-primary hover:bg-white/50'
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.id ? 'bg-sage text-white' : 'bg-beige text-text-secondary'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <OverviewTab
            client={client}
            sessions={clientSessions as any}
            moodEntries={clientMoodEntries}
            assessments={clientAssessments}
            goals={displayGoals}
            invoices={invoices}
          />
        )}
        {activeTab === 'notes' && (
          <NotesTab notes={clientNotes as any} sessions={clientSessions as any} clientId={client.id} />
        )}
        {activeTab === 'goals' && (
          <GoalsTab
            goals={displayGoals}
            setGoals={displaySetGoals as React.Dispatch<React.SetStateAction<TreatmentGoal[]>>}
            clientId={clientIdParam}
            onCreateGoal={!isCurrentDemo ? dbCreateGoal : undefined}
            onToggleMilestone={!isCurrentDemo ? dbToggleMilestone : undefined}
            onUpdateGoalProgress={!isCurrentDemo ? dbUpdateGoalProgress : undefined}
            onDeleteGoal={!isCurrentDemo ? dbDeleteGoal : undefined}
          />
        )}
        {activeTab === 'homework' && (
          <HomeworkTab homework={clientHomework as any} />
        )}
        {activeTab === 'progress' && (
          <ProgressTab
            moodEntries={clientMoodEntries}
            assessments={clientAssessments}
            client={client}
            goals={displayGoals}
          />
        )}
        {activeTab === 'assessments' && (
          <AssessmentsTab assessments={clientAssessments} />
        )}
        {activeTab === 'billing' && (
          <BillingTab client={client} invoices={invoices} setInvoices={setInvoices} />
        )}
        {activeTab === 'documents' && (
          <DocumentsTab documents={documents} setDocuments={setDocuments} />
        )}
        {activeTab === 'crisis' && (
          <CrisisTab
            crisisEvents={clientCrisisEvents}
            safetyPlan={clientSafetyPlan as any}
            client={client}
          />
        )}
        {activeTab === 'emotion' && (
          <EmotionCoachTab sessions={emotionSessions} />
        )}
      </div>

      {/* Edit Client Modal */}
      <EditClientModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        client={client}
        onSuccess={() => {
          fetchClients();
        }}
      />
    </div>
  );
}

// Overview Tab Component
function OverviewTab({
  client,
  sessions,
  moodEntries,
  assessments,
  goals,
  invoices,
}: {
  client: Client;
  sessions: ReturnType<typeof useDemoData>['sessions'];
  moodEntries: ReturnType<typeof useDemoData>['moodEntries'];
  assessments: ReturnType<typeof useDemoData>['assessments'];
  goals: TreatmentGoal[];
  invoices: ClientInvoice[];
}) {
  const router = useRouter();
  const upcomingSessions = sessions.filter((s) => s.status === 'scheduled').slice(0, 3);
  const recentMood = moodEntries.slice(0, 5);
  const activeGoals = goals.filter(g => g.status === 'active').slice(0, 3);
  const outstandingBalance = invoices.reduce((sum, inv) => sum + inv.balance, 0);
  const latestAssessments = assessments
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .reduce((acc, curr) => {
      if (!acc.find(a => a.assessment_type === curr.assessment_type)) {
        acc.push(curr);
      }
      return acc;
    }, [] as typeof assessments)
    .slice(0, 3);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Info */}
      <div className="lg:col-span-2 space-y-6">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-sage/10 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-sage" />
                </div>
                <div>
                  <p className="text-sm text-text-muted">Phone</p>
                  <p className="font-medium">{client.phone || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-calm/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-calm" />
                </div>
                <div>
                  <p className="text-sm text-text-muted">Email</p>
                  <p className="font-medium">{client.email || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-text-muted">Emergency Contact</p>
                  <p className="font-medium">{client.emergency_contact_name || 'Not provided'}</p>
                  <p className="text-sm text-text-secondary">
                    {client.emergency_contact_phone} {client.emergency_contact_relationship && `(${client.emergency_contact_relationship})`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-sage/10 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-sage" />
                </div>
                <div>
                  <p className="text-sm text-text-muted">GP</p>
                  <p className="font-medium">{client.gp_name || 'Not provided'}</p>
                  <p className="text-sm text-text-secondary">{client.gp_phone}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Goals */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-sage" />
              Active Treatment Goals
            </CardTitle>
            <Button variant="ghost" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
              Add Goal
            </Button>
          </CardHeader>
          <CardContent>
            {activeGoals.length === 0 ? (
              <p className="text-text-muted text-center py-4">No active goals</p>
            ) : (
              <div className="space-y-4">
                {activeGoals.map((goal) => (
                  <div key={goal.id} className="p-4 bg-sand rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-text-primary">{goal.title}</h4>
                      <Badge
                        variant={goal.priority === 'high' ? 'error' : goal.priority === 'medium' ? 'warning' : 'default'}
                        size="sm"
                      >
                        {goal.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex-1 h-2 bg-beige rounded-full overflow-hidden">
                        <div
                          className="h-full bg-sage rounded-full transition-all"
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-text-primary">{goal.progress}%</span>
                    </div>
                    <p className="text-xs text-text-muted">
                      {goal.milestones.filter(m => m.completed).length} of {goal.milestones.length} milestones completed
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Sessions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Upcoming Sessions</CardTitle>
            <Button variant="ghost" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
              Schedule
            </Button>
          </CardHeader>
          <CardContent>
            {upcomingSessions.length === 0 ? (
              <p className="text-text-muted text-center py-4">No upcoming sessions</p>
            ) : (
              <div className="space-y-3">
                {upcomingSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center gap-4 p-3 bg-sand rounded-lg"
                  >
                    <div className="text-center min-w-[70px]">
                      <p className="text-xs text-text-muted">
                        {formatDate(session.scheduled_start)}
                      </p>
                      <p className="text-lg font-semibold text-text-primary">
                        {new Date(session.scheduled_start).toLocaleTimeString('en-AU', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-text-primary capitalize">
                        {session.session_type} Session
                      </p>
                      <div className="flex items-center gap-2 text-sm text-text-muted">
                        <Clock className="w-3 h-3" />
                        {session.duration_minutes} minutes
                        {session.telehealth_link ? (
                          <span className="flex items-center gap-1 text-calm">
                            <Video className="w-3 h-3" /> Telehealth
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> In-person
                          </span>
                        )}
                      </div>
                    </div>
                    <Button size="sm" onClick={() => router.push('/session-capture')}>Start</Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Billing Summary */}
        <Card className={outstandingBalance > 0 ? 'border-warning/50' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-sage" />
              Billing Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-text-muted">Outstanding</span>
                <span className={`font-semibold ${outstandingBalance > 0 ? 'text-warning' : 'text-success'}`}>
                  ${outstandingBalance.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Total Invoiced (YTD)</span>
                <span className="font-medium text-text-primary">
                  ${invoices.reduce((sum, inv) => sum + inv.total, 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Billing Type</span>
                <Badge variant="default" size="sm">{client.billing_type || 'Private'}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Mood */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-sage" />
              Recent Mood
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentMood.length === 0 ? (
              <p className="text-text-muted text-center py-4">No mood entries</p>
            ) : (
              <div className="space-y-3">
                {recentMood.map((entry) => (
                  <div key={entry.id} className="flex items-center gap-3">
                    <span className="text-2xl">{getMoodEmoji(entry.rating)}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-text-primary">
                        {getMoodLabel(entry.rating)}
                      </p>
                      <p className="text-xs text-text-muted">
                        {formatDate(entry.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Latest Assessments */}
        <Card>
          <CardHeader>
            <CardTitle>Latest Assessments</CardTitle>
          </CardHeader>
          <CardContent>
            {latestAssessments.length === 0 ? (
              <p className="text-text-muted text-center py-4">No assessments</p>
            ) : (
              <div className="space-y-3">
                {latestAssessments.map((assessment) => (
                  <div key={assessment.id} className="p-3 bg-sand rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-text-primary">{assessment.assessment_type}</p>
                      <Badge
                        variant={
                          assessment.severity === 'Minimal' || assessment.severity === 'Mild' || assessment.severity === 'Normal Range' ? 'success' :
                          assessment.severity === 'Moderate' || assessment.severity === 'Subclinical' ? 'warning' : 'error'
                        }
                        size="sm"
                      >
                        {assessment.severity}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-muted">{formatDate(assessment.created_at)}</span>
                      <span className="font-semibold text-text-primary">Score: {assessment.score}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="secondary" className="w-full justify-start" leftIcon={<Shield className="w-4 h-4" />} onClick={() => router.push('/safety-plans')}>
              View Safety Plan
            </Button>
            <Button variant="secondary" className="w-full justify-start" leftIcon={<ClipboardList className="w-4 h-4" />} onClick={() => router.push('/assessments')}>
              New Assessment
            </Button>
            <Button variant="secondary" className="w-full justify-start" leftIcon={<BookOpen className="w-4 h-4" />} onClick={() => router.push('/notes/new')}>
              Assign Homework
            </Button>
            <Button variant="secondary" className="w-full justify-start" leftIcon={<Receipt className="w-4 h-4" />} onClick={() => router.push(`/clients/${client.id}?tab=billing`)}>
              Create Invoice
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Goals Tab Component
function GoalsTab({
  goals,
  setGoals,
  clientId,
  onCreateGoal,
  onToggleMilestone,
  onUpdateGoalProgress,
  onDeleteGoal,
}: {
  goals: TreatmentGoal[];
  setGoals: React.Dispatch<React.SetStateAction<TreatmentGoal[]>>;
  clientId: string;
  onCreateGoal?: (data: { clientId: string; title: string; description: string; category: TreatmentGoal['category']; priority: TreatmentGoal['priority']; targetDate?: string; milestones?: string[] }) => Promise<boolean>;
  onToggleMilestone?: (goalId: string, milestoneId: string) => Promise<boolean>;
  onUpdateGoalProgress?: (goalId: string, progress: number) => Promise<boolean>;
  onDeleteGoal?: (goalId: string) => Promise<boolean>;
}) {
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<TreatmentGoal | null>(null);
  const [addForm, setAddForm] = useState({ title: '', description: '', category: 'symptom_reduction' as TreatmentGoal['category'], priority: 'medium' as TreatmentGoal['priority'], targetDate: '', milestoneText: '' });
  const [milestoneList, setMilestoneList] = useState<string[]>([]);
  const [isSavingGoal, setIsSavingGoal] = useState(false);

  const categoryLabels: Record<string, string> = {
    symptom_reduction: 'Symptom Reduction',
    behavioral: 'Behavioral Change',
    cognitive: 'Cognitive',
    interpersonal: 'Interpersonal',
    functional: 'Functional',
    other: 'Other',
  };

  const categoryColors: Record<string, string> = {
    symptom_reduction: 'bg-coral/10 text-coral-dark',
    behavioral: 'bg-sage/10 text-sage-dark',
    cognitive: 'bg-calm/10 text-calm-dark',
    interpersonal: 'bg-gold/10 text-gold-dark',
    functional: 'bg-purple-100 text-purple-700',
    other: 'bg-gray-100 text-gray-700',
  };

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    if (onToggleMilestone) {
      onToggleMilestone(goalId, milestoneId);
      return;
    }
    setGoals(prev => prev.map(goal => {
      if (goal.id === goalId) {
        const updatedMilestones = goal.milestones.map(m => {
          if (m.id === milestoneId) {
            return { ...m, completed: !m.completed, completedAt: !m.completed ? new Date().toISOString() : undefined };
          }
          return m;
        });
        const completedCount = updatedMilestones.filter(m => m.completed).length;
        const progress = Math.round((completedCount / updatedMilestones.length) * 100);
        return { ...goal, milestones: updatedMilestones, progress };
      }
      return goal;
    }));
  };

  const updateGoalStatus = (goalId: string, status: TreatmentGoal['status']) => {
    if (onUpdateGoalProgress && status === 'achieved') {
      onUpdateGoalProgress(goalId, 100);
      return;
    }
    setGoals(prev => prev.map(goal =>
      goal.id === goalId ? { ...goal, status, updated_at: new Date().toISOString() } : goal
    ));
  };

  const handleAddGoal = async () => {
    if (!addForm.title.trim()) return;
    setIsSavingGoal(true);
    if (onCreateGoal) {
      await onCreateGoal({
        clientId,
        title: addForm.title,
        description: addForm.description,
        category: addForm.category,
        priority: addForm.priority,
        targetDate: addForm.targetDate || undefined,
        milestones: milestoneList.filter(Boolean),
      });
    } else {
      const newGoal: TreatmentGoal = {
        id: `goal-${Date.now()}`,
        client_id: clientId,
        clinician_id: '',
        title: addForm.title,
        description: addForm.description,
        category: addForm.category,
        priority: addForm.priority,
        target_date: addForm.targetDate || undefined,
        progress: 0,
        status: 'active',
        milestones: milestoneList.filter(Boolean).map((t, i) => ({ id: `ms-${Date.now()}-${i}`, title: t, completed: false })),
        notes: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setGoals(prev => [...prev, newGoal]);
    }
    setAddForm({ title: '', description: '', category: 'symptom_reduction', priority: 'medium', targetDate: '', milestoneText: '' });
    setMilestoneList([]);
    setIsSavingGoal(false);
    setIsAddGoalOpen(false);
  };

  const activeGoals = goals.filter(g => g.status === 'active');
  const achievedGoals = goals.filter(g => g.status === 'achieved');
  const pausedGoals = goals.filter(g => g.status === 'paused' || g.status === 'discontinued');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Treatment Goals</h2>
        <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsAddGoalOpen(true)}>
          Add Goal
        </Button>
      </div>

      {/* Active Goals */}
      <div>
        <h3 className="text-sm font-medium text-text-muted mb-3 flex items-center gap-2">
          <Flag className="w-4 h-4" />
          Active Goals ({activeGoals.length})
        </h3>
        <div className="space-y-4">
          {activeGoals.map((goal) => (
            <Card key={goal.id} className="overflow-hidden">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-lg font-semibold text-text-primary">{goal.title}</h4>
                      <Badge
                        variant={goal.priority === 'high' ? 'error' : goal.priority === 'medium' ? 'warning' : 'default'}
                        size="sm"
                      >
                        {goal.priority}
                      </Badge>
                      <span className={`text-xs px-2 py-0.5 rounded ${categoryColors[goal.category]}`}>
                        {categoryLabels[goal.category]}
                      </span>
                    </div>
                    <p className="text-text-secondary text-sm mb-3">{goal.description}</p>

                    {/* Progress bar */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex-1 h-3 bg-beige rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            goal.progress >= 100 ? 'bg-success' : goal.progress >= 50 ? 'bg-sage' : 'bg-warning'
                          }`}
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                      <span className="text-lg font-bold text-text-primary">{goal.progress}%</span>
                    </div>

                    {/* Milestones */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-text-muted">Milestones</p>
                      {goal.milestones.map((milestone) => (
                        <div
                          key={milestone.id}
                          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                            milestone.completed ? 'bg-success/10' : 'bg-sand hover:bg-beige'
                          }`}
                          onClick={() => toggleMilestone(goal.id, milestone.id)}
                        >
                          {milestone.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                          ) : (
                            <Circle className="w-5 h-5 text-text-muted flex-shrink-0" />
                          )}
                          <span className={`flex-1 ${milestone.completed ? 'text-text-muted line-through' : 'text-text-primary'}`}>
                            {milestone.title}
                          </span>
                          {milestone.completedAt && (
                            <span className="text-xs text-text-muted">
                              {formatDate(milestone.completedAt)}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<CheckCircle className="w-4 h-4" />}
                      onClick={() => updateGoalStatus(goal.id, 'achieved')}
                    >
                      Complete
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<RotateCcw className="w-4 h-4" />}
                      onClick={() => updateGoalStatus(goal.id, 'paused')}
                    >
                      Pause
                    </Button>
                  </div>
                </div>

                {goal.target_date && (
                  <div className="pt-4 border-t border-beige flex items-center justify-between text-sm">
                    <span className="text-text-muted">Target: {formatDate(goal.target_date)}</span>
                    <span className="text-text-muted">Updated: {formatDate(goal.updated_at)}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          {activeGoals.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Target className="w-12 h-12 text-text-muted mx-auto mb-4" />
                <p className="text-text-secondary">No active treatment goals</p>
                <Button className="mt-4" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsAddGoalOpen(true)}>
                  Add First Goal
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Achieved Goals */}
      {achievedGoals.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-text-muted mb-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-success" />
            Achieved Goals ({achievedGoals.length})
          </h3>
          <div className="space-y-3">
            {achievedGoals.map((goal) => (
              <Card key={goal.id} className="bg-success/5 border-success/20">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-success" />
                      <div>
                        <p className="font-medium text-text-primary">{goal.title}</p>
                        <p className="text-sm text-text-muted">Achieved {formatDate(goal.updated_at)}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateGoalStatus(goal.id, 'active')}
                    >
                      Reactivate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Paused/Discontinued Goals */}
      {pausedGoals.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-text-muted mb-3 flex items-center gap-2">
            <XCircle className="w-4 h-4" />
            Paused/Discontinued ({pausedGoals.length})
          </h3>
          <div className="space-y-3">
            {pausedGoals.map((goal) => (
              <Card key={goal.id} className="opacity-60">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-text-primary">{goal.title}</p>
                      <p className="text-sm text-text-muted capitalize">{goal.status}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateGoalStatus(goal.id, 'active')}
                    >
                      Reactivate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Add Goal Modal */}
      <Modal
        isOpen={isAddGoalOpen}
        onClose={() => setIsAddGoalOpen(false)}
        title="Add Treatment Goal"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsAddGoalOpen(false)}>Cancel</Button>
            <Button
              variant="primary"
              leftIcon={isSavingGoal ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              onClick={handleAddGoal}
              disabled={isSavingGoal || !addForm.title.trim()}
            >
              {isSavingGoal ? 'Saving…' : 'Add Goal'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="label">Goal title *</label>
            <input className="input" placeholder="e.g. Reduce anxiety symptoms" value={addForm.title} onChange={e => setAddForm(f => ({ ...f, title: e.target.value }))} />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input min-h-[80px]" placeholder="What does achieving this goal look like?" value={addForm.description} onChange={e => setAddForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Category</label>
              <select className="input" value={addForm.category} onChange={e => setAddForm(f => ({ ...f, category: e.target.value as TreatmentGoal['category'] }))}>
                <option value="symptom_reduction">Symptom Reduction</option>
                <option value="behavioral">Behavioral Change</option>
                <option value="cognitive">Cognitive</option>
                <option value="interpersonal">Interpersonal</option>
                <option value="functional">Functional</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="label">Priority</label>
              <select className="input" value={addForm.priority} onChange={e => setAddForm(f => ({ ...f, priority: e.target.value as TreatmentGoal['priority'] }))}>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label">Target date <span className="text-text-muted font-normal">(optional)</span></label>
            <input className="input" type="date" value={addForm.targetDate} onChange={e => setAddForm(f => ({ ...f, targetDate: e.target.value }))} />
          </div>
          <div>
            <label className="label">Milestones <span className="text-text-muted font-normal">(optional)</span></label>
            <div className="flex gap-2 mb-2">
              <input
                className="input flex-1"
                placeholder="Add a milestone step..."
                value={addForm.milestoneText}
                onChange={e => setAddForm(f => ({ ...f, milestoneText: e.target.value }))}
                onKeyDown={e => {
                  if (e.key === 'Enter' && addForm.milestoneText.trim()) {
                    setMilestoneList(prev => [...prev, addForm.milestoneText.trim()]);
                    setAddForm(f => ({ ...f, milestoneText: '' }));
                  }
                }}
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  if (addForm.milestoneText.trim()) {
                    setMilestoneList(prev => [...prev, addForm.milestoneText.trim()]);
                    setAddForm(f => ({ ...f, milestoneText: '' }));
                  }
                }}
              >Add</Button>
            </div>
            {milestoneList.map((m, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2 bg-sand rounded-lg mb-1">
                <Circle className="w-4 h-4 text-text-muted flex-shrink-0" />
                <span className="text-sm flex-1">{m}</span>
                <button onClick={() => setMilestoneList(prev => prev.filter((_, j) => j !== i))} className="text-text-muted hover:text-error">
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}

// Billing Tab Component
function BillingTab({
  client,
  invoices,
  setInvoices,
}: {
  client: Client;
  invoices: ClientInvoice[];
  setInvoices: React.Dispatch<React.SetStateAction<ClientInvoice[]>>;
}) {
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false);

  const totalOutstanding = invoices.reduce((sum, inv) => sum + inv.balance, 0);
  const totalPaid = invoices.reduce((sum, inv) => sum + inv.paid, 0);

  const statusColors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-700',
    sent: 'bg-calm/10 text-calm-dark',
    paid: 'bg-success/10 text-success',
    overdue: 'bg-error/10 text-error',
  };

  return (
    <div className="space-y-6">
      {/* Billing Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-text-muted">Outstanding</p>
              <DollarSign className="w-5 h-5 text-warning" />
            </div>
            <p className={`text-3xl font-bold ${totalOutstanding > 0 ? 'text-warning' : 'text-success'}`}>
              ${totalOutstanding.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-text-muted">Paid (YTD)</p>
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            <p className="text-3xl font-bold text-success">${totalPaid.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-text-muted">Billing Type</p>
              <CreditCard className="w-5 h-5 text-sage" />
            </div>
            <p className="text-xl font-bold text-text-primary capitalize">{client.billing_type || 'Private'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-text-muted">Medicare #</p>
              <Receipt className="w-5 h-5 text-calm" />
            </div>
            <p className="text-lg font-medium text-text-primary">{client.medicare_number || 'Not set'}</p>
          </CardContent>
        </Card>
      </div>

      {/* Xero Integration Banner */}
      <Card className="bg-gradient-to-r from-sage/10 to-calm/10 border-sage/20">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <Link2 className="w-5 h-5 text-sage" />
              </div>
              <div>
                <p className="font-medium text-text-primary">Xero Integration</p>
                <p className="text-sm text-text-muted">Invoices sync automatically with your Xero account</p>
              </div>
            </div>
            <Link href="/integrations/xero">
              <Button variant="secondary" size="sm">
                View in Xero
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Invoices */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Invoices</h2>
          <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsCreateInvoiceOpen(true)}>
            Create Invoice
          </Button>
        </div>

        <div className="space-y-3">
          {invoices.map((invoice) => (
            <Card key={invoice.id} className="hover:shadow-md transition-shadow">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-sand rounded-lg flex items-center justify-center">
                      <Receipt className="w-5 h-5 text-sage" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-text-primary">{invoice.invoiceNumber}</p>
                        <span className={`text-xs px-2 py-0.5 rounded capitalize ${statusColors[invoice.status]}`}>
                          {invoice.status}
                        </span>
                      </div>
                      <p className="text-sm text-text-muted">
                        {formatDate(invoice.date)} • Due {formatDate(invoice.dueDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold text-text-primary">${invoice.total.toFixed(2)}</p>
                      {invoice.balance > 0 && (
                        <p className="text-sm text-warning">Balance: ${invoice.balance.toFixed(2)}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" leftIcon={<Eye className="w-4 h-4" />}>
                        View
                      </Button>
                      {invoice.status === 'draft' && (
                        <Button variant="secondary" size="sm" leftIcon={<Send className="w-4 h-4" />}>
                          Send
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" leftIcon={<Download className="w-4 h-4" />}>
                        PDF
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {invoices.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Receipt className="w-12 h-12 text-text-muted mx-auto mb-4" />
                <p className="text-text-secondary">No invoices yet</p>
                <Button className="mt-4" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsCreateInvoiceOpen(true)}>
                  Create First Invoice
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {invoices.filter(inv => inv.paid > 0).map((invoice) => (
              <div key={`payment-${invoice.id}`} className="flex items-center justify-between p-3 bg-success/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <div>
                    <p className="font-medium text-text-primary">{invoice.invoiceNumber}</p>
                    <p className="text-sm text-text-muted">Paid on {formatDate(invoice.date)}</p>
                  </div>
                </div>
                <p className="font-semibold text-success">${invoice.paid.toFixed(2)}</p>
              </div>
            ))}
            {invoices.filter(inv => inv.paid > 0).length === 0 && (
              <p className="text-text-muted text-center py-4">No payments recorded</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Documents Tab Component
function DocumentsTab({
  documents,
  setDocuments,
}: {
  documents: ClientDocument[];
  setDocuments: React.Dispatch<React.SetStateAction<ClientDocument[]>>;
}) {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('all');

  const typeLabels: Record<string, string> = {
    consent: 'Consent Forms',
    referral: 'Referrals',
    report: 'Reports',
    assessment: 'Assessments',
    correspondence: 'Correspondence',
    other: 'Other',
  };

  const typeIcons: Record<string, React.ReactNode> = {
    consent: <Shield className="w-5 h-5 text-sage" />,
    referral: <FileText className="w-5 h-5 text-calm" />,
    report: <ClipboardList className="w-5 h-5 text-gold" />,
    assessment: <Target className="w-5 h-5 text-coral" />,
    correspondence: <Mail className="w-5 h-5 text-purple-500" />,
    other: <File className="w-5 h-5 text-gray-500" />,
  };

  const filteredDocuments = selectedType === 'all'
    ? documents
    : documents.filter(doc => doc.type === selectedType);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const deleteDocument = (docId: string) => {
    setDocuments(prev => prev.filter(d => d.id !== docId));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Documents ({documents.length})</h2>
        <Button leftIcon={<Upload className="w-4 h-4" />} onClick={() => setIsUploadOpen(true)}>
          Upload Document
        </Button>
      </div>

      {/* Type Filter */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedType('all')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            selectedType === 'all'
              ? 'bg-sage text-white'
              : 'bg-sand text-text-secondary hover:bg-beige'
          }`}
        >
          All ({documents.length})
        </button>
        {Object.entries(typeLabels).map(([type, label]) => {
          const count = documents.filter(d => d.type === type).length;
          if (count === 0) return null;
          return (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedType === type
                  ? 'bg-sage text-white'
                  : 'bg-sand text-text-secondary hover:bg-beige'
              }`}
            >
              {label} ({count})
            </button>
          );
        })}
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDocuments.map((doc) => (
          <Card key={doc.id} className="hover:shadow-md transition-shadow">
            <CardContent className="py-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-sand rounded-lg flex items-center justify-center flex-shrink-0">
                  {typeIcons[doc.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-text-primary truncate">{doc.name}</p>
                  <p className="text-sm text-text-muted">
                    {typeLabels[doc.type]} • {doc.fileType.toUpperCase()} • {formatFileSize(doc.size)}
                  </p>
                  <p className="text-xs text-text-muted mt-1">
                    Uploaded {formatDate(doc.uploadedAt)} by {doc.uploadedBy}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteDocument(doc.id)}>
                    <Trash2 className="w-4 h-4 text-coral" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <File className="w-12 h-12 text-text-muted mx-auto mb-4" />
            <p className="text-text-secondary">
              {selectedType === 'all' ? 'No documents uploaded yet' : `No ${typeLabels[selectedType]} found`}
            </p>
            <Button className="mt-4" leftIcon={<Upload className="w-4 h-4" />} onClick={() => setIsUploadOpen(true)}>
              Upload Document
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Upload Modal */}
      <Modal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} title="Upload Document" size="md">
        <div className="space-y-4">
          <div className="border-2 border-dashed border-beige rounded-xl p-8 text-center hover:border-sage transition-colors cursor-pointer">
            <Upload className="w-12 h-12 text-text-muted mx-auto mb-4" />
            <p className="font-medium text-text-primary mb-1">Drop files here or click to upload</p>
            <p className="text-sm text-text-muted">PDF, DOCX, PNG, JPG up to 10MB</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Document Type</label>
              <select className="w-full px-3 py-2 border border-beige rounded-lg bg-white">
                {Object.entries(typeLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Document Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-beige rounded-lg"
                placeholder="Enter document name"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-beige">
            <Button variant="ghost" onClick={() => setIsUploadOpen(false)}>Cancel</Button>
            <Button leftIcon={<Upload className="w-4 h-4" />}>Upload</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// Notes Tab Component
function NotesTab({
  notes,
  sessions,
  clientId,
}: {
  notes: ReturnType<typeof useDemoData>['notes'];
  sessions: ReturnType<typeof useDemoData>['sessions'];
  clientId: string;
}) {
  const sortedNotes = [...notes].sort((a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Clinical Notes ({notes.length})</h2>
        <Link href={`/notes/new?clientId=${clientId}`}>
          <Button leftIcon={<Plus className="w-4 h-4" />}>New Note</Button>
        </Link>
      </div>

      <div className="space-y-4">
        {sortedNotes.map((note) => {
          const session = sessions.find(s => s.id === note.session_id);
          return (
            <Card key={note.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-text-primary">{(note as any).title || `${note.note_format?.toUpperCase() || 'Clinical'} Note`}</h3>
                      {note.ai_generated && (
                        <Badge variant="info" size="sm">
                          <Sparkles className="w-3 h-3 mr-1" />
                          AI Generated
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-text-muted">
                      {formatDate(note.created_at)} • {note.note_format.toUpperCase()} Format
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={note.is_signed ? 'success' : 'warning'}
                      size="sm"
                    >
                      {note.is_signed ? 'Signed' : 'Draft'}
                    </Badge>
                    <ChevronRight className="w-5 h-5 text-text-muted" />
                  </div>
                </div>

                {note.note_format === 'soap' && note.content.subjective && (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-sage mb-1">Subjective</p>
                      <p className="text-text-secondary line-clamp-2">{note.content.subjective}</p>
                    </div>
                    <div>
                      <p className="font-medium text-sage mb-1">Assessment</p>
                      <p className="text-text-secondary line-clamp-2">{note.content.assessment}</p>
                    </div>
                  </div>
                )}

                {note.note_format === 'dap' && note.content.data && (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-sage mb-1">Data</p>
                      <p className="text-text-secondary line-clamp-2">{note.content.data}</p>
                    </div>
                    <div>
                      <p className="font-medium text-sage mb-1">Assessment</p>
                      <p className="text-text-secondary line-clamp-2">{note.content.assessment}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}

        {sortedNotes.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="w-12 h-12 text-text-muted mx-auto mb-4" />
              <p className="text-text-secondary">No clinical notes yet</p>
              <Link href={`/notes/new?clientId=${clientId}`}>
                <Button className="mt-4" leftIcon={<Plus className="w-4 h-4" />}>
                  Create First Note
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// Homework Tab Component
function HomeworkTab({ homework }: { homework: ReturnType<typeof useDemoData>['homework'] }) {
  const sortedHomework = [...homework].sort((a, b) => {
    const statusOrder = { overdue: 0, assigned: 1, in_progress: 2, completed: 3 };
    return statusOrder[a.status] - statusOrder[b.status];
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'in_progress':
        return <Circle className="w-5 h-5 text-calm" />;
      case 'overdue':
        return <AlertCircle className="w-5 h-5 text-error" />;
      default:
        return <Circle className="w-5 h-5 text-text-muted" />;
    }
  };

  const getExerciseTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      thought_record: 'Thought Record',
      behavioral_experiment: 'Behavioral Experiment',
      exposure_task: 'Exposure Task',
      journaling: 'Journaling',
      mindfulness: 'Mindfulness',
      meal_planning: 'Meal Planning',
      other: 'Other',
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Homework Assignments ({homework.length})</h2>
        <Button leftIcon={<Plus className="w-4 h-4" />}>Assign New</Button>
      </div>

      <div className="space-y-3">
        {sortedHomework.map((hw) => (
          <Card key={hw.id} className={`${hw.status === 'overdue' ? 'border-error/50' : ''}`}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                {getStatusIcon(hw.status)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-text-primary">{hw.title}</h3>
                    <Badge
                      variant={
                        hw.status === 'completed' ? 'success' :
                        hw.status === 'overdue' ? 'error' :
                        hw.status === 'in_progress' ? 'info' : 'default'
                      }
                      size="sm"
                    >
                      {hw.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-sm text-text-muted mb-2">
                    {getExerciseTypeLabel((hw as any).exercise_type || (hw as any).category)} •
                    Assigned {formatDate(hw.created_at)}
                    {hw.due_date && ` • Due ${formatDate(hw.due_date)}`}
                  </p>
                  <p className="text-sm text-text-secondary">{hw.description}</p>

                  {((hw as any).response || (hw as any).client_response) && (
                    <div className="mt-3 p-3 bg-success/10 rounded-lg">
                      <p className="text-sm font-medium text-success mb-1">Client Response:</p>
                      <p className="text-sm text-text-secondary">{(hw as any).response || (hw as any).client_response}</p>
                    </div>
                  )}
                </div>
                <Button variant="ghost" size="sm">View</Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {sortedHomework.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="w-12 h-12 text-text-muted mx-auto mb-4" />
              <p className="text-text-secondary">No homework assigned yet</p>
              <Button className="mt-4" leftIcon={<Plus className="w-4 h-4" />}>
                Assign First Homework
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// Progress Tab Component
function ProgressTab({
  moodEntries,
  assessments,
  client,
  goals,
}: {
  moodEntries: ReturnType<typeof useDemoData>['moodEntries'];
  assessments: ReturnType<typeof useDemoData>['assessments'];
  client: Client;
  goals: TreatmentGoal[];
}) {
  const moodByDay = moodEntries.reduce((acc, entry) => {
    const day = new Date(entry.created_at).toDateString();
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(entry);
    return acc;
  }, {} as Record<string, typeof moodEntries>);

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toDateString();
  });

  const averageMood = moodEntries.length > 0
    ? (moodEntries.reduce((sum, e) => sum + e.rating, 0) / moodEntries.length).toFixed(1)
    : 'N/A';

  const phq9Scores = assessments
    .filter(a => a.assessment_type === 'PHQ-9')
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  const phq9Trend = phq9Scores.length >= 2
    ? phq9Scores[phq9Scores.length - 1].score - phq9Scores[phq9Scores.length - 2].score
    : 0;

  const activeGoals = goals.filter(g => g.status === 'active');
  const avgGoalProgress = activeGoals.length > 0
    ? Math.round(activeGoals.reduce((sum, g) => sum + g.progress, 0) / activeGoals.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-text-muted">Average Mood (7 days)</p>
              <TrendingUp className="w-5 h-5 text-sage" />
            </div>
            <p className="text-3xl font-bold text-text-primary">{averageMood}</p>
            <p className="text-sm text-text-muted">out of 5</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-text-muted">Goal Progress</p>
              <Target className="w-5 h-5 text-calm" />
            </div>
            <p className="text-3xl font-bold text-text-primary">{avgGoalProgress}%</p>
            <p className="text-sm text-text-muted">{activeGoals.length} active goals</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-text-muted">PHQ-9 Trend</p>
              <ClipboardList className="w-5 h-5 text-warning" />
            </div>
            <p className={`text-3xl font-bold ${phq9Trend < 0 ? 'text-success' : phq9Trend > 0 ? 'text-error' : 'text-text-primary'}`}>
              {phq9Trend < 0 ? '' : phq9Trend > 0 ? '+' : ''}{phq9Trend}
            </p>
            <p className="text-sm text-text-muted">{phq9Trend < 0 ? 'improving' : phq9Trend > 0 ? 'worsening' : 'stable'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-text-muted">Sessions</p>
              <Calendar className="w-5 h-5 text-sage" />
            </div>
            <p className="text-3xl font-bold text-text-primary">{client.session_count}</p>
            <p className="text-sm text-text-muted">total completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Mood Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Mood Tracking (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2 h-32">
            {last7Days.reverse().map((day) => {
              const dayEntries = moodByDay[day] || [];
              const avgRating = dayEntries.length > 0
                ? dayEntries.reduce((sum, e) => sum + e.rating, 0) / dayEntries.length
                : 0;

              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className={`w-full rounded-t-md ${avgRating > 0 ? 'bg-sage' : 'bg-beige'}`}
                    style={{ height: `${(avgRating / 5) * 100}%`, minHeight: avgRating > 0 ? '8px' : '2px' }}
                  />
                  <span className="text-xs text-text-muted">
                    {new Date(day).toLocaleDateString('en-AU', { weekday: 'short' })}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Mood Entries */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Mood Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {moodEntries.slice(0, 10).map((entry) => (
              <div key={entry.id} className="flex items-start gap-4 p-3 bg-sand rounded-lg">
                <span className="text-3xl">{getMoodEmoji(entry.rating)}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-text-primary">{getMoodLabel(entry.rating)}</p>
                    <span className="text-sm text-text-muted">
                      {new Date(entry.created_at).toLocaleString('en-AU', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-1">
                    {entry.emotions.map((emotion) => (
                      <Badge key={emotion} variant="default" size="sm">
                        {emotion}
                      </Badge>
                    ))}
                  </div>
                  {entry.notes && (
                    <p className="text-sm text-text-secondary">{entry.notes}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Assessments Tab Component
function AssessmentsTab({ assessments }: { assessments: ReturnType<typeof useDemoData>['assessments'] }) {
  const groupedAssessments = assessments.reduce((acc, assessment) => {
    if (!acc[assessment.assessment_type]) {
      acc[assessment.assessment_type] = [];
    }
    acc[assessment.assessment_type].push(assessment);
    return acc;
  }, {} as Record<string, typeof assessments>);

  Object.keys(groupedAssessments).forEach(key => {
    groupedAssessments[key].sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  });

  const assessmentInfo: Record<string, { name: string; description: string; maxScore: number }> = {
    'PHQ-9': { name: 'Patient Health Questionnaire-9', description: 'Depression screening', maxScore: 27 },
    'GAD-7': { name: 'Generalized Anxiety Disorder-7', description: 'Anxiety screening', maxScore: 21 },
    'EDE-Q': { name: 'Eating Disorder Examination Questionnaire', description: 'Eating disorder assessment', maxScore: 6 },
    'DASS-21': { name: 'Depression Anxiety Stress Scales', description: 'Mental health screening', maxScore: 63 },
    'K10': { name: 'Kessler Psychological Distress Scale', description: 'Psychological distress', maxScore: 50 },
    'CORE-10': { name: 'Clinical Outcomes in Routine Evaluation', description: 'General mental health', maxScore: 40 },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Assessments</h2>
        <Button leftIcon={<Plus className="w-4 h-4" />}>New Assessment</Button>
      </div>

      {Object.entries(groupedAssessments).map(([type, typeAssessments]) => {
        const info = assessmentInfo[type] || { name: type, description: '', maxScore: 100 };

        return (
          <Card key={type}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div>
                  <span>{type}</span>
                  <p className="text-sm font-normal text-text-muted">{info.name}</p>
                </div>
                <Button variant="ghost" size="sm">Administer</Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-1 h-16 mb-6 px-4">
                {typeAssessments.slice().reverse().map((assessment) => (
                  <div
                    key={assessment.id}
                    className="flex-1 flex flex-col items-center"
                  >
                    <div
                      className={`w-full max-w-8 rounded-t-sm ${
                        assessment.severity === 'Severe' || assessment.severity === 'Clinical' ? 'bg-error' :
                        assessment.severity === 'Moderate' || assessment.severity === 'Moderately Severe' || assessment.severity === 'Subclinical' ? 'bg-warning' :
                        'bg-success'
                      }`}
                      style={{ height: `${(assessment.score / info.maxScore) * 100}%`, minHeight: '4px' }}
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                {typeAssessments.map((assessment, i) => (
                  <div
                    key={assessment.id}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      i === 0 ? 'bg-sage/10 border border-sage/20' : 'bg-sand'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium text-text-primary">
                          {formatDate(assessment.created_at)}
                          {i === 0 && <span className="ml-2 text-xs text-sage">(Latest)</span>}
                        </p>
                        {assessment.notes && (
                          <p className="text-sm text-text-muted">{assessment.notes}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-bold text-text-primary">{assessment.score}</p>
                        <p className="text-xs text-text-muted">/ {info.maxScore}</p>
                      </div>
                      <Badge
                        variant={
                          assessment.severity === 'Minimal' || assessment.severity === 'Mild' || assessment.severity === 'Normal Range' ? 'success' :
                          assessment.severity === 'Moderate' || assessment.severity === 'Subclinical' ? 'warning' : 'error'
                        }
                      >
                        {assessment.severity}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {Object.keys(groupedAssessments).length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <ClipboardList className="w-12 h-12 text-text-muted mx-auto mb-4" />
            <p className="text-text-secondary">No assessments completed yet</p>
            <Button className="mt-4" leftIcon={<Plus className="w-4 h-4" />}>
              Start First Assessment
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Emotion Coach Tab Component
function EmotionCoachTab({
  sessions,
}: {
  sessions: ReturnType<typeof useDemoData>['moodEntries'];
}) {
  const [expanded, setExpanded] = useState<string | null>(null);

  if (sessions.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Brain className="w-12 h-12 text-text-muted mx-auto mb-4" />
          <p className="text-text-secondary">No Emotion Coach sessions yet for this client</p>
          <p className="text-sm text-text-muted mt-2">Sessions will appear here once the client uses the Emotion Coach game.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Brain className="w-5 h-5 text-violet-500" />
          Emotion Coach Sessions ({sessions.length})
        </h2>
      </div>

      <div className="space-y-3">
        {sessions.map((entry) => {
          let parsed: Record<string, unknown> = {};
          try { parsed = JSON.parse(entry.notes ?? '{}'); } catch { /* ignore */ }

          const scenario = (parsed.scenario as string) ?? 'Situation not recorded';
          const aiValidation = (parsed.aiValidation as string) ?? '';
          const aiStrategies = (parsed.aiStrategies as string[]) ?? [];
          const aiEncouragement = (parsed.aiEncouragement as string) ?? '';
          const clientNote = (parsed.clientNote as string) ?? '';
          const severity = (parsed.severity as string) ?? 'mixed';
          const isExpanded = expanded === entry.id;

          const severityChipColors: Record<string, string> = {
            positive:   'bg-sage/20 text-sage-dark',
            mixed:      'bg-gold/20 text-gold-dark',
            negative:   'bg-coral/20 text-coral-dark',
            concerning: 'bg-error/10 text-error',
          };

          const emotionChipColor = (emotion: string) => {
            const opt = ['Happy', 'Excited', 'Calm', 'Proud', 'Grateful', 'Loved', 'Hopeful', 'Content', 'Silly'];
            return opt.includes(emotion) ? 'bg-sage/20 text-sage-dark' : 'bg-coral/20 text-coral-dark';
          };

          return (
            <Card key={entry.id} className="overflow-hidden">
              <CardContent className="pt-4 pb-4">
                {/* Header row */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-text-primary truncate">{scenario.slice(0, 80)}{scenario.length > 80 ? '…' : ''}</p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {new Date(entry.created_at).toLocaleString('en-AU', {
                        weekday: 'short', month: 'short', day: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {severity === 'concerning' && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-error/10 text-error font-medium flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Concerning
                      </span>
                    )}
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${severityChipColors[severity] ?? 'bg-gray-100 text-gray-600'}`}>
                      {severity}
                    </span>
                  </div>
                </div>

                {/* Emotion chips */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {entry.emotions.map((em) => (
                    <span key={em} className={`text-xs px-2 py-0.5 rounded-full font-medium ${emotionChipColor(em)}`}>
                      {em}
                    </span>
                  ))}
                </div>

                {/* AI guidance preview */}
                {aiValidation && (
                  <p className="text-sm text-text-secondary line-clamp-2 mb-3">
                    {aiValidation.split('.')[0]}.
                  </p>
                )}

                {/* Expand toggle */}
                <button
                  onClick={() => setExpanded(isExpanded ? null : entry.id)}
                  className="text-xs text-violet-600 hover:text-violet-800 font-medium underline transition-colors"
                >
                  {isExpanded ? 'Show less' : 'Show full guidance'}
                </button>

                {/* Expanded drawer */}
                {isExpanded && (
                  <div className="mt-4 space-y-3 border-t border-beige pt-4">
                    <div className="bg-violet-50 rounded-xl p-3">
                      <p className="text-xs font-bold uppercase tracking-wide text-violet-700 mb-1">AI Validation</p>
                      <p className="text-sm text-text-primary">{aiValidation}</p>
                    </div>

                    {aiStrategies.length > 0 && (
                      <div className="bg-sage-50 rounded-xl p-3">
                        <p className="text-xs font-bold uppercase tracking-wide text-sage-dark mb-2">Coping Strategies Suggested</p>
                        <ul className="space-y-1">
                          {aiStrategies.map((s, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-text-primary">
                              <span className="text-sage font-bold">{i + 1}.</span> {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {aiEncouragement && (
                      <div className="bg-gold/10 rounded-xl p-3">
                        <p className="text-xs font-bold uppercase tracking-wide text-gold-dark mb-1">Encouragement</p>
                        <p className="text-sm text-text-primary">{aiEncouragement}</p>
                      </div>
                    )}

                    {clientNote && (
                      <div className="bg-sand rounded-xl p-3">
                        <p className="text-xs font-bold uppercase tracking-wide text-text-muted mb-1">Client Note</p>
                        <p className="text-sm text-text-secondary italic">&ldquo;{clientNote}&rdquo;</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// Crisis & Safety Tab Component
function CrisisTab({
  crisisEvents,
  safetyPlan,
  client,
}: {
  crisisEvents: ReturnType<typeof useDemoData>['crisisEvents'];
  safetyPlan: ReturnType<typeof useDemoData>['safetyPlans'][0] | undefined;
  client: Client;
}) {
  const router = useRouter();
  const sortedEvents = [...crisisEvents].sort((a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const getEventTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      suicidal_ideation: 'Suicidal Ideation',
      self_harm: 'Self-Harm',
      hospitalization: 'Hospitalization',
      crisis_call: 'Crisis Call',
      safety_plan_activation: 'Safety Plan Activation',
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-6">
      {/* Risk Status */}
      <Card className={`${
        client.current_risk_level === 'high' || client.current_risk_level === 'critical'
          ? 'border-error bg-error/5'
          : client.current_risk_level === 'moderate'
          ? 'border-warning bg-warning/5'
          : 'border-success bg-success/5'
      }`}>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              client.current_risk_level === 'high' || client.current_risk_level === 'critical'
                ? 'bg-error/20'
                : client.current_risk_level === 'moderate'
                ? 'bg-warning/20'
                : 'bg-success/20'
            }`}>
              <AlertTriangle className={`w-6 h-6 ${
                client.current_risk_level === 'high' || client.current_risk_level === 'critical'
                  ? 'text-error'
                  : client.current_risk_level === 'moderate'
                  ? 'text-warning'
                  : 'text-success'
              }`} />
            </div>
            <div>
              <p className="text-sm text-text-muted">Current Risk Level</p>
              <p className="text-2xl font-bold text-text-primary capitalize">{client.current_risk_level}</p>
            </div>
            <div className="ml-auto">
              <Button variant="secondary" onClick={() => router.push('/assessments')}>Update Risk Assessment</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Safety Plan */}
      {safetyPlan ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-sage" />
              Safety Plan
            </CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-text-muted">
                Last reviewed: {formatDate(safetyPlan.last_reviewed)}
              </span>
              <Button variant="ghost" size="sm" leftIcon={<Edit className="w-4 h-4" />}>
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold text-text-primary mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-warning" />
                Warning Signs
              </h4>
              <div className="flex flex-wrap gap-2">
                {safetyPlan.warning_signs.map((sign, i) => (
                  <Badge key={i} variant="warning">{sign}</Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-text-primary mb-2 flex items-center gap-2">
                <Target className="w-4 h-4 text-sage" />
                Coping Strategies
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {safetyPlan.coping_strategies.map((strategy, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 bg-sand rounded">
                    <CheckCircle className="w-4 h-4 text-sage" />
                    <span className="text-sm">{strategy}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-text-primary mb-2 flex items-center gap-2">
                <Users className="w-4 h-4 text-calm" />
                Support People
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {safetyPlan.support_people.map((person, i) => (
                  <div key={i} className="p-3 bg-sand rounded-lg">
                    <p className="font-medium text-text-primary">{person.name}</p>
                    <p className="text-sm text-text-muted">{person.relationship}</p>
                    <p className="text-sm text-calm">{person.phone}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-text-primary mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4 text-error" />
                Crisis Helplines
              </h4>
              <div className="grid grid-cols-4 gap-3">
                {safetyPlan.crisis_helplines.map((helpline, i) => (
                  <div key={i} className="p-3 bg-error/5 border border-error/20 rounded-lg text-center">
                    <p className="font-medium text-text-primary">{helpline.name}</p>
                    <p className="text-lg font-bold text-error">{helpline.phone}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-text-primary mb-2 flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500" />
                Reasons to Live
              </h4>
              <div className="flex flex-wrap gap-2">
                {safetyPlan.reasons_to_live.map((reason, i) => (
                  <Badge key={i} variant="success">{reason}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Shield className="w-12 h-12 text-text-muted mx-auto mb-4" />
            <p className="text-text-secondary mb-4">No safety plan created yet</p>
            <Button leftIcon={<Plus className="w-4 h-4" />}>
              Create Safety Plan
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Crisis History */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Crisis History</CardTitle>
          <Button variant="ghost" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
            Log Incident
          </Button>
        </CardHeader>
        <CardContent>
          {sortedEvents.length > 0 ? (
            <div className="space-y-4">
              {sortedEvents.map((event) => (
                <div
                  key={event.id}
                  className={`p-4 rounded-lg border ${
                    event.severity === 'high' || event.severity === 'critical'
                      ? 'border-error/50 bg-error/5'
                      : 'border-warning/50 bg-warning/5'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={event.severity === 'high' || event.severity === 'critical' ? 'error' : 'warning'}
                      >
                        {getEventTypeLabel(event.event_type)}
                      </Badge>
                      <span className="text-sm text-text-muted">
                        {formatDate(event.created_at)}
                      </span>
                    </div>
                    {event.resolved && (
                      <Badge variant="success" size="sm">Resolved</Badge>
                    )}
                  </div>
                  <p className="text-text-secondary mb-3">{event.description}</p>
                  <div>
                    <p className="text-sm font-medium text-text-primary mb-1">Actions Taken:</p>
                    <ul className="list-disc list-inside text-sm text-text-secondary">
                      {event.actions_taken.map((action, i) => (
                        <li key={i}>{action}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-muted text-center py-8">No crisis events recorded</p>
          )}
        </CardContent>
      </Card>

      {/* Australian Crisis Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="w-5 h-5 text-calm" />
            Australian Crisis Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a
              href="https://www.lifeline.org.au"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-sand rounded-lg hover:bg-beige transition-colors text-center"
            >
              <p className="font-semibold text-text-primary">Lifeline</p>
              <p className="text-lg font-bold text-sage">13 11 14</p>
            </a>
            <a
              href="https://www.beyondblue.org.au"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-sand rounded-lg hover:bg-beige transition-colors text-center"
            >
              <p className="font-semibold text-text-primary">Beyond Blue</p>
              <p className="text-lg font-bold text-sage">1300 22 4636</p>
            </a>
            <a
              href="https://www.kidshelpline.com.au"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-sand rounded-lg hover:bg-beige transition-colors text-center"
            >
              <p className="font-semibold text-text-primary">Kids Helpline</p>
              <p className="text-lg font-bold text-sage">1800 55 1800</p>
            </a>
            <a
              href="https://butterfly.org.au"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-sand rounded-lg hover:bg-beige transition-colors text-center"
            >
              <p className="font-semibold text-text-primary">Butterfly</p>
              <p className="text-lg font-bold text-sage">1800 33 4673</p>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
