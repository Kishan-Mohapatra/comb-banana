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
import { aiAgents } from '@/constants/command-centre-scenarios';

interface AgentPickerProps {
  value: string;
  onChange: (id: string) => void;
}

export function AgentPicker({ value, onChange }: AgentPickerProps) {
  const [open, setOpen] = useState(false);
  const selected = aiAgents.find((a) => a.id === value) ?? aiAgents[0];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <button
            type='button'
            aria-label={`Agent: ${selected.name}`}
            className='flex h-8 max-w-[11rem] items-center gap-1.5 rounded-lg px-2 text-xs font-medium text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground'
          />
        }
      >
        <Icons.agent className='size-3.5 shrink-0' />
        <span className='truncate'>{selected.name}</span>
        <Icons.chevronDown className='size-3 shrink-0' />
      </PopoverTrigger>
      <PopoverContent align='start' side='top' className='w-64 p-0'>
        <Command>
          <CommandInput placeholder='Search agents…' />
          <CommandList>
            <CommandEmpty>No agent found.</CommandEmpty>
            <CommandGroup>
              {aiAgents.map((agent) => (
                <CommandItem
                  key={agent.id}
                  value={agent.name}
                  data-checked={agent.id === value}
                  onSelect={() => {
                    onChange(agent.id);
                    setOpen(false);
                  }}
                >
                  <div className='min-w-0'>
                    <p className='truncate'>{agent.name}</p>
                    <p className='truncate text-[11px] text-muted-foreground'>
                      {agent.description}
                    </p>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
