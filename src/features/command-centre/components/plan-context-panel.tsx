'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { boothTierOptions, vendorCapacity, type Summit } from '@/constants/summit-data';

const ease = [0.23, 1, 0.32, 1] as const;

export interface ActivePlan {
  summit: Summit;
  goal: string;
  teamSize: number;
  boothTier: string;
  budget: {
    boothCost: number;
    lineItemsTotal: number;
    travelStayEstimate: number;
    ticketsEstimate: number;
    miscContingency: number;
    total: number;
  };
}

interface PlanContextPanelProps {
  plan: ActivePlan | null;
  onAdjustTeamSize: (delta: number) => void;
  onCycleBoothTier: () => void;
}

const pointers = [
  'Vendor fulfillment capacity for this venue',
  'Deadline tracker across all your summits',
  'Compare this plan against another summit'
];

export function PlanContextPanel({ plan, onAdjustTeamSize, onCycleBoothTier }: PlanContextPanelProps) {
  if (!plan) {
    return (
      <div className='flex h-full flex-col items-center justify-center gap-2 p-6 text-center'>
        <div className='flex size-9 items-center justify-center rounded-full bg-primary/10'>
          <Icons.sparkles className='size-4 text-primary' />
        </div>
        <p className='text-sm font-medium'>Nothing planned yet</p>
        <p className='max-w-[15rem] text-xs text-muted-foreground'>
          Ask about a summit in the chat — once you build a plan, its budget and details show up
          here.
        </p>
      </div>
    );
  }

  const boothLabel = boothTierOptions.find((b) => b.value === plan.boothTier)?.label ?? plan.boothTier;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease }}
      className='flex h-full flex-col gap-3 p-3'
    >
      <div className='overflow-hidden rounded-xl border bg-card'>
        <div className='bg-muted/40 text-muted-foreground flex aspect-[2/1] items-center justify-center text-xs'>
          Floor plan & booth preview — placeholder
        </div>
        <div className='space-y-2 p-3.5'>
          <div className='flex items-start justify-between gap-2'>
            <div>
              <p className='text-sm font-semibold'>{plan.summit.name}</p>
              <p className='text-muted-foreground text-xs'>
                {plan.summit.location} · {plan.summit.dates}
              </p>
            </div>
            <Badge variant='outline'>{boothLabel}</Badge>
          </div>
          <div className='flex items-baseline justify-between border-t pt-2'>
            <span className='text-muted-foreground text-xs'>Total budget</span>
            <span className='text-lg font-semibold tabular-nums'>
              ${plan.budget.total.toLocaleString()}
            </span>
          </div>
          <div className='text-muted-foreground grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]'>
            <span>Booth</span>
            <span className='text-right tabular-nums'>${plan.budget.boothCost.toLocaleString()}</span>
            <span>Furniture & AV</span>
            <span className='text-right tabular-nums'>
              ${plan.budget.lineItemsTotal.toLocaleString()}
            </span>
            <span>Travel & stay</span>
            <span className='text-right tabular-nums'>
              ${plan.budget.travelStayEstimate.toLocaleString()}
            </span>
            <span>Tickets ({plan.teamSize} people)</span>
            <span className='text-right tabular-nums'>
              ${plan.budget.ticketsEstimate.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className='rounded-xl border bg-card p-3.5'>
        <p className='mb-1.5 text-xs font-semibold'>Vendor capacity</p>
        <p className='text-muted-foreground text-xs'>
          {vendorCapacity.vendorName} — {vendorCapacity.locations} locations,{' '}
          {vendorCapacity.continents} continents. Capacity of{' '}
          {vendorCapacity.annualCapacity.toLocaleString()} projects/year.
        </p>
      </div>

      <div className='rounded-xl border bg-card p-3.5'>
        <p className='mb-1.5 text-xs font-semibold'>Summary</p>
        <p className='text-muted-foreground text-xs leading-relaxed'>
          Built for {plan.teamSize} team member{plan.teamSize === 1 ? '' : 's'} attending{' '}
          {plan.summit.name} with a {boothLabel} booth.
        </p>
        <p className='mt-2 mb-1.5 text-xs font-semibold'>What else I can show</p>
        <ul className='space-y-1'>
          {pointers.map((p) => (
            <li key={p} className='text-muted-foreground flex items-start gap-1.5 text-xs'>
              <Icons.arrowRight className='mt-0.5 size-3 shrink-0' />
              {p}
            </li>
          ))}
        </ul>
      </div>

      <div className='space-y-2 rounded-xl border bg-card p-3.5'>
        <p className='text-xs font-semibold'>Update this plan</p>
        <div className='flex flex-wrap gap-1.5'>
          <Button
            size='sm'
            variant='outline'
            className='h-7 rounded-lg px-2.5 text-xs active:scale-[0.97]'
            onClick={() => onAdjustTeamSize(1)}
          >
            <Icons.add className='size-3' /> Team size
          </Button>
          <Button
            size='sm'
            variant='outline'
            className='h-7 rounded-lg px-2.5 text-xs active:scale-[0.97]'
            onClick={() => onAdjustTeamSize(-1)}
          >
            <Icons.minus className='size-3' /> Team size
          </Button>
          <Button
            size='sm'
            variant='outline'
            className='h-7 rounded-lg px-2.5 text-xs active:scale-[0.97]'
            onClick={onCycleBoothTier}
          >
            <Icons.edit className='size-3' /> Booth tier
          </Button>
        </div>
        <Button
          size='sm'
          className='h-7 w-full rounded-lg text-xs active:scale-[0.97]'
          render={<Link href={`/dashboard/budget?summit=${plan.summit.id}`} />}
          nativeButton={false}
        >
          Open full plan page <Icons.arrowRight className='size-3' />
        </Button>
      </div>
    </motion.div>
  );
}
