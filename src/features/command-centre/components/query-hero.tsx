'use client';

import { motion, useReducedMotion } from 'motion/react';
import { Icons } from '@/components/icons';

const ease = [0.23, 1, 0.32, 1] as const;

interface QueryHeroProps {
  pills: string[];
  onSelect: (text: string) => void;
}

export function QueryHero({ pills, onSelect }: QueryHeroProps) {
  const reduced = useReducedMotion();

  return (
    <div className='w-full max-w-2xl'>
      <div className='rounded-2xl border bg-card/60 px-6 py-8 text-center'>
        <div className='mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-primary/10'>
          <Icons.sparkles className='size-4.5 text-primary' />
        </div>
        <h2 className='text-lg font-semibold tracking-tight'>What do you want to know?</h2>
        <p className='mt-1 text-sm text-muted-foreground'>
          Ask about a summit, its cost, or your participation plan.
        </p>

        <div className='mt-5 flex flex-wrap items-center justify-center gap-2'>
          {pills.map((label, i) => (
            <motion.button
              key={label}
              type='button'
              initial={reduced ? undefined : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease, delay: 0.1 + i * 0.05 }}
              onClick={() => onSelect(label)}
              className='inline-flex items-center gap-1.5 rounded-full border bg-background px-3.5 py-1.5 text-left text-xs font-medium text-muted-foreground transition-all duration-150 hover:bg-muted hover:text-foreground hover:shadow-sm active:scale-[0.97]'
            >
              <Icons.search className='size-3 shrink-0 text-primary' />
              {label}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
