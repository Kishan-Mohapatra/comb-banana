'use client';

import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem
} from '@/components/ui/command';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import type { TeamMember } from '@/constants/command-centre-scenarios';

interface MemberAssignControlProps {
  agents: TeamMember[];
  assignedId?: string;
  onAssign: (agentId: string) => void;
}

// ponytail: a task can only ever have one assignee — this is the single control for
// both the initial assign and every later reassign, never two independent buttons.
export function MemberAssignControl({ agents, assignedId, onAssign }: MemberAssignControlProps) {
  const [open, setOpen] = useState(false);
  const assigned = agents.find((a) => a.id === assignedId);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <button
            type='button'
            aria-label={assigned ? `Reassign — currently ${assigned.name}` : 'Assign to a member'}
            className={cn(
              'flex h-7 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium active:scale-[0.97]',
              assigned
                ? 'border bg-card hover:bg-muted/50'
                : 'border border-border bg-background hover:bg-muted hover:text-foreground'
            )}
          />
        }
      >
        {assigned ? (
          <>
            <span className='flex size-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[9px] font-semibold text-primary'>
              {assigned.initials}
            </span>
            {assigned.name}
            <Icons.chevronDown className='size-3 shrink-0 text-muted-foreground' />
          </>
        ) : (
          'Assign to a Member'
        )}
      </PopoverTrigger>
      <PopoverContent align='start' className='w-56 p-0'>
        <Command>
          <CommandInput placeholder='Search members…' />
          <CommandList>
            <CommandEmpty>No member found.</CommandEmpty>
            <CommandGroup>
              {agents.map((agent) => (
                <CommandItem
                  key={agent.id}
                  value={agent.name}
                  data-checked={agent.id === assignedId}
                  onSelect={() => {
                    onAssign(agent.id);
                    setOpen(false);
                  }}
                >
                  <span className='flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary'>
                    {agent.initials}
                  </span>
                  <span className='truncate'>{agent.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
