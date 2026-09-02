'use client';

import { useCallback, useRef } from 'react';
import { motion } from 'motion/react';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PlanContextPanel, type ActivePlan } from './plan-context-panel';
import { CriteriaPanel } from './criteria-panel';
import { TeamAvailabilityPanel } from './team-availability-panel';
import { AgentDetailPanel } from './agent-detail-panel';
import { KpiDetailPanel } from './kpi-detail-panel';
import { ClientProfilePanel } from './client-profile-panel';
import {
  kpiMetrics,
  kpiDetails,
  type FeedEvent,
  type TeamMember,
  type TodoItem,
  type SchedulePriority
} from '@/constants/command-centre-scenarios';

export type RailView =
  | 'default'
  | 'team'
  | 'member'
  | 'kpi-detail'
  | 'activity-log'
  | 'client'
  | 'criteria';

const ease = [0.23, 1, 0.32, 1] as const;
const MIN_WIDTH = 320;
const MAX_WIDTH = 640;

interface CommandCentreRailProps {
  feedEvents?: FeedEvent[];
  agents: TeamMember[];
  view: RailView;
  selectedAgentId: string | null;
  selectedKpiId: string | null;
  selectedClientId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBack: () => void;
  onSelectAgent: (id: string) => void;
  onAssignAgent: () => void;
  onOpenTeamAvailability: () => void;
  onOpenKpiDetail: (id: string) => void;
  onOpenActivityLog: () => void;
  onKpiItemClick: (label: string) => void;
  teamCapacityValue: string;
  teamCapacityDelta: string;
  availableAgents: string[];
  busyAgents: string[];
  todos: TodoItem[];
  onAddTodo: (label: string, assigneeId: string, priority: SchedulePriority) => void;
  onToggleTodo: (id: string) => void;
  plan: ActivePlan | null;
  onAdjustTeamSize: (delta: number) => void;
  onCycleBoothTier: () => void;
  selectedSummitId: string | null;
  width: number;
  onWidthChange: (width: number) => void;
}

export function CommandCentreRail({
  feedEvents,
  agents,
  view,
  selectedAgentId,
  selectedKpiId,
  selectedClientId,
  open,
  onOpenChange,
  onBack,
  onSelectAgent,
  onAssignAgent,
  onOpenTeamAvailability,
  onOpenKpiDetail,
  onOpenActivityLog,
  onKpiItemClick,
  teamCapacityValue,
  teamCapacityDelta,
  availableAgents,
  busyAgents,
  todos,
  onAddTodo,
  onToggleTodo,
  plan,
  onAdjustTeamSize,
  onCycleBoothTier,
  selectedSummitId,
  width,
  onWidthChange
}: CommandCentreRailProps) {
  const selectedAgent = agents.find((a) => a.id === selectedAgentId) ?? null;
  const selectedKpi = kpiMetrics.find((m) => m.id === selectedKpiId) ?? null;
  const dragState = useRef<{ startX: number; startWidth: number } | null>(null);

  const handleDragMove = useCallback(
    (e: PointerEvent) => {
      if (!dragState.current) return;
      const delta = dragState.current.startX - e.clientX;
      const next = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, dragState.current.startWidth + delta));
      onWidthChange(next);
    },
    [onWidthChange]
  );

  const handleDragEnd = useCallback(() => {
    dragState.current = null;
    window.removeEventListener('pointermove', handleDragMove);
    window.removeEventListener('pointerup', handleDragEnd);
    document.body.style.cursor = '';
  }, [handleDragMove]);

  const handleDragStart = useCallback(
    (e: React.PointerEvent) => {
      dragState.current = { startX: e.clientX, startWidth: width };
      document.body.style.cursor = 'col-resize';
      window.addEventListener('pointermove', handleDragMove);
      window.addEventListener('pointerup', handleDragEnd);
    },
    [width, handleDragMove, handleDragEnd]
  );

  return (
    <div
      className={cn(
        'relative h-full shrink-0 overflow-hidden border-l bg-card',
        !open && 'transition-[width] duration-[260ms] ease-[cubic-bezier(0.4,0,0.2,1)]'
      )}
      style={{ width: open ? width : 60 }}
    >
      {/* Drag handle — resizable width, like an artifact panel */}
      {open && (
        <div
          onPointerDown={handleDragStart}
          className='absolute top-0 left-0 z-10 h-full w-1.5 cursor-col-resize touch-none hover:bg-primary/30'
        />
      )}

      {/* Collapsed state */}
      {!open && (
        <button
          onClick={() => onOpenChange(true)}
          className='flex h-full w-[60px] cursor-pointer flex-col items-center justify-center gap-3 border-none bg-transparent text-muted-foreground transition-colors hover:text-primary'
        >
          <Icons.sparkles className='size-4' />
          <span
            className='text-[10px] font-semibold tracking-widest uppercase'
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            Plan
          </span>
          <Icons.chevronLeft className='size-3' />
        </button>
      )}

      {/* Expanded state */}
      {open && (
        <div className='flex h-full flex-col overflow-hidden' style={{ width }}>
          {/* Header — swaps between Analytics and contextual back nav */}
          <div className='flex shrink-0 items-center justify-between border-b px-4 py-3'>
            {view === 'default' ? (
              <div className='flex items-center gap-2'>
                <Icons.sparkles className='size-3.5 text-primary' />
                <span className='text-xs font-semibold'>Plan</span>
              </div>
            ) : (
              <Button
                size='sm'
                variant='ghost'
                className='h-7 gap-1.5 rounded-lg px-2 text-xs active:scale-[0.97]'
                onClick={onBack}
              >
                <Icons.chevronLeft className='size-3.5' />
                {view === 'member'
                  ? 'Member Details'
                  : view === 'client'
                    ? 'Client Details'
                    : view === 'criteria'
                      ? 'Summit Criteria'
                      : 'Plan'}
              </Button>
            )}
            <button
              type='button'
              aria-label='Collapse panel'
              onClick={() => onOpenChange(false)}
              className='cursor-pointer rounded bg-transparent p-1 text-muted-foreground transition-colors hover:text-foreground'
            >
              <Icons.panelRight className='size-3.5' />
            </button>
          </div>

          {view !== 'default' && view !== 'criteria' && (
            <div className='shrink-0 border-b px-4 py-2.5'>
              <span className='text-sm font-semibold'>
                {view === 'team' && 'Member Details'}
                {view === 'member' && selectedAgent?.name}
                {view === 'kpi-detail' && selectedKpi?.label}
                {view === 'activity-log' && 'Activity Log'}
                {view === 'client' && 'Client Profile'}
              </span>
            </div>
          )}

          {/* Content — sliding views */}
          <div className='relative flex-1 overflow-y-auto'>
            <>
              <motion.div
                key={view}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.18, ease }}
                className={view === 'default' ? 'h-full min-h-full' : undefined}
              >
                {view === 'default' && (
                  <PlanContextPanel
                    plan={plan}
                    onAdjustTeamSize={onAdjustTeamSize}
                    onCycleBoothTier={onCycleBoothTier}
                  />
                )}

                {view === 'team' && (
                  <TeamAvailabilityPanel agents={agents} onSelectAgent={onSelectAgent} />
                )}

                {view === 'member' && selectedAgent && (
                  <AgentDetailPanel agent={selectedAgent} todos={todos} onAssign={onAssignAgent} />
                )}

                {view === 'kpi-detail' && selectedKpiId && (
                  <KpiDetailPanel
                    items={kpiDetails[selectedKpiId] ?? []}
                    onItemClick={(item) => onKpiItemClick(item.label)}
                  />
                )}

                {view === 'activity-log' && (
                  <KpiDetailPanel
                    items={(feedEvents ?? []).map((e) => ({
                      id: e.id,
                      label: `${e.actor} ${e.action}`,
                      meta: e.timeAgo
                    }))}
                  />
                )}

                {view === 'client' && selectedClientId && (
                  <ClientProfilePanel
                    clientId={selectedClientId}
                    agents={agents}
                    onOpenAssignedAgent={onSelectAgent}
                  />
                )}

                {view === 'criteria' && selectedSummitId && (
                  <CriteriaPanel summitId={selectedSummitId} />
                )}
              </motion.div>
            </>
          </div>
        </div>
      )}
    </div>
  );
}
