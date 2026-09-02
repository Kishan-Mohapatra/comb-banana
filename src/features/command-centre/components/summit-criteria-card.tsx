'use client';

import { motion } from 'motion/react';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { summits } from '@/constants/summit-data';

const ease = [0.23, 1, 0.32, 1] as const;

export function SummitCriteriaCard({
  summitId,
  onMoreDetails
}: {
  summitId: string;
  onMoreDetails: () => void;
}) {
  const summit = summits.find((s) => s.id === summitId);
  if (!summit) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease }}
      className='w-full max-w-sm rounded-xl border bg-card p-4'
    >
      <div className='mb-2 flex items-start justify-between gap-2'>
        <p className='text-sm font-semibold'>{summit.name}</p>
        <Badge variant='outline' className='shrink-0'>
          {summit.matchScore}% fit
        </Badge>
      </div>
      <div className='text-muted-foreground grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs'>
        <span>Where</span>
        <span className='text-right'>{summit.location}</span>
        <span>Size</span>
        <span className='text-right'>{summit.sizeLabel}</span>
        <span>Budget range</span>
        <span className='text-right tabular-nums'>
          ${summit.boothTiersFrom.toLocaleString()}–${summit.boothTiersTo.toLocaleString()}
        </span>
      </div>
      <p className='mt-3 mb-1.5 text-xs font-semibold'>Criteria for participation</p>
      <ul className='space-y-1'>
        {summit.participationCriteria.slice(0, 2).map((c) => (
          <li key={c} className='text-muted-foreground flex items-start gap-1.5 text-xs'>
            <Icons.circleCheck className='mt-0.5 size-3 shrink-0 text-emerald-500' />
            {c}
          </li>
        ))}
      </ul>
      <Button
        size='sm'
        variant='outline'
        className='mt-3 h-7 rounded-lg text-xs active:scale-[0.97]'
        onClick={onMoreDetails}
      >
        More details <Icons.arrowRight className='size-3' />
      </Button>
    </motion.div>
  );
}
