// Xero API Integration
// This module handles OAuth and API calls to Xero

export interface XeroToken {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  token_type: string;
  scope: string;
}

export interface XeroOrganisation {
  id: string;
  name: string;
  legalName: string;
  shortCode: string;
  countryCode: string;
  baseCurrency: string;
  timezone: string;
  organisationType: string;
}

export interface XeroContact {
  contactId: string;
  name: string;
  firstName?: string;
  lastName?: string;
  emailAddress?: string;
  phones?: {
    phoneType: string;
    phoneNumber: string;
  }[];
  addresses?: {
    addressType: string;
    addressLine1?: string;
    city?: string;
    region?: string;
    postalCode?: string;
    country?: string;
  }[];
  isCustomer: boolean;
  isSupplier: boolean;
  balances?: {
    accountsReceivable?: {
      outstanding: number;
      overdue: number;
    };
  };
  updatedDateUTC?: string;
}

export interface XeroInvoice {
  invoiceId: string;
  invoiceNumber: string;
  type: 'ACCREC' | 'ACCPAY'; // Receivable or Payable
  contact: {
    contactId: string;
    name: string;
  };
  date: string;
  dueDate: string;
  status: 'DRAFT' | 'SUBMITTED' | 'AUTHORISED' | 'PAID' | 'VOIDED';
  lineItems: XeroLineItem[];
  subTotal: number;
  totalTax: number;
  total: number;
  amountDue: number;
  amountPaid: number;
  currencyCode: string;
  reference?: string;
  url?: string;
  updatedDateUTC?: string;
}

export interface XeroLineItem {
  lineItemId?: string;
  description: string;
  quantity: number;
  unitAmount: number;
  accountCode?: string;
  taxType?: string;
  lineAmount: number;
  itemCode?: string;
}

export interface XeroPayment {
  paymentId: string;
  date: string;
  amount: number;
  reference?: string;
  invoice: {
    invoiceId: string;
    invoiceNumber: string;
  };
  account: {
    accountId: string;
    code: string;
    name: string;
  };
  status: 'AUTHORISED' | 'DELETED';
}

export interface XeroAccount {
  accountId: string;
  code: string;
  name: string;
  type: string;
  bankAccountNumber?: string;
  status: string;
  class: string;
  enablePaymentsToAccount?: boolean;
}

// Xero API Configuration
const XERO_CONFIG = {
  clientId: process.env.NEXT_PUBLIC_XERO_CLIENT_ID || 'demo-client-id',
  redirectUri: process.env.NEXT_PUBLIC_XERO_REDIRECT_URI || 'http://localhost:3000/integrations/xero/callback',
  scopes: [
    'openid',
    'profile',
    'email',
    'accounting.transactions',
    'accounting.contacts',
    'accounting.settings',
    'offline_access',
  ],
  authUrl: 'https://login.xero.com/identity/connect/authorize',
  tokenUrl: 'https://identity.xero.com/connect/token',
  apiUrl: 'https://api.xero.com/api.xro/2.0',
};

// Generate OAuth URL
export function getXeroAuthUrl(state?: string): string {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: XERO_CONFIG.clientId,
    redirect_uri: XERO_CONFIG.redirectUri,
    scope: XERO_CONFIG.scopes.join(' '),
    state: state || generateState(),
  });

  return `${XERO_CONFIG.authUrl}?${params.toString()}`;
}

// Generate random state for CSRF protection
function generateState(): string {
  return Math.random().toString(36).substring(2, 15);
}

// Store Xero connection in localStorage (in production, use secure server-side storage)
export function saveXeroConnection(data: {
  token: XeroToken;
  organisation: XeroOrganisation;
}): void {
  localStorage.setItem('xero-connection', JSON.stringify({
    ...data,
    connectedAt: new Date().toISOString(),
  }));
}

// Get stored Xero connection
export function getXeroConnection(): {
  token: XeroToken;
  organisation: XeroOrganisation;
  connectedAt: string;
} | null {
  const stored = localStorage.getItem('xero-connection');
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

// Remove Xero connection
export function removeXeroConnection(): void {
  localStorage.removeItem('xero-connection');
}

// Check if token is expired
export function isTokenExpired(token: XeroToken): boolean {
  return Date.now() >= token.expires_at;
}

// Medicare/Health item codes commonly used in Australian mental health
export const MENTAL_HEALTH_ITEM_CODES = [
  { code: '80010', description: 'Initial consultation - Clinical psychologist', fee: 224.20 },
  { code: '80110', description: 'Subsequent consultation - Clinical psychologist (30-50 min)', fee: 134.55 },
  { code: '80115', description: 'Subsequent consultation - Clinical psychologist (>50 min)', fee: 179.35 },
  { code: '91182', description: 'Mental health treatment - Psychologist (30-50 min)', fee: 88.25 },
  { code: '91183', description: 'Mental health treatment - Psychologist (>50 min)', fee: 129.55 },
  { code: '10968', description: 'GP Mental Health Treatment Plan', fee: 92.00 },
  { code: '10970', description: 'GP Mental Health Treatment Plan Review', fee: 68.25 },
  { code: '91177', description: 'Focussed Psychological Strategies - GP (>40 min)', fee: 103.50 },
];

// Demo data generators
export function generateDemoOrganisation(): XeroOrganisation {
  return {
    id: 'org-demo-001',
    name: 'MindBridge Psychology Practice',
    legalName: 'MindBridge Psychology Pty Ltd',
    shortCode: 'MBPP',
    countryCode: 'AU',
    baseCurrency: 'AUD',
    timezone: 'Australia/Sydney',
    organisationType: 'COMPANY',
  };
}

export function generateDemoContacts(): XeroContact[] {
  return [
    {
      contactId: 'contact-001',
      name: 'Sarah Johnson',
      firstName: 'Sarah',
      lastName: 'Johnson',
      emailAddress: 'sarah.johnson@email.com',
      phones: [{ phoneType: 'MOBILE', phoneNumber: '0412 345 678' }],
      isCustomer: true,
      isSupplier: false,
      balances: { accountsReceivable: { outstanding: 224.20, overdue: 0 } },
      updatedDateUTC: '2025-02-15T10:00:00Z',
    },
    {
      contactId: 'contact-002',
      name: 'Michael Chen',
      firstName: 'Michael',
      lastName: 'Chen',
      emailAddress: 'michael.chen@email.com',
      phones: [{ phoneType: 'MOBILE', phoneNumber: '0423 456 789' }],
      isCustomer: true,
      isSupplier: false,
      balances: { accountsReceivable: { outstanding: 0, overdue: 0 } },
      updatedDateUTC: '2025-02-14T14:30:00Z',
    },
    {
      contactId: 'contact-003',
      name: 'Emma Williams',
      firstName: 'Emma',
      lastName: 'Williams',
      emailAddress: 'emma.williams@email.com',
      phones: [{ phoneType: 'MOBILE', phoneNumber: '0434 567 890' }],
      isCustomer: true,
      isSupplier: false,
      balances: { accountsReceivable: { outstanding: 448.40, overdue: 224.20 } },
      updatedDateUTC: '2025-02-13T09:15:00Z',
    },
    {
      contactId: 'contact-004',
      name: 'James Thompson',
      firstName: 'James',
      lastName: 'Thompson',
      emailAddress: 'james.thompson@email.com',
      phones: [{ phoneType: 'MOBILE', phoneNumber: '0445 678 901' }],
      isCustomer: true,
      isSupplier: false,
      balances: { accountsReceivable: { outstanding: 134.55, overdue: 0 } },
      updatedDateUTC: '2025-02-15T08:00:00Z',
    },
  ];
}

export function generateDemoInvoices(): XeroInvoice[] {
  return [
    {
      invoiceId: 'inv-001',
      invoiceNumber: 'INV-0001',
      type: 'ACCREC',
      contact: { contactId: 'contact-001', name: 'Sarah Johnson' },
      date: '2025-02-15',
      dueDate: '2025-02-22',
      status: 'AUTHORISED',
      lineItems: [
        { description: 'Initial Consultation - Clinical Psychology (80010)', quantity: 1, unitAmount: 224.20, lineAmount: 224.20 },
      ],
      subTotal: 224.20,
      totalTax: 0,
      total: 224.20,
      amountDue: 224.20,
      amountPaid: 0,
      currencyCode: 'AUD',
      reference: 'Initial assessment session',
    },
    {
      invoiceId: 'inv-002',
      invoiceNumber: 'INV-0002',
      type: 'ACCREC',
      contact: { contactId: 'contact-002', name: 'Michael Chen' },
      date: '2025-02-14',
      dueDate: '2025-02-21',
      status: 'PAID',
      lineItems: [
        { description: 'Psychology Session (80110)', quantity: 1, unitAmount: 134.55, lineAmount: 134.55 },
      ],
      subTotal: 134.55,
      totalTax: 0,
      total: 134.55,
      amountDue: 0,
      amountPaid: 134.55,
      currencyCode: 'AUD',
      reference: 'Session 5 - CBT',
    },
    {
      invoiceId: 'inv-003',
      invoiceNumber: 'INV-0003',
      type: 'ACCREC',
      contact: { contactId: 'contact-003', name: 'Emma Williams' },
      date: '2025-02-01',
      dueDate: '2025-02-08',
      status: 'AUTHORISED',
      lineItems: [
        { description: 'Psychology Session (80115)', quantity: 1, unitAmount: 179.35, lineAmount: 179.35 },
      ],
      subTotal: 179.35,
      totalTax: 0,
      total: 179.35,
      amountDue: 179.35,
      amountPaid: 0,
      currencyCode: 'AUD',
      reference: 'Extended session - Trauma processing',
    },
    {
      invoiceId: 'inv-004',
      invoiceNumber: 'INV-0004',
      type: 'ACCREC',
      contact: { contactId: 'contact-003', name: 'Emma Williams' },
      date: '2025-02-08',
      dueDate: '2025-02-15',
      status: 'AUTHORISED',
      lineItems: [
        { description: 'Psychology Session (80110)', quantity: 2, unitAmount: 134.55, lineAmount: 269.10 },
      ],
      subTotal: 269.10,
      totalTax: 0,
      total: 269.10,
      amountDue: 269.10,
      amountPaid: 0,
      currencyCode: 'AUD',
      reference: 'Sessions 3-4',
    },
    {
      invoiceId: 'inv-005',
      invoiceNumber: 'INV-0005',
      type: 'ACCREC',
      contact: { contactId: 'contact-004', name: 'James Thompson' },
      date: '2025-02-15',
      dueDate: '2025-02-22',
      status: 'DRAFT',
      lineItems: [
        { description: 'Psychology Session (80110)', quantity: 1, unitAmount: 134.55, lineAmount: 134.55 },
      ],
      subTotal: 134.55,
      totalTax: 0,
      total: 134.55,
      amountDue: 134.55,
      amountPaid: 0,
      currencyCode: 'AUD',
      reference: 'Session 2 - Anxiety management',
    },
  ];
}

export function generateDemoPayments(): XeroPayment[] {
  return [
    {
      paymentId: 'pay-001',
      date: '2025-02-14',
      amount: 134.55,
      reference: 'Medicare rebate',
      invoice: { invoiceId: 'inv-002', invoiceNumber: 'INV-0002' },
      account: { accountId: 'acc-001', code: '090', name: 'Business Bank Account' },
      status: 'AUTHORISED',
    },
    {
      paymentId: 'pay-002',
      date: '2025-02-13',
      amount: 88.25,
      reference: 'Direct deposit - gap payment',
      invoice: { invoiceId: 'inv-002', invoiceNumber: 'INV-0002' },
      account: { accountId: 'acc-001', code: '090', name: 'Business Bank Account' },
      status: 'AUTHORISED',
    },
    {
      paymentId: 'pay-003',
      date: '2025-02-10',
      amount: 224.20,
      reference: 'Card payment',
      invoice: { invoiceId: 'inv-006', invoiceNumber: 'INV-0006' },
      account: { accountId: 'acc-001', code: '090', name: 'Business Bank Account' },
      status: 'AUTHORISED',
    },
  ];
}

export function generateDemoAccounts(): XeroAccount[] {
  return [
    { accountId: 'acc-001', code: '090', name: 'Business Bank Account', type: 'BANK', status: 'ACTIVE', class: 'ASSET', bankAccountNumber: '062-000 1234567' },
    { accountId: 'acc-002', code: '200', name: 'Sales - Professional Services', type: 'REVENUE', status: 'ACTIVE', class: 'REVENUE' },
    { accountId: 'acc-003', code: '400', name: 'Office Expenses', type: 'EXPENSE', status: 'ACTIVE', class: 'EXPENSE' },
    { accountId: 'acc-004', code: '460', name: 'Insurance', type: 'EXPENSE', status: 'ACTIVE', class: 'EXPENSE' },
    { accountId: 'acc-005', code: '470', name: 'Professional Development', type: 'EXPENSE', status: 'ACTIVE', class: 'EXPENSE' },
  ];
}

// Calculate financial summary
export function calculateFinancialSummary(invoices: XeroInvoice[], payments: XeroPayment[]) {
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();

  const monthlyInvoices = invoices.filter(inv => {
    const invDate = new Date(inv.date);
    return invDate.getMonth() === thisMonth && invDate.getFullYear() === thisYear;
  });

  const totalOutstanding = invoices
    .filter(inv => inv.status === 'AUTHORISED')
    .reduce((sum, inv) => sum + inv.amountDue, 0);

  const totalOverdue = invoices
    .filter(inv => inv.status === 'AUTHORISED' && new Date(inv.dueDate) < now)
    .reduce((sum, inv) => sum + inv.amountDue, 0);

  const monthlyRevenue = monthlyInvoices.reduce((sum, inv) => sum + inv.total, 0);

  const monthlyPayments = payments
    .filter(pay => {
      const payDate = new Date(pay.date);
      return payDate.getMonth() === thisMonth && payDate.getFullYear() === thisYear;
    })
    .reduce((sum, pay) => sum + pay.amount, 0);

  return {
    totalOutstanding,
    totalOverdue,
    monthlyRevenue,
    monthlyPayments,
    invoiceCount: invoices.length,
    paidInvoices: invoices.filter(inv => inv.status === 'PAID').length,
    draftInvoices: invoices.filter(inv => inv.status === 'DRAFT').length,
  };
}
