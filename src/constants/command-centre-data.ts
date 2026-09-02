// Static demo data for the AI Morning Command Centre.
// No backend - every value below is fixture data for the prototype.

export const morningBrief = {
  greetingName: 'Sarah',
  date: 'Friday, Jul 31',
  businessHealth: 92,
  revenueForecast: 52400,
  expectedClosingsToday: 3,
  urgentTasks: 7,
  overdueFollowUps: 4,
  mission: [
    { id: 'm1', label: 'Close 3 deals', done: false },
    { id: 'm2', label: 'Review 2 contracts', done: false },
    { id: 'm3', label: 'Coach 2 agents', done: true },
    { id: 'm4', label: 'Respond to 5 buyers', done: false }
  ],
  recommendation: {
    headline: "Sarah Johnson's offer expires in 2h 14m",
    commission: 18400,
    risk: 'High' as const,
    actions: ['Review', 'Call Buyer', 'Draft Email', 'Assign Agent']
  }
};

export type SnapshotMetric = {
  id: string;
  label: string;
  value: string;
  delta?: string;
  trend?: 'up' | 'down';
  sparkline?: number[];
};

export const businessSnapshot: SnapshotMetric[] = [
  {
    id: 'revenue-forecast',
    label: 'Revenue Forecast',
    value: '$248,400',
    delta: '+12%',
    trend: 'up',
    sparkline: [40, 44, 42, 51, 49, 58, 61, 64]
  },
  {
    id: 'pipeline-health',
    label: 'Pipeline Health',
    value: '84%',
    delta: 'Healthy',
    trend: 'up',
    sparkline: [70, 74, 71, 78, 80, 79, 83, 84]
  },
  {
    id: 'deals-closing-today',
    label: 'Deals Closing Today',
    value: '12',
    trend: 'up'
  },
  {
    id: 'agents-active',
    label: 'Agents Active',
    value: '18 / 22'
  },
  {
    id: 'active-listings',
    label: 'Active Listings',
    value: '47'
  },
  {
    id: 'pending-transactions',
    label: 'Pending Transactions',
    value: '18'
  },
  {
    id: 'closed-this-month',
    label: 'Closed This Month',
    value: '31',
    trend: 'up'
  },
  {
    id: 'avg-lead-response',
    label: 'Average Lead Response',
    value: '7 min',
    trend: 'up'
  }
];

export const promptSuggestions = [
  'Which deals need attention?',
  "Show today's priorities.",
  'Coach low-performing agents.',
  'Draft follow-up emails.',
  "Predict this month's revenue.",
  'Show contracts at risk.'
];

export const exampleConversation = {
  userQuestion: 'Which deal should I work on first?',
  aiName: 'Leo AI',
  answer: 'After analyzing 143 transactions, Sarah Johnson is your highest priority.',
  reasons: [
    'Offer expires today.',
    'Buyer viewed contract 6 times.',
    'Seller accepted.',
    'Estimated commission: $18,400.'
  ],
  confidence: 94,
  actions: ['Call Buyer', 'Generate Follow-up', 'Open Contract', 'Assign Assistant']
};

export const todaysSchedule = [
  { id: 's1', time: '09:30', label: 'Team Stand-up' },
  { id: 's2', time: '11:00', label: 'Property Showing' },
  { id: 's3', time: '14:00', label: 'Inspection' },
  { id: 's4', time: '17:30', label: 'Closing' }
];

export const notifications = [
  { id: 'n1', label: '3 contracts signed' },
  { id: 'n2', label: '2 new leads' },
  { id: 'n3', label: '1 offer accepted' }
];

export const aiWatchlist = [
  { id: 'w1', name: 'Sarah', note: 'Offer expires', risk: 'high' as const },
  { id: 'w2', name: 'Michael', note: 'Missing documents', risk: 'medium' as const },
  { id: 'w3', name: 'Emily', note: 'Lead cooling down', risk: 'medium' as const }
];

export const pendingTasksPreview = [
  { id: 't1', label: 'Review Michael Chen contract', dueIn: '1h' },
  { id: 't2', label: 'Approve listing photos for 214 Birchwood', dueIn: '2h' },
  { id: 't3', label: 'Sign off on Emily Ruiz follow-up sequence', dueIn: '3h' },
  { id: 't4', label: 'Confirm inspector for 88 Maple Court', dueIn: 'Today' }
];

export const teamMembersPreview = [
  { id: 'tm1', name: 'Marcus Webb', role: 'Senior Agent', status: 'closing' as const },
  { id: 'tm2', name: 'Priya Anand', role: 'Buyer Agent', status: 'active' as const },
  { id: 'tm3', name: 'Daniel Osei', role: 'Listing Agent', status: 'coaching' as const }
];

export const analytics = {
  revenueYtd: '$2.4M',
  monthlyRevenue: '+18%',
  conversionRate: '34%',
  avgDaysOnMarket: 18,
  activeListings: 47,
  pipelineValue: '$8.6M',
  grossCommissionForecast: '$248K',
  clientSatisfaction: '4.8 / 5',
  leadQualificationRate: '61%',
  offerAcceptanceRate: '71%',
  agentProductivityScore: '89%',
  tasksCompletedToday: '42 / 51'
};

export const priorityEngine = {
  featureName: 'AI Priority Resolution Engine',
  ranking: 'AI automatically ranks today’s work.',
  explainSteps: ['Why it is ranked.', 'Expected business impact.', 'Risk if ignored.'],
  resolveActions: ['Call', 'Email', 'Schedule', 'Assign', 'Open Contract', 'Complete'],
  successState:
    'Congratulations! All critical tasks have been completed. No high-risk opportunities remain.'
};
