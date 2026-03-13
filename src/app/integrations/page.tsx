'use client';

import { useState, useEffect } from 'react';
import {
  SiXero, SiQuickbooks, SiGooglecalendar, SiCalendly, SiZoom,
  SiTwilio, SiSendgrid, SiMailchimp, SiStripe, SiSquare, SiPaypal, SiMyob,
} from 'react-icons/si';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import {
  Link2,
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ExternalLink,
  Settings,
  RefreshCw,
  Clock,
  Zap,
  Shield,
  Key,
  X,
  Check,
  Loader2,
  ChevronRight,
  Calendar,
  CreditCard,
  Video,
  MessageSquare,
  FileText,
  Building2,
  Heart,
  Mail,
  Phone,
  Database,
  Cloud,
  Smartphone,
  Globe,
  DollarSign,
  Receipt,
  Users,
  Activity,
  BarChart3,
  Lock,
  Unlock,
  RotateCcw,
  History,
  ArrowRight,
  Info,
  Copy,
  Eye,
  EyeOff,
  Trash2,
  Plus,
  Filter,
  LayoutGrid,
  List,
} from 'lucide-react';

// Integration Types
interface Integration {
  id: string;
  name: string;
  description: string;
  category: 'accounting' | 'medicare' | 'calendar' | 'telehealth' | 'communication' | 'payments' | 'practice' | 'health-records';
  logo: string;
  status: 'connected' | 'disconnected' | 'error' | 'pending';
  isPopular: boolean;
  isPremium: boolean;
  features: string[];
  lastSync?: string;
  syncFrequency?: string;
  connectedAt?: string;
  accountInfo?: {
    name: string;
    email?: string;
    plan?: string;
  };
  settings?: IntegrationSettings;
  webhookUrl?: string;
  apiVersion?: string;
}

interface IntegrationSettings {
  autoSync: boolean;
  syncFrequency: 'realtime' | '15min' | 'hourly' | 'daily';
  syncInvoices?: boolean;
  syncPayments?: boolean;
  syncContacts?: boolean;
  syncAppointments?: boolean;
  twoWaySync?: boolean;
  notifications?: boolean;
}

interface SyncLog {
  id: string;
  integrationId: string;
  timestamp: string;
  status: 'success' | 'error' | 'partial';
  message: string;
  recordsProcessed?: number;
  duration?: string;
}

// Category Configuration
const CATEGORIES = {
  accounting: { label: 'Accounting & Invoicing', icon: <DollarSign className="w-5 h-5" />, color: 'bg-emerald-500' },
  medicare: { label: 'Medicare & Health Claims', icon: <Heart className="w-5 h-5" />, color: 'bg-blue-500' },
  calendar: { label: 'Calendar & Scheduling', icon: <Calendar className="w-5 h-5" />, color: 'bg-purple-500' },
  telehealth: { label: 'Telehealth & Video', icon: <Video className="w-5 h-5" />, color: 'bg-cyan-500' },
  communication: { label: 'Communication', icon: <MessageSquare className="w-5 h-5" />, color: 'bg-amber-500' },
  payments: { label: 'Payment Processing', icon: <CreditCard className="w-5 h-5" />, color: 'bg-pink-500' },
  practice: { label: 'Practice Management', icon: <Building2 className="w-5 h-5" />, color: 'bg-indigo-500' },
  'health-records': { label: 'Health Records', icon: <FileText className="w-5 h-5" />, color: 'bg-red-500' },
};

// Available Integrations
const AVAILABLE_INTEGRATIONS: Integration[] = [
  // Accounting
  {
    id: 'xero',
    name: 'Xero',
    description: 'Cloud accounting software for invoicing, expenses, payroll, and financial reporting.',
    category: 'accounting',
    logo: '🔷',
    status: 'disconnected',
    isPopular: true,
    isPremium: false,
    features: ['Auto-sync invoices', 'Payment reconciliation', 'Expense tracking', 'Financial reports', 'Multi-currency'],
    apiVersion: 'v2.0',
  },
  {
    id: 'myob',
    name: 'MYOB',
    description: 'Australian accounting and business management software.',
    category: 'accounting',
    logo: '🟣',
    status: 'disconnected',
    isPopular: true,
    isPremium: false,
    features: ['Invoice sync', 'Bank feeds', 'BAS reporting', 'Payroll integration'],
    apiVersion: 'v4',
  },
  {
    id: 'quickbooks',
    name: 'QuickBooks',
    description: 'Small business accounting software for invoicing and expenses.',
    category: 'accounting',
    logo: '🟢',
    status: 'disconnected',
    isPopular: false,
    isPremium: false,
    features: ['Invoice management', 'Expense tracking', 'Tax calculations', 'Reports'],
    apiVersion: 'v3',
  },
  // Medicare & Health Claims
  {
    id: 'medicare',
    name: 'Medicare Online',
    description: 'Direct Medicare bulk billing and patient claim submissions.',
    category: 'medicare',
    logo: '🏥',
    status: 'disconnected',
    isPopular: true,
    isPremium: false,
    features: ['Bulk billing', 'Patient claims', 'Eligibility checks', 'Claim status tracking'],
    apiVersion: 'ECLIPSE',
  },
  {
    id: 'hicaps',
    name: 'HICAPS',
    description: 'Health fund claiming at point of sale for private health insurance.',
    category: 'medicare',
    logo: '💳',
    status: 'disconnected',
    isPopular: true,
    isPremium: false,
    features: ['Instant claiming', '40+ health funds', 'Gap payments', 'EFTPOS integration'],
    apiVersion: 'v3.2',
  },
  {
    id: 'tyro',
    name: 'Tyro Health',
    description: 'Health claiming terminal for Medicare and private health funds.',
    category: 'medicare',
    logo: '🔴',
    status: 'disconnected',
    isPopular: false,
    isPremium: false,
    features: ['Medicare claiming', 'Health fund claims', 'DVA claims', 'Integrated EFTPOS'],
    apiVersion: 'v2',
  },
  // Calendar
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    description: 'Two-way sync with Google Calendar for appointment management.',
    category: 'calendar',
    logo: '📅',
    status: 'disconnected',
    isPopular: true,
    isPremium: false,
    features: ['Two-way sync', 'Multiple calendars', 'Automatic updates', 'Event reminders'],
    apiVersion: 'v3',
  },
  {
    id: 'outlook',
    name: 'Microsoft Outlook',
    description: 'Sync appointments with Outlook and Microsoft 365 calendar.',
    category: 'calendar',
    logo: '📧',
    status: 'disconnected',
    isPopular: true,
    isPremium: false,
    features: ['Calendar sync', 'Email integration', 'Teams meetings', 'Shared calendars'],
    apiVersion: 'Graph API v1.0',
  },
  {
    id: 'calendly',
    name: 'Calendly',
    description: 'Online appointment scheduling and booking management.',
    category: 'calendar',
    logo: '🗓️',
    status: 'disconnected',
    isPopular: false,
    isPremium: false,
    features: ['Online booking', 'Availability sync', 'Booking confirmations', 'Buffer times'],
    apiVersion: 'v2',
  },
  // Telehealth
  {
    id: 'zoom',
    name: 'Zoom',
    description: 'Video conferencing for telehealth sessions with waiting rooms.',
    category: 'telehealth',
    logo: '🎥',
    status: 'disconnected',
    isPopular: true,
    isPremium: false,
    features: ['Auto-create meetings', 'Waiting rooms', 'Recording', 'Virtual backgrounds'],
    apiVersion: 'v2',
  },
  {
    id: 'teams',
    name: 'Microsoft Teams',
    description: 'Video meetings integrated with Microsoft 365.',
    category: 'telehealth',
    logo: '💜',
    status: 'disconnected',
    isPopular: true,
    isPremium: false,
    features: ['Video calls', 'Screen sharing', 'Chat', 'File sharing'],
    apiVersion: 'Graph API',
  },
  {
    id: 'coviu',
    name: 'Coviu',
    description: 'Australian telehealth platform built for healthcare.',
    category: 'telehealth',
    logo: '🩺',
    status: 'disconnected',
    isPopular: false,
    isPremium: true,
    features: ['HIPAA compliant', 'Waiting room', 'Screen sharing', 'Built for healthcare'],
    apiVersion: 'v1',
  },
  // Communication
  {
    id: 'twilio',
    name: 'Twilio',
    description: 'SMS and voice communications for appointment reminders.',
    category: 'communication',
    logo: '📱',
    status: 'disconnected',
    isPopular: true,
    isPremium: false,
    features: ['SMS reminders', 'Voice calls', 'Two-way messaging', 'Delivery tracking'],
    apiVersion: 'v2010',
  },
  {
    id: 'sendgrid',
    name: 'SendGrid',
    description: 'Email delivery for appointment confirmations and communications.',
    category: 'communication',
    logo: '✉️',
    status: 'disconnected',
    isPopular: false,
    isPremium: false,
    features: ['Email delivery', 'Templates', 'Analytics', 'High deliverability'],
    apiVersion: 'v3',
  },
  {
    id: 'mailchimp',
    name: 'Mailchimp',
    description: 'Email marketing and client communication campaigns.',
    category: 'communication',
    logo: '🐵',
    status: 'disconnected',
    isPopular: false,
    isPremium: false,
    features: ['Email campaigns', 'Automation', 'Audience segmentation', 'Analytics'],
    apiVersion: 'v3',
  },
  // Payments
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Online payment processing for invoices and appointments.',
    category: 'payments',
    logo: '💳',
    status: 'disconnected',
    isPopular: true,
    isPremium: false,
    features: ['Card payments', 'Invoicing', 'Subscriptions', 'Payment links'],
    apiVersion: 'v2023-10',
  },
  {
    id: 'square',
    name: 'Square',
    description: 'Payment processing with in-person and online options.',
    category: 'payments',
    logo: '⬛',
    status: 'disconnected',
    isPopular: false,
    isPremium: false,
    features: ['Card payments', 'Invoices', 'Terminal support', 'Reporting'],
    apiVersion: 'v2',
  },
  {
    id: 'paypal',
    name: 'PayPal',
    description: 'Online payments and invoicing for client billing.',
    category: 'payments',
    logo: '🅿️',
    status: 'disconnected',
    isPopular: false,
    isPremium: false,
    features: ['Online payments', 'Invoicing', 'International', 'Buyer protection'],
    apiVersion: 'v2',
  },
  // Practice Management
  {
    id: 'cliniko',
    name: 'Cliniko',
    description: 'Practice management software popular with allied health.',
    category: 'practice',
    logo: '🏥',
    status: 'disconnected',
    isPopular: true,
    isPremium: false,
    features: ['Client sync', 'Appointment import', 'Notes sync', 'Two-way integration'],
    apiVersion: 'v1',
  },
  {
    id: 'halaxy',
    name: 'Halaxy',
    description: 'Free practice management for Australian healthcare.',
    category: 'practice',
    logo: '🌟',
    status: 'disconnected',
    isPopular: true,
    isPremium: false,
    features: ['Client management', 'Billing', 'Medicare claiming', 'Telehealth'],
    apiVersion: 'v2',
  },
  {
    id: 'powerdiary',
    name: 'Power Diary',
    description: 'Practice management for mental health professionals.',
    category: 'practice',
    logo: '📔',
    status: 'disconnected',
    isPopular: false,
    isPremium: false,
    features: ['Scheduling', 'Client notes', 'SMS reminders', 'Online booking'],
    apiVersion: 'v1',
  },
  // Health Records
  {
    id: 'myhealthrecord',
    name: 'My Health Record',
    description: 'Australian digital health record system integration.',
    category: 'health-records',
    logo: '🇦🇺',
    status: 'disconnected',
    isPopular: true,
    isPremium: true,
    features: ['Upload documents', 'View records', 'Shared health summary', 'Secure access'],
    apiVersion: 'FHIR R4',
  },
  {
    id: 'healthlink',
    name: 'HealthLink',
    description: 'Secure clinical messaging for referrals and reports.',
    category: 'health-records',
    logo: '🔗',
    status: 'disconnected',
    isPopular: false,
    isPremium: true,
    features: ['Secure messaging', 'Referrals', 'Pathology results', 'Discharge summaries'],
    apiVersion: 'HL7 v2',
  },
];

// Bundled brand icons — no network requests, instant render
type SiIconType = React.ComponentType<{ size?: number; color?: string; style?: React.CSSProperties }>;

const SI_ICONS: Record<string, { Icon: SiIconType; color: string }> = {
  'xero':            { Icon: SiXero,        color: '#13B5EA' },
  'quickbooks':      { Icon: SiQuickbooks,  color: '#2CA01C' },
  'google-calendar': { Icon: SiGooglecalendar, color: '#4285F4' },
  'calendly':        { Icon: SiCalendly,    color: '#006BFF' },
  'zoom':            { Icon: SiZoom,        color: '#2D8CFF' },
  'twilio':          { Icon: SiTwilio,      color: '#F22F46' },
  'sendgrid':        { Icon: SiSendgrid,    color: '#009BDE' },
  'mailchimp':       { Icon: SiMailchimp,   color: '#241C15' },
  'stripe':          { Icon: SiStripe,      color: '#635BFF' },
  'square':          { Icon: SiSquare,      color: '#3E4348' },
  'paypal':          { Icon: SiPaypal,      color: '#003087' },
  'myob':            { Icon: SiMyob,        color: '#7B2D8B' },
};

// Lucide icon fallbacks with brand bg for missing SI icons
const LUCIDE_ICONS: Record<string, { icon: 'mail' | 'users'; bg: string }> = {
  'outlook': { icon: 'mail',  bg: '#0078D4' },
  'teams':   { icon: 'users', bg: '#6264A7' },
};

// Styled initials for AU/niche services
const INITIALS_LOGOS: Record<string, { text: string; bg: string }> = {
  'medicare':       { text: 'MC',  bg: '#00558A' },
  'hicaps':         { text: 'HIC', bg: '#1B4F9E' },
  'tyro':           { text: 'T',   bg: '#E63329' },
  'coviu':          { text: 'COV', bg: '#00BFB3' },
  'cliniko':        { text: 'CL',  bg: '#3BBFAD' },
  'halaxy':         { text: 'HAL', bg: '#0066FF' },
  'powerdiary':     { text: 'PD',  bg: '#2D4259' },
  'myhealthrecord': { text: 'MHR', bg: '#00698F' },
  'healthlink':     { text: 'HL',  bg: '#5C2D91' },
};

function IntegrationLogo({ id, name: _name, size = 'md' }: { id: string; name: string; size?: 'sm' | 'md' | 'lg' }) {
  const px = size === 'sm' ? 16 : size === 'lg' ? 26 : 20;
  const sizeClass = size === 'sm' ? 'w-5 h-5' : size === 'lg' ? 'w-9 h-9' : 'w-8 h-8';

  if (SI_ICONS[id]) {
    const { Icon, color } = SI_ICONS[id];
    return <Icon size={px} color={color} />;
  }

  if (LUCIDE_ICONS[id]) {
    const { icon, bg } = LUCIDE_ICONS[id];
    return (
      <div
        className={cn(sizeClass, 'rounded-lg flex items-center justify-center flex-shrink-0')}
        style={{ backgroundColor: bg }}
      >
        {icon === 'mail'
          ? <Mail size={Math.round(px * 0.6)} className="text-white" />
          : <Users size={Math.round(px * 0.6)} className="text-white" />
        }
      </div>
    );
  }

  if (INITIALS_LOGOS[id]) {
    const { text, bg } = INITIALS_LOGOS[id];
    const fontSize = text.length >= 4 ? '7px' : text.length === 3 ? '9px' : '11px';
    return (
      <div
        className={cn(sizeClass, 'rounded-lg flex items-center justify-center font-bold text-white flex-shrink-0')}
        style={{ backgroundColor: bg, fontSize }}
      >
        {text}
      </div>
    );
  }

  return <Globe size={px} className="text-text-muted flex-shrink-0" />;
}

// Demo sync logs
const DEMO_SYNC_LOGS: SyncLog[] = [
  { id: '1', integrationId: 'xero', timestamp: '2025-02-15T10:30:00Z', status: 'success', message: 'Synced 12 invoices successfully', recordsProcessed: 12, duration: '2.3s' },
  { id: '2', integrationId: 'google-calendar', timestamp: '2025-02-15T10:15:00Z', status: 'success', message: 'Calendar sync completed', recordsProcessed: 8, duration: '1.1s' },
  { id: '3', integrationId: 'twilio', timestamp: '2025-02-15T09:00:00Z', status: 'success', message: 'Sent 5 appointment reminders', recordsProcessed: 5, duration: '0.8s' },
];

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>(AVAILABLE_INTEGRATIONS);
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>(DEMO_SYNC_LOGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Modal states
  const [connectingIntegration, setConnectingIntegration] = useState<Integration | null>(null);
  const [settingsIntegration, setSettingsIntegration] = useState<Integration | null>(null);
  const [showSyncHistory, setShowSyncHistory] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStep, setConnectionStep] = useState(0);

  // Load saved integrations from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('mindbridge-integrations');
    if (saved) {
      try {
        const savedIntegrations = JSON.parse(saved);
        setIntegrations(prev => prev.map(int => {
          const savedInt = savedIntegrations.find((s: Integration) => s.id === int.id);
          return savedInt ? { ...int, ...savedInt } : int;
        }));
      } catch (e) {
        console.error('Failed to load integrations:', e);
      }
    }
  }, []);

  // Save integrations to localStorage
  useEffect(() => {
    const connected = integrations.filter(i => i.status === 'connected');
    if (connected.length > 0) {
      localStorage.setItem('mindbridge-integrations', JSON.stringify(connected));
    }
  }, [integrations]);

  // Filter integrations
  const filteredIntegrations = integrations.filter(int => {
    const matchesSearch = int.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      int.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || int.category === selectedCategory;
    const matchesStatus = statusFilter === 'all' || int.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Connected count
  const connectedCount = integrations.filter(i => i.status === 'connected').length;

  // Simulate OAuth connection
  const handleConnect = async (integration: Integration) => {
    setConnectingIntegration(integration);
    setConnectionStep(0);
    setIsConnecting(true);

    // Simulate OAuth flow steps
    await new Promise(r => setTimeout(r, 1000));
    setConnectionStep(1); // Redirecting to provider

    await new Promise(r => setTimeout(r, 1500));
    setConnectionStep(2); // Authorizing

    await new Promise(r => setTimeout(r, 1000));
    setConnectionStep(3); // Completing

    await new Promise(r => setTimeout(r, 500));

    // Update integration status
    setIntegrations(prev => prev.map(int =>
      int.id === integration.id
        ? {
            ...int,
            status: 'connected' as const,
            connectedAt: new Date().toISOString(),
            lastSync: new Date().toISOString(),
            syncFrequency: 'hourly',
            accountInfo: {
              name: 'MindBridge Practice',
              email: 'admin@mindbridge.com.au',
              plan: 'Professional',
            },
            settings: {
              autoSync: true,
              syncFrequency: 'hourly',
              syncInvoices: true,
              syncPayments: true,
              syncContacts: true,
              syncAppointments: true,
              twoWaySync: true,
              notifications: true,
            },
          }
        : int
    ));

    // Add sync log
    setSyncLogs(prev => [{
      id: Date.now().toString(),
      integrationId: integration.id,
      timestamp: new Date().toISOString(),
      status: 'success',
      message: `Connected to ${integration.name} successfully`,
      duration: '3.0s',
    }, ...prev]);

    setIsConnecting(false);
    setConnectionStep(4); // Success
  };

  // Disconnect integration
  const handleDisconnect = (integrationId: string) => {
    setIntegrations(prev => prev.map(int =>
      int.id === integrationId
        ? {
            ...int,
            status: 'disconnected' as const,
            connectedAt: undefined,
            lastSync: undefined,
            accountInfo: undefined,
            settings: undefined,
          }
        : int
    ));
    setSettingsIntegration(null);
  };

  // Manual sync
  const handleSync = async (integration: Integration) => {
    setIntegrations(prev => prev.map(int =>
      int.id === integration.id ? { ...int, status: 'pending' as const } : int
    ));

    await new Promise(r => setTimeout(r, 2000));

    setIntegrations(prev => prev.map(int =>
      int.id === integration.id
        ? { ...int, status: 'connected' as const, lastSync: new Date().toISOString() }
        : int
    ));

    setSyncLogs(prev => [{
      id: Date.now().toString(),
      integrationId: integration.id,
      timestamp: new Date().toISOString(),
      status: 'success',
      message: `Manual sync completed for ${integration.name}`,
      recordsProcessed: Math.floor(Math.random() * 20) + 1,
      duration: `${(Math.random() * 3 + 0.5).toFixed(1)}s`,
    }, ...prev]);
  };

  // Update settings
  const updateSettings = (integrationId: string, settings: Partial<IntegrationSettings>) => {
    setIntegrations(prev => prev.map(int =>
      int.id === integrationId
        ? { ...int, settings: { ...int.settings, ...settings } as IntegrationSettings }
        : int
    ));
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: Integration['status']) => {
    switch (status) {
      case 'connected':
        return <Badge variant="success" size="sm"><CheckCircle className="w-3 h-3 mr-1" />Connected</Badge>;
      case 'error':
        return <Badge variant="error" size="sm"><XCircle className="w-3 h-3 mr-1" />Error</Badge>;
      case 'pending':
        return <Badge variant="warning" size="sm"><Loader2 className="w-3 h-3 mr-1 animate-spin" />Syncing</Badge>;
      default:
        return <Badge variant="default" size="sm">Not Connected</Badge>;
    }
  };

  return (
    <div className="min-h-screen">
      <Header
        title="Integrations"
        subtitle={`${connectedCount} connected · Manage your app connections`}
        actions={
          <div className="flex gap-2">
            <Button
              variant="secondary"
              leftIcon={<History className="w-4 h-4" />}
              onClick={() => setShowSyncHistory(true)}
            >
              Sync History
            </Button>
            <Button
              leftIcon={<Zap className="w-4 h-4" />}
              onClick={() => {
                integrations.filter(i => i.status === 'connected').forEach(i => handleSync(i));
              }}
              disabled={connectedCount === 0}
            >
              Sync All
            </Button>
          </div>
        }
      />

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-text-primary">{connectedCount}</p>
                  <p className="text-sm text-text-muted">Connected</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Link2 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-text-primary">{integrations.length}</p>
                  <p className="text-sm text-text-muted">Available</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-text-primary">{syncLogs.length}</p>
                  <p className="text-sm text-text-muted">Syncs Today</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-text-primary">OAuth 2.0</p>
                  <p className="text-sm text-text-muted">Secure Auth</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <Input
              placeholder="Search integrations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-beige rounded-lg bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-sage"
            >
              <option value="all">All Categories</option>
              {Object.entries(CATEGORIES).map(([key, cat]) => (
                <option key={key} value={key}>{cat.label}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-beige rounded-lg bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-sage"
            >
              <option value="all">All Status</option>
              <option value="connected">Connected</option>
              <option value="disconnected">Not Connected</option>
              <option value="error">Error</option>
            </select>
            <div className="flex border border-beige rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-2 transition-colors',
                  viewMode === 'grid' ? 'bg-sage text-white' : 'bg-white text-text-muted hover:bg-sand'
                )}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-2 transition-colors',
                  viewMode === 'list' ? 'bg-sage text-white' : 'bg-white text-text-muted hover:bg-sand'
                )}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Quick Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={selectedCategory === 'all' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
          >
            All
          </Button>
          {Object.entries(CATEGORIES).map(([key, cat]) => (
            <Button
              key={key}
              variant={selectedCategory === key ? 'primary' : 'secondary'}
              size="sm"
              leftIcon={cat.icon}
              onClick={() => setSelectedCategory(selectedCategory === key ? 'all' : key)}
            >
              {cat.label}
            </Button>
          ))}
        </div>

        {/* Connected Integrations */}
        {connectedCount > 0 && selectedCategory === 'all' && statusFilter === 'all' && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              Connected Integrations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {integrations.filter(i => i.status === 'connected').map(integration => (
                <Card key={integration.id} className="border-l-4 border-l-emerald-500">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white border border-beige p-1.5 flex-shrink-0">
                          <IntegrationLogo id={integration.id} name={integration.name} size="lg" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-text-primary">{integration.name}</h3>
                          <p className="text-xs text-text-muted">
                            Last sync: {integration.lastSync ? formatDate(integration.lastSync) : 'Never'}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(integration.status)}
                    </div>
                    {integration.accountInfo && (
                      <div className="bg-sand rounded-lg p-3 mb-3">
                        <p className="text-sm font-medium text-text-primary">{integration.accountInfo.name}</p>
                        {integration.accountInfo.email && (
                          <p className="text-xs text-text-muted">{integration.accountInfo.email}</p>
                        )}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        leftIcon={<RefreshCw className="w-3 h-3" />}
                        onClick={() => handleSync(integration)}
                        disabled={integration.status === 'pending'}
                      >
                        Sync
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        leftIcon={<Settings className="w-3 h-3" />}
                        onClick={() => setSettingsIntegration(integration)}
                      >
                        Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* All Integrations */}
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          {selectedCategory === 'all' ? 'All Integrations' : CATEGORIES[selectedCategory as keyof typeof CATEGORIES].label}
          <span className="text-text-muted font-normal ml-2">({filteredIntegrations.length})</span>
        </h2>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredIntegrations.map(integration => (
              <Card
                key={integration.id}
                className={cn(
                  'hover:shadow-md transition-all',
                  integration.status === 'connected' && 'border-emerald-200 bg-emerald-50/30'
                )}
              >
                <CardContent className="pt-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white border border-beige p-2 flex-shrink-0">
                        <IntegrationLogo id={integration.id} name={integration.name} size="lg" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-text-primary">{integration.name}</h3>
                          {integration.isPopular && (
                            <Badge variant="info" size="sm">Popular</Badge>
                          )}
                          {integration.isPremium && (
                            <Badge variant="warning" size="sm">Premium</Badge>
                          )}
                        </div>
                        <Badge className={cn('mt-1', `${CATEGORIES[integration.category].color} bg-opacity-20 text-opacity-90`)} size="sm">
                          {CATEGORIES[integration.category].label}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-text-secondary mb-4 line-clamp-2">
                    {integration.description}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {integration.features.slice(0, 3).map(feature => (
                      <span
                        key={feature}
                        className="text-xs px-2 py-1 bg-sand rounded-full text-text-muted"
                      >
                        {feature}
                      </span>
                    ))}
                    {integration.features.length > 3 && (
                      <span className="text-xs px-2 py-1 bg-sand rounded-full text-text-muted">
                        +{integration.features.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Status & Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-beige">
                    {getStatusBadge(integration.status)}
                    {integration.status === 'connected' ? (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleSync(integration)}
                          disabled={false}
                        >
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setSettingsIntegration(integration)}
                        >
                          Settings
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleConnect(integration)}
                      >
                        Connect
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <table className="w-full">
                <thead className="bg-sand">
                  <tr>
                    <th className="text-left p-4 font-medium text-text-secondary">Integration</th>
                    <th className="text-left p-4 font-medium text-text-secondary">Category</th>
                    <th className="text-left p-4 font-medium text-text-secondary">Status</th>
                    <th className="text-left p-4 font-medium text-text-secondary">Last Sync</th>
                    <th className="text-right p-4 font-medium text-text-secondary">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIntegrations.map(integration => (
                    <tr
                      key={integration.id}
                      className="border-b border-beige hover:bg-sand/50 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <IntegrationLogo id={integration.id} name={integration.name} size="md" />
                          <div>
                            <p className="font-medium text-text-primary">{integration.name}</p>
                            <p className="text-sm text-text-muted line-clamp-1">{integration.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge className={cn(`${CATEGORIES[integration.category].color} bg-opacity-20`)} size="sm">
                          {CATEGORIES[integration.category].label}
                        </Badge>
                      </td>
                      <td className="p-4">
                        {getStatusBadge(integration.status)}
                      </td>
                      <td className="p-4 text-text-secondary text-sm">
                        {integration.lastSync ? formatDate(integration.lastSync) : '-'}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          {integration.status === 'connected' ? (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSync(integration)}
                              >
                                <RefreshCw className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => setSettingsIntegration(integration)}
                              >
                                Settings
                              </Button>
                            </>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handleConnect(integration)}
                            >
                              Connect
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {filteredIntegrations.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Link2 className="w-12 h-12 text-text-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-text-primary mb-2">No integrations found</h3>
              <p className="text-text-secondary">Try adjusting your search or filters</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* OAuth Connection Modal */}
      {connectingIntegration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => !isConnecting && setConnectingIntegration(null)}
          />

          <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white border border-beige flex items-center justify-center p-3">
                  <IntegrationLogo id={connectingIntegration.id} name={connectingIntegration.name} size="lg" />
                </div>
                <h2 className="text-xl font-semibold text-stone-800">
                  Connect to {connectingIntegration.name}
                </h2>
                <p className="text-sm text-stone-500 mt-1">
                  Securely connect using OAuth 2.0
                </p>
              </div>

              {/* Connection Steps */}
              <div className="space-y-4 mb-6">
                {[
                  { label: 'Preparing connection', icon: <Key className="w-4 h-4" /> },
                  { label: `Redirecting to ${connectingIntegration.name}`, icon: <ExternalLink className="w-4 h-4" /> },
                  { label: 'Authorizing access', icon: <Shield className="w-4 h-4" /> },
                  { label: 'Completing setup', icon: <Settings className="w-4 h-4" /> },
                  { label: 'Connected successfully', icon: <CheckCircle className="w-4 h-4" /> },
                ].map((step, index) => (
                  <div
                    key={index}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-lg transition-all',
                      connectionStep > index
                        ? 'bg-emerald-50 text-emerald-700'
                        : connectionStep === index
                          ? 'bg-sage/10 text-sage-dark'
                          : 'text-stone-400'
                    )}
                  >
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center',
                      connectionStep > index
                        ? 'bg-emerald-500 text-white'
                        : connectionStep === index
                          ? 'bg-sage text-white'
                          : 'bg-stone-100'
                    )}>
                      {connectionStep > index ? (
                        <Check className="w-4 h-4" />
                      ) : connectionStep === index && isConnecting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        step.icon
                      )}
                    </div>
                    <span className="font-medium">{step.label}</span>
                  </div>
                ))}
              </div>

              {/* Permissions */}
              {connectionStep === 0 && !isConnecting && (
                <div className="bg-stone-50 rounded-lg p-4 mb-6">
                  <p className="text-sm font-medium text-stone-700 mb-3">
                    MindBridge will have access to:
                  </p>
                  <ul className="space-y-2">
                    {connectingIntegration.features.slice(0, 4).map(feature => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-stone-600">
                        <Check className="w-4 h-4 text-emerald-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                {connectionStep < 4 && (
                  <>
                    <Button
                      variant="secondary"
                      className="flex-1"
                      onClick={() => setConnectingIntegration(null)}
                      disabled={isConnecting}
                    >
                      Cancel
                    </Button>
                    {!isConnecting && (
                      <Button
                        className="flex-1"
                        onClick={() => handleConnect(connectingIntegration)}
                      >
                        Connect
                      </Button>
                    )}
                  </>
                )}
                {connectionStep === 4 && (
                  <Button
                    className="w-full"
                    onClick={() => {
                      setConnectingIntegration(null);
                      setConnectionStep(0);
                    }}
                  >
                    Done
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {settingsIntegration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSettingsIntegration(null)}
          />

          <div className="relative w-full max-w-lg mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200">
              <div className="flex items-center gap-3">
                <IntegrationLogo id={settingsIntegration.id} name={settingsIntegration.name} size="md" />
                <div>
                  <h2 className="text-lg font-semibold text-stone-800">{settingsIntegration.name} Settings</h2>
                  <p className="text-sm text-stone-500">Manage your integration settings</p>
                </div>
              </div>
              <button
                onClick={() => setSettingsIntegration(null)}
                className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-stone-600" />
              </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {/* Connection Info */}
              <div className="bg-stone-50 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-stone-800 mb-3">Connection Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Status</span>
                    {getStatusBadge(settingsIntegration.status)}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Connected</span>
                    <span className="text-stone-700">
                      {settingsIntegration.connectedAt ? formatDate(settingsIntegration.connectedAt) : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Last Sync</span>
                    <span className="text-stone-700">
                      {settingsIntegration.lastSync ? formatDate(settingsIntegration.lastSync) : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">API Version</span>
                    <span className="text-stone-700">{settingsIntegration.apiVersion}</span>
                  </div>
                </div>
              </div>

              {/* Sync Settings */}
              {settingsIntegration.settings && (
                <div className="mb-6">
                  <h3 className="font-medium text-stone-800 mb-4">Sync Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-stone-700">Auto Sync</p>
                        <p className="text-sm text-stone-500">Automatically sync data</p>
                      </div>
                      <button
                        onClick={() => updateSettings(settingsIntegration.id, {
                          autoSync: !settingsIntegration.settings?.autoSync
                        })}
                        className={cn(
                          'w-12 h-6 rounded-full transition-colors relative',
                          settingsIntegration.settings.autoSync ? 'bg-sage' : 'bg-stone-300'
                        )}
                      >
                        <div className={cn(
                          'w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform shadow',
                          settingsIntegration.settings.autoSync ? 'translate-x-6' : 'translate-x-0.5'
                        )} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-stone-700">Sync Frequency</p>
                        <p className="text-sm text-stone-500">How often to sync</p>
                      </div>
                      <select
                        value={settingsIntegration.settings.syncFrequency}
                        onChange={(e) => updateSettings(settingsIntegration.id, {
                          syncFrequency: e.target.value as IntegrationSettings['syncFrequency']
                        })}
                        className="px-3 py-1.5 border border-stone-300 rounded-lg text-sm"
                      >
                        <option value="realtime">Real-time</option>
                        <option value="15min">Every 15 minutes</option>
                        <option value="hourly">Hourly</option>
                        <option value="daily">Daily</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-stone-700">Two-Way Sync</p>
                        <p className="text-sm text-stone-500">Sync changes both directions</p>
                      </div>
                      <button
                        onClick={() => updateSettings(settingsIntegration.id, {
                          twoWaySync: !settingsIntegration.settings?.twoWaySync
                        })}
                        className={cn(
                          'w-12 h-6 rounded-full transition-colors relative',
                          settingsIntegration.settings.twoWaySync ? 'bg-sage' : 'bg-stone-300'
                        )}
                      >
                        <div className={cn(
                          'w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform shadow',
                          settingsIntegration.settings.twoWaySync ? 'translate-x-6' : 'translate-x-0.5'
                        )} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-stone-700">Notifications</p>
                        <p className="text-sm text-stone-500">Get notified on sync errors</p>
                      </div>
                      <button
                        onClick={() => updateSettings(settingsIntegration.id, {
                          notifications: !settingsIntegration.settings?.notifications
                        })}
                        className={cn(
                          'w-12 h-6 rounded-full transition-colors relative',
                          settingsIntegration.settings.notifications ? 'bg-sage' : 'bg-stone-300'
                        )}
                      >
                        <div className={cn(
                          'w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform shadow',
                          settingsIntegration.settings.notifications ? 'translate-x-6' : 'translate-x-0.5'
                        )} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Data Types */}
              {settingsIntegration.settings && (
                <div className="mb-6">
                  <h3 className="font-medium text-stone-800 mb-4">Data to Sync</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { key: 'syncInvoices', label: 'Invoices', icon: <Receipt className="w-4 h-4" /> },
                      { key: 'syncPayments', label: 'Payments', icon: <CreditCard className="w-4 h-4" /> },
                      { key: 'syncContacts', label: 'Contacts', icon: <Users className="w-4 h-4" /> },
                      { key: 'syncAppointments', label: 'Appointments', icon: <Calendar className="w-4 h-4" /> },
                    ].map(item => (
                      <button
                        key={item.key}
                        onClick={() => updateSettings(settingsIntegration.id, {
                          [item.key]: !settingsIntegration.settings?.[item.key as keyof IntegrationSettings]
                        })}
                        className={cn(
                          'flex items-center gap-2 p-3 rounded-lg border transition-all',
                          settingsIntegration.settings?.[item.key as keyof IntegrationSettings]
                            ? 'border-sage bg-sage/10 text-sage-dark'
                            : 'border-stone-200 text-stone-500 hover:border-stone-300'
                        )}
                      >
                        {item.icon}
                        <span className="font-medium text-sm">{item.label}</span>
                        {settingsIntegration.settings?.[item.key as keyof IntegrationSettings] && (
                          <Check className="w-4 h-4 ml-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Danger Zone */}
              <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                <h3 className="font-medium text-red-800 mb-2">Danger Zone</h3>
                <p className="text-sm text-red-600 mb-4">
                  Disconnecting will stop all syncing and remove stored credentials.
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<Trash2 className="w-4 h-4" />}
                  onClick={() => handleDisconnect(settingsIntegration.id)}
                  className="text-red-600 border-red-300 hover:bg-red-100"
                >
                  Disconnect {settingsIntegration.name}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-stone-200 bg-stone-50">
              <Button variant="secondary" onClick={() => setSettingsIntegration(null)}>
                Close
              </Button>
              <Button
                leftIcon={<RefreshCw className="w-4 h-4" />}
                onClick={() => {
                  handleSync(settingsIntegration);
                  setSettingsIntegration(null);
                }}
              >
                Sync Now
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Sync History Modal */}
      {showSyncHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowSyncHistory(false)}
          />

          <div className="relative w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200">
              <div className="flex items-center gap-3">
                <History className="w-5 h-5 text-sage" />
                <h2 className="text-lg font-semibold text-stone-800">Sync History</h2>
              </div>
              <button
                onClick={() => setShowSyncHistory(false)}
                className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-stone-600" />
              </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {syncLogs.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                  <p className="text-stone-500">No sync history yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {syncLogs.map(log => {
                    const integration = integrations.find(i => i.id === log.integrationId);
                    return (
                      <div
                        key={log.id}
                        className={cn(
                          'flex items-start gap-4 p-4 rounded-lg border',
                          log.status === 'success' && 'border-emerald-200 bg-emerald-50',
                          log.status === 'error' && 'border-red-200 bg-red-50',
                          log.status === 'partial' && 'border-amber-200 bg-amber-50'
                        )}
                      >
                        <div className={cn(
                          'w-10 h-10 rounded-full flex items-center justify-center',
                          log.status === 'success' && 'bg-emerald-100',
                          log.status === 'error' && 'bg-red-100',
                          log.status === 'partial' && 'bg-amber-100'
                        )}>
                          {log.status === 'success' && <CheckCircle className="w-5 h-5 text-emerald-600" />}
                          {log.status === 'error' && <XCircle className="w-5 h-5 text-red-600" />}
                          {log.status === 'partial' && <AlertTriangle className="w-5 h-5 text-amber-600" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {integration && <IntegrationLogo id={integration.id} name={integration.name} size="sm" />}
                            <span className="font-medium text-stone-800">{integration?.name}</span>
                            <Badge
                              variant={log.status === 'success' ? 'success' : log.status === 'error' ? 'error' : 'warning'}
                              size="sm"
                            >
                              {log.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-stone-600 mb-1">{log.message}</p>
                          <div className="flex items-center gap-4 text-xs text-stone-500">
                            <span>{formatDate(log.timestamp)}</span>
                            {log.recordsProcessed !== undefined && (
                              <span>{log.recordsProcessed} records</span>
                            )}
                            {log.duration && (
                              <span>{log.duration}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
