'use client';

import { useState } from 'react';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { kpiMetrics } from '@/constants/command-centre-scenarios';
import { CampaignModal } from './campaign-modal';
import { RescuePipelineModal } from './rescue-pipeline-modal';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

const dotColor: Record<string, string> = {
  'needs-attention': 'bg-destructive',
  'deals-at-risk': 'bg-orange-500',
  'team-capacity': 'bg-emerald-500',
  'ai-opportunities': 'bg-violet-400'
};

interface KpiRailProps {
  teamCapacityValue?: string;
  teamCapacityDelta?: string;
  onOpenTeamAvailability?: () => void;
  onOpenDetail?: (metricId: string) => void;
  availableAgents?: string[];
  busyAgents?: string[];
}

export function KpiRail({
  teamCapacityValue,
  teamCapacityDelta,
  onOpenTeamAvailability,
  onOpenDetail,
  availableAgents = [],
  busyAgents = []
}: KpiRailProps = {}) {
  const [campaignOpen, setCampaignOpen] = useState(false);
  const [rescueOpen, setRescueOpen] = useState(false);

  function handleAction(metricId: string) {
    if (metricId === 'ai-opportunities') setCampaignOpen(true);
    else if (metricId === 'deals-at-risk') setRescueOpen(true);
  }

  const metrics = kpiMetrics.map((metric) =>
    metric.id === 'team-capacity'
      ? {
          ...metric,
          value: teamCapacityValue ?? metric.value,
          delta: teamCapacityDelta ?? metric.delta,
          subline: `${availableAgents.length} Available`
        }
      : metric
  );

  return (
    <>
      <div className='grid grid-cols-2'>
        {metrics.map((metric, i) => {
          const isTeamCapacity = metric.id === 'team-capacity';
          const body = (
            <div
              className={cn('px-3.5 pt-3 pb-2.5', i % 2 === 0 && 'border-r', i < 2 && 'border-b')}
            >
              <div className='mb-1 flex items-center justify-between'>
                <div className='flex items-center gap-1.5'>
                  <span className={cn('size-1.5 shrink-0 rounded-full', dotColor[metric.id])} />
                  <span className='text-[10px] font-medium text-muted-foreground'>
                    {metric.label}
                  </span>
                </div>
                {isTeamCapacity && onOpenTeamAvailability ? (
                  <button
                    type='button'
                    className='text-muted-foreground transition-colors hover:text-primary'
                    onClick={onOpenTeamAvailability}
                    aria-label='Open Resource Planner'
                  >
                    <Icons.arrowRight className='size-3.5' />
                  </button>
                ) : (
                  <div className='flex items-center gap-1'>
                    {metric.action && (
                      <button
                        type='button'
                        className='text-muted-foreground hover:text-foreground'
                        onClick={() => handleAction(metric.id)}
                        aria-label={metric.action}
                      >
                        <Icons.ellipsis className='size-3.5' />
                      </button>
                    )}
                    {onOpenDetail && (
                      <button
                        type='button'
                        className='text-muted-foreground transition-colors hover:text-primary'
                        onClick={() => onOpenDetail(metric.id)}
                        aria-label={`Open ${metric.label} details`}
                      >
                        <Icons.arrowRight className='size-3.5' />
                      </button>
                    )}
                  </div>
                )}
              </div>
              <p className='font-mono text-xl font-bold leading-none tracking-tight'>
                {metric.value}
              </p>
              {metric.delta && (
                <p className='mt-1 text-[10px] text-muted-foreground'>{metric.delta}</p>
              )}
              {metric.subline && (
                <p className='mt-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400'>
                  {metric.subline}
                </p>
              )}
            </div>
          );

          if (!isTeamCapacity) return <div key={metric.id}>{body}</div>;

          return (
            <HoverCard key={metric.id}>
              <HoverCardTrigger render={<div />}>{body}</HoverCardTrigger>
              <HoverCardContent className='w-56' side='right'>
                <div className='space-y-2 text-xs'>
                  <div>
                    <p className='mb-1 font-medium text-emerald-600 dark:text-emerald-400'>
                      Available
                    </p>
                    {availableAgents.length > 0 ? (
                      availableAgents.map((name) => <p key={name}>{name}</p>)
                    ) : (
                      <p className='text-muted-foreground'>None right now</p>
                    )}
                  </div>
                  <div>
                    <p className='mb-1 font-medium text-amber-600 dark:text-amber-400'>Busy</p>
                    {busyAgents.length > 0 ? (
                      busyAgents.map((name) => <p key={name}>{name}</p>)
                    ) : (
                      <p className='text-muted-foreground'>Everyone free</p>
                    )}
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          );
        })}
      </div>

      <CampaignModal open={campaignOpen} onClose={() => setCampaignOpen(false)} />
      <RescuePipelineModal open={rescueOpen} onClose={() => setRescueOpen(false)} />
    </>
  );
}
