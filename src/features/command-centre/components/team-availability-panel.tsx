'use client';

import { motion } from 'motion/react';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { WorkloadIndicator } from './workload-indicator';
import type { TeamMember, AgentStatus } from '@/constants/command-centre-scenarios';

const ease = [0.23, 1, 0.32, 1] as const;

const statusColor: Record<AgentStatus, string> = {
  Available: 'text-emerald-600 dark:text-emerald-400',
  Busy: 'text-amber-600 dark:text-amber-400',
  Closing: 'text-violet-600 dark:text-violet-400',
  Assigned: 'text-primary'
};

const statusDot: Record<AgentStatus, string> = {
  Available: 'bg-emerald-500',
  Busy: 'bg-amber-500',
  Closing: 'bg-violet-500',
  Assigned: 'bg-primary'
};

interface TeamAvailabilityPanelProps {
  agents: TeamMember[];
  onSelectAgent: (id: string) => void;
}

export function TeamAvailabilityPanel({ agents, onSelectAgent }: TeamAvailabilityPanelProps) {
  return (
    <div className='divide-y'>
      {agents.map((agent, i) => (
        <motion.button
          key={agent.id}
          type='button'
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease, delay: i * 0.05 }}
          onClick={() => onSelectAgent(agent.id)}
          className='flex w-full items-start gap-3 px-4 py-3 text-left transition-colors duration-150 hover:bg-muted/50'
        >
          <div className='flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary'>
            {agent.initials}
          </div>
          <div className='min-w-0 flex-1'>
            <div className='flex items-center gap-1.5'>
              <span className='text-sm font-medium'>{agent.name}</span>
              {agent.recommended && (
                <Badge
                  variant='secondary'
                  className='h-4 gap-1 rounded-full px-1.5 text-[10px] font-medium'
                >
                  <Icons.sparkles className='size-2.5' />
                  Recommended
                </Badge>
              )}
            </div>
            <span
              className={cn(
                'flex items-center gap-1 text-xs font-medium',
                statusColor[agent.status]
              )}
            >
              <span className={cn('size-1.5 rounded-full', statusDot[agent.status])} />
              {agent.status}
            </span>
            <WorkloadIndicator capacity={agent.capacity} className='mt-1.5' />
            <div className='mt-1.5 flex items-center gap-3 text-[11px] text-muted-foreground'>
              <span>
                Tasks{' '}
                <span className='font-mono font-medium text-foreground'>
                  {agent.tasks.filter((t) => t.done).length} / {agent.tasks.length}
                </span>
              </span>
              <span>{agent.statusContext}</span>
              {agent.revenue !== undefined && (
                <span className='font-mono font-medium text-foreground'>
                  ${Math.round(agent.revenue / 1000)}K
                </span>
              )}
            </div>
          </div>
          <Icons.chevronRight className='mt-1 size-3.5 shrink-0 text-muted-foreground' />
        </motion.button>
      ))}
    </div>
  );
}
