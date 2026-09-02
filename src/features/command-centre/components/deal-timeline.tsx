'use client';

import { motion } from 'motion/react';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import type { DealStage } from '@/constants/command-centre-scenarios';

const ease = [0.23, 1, 0.32, 1] as const;

const dot: Record<DealStage['status'], string> = {
  done: 'bg-emerald-500 text-emerald-50',
  current: 'bg-primary text-primary-foreground',
  upcoming: 'bg-muted text-muted-foreground'
};

export function DealTimeline({ stages }: { stages: DealStage[] }) {
  return (
    <div className='mb-3 space-y-0'>
      {stages.map((stage, i) => (
        <motion.div
          key={stage.title}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease, delay: i * 0.05 }}
          className='flex gap-2.5'
        >
          <div className='flex flex-col items-center'>
            <span
              className={cn(
                'flex size-5 shrink-0 items-center justify-center rounded-full',
                dot[stage.status]
              )}
            >
              <Icons.circleCheck className='size-3' />
            </span>
            {i < stages.length - 1 && <span className='w-px flex-1 bg-border' />}
          </div>
          <div className={cn('min-w-0 pb-3', stage.status === 'upcoming' && 'opacity-50')}>
            <p
              className={cn('text-xs font-semibold', stage.status === 'current' && 'text-primary')}
            >
              {stage.title}
              {stage.status === 'current' && ' — stuck here'}
            </p>
            <p className='text-[11px] text-muted-foreground'>{stage.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
