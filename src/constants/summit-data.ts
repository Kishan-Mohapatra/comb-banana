// Static demo data for Combo Banana — summit discovery, questionnaire, and budget output.
// No backend - every value below is fixture data for the prototype.

export type SummitCategory = 'InsurTech' | 'FinTech' | 'HealthTech' | 'SaaS' | 'AI';

export interface Summit {
  id: string;
  name: string;
  category: SummitCategory;
  city: string;
  country: string;
  location: string;
  dates: string;
  startDate: string; // ISO yyyy-mm-dd, for date-range filtering/sorting
  region: 'North America' | 'Europe' | 'APAC';
  attendees: number;
  matchScore: number;
  boothTiersFrom: number;
  boothTiersTo: number;
  earlyBirdDeadline: string;
  description: string;
  sizeLabel: string;
  participationCriteria: string[];
  audienceCriteria: string[];
}

export const summits: Summit[] = [
  {
    id: 'itc-2026',
    name: 'InsurTech Connect 2026',
    category: 'InsurTech',
    city: 'Las Vegas',
    country: 'United States',
    location: 'Las Vegas, NV',
    dates: 'Oct 5–7, 2026',
    startDate: '2026-10-05',
    region: 'North America',
    attendees: 8500,
    matchScore: 96,
    boothTiersFrom: 12500,
    boothTiersTo: 32000,
    earlyBirdDeadline: 'Aug 30, 2026',
    description: 'The largest gathering of insurance carriers, MGAs, and InsurTech vendors.',
    sizeLabel: 'Large (8,000+ attendees)',
    participationCriteria: [
      'B2B insurance, MGA, or InsurTech vendor',
      'Team of 2+ available on-site for all 3 days',
      'Booth-ready collateral (demo, one-pager, signage)'
    ],
    audienceCriteria: [
      'Insurance or InsurTech professional',
      'Registered attendee badge for expo floor access',
      'No booth required — networking passes available'
    ]
  },
  {
    id: 'fintech-nexus-26',
    name: 'FinTech Nexus USA',
    category: 'FinTech',
    city: 'New York',
    country: 'United States',
    location: 'New York, NY',
    dates: 'May 12–13, 2026',
    startDate: '2026-05-12',
    region: 'North America',
    attendees: 4200,
    matchScore: 81,
    boothTiersFrom: 9800,
    boothTiersTo: 24000,
    earlyBirdDeadline: 'Mar 1, 2026',
    description: 'Banking, payments, and lending innovation across the fintech stack.',
    sizeLabel: 'Mid-size (4,000+ attendees)',
    participationCriteria: [
      'Banking, payments, or lending product',
      'Compliance-reviewed marketing materials',
      'At least 1 senior spokesperson on-site'
    ],
    audienceCriteria: [
      'Working in banking, fintech, or payments',
      'Valid registration ticket',
      'Investor and press credentials accepted'
    ]
  },
  {
    id: 'saastr-annual-26',
    name: 'SaaStr Annual',
    category: 'SaaS',
    city: 'San Mateo',
    country: 'United States',
    location: 'San Mateo, CA',
    dates: 'Sep 9–11, 2026',
    startDate: '2026-09-09',
    region: 'North America',
    attendees: 12000,
    matchScore: 74,
    boothTiersFrom: 15000,
    boothTiersTo: 38000,
    earlyBirdDeadline: 'Jun 15, 2026',
    description: 'The largest B2B SaaS community event, for founders, execs, and VCs.',
    sizeLabel: 'Very large (12,000+ attendees)',
    participationCriteria: [
      'B2B SaaS product with a live demo',
      'Founder or VP-level presence on-site',
      'Booth staffed all 3 days'
    ],
    audienceCriteria: [
      'SaaS founder, operator, or investor',
      'General admission ticket — no booth required',
      'Startup and student discount passes available'
    ]
  },
  {
    id: 'hlth-26',
    name: 'HLTH 2026',
    category: 'HealthTech',
    city: 'Las Vegas',
    country: 'United States',
    location: 'Las Vegas, NV',
    dates: 'Oct 18–21, 2026',
    startDate: '2026-10-18',
    region: 'North America',
    attendees: 10000,
    matchScore: 68,
    boothTiersFrom: 14000,
    boothTiersTo: 34000,
    earlyBirdDeadline: 'Jul 1, 2026',
    description: 'Health innovation event connecting payers, providers, and health-tech vendors.',
    sizeLabel: 'Large (10,000+ attendees)',
    participationCriteria: [
      'Health-tech, payer, or provider-facing product',
      'HIPAA-aware collateral and demo environment',
      'Clinical or product lead available on-site'
    ],
    audienceCriteria: [
      'Healthcare, payer, or provider professional',
      'Valid registration and badge',
      'Clinical credentials welcomed but not required'
    ]
  },
  {
    id: 'web-summit-26',
    name: 'Web Summit',
    category: 'AI',
    city: 'Lisbon',
    country: 'Portugal',
    location: 'Lisbon, Portugal',
    dates: 'Nov 9–12, 2026',
    startDate: '2026-11-09',
    region: 'Europe',
    attendees: 71000,
    matchScore: 59,
    boothTiersFrom: 8200,
    boothTiersTo: 26000,
    earlyBirdDeadline: 'Aug 1, 2026',
    description: 'One of the largest tech conferences globally, spanning every vertical.',
    sizeLabel: 'Massive (70,000+ attendees)',
    participationCriteria: [
      'Any tech vertical — broad audience',
      'International shipping lead time (4+ weeks)',
      'Team fluent in English for on-site pitching'
    ],
    audienceCriteria: [
      'Open to any professional background',
      'General attendee ticket',
      'Discounted startup and student passes available'
    ]
  },
  {
    id: 'money2020-26',
    name: 'Money20/20 USA',
    category: 'FinTech',
    city: 'Las Vegas',
    country: 'United States',
    location: 'Las Vegas, NV',
    dates: 'Oct 25–28, 2026',
    startDate: '2026-10-25',
    region: 'North America',
    attendees: 13000,
    matchScore: 77,
    boothTiersFrom: 16500,
    boothTiersTo: 40000,
    earlyBirdDeadline: 'Aug 15, 2026',
    description: 'Where the money system of tomorrow gets built — payments, banking, crypto.',
    sizeLabel: 'Very large (13,000+ attendees)',
    participationCriteria: [
      'Payments, banking, or crypto product',
      'Regulatory disclosures reviewed ahead of booth signage',
      'Team of 3+ for the full 4 days'
    ],
    audienceCriteria: [
      'Finance, banking, or payments professional',
      'Registered attendee badge',
      'Analyst and press passes accepted'
    ]
  },
  {
    id: 'delhi-ai-summit-26',
    name: 'Delhi AI Summit 2026',
    category: 'AI',
    city: 'New Delhi',
    country: 'India',
    location: 'New Delhi, India',
    dates: 'Feb 12–14, 2026',
    startDate: '2026-02-12',
    region: 'APAC',
    attendees: 6000,
    matchScore: 88,
    boothTiersFrom: 7800,
    boothTiersTo: 21000,
    earlyBirdDeadline: 'Dec 15, 2025',
    description: "South Asia's largest applied-AI gathering — enterprise buyers, labs, and policy.",
    sizeLabel: 'Large (6,000+ attendees)',
    participationCriteria: [
      'Applied AI product for enterprise buyers',
      'Visa lead time for non-India team members (4–6 weeks)',
      'Local-language collateral recommended'
    ],
    audienceCriteria: [
      'AI/ML practitioner or enterprise buyer',
      'Valid visa/travel documents for international attendees',
      'Registered attendee pass'
    ]
  }
];

export const summitCountries = Array.from(new Set(summits.map((s) => s.country))).sort();
export const summitRegions = Array.from(new Set(summits.map((s) => s.region))).sort();

// --- Questionnaire options ---

export const goalOptions = [
  { value: 'lead-gen', label: 'Lead generation' },
  { value: 'brand-presence', label: 'Brand presence' },
  { value: 'partnerships', label: 'Partnerships' },
  { value: 'analyst-briefings', label: 'Analyst briefings' }
];

export const boothTierOptions = [
  { value: 'tabletop', label: 'Tabletop' },
  { value: '10x10', label: "10'×10'" },
  { value: '20x20', label: "20'×20'" },
  { value: 'custom', label: 'Custom build' }
];

// --- Budget & vendor output — grounded in the Pibit.ai 20'×20' ITC 2026 booth package ---

export interface BudgetLineItem {
  sku: string;
  item: string;
  qty: number;
  unitCost: number;
}

export const boothLineItems: BudgetLineItem[] = [
  { sku: 'FLR-2020', item: 'Flooring, 20×20 premium tile', qty: 1, unitCost: 3200 },
  { sku: 'AV-TV65', item: '65" TV monitor + mount', qty: 3, unitCost: 950 },
  { sku: 'FRN-CTR', item: 'Reception counter', qty: 2, unitCost: 680 },
  { sku: 'FRN-BAR', item: 'Barstool', qty: 6, unitCost: 145 },
  { sku: 'FRN-TBL', item: 'Meeting table', qty: 3, unitCost: 410 },
  { sku: 'FRN-SOF', item: 'Lounge sofa', qty: 2, unitCost: 890 },
  { sku: 'AV-LED', item: 'Backlit LED wall graphic', qty: 1, unitCost: 4100 }
];

export const boothTierCost: Record<string, number> = {
  tabletop: 2500,
  '10x10': 6500,
  '20x20': 12500,
  custom: 22000
};

export function computeBudget(boothTier: string, teamSize: number) {
  const boothCost = boothTierCost[boothTier] ?? boothTierCost['10x10'];
  const lineItemsTotal = boothLineItems.reduce((sum, li) => sum + li.qty * li.unitCost, 0);
  const travelStayEstimate = teamSize * 1200;
  const ticketsEstimate = teamSize * 400;
  const miscContingency = 1500;
  const total = boothCost + lineItemsTotal + travelStayEstimate + ticketsEstimate + miscContingency;
  return { boothCost, lineItemsTotal, travelStayEstimate, ticketsEstimate, miscContingency, total };
}

export const budgetSummary = {
  boothTier: "20' × 20'",
  boothCost: 12500,
  travelStayEstimate: 6800,
  ticketsEstimate: 2400,
  miscContingency: 1500
};

export const vendorCapacity = {
  vendorName: 'Pibit Fulfillment Network',
  locations: 13,
  continents: 3,
  countries: 20,
  annualCapacity: 1500,
  canDeliverAtLocation: true
};

export const planConstraints = [
  { label: 'Early-bird booth deadline', value: 'Aug 30, 2026', risk: 'high' as const },
  { label: 'Shipping cutoff for booth freight', value: 'Sep 20, 2026', risk: 'medium' as const },
  { label: 'Visa processing lead time (non-US team)', value: '4–6 weeks', risk: 'medium' as const },
  { label: 'Vendor capacity at Las Vegas venue', value: 'Available', risk: 'low' as const }
];

// --- My Summits — participation tracker ---

export type SummitStatus = 'Planning' | 'Budget Approved' | 'Booked' | 'Attended';

export interface TrackedSummit {
  id: string;
  summitName: string;
  status: SummitStatus;
  boothTier: string;
  budget: number;
  spent: number;
  deadline: string;
  teamSize: number;
}

export const trackedSummits: TrackedSummit[] = [
  {
    id: 'itc-2026',
    summitName: 'InsurTech Connect 2026',
    status: 'Budget Approved',
    boothTier: "20'×20'",
    budget: 23200,
    spent: 12500,
    deadline: 'Aug 30, 2026',
    teamSize: 5
  },
  {
    id: 'money2020-26',
    summitName: 'Money20/20 USA',
    status: 'Planning',
    boothTier: "10'×10'",
    budget: 18000,
    spent: 0,
    deadline: 'Aug 15, 2026',
    teamSize: 3
  },
  {
    id: 'saastr-annual-26',
    summitName: 'SaaStr Annual',
    status: 'Booked',
    boothTier: 'Tabletop',
    budget: 9400,
    spent: 9400,
    deadline: 'Jun 15, 2026',
    teamSize: 2
  }
];

// --- Reporting ---

export const spendBySummit = trackedSummits.map((s) => ({ name: s.summitName, spend: s.spent }));

// --- Command Centre — central query hero pills & prompt suggestions ---

export const summitQueryPills = [
  'Are you looking forward to the AI Summit in Delhi?',
  'Get to know more about the AI Summit in Argentina',
  'What would the AI Summit in Argentina cost you?',
  "What's my early-bird deadline for InsurTech Connect?",
  'Show me the highest-scoring summits right now',
  'I want to lead gen on a summit'
];

export const reportingMetrics = [
  { label: 'Total Committed Budget', value: '$50,600' },
  { label: 'Total Spent', value: '$21,900' },
  { label: 'Summits In Flight', value: trackedSummits.length },
  { label: 'Avg. Match Score', value: '76%' }
];
