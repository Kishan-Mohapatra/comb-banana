'use client';

import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent
} from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { priorityEngine } from '@/constants/command-centre-data';

export function PriorityEngine() {
  const [open, setOpen] = useState(true);
  const [resolved, setResolved] = useState(false);

  return (
    <Card>
      <Collapsible open={open} onOpenChange={setOpen}>
        <CardHeader>
          <div className='flex items-center gap-2'>
            <Icons.target className='size-4 text-primary' />
            <CardTitle>{priorityEngine.featureName}</CardTitle>
          </div>
          <CardDescription>{priorityEngine.ranking}</CardDescription>
          <CardAction>
            <CollapsibleTrigger
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'icon-sm' }),
                'active:scale-[0.97]'
              )}
              aria-label={open ? 'Collapse priority engine' : 'Expand priority engine'}
            >
              <Icons.chevronDown
                className={cn('size-4 transition-transform', open && 'rotate-180')}
              />
            </CollapsibleTrigger>
          </CardAction>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className='space-y-4 pt-1'>
            {resolved ? (
              <div className='flex items-start gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm'>
                <Icons.circleCheck className='mt-0.5 size-4 shrink-0 text-primary' />
                <p className='text-foreground'>{priorityEngine.successState}</p>
              </div>
            ) : (
              <>
                <ol className='space-y-1.5 text-sm text-muted-foreground'>
                  {priorityEngine.explainSteps.map((step, i) => (
                    <li key={step} className='flex gap-2'>
                      <span className='font-medium text-foreground'>{i + 1}.</span>
                      {step}
                    </li>
                  ))}
                </ol>
                <div className='flex flex-wrap gap-2'>
                  {priorityEngine.resolveActions.map((action) => (
                    <Button
                      key={action}
                      variant='outline'
                      size='sm'
                      className='active:scale-[0.97]'
                      onClick={() => setResolved(true)}
                    >
                      {action}
                    </Button>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
