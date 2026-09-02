'use client';

import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { rescueDeals, teamRoster, type RescueReason } from '@/constants/command-centre-scenarios';

const reasons: RescueReason[] = ['Financing', 'Inspection', 'Seller Silence', 'Missing Documents'];

export function RescuePipelineModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [assignments, setAssignments] = useState<Record<RescueReason, string | undefined>>({
    Financing: undefined,
    Inspection: undefined,
    'Seller Silence': undefined,
    'Missing Documents': undefined
  });

  const grouped = useMemo(
    () =>
      reasons.map((reason) => ({
        reason,
        deals: rescueDeals.filter((deal) => deal.reason === reason)
      })),
    []
  );

  const assignedCount = Object.values(assignments).filter(Boolean).length;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className='sm:max-w-xl'>
        <DialogHeader>
          <DialogTitle>Recover Pipeline</DialogTitle>
          <DialogDescription>
            6 deals below 40% probability, $130K commission at risk. Assign an owner per reason.
          </DialogDescription>
        </DialogHeader>

        <div className='max-h-[60vh] space-y-4 overflow-y-auto'>
          {grouped.map(({ reason, deals }) => (
            <div key={reason} className='rounded-lg border p-3'>
              <div className='mb-2 flex items-center justify-between gap-2'>
                <p className='text-sm font-medium'>
                  {reason}{' '}
                  <span className='text-muted-foreground'>
                    · {deals.length} {deals.length === 1 ? 'deal' : 'deals'}
                  </span>
                </p>
                <Select
                  value={assignments[reason]}
                  onValueChange={(value) =>
                    setAssignments((prev) => ({ ...prev, [reason]: value as string }))
                  }
                >
                  <SelectTrigger size='sm'>
                    <SelectValue placeholder='Assign to…' />
                  </SelectTrigger>
                  <SelectContent>
                    {teamRoster.map((name) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <ul className='space-y-1.5'>
                {deals.map((deal) => (
                  <li key={deal.id} className='flex items-center justify-between gap-2 text-sm'>
                    <div className='min-w-0'>
                      <span className='font-medium'>{deal.clientName}</span>{' '}
                      <span className='text-muted-foreground'>{deal.address}</span>
                    </div>
                    <div className='flex shrink-0 items-center gap-2'>
                      <Badge variant='outline'>{deal.daysStalled}d stalled</Badge>
                      <span className='text-xs tabular-nums text-muted-foreground'>
                        ${deal.commissionAtRisk.toLocaleString()}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={onClose} className='active:scale-[0.97]'>
            Cancel
          </Button>
          <Button
            disabled={assignedCount === 0}
            className='active:scale-[0.97]'
            onClick={() => {
              toast.success('Assignments confirmed', {
                id: 'rescue-confirmed',
                description: `${assignedCount} of 4 reason groups reassigned.`
              });
              onClose();
            }}
          >
            Confirm assignments
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
