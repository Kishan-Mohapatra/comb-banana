'use client';

import { toast } from 'sonner';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import type { Investigation } from '@/constants/command-centre-scenarios';

const stepIcon = {
  done: Icons.circleCheck,
  blocked: Icons.warning,
  waiting: Icons.clock
} as const;

const stepIconClass = {
  done: 'text-emerald-600 dark:text-emerald-400',
  blocked: 'text-destructive',
  waiting: 'text-amber-600 dark:text-amber-400'
} as const;

export function InvestigateDrawer({
  investigation,
  onClose
}: {
  investigation: Investigation | null;
  onClose: () => void;
}) {
  return (
    <Sheet open={investigation !== null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side='right'>
        {investigation && (
          <>
            <SheetHeader>
              <div className='flex items-center gap-2'>
                <Icons.sparkles className='size-4 text-primary' />
                <SheetTitle>Leo AI</SheetTitle>
              </div>
              <SheetDescription>{investigation.query}</SheetDescription>
            </SheetHeader>

            <div className='flex-1 space-y-4 overflow-y-auto px-4'>
              <p className='text-sm text-muted-foreground'>{investigation.summary}</p>

              <ul className='space-y-3'>
                {investigation.steps.map((step) => {
                  const StepIcon = stepIcon[step.status];
                  return (
                    <li key={step.id} className='flex items-start gap-2.5 text-sm'>
                      <StepIcon
                        className={cn('mt-0.5 size-4 shrink-0', stepIconClass[step.status])}
                      />
                      <span>{step.label}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <SheetFooter className='flex-row flex-wrap gap-2'>
              {investigation.actions.map((action) => (
                <Button
                  key={action}
                  size='sm'
                  variant='outline'
                  className='active:scale-[0.97]'
                  onClick={() =>
                    toast.success(action, {
                      id: `investigate-action-${action}`,
                      description: `Queued for ${investigation.buyerName}.`
                    })
                  }
                >
                  {action}
                </Button>
              ))}
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
