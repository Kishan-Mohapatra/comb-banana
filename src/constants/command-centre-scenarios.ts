/**
 * Sarah Johnson's Command Centre scenario data.
 * Mock-only, no network. See src/features/command-centre for consumers.
 */

export type Impact = 'high' | 'medium' | 'low';

export interface FocusStep {
  label: string;
  status: 'done' | 'blocked' | 'waiting';
}

export interface DealStage {
  title: string;
  description: string;
  status: 'done' | 'current' | 'upcoming';
}

export interface FocusItem {
  id: string;
  icon: 'warning' | 'contracts' | 'phone' | 'agent' | 'clock';
  title: string;
  subline: string;
  impact: Impact;
  dueIn: string;
  steps: FocusStep[];
  actions: string[];
  detail?: string;
  dealTimeline?: DealStage[];
}

export const todaysFocus: FocusItem[] = [
  {
    id: 'focus-1',
    icon: 'warning',
    title: 'Approve offer for 123 Main St',
    subline: 'Buyer: James Carter',
    impact: 'high',
    dueIn: '1h 30m',
    detail: 'Offer $485K — $10K above asking. Pre-approved financing. Inspection waiver included.',
    steps: [
      { label: 'Buyer pre-approval verified', status: 'done' },
      { label: 'Seller counter pending your review', status: 'waiting' },
      { label: 'Closing date: Aug 15', status: 'waiting' }
    ],
    actions: ['Approve Offer', 'Counter', 'Request Extension']
  },
  {
    id: 'focus-2',
    icon: 'contracts',
    title: 'Review contract: Oak Ave Deal',
    subline: 'Seller: Priya Sharma',
    impact: 'high',
    dueIn: '3h',
    detail: "Contract amendments from seller's attorney arrived yesterday. 3 clauses need review.",
    steps: [
      { label: 'Initial terms agreed', status: 'done' },
      { label: '3 amended clauses flagged', status: 'blocked' },
      { label: 'Buyer signature pending', status: 'waiting' }
    ],
    actions: ['Review Contract', 'Assign to Member'],
    dealTimeline: [
      { title: 'Listing Agreement', description: 'Seller signed listing terms.', status: 'done' },
      { title: 'Offer Accepted', description: '$485K accepted by seller.', status: 'done' },
      {
        title: 'Contract & Disclosures',
        description: "Amendment sent to buyer's client — no reply in 2 days.",
        status: 'current'
      },
      {
        title: 'Inspection & Appraisal',
        description: 'Scheduled once contract clears.',
        status: 'upcoming'
      },
      {
        title: 'Closing',
        description: 'Target close date pending contract sign-off.',
        status: 'upcoming'
      }
    ]
  },
  {
    id: 'focus-3',
    icon: 'phone',
    title: 'Call buyer: Lisa Thompson',
    subline: 'Hot lead · Budget approved',
    impact: 'medium',
    dueIn: '5h',
    detail: 'Lisa viewed 4 properties last week. Budget $350-400K. Prefers Westside neighborhoods.',
    steps: [
      { label: 'Budget pre-approved ($400K)', status: 'done' },
      { label: 'Shortlisted 4 properties', status: 'done' },
      { label: 'Schedule showing this week', status: 'waiting' }
    ],
    actions: ['Call Now', 'Send Properties', 'Assign to Member']
  },
  {
    id: 'focus-4',
    icon: 'agent',
    title: 'Coach Marcus on negotiations',
    subline: '2 deals stuck in proposal stage',
    impact: 'medium',
    dueIn: '5h',
    detail:
      'Marcus has 2 proposals with no response in 5+ days. May need pricing strategy adjustment.',
    steps: [
      { label: '212 Birch Ln — no response (6 days)', status: 'blocked' },
      { label: '88 Cedar Ct — buyer hesitant on price', status: 'blocked' },
      { label: 'Schedule coaching call', status: 'waiting' }
    ],
    actions: ['Review Proposals', 'Schedule 1:1', 'Reassign Deals']
  },
  {
    id: 'focus-5',
    icon: 'clock',
    title: 'Follow up 5 expiring leads',
    subline: "Leads haven't responded in 3+ days",
    impact: 'low',
    dueIn: '1d',
    detail: '5 leads with no activity since Jul 28. Auto-follow-up campaign ready to deploy.',
    steps: [
      { label: '3 leads last contacted Jul 28', status: 'waiting' },
      { label: '2 leads opened last email but no reply', status: 'waiting' },
      { label: 'Auto-campaign ready to send', status: 'done' }
    ],
    actions: ['Send Campaign', 'Review Leads', 'Mark as Cold']
  }
];

export type AgentStatus = 'Available' | 'Busy' | 'Closing' | 'Assigned';

export interface AgentTask {
  label: string;
  done: boolean;
}

export interface ScheduleSlot {
  time: string;
  label: string;
  free: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  initials: string;
  status: AgentStatus;
  capacity: number;
  recommended?: boolean;
  nextAvailable?: string;
  revenue?: number;
  luxuryConversion?: number;
  distanceMins?: number;
  confidence?: number;
  tasks: AgentTask[];
  // Level 2/3 enrichment
  role: string;
  specialty: string;
  region: string;
  rating: number;
  dealsClosed: number;
  avgResponseMin: number;
  freeSlots: string[];
  schedule: ScheduleSlot[];
  insights: string[];
  focusScore: number;
  statusContext: string;
  skills: string[];
  lastActive: string;
  lastUpdateSent: string;
}

export const teamAvailability: TeamMember[] = [
  {
    id: 'jessica',
    name: 'Jessica Moore',
    email: 'jessica.moore@brokerage.com',
    initials: 'JM',
    status: 'Available',
    capacity: 18,
    recommended: true,
    nextAvailable: '11:30 AM',
    revenue: 84000,
    luxuryConversion: 82,
    distanceMins: 12,
    confidence: 94,
    tasks: [
      { label: 'Buyer Follow-up', done: true },
      { label: 'Listing Photos', done: true },
      { label: 'Property Visit', done: false },
      { label: 'Contract Review', done: false }
    ],
    role: "Senior Buyer's Agent",
    specialty: 'Luxury Specialist',
    region: 'Austin Region',
    rating: 5,
    dealsClosed: 8,
    avgResponseMin: 6,
    freeSlots: ['11:30', '2:30', '4:30'],
    schedule: [
      { time: '09:30', label: 'Buyer Call', free: false },
      { time: '11:30', label: 'Free', free: true },
      { time: '12:00', label: 'Lunch', free: false },
      { time: '2:30', label: 'Free', free: true },
      { time: '5:00', label: 'Open', free: true }
    ],
    insights: [
      'Lowest workload',
      'Closest property',
      'Luxury Buyer Experience',
      'No conflicting meetings'
    ],
    focusScore: 94,
    statusContext: 'Available 11:30 AM',
    skills: ['Luxury', 'Buyer Rep', 'Austin'],
    lastActive: 'Today, 1:35 PM',
    lastUpdateSent: 'Yesterday, 8:12 AM'
  },
  {
    id: 'emily',
    name: 'Emily Clark',
    email: 'emily.clark@brokerage.com',
    initials: 'EC',
    status: 'Busy',
    capacity: 92,
    tasks: [
      { label: 'Closing Call Prep', done: true },
      { label: 'Paperwork Review', done: true },
      { label: 'Client Follow-up', done: true },
      { label: 'Listing Sync', done: true },
      { label: 'Inspection Scheduling', done: false },
      { label: 'Contract Draft', done: false }
    ],
    role: "Buyer's Agent",
    specialty: 'First-Time Buyers',
    region: 'Austin Region',
    rating: 4,
    dealsClosed: 5,
    avgResponseMin: 14,
    freeSlots: [],
    schedule: [
      { time: '09:00', label: 'Closing Call', free: false },
      { time: '11:00', label: 'Closing Call', free: false },
      { time: '2:00', label: 'Paperwork', free: false }
    ],
    insights: ['Closing 2 deals today', 'High current workload'],
    focusScore: 61,
    statusContext: 'Closing 2 Deals',
    skills: ['First-Time Buyers', 'Austin'],
    lastActive: 'Today, 12:50 PM',
    lastUpdateSent: 'Today, 9:05 AM'
  },
  {
    id: 'marcus',
    name: 'Marcus Webb',
    email: 'marcus.webb@brokerage.com',
    initials: 'MW',
    status: 'Closing',
    capacity: 98,
    role: 'Senior Listing Agent',
    specialty: 'Commercial',
    region: 'Austin Region',
    rating: 5,
    tasks: [
      { label: 'Final Walkthrough', done: true },
      { label: 'Title Transfer', done: true },
      { label: 'Closing Docs Signed', done: true },
      { label: 'Commission Split', done: true },
      { label: 'Client Handoff', done: true },
      { label: 'Listing Archive', done: true }
    ],
    dealsClosed: 11,
    avgResponseMin: 9,
    freeSlots: [],
    schedule: [
      { time: '10:00', label: 'Closing Today', free: false },
      { time: '3:00', label: 'Closing Today', free: false }
    ],
    insights: ['2 closings today', 'No free slots'],
    focusScore: 52,
    statusContext: 'Closing Today · 2',
    skills: ['Commercial', 'Listings', 'Austin'],
    lastActive: 'Today, 2:10 PM',
    lastUpdateSent: 'Today, 10:40 AM'
  },
  {
    id: 'daniel',
    name: 'Daniel Foster',
    email: 'daniel.foster@brokerage.com',
    initials: 'DF',
    status: 'Busy',
    capacity: 74,
    role: "Buyer's Agent",
    specialty: 'Relocation',
    region: 'Austin Region',
    rating: 4,
    tasks: [
      { label: 'Relocation Packet', done: true },
      { label: 'Buyer Pre-approval', done: true },
      { label: 'Neighborhood Tour', done: true },
      { label: 'Meeting Prep 3PM', done: false },
      { label: 'Listing Comparison', done: false },
      { label: 'Follow-up Email', done: false }
    ],
    dealsClosed: 4,
    avgResponseMin: 11,
    freeSlots: ['5:00 PM'],
    schedule: [
      { time: '10:00', label: 'Listing Prep', free: false },
      { time: '3:00', label: 'Meeting', free: false },
      { time: '5:00', label: 'Free', free: true }
    ],
    insights: ['Meeting at 3 PM', 'Moderate workload'],
    focusScore: 68,
    statusContext: 'Meeting 3 PM',
    skills: ['Relocation', 'Austin'],
    lastActive: 'Today, 11:20 AM',
    lastUpdateSent: 'Yesterday, 4:30 PM'
  }
];

export interface AssignmentTask {
  title: string;
  priority: 'Low' | 'Medium' | 'High';
  durationMins: number;
  travelMins: number;
  confidence: number;
}

export const luxuryVisitTask: AssignmentTask = {
  title: 'Luxury Property Visit',
  priority: 'Medium',
  durationMins: 90,
  travelMins: 12,
  confidence: 94
};

// ponytail: one deterministic canned suggestion for the demo, not a real predictor
export const contractSuggestion =
  'Check this contract and validate it against our compliance checklist.';

export interface ValidationPointer {
  label: string;
  ok: boolean;
}

// ponytail: canned "inventory miss" reply — AI checks its own doc store before
// asking the user for anything, matching a real assistant's search-first order.
export const contractNotFound =
  "I checked the file inventory for the Oak Ave deal, but there's no contract document attached to this client's record yet. Please attach the contract file and I'll review it against the compliance checklist.";

export const contractValidation = {
  title: 'Contract Review Complete',
  summary:
    "The attached contract is properly formatted with no missing clauses or corrupted content. All required disclosures for the Oak Ave deal are present. The remaining blocker isn't the document — it's the buyer's attorney, who hasn't responded to the amendment email in 2 days.",
  pointers: [
    { label: 'All required disclosures present', ok: true },
    { label: 'Signature blocks intact, no missing pages', ok: true },
    { label: 'Clause language matches standard template', ok: true },
    { label: "Buyer's attorney hasn't responded to amendment email (2 days)", ok: false }
  ] satisfies ValidationPointer[]
};

export const contractFollowUpLabel = 'Follow up: Oak Ave contract — buyer attorney silent 2+ days';

// --- "Summarize yesterday" recap: title + narrative + status-tracked pointer rows ---

export type SummaryRowStatus = 'open' | 'assigned' | 'parked' | 'read';
export type SummaryBucket = 'completed' | 'carried' | 'parkable' | 'assignable';

export interface SummaryRow {
  id: string;
  bucket: SummaryBucket;
  label: string;
  context: string;
  impact: Impact;
  status: SummaryRowStatus;
  assigneeId?: string;
  dueDate?: string;
}

export const yesterdaySummary = {
  title: "Yesterday's Recap",
  lines: [
    'You closed out 2 items and kept most deals moving. Contract signatures on Oak Ave and the Pine Rd inspection are the two things still hanging over from yesterday.',
    "3 cold leads and the Birchwood photo update aren't urgent — safe to park without losing momentum.",
    "Marcus's coaching session and Lisa's tour scheduling don't need you specifically — good candidates to hand off."
  ]
};

export const initialSummaryRows: SummaryRow[] = [
  {
    id: 'sr-1',
    bucket: 'completed',
    label: 'Closed showing feedback for 456 Oak Ave',
    context: 'Buyer submitted offer same day',
    impact: 'medium',
    status: 'open'
  },
  {
    id: 'sr-2',
    bucket: 'completed',
    label: 'Sent contract amendments to Priya Sharma',
    context: 'Delivered before EOD deadline',
    impact: 'medium',
    status: 'open'
  },
  {
    id: 'sr-3',
    bucket: 'carried',
    label: 'Buyer signature still pending — Oak Ave',
    context: 'Carried into today, no response overnight',
    impact: 'high',
    status: 'open'
  },
  {
    id: 'sr-4',
    bucket: 'carried',
    label: 'Inspection report for 789 Pine Rd unread',
    context: 'Landed 6pm yesterday, needs your review',
    impact: 'medium',
    status: 'open'
  },
  {
    id: 'sr-5',
    bucket: 'parkable',
    label: 'Follow up with 3 cold leads from Jul 28',
    context: 'No urgency, safe to defer a few days',
    impact: 'low',
    status: 'open'
  },
  {
    id: 'sr-6',
    bucket: 'parkable',
    label: 'Update MLS photos for 214 Birchwood',
    context: 'Listing already active, cosmetic only',
    impact: 'low',
    status: 'open'
  },
  {
    id: 'sr-7',
    bucket: 'assignable',
    label: 'Coach Marcus on stalled negotiation',
    context: "Outside today's calendar — better for a senior agent",
    impact: 'medium',
    status: 'open'
  },
  {
    id: 'sr-8',
    bucket: 'assignable',
    label: 'Schedule Lisa Thompson property tour',
    context: 'Routine buyer follow-up, any agent can run it',
    impact: 'medium',
    status: 'open'
  }
];

export const morningBrief = {
  greetingName: 'Sarah',
  date: 'Friday, Jul 31',
  yesterdayDealsClosed: 3,
  contractsSigned: { count: 2, worth: 72400 },
  newLeads: { count: 7, deltaPct: 40 },
  agentShoutout: { name: 'Emily', commission: 18500 },
  needsAttention: 5
};

export interface KpiMetric {
  id: string;
  label: string;
  value: string;
  delta?: string;
  subline?: string;
  trend?: 'up' | 'down';
  sparkline: number[];
  action?: string;
}

export const kpiMetrics: KpiMetric[] = [
  {
    id: 'needs-attention',
    label: 'Pending Assignments',
    value: '5',
    delta: '2 High Priority',
    trend: 'up',
    sparkline: [4, 5, 6, 5, 7, 9, 5]
  },
  {
    id: 'deals-at-risk',
    label: 'Closings Today',
    value: '8',
    delta: '$1.8M',
    trend: 'up',
    sparkline: [2, 3, 3, 4, 5, 6, 8]
  },
  {
    id: 'team-capacity',
    label: 'Team Capacity',
    value: '19 / 22',
    delta: '87% utilized',
    subline: '3 Available',
    trend: 'up',
    sparkline: [14, 15, 16, 17, 17, 18, 19]
  },
  {
    id: 'ai-opportunities',
    label: 'Leo Suggestions',
    value: '7',
    delta: 'Ready to Assign',
    trend: 'up',
    sparkline: [9, 12, 14, 17, 19, 21, 7],
    action: 'Create Follow-up Campaign'
  }
];

export interface FeedEvent {
  id: string;
  actor: string;
  action: string;
  timeAgo: string;
  isNew?: boolean;
}

export const liveFeed: FeedEvent[] = [
  { id: 'feed-1', actor: 'Emily', action: 'responded to 14 buyers', timeAgo: '10m ago' },
  { id: 'feed-2', actor: 'System', action: 'Offer accepted on 456 Oak Ave', timeAgo: '25m ago' },
  { id: 'feed-3', actor: 'System', action: 'Inspection delayed on 789 Pine Rd', timeAgo: '1h ago' },
  { id: 'feed-4', actor: 'Marcus', action: 'updated contract', timeAgo: '2h ago' },
  { id: 'feed-5', actor: 'System', action: 'New lead: John Anderson', timeAgo: '2h ago' }
];

export interface ScheduleEvent {
  id: string;
  time: string;
  title: string;
  meta: string;
}

export const todaysSchedule: ScheduleEvent[] = [
  { id: 'sch-1', time: '10:00', title: 'Eng standup', meta: 'Daily · 15m' },
  { id: 'sch-2', time: '11:30', title: '1:1 with Maya', meta: 'Weekly · 30m' },
  { id: 'sch-3', time: '14:00', title: 'Design crit', meta: 'Squad · 45m' },
  { id: 'sch-4', time: '16:00', title: 'Customer call: BigCorp', meta: 'Sales · 30m' }
];

// --- Unified Schedule panel: meetings + personal/assignable todos, keyed by date ---

export type SchedulePriority = 'Low' | 'Medium' | 'High';
export type ScheduleColor = 'blue' | 'amber' | 'violet' | 'emerald' | 'rose';

export interface MeetingItem {
  id: string;
  title: string;
  subtitle: string;
  time: string;
  timeRange: string;
  color: ScheduleColor;
  date: string;
}

export interface TodoItem {
  id: string;
  label: string;
  assigneeId: string;
  createdBy: string;
  priority: SchedulePriority;
  done: boolean;
  dueDate: string;
}

export const currentUser = { id: 'sarah', name: 'Sarah', initials: 'S' };

// anchors the day-strip; keeps the existing demo "today" used across the shell
export const scheduleToday = '2025-07-31';

export const meetings: MeetingItem[] = [
  {
    id: 'mt-1',
    title: 'Team Standup',
    subtitle: '9:30 - 10:00 AM',
    time: '9:30 AM',
    timeRange: '9:30 - 10:00 AM',
    color: 'blue',
    date: scheduleToday
  },
  {
    id: 'mt-2',
    title: 'Property Showing',
    subtitle: '11:00 - 12:00 PM',
    time: '11:00 AM',
    timeRange: '11:00 - 12:00 PM',
    color: 'amber',
    date: scheduleToday
  },
  {
    id: 'mt-3',
    title: 'Contract Review',
    subtitle: '2:00 - 3:00 PM',
    time: '2:00 PM',
    timeRange: '2:00 - 3:00 PM',
    color: 'rose',
    date: scheduleToday
  }
];

export const todos: TodoItem[] = [
  {
    id: 'td-1',
    label: "Review Maya's audit log PR",
    assigneeId: 'sarah',
    createdBy: 'sarah',
    priority: 'Medium',
    done: false,
    dueDate: scheduleToday
  },
  {
    id: 'td-2',
    label: 'Sketch onboarding step 2',
    assigneeId: 'sarah',
    createdBy: 'sarah',
    priority: 'Low',
    done: false,
    dueDate: scheduleToday
  },
  {
    id: 'td-3',
    label: 'Prep luxury listing photos',
    assigneeId: 'jessica',
    createdBy: 'sarah',
    priority: 'High',
    done: false,
    dueDate: scheduleToday
  },
  {
    id: 'td-4',
    label: 'Confirm inspector for 88 Maple Court',
    assigneeId: 'marcus',
    createdBy: 'sarah',
    priority: 'Medium',
    done: true,
    dueDate: scheduleToday
  }
];

// --- Story 2: Deal Investigation ---

export interface InvestigationStep {
  id: string;
  label: string;
  status: 'done' | 'blocked' | 'waiting';
}

export interface Investigation {
  id: string;
  query: string;
  buyerName: string;
  summary: string;
  steps: InvestigationStep[];
  actions: string[];
}

export const investigations: Investigation[] = [
  {
    id: 'inv-michael',
    query: "Why is Michael's deal delayed?",
    buyerName: 'Michael Brown',
    summary:
      'Inspection failed on 3/14. Lender has not submitted updated documents since. Your last email to the buyer went unanswered for 4 days.',
    steps: [
      { id: 'step-1', label: 'Inspection failed — foundation flagged', status: 'done' },
      { id: 'step-2', label: "Lender hasn't submitted documents", status: 'blocked' },
      { id: 'step-3', label: 'Buyer email unanswered (4 days)', status: 'waiting' }
    ],
    actions: ['Call Lender', 'Send Reminder', 'Assign Transaction Coordinator']
  },
  {
    id: 'inv-risky-deals',
    query: 'Which deals need attention?',
    buyerName: 'Portfolio',
    summary:
      '4 deals need you directly today: an expiring offer, a stalled inspection, a seller counter, and a financing escalation.',
    steps: [
      { id: 'step-1', label: 'Sarah Johnson — offer expires in 2h', status: 'waiting' },
      { id: 'step-2', label: 'Michael Brown — inspection delayed', status: 'blocked' },
      { id: 'step-3', label: 'Emma Wilson — seller counter offer', status: 'waiting' }
    ],
    actions: ['Open Priority Queue', 'Assign Coordinator']
  }
];

export const promptSuggestions = [
  'Find risky deals',
  'Who can take a luxury visit?',
  'Summarize yesterday',
  'Refine follow-ups',
  'Review contracts'
];

// --- Story 3: AI Communication Automation ---

export interface CampaignSegment {
  id: string;
  label: string;
  recipients: number;
  subject: string;
  preview: string;
}

export const campaignSegments: CampaignSegment[] = [
  {
    id: 'luxury',
    label: 'Luxury',
    recipients: 4,
    subject: 'A private update on your search',
    preview:
      'Hi {{firstName}}, two off-market listings matching your criteria just opened up in the last 24 hours…'
  },
  {
    id: 'first-time',
    label: 'First-Time Buyers',
    recipients: 9,
    subject: "Let's take the next step together",
    preview:
      "Hi {{firstName}}, I know the process can feel overwhelming — here's exactly what happens next in your search…"
  },
  {
    id: 'investors',
    label: 'Investors',
    recipients: 6,
    subject: 'Cap rate opportunities this week',
    preview:
      'Hi {{firstName}}, 3 new multi-family listings just hit the market with strong cash-flow potential…'
  },
  {
    id: 'cold',
    label: 'Cold Leads',
    recipients: 4,
    subject: 'Still thinking about it?',
    preview:
      "Hi {{firstName}}, no pressure — just wanted to check in and see if anything's changed on your end…"
  }
];

// --- Story 4: Rescue At-Risk Deals ---

export type RescueReason = 'Financing' | 'Inspection' | 'Seller Silence' | 'Missing Documents';

export interface RescueDeal {
  id: string;
  clientName: string;
  address: string;
  reason: RescueReason;
  daysStalled: number;
  commissionAtRisk: number;
}

export const rescueDeals: RescueDeal[] = [
  {
    id: 'rescue-1',
    clientName: 'David Miller',
    address: '212 Birch Ln',
    reason: 'Financing',
    daysStalled: 6,
    commissionAtRisk: 21000
  },
  {
    id: 'rescue-2',
    clientName: 'Nina Alvarez',
    address: '88 Cedar Ct',
    reason: 'Financing',
    daysStalled: 4,
    commissionAtRisk: 15600
  },
  {
    id: 'rescue-3',
    clientName: 'Michael Brown',
    address: '789 Pine Rd',
    reason: 'Inspection',
    daysStalled: 5,
    commissionAtRisk: 24800
  },
  {
    id: 'rescue-4',
    clientName: 'Tom Reyes',
    address: '14 Willow Way',
    reason: 'Seller Silence',
    daysStalled: 7,
    commissionAtRisk: 19200
  },
  {
    id: 'rescue-5',
    clientName: 'Grace Kim',
    address: '501 Maple Ave',
    reason: 'Seller Silence',
    daysStalled: 3,
    commissionAtRisk: 31000
  },
  {
    id: 'rescue-6',
    clientName: 'Omar Farouk',
    address: '77 Elm St',
    reason: 'Missing Documents',
    daysStalled: 2,
    commissionAtRisk: 18700
  }
];

export const teamRoster = ['Emily', 'Marcus', 'Jessica', 'Daniel', 'Priya'];

// --- Right-rail L2 detail lists — arrow-button drill-downs off the KPI grid ---

export interface KpiDetailItem {
  id: string;
  label: string;
  meta: string;
  tag: string;
}

export const kpiDetails: Record<string, KpiDetailItem[]> = {
  'needs-attention': [
    {
      id: 'pa-1',
      label: 'Assign showing agent — 456 Oak Ave',
      meta: 'Buyer: James Carter',
      tag: 'High'
    },
    {
      id: 'pa-2',
      label: 'Assign closer — 88 Cedar Ct',
      meta: 'Financing contingency review',
      tag: 'High'
    },
    {
      id: 'pa-3',
      label: 'Assign follow-up — Lisa Thompson',
      meta: 'Hot lead, budget approved',
      tag: 'Medium'
    },
    {
      id: 'pa-4',
      label: 'Assign inspection coordinator — 789 Pine Rd',
      meta: 'Inspection delayed',
      tag: 'Medium'
    },
    {
      id: 'pa-5',
      label: 'Assign marketing refresh — 214 Birchwood',
      meta: 'Listing photos outdated',
      tag: 'Low'
    }
  ],
  'deals-at-risk': [
    { id: 'ct-1', label: '456 Oak Ave', meta: '$485,000', tag: '2:00 PM' },
    { id: 'ct-2', label: '88 Cedar Ct', meta: '$612,000', tag: '10:00 AM' },
    { id: 'ct-3', label: '789 Pine Rd', meta: '$398,000', tag: '11:30 AM' },
    { id: 'ct-4', label: '214 Birchwood Ln', meta: '$540,000', tag: '1:00 PM' },
    { id: 'ct-5', label: '501 Maple Ave', meta: '$725,000', tag: '3:30 PM' },
    { id: 'ct-6', label: '77 Elm St', meta: '$460,000', tag: '9:00 AM' },
    { id: 'ct-7', label: '14 Willow Way', meta: '$355,000', tag: '4:00 PM' },
    { id: 'ct-8', label: '620 Sunset Blvd', meta: '$890,000', tag: '5:00 PM' }
  ],
  'ai-opportunities': [
    {
      id: 'ls-1',
      label: 'Draft follow-up for 3 cold leads',
      meta: 'No contact since Jul 28',
      tag: 'Ready'
    },
    { id: 'ls-2', label: 'Auto-schedule inspection reminder', meta: '789 Pine Rd', tag: 'Ready' },
    { id: 'ls-3', label: 'Flag financing contingency risk', meta: '88 Cedar Ct', tag: 'Review' },
    {
      id: 'ls-4',
      label: 'Suggest price adjustment',
      meta: '214 Birchwood — 28 days on market',
      tag: 'Review'
    },
    {
      id: 'ls-5',
      label: 'Draft congratulations note',
      meta: 'Closed deal, 456 Oak Ave',
      tag: 'Ready'
    },
    {
      id: 'ls-6',
      label: 'Recommend luxury listing match',
      meta: "Fits Jessica's specialty",
      tag: 'Ready'
    },
    { id: 'ls-7', label: 'Compile weekly commission report', meta: 'Ready to send', tag: 'Ready' }
  ]
};

// --- Toolbar agent picker — lets the lead route a query to a specific specialist agent ---

export interface AiAgentOption {
  id: string;
  name: string;
  description: string;
}

export const aiAgents: AiAgentOption[] = [
  { id: 'crm-agent', name: 'CRM Agent', description: 'Client records, contacts, and pipeline' },
  {
    id: 'contract-agent',
    name: 'Contract Agent',
    description: 'Contract review and compliance checks'
  },
  { id: 'task-agent', name: 'Task Agent', description: 'Reminders, scheduling, and assignments' },
  {
    id: 'client-facing-agent',
    name: 'Client-Facing Agent',
    description: 'Drafts emails and messages to clients'
  },
  {
    id: 'listing-agent',
    name: 'Listing Agent',
    description: 'MLS listings, photos, and descriptions'
  },
  {
    id: 'transaction-agent',
    name: 'Transaction Coordinator Agent',
    description: 'Closing paperwork and deadlines'
  },
  {
    id: 'compliance-agent',
    name: 'Compliance Agent',
    description: 'Disclosures and regulatory checks'
  },
  { id: 'showing-agent', name: 'Showing Agent', description: 'Property tour scheduling' },
  {
    id: 'marketing-agent',
    name: 'Marketing Agent',
    description: 'Campaigns and listing promotion'
  },
  { id: 'commission-agent', name: 'Commission Agent', description: 'Payout and split calculations' }
];

export const defaultAgentId = 'crm-agent';

// ponytail: keyword routing mirrors isContractQuery/isTeamQuery — same detection,
// just also decides which agent's name shows in the reasoning trace. Only the 3
// agents with a real backing flow get auto-detected; the rest are manual-pick only.
export function detectAgentId(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('contract') || lower.includes('validate') || lower.includes('compliance')) {
    return 'contract-agent';
  }
  if (
    lower.includes('assign') ||
    lower.includes('available') ||
    lower.includes('team') ||
    lower.includes('luxury')
  ) {
    return 'task-agent';
  }
  return defaultAgentId;
}

// --- Client search → profile — "deal closed while you were away" scenario ---

export interface ClientContact {
  phone: string;
  email: string;
  address: string;
}

export interface Client {
  id: string;
  name: string;
  initials: string;
  clientId: string;
  status: 'active' | 'closed-won';
  contact: ClientContact;
  assignedAgentId: string;
  dealValue: number;
  commission: number;
  closeDate: string;
  timeline: DealStage[];
  documents: { label: string; type: 'photo' | 'contract' | 'doc' }[];
}

export const clients: Client[] = [
  {
    id: 'client-anderson',
    name: 'John Anderson',
    initials: 'JA',
    clientId: 'CL-10482',
    status: 'closed-won',
    contact: {
      phone: '(512) 555-0148',
      email: 'j.anderson@email.com',
      address: '620 Sunset Blvd, Austin, TX'
    },
    assignedAgentId: 'jessica',
    dealValue: 890000,
    commission: 26700,
    closeDate: 'Aug 1, 2025',
    timeline: [
      {
        title: 'Lead Captured',
        description: 'Inbound inquiry from the listing site.',
        status: 'done'
      },
      {
        title: 'Qualified',
        description: 'Pre-approved for $900K, toured 3 properties.',
        status: 'done'
      },
      {
        title: 'Offer & Contract',
        description: 'Offer accepted, contract signed the same week.',
        status: 'done'
      },
      {
        title: 'Inspection & Appraisal',
        description: 'Cleared with no major findings.',
        status: 'done'
      },
      {
        title: 'Closing',
        description: 'Closed this morning while you were away — full commission secured.',
        status: 'done'
      }
    ],
    documents: [
      { label: 'Signed Contract.pdf', type: 'contract' },
      { label: 'Closing Disclosure.pdf', type: 'doc' },
      { label: '620 Sunset Blvd — Listing Photo', type: 'photo' }
    ]
  }
];

export interface CompletedItem {
  id: string;
  icon: FocusItem['icon'];
  title: string;
  subline: string;
  summaryQuery: string;
  clientId: string;
}

export const completedFocus: CompletedItem[] = [
  {
    id: 'completed-1',
    icon: 'contracts',
    title: 'Closed: 620 Sunset Blvd',
    subline: 'Buyer: John Anderson',
    summaryQuery: "What happened with John Anderson's deal while I was away?",
    clientId: 'client-anderson'
  }
];

export const clientFoundResponse = {
  title: 'Deal Closed — 620 Sunset Blvd',
  summary:
    "Great news — the Anderson deal closed this morning while you were away. Jessica Moore ran point on the final walkthrough and signing, and full commission is secured. Here's the client record."
};

if (process.env.NODE_ENV !== 'production') {
  console.assert(rescueDeals.length === 6, 'rescueDeals must have exactly 6 entries for the demo');
  console.assert(todaysFocus.length === 5, 'todaysFocus must have exactly 5 entries for the demo');
  console.assert(
    campaignSegments.length === 4,
    'campaignSegments must have exactly 4 entries for the demo'
  );
}
