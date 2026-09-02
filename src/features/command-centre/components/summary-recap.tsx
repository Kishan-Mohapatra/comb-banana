'use client';

import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import type { SummaryRow, TeamMember } from '@/constants/command-centre-scenarios';

const ease = [0.23, 1, 0.32, 1] as const;

const bucketOrder: SummaryRow['bucket'][] = ['completed', 'carried', 'parkable', 'assignable'];

const bucketMeta: Record<SummaryRow['bucket'], { label: string; icon: keyof typeof Icons }> = {
  completed: { label: 'Completed', icon: 'circleCheck' },
  carried: { label: 'Carried into today', icon: 'warning' },
  parkable: { label: 'Can be parked', icon: 'clock' },
  assignable: { label: 'Better for someone else', icon: 'teams' }
};

function SummaryRowView({
  row,
  agents,
  onPark,
  onAssign,
  onMarkRead
}: {
  row: SummaryRow;
  agents: TeamMember[];
  onPark: (row: SummaryRow) => void;
  onAssign: (row: SummaryRow) => void;
  onMarkRead: (id: string) => void;
}) {
  const isRead = row.status === 'read';
  const isResolved = row.status === 'assigned' || row.status === 'parked';
  const assignee = row.assigneeId ? agents.find((a) => a.id === row.assigneeId) : undefined;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease }}
      className={cn(
        'flex items-start gap-2.5 rounded-lg px-2 py-1.5 transition-opacity',
        (isRead || isResolved) && 'opacity-60'
      )}
    >
      {isResolved ? (
        <Icons.circleCheck className='mt-0.5 size-4 shrink-0 text-emerald-500' />
      ) : (
        <span className='mt-1.5 size-1.5 shrink-0 rounded-full bg-muted-foreground/40' />
      )}

      <div className='min-w-0 flex-1'>
        <p className={cn('text-xs font-medium', (isRead || isResolved) && 'font-normal')}>
          {row.label}
        </p>
        <p className='text-[11px] text-muted-foreground'>
          {row.status === 'parked' && row.dueDate
            ? `Parked · due ${row.dueDate}`
            : row.status === 'assigned' && assignee
              ? `Assigned to ${assignee.name}`
              : row.context}
        </p>
      </div>

      {row.status === 'open' && row.bucket === 'parkable' && (
        <Button
          size='sm'
          variant='outline'
          className='h-6 shrink-0 rounded-md px-2 text-[11px] active:scale-[0.97]'
          onClick={() => onPark(row)}
        >
          Park
        </Button>
      )}
      {row.status === 'open' && row.bucket === 'assignable' && (
        <Button
          size='sm'
          variant='outline'
          className='h-6 shrink-0 rounded-md px-2 text-[11px] active:scale-[0.97]'
          onClick={() => onAssign(row)}
        >
          Assign
        </Button>
      )}
      {row.status === 'open' && (
        <button
          type='button'
          aria-label='Mark as read'
          onClick={() => onMarkRead(row.id)}
          className='mt-0.5 shrink-0 text-muted-foreground/50 hover:text-foreground'
        >
          <Icons.eyeOff className='size-3.5' />
        </button>
      )}
    </motion.div>
  );
}

export function SummaryRecap({
  rows,
  agents,
  onPark,
  onAssign,
  onMarkRead
}: {
  rows: SummaryRow[];
  agents: TeamMember[];
  onPark: (row: SummaryRow) => void;
  onAssign: (row: SummaryRow) => void;
  onMarkRead: (id: string) => void;
}) {
  return (
    <div className='space-y-3 pt-1'>
      {bucketOrder.map((bucket) => {
        const bucketRows = rows.filter((r) => r.bucket === bucket);
        if (bucketRows.length === 0) return null;
        const meta = bucketMeta[bucket];
        const Icon = Icons[meta.icon];
        return (
          <div key={bucket}>
            <div className='mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground'>
              <Icon className='size-3' />
              {meta.label}
              <span className='font-mono text-muted-foreground/60'>({bucketRows.length})</span>
            </div>
            <div className='space-y-0.5'>
              {bucketRows.map((row) => (
                <SummaryRowView
                  key={row.id}
                  row={row}
                  agents={agents}
                  onPark={onPark}
                  onAssign={onAssign}
                  onMarkRead={onMarkRead}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
