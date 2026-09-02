'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import type { AssignmentTask, TeamMember } from '@/constants/command-centre-scenarios';

interface AssignTaskModalProps {
  open: boolean;
  agent: TeamMember | null;
  task: AssignmentTask;
  onCancel: () => void;
  onConfirm: () => void;
}

const priorityColor: Record<AssignmentTask['priority'], string> = {
  Low: 'text-emerald-600 dark:text-emerald-400',
  Medium: 'text-amber-600 dark:text-amber-400',
  High: 'text-destructive'
};

export function AssignTaskModal({ open, agent, task, onCancel, onConfirm }: AssignTaskModalProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onCancel()}>
      <DialogContent className='sm:max-w-sm'>
        <DialogHeader>
          <DialogTitle>Assign Task</DialogTitle>
          <DialogDescription>
            Confirm this assignment{agent ? ` for ${agent.name}` : ''}.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-2.5 text-sm'>
          <div className='flex items-center justify-between'>
            <span className='text-muted-foreground'>Task</span>
            <span className='font-medium'>{task.title}</span>
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-muted-foreground'>Priority</span>
            <span className={`font-medium ${priorityColor[task.priority]}`}>{task.priority}</span>
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-muted-foreground'>Estimated Duration</span>
            <span className='font-mono font-medium'>{task.durationMins} min</span>
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-muted-foreground'>Travel Time</span>
            <span className='font-mono font-medium'>{task.travelMins} min</span>
          </div>
          <div className='flex items-center justify-between border-t pt-2.5'>
            <span className='flex items-center gap-1.5 text-muted-foreground'>
              <Icons.sparkles className='size-3.5 text-primary' />
              Suggested by Leo
            </span>
            <Badge variant='secondary' className='rounded-full text-[11px] font-medium'>
              {task.confidence}% Confidence
            </Badge>
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' size='sm' onClick={onCancel}>
            Cancel
          </Button>
          <Button size='sm' onClick={onConfirm} className='active:scale-[0.97]'>
            Assign Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
