'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Icons } from '@/components/icons';
import { goalOptions, boothTierOptions } from '@/constants/summit-data';

const ease = [0.23, 1, 0.32, 1] as const;

export interface InlineQuestionnaireValues {
  goal: string;
  teamSize: number;
  boothTier: string;
}

interface InlineQuestionnaireProps {
  summitName: string;
  onSubmit: (values: InlineQuestionnaireValues) => void;
}

export function InlineQuestionnaire({ summitName, onSubmit }: InlineQuestionnaireProps) {
  const [goal, setGoal] = useState('');
  const [teamSize, setTeamSize] = useState(3);
  const [boothTier, setBoothTier] = useState('10x10');

  const canSubmit = goal.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease }}
      className='w-full max-w-sm space-y-4 rounded-xl border bg-card px-4 py-3.5'
    >
      <p className='text-xs font-medium text-muted-foreground'>Quick plan for {summitName}</p>

      <div className='space-y-1.5'>
        <Label className='text-xs'>Primary goal</Label>
        <Select value={goal} onValueChange={(v) => setGoal(v ?? '')}>
          <SelectTrigger className='h-8 text-xs'>
            <SelectValue placeholder='Select a goal' />
          </SelectTrigger>
          <SelectContent>
            {goalOptions.map((g) => (
              <SelectItem key={g.value} value={g.value}>
                {g.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='space-y-1.5'>
        <Label className='text-xs'>Team size attending</Label>
        <div className='flex items-center gap-2'>
          <Button
            type='button'
            size='icon-sm'
            variant='outline'
            onClick={() => setTeamSize((n) => Math.max(1, n - 1))}
          >
            <Icons.minus className='size-3' />
          </Button>
          <span className='w-6 text-center text-sm tabular-nums'>{teamSize}</span>
          <Button
            type='button'
            size='icon-sm'
            variant='outline'
            onClick={() => setTeamSize((n) => Math.min(20, n + 1))}
          >
            <Icons.add className='size-3' />
          </Button>
        </div>
      </div>

      <div className='space-y-1.5'>
        <Label className='text-xs'>Booth ambition</Label>
        <RadioGroup
          value={boothTier}
          onValueChange={setBoothTier}
          className='flex flex-wrap gap-x-4 gap-y-1.5'
        >
          {boothTierOptions.map((b) => (
            <div key={b.value} className='flex items-center gap-1.5'>
              <RadioGroupItem value={b.value} id={`inline-booth-${b.value}`} className='size-3.5' />
              <Label htmlFor={`inline-booth-${b.value}`} className='text-xs font-normal'>
                {b.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <Button
        size='sm'
        className='h-7 w-full rounded-lg text-xs active:scale-[0.97]'
        disabled={!canSubmit}
        onClick={() => onSubmit({ goal, teamSize, boothTier })}
      >
        Generate Plan & Budget
      </Button>
    </motion.div>
  );
}
