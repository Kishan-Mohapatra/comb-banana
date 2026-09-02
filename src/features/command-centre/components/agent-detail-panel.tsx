'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { band } from './workload-indicator';
import type { AgentStatus, TeamMember, TodoItem } from '@/constants/command-centre-scenarios';

const ease = [0.23, 1, 0.32, 1] as const;

function fadeItem(delay: number) {
  return {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, ease, delay }
  };
}

function soon(label: string) {
  toast.info(`${label} — coming soon.`, { id: `agent-action-${label}` });
}

const statusPill: Record<AgentStatus, { icon: keyof typeof Icons; className: string }> = {
  Available: {
    icon: 'circleCheck',
    className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
  },
  Busy: { icon: 'clock', className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
  Closing: { icon: 'sparkles', className: 'bg-violet-500/10 text-violet-600 dark:text-violet-400' },
  Assigned: { icon: 'circleCheck', className: 'bg-primary/10 text-primary' }
};

const dotPalette = ['bg-cyan-300', 'bg-amber-300', 'bg-violet-300', 'bg-emerald-300'];

function Stat({
  label,
  value,
  valueClassName
}: {
  label: string;
  value: string | number;
  valueClassName?: string;
}) {
  return (
    <div>
      <p className='text-[11px] text-muted-foreground'>{label}</p>
      <p className={cn('font-mono text-2xl font-bold tracking-tight', valueClassName)}>{value}</p>
    </div>
  );
}

const priorityDot: Record<TodoItem['priority'], string> = {
  Low: 'bg-emerald-400',
  Medium: 'bg-amber-400',
  High: 'bg-destructive'
};

function Row({
  icon,
  label,
  children
}: {
  icon: keyof typeof Icons;
  label: string;
  children: React.ReactNode;
}) {
  const Icon = Icons[icon];
  return (
    <div className='flex items-center justify-between border-b py-2.5 last:border-b-0'>
      <span className='flex items-center gap-2 text-sm text-muted-foreground'>
        <Icon className='size-4' />
        {label}
      </span>
      <span className='text-sm font-semibold'>{children}</span>
    </div>
  );
}

interface AgentDetailPanelProps {
  agent: TeamMember;
  todos: TodoItem[];
  onAssign: () => void;
}

export function AgentDetailPanel({ agent, todos, onAssign }: AgentDetailPanelProps) {
  const isAssigned = agent.status === 'Assigned';
  const [removed, setRemoved] = useState<Set<string>>(new Set());
  const pill = statusPill[agent.status];
  const StatusIcon = Icons[pill.icon];
  const tasks = agent.tasks.filter((t) => !removed.has(t.label));
  const reminders = todos.filter((t) => t.assigneeId === agent.id);
  const capacityBand = band(agent.capacity);

  return (
    <div className='space-y-4 px-4 py-4'>
      {/* Header */}
      <motion.div {...fadeItem(0)} className='flex items-start gap-3'>
        <div className='flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-base font-semibold text-primary'>
          {agent.initials}
        </div>
        <div className='min-w-0 flex-1'>
          <div className='flex flex-wrap items-center gap-2'>
            <p className='text-base font-bold'>{agent.name}</p>
            <span
              className={cn(
                'flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium',
                pill.className
              )}
            >
              <StatusIcon className='size-3' />
              {agent.status}
            </span>
          </div>
          <p className='text-sm text-muted-foreground'>{agent.role}</p>
        </div>
      </motion.div>

      {/* 3-stat row */}
      <motion.div {...fadeItem(0.05)} className='grid grid-cols-3 gap-2 border-y py-3'>
        <Stat label='Capacity' value={`${agent.capacity}%`} valueClassName={capacityBand.text} />
        <Stat label='Avg Response' value={`${agent.avgResponseMin}m`} />
        <Stat label='Focus Score' value={`${agent.focusScore}%`} />
      </motion.div>

      {/* Row list */}
      <motion.div {...fadeItem(0.1)}>
        <Row icon='calendar' label='Next Available'>
          {agent.nextAvailable ?? agent.freeSlots[0] ?? 'Fully booked'}
        </Row>
        <Row icon='clock' label='Last Active'>
          {agent.lastActive}
        </Row>
        <Row icon='sparkles' label='Last Update Sent'>
          {agent.lastUpdateSent}
        </Row>
        {agent.revenue !== undefined && (
          <Row icon='billing' label='Revenue Generated'>
            ${agent.revenue.toLocaleString()}
          </Row>
        )}
        <Row icon='contracts' label='Deals Closed'>
          {agent.dealsClosed}
        </Row>
        <div className='flex items-center justify-between py-2.5'>
          <span className='flex items-center gap-2 text-sm text-muted-foreground'>
            <Icons.palette className='size-4' />
            Skillset
          </span>
          <div className='flex flex-wrap justify-end gap-1.5'>
            {agent.skills.map((skill) => (
              <span
                key={skill}
                className='rounded-full border bg-muted/50 px-2 py-0.5 text-[11px] font-medium'
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Leo Insight */}
      {agent.insights.length > 0 && !isAssigned && (
        <motion.div
          {...fadeItem(0.15)}
          className='space-y-2 rounded-xl border border-primary/20 bg-primary/5 p-3'
        >
          <div className='flex items-center gap-1.5 text-xs font-semibold text-primary'>
            <Icons.sparkles className='size-3.5' />
            Leo Insight
          </div>
          <ul className='space-y-1 text-xs leading-relaxed text-foreground/80'>
            {agent.insights.map((line) => (
              <li key={line} className='flex gap-1.5'>
                <span className='text-primary'>•</span>
                {line}
              </li>
            ))}
          </ul>
          {agent.confidence !== undefined && (
            <div className='flex items-center gap-1.5 pt-0.5 text-xs text-muted-foreground'>
              Recommendation
              <span className='font-mono font-medium text-foreground'>{agent.confidence}%</span>
            </div>
          )}
        </motion.div>
      )}

      {/* Tasks — mirrors the reference card's "Projects" list */}
      {tasks.length > 0 && (
        <motion.div {...fadeItem(0.2)}>
          <div className='mb-1.5 flex items-center gap-1.5'>
            <span className='flex size-5 items-center justify-center rounded bg-muted text-[11px] font-semibold'>
              {tasks.length}
            </span>
            <span className='text-sm font-medium'>Tasks</span>
          </div>
          <div className='space-y-1 rounded-lg border p-1'>
            <AnimatePresence initial={false}>
              {tasks.map((task, i) => (
                <motion.div
                  key={task.label}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2, ease }}
                  className='flex items-center gap-2.5 rounded-md px-2 py-1.5 hover:bg-muted/50'
                >
                  <span
                    className={cn(
                      'size-2.5 shrink-0 rounded-full',
                      dotPalette[i % dotPalette.length]
                    )}
                  />
                  <span className='min-w-0 flex-1 truncate text-sm font-medium'>{task.label}</span>
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-[11px] font-medium',
                      task.done
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    )}
                  >
                    {task.done ? 'Complete' : 'Pending'}
                  </span>
                  <button
                    type='button'
                    aria-label={`Remove ${task.label}`}
                    className='flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-foreground hover:text-background'
                    onClick={() => setRemoved((prev) => new Set(prev).add(task.label))}
                  >
                    <Icons.minus className='size-3' />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* Personal reminders — assigned via the Schedule panel, read-only here */}
      {reminders.length > 0 && (
        <motion.div {...fadeItem(0.22)}>
          <div className='mb-1.5 flex items-center gap-1.5'>
            <Icons.checks className='size-3.5 text-muted-foreground' />
            <span className='text-sm font-medium'>Reminders</span>
          </div>
          <div className='space-y-1 rounded-lg border p-1'>
            {reminders.map((reminder) => (
              <div key={reminder.id} className='flex items-center gap-2.5 rounded-md px-2 py-1.5'>
                <Checkbox checked={reminder.done} disabled className='shrink-0' />
                <span
                  className={cn(
                    'min-w-0 flex-1 truncate text-sm',
                    reminder.done && 'text-muted-foreground line-through'
                  )}
                >
                  {reminder.label}
                </span>
                <span
                  className={cn('size-1.5 shrink-0 rounded-full', priorityDot[reminder.priority])}
                  title={`${reminder.priority} priority`}
                />
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Primary CTA */}
      <motion.div {...fadeItem(0.25)}>
        <Button
          size='sm'
          className='h-8 w-full rounded-lg text-xs active:scale-[0.97]'
          disabled={isAssigned}
          onClick={onAssign}
        >
          {isAssigned ? 'Assigned' : 'Assign Task'}
        </Button>
      </motion.div>

      {/* Footer — matches reference: Notes | Edit Settings */}
      <motion.div {...fadeItem(0.3)} className='flex gap-2 border-t pt-3'>
        <Button
          size='sm'
          variant='outline'
          className='h-8 flex-1 gap-1.5 rounded-lg text-xs active:scale-[0.97]'
          onClick={() => soon('Notes')}
        >
          <Icons.post className='size-3.5' />
          Notes
        </Button>
        <Button
          size='sm'
          variant='outline'
          className='h-8 flex-1 gap-1.5 rounded-lg text-xs active:scale-[0.97]'
          onClick={() => soon('Edit Settings')}
        >
          <Icons.settings className='size-3.5' />
          Edit Settings
        </Button>
      </motion.div>
    </div>
  );
}
