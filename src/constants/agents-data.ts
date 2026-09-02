// Static demo data for the AI Agents roster - 100+ AI workers supervised by the team lead.
// No backend - deterministically generated fixture data for the prototype.

export type AgentStatus = 'working' | 'idle' | 'blocked' | 'offline';

export type Agent = {
  id: string;
  name: string;
  department: string;
  role: string;
  status: AgentStatus;
  currentTask: string;
  tasksToday: number;
  successRate: number;
  model: string;
};

const departments = [
  {
    name: 'Lead & CRM',
    roles: ['Lead Qualifier', 'Inbound Router', 'CRM Enrichment', 'Cold Lead Reviver'],
    tasks: [
      'Scoring 22 inbound leads from Zillow',
      'Enriching contact records from MLS sync',
      'Re-engaging a 40-day cold buyer lead',
      'Routing a new lead to Priya Anand'
    ]
  },
  {
    name: 'Buyer & Seller Comms',
    roles: ['Follow-up Drafter', 'Showing Scheduler', 'Objection Handler', 'SMS Responder'],
    tasks: [
      'Drafting a follow-up for a buyer who viewed 6 listings',
      'Confirming a Saturday showing at 214 Birchwood',
      'Answering a financing question over SMS',
      'Sending a post-showing feedback request'
    ]
  },
  {
    name: 'Contracts & Compliance',
    roles: ['Contract Reviewer', 'Disclosure Checker', 'Signature Tracker', 'Risk Flagger'],
    tasks: [
      'Flagging a missing inspection clause',
      'Chasing an unsigned disclosure from a seller',
      'Cross-checking a contract against state addenda',
      'Escalating an expiring offer to the team lead'
    ]
  },
  {
    name: 'Listings & Marketing',
    roles: ['Listing Copywriter', 'Photo QA', 'Syndication Bot', 'Social Post Generator'],
    tasks: [
      'Writing MLS copy for 88 Maple Court',
      'Checking photo order against brand guidelines',
      'Pushing a new listing to Zillow and Redfin',
      'Scheduling an Instagram carousel for an open house'
    ]
  },
  {
    name: 'Transactions & Ops',
    roles: ['Closing Coordinator', 'Document Collector', 'Escrow Tracker', 'Task Assigner'],
    tasks: [
      'Chasing a title company for a payoff letter',
      'Collecting proof of funds from a buyer',
      'Tracking earnest money deposit status',
      'Reassigning an overdue inspection task'
    ]
  },
  {
    name: 'Analytics & Coaching',
    roles: ['Pipeline Analyst', 'Agent Performance Coach', 'Revenue Forecaster', 'Market Analyst'],
    tasks: [
      'Building this week’s pipeline health report',
      'Flagging a below-target close rate for review',
      'Recomputing the monthly revenue forecast',
      'Comparing days-on-market against the metro average'
    ]
  }
];

const firstNames = [
  'Nadia',
  'Theo',
  'Priya',
  'Marcus',
  'Elena',
  'Daniel',
  'Yuki',
  'Omar',
  'Ines',
  'Caleb',
  'Freya',
  'Mateo',
  'Zara',
  'Kenji',
  'Aisha',
  'Rowan',
  'Leila',
  'Soren',
  'Camila',
  'Idris',
  'Noor',
  'Felix',
  'Ana',
  'Jonah'
];

const lastInitials = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const modelPool = ['Leo-4', 'Leo-4 Mini', 'Leo-3.5 Turbo', 'Leo-Vision'];

function seededFloat(seed: number) {
  const x = Math.sin(seed * 999) * 10000;
  return x - Math.floor(x);
}

function buildAgent(index: number): Agent {
  const dept = departments[index % departments.length];
  const first = firstNames[index % firstNames.length];
  const last = lastInitials[Math.floor(index / firstNames.length) % lastInitials.length];
  const role = dept.roles[index % dept.roles.length];
  const task = dept.tasks[index % dept.tasks.length];
  const statusRoll = seededFloat(index);
  const status: AgentStatus =
    statusRoll < 0.62
      ? 'working'
      : statusRoll < 0.85
        ? 'idle'
        : statusRoll < 0.95
          ? 'blocked'
          : 'offline';

  return {
    id: `agent-${index + 1}`,
    name: `${first} ${last}.`,
    department: dept.name,
    role,
    status,
    currentTask:
      status === 'offline' ? 'Off shift' : status === 'idle' ? 'Awaiting next task' : task,
    tasksToday: Math.floor(seededFloat(index + 100) * 40) + 4,
    successRate: Math.round((0.82 + seededFloat(index + 200) * 0.17) * 1000) / 10,
    model: modelPool[index % modelPool.length]
  };
}

export const agents: Agent[] = Array.from({ length: 112 }, (_, i) => buildAgent(i));

export const agentDepartments = departments.map((d) => d.name);

export const agentFleetSummary = {
  total: agents.length,
  working: agents.filter((a) => a.status === 'working').length,
  idle: agents.filter((a) => a.status === 'idle').length,
  blocked: agents.filter((a) => a.status === 'blocked').length,
  offline: agents.filter((a) => a.status === 'offline').length,
  avgSuccessRate:
    Math.round((agents.reduce((sum, a) => sum + a.successRate, 0) / agents.length) * 10) / 10
};
