'use client';

import Link from 'next/link';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { summits } from '@/constants/summit-data';

export function CriteriaPanel({ summitId }: { summitId: string }) {
  const summit = summits.find((s) => s.id === summitId);
  if (!summit) return null;

  return (
    <div className='flex h-full flex-col gap-3 p-3'>
      <div className='overflow-hidden rounded-xl border bg-card'>
        <div className='bg-muted/40 text-muted-foreground flex aspect-[2/1] items-center justify-center text-xs'>
          Floor plan & booth preview — placeholder
        </div>
        <div className='space-y-2 p-3.5'>
          <div className='flex items-start justify-between gap-2'>
            <div>
              <p className='text-sm font-semibold'>{summit.name}</p>
              <p className='text-muted-foreground text-xs'>
                {summit.location} · {summit.dates}
              </p>
            </div>
            <Badge variant='outline'>{summit.matchScore}% fit</Badge>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-2'>
        <div className='rounded-xl border bg-card p-3'>
          <p className='text-muted-foreground text-[11px]'>Size</p>
          <p className='text-sm font-medium'>{summit.sizeLabel}</p>
        </div>
        <div className='rounded-xl border bg-card p-3'>
          <p className='text-muted-foreground text-[11px]'>Budget range</p>
          <p className='text-sm font-medium tabular-nums'>
            ${summit.boothTiersFrom.toLocaleString()}–${summit.boothTiersTo.toLocaleString()}
          </p>
        </div>
      </div>

      <div className='rounded-xl border bg-card p-3.5'>
        <p className='mb-1.5 text-xs font-semibold'>Criteria for participation</p>
        <ul className='space-y-1.5'>
          {summit.participationCriteria.map((c) => (
            <li key={c} className='text-muted-foreground flex items-start gap-1.5 text-xs'>
              <Icons.circleCheck className='mt-0.5 size-3.5 shrink-0 text-emerald-500' />
              {c}
            </li>
          ))}
        </ul>
      </div>

      <Button
        size='sm'
        className='h-7 w-full rounded-lg text-xs active:scale-[0.97]'
        render={<Link href={`/dashboard/discover/${summit.id}`} />}
        nativeButton={false}
      >
        Open full summit page <Icons.arrowRight className='size-3' />
      </Button>
    </div>
  );
}
