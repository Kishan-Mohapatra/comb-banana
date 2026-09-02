'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import {
  todaysFocus,
  completedFocus,
  type FocusItem,
  type FocusStep,
  type CompletedItem
} from '@/constants/command-centre-scenarios';
import { DealTimeline } from './deal-timeline';

const dotColor: Record<FocusItem['impact'], string> = {
  high: 'bg-destructive',
  medium: 'bg-amber-500',
  low: 'bg-emerald-500'
};

const impactColor: Record<FocusItem['impact'], string> = {
  high: 'text-destructive',
  medium: 'text-amber-600 dark:text-amber-400',
  low: 'text-emerald-600 dark:text-emerald-400'
};

const impactLabel: Record<FocusItem['impact'], string> = {
  high: 'High impact',
  medium: 'Medium impact',
  low: 'Low impact'
};

const stepIcon: Record<FocusStep['status'], { icon: keyof typeof Icons; color: string }> = {
  done: { icon: 'circleCheck', color: 'text-emerald-500' },
  blocked: { icon: 'warning', color: 'text-destructive' },
  waiting: { icon: 'clock', color: 'text-amber-500' }
};

const ease = [0.23, 1, 0.32, 1] as const;

function isAssignAction(action: string): boolean {
  return action.toLowerCase().includes('assign');
}

function isReviewContractAction(action: string): boolean {
  return action === 'Review Contract';
}

interface TodaysFocusProps {
  onAssignRequest?: (item: FocusItem) => void;
  onReviewContract?: (item: FocusItem) => void;
  onCompletedClick?: (item: CompletedItem) => void;
}

export function TodaysFocus({
  onAssignRequest,
  onReviewContract,
  onCompletedClick
}: TodaysFocusProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const reduced = useReducedMotion();

  function toggle(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  return (
    <div>
      <h2 className='mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase'>
        Today&apos;s Focus
      </h2>
      <div className='overflow-hidden rounded-xl border bg-card'>
        {todaysFocus.map((item, i) => {
          const isOpen = expandedId === item.id;
          const Icon = Icons[item.icon];
          return (
            <div key={item.id} className={cn(i < todaysFocus.length - 1 && 'border-b')}>
              {/* Row header */}
              <button
                type='button'
                onClick={() => toggle(item.id)}
                className={cn(
                  'flex w-full items-center gap-3 px-4 py-3 text-left transition-colors duration-150',
                  'hover:bg-muted/50',
                  isOpen && 'bg-muted/30'
                )}
              >
                <span className={cn('size-2 shrink-0 rounded-full', dotColor[item.impact])} />
                <Icon className='size-4 shrink-0 text-muted-foreground' />
                <div className='min-w-0 flex-1'>
                  <span className='text-sm font-medium'>{item.title}</span>
                  <span className='ml-2 text-xs text-muted-foreground'>{item.subline}</span>
                </div>
                <span
                  className={cn(
                    'hidden shrink-0 text-[11px] font-medium sm:inline',
                    impactColor[item.impact]
                  )}
                >
                  {impactLabel[item.impact]}
                </span>
                <span className='shrink-0 font-mono text-[11px] text-muted-foreground'>
                  {item.dueIn}
                </span>
                <Icons.chevronRight
                  className={cn(
                    'size-3.5 shrink-0 text-muted-foreground transition-transform duration-200',
                    isOpen && 'rotate-90'
                  )}
                />
              </button>

              {/* Expanded detail */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: reduced ? 0 : 0.25, ease }}
                    className='overflow-hidden'
                  >
                    <div className='border-t bg-muted/20 px-4 py-3'>
                      {/* Detail text */}
                      {item.detail && (
                        <p className='mb-3 text-xs leading-relaxed text-muted-foreground'>
                          {item.detail}
                        </p>
                      )}

                      {item.dealTimeline && <DealTimeline stages={item.dealTimeline} />}

                      {/* Status steps */}
                      <div className='mb-3 space-y-1.5'>
                        {item.steps.map((step, si) => {
                          const s = stepIcon[step.status];
                          const StepIcon = Icons[s.icon];
                          return (
                            <div key={si} className='flex items-center gap-2 text-xs'>
                              <StepIcon className={cn('size-3.5 shrink-0', s.color)} />
                              <span className='text-foreground/80'>{step.label}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Action buttons */}
                      <div className='flex flex-wrap gap-2'>
                        {item.actions.map((action, ai) => (
                          <Button
                            key={action}
                            size='sm'
                            variant={ai === 0 ? 'default' : 'outline'}
                            className='h-7 rounded-lg px-3 text-xs active:scale-[0.97]'
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isAssignAction(action) && onAssignRequest) {
                                onAssignRequest(item);
                              } else if (isReviewContractAction(action) && onReviewContract) {
                                onReviewContract(item);
                              } else {
                                toast.success(`${action} — triggered`, {
                                  id: `action-${item.id}-${ai}`
                                });
                              }
                            }}
                          >
                            {action}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {completedFocus.length > 0 && (
        <div className='mt-4'>
          <h2 className='mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase'>
            Completed:
          </h2>
          <div className='overflow-hidden rounded-xl border bg-card'>
            {completedFocus.map((item, i) => {
              const Icon = Icons[item.icon];
              return (
                <button
                  key={item.id}
                  type='button'
                  onClick={() => onCompletedClick?.(item)}
                  className={cn(
                    'flex w-full items-center gap-3 px-4 py-3 text-left transition-colors duration-150 hover:bg-muted/50',
                    i < completedFocus.length - 1 && 'border-b'
                  )}
                >
                  <span className='size-2 shrink-0 rounded-full bg-emerald-500' />
                  <Icon className='size-4 shrink-0 text-muted-foreground' />
                  <div className='min-w-0 flex-1'>
                    <span className='text-sm font-medium'>{item.title}</span>
                    <span className='ml-2 text-xs text-muted-foreground'>{item.subline}</span>
                  </div>
                  <span className='hidden shrink-0 text-[11px] font-medium text-emerald-600 sm:inline dark:text-emerald-400'>
                    Completed
                  </span>
                  <Icons.chevronRight className='size-3.5 shrink-0 text-muted-foreground' />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
