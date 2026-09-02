'use client';

import { motion } from 'motion/react';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { DealTimeline } from './deal-timeline';
import { clients, type TeamMember } from '@/constants/command-centre-scenarios';

const ease = [0.23, 1, 0.32, 1] as const;

function fadeItem(delay: number) {
  return {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, ease, delay }
  };
}

const docIcon: Record<'photo' | 'contract' | 'doc', keyof typeof Icons> = {
  photo: 'media',
  contract: 'contracts',
  doc: 'post'
};

interface ClientProfilePanelProps {
  clientId: string;
  agents: TeamMember[];
  onOpenAssignedAgent: (agentId: string) => void;
}

export function ClientProfilePanel({
  clientId,
  agents,
  onOpenAssignedAgent
}: ClientProfilePanelProps) {
  const client = clients.find((c) => c.id === clientId);
  if (!client) return null;

  const assignedAgent = agents.find((a) => a.id === client.assignedAgentId);
  const isClosedWon = client.status === 'closed-won';

  return (
    <div className='space-y-4 px-4 py-4'>
      {/* Header */}
      <motion.div {...fadeItem(0)} className='flex items-start gap-3'>
        <div className='flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-base font-semibold text-primary'>
          {client.initials}
        </div>
        <div className='min-w-0 flex-1'>
          <div className='flex flex-wrap items-center gap-2'>
            <p className='text-base font-bold'>{client.name}</p>
            <span
              className={cn(
                'flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium',
                isClosedWon
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'bg-primary/10 text-primary'
              )}
            >
              {isClosedWon && <Icons.circleCheck className='size-3' />}
              {isClosedWon ? 'Closed — Won' : 'Active'}
            </span>
          </div>
          <p className='text-sm text-muted-foreground'>{client.clientId}</p>
        </div>
      </motion.div>

      {/* Deal summary — the completion banner */}
      {isClosedWon && (
        <motion.div
          {...fadeItem(0.05)}
          className='grid grid-cols-3 gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-center'
        >
          <div>
            <p className='text-[11px] text-muted-foreground'>Deal Value</p>
            <p className='font-mono text-sm font-bold'>${client.dealValue.toLocaleString()}</p>
          </div>
          <div>
            <p className='text-[11px] text-muted-foreground'>Commission</p>
            <p className='font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400'>
              ${client.commission.toLocaleString()}
            </p>
          </div>
          <div>
            <p className='text-[11px] text-muted-foreground'>Closed</p>
            <p className='font-mono text-sm font-bold'>{client.closeDate}</p>
          </div>
        </motion.div>
      )}

      {/* Contact */}
      <motion.div {...fadeItem(0.1)}>
        <div className='flex items-center justify-between border-b py-2.5'>
          <span className='flex items-center gap-2 text-sm text-muted-foreground'>
            <Icons.phone className='size-4' />
            Phone
          </span>
          <span className='text-sm font-semibold'>{client.contact.phone}</span>
        </div>
        <div className='flex items-center justify-between border-b py-2.5'>
          <span className='flex items-center gap-2 text-sm text-muted-foreground'>
            <Icons.send className='size-4' />
            Email
          </span>
          <span className='truncate text-sm font-semibold'>{client.contact.email}</span>
        </div>
        <div className='flex items-center justify-between py-2.5'>
          <span className='flex items-center gap-2 text-sm text-muted-foreground'>
            <Icons.listings className='size-4' />
            Property
          </span>
          <span className='truncate text-sm font-semibold'>{client.contact.address}</span>
        </div>
      </motion.div>

      {/* Assigned member */}
      {assignedAgent && (
        <motion.div {...fadeItem(0.15)}>
          <p className='mb-1.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase'>
            Assigned Member
          </p>
          <button
            type='button'
            onClick={() => onOpenAssignedAgent(assignedAgent.id)}
            className='flex w-full items-center gap-2.5 rounded-xl border bg-card px-3 py-2.5 text-left transition-colors hover:bg-muted/50'
          >
            <div className='flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary'>
              {assignedAgent.initials}
            </div>
            <div className='min-w-0 flex-1'>
              <p className='truncate text-sm font-medium'>{assignedAgent.name}</p>
              <p className='truncate text-xs text-muted-foreground'>{assignedAgent.role}</p>
            </div>
            <Icons.chevronRight className='size-3.5 shrink-0 text-muted-foreground' />
          </button>
        </motion.div>
      )}

      {/* Timeline */}
      <motion.div {...fadeItem(0.2)}>
        <p className='mb-1.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase'>
          Deal Timeline
        </p>
        <DealTimeline stages={client.timeline} />
      </motion.div>

      {/* Documents */}
      <motion.div {...fadeItem(0.25)}>
        <p className='mb-1.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase'>
          Documents
        </p>
        <div className='space-y-1 rounded-lg border p-1'>
          {client.documents.map((doc) => {
            const DocIcon = Icons[docIcon[doc.type]];
            return (
              <div
                key={doc.label}
                className='flex items-center gap-2.5 rounded-md px-2 py-1.5 hover:bg-muted/50'
              >
                <DocIcon className='size-4 shrink-0 text-muted-foreground' />
                <span className='min-w-0 flex-1 truncate text-sm'>{doc.label}</span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
