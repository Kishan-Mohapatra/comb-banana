'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { QueryHero } from './query-hero';
import { SummaryRecap } from './summary-recap';
import { MemberAssignControl } from './member-assign-control';
import { CommandCentreRail, type RailView } from './command-centre-rail';
import { type ActivePlan } from './plan-context-panel';
import { InlineQuestionnaire, type InlineQuestionnaireValues } from './inline-questionnaire';
import { SummitCriteriaCard } from './summit-criteria-card';
import { SummitGrid } from './summit-grid';
import { LeoPromptInput, type Attachment } from './leo-prompt-input';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { AssignTaskModal } from './assign-task-modal';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { useCurrentPersona } from '@/lib/stores/persona-store';
import {
  summits as summitCatalog,
  summitQueryPills,
  boothTierOptions,
  computeBudget
} from '@/constants/summit-data';
import {
  investigations,
  teamAvailability,
  liveFeed,
  luxuryVisitTask,
  contractValidation,
  contractNotFound,
  contractFollowUpLabel,
  yesterdaySummary,
  initialSummaryRows,
  todos as initialTodos,
  currentUser,
  scheduleToday,
  aiAgents,
  detectAgentId,
  clients,
  clientFoundResponse,
  type Investigation,
  type TeamMember,
  type FeedEvent,
  type TodoItem,
  type SchedulePriority,
  type SummaryRow
} from '@/constants/command-centre-scenarios';
import { InvestigateDrawer } from './investigate-drawer';
import {
  Reasoning,
  ReasoningTrigger,
  ReasoningContent,
  useReasoning
} from '@/components/ai-elements/reasoning';
import { Shimmer } from '@/components/ai-elements/shimmer';

// ─── Types ───────────────────────────────────────────────────────────────────

interface ReasoningStepState {
  label: string;
  description: string;
  status: 'complete' | 'active' | 'pending';
}

interface ReasoningTrace {
  summary: string;
  steps: ReasoningStepState[];
}

interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  status?: 'thinking' | 'analyzing' | 'creating' | 'done';
  reasoning?: ReasoningTrace;
  candidateIds?: string[];
  attachments?: Attachment[];
  contractCta?: boolean;
  title?: string;
  pointers?: { label: string; ok: boolean }[];
  summaryReady?: boolean;
  agentId?: string;
  clientCardId?: string;
  contractEmailSent?: boolean;
  contractKeptForLater?: boolean;
  contractAssignedTo?: string;
  summitCtaId?: string;
  summitCtaUsed?: boolean;
  questionnaireSummitId?: string;
  questionnaireDone?: boolean;
  criteriaSummitId?: string;
  summitGridIds?: string[];
}

interface GoalFlowState {
  step: 'business' | 'teamSize' | 'leads' | 'done';
  business?: string;
  teamSize?: string;
  leads?: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  goalFlow?: GoalFlowState;
}

// ─── Motion presets ──────────────────────────────────────────────────────────

const ease = [0.23, 1, 0.32, 1] as const;

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
};

const fadeUp = {
  hidden: { opacity: 0, y: 16, filter: 'blur(4px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease } }
};

const noMotion = {
  hidden: { opacity: 1, y: 0 },
  show: { opacity: 1, y: 0 }
};

const msgVariant = {
  hidden: { opacity: 0, y: 8, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease } }
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function findInvestigation(query: string): Investigation | null {
  return investigations.find((inv) => inv.query === query) ?? investigations[0];
}

function isTeamQuery(text: string): boolean {
  const lower = text.toLowerCase();
  return (
    lower.includes('who is free') ||
    lower.includes("who's free") ||
    lower.includes('available') ||
    lower.includes('team') ||
    lower.includes('assign') ||
    lower.includes('luxury') ||
    lower.includes('who can take')
  );
}

function isContractQuery(text: string, attachments?: Attachment[]): boolean {
  const lower = text.toLowerCase();
  return (
    (attachments?.length ?? 0) > 0 ||
    lower.includes('contract') ||
    lower.includes('validate') ||
    lower.includes('compliance')
  );
}

function nextDay(iso: string): string {
  return new Date(new Date(iso).getTime() + 86400000).toISOString().slice(0, 10);
}

function isSummaryQuery(text: string): boolean {
  const lower = text.toLowerCase();
  return lower.includes('yesterday') || lower.includes('summar');
}

function isClientQuery(text: string): boolean {
  const lower = text.toLowerCase();
  return lower.includes('anderson') || lower.includes('client');
}

// ponytail: staged priority (full name → full location → distinctive word) so a
// loose category token like "ai" can't out-rank an actual name/city match by array order.
function findMatchedSummit(text: string) {
  const lower = text.toLowerCase();
  const byName = summitCatalog.find((s) => lower.includes(s.name.toLowerCase()));
  if (byName) return byName;
  const byLocation = summitCatalog.find((s) => lower.includes(s.location.toLowerCase()));
  if (byLocation) return byLocation;
  return (
    summitCatalog.find((s) => {
      const words = `${s.name} ${s.location}`
        .toLowerCase()
        .split(/[\s,]+/)
        .filter((w) => w.length > 3 && w !== 'summit' && !/^\d+$/.test(w));
      return words.some((w) => lower.includes(w));
    }) ?? null
  );
}

function isSummitQuery(text: string): boolean {
  const lower = text.toLowerCase();
  return (
    findMatchedSummit(text) !== null ||
    lower.includes('summit') ||
    lower.includes('booth') ||
    lower.includes('cost') ||
    lower.includes('budget')
  );
}

function isGoalIntent(text: string): boolean {
  const lower = text.toLowerCase();
  return (
    lower.includes('lead gen') ||
    lower.includes('leadgen') ||
    lower.includes('generate leads') ||
    lower.includes('find leads')
  );
}

const clientStepDefs = [
  { label: 'Searching', description: 'Looking up the client record in the CRM.' },
  { label: 'Compiling', description: 'Pulling contact details, timeline, and assigned member.' },
  { label: 'Summarizing', description: 'Writing the summary of what happened.' }
];

// ponytail: KPI L2 rows aren't wired to real data yet — one canned "this is a demo" reply
// instead of pretending every row has a real backing flow.
const demoStepDefs = [
  { label: 'Looking into it', description: 'Checking what this item would pull up.' },
  { label: 'Drafting response', description: 'Preparing a placeholder for the demo.' }
];

const luxuryStepDefs = [
  {
    label: 'Searching tool',
    description: 'Scanning team calendars and task lists for open capacity.'
  },
  {
    label: 'Resource',
    description: 'Cross-checking capacity, confidence, and personal reminders per agent.'
  },
  { label: 'Compacting Search', description: 'Ranking candidates and drafting the recommendation.' }
];

// AI checks its own document inventory before asking the user for anything — search first, ask second.
const contractSearchStepDefs = [
  {
    label: 'Searching',
    description: 'Looking for an attached contract on the Oak Ave client record.'
  },
  {
    label: 'Checking inventory',
    description: 'Scanned the document store — no contract file found for this deal.'
  }
];

function contractStepDefs(attachments?: Attachment[]) {
  return [
    {
      label: 'Reading',
      description: `Parsed ${attachments![0].name} for structure and required fields.`
    },
    {
      label: 'Understanding',
      description:
        'Checked clauses, signature blocks, and disclosures against the compliance checklist.'
    },
    {
      label: 'Compacting',
      description: 'Cross-referenced the Oak Ave deal timeline to find the actual blocker.'
    }
  ];
}

const summitStepDefs = [
  { label: 'Searching', description: 'Checking the summit catalog and your saved plans.' },
  { label: 'Compiling', description: 'Pulling dates, booth pricing, and deadlines.' }
];

const summaryStepDefs = [
  {
    label: 'Reading',
    description: "Reviewing yesterday's activity across tasks, contracts, and messages."
  },
  {
    label: 'Grouping',
    description: 'Sorting by status — completed, carried over, parkable, or reassignable.'
  },
  { label: 'Summarizing', description: 'Writing the recap and pointer list.' }
];

// ponytail: one status-projection instead of duplicating the 3-step array at every timeout
function makeSteps(
  defs: { label: string; description: string }[],
  activeIndex: number
): ReasoningStepState[] {
  return defs.map((d, i) => ({
    ...d,
    status: i < activeIndex ? 'complete' : i === activeIndex ? 'active' : 'pending'
  }));
}

function titleFromFirstMessage(text: string): string {
  return text.length > 36 ? text.slice(0, 36) + '…' : text;
}

function isToday(timestamp: number): boolean {
  return new Date(timestamp).toDateString() === new Date().toDateString();
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function ThinkingIndicator({ status }: { status: string }) {
  const labels: Record<string, { icon: keyof typeof Icons; text: string }> = {
    thinking: { icon: 'brain', text: 'Thinking...' },
    analyzing: { icon: 'search', text: 'Analyzing your request...' }
  };
  const info = labels[status] ?? labels.thinking;
  const Icon = Icons[info.icon];

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease }}
      className='flex items-center gap-2.5 text-sm text-muted-foreground'
    >
      <Icon className='size-4 animate-pulse text-violet-400' />
      <span className='animate-pulse'>{info.text}</span>
      <Icons.loader className='size-3.5 animate-spin text-muted-foreground/50' />
    </motion.div>
  );
}

// emil-design-eng: one persistent Reasoning instance across thinking → done so its
// built-in duration timer is real, and it never auto-expands — the trigger caption
// is the only thing visible until the user chooses to inspect the trace.
// Chain-of-thought detail — one line per step, shown only once the trigger is expanded.
// https://elements.ai-sdk.dev/components/chain-of-thought
function ReasoningSteps({ steps }: { steps: ReasoningStepState[] }) {
  const { isOpen } = useReasoning();
  if (!isOpen) return null;

  return (
    <div className='mt-3 space-y-2.5 border-l pl-3'>
      {steps.map((step) => (
        <div key={step.label} className='flex items-start gap-2'>
          <span
            className={cn(
              'mt-0.5 flex size-3.5 shrink-0 items-center justify-center rounded-full',
              step.status === 'complete' && 'bg-emerald-500 text-emerald-50',
              step.status === 'active' && 'bg-primary text-primary-foreground',
              step.status === 'pending' && 'bg-muted text-muted-foreground'
            )}
          >
            {step.status === 'complete' ? (
              <Icons.check className='size-2.5' />
            ) : (
              <span className='size-1 rounded-full bg-current' />
            )}
          </span>
          <div className='min-w-0'>
            <p
              className={cn(
                'text-xs font-medium',
                step.status === 'pending' && 'text-muted-foreground/60'
              )}
            >
              {step.label}
            </p>
            <p className='text-[11px] text-muted-foreground'>{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ReasoningCaption({
  reasoning,
  done,
  agentName
}: {
  reasoning: ReasoningTrace;
  done: boolean;
  agentName?: string;
}) {
  const activeStep = reasoning.steps.find((s) => s.status === 'active') ?? reasoning.steps[0];

  return (
    <Reasoning isStreaming={!done} defaultOpen={false}>
      <ReasoningTrigger
        getThinkingMessage={(isStreaming, duration) =>
          isStreaming ? (
            <Shimmer duration={1.1}>
              {agentName ? `${agentName} — ${activeStep.label}` : activeStep.label}
            </Shimmer>
          ) : (
            <p>
              {agentName && <span className='font-medium text-foreground'>{agentName}</span>}
              {agentName ? ' · Thought for ' : 'Thought for '}
              {duration ?? 2} second{duration === 1 ? '' : 's'}
            </p>
          )
        }
      />
      <ReasoningContent>{reasoning.summary}</ReasoningContent>
      <ReasoningSteps steps={reasoning.steps} />
    </Reasoning>
  );
}

function AgentCandidateCard({
  agent,
  onDetails,
  onAssign
}: {
  agent: TeamMember;
  onDetails: () => void;
  onAssign: () => void;
}) {
  const isAssigned = agent.status === 'Assigned';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease }}
      className='flex items-center gap-3 rounded-xl border bg-card px-3.5 py-2.5'
    >
      <div className='flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary'>
        {agent.initials}
      </div>
      <div className='min-w-0 flex-1'>
        <p className='truncate text-sm font-semibold'>{agent.name}</p>
        <p className='truncate text-xs text-muted-foreground'>{agent.email}</p>
      </div>
      <div className='flex shrink-0 items-center gap-1.5'>
        <Button
          size='sm'
          variant='ghost'
          className='h-7 rounded-lg px-2.5 text-xs text-muted-foreground active:scale-[0.97]'
          onClick={onDetails}
        >
          Details
        </Button>
        <Button
          size='sm'
          variant='outline'
          className='h-7 rounded-lg px-2.5 text-xs active:scale-[0.97]'
          disabled={isAssigned}
          onClick={onAssign}
        >
          {isAssigned ? 'Assigned' : 'Assign now'}
        </Button>
      </div>
    </motion.div>
  );
}

function ClientResultCard({
  client,
  onDetails
}: {
  client: (typeof clients)[number];
  onDetails: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease }}
      className='flex items-center gap-3 rounded-xl border bg-card px-3.5 py-2.5'
    >
      <div className='flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary'>
        {client.initials}
      </div>
      <div className='min-w-0 flex-1'>
        <p className='truncate text-sm font-semibold'>{client.name}</p>
        <p className='truncate text-xs text-muted-foreground'>{client.clientId}</p>
      </div>
      {client.status === 'closed-won' && (
        <span className='shrink-0 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400'>
          Closed — Won
        </span>
      )}
      <Button
        size='sm'
        variant='ghost'
        className='h-7 shrink-0 rounded-lg px-2.5 text-xs text-muted-foreground active:scale-[0.97]'
        onClick={onDetails}
      >
        Details
      </Button>
    </motion.div>
  );
}

function ChatGroup({
  label,
  sessions,
  activeId,
  onSelect,
  defaultOpen
}: {
  label: string;
  sessions: ChatSession[];
  activeId: string | null;
  onSelect: (id: string) => void;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const reduced = useReducedMotion();

  if (sessions.length === 0) return null;

  return (
    <div>
      <button
        type='button'
        onClick={() => setOpen(!open)}
        className='flex w-full items-center gap-1.5 px-3 py-1.5 text-left text-[11px] font-medium text-muted-foreground hover:text-foreground'
      >
        <Icons.chevronRight
          className={cn('size-3 shrink-0 transition-transform duration-200', open && 'rotate-90')}
        />
        <span className='flex-1 tracking-wide uppercase'>{label}</span>
        <span className='tabular-nums text-muted-foreground/60'>{sessions.length}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.2, ease }}
            className='overflow-hidden'
          >
            {sessions.map((s) => (
              <button
                key={s.id}
                type='button'
                onClick={() => onSelect(s.id)}
                className={cn(
                  'flex w-full items-center gap-2 py-2 pr-3 pl-7 text-left text-xs transition-colors duration-150',
                  'hover:bg-muted/50',
                  activeId === s.id && 'bg-muted/70 font-medium'
                )}
              >
                <Icons.chat className='size-3.5 shrink-0 text-muted-foreground' />
                <span className='min-w-0 flex-1 truncate'>{s.title}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ChatHistoryPanel({
  sessions,
  activeId,
  onSelect,
  onNewChat,
  onBack,
  visible
}: {
  sessions: ChatSession[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  onBack: () => void;
  visible: boolean;
}) {
  const reduced = useReducedMotion();
  const todaySessions = sessions.filter((s) => isToday(s.createdAt));
  const olderSessions = sessions.filter((s) => !isToday(s.createdAt));

  return (
    <motion.div
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: visible ? 240 : 0, opacity: visible ? 1 : 0 }}
      transition={{ duration: reduced ? 0 : 0.2, ease }}
      className='shrink-0 overflow-hidden border-r bg-card/50'
    >
      <div className='flex h-full w-[240px] flex-col'>
        {/* Header */}
        <div className='flex items-center gap-2 border-b px-3 py-2.5'>
          <Button
            size='icon-sm'
            variant='ghost'
            className='shrink-0 text-muted-foreground active:scale-[0.97]'
            onClick={onBack}
            aria-label='Back to Command Centre'
          >
            <Icons.chevronLeft className='size-4' />
          </Button>
          <span className='flex-1 text-xs font-medium'>Chats</span>
          <Button
            size='sm'
            variant='ghost'
            className='h-6 gap-1 rounded-md px-2 text-[11px] text-muted-foreground active:scale-[0.97]'
            onClick={onNewChat}
          >
            <Icons.add className='size-3' />
            New
          </Button>
        </div>

        {/* Chat list — accordion grouped by recency */}
        <div className='flex-1 overflow-y-auto py-1.5'>
          {sessions.length === 0 ? (
            <p className='px-3 py-4 text-center text-xs text-muted-foreground/60'>No chats yet</p>
          ) : (
            <div className='space-y-1'>
              <ChatGroup
                label='Today'
                sessions={todaySessions}
                activeId={activeId}
                onSelect={onSelect}
                defaultOpen
              />
              <ChatGroup
                label='Older'
                sessions={olderSessions}
                activeId={activeId}
                onSelect={onSelect}
                defaultOpen={false}
              />
            </div>
          )}
        </div>

        {/* Back to command centre */}
        <div className='border-t px-3 py-2'>
          <Button
            size='sm'
            variant='ghost'
            className='h-7 w-full justify-start gap-2 rounded-lg px-2 text-xs text-muted-foreground active:scale-[0.97]'
            onClick={onBack}
          >
            <Icons.dashboard className='size-3.5' />
            Command Centre
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main shell ──────────────────────────────────────────────────────────────

export function CommandCentreShell() {
  const reduced = useReducedMotion();
  const item = reduced ? noMotion : fadeUp;
  const persona = useCurrentPersona();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [showLanding, setShowLanding] = useState(true);
  const [investigation, setInvestigation] = useState<Investigation | null>(null);
  const [panelHovered, setPanelHovered] = useState(false);
  const [feedEvents, setFeedEvents] = useState<FeedEvent[]>(liveFeed);

  // Interaction 02 — AI task assignment & dynamic context panel
  const [agents, setAgents] = useState<TeamMember[]>(teamAvailability);
  const [railOpen, setRailOpen] = useState(false);
  const [railWidth, setRailWidth] = useState(384);
  const [railView, setRailView] = useState<RailView>('default');
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [teamCapacityPct, setTeamCapacityPct] = useState(87);
  const [todos, setTodos] = useState<TodoItem[]>(initialTodos);
  const [previewAttachment, setPreviewAttachment] = useState<Attachment | null>(null);
  const [summaryRows, setSummaryRows] = useState<SummaryRow[]>(initialSummaryRows);
  const [selectedKpiId, setSelectedKpiId] = useState<string | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [activePlan, setActivePlan] = useState<ActivePlan | null>(null);
  const [selectedSummitId, setSelectedSummitId] = useState<string | null>(null);

  const activeSession = sessions.find((s) => s.id === activeSessionId) ?? null;
  const messages = activeSession?.messages ?? [];
  const hasChat = !showLanding && activeSession !== null;
  const isProcessing = messages.some((m) => m.role === 'ai' && m.status && m.status !== 'done');
  const selectedAgent = agents.find((a) => a.id === selectedAgentId) ?? null;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  // Switching demo accounts resets the session — a different account shouldn't
  // inherit the previous one's chat history or analytics-rail state.
  useEffect(() => {
    setSessions([]);
    setActiveSessionId(null);
    setShowLanding(true);
    setInvestigation(null);
    setRailOpen(false);
    setRailView('default');
    setActivePlan(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [persona.id]);

  const updateSessionMessages = useCallback(
    (sessionId: string, updater: (msgs: ChatMessage[]) => ChatMessage[]) => {
      setSessions((prev) =>
        prev.map((s) => (s.id === sessionId ? { ...s, messages: updater(s.messages) } : s))
      );
    },
    []
  );

  function startNewChat() {
    const id = `chat-${Date.now()}`;
    const session: ChatSession = { id, title: 'New chat', messages: [], createdAt: Date.now() };
    setSessions((prev) => [session, ...prev]);
    setActiveSessionId(id);
    setShowLanding(false);
    setInvestigation(null);
  }

  function goToLanding() {
    setShowLanding(true);
    setActiveSessionId(null);
    setInvestigation(null);
  }

  function selectSession(id: string) {
    setActiveSessionId(id);
    setShowLanding(false);
  }

  // ─── Dynamic context panel handlers ───────────────────────────────────────

  function handleRailBack() {
    setRailView((v) => (v === 'member' ? 'team' : 'default'));
  }

  function handleSelectAgent(id: string) {
    setSelectedAgentId(id);
    setRailView('member');
  }

  function openAgentDetail(id: string) {
    setSelectedAgentId(id);
    setRailView('member');
    setRailOpen(true);
  }

  function handleAssignAgentClick() {
    setAssignModalOpen(true);
  }

  function openTeamAvailability() {
    setRailView('team');
    setRailOpen(true);
  }

  function openKpiDetail(id: string) {
    setSelectedKpiId(id);
    setRailView('kpi-detail');
    setRailOpen(true);
  }

  function openActivityLog() {
    setRailView('activity-log');
    setRailOpen(true);
  }

  function handleKpiItemClick(label: string) {
    handleSubmit(`Tell me more about ${label}`, undefined, undefined, true);
  }

  function openClientProfile(clientId: string) {
    setSelectedClientId(clientId);
    setRailView('client');
    setRailOpen(true);
  }

  // ─── Summit query → participate / criteria → inline questionnaire → plan panel ──

  function openCriteriaDetail(summitId: string) {
    setSelectedSummitId(summitId);
    setRailView('criteria');
    setRailOpen(true);
  }

  function startGoalFlow(sessionId: string, text: string) {
    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: 'user', text };
    const aiMsg: ChatMessage = {
      id: `a-${Date.now()}`,
      role: 'ai',
      title: 'What is your business or product?',
      text: 'Answer will help us understand and narrow down the industry specifics.',
      status: 'done'
    };
    updateSessionMessages(sessionId, (msgs) => [...msgs, userMsg, aiMsg]);
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, goalFlow: { step: 'business' } } : s))
    );
  }

  function advanceGoalFlow(sessionId: string, step: 'business' | 'teamSize' | 'leads', text: string) {
    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: 'user', text };

    if (step === 'business') {
      const aiMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'ai',
        title: "What's your team size attending?",
        text: 'Helps size the right booth tier and travel budget for your group.',
        status: 'done'
      };
      updateSessionMessages(sessionId, (msgs) => [...msgs, userMsg, aiMsg]);
      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId ? { ...s, goalFlow: { step: 'teamSize', business: text } } : s
        )
      );
      return;
    }

    if (step === 'teamSize') {
      const aiMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'ai',
        title: 'What leads are you trying to find?',
        text: "Tells us which summits' audiences actually match — enterprise buyers, SMB, investors, or partners.",
        status: 'done'
      };
      updateSessionMessages(sessionId, (msgs) => [...msgs, userMsg, aiMsg]);
      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId
            ? { ...s, goalFlow: { ...(s.goalFlow ?? { step: 'business' }), step: 'leads', teamSize: text } }
            : s
        )
      );
      return;
    }

    // step === 'leads' — resolve with matching summits, ranked by fit
    const matches = [...summitCatalog].sort((a, b) => b.matchScore - a.matchScore).slice(0, 4);
    const aiMsg: ChatMessage = {
      id: `a-${Date.now()}`,
      role: 'ai',
      text: `Based on your goals, here are summits that fit best for lead gen targeting ${text}:`,
      status: 'done',
      summitGridIds: matches.map((m) => m.id)
    };
    updateSessionMessages(sessionId, (msgs) => [...msgs, userMsg, aiMsg]);
    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId
          ? { ...s, goalFlow: { ...(s.goalFlow ?? { step: 'teamSize' }), step: 'done', leads: text } }
          : s
      )
    );
  }

  function handleParticipateClick(summitId: string) {
    const summit = summitCatalog.find((s) => s.id === summitId);
    if (!summit) return;
    handleSubmit(`I want to participate in ${summit.name}`);
  }

  function handleCriteriaClick(summitId: string) {
    const summit = summitCatalog.find((s) => s.id === summitId);
    if (!summit) return;
    handleSubmit(`Show me the criteria details for ${summit.name}`);
  }

  function handleGeneratePlan(summitId: string, values: InlineQuestionnaireValues) {
    const summit = summitCatalog.find((s) => s.id === summitId);
    if (!summit) return;
    const budget = computeBudget(values.boothTier, values.teamSize);
    setActivePlan({ summit, goal: values.goal, teamSize: values.teamSize, boothTier: values.boothTier, budget });
    setRailView('default');
    setRailOpen(true);
    logFeed('Leo AI', `built a participation plan for ${summit.name}`);

    if (!activeSessionId) return;
    const doneMsg: ChatMessage = {
      id: `a-${Date.now()}`,
      role: 'ai',
      text: `Your plan for ${summit.name} is ready — check the panel on the right for the full budget and booth details.`,
      status: 'done'
    };
    updateSessionMessages(activeSessionId, (msgs) => [...msgs, doneMsg]);
  }

  function handleAdjustTeamSize(delta: number) {
    setActivePlan((prev) => {
      if (!prev) return prev;
      const teamSize = Math.max(1, Math.min(20, prev.teamSize + delta));
      return { ...prev, teamSize, budget: computeBudget(prev.boothTier, teamSize) };
    });
  }

  function handleCycleBoothTier() {
    setActivePlan((prev) => {
      if (!prev) return prev;
      const values = boothTierOptions.map((b) => b.value);
      const nextIndex = (values.indexOf(prev.boothTier) + 1) % values.length;
      const boothTier = values[nextIndex];
      toast.success(`Booth tier updated to ${boothTierOptions[nextIndex].label}`, {
        id: 'plan-booth-tier-update'
      });
      return { ...prev, boothTier, budget: computeBudget(boothTier, prev.teamSize) };
    });
  }

  function addTodo(label: string, assigneeId: string, priority: SchedulePriority) {
    setTodos((prev) => [
      ...prev,
      {
        id: `todo-${Date.now()}`,
        label,
        assigneeId,
        createdBy: currentUser.id,
        priority,
        done: false,
        dueDate: scheduleToday
      }
    ]);
  }

  function toggleTodo(id: string) {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  // ponytail: each contract CTA is one-shot per message — mark it on the message
  // itself (not global state) so it disappears there and only there, once used.
  function handleContractFollowUpEmail(msgId: string) {
    if (!activeSessionId) return;
    updateSessionMessages(activeSessionId, (msgs) =>
      msgs.map((m) => (m.id === msgId ? { ...m, contractEmailSent: true } : m))
    );
    logFeed(currentUser.name, "sent a follow-up email to the buyer's attorney — Oak Ave contract");
    toast.success('Follow-up email drafted', {
      id: 'contract-followup-email',
      description: "Sent to buyer's attorney requesting a response on the amendment."
    });
  }

  function handleContractKeepForLater(msgId: string) {
    if (!activeSessionId) return;
    updateSessionMessages(activeSessionId, (msgs) =>
      msgs.map((m) => (m.id === msgId ? { ...m, contractKeptForLater: true } : m))
    );
    addTodo(contractFollowUpLabel, currentUser.id, 'High');
    logFeed(currentUser.name, `parked "${contractFollowUpLabel}" for later`);
    toast.success('Added to your list', {
      id: 'contract-keep-for-later',
      description: 'High priority reminder created in your Schedule checklist.'
    });
  }

  // Single-assignee rule: this sets/replaces the one assignee on the message, never adds a second.
  function assignContractMember(msgId: string, agentId: string) {
    if (!activeSessionId) return;
    const agent = agents.find((a) => a.id === agentId);
    if (!agent) return;
    updateSessionMessages(activeSessionId, (msgs) =>
      msgs.map((m) => (m.id === msgId ? { ...m, contractAssignedTo: agentId } : m))
    );
    logFeed(currentUser.name, `assigned the Oak Ave contract follow-up to ${agent.name}`);
    toast.success(`Assigned to ${agent.name}`, { id: `contract-assign-${msgId}` });
  }

  // ponytail: "Park" from the recap is the same bucket as contract's "Keep for Later" —
  // one backlog action, two entry points. Due date defaults silently, no picker.
  function parkRow(row: SummaryRow) {
    const dueDate = nextDay(scheduleToday);
    addTodo(row.label, currentUser.id, 'High');
    setSummaryRows((prev) =>
      prev.map((r) => (r.id === row.id ? { ...r, status: 'parked', dueDate } : r))
    );
    logFeed(currentUser.name, `parked "${row.label}" — due ${dueDate}`);
    toast.success('Parked to your backlog', {
      id: `park-${row.id}`,
      description: `Due ${dueDate}. Logged to Live Feed.`
    });
  }

  // ponytail: no candidate-ranking UI for backlog rows — auto-picks whoever has the
  // most open capacity right now, same scoring as the luxury-visit flow.
  function assignRow(row: SummaryRow) {
    const openTodos = (id: string) => todos.filter((t) => t.assigneeId === id && !t.done).length;
    const best = [...agents].sort(
      (a, b) => a.capacity + openTodos(a.id) * 8 - (b.capacity + openTodos(b.id) * 8)
    )[0];
    if (!best) return;
    setSummaryRows((prev) =>
      prev.map((r) => (r.id === row.id ? { ...r, status: 'assigned', assigneeId: best.id } : r))
    );
    logFeed(currentUser.name, `assigned "${row.label}" to ${best.name}`);
    toast.success(`Assigned to ${best.name}`, { id: `assign-row-${row.id}` });
  }

  function markRowRead(id: string) {
    setSummaryRows((prev) =>
      prev.map((r) => (r.id === id && r.status === 'open' ? { ...r, status: 'read' } : r))
    );
  }

  function logFeed(actor: string, action: string) {
    setFeedEvents((prev) => [
      { id: `feed-${Date.now()}`, actor, action, timeAgo: 'Just now', isNew: true },
      ...prev.map((e) => ({ ...e, isNew: false }))
    ]);
  }

  // ponytail: single assignment path shared by the modal-confirm flow (L3) and the
  // one-click "Assign now" chat card — both just mutate state + notify.
  function applyAssignment(agent: TeamMember) {
    setAgents((prev) =>
      prev.map((a) => (a.id === agent.id ? { ...a, status: 'Assigned', capacity: 42 } : a))
    );
    logFeed('Leo AI', `assigned ${agent.name} to ${luxuryVisitTask.title}`);
    setTeamCapacityPct((prev) => Math.min(prev + 5, 99));
    toast.success('Task Assigned Successfully', {
      id: `assign-success-${agent.id}`,
      description: `${agent.name} has been notified. Calendar updated. CRM updated.`
    });
  }

  function confirmAssignTask() {
    if (!selectedAgent) return;
    applyAssignment(selectedAgent);
    setAssignModalOpen(false);
    setTimeout(() => setRailView('default'), 500);
  }

  function assignAgentDirect(agentId: string) {
    const agent = agents.find((a) => a.id === agentId);
    if (!agent) return;
    applyAssignment(agent);
  }

  function handleSubmit(
    text: string,
    attachments?: Attachment[],
    agentId?: string,
    demoStub?: boolean
  ) {
    if (!text.trim() && !attachments?.length) return;

    let sessionId = activeSessionId;

    if (!sessionId || showLanding) {
      const id = `chat-${Date.now()}`;
      const session: ChatSession = {
        id,
        title: titleFromFirstMessage(text || attachments![0].name),
        messages: [],
        createdAt: Date.now()
      };
      setSessions((prev) => [session, ...prev]);
      setActiveSessionId(id);
      setShowLanding(false);
      sessionId = id;
    }

    // Goal-based conversational flow (scenario b) — intercepts everything else
    // while a follow-up question is pending, regardless of what the user types.
    const goalStep = sessionId === activeSessionId ? activeSession?.goalFlow?.step : undefined;
    if (goalStep && goalStep !== 'done') {
      advanceGoalFlow(sessionId, goalStep, text);
      return;
    }
    if (!demoStub && isGoalIntent(text)) {
      startGoalFlow(sessionId, text);
      return;
    }

    const resolvedAgentId = agentId ?? detectAgentId(text);
    const isLuxury = !demoStub && isTeamQuery(text);
    const isContract = !demoStub && !isLuxury && isContractQuery(text, attachments);
    const hasContractFile = isContract && (attachments?.length ?? 0) > 0;
    const isSummary = !demoStub && !isLuxury && !isContract && isSummaryQuery(text);
    const isClient = !demoStub && !isLuxury && !isContract && !isSummary && isClientQuery(text);
    const isSummit =
      !demoStub && !isLuxury && !isContract && !isSummary && !isClient && isSummitQuery(text);
    const hasReasoning = demoStub || isLuxury || isContract || isSummary || isClient || isSummit;
    const stepDefs = demoStub
      ? demoStepDefs
      : isContract
        ? hasContractFile
          ? contractStepDefs(attachments)
          : contractSearchStepDefs
        : isSummary
          ? summaryStepDefs
          : isClient
            ? clientStepDefs
            : isSummit
              ? summitStepDefs
              : luxuryStepDefs;

    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: 'user', text, attachments };
    const aiMsg: ChatMessage = {
      id: `a-${Date.now()}`,
      role: 'ai',
      text: '',
      status: 'thinking',
      agentId: resolvedAgentId,
      reasoning: hasReasoning
        ? {
            summary: `${stepDefs.map((d, i) => (i === 0 ? d.label : d.label.toLowerCase())).join(', ')}...`,
            steps: makeSteps(stepDefs, 0)
          }
        : undefined
    };

    // Set title from first message if session is new
    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId && s.title === 'New chat'
          ? { ...s, title: titleFromFirstMessage(text) }
          : s
      )
    );

    updateSessionMessages(sessionId, (msgs) => [...msgs, userMsg, aiMsg]);

    // ponytail: simulate AI reasoning states, replace with real streaming later
    setTimeout(() => {
      updateSessionMessages(sessionId!, (msgs) =>
        msgs.map((m) =>
          m.id === aiMsg.id
            ? {
                ...m,
                status: 'analyzing',
                reasoning: m.reasoning
                  ? { ...m.reasoning, steps: makeSteps(stepDefs, 1) }
                  : m.reasoning
              }
            : m
        )
      );
    }, 700);

    setTimeout(() => {
      updateSessionMessages(sessionId!, (msgs) =>
        msgs.map((m) =>
          m.id === aiMsg.id
            ? {
                ...m,
                status: 'creating',
                reasoning: m.reasoning
                  ? { ...m.reasoning, steps: makeSteps(stepDefs, 2) }
                  : m.reasoning
              }
            : m
        )
      );
    }, 1400);

    setTimeout(() => {
      if (isLuxury) {
        // ponytail: same simulated-AI pattern as the rest of this demo (no real model) —
        // open reminders nudge the ranking score and the shown confidence, so Leo's
        // pick visibly accounts for a candidate's personal to-do load, not just capacity.
        const openTodos = (id: string) =>
          todos.filter((t) => t.assigneeId === id && !t.done).length;
        const candidates = [...agents]
          .sort((a, b) => a.capacity + openTodos(a.id) * 8 - (b.capacity + openTodos(b.id) * 8))
          .slice(0, 3);
        const top = candidates[0];
        const topOpenTodos = openTodos(top.id);
        const effectiveConfidence = Math.max(50, (top.confidence ?? 90) - topOpenTodos * 5);
        const reminderNote =
          topOpenTodos > 0
            ? `${topOpenTodos} open personal reminder${topOpenTodos === 1 ? '' : 's'}`
            : 'no open personal reminders';
        updateSessionMessages(sessionId!, (msgs) =>
          msgs.map((m) =>
            m.id === aiMsg.id
              ? {
                  ...m,
                  status: 'done',
                  text: `Based on AI analysis, I found the following 3 members who can take this task. ${top.name} is the best fit — ${top.capacity}% workload today.`,
                  candidateIds: candidates.map((c) => c.id),
                  reasoning: {
                    summary: `Checked ${agents.length} agents against today's task lists, calendars, and personal reminders. **${top.name}** — ${top.capacity}% workload, ${reminderNote}, ${effectiveConfidence}% confidence.`,
                    steps: makeSteps(stepDefs, 3)
                  }
                }
              : m
          )
        );
      } else if (isContract && hasContractFile) {
        updateSessionMessages(sessionId!, (msgs) =>
          msgs.map((m) =>
            m.id === aiMsg.id
              ? {
                  ...m,
                  status: 'done',
                  title: contractValidation.title,
                  text: contractValidation.summary,
                  pointers: contractValidation.pointers,
                  contractCta: true,
                  reasoning: {
                    summary: `Read ${attachments![0].name} — checked formatting, required clauses, and signature blocks. Cross-referenced the Oak Ave deal timeline for the actual blocker.`,
                    steps: makeSteps(stepDefs, 3)
                  }
                }
              : m
          )
        );
      } else if (isContract) {
        updateSessionMessages(sessionId!, (msgs) =>
          msgs.map((m) =>
            m.id === aiMsg.id
              ? {
                  ...m,
                  status: 'done',
                  text: contractNotFound,
                  reasoning: {
                    summary: 'Checked the Oak Ave deal record — no contract file is on file yet.',
                    steps: makeSteps(stepDefs, 3)
                  }
                }
              : m
          )
        );
      } else if (isSummary) {
        updateSessionMessages(sessionId!, (msgs) =>
          msgs.map((m) =>
            m.id === aiMsg.id
              ? {
                  ...m,
                  status: 'done',
                  title: yesterdaySummary.title,
                  text: yesterdaySummary.lines.join(' '),
                  summaryReady: true,
                  reasoning: {
                    summary:
                      'Grouped yesterday into completed, carried-over, parkable, and reassignable items.',
                    steps: makeSteps(stepDefs, 3)
                  }
                }
              : m
          )
        );
      } else if (isClient) {
        const client =
          clients.find((c) =>
            text.toLowerCase().includes(c.name.split(' ').pop()!.toLowerCase())
          ) ?? clients[0];
        updateSessionMessages(sessionId!, (msgs) =>
          msgs.map((m) =>
            m.id === aiMsg.id
              ? {
                  ...m,
                  status: 'done',
                  title: clientFoundResponse.title,
                  text: clientFoundResponse.summary,
                  clientCardId: client.id,
                  reasoning: {
                    summary: `Found ${client.name} in the CRM — pulled contact details, assigned member, and deal timeline.`,
                    steps: makeSteps(stepDefs, 3)
                  }
                }
              : m
          )
        );
      } else if (isSummit) {
        const matched = findMatchedSummit(text);
        const lowerText = text.toLowerCase();
        const wantsParticipate = matched && lowerText.includes('particip');
        const wantsCriteria = matched && !wantsParticipate && lowerText.includes('criteria');

        if (wantsParticipate) {
          updateSessionMessages(sessionId!, (msgs) =>
            msgs.map((m) =>
              m.id === aiMsg.id
                ? {
                    ...m,
                    status: 'done',
                    text: `Let's get some quick details to build your plan for ${matched!.name}.`,
                    questionnaireSummitId: matched!.id,
                    reasoning: {
                      summary: 'Starting the plan questionnaire for this summit.',
                      steps: makeSteps(stepDefs, 3)
                    }
                  }
                : m
            )
          );
        } else if (wantsCriteria) {
          updateSessionMessages(sessionId!, (msgs) =>
            msgs.map((m) =>
              m.id === aiMsg.id
                ? {
                    ...m,
                    status: 'done',
                    text: `Here's the criteria snapshot for ${matched!.name}.`,
                    criteriaSummitId: matched!.id,
                    reasoning: {
                      summary: `Pulled the participation criteria for ${matched!.name}.`,
                      steps: makeSteps(stepDefs, 3)
                    }
                  }
                : m
            )
          );
        } else if (matched) {
          updateSessionMessages(sessionId!, (msgs) =>
            msgs.map((m) =>
              m.id === aiMsg.id
                ? {
                    ...m,
                    status: 'done',
                    title: matched.name,
                    text: `${matched.name} runs ${matched.dates} in ${matched.location}. It's a ${matched.matchScore}% fit for your profile — booths start at $${matched.boothTiersFrom.toLocaleString()}, and the early-bird deadline is ${matched.earlyBirdDeadline}.`,
                    summitCtaId: matched.id,
                    reasoning: {
                      summary: `Matched "${matched.name}" in the summit catalog and pulled its current pricing and deadlines.`,
                      steps: makeSteps(stepDefs, 3)
                    }
                  }
                : m
            )
          );
        } else {
          const top = [...summitCatalog]
            .sort((a, b) => b.matchScore - a.matchScore)
            .slice(0, 2);
          updateSessionMessages(sessionId!, (msgs) =>
            msgs.map((m) =>
              m.id === aiMsg.id
                ? {
                    ...m,
                    status: 'done',
                    text: `That one isn't in your summit catalog yet. Closest matches right now: ${top
                      .map((s) => `${s.name} (${s.matchScore}% fit, from $${s.boothTiersFrom.toLocaleString()})`)
                      .join(' and ')}.`,
                    reasoning: {
                      summary: 'No catalog match — surfaced the top-scoring summits instead.',
                      steps: makeSteps(stepDefs, 3)
                    }
                  }
                : m
            )
          );
        }
      } else if (demoStub) {
        updateSessionMessages(sessionId!, (msgs) =>
          msgs.map((m) =>
            m.id === aiMsg.id
              ? {
                  ...m,
                  status: 'done',
                  text: `This is a demo interaction — "${text}" isn't wired to real data yet. We'll build this out for production once the demo is finalized.`,
                  reasoning: {
                    summary: 'This row is a placeholder for the demo, not a real lookup yet.',
                    steps: makeSteps(stepDefs, 3)
                  }
                }
              : m
          )
        );
      } else {
        const inv = findInvestigation(text);
        updateSessionMessages(sessionId!, (msgs) =>
          msgs.map((m) =>
            m.id === aiMsg.id
              ? {
                  ...m,
                  text:
                    inv?.summary ??
                    `Here's what I found for "${text}" — pulling live data from your CRM pipeline.`,
                  status: 'done'
                }
              : m
          )
        );
        setInvestigation(inv);
      }
    }, 2100);
  }

  return (
    <motion.div
      className='-mx-6 -mt-6 flex h-[calc(100vh-3.5rem)] overflow-hidden'
      variants={reduced ? undefined : stagger}
      initial='hidden'
      animate='show'
    >
      {/* Chat history panel — always active once a chat exists, hover-revealed */}
      {sessions.length > 0 && (
        <div
          className='relative z-10 flex shrink-0'
          onMouseEnter={() => setPanelHovered(true)}
          onMouseLeave={() => setPanelHovered(false)}
        >
          {/* Discoverable rail hint — always visible affordance */}
          <button
            type='button'
            aria-label='Open chat history'
            onClick={() => setPanelHovered(true)}
            className={cn(
              'flex w-8 shrink-0 flex-col items-center gap-2 border-r bg-card/30 pt-3 text-muted-foreground',
              'transition-opacity duration-150',
              panelHovered && 'pointer-events-none opacity-0'
            )}
          >
            <Icons.chat className='size-3.5' />
            {sessions.length > 0 && (
              <span className='rounded-full bg-primary/10 px-1 text-[10px] font-medium text-primary tabular-nums'>
                {sessions.length}
              </span>
            )}
          </button>
          <ChatHistoryPanel
            sessions={sessions}
            activeId={activeSessionId}
            onSelect={selectSession}
            onNewChat={startNewChat}
            onBack={goToLanding}
            visible={panelHovered}
          />
        </div>
      )}

      {/* Center content column */}
      <motion.div className='flex min-w-0 flex-1 flex-col overflow-hidden' variants={item}>
        {/* Top bar — only in chat mode. Plain conditional, not AnimatePresence
            (its exit transition was getting stuck and leaving this mounted). */}
        {hasChat && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            transition={{ duration: reduced ? 0 : 0.2, ease }}
            className='shrink-0 overflow-hidden'
          >
            <div className='flex items-center gap-2 px-4 py-2'>
              <Button
                size='sm'
                variant='ghost'
                className='h-7 gap-1.5 rounded-lg px-2.5 text-xs text-muted-foreground active:scale-[0.97]'
                onClick={goToLanding}
              >
                <Icons.chevronLeft className='size-3' />
                Command Centre
              </Button>
              <div className='flex-1' />
              <Button
                size='sm'
                variant='ghost'
                className='h-7 gap-1.5 rounded-lg px-2.5 text-xs text-muted-foreground active:scale-[0.97]'
                onClick={startNewChat}
              >
                <Icons.add className='size-3' />
                New Chat
              </Button>
            </div>
            {activeSession && (
              <div className='px-4 py-3'>
                <h2 className='truncate text-[28px] leading-tight font-semibold tracking-tight'>
                  {activeSession.title}
                </h2>
              </div>
            )}
          </motion.div>
        )}

        {/* Scrollable area */}
        <div
          ref={scrollRef}
          className='flex flex-1 flex-col items-center gap-5 overflow-y-auto px-8 pt-10 pb-6'
        >
          {/* Landing state — plain conditional, not AnimatePresence: its exit
              animation was getting stuck mid-flight, leaving the landing pills
              rendered on top of an active chat. Enter animation still applies. */}
          {showLanding && !hasChat && (
            <motion.div
              key='landing'
              className='flex w-full flex-1 flex-col items-center gap-5'
              variants={reduced ? undefined : stagger}
              initial='hidden'
              animate='show'
            >
              <motion.div variants={item} className='text-center' style={{ textWrap: 'balance' }}>
                <h1 className='text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl'>
                  {persona.greeting}
                </h1>
                <p className='mt-1.5 text-sm text-muted-foreground'>{persona.subline}</p>
              </motion.div>

              <motion.div variants={item} className='w-full max-w-3xl'>
                <QueryHero pills={summitQueryPills} onSelect={(text) => handleSubmit(text)} />
              </motion.div>

              <div className='flex-1' />
            </motion.div>
          )}

          {/* Default idle card — shown before the first message in a fresh chat */}
          {hasChat && messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease }}
              className='flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed px-6 py-10 text-center'
            >
              <div className='flex size-9 items-center justify-center rounded-full bg-primary/10'>
                <Icons.sparkles className='size-4 text-primary' />
              </div>
              <p className='text-sm font-medium'>Ask Leo anything</p>
              <p className='max-w-xs text-xs text-muted-foreground'>
                Deal risk, agent availability, contracts, or forecasts — Leo has context on all of
                it.
              </p>
            </motion.div>
          )}

          {/* Chat messages */}
          {hasChat && (
            <AnimatePresence mode='popLayout'>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  variants={msgVariant}
                  initial='hidden'
                  animate='show'
                  layout
                  className='w-full max-w-3xl'
                >
                  {msg.role === 'user' ? (
                    <div className='flex flex-col items-end gap-1.5'>
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className='flex flex-wrap justify-end gap-1.5'>
                          {msg.attachments.map((a) => (
                            <button
                              key={a.id}
                              type='button'
                              onClick={() => setPreviewAttachment(a)}
                              className='inline-flex items-center gap-1.5 rounded-lg border bg-card px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'
                            >
                              <Icons.page className='size-3.5' />
                              {a.name}
                            </button>
                          ))}
                        </div>
                      )}
                      {msg.text && (
                        <div className='max-w-[80%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm leading-relaxed text-primary-foreground'>
                          {msg.text}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className='flex gap-2.5'>
                      <div className='flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10'>
                        <Icons.sparkles className='size-3.5 text-primary' />
                      </div>
                      <div className='min-w-0 max-w-[85%] flex-1 space-y-2'>
                        {msg.reasoning ? (
                          <>
                            <ReasoningCaption
                              reasoning={msg.reasoning}
                              done={msg.status === 'done'}
                              agentName={aiAgents.find((a) => a.id === msg.agentId)?.name}
                            />
                            {msg.status === 'done' && (
                              <motion.div
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, ease }}
                                className='space-y-1.5'
                              >
                                {msg.title && <p className='text-sm font-semibold'>{msg.title}</p>}
                                <p className='text-sm leading-relaxed'>{msg.text}</p>
                              </motion.div>
                            )}
                            {msg.status === 'done' && msg.pointers && (
                              <ul className='space-y-1 pt-1'>
                                {msg.pointers.map((p) => (
                                  <li key={p.label} className='flex items-start gap-2 text-xs'>
                                    {p.ok ? (
                                      <Icons.circleCheck className='mt-0.5 size-3.5 shrink-0 text-emerald-500' />
                                    ) : (
                                      <Icons.warning className='mt-0.5 size-3.5 shrink-0 text-amber-500' />
                                    )}
                                    <span className={cn(!p.ok && 'text-foreground')}>
                                      {p.label}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            )}
                            {msg.status === 'done' && msg.summaryReady && (
                              <SummaryRecap
                                rows={summaryRows}
                                agents={agents}
                                onPark={parkRow}
                                onAssign={assignRow}
                                onMarkRead={markRowRead}
                              />
                            )}
                            {msg.status === 'done' &&
                              msg.clientCardId &&
                              (() => {
                                const client = clients.find((c) => c.id === msg.clientCardId);
                                if (!client) return null;
                                return (
                                  <div className='pt-1'>
                                    <ClientResultCard
                                      client={client}
                                      onDetails={() => openClientProfile(client.id)}
                                    />
                                  </div>
                                );
                              })()}
                            {msg.status === 'done' && msg.candidateIds && (
                              <div className='space-y-2 pt-1'>
                                {msg.candidateIds.map((id) => {
                                  const agent = agents.find((a) => a.id === id);
                                  if (!agent) return null;
                                  return (
                                    <AgentCandidateCard
                                      key={id}
                                      agent={agent}
                                      onDetails={() => openAgentDetail(id)}
                                      onAssign={() => assignAgentDirect(id)}
                                    />
                                  );
                                })}
                              </div>
                            )}
                            {msg.status === 'done' && msg.contractCta && (
                              <div className='flex flex-wrap items-center gap-2 pt-1'>
                                {!msg.contractEmailSent && (
                                  <Button
                                    size='sm'
                                    className='h-7 rounded-lg px-2.5 text-xs active:scale-[0.97]'
                                    onClick={() => handleContractFollowUpEmail(msg.id)}
                                  >
                                    Follow up via Email
                                  </Button>
                                )}
                                {!msg.contractKeptForLater && (
                                  <Button
                                    size='sm'
                                    variant='ghost'
                                    className='h-7 rounded-lg px-2.5 text-xs active:scale-[0.97]'
                                    onClick={() => handleContractKeepForLater(msg.id)}
                                  >
                                    Keep for Later
                                  </Button>
                                )}
                                <MemberAssignControl
                                  agents={agents}
                                  assignedId={msg.contractAssignedTo}
                                  onAssign={(agentId) => assignContractMember(msg.id, agentId)}
                                />
                              </div>
                            )}
                          </>
                        ) : msg.status && msg.status !== 'done' ? (
                          <ThinkingIndicator status={msg.status} />
                        ) : (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4, ease }}
                            className='space-y-1'
                          >
                            {msg.title && (
                              <h3 className='text-sm font-semibold'>{msg.title}</h3>
                            )}
                            <p className='text-muted-foreground text-sm leading-relaxed'>
                              {msg.text}
                            </p>
                          </motion.div>
                        )}
                        {msg.status === 'done' && msg.summitCtaId && !msg.summitCtaUsed && (
                          <div className='flex flex-wrap items-center gap-2 pt-1'>
                            <Button
                              size='sm'
                              className='h-7 rounded-lg px-2.5 text-xs active:scale-[0.97]'
                              onClick={() => {
                                if (!activeSessionId) return;
                                updateSessionMessages(activeSessionId, (msgs) =>
                                  msgs.map((m) =>
                                    m.id === msg.id ? { ...m, summitCtaUsed: true } : m
                                  )
                                );
                                handleParticipateClick(msg.summitCtaId!);
                              }}
                            >
                              I want to participate
                            </Button>
                            <Button
                              size='sm'
                              variant='ghost'
                              className='h-7 rounded-lg px-2.5 text-xs active:scale-[0.97]'
                              onClick={() => {
                                if (!activeSessionId) return;
                                updateSessionMessages(activeSessionId, (msgs) =>
                                  msgs.map((m) =>
                                    m.id === msg.id ? { ...m, summitCtaUsed: true } : m
                                  )
                                );
                                handleCriteriaClick(msg.summitCtaId!);
                              }}
                            >
                              Show criteria details
                            </Button>
                          </div>
                        )}
                        {msg.status === 'done' &&
                          msg.questionnaireSummitId &&
                          !msg.questionnaireDone &&
                          (() => {
                            const qSummit = summitCatalog.find(
                              (s) => s.id === msg.questionnaireSummitId
                            );
                            if (!qSummit) return null;
                            return (
                              <div className='pt-1'>
                                <InlineQuestionnaire
                                  summitName={qSummit.name}
                                  onSubmit={(values) => {
                                    if (activeSessionId) {
                                      updateSessionMessages(activeSessionId, (msgs) =>
                                        msgs.map((m) =>
                                          m.id === msg.id ? { ...m, questionnaireDone: true } : m
                                        )
                                      );
                                    }
                                    handleGeneratePlan(qSummit.id, values);
                                  }}
                                />
                              </div>
                            );
                          })()}
                        {msg.status === 'done' && msg.criteriaSummitId && (
                          <div className='pt-1'>
                            <SummitCriteriaCard
                              summitId={msg.criteriaSummitId}
                              onMoreDetails={() => openCriteriaDetail(msg.criteriaSummitId!)}
                            />
                          </div>
                        )}
                        {msg.status === 'done' && msg.summitGridIds && (
                          <div className='pt-1'>
                            <SummitGrid summitIds={msg.summitGridIds} />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Pinned AI input — no border, seamless */}
        <motion.div variants={item} className='shrink-0 px-8 pt-1 pb-5'>
          <div className='mx-auto w-full max-w-3xl'>
            <LeoPromptInput
              onSubmit={handleSubmit}
              processing={isProcessing}
              onCancel={() => {
                if (!activeSessionId) return;
                updateSessionMessages(activeSessionId, (msgs) =>
                  msgs.map((m) =>
                    m.role === 'ai' && m.status && m.status !== 'done'
                      ? { ...m, text: 'Cancelled.', status: 'done' }
                      : m
                  )
                );
              }}
            />
            <p className='mt-2 text-center text-[10px] text-muted-foreground/60'>
              Leo AI can make mistakes. Verify important information.
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Analytics rail — becomes the dynamic contextual workspace. Only shown once
          this account has done something on the platform; first-timers get the full-width center. */}
      {persona.hasActivity && (
        <motion.div variants={item}>
          <CommandCentreRail
            feedEvents={feedEvents}
            agents={agents}
            view={railView}
            selectedAgentId={selectedAgentId}
            selectedKpiId={selectedKpiId}
            selectedClientId={selectedClientId}
            open={railOpen}
            onOpenChange={setRailOpen}
            onBack={handleRailBack}
            onSelectAgent={handleSelectAgent}
            onAssignAgent={handleAssignAgentClick}
            onOpenTeamAvailability={openTeamAvailability}
            onOpenKpiDetail={openKpiDetail}
            onOpenActivityLog={openActivityLog}
            onKpiItemClick={handleKpiItemClick}
            teamCapacityValue={`${Math.round((teamCapacityPct / 100) * 22)} / 22`}
            teamCapacityDelta={`${teamCapacityPct}% utilized`}
            availableAgents={agents.filter((a) => a.status === 'Available').map((a) => a.name)}
            busyAgents={agents.filter((a) => a.status !== 'Available').map((a) => a.name)}
            todos={todos}
            onAddTodo={addTodo}
            onToggleTodo={toggleTodo}
            plan={activePlan}
            onAdjustTeamSize={handleAdjustTeamSize}
            onCycleBoothTier={handleCycleBoothTier}
            selectedSummitId={selectedSummitId}
            width={railWidth}
            onWidthChange={setRailWidth}
          />
        </motion.div>
      )}

      <InvestigateDrawer investigation={investigation} onClose={() => setInvestigation(null)} />

      <AssignTaskModal
        open={assignModalOpen}
        agent={selectedAgent}
        task={luxuryVisitTask}
        onCancel={() => setAssignModalOpen(false)}
        onConfirm={confirmAssignTask}
      />

      <Dialog
        open={!!previewAttachment}
        onOpenChange={(open) => !open && setPreviewAttachment(null)}
      >
        <DialogContent className='h-[85vh] w-full max-w-3xl overflow-hidden p-0 sm:max-w-3xl'>
          {previewAttachment && (
            <iframe
              src={previewAttachment.url}
              title={previewAttachment.name}
              sandbox=''
              className='size-full'
            />
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
