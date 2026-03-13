'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SiXero } from 'react-icons/si';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import {
  getXeroConnection,
  saveXeroConnection,
  removeXeroConnection,
  generateDemoOrganisation,
  generateDemoContacts,
  generateDemoInvoices,
  generateDemoPayments,
  generateDemoAccounts,
  calculateFinancialSummary,
  MENTAL_HEALTH_ITEM_CODES,
  XeroOrganisation,
  XeroContact,
  XeroInvoice,
  XeroPayment,
  XeroAccount,
} from '@/lib/xero';
import {
  ArrowLeft,
  Link2,
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
  DollarSign,
  Receipt,
  Users,
  CreditCard,
  Building2,
  Plus,
  Search,
  Filter,
  Download,
  Send,
  Eye,
  Edit,
  Trash2,
  Copy,
  Mail,
  Phone,
  Calendar,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  FileText,
  ChevronRight,
  ChevronDown,
  MoreHorizontal,
  Banknote,
  PiggyBank,
  Activity,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  UserPlus,
  FileCheck,
  Printer,
} from 'lucide-react';

type TabType = 'dashboard' | 'invoices' | 'contacts' | 'payments' | 'settings';

export default function XeroIntegrationPage() {
  const router = useRouter();

  // Connection state
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStep, setConnectionStep] = useState(0);
  const [organisation, setOrganisation] = useState<XeroOrganisation | null>(null);

  // Data state
  const [contacts, setContacts] = useState<XeroContact[]>([]);
  const [invoices, setInvoices] = useState<XeroInvoice[]>([]);
  const [payments, setPayments] = useState<XeroPayment[]>([]);
  const [accounts, setAccounts] = useState<XeroAccount[]>([]);

  // UI state
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  // Modal state
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<XeroInvoice | null>(null);
  const [showSyncClients, setShowSyncClients] = useState(false);

  // Load connection on mount
  useEffect(() => {
    const connection = getXeroConnection();
    if (connection) {
      setIsConnected(true);
      setOrganisation(connection.organisation);
      loadDemoData();
    }
  }, []);

  // Load demo data
  const loadDemoData = () => {
    setContacts(generateDemoContacts());
    setInvoices(generateDemoInvoices());
    setPayments(generateDemoPayments());
    setAccounts(generateDemoAccounts());
    setLastSyncTime(new Date());
  };

  // Simulate OAuth connection
  const handleConnect = async () => {
    setIsConnecting(true);
    setConnectionStep(0);

    // Simulate OAuth steps
    await new Promise(r => setTimeout(r, 800));
    setConnectionStep(1);

    await new Promise(r => setTimeout(r, 1200));
    setConnectionStep(2);

    await new Promise(r => setTimeout(r, 1000));
    setConnectionStep(3);

    await new Promise(r => setTimeout(r, 800));

    // Save connection
    const org = generateDemoOrganisation();
    saveXeroConnection({
      token: {
        access_token: 'demo-access-token',
        refresh_token: 'demo-refresh-token',
        expires_at: Date.now() + 1800000,
        token_type: 'Bearer',
        scope: 'accounting.transactions accounting.contacts',
      },
      organisation: org,
    });

    setOrganisation(org);
    setIsConnected(true);
    loadDemoData();
    setIsConnecting(false);
    setConnectionStep(4);
  };

  // Disconnect
  const handleDisconnect = () => {
    removeXeroConnection();
    setIsConnected(false);
    setOrganisation(null);
    setContacts([]);
    setInvoices([]);
    setPayments([]);
    setAccounts([]);
  };

  // Sync data
  const handleSync = async () => {
    setIsSyncing(true);
    await new Promise(r => setTimeout(r, 2000));
    loadDemoData();
    setIsSyncing(false);
  };

  // Financial summary
  const financials = calculateFinancialSummary(invoices, payments);

  // Filter invoices
  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.contact.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filter contacts
  const filteredContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.emailAddress?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status: XeroInvoice['status']) => {
    switch (status) {
      case 'PAID':
        return <Badge variant="success" size="sm"><CheckCircle className="w-3 h-3 mr-1" />Paid</Badge>;
      case 'AUTHORISED':
        return <Badge variant="warning" size="sm"><Clock className="w-3 h-3 mr-1" />Awaiting Payment</Badge>;
      case 'DRAFT':
        return <Badge variant="default" size="sm"><Edit className="w-3 h-3 mr-1" />Draft</Badge>;
      case 'VOIDED':
        return <Badge variant="error" size="sm"><XCircle className="w-3 h-3 mr-1" />Voided</Badge>;
      default:
        return <Badge variant="default" size="sm">{status}</Badge>;
    }
  };

  // Not connected view
  if (!isConnected && !isConnecting) {
    return (
      <div className="min-h-screen">
        <Header
          title="Xero Integration"
          subtitle="Connect your Xero account for invoicing and accounting"
          actions={
            <Button variant="secondary" leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={() => router.push('/integrations')}>
              Back to Integrations
            </Button>
          }
        />

        <div className="p-6">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="pt-8 pb-8">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-[#13B5EA]/10 flex items-center justify-center">
                    <SiXero className="w-10 h-10 text-[#13B5EA]" />
                  </div>
                  <h2 className="text-2xl font-bold text-stone-800 mb-2">Connect to Xero</h2>
                  <p className="text-stone-600">
                    Sync invoices, payments, and client information between MindBridge and Xero.
                  </p>
                </div>

                {/* Features */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {[
                    { icon: <Receipt className="w-5 h-5" />, label: 'Auto-create invoices', desc: 'Generate invoices from sessions' },
                    { icon: <RefreshCw className="w-5 h-5" />, label: 'Two-way sync', desc: 'Keep data in sync automatically' },
                    { icon: <Users className="w-5 h-5" />, label: 'Client sync', desc: 'Sync contacts both ways' },
                    { icon: <CreditCard className="w-5 h-5" />, label: 'Payment tracking', desc: 'Track payments & reconcile' },
                  ].map((feature, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-stone-50 rounded-xl">
                      <div className="w-10 h-10 rounded-lg bg-[#13B5EA]/10 flex items-center justify-center text-[#13B5EA]">
                        {feature.icon}
                      </div>
                      <div>
                        <p className="font-medium text-stone-800">{feature.label}</p>
                        <p className="text-sm text-stone-500">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Permissions */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-amber-800">Secure OAuth 2.0 Connection</p>
                      <p className="text-sm text-amber-700 mt-1">
                        MindBridge will request access to: invoices, contacts, payments, and account settings.
                        You can revoke access at any time from your Xero account.
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full bg-[#13B5EA] hover:bg-[#0d9fd1]"
                  size="lg"
                  leftIcon={<Link2 className="w-5 h-5" />}
                  onClick={handleConnect}
                >
                  Connect to Xero
                </Button>

                <p className="text-center text-sm text-stone-500 mt-4">
                  By connecting, you agree to share data between MindBridge and Xero.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Connecting view
  if (isConnecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-8 pb-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#13B5EA]/10 flex items-center justify-center">
                <SiXero className="w-8 h-8 text-[#13B5EA]" />
              </div>
              <h2 className="text-xl font-semibold text-stone-800">Connecting to Xero</h2>
            </div>

            <div className="space-y-3">
              {[
                { label: 'Initializing connection', done: connectionStep > 0 },
                { label: 'Authenticating with Xero', done: connectionStep > 1 },
                { label: 'Loading organisation data', done: connectionStep > 2 },
                { label: 'Completing setup', done: connectionStep > 3 },
              ].map((step, i) => (
                <div
                  key={i}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-lg transition-all',
                    step.done ? 'bg-emerald-50' : connectionStep === i ? 'bg-[#13B5EA]/10' : 'bg-stone-50'
                  )}
                >
                  <div className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center',
                    step.done ? 'bg-emerald-500 text-white' : connectionStep === i ? 'bg-[#13B5EA] text-white' : 'bg-stone-200'
                  )}>
                    {step.done ? (
                      <Check className="w-4 h-4" />
                    ) : connectionStep === i ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <span className="text-sm text-stone-500">{i + 1}</span>
                    )}
                  </div>
                  <span className={cn(
                    'font-medium',
                    step.done ? 'text-emerald-700' : connectionStep === i ? 'text-[#13B5EA]' : 'text-stone-400'
                  )}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Connected view
  return (
    <div className="min-h-screen">
      <Header
        title="Xero"
        subtitle={organisation?.name || 'Connected'}
        actions={
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-stone-500">
              {isSyncing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Syncing...
                </>
              ) : lastSyncTime && (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  Last sync: {lastSyncTime.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })}
                </>
              )}
            </div>
            <Button
              variant="secondary"
              leftIcon={<RefreshCw className={cn('w-4 h-4', isSyncing && 'animate-spin')} />}
              onClick={handleSync}
              disabled={isSyncing}
            >
              Sync Now
            </Button>
            <Button
              variant="secondary"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              onClick={() => router.push('/integrations')}
            >
              Back
            </Button>
          </div>
        }
      />

      <div className="p-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-stone-200">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-4 h-4" /> },
            { id: 'invoices', label: 'Invoices', icon: <Receipt className="w-4 h-4" />, count: invoices.length },
            { id: 'contacts', label: 'Contacts', icon: <Users className="w-4 h-4" />, count: contacts.length },
            { id: 'payments', label: 'Payments', icon: <CreditCard className="w-4 h-4" />, count: payments.length },
            { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={cn(
                'flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 -mb-[2px] transition-colors',
                activeTab === tab.id
                  ? 'border-[#13B5EA] text-[#13B5EA]'
                  : 'border-transparent text-stone-500 hover:text-stone-700'
              )}
            >
              {tab.icon}
              {tab.label}
              {tab.count !== undefined && (
                <span className={cn(
                  'px-2 py-0.5 rounded-full text-xs',
                  activeTab === tab.id ? 'bg-[#13B5EA]/10 text-[#13B5EA]' : 'bg-stone-100 text-stone-500'
                )}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Financial Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200">
                <CardContent className="pt-5 pb-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-emerald-700">Monthly Revenue</span>
                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                  </div>
                  <p className="text-2xl font-bold text-emerald-800">{formatCurrency(financials.monthlyRevenue)}</p>
                  <p className="text-sm text-emerald-600 mt-1">+12% from last month</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-200">
                <CardContent className="pt-5 pb-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-amber-700">Outstanding</span>
                    <Clock className="w-5 h-5 text-amber-500" />
                  </div>
                  <p className="text-2xl font-bold text-amber-800">{formatCurrency(financials.totalOutstanding)}</p>
                  <p className="text-sm text-amber-600 mt-1">{invoices.filter(i => i.status === 'AUTHORISED').length} unpaid invoices</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-50 to-red-100/50 border-red-200">
                <CardContent className="pt-5 pb-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-red-700">Overdue</span>
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  </div>
                  <p className="text-2xl font-bold text-red-800">{formatCurrency(financials.totalOverdue)}</p>
                  <p className="text-sm text-red-600 mt-1">Requires follow-up</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
                <CardContent className="pt-5 pb-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-700">Payments Received</span>
                    <Banknote className="w-5 h-5 text-blue-500" />
                  </div>
                  <p className="text-2xl font-bold text-blue-800">{formatCurrency(financials.monthlyPayments)}</p>
                  <p className="text-sm text-blue-600 mt-1">This month</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setShowCreateInvoice(true)}>
                <CardContent className="pt-5 pb-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#13B5EA]/10 flex items-center justify-center">
                      <Plus className="w-6 h-6 text-[#13B5EA]" />
                    </div>
                    <div>
                      <p className="font-semibold text-stone-800">Create Invoice</p>
                      <p className="text-sm text-stone-500">Bill a client for sessions</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-stone-400 ml-auto" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setShowSyncClients(true)}>
                <CardContent className="pt-5 pb-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                      <UserPlus className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-stone-800">Sync Clients</p>
                      <p className="text-sm text-stone-500">Import clients from MindBridge</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-stone-400 ml-auto" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveTab('payments')}>
                <CardContent className="pt-5 pb-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                      <FileCheck className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-stone-800">Record Payment</p>
                      <p className="text-sm text-stone-500">Mark invoices as paid</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-stone-400 ml-auto" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Invoices */}
              <Card>
                <CardContent className="pt-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-stone-800">Recent Invoices</h3>
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab('invoices')}>
                      View All <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {invoices.slice(0, 4).map(invoice => (
                      <div
                        key={invoice.invoiceId}
                        className="flex items-center justify-between p-3 bg-stone-50 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
                        onClick={() => setSelectedInvoice(invoice)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-white border border-stone-200 flex items-center justify-center">
                            <Receipt className="w-5 h-5 text-stone-500" />
                          </div>
                          <div>
                            <p className="font-medium text-stone-800">{invoice.invoiceNumber}</p>
                            <p className="text-sm text-stone-500">{invoice.contact.name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-stone-800">{formatCurrency(invoice.total)}</p>
                          {getStatusBadge(invoice.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Payments */}
              <Card>
                <CardContent className="pt-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-stone-800">Recent Payments</h3>
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab('payments')}>
                      View All <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {payments.slice(0, 4).map(payment => (
                      <div
                        key={payment.paymentId}
                        className="flex items-center justify-between p-3 bg-stone-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                            <ArrowDownRight className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div>
                            <p className="font-medium text-stone-800">{payment.invoice.invoiceNumber}</p>
                            <p className="text-sm text-stone-500">{payment.reference}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-emerald-600">+{formatCurrency(payment.amount)}</p>
                          <p className="text-xs text-stone-500">{formatDate(payment.date)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Invoices Tab */}
        {activeTab === 'invoices' && (
          <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <Input
                  placeholder="Search invoices..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-stone-200 rounded-lg bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="DRAFT">Draft</option>
                  <option value="AUTHORISED">Awaiting Payment</option>
                  <option value="PAID">Paid</option>
                  <option value="VOIDED">Voided</option>
                </select>
                <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowCreateInvoice(true)}>
                  New Invoice
                </Button>
              </div>
            </div>

            {/* Invoice List */}
            <Card>
              <CardContent className="p-0">
                <table className="w-full">
                  <thead className="bg-stone-50 border-b border-stone-200">
                    <tr>
                      <th className="text-left p-4 font-medium text-stone-600">Invoice</th>
                      <th className="text-left p-4 font-medium text-stone-600">Client</th>
                      <th className="text-left p-4 font-medium text-stone-600">Date</th>
                      <th className="text-left p-4 font-medium text-stone-600">Due Date</th>
                      <th className="text-left p-4 font-medium text-stone-600">Status</th>
                      <th className="text-right p-4 font-medium text-stone-600">Amount</th>
                      <th className="text-right p-4 font-medium text-stone-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInvoices.map(invoice => (
                      <tr
                        key={invoice.invoiceId}
                        className="border-b border-stone-100 hover:bg-stone-50 transition-colors"
                      >
                        <td className="p-4">
                          <p className="font-medium text-stone-800">{invoice.invoiceNumber}</p>
                          <p className="text-sm text-stone-500">{invoice.reference}</p>
                        </td>
                        <td className="p-4 text-stone-700">{invoice.contact.name}</td>
                        <td className="p-4 text-stone-600">{formatDate(invoice.date)}</td>
                        <td className="p-4">
                          <span className={cn(
                            new Date(invoice.dueDate) < new Date() && invoice.status !== 'PAID'
                              ? 'text-red-600 font-medium'
                              : 'text-stone-600'
                          )}>
                            {formatDate(invoice.dueDate)}
                          </span>
                        </td>
                        <td className="p-4">{getStatusBadge(invoice.status)}</td>
                        <td className="p-4 text-right">
                          <p className="font-semibold text-stone-800">{formatCurrency(invoice.total)}</p>
                          {invoice.amountDue > 0 && invoice.amountDue !== invoice.total && (
                            <p className="text-sm text-amber-600">Due: {formatCurrency(invoice.amountDue)}</p>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="sm" onClick={() => setSelectedInvoice(invoice)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Send className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <Input
                  placeholder="Search contacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="secondary" leftIcon={<RefreshCw className="w-4 h-4" />} onClick={() => setShowSyncClients(true)}>
                Sync from MindBridge
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredContacts.map(contact => (
                <Card key={contact.contactId} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-5">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#13B5EA]/10 flex items-center justify-center text-[#13B5EA] font-semibold">
                        {contact.firstName?.[0]}{contact.lastName?.[0]}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-stone-800">{contact.name}</h3>
                        {contact.emailAddress && (
                          <p className="text-sm text-stone-500 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {contact.emailAddress}
                          </p>
                        )}
                        {contact.phones?.[0] && (
                          <p className="text-sm text-stone-500 flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {contact.phones[0].phoneNumber}
                          </p>
                        )}
                      </div>
                    </div>

                    {contact.balances?.accountsReceivable && (
                      <div className="mt-4 pt-4 border-t border-stone-100">
                        <div className="flex justify-between text-sm">
                          <span className="text-stone-500">Outstanding</span>
                          <span className={cn(
                            'font-medium',
                            contact.balances.accountsReceivable.outstanding > 0 ? 'text-amber-600' : 'text-stone-600'
                          )}>
                            {formatCurrency(contact.balances.accountsReceivable.outstanding)}
                          </span>
                        </div>
                        {contact.balances.accountsReceivable.overdue > 0 && (
                          <div className="flex justify-between text-sm mt-1">
                            <span className="text-stone-500">Overdue</span>
                            <span className="font-medium text-red-600">
                              {formatCurrency(contact.balances.accountsReceivable.overdue)}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex gap-2 mt-4">
                      <Button variant="secondary" size="sm" className="flex-1">
                        <Receipt className="w-4 h-4 mr-1" />
                        Invoice
                      </Button>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <table className="w-full">
                  <thead className="bg-stone-50 border-b border-stone-200">
                    <tr>
                      <th className="text-left p-4 font-medium text-stone-600">Date</th>
                      <th className="text-left p-4 font-medium text-stone-600">Invoice</th>
                      <th className="text-left p-4 font-medium text-stone-600">Reference</th>
                      <th className="text-left p-4 font-medium text-stone-600">Account</th>
                      <th className="text-right p-4 font-medium text-stone-600">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map(payment => (
                      <tr key={payment.paymentId} className="border-b border-stone-100 hover:bg-stone-50">
                        <td className="p-4 text-stone-700">{formatDate(payment.date)}</td>
                        <td className="p-4">
                          <span className="font-medium text-[#13B5EA]">{payment.invoice.invoiceNumber}</span>
                        </td>
                        <td className="p-4 text-stone-600">{payment.reference || '-'}</td>
                        <td className="p-4 text-stone-600">{payment.account.name}</td>
                        <td className="p-4 text-right">
                          <span className="font-semibold text-emerald-600">+{formatCurrency(payment.amount)}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl space-y-6">
            {/* Connection Info */}
            <Card>
              <CardContent className="pt-5">
                <h3 className="font-semibold text-stone-800 mb-4">Connection Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-stone-100">
                    <span className="text-stone-500">Organisation</span>
                    <span className="font-medium text-stone-800">{organisation?.name}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-stone-100">
                    <span className="text-stone-500">Short Code</span>
                    <span className="font-medium text-stone-800">{organisation?.shortCode}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-stone-100">
                    <span className="text-stone-500">Currency</span>
                    <span className="font-medium text-stone-800">{organisation?.baseCurrency}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-stone-100">
                    <span className="text-stone-500">Timezone</span>
                    <span className="font-medium text-stone-800">{organisation?.timezone}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-stone-500">Status</span>
                    <Badge variant="success" size="sm">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Connected
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sync Settings */}
            <Card>
              <CardContent className="pt-5">
                <h3 className="font-semibold text-stone-800 mb-4">Sync Settings</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Auto-sync invoices', desc: 'Create invoices when sessions are completed', enabled: true },
                    { label: 'Sync contacts', desc: 'Keep client info in sync', enabled: true },
                    { label: 'Sync payments', desc: 'Import payments from Xero', enabled: true },
                    { label: 'Email notifications', desc: 'Get notified on sync errors', enabled: false },
                  ].map((setting, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-stone-700">{setting.label}</p>
                        <p className="text-sm text-stone-500">{setting.desc}</p>
                      </div>
                      <button
                        className={cn(
                          'w-12 h-6 rounded-full transition-colors relative',
                          setting.enabled ? 'bg-[#13B5EA]' : 'bg-stone-300'
                        )}
                      >
                        <div className={cn(
                          'w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform shadow',
                          setting.enabled ? 'translate-x-6' : 'translate-x-0.5'
                        )} />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Item Codes */}
            <Card>
              <CardContent className="pt-5">
                <h3 className="font-semibold text-stone-800 mb-4">Medicare Item Codes</h3>
                <p className="text-sm text-stone-500 mb-4">
                  Commonly used Medicare item codes for mental health services.
                </p>
                <div className="space-y-2">
                  {MENTAL_HEALTH_ITEM_CODES.slice(0, 5).map(item => (
                    <div key={item.code} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                      <div>
                        <span className="font-mono font-medium text-stone-800">{item.code}</span>
                        <p className="text-sm text-stone-500">{item.description}</p>
                      </div>
                      <span className="font-semibold text-stone-700">{formatCurrency(item.fee)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-red-200">
              <CardContent className="pt-5">
                <h3 className="font-semibold text-red-800 mb-2">Disconnect Xero</h3>
                <p className="text-sm text-red-600 mb-4">
                  This will stop all syncing and remove the connection. Your data in Xero will not be affected.
                </p>
                <Button
                  variant="secondary"
                  leftIcon={<Trash2 className="w-4 h-4" />}
                  onClick={handleDisconnect}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  Disconnect Xero
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Create Invoice Modal */}
      {showCreateInvoice && (
        <CreateInvoiceModal
          contacts={contacts}
          onClose={() => setShowCreateInvoice(false)}
          onSave={(invoice) => {
            setInvoices(prev => [invoice, ...prev]);
            setShowCreateInvoice(false);
          }}
        />
      )}

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <InvoiceDetailModal
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}

      {/* Sync Clients Modal */}
      {showSyncClients && (
        <SyncClientsModal
          onClose={() => setShowSyncClients(false)}
          onSync={(newContacts) => {
            setContacts(prev => [...newContacts, ...prev]);
            setShowSyncClients(false);
          }}
        />
      )}
    </div>
  );
}

// Create Invoice Modal Component
function CreateInvoiceModal({
  contacts,
  onClose,
  onSave,
}: {
  contacts: XeroContact[];
  onClose: () => void;
  onSave: (invoice: XeroInvoice) => void;
}) {
  const [selectedContact, setSelectedContact] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [reference, setReference] = useState('');
  const [dueDate, setDueDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString().split('T')[0];
  });

  const selectedItemData = MENTAL_HEALTH_ITEM_CODES.find(i => i.code === selectedItem);
  const lineAmount = selectedItemData ? selectedItemData.fee * quantity : 0;

  const handleSave = () => {
    const contact = contacts.find(c => c.contactId === selectedContact);
    if (!contact || !selectedItemData) return;

    const invoice: XeroInvoice = {
      invoiceId: `inv-${Date.now()}`,
      invoiceNumber: `INV-${String(Date.now()).slice(-4)}`,
      type: 'ACCREC',
      contact: { contactId: contact.contactId, name: contact.name },
      date: new Date().toISOString().split('T')[0],
      dueDate,
      status: 'DRAFT',
      lineItems: [{
        description: `${selectedItemData.description} (${selectedItemData.code})`,
        quantity,
        unitAmount: selectedItemData.fee,
        lineAmount,
      }],
      subTotal: lineAmount,
      totalTax: 0,
      total: lineAmount,
      amountDue: lineAmount,
      amountPaid: 0,
      currencyCode: 'AUD',
      reference,
    };

    onSave(invoice);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200">
          <h2 className="text-xl font-semibold text-stone-800">Create Invoice</h2>
          <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Client</label>
            <select
              value={selectedContact}
              onChange={(e) => setSelectedContact(e.target.value)}
              className="w-full px-4 py-2 border border-stone-200 rounded-lg"
            >
              <option value="">Select a client...</option>
              {contacts.map(c => (
                <option key={c.contactId} value={c.contactId}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Service (Medicare Item)</label>
            <select
              value={selectedItem}
              onChange={(e) => setSelectedItem(e.target.value)}
              className="w-full px-4 py-2 border border-stone-200 rounded-lg"
            >
              <option value="">Select a service...</option>
              {MENTAL_HEALTH_ITEM_CODES.map(item => (
                <option key={item.code} value={item.code}>
                  {item.code} - {item.description} (${item.fee})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Quantity</label>
              <Input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Due Date</label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Reference</label>
            <Input
              placeholder="e.g., Session 5 - CBT"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
            />
          </div>

          {selectedItemData && (
            <div className="bg-stone-50 rounded-lg p-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-stone-500">Subtotal</span>
                <span className="font-medium">${lineAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-stone-500">GST</span>
                <span className="font-medium">$0.00</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-stone-200">
                <span className="font-medium text-stone-700">Total</span>
                <span className="font-bold text-lg">${lineAmount.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-stone-200 bg-stone-50">
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="flex-1 bg-[#13B5EA] hover:bg-[#0d9fd1]"
            onClick={handleSave}
            disabled={!selectedContact || !selectedItem}
          >
            Create Invoice
          </Button>
        </div>
      </div>
    </div>
  );
}

// Invoice Detail Modal Component
function InvoiceDetailModal({
  invoice,
  onClose,
}: {
  invoice: XeroInvoice;
  onClose: () => void;
}) {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(amount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200">
          <div>
            <h2 className="text-xl font-semibold text-stone-800">{invoice.invoiceNumber}</h2>
            <p className="text-sm text-stone-500">{invoice.contact.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm"><Printer className="w-4 h-4" /></Button>
            <Button variant="ghost" size="sm"><Download className="w-4 h-4" /></Button>
            <Button variant="ghost" size="sm"><Send className="w-4 h-4" /></Button>
            <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-lg ml-2">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <p className="text-sm text-stone-500">Issue Date</p>
              <p className="font-medium">{new Date(invoice.date).toLocaleDateString('en-AU')}</p>
            </div>
            <div>
              <p className="text-sm text-stone-500">Due Date</p>
              <p className="font-medium">{new Date(invoice.dueDate).toLocaleDateString('en-AU')}</p>
            </div>
            <div>
              <p className="text-sm text-stone-500">Status</p>
              <div className="mt-1">
                <Badge variant={invoice.status === 'PAID' ? 'success' : invoice.status === 'DRAFT' ? 'default' : 'warning'}>
                  {invoice.status}
                </Badge>
              </div>
            </div>
          </div>

          <table className="w-full mb-6">
            <thead className="bg-stone-50">
              <tr>
                <th className="text-left p-3 font-medium text-stone-600">Description</th>
                <th className="text-center p-3 font-medium text-stone-600">Qty</th>
                <th className="text-right p-3 font-medium text-stone-600">Unit Price</th>
                <th className="text-right p-3 font-medium text-stone-600">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.lineItems.map((item, i) => (
                <tr key={i} className="border-b border-stone-100">
                  <td className="p-3">{item.description}</td>
                  <td className="p-3 text-center">{item.quantity}</td>
                  <td className="p-3 text-right">{formatCurrency(item.unitAmount)}</td>
                  <td className="p-3 text-right font-medium">{formatCurrency(item.lineAmount)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end">
            <div className="w-64">
              <div className="flex justify-between py-2">
                <span className="text-stone-500">Subtotal</span>
                <span>{formatCurrency(invoice.subTotal)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-stone-500">GST</span>
                <span>{formatCurrency(invoice.totalTax)}</span>
              </div>
              <div className="flex justify-between py-2 border-t border-stone-200 font-bold text-lg">
                <span>Total</span>
                <span>{formatCurrency(invoice.total)}</span>
              </div>
              {invoice.amountPaid > 0 && (
                <>
                  <div className="flex justify-between py-2 text-emerald-600">
                    <span>Paid</span>
                    <span>-{formatCurrency(invoice.amountPaid)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-t border-stone-200 font-bold">
                    <span>Amount Due</span>
                    <span>{formatCurrency(invoice.amountDue)}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sync Clients Modal Component
function SyncClientsModal({
  onClose,
  onSync,
}: {
  onClose: () => void;
  onSync: (contacts: XeroContact[]) => void;
}) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncComplete, setSyncComplete] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    await new Promise(r => setTimeout(r, 2000));
    setIsSyncing(false);
    setSyncComplete(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200">
          <h2 className="text-xl font-semibold text-stone-800">Sync Clients to Xero</h2>
          <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {!syncComplete ? (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <p className="text-stone-600">
                  This will create Xero contacts for all your MindBridge clients who don't already exist in Xero.
                </p>
              </div>

              <div className="bg-stone-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-stone-600">
                  <strong>3 clients</strong> will be synced:
                </p>
                <ul className="mt-2 space-y-1 text-sm text-stone-500">
                  <li>• John Smith</li>
                  <li>• Lisa Anderson</li>
                  <li>• David Brown</li>
                </ul>
              </div>

              <Button
                className="w-full bg-[#13B5EA] hover:bg-[#0d9fd1]"
                onClick={handleSync}
                disabled={isSyncing}
              >
                {isSyncing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Start Sync
                  </>
                )}
              </Button>
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-stone-800 mb-2">Sync Complete!</h3>
              <p className="text-stone-600 mb-6">3 clients have been synced to Xero.</p>
              <Button className="w-full" onClick={onClose}>Done</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
