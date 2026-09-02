'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { summits } from '@/constants/summit-data';

const ease = [0.23, 1, 0.32, 1] as const;

export function SummitGrid({ summitIds }: { summitIds: string[] }) {
  const matched = summitIds
    .map((id) => summits.find((s) => s.id === id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease }}
      className='grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2'
    >
      {matched.map((summit) => (
        <div key={summit.id} className='flex flex-col gap-2 rounded-xl border bg-card p-3.5'>
          <div className='flex items-start justify-between gap-2'>
            <p className='text-sm font-semibold'>{summit.name}</p>
            <Badge variant='outline' className='shrink-0'>
              {summit.matchScore}%
            </Badge>
          </div>
          <p className='text-muted-foreground text-xs'>
            {summit.location} · {summit.dates}
          </p>
          <p className='text-muted-foreground text-xs'>
            Booths from ${summit.boothTiersFrom.toLocaleString()}
          </p>
          <Button
            size='sm'
            variant='outline'
            className='mt-1 h-7 w-fit rounded-lg text-xs active:scale-[0.97]'
            nativeButton={false}
            render={<Link href={`/dashboard/discover/${summit.id}`} />}
          >
            Details <Icons.arrowRight className='size-3' />
          </Button>
        </div>
      ))}
    </motion.div>
  );
}
