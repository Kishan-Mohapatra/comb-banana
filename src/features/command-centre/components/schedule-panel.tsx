'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { getTimelineBlockClass, getTimelineDotClass } from '@/features/command-centre/lib/badges';
import {
  currentUser,
  meetings,
  scheduleToday,
  type SchedulePriority,
  type TeamMember,
  type TodoItem
} from '@/constants/command-centre-scenarios';

const weekdayFmt = new Intl.DateTimeFormat('en-US', { weekday: 'short' });
const monthYearFmt = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' });

function toISODate(d: Date) {
  return d.toISOString().slice(0, 10);
}

function shiftDate(iso: string, days: number) {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + days);
  return toISODate(d);
}

function shiftMonth(iso: string, months: number) {
  const d = new Date(`${iso}T00:00:00`);
  d.setMonth(d.getMonth() + months);
  return toISODate(d);
}

const priorityDot: Record<SchedulePriority, string> = {
  Low: 'bg-emerald-400',
  Medium: 'bg-amber-400',
  High: 'bg-destructive'
};

interface SchedulePanelProps {
  agents: TeamMember[];
  todos: TodoItem[];
  onAddTodo: (label: string, assigneeId: string, priority: SchedulePriority) => void;
  onToggleTodo: (id: string) => void;
}

export function SchedulePanel({ agents, todos, onAddTodo, onToggleTodo }: SchedulePanelProps) {
  const [selectedDate, setSelectedDate] = useState(scheduleToday);
  const [tab, setTab] = useState<'meetings' | 'checklist'>('meetings');
  const [newLabel, setNewLabel] = useState('');
  const [newAssignee, setNewAssignee] = useState(currentUser.id);
  const [newPriority, setNewPriority] = useState<SchedulePriority>('Medium');

  const assignees = [currentUser, ...agents];
  const dayOffsets = [-2, -1, 0, 1, 2];
  const dayStrip = dayOffsets.map((offset) => shiftDate(selectedDate, offset));

  const dayMeetings = meetings.filter((m) => m.date === selectedDate);
  const dayTodos = todos.filter((t) => t.dueDate === selectedDate);

  function assigneeLabel(id: string) {
    if (id === currentUser.id) return 'Me';
    return agents.find((a) => a.id === id)?.name.split(' ')[0] ?? id;
  }

  function handleAdd() {
    const label = newLabel.trim();
    if (!label) return;
    onAddTodo(label, newAssignee, newPriority);
    setNewLabel('');
    setNewPriority('Medium');
  }

  return (
    <div className='p-4'>
      {/* Month nav */}
      <div className='mb-3 flex items-center justify-between'>
        <Button
          size='icon-sm'
          variant='ghost'
          aria-label='Previous month'
          onClick={() => setSelectedDate((d) => shiftMonth(d, -1))}
        >
          <Icons.chevronLeft className='size-3.5' />
        </Button>
        <span className='text-xs font-semibold'>
          {monthYearFmt.format(new Date(`${selectedDate}T00:00:00`))}
        </span>
        <Button
          size='icon-sm'
          variant='ghost'
          aria-label='Next month'
          onClick={() => setSelectedDate((d) => shiftMonth(d, 1))}
        >
          <Icons.chevronRight className='size-3.5' />
        </Button>
      </div>

      {/* Day strip */}
      <div className='mb-4 flex items-center gap-1'>
        <Button
          size='icon-sm'
          variant='ghost'
          aria-label='Previous day'
          onClick={() => setSelectedDate((d) => shiftDate(d, -1))}
        >
          <Icons.chevronLeft className='size-3.5' />
        </Button>
        <div className='grid flex-1 grid-cols-5 gap-1'>
          {dayStrip.map((iso) => {
            const active = iso === selectedDate;
            const date = new Date(`${iso}T00:00:00`);
            return (
              <button
                key={iso}
                type='button'
                onClick={() => setSelectedDate(iso)}
                className={cn(
                  'flex flex-col items-center gap-0.5 rounded-lg py-1.5 text-center transition-colors',
                  active ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                )}
              >
                <span
                  className={cn(
                    'text-[10px] uppercase',
                    active ? 'text-primary-foreground/80' : 'text-muted-foreground'
                  )}
                >
                  {weekdayFmt.format(date)}
                </span>
                <span className='text-sm font-semibold'>
                  {date.getDate().toString().padStart(2, '0')}
                </span>
              </button>
            );
          })}
        </div>
        <Button
          size='icon-sm'
          variant='ghost'
          aria-label='Next day'
          onClick={() => setSelectedDate((d) => shiftDate(d, 1))}
        >
          <Icons.chevronRight className='size-3.5' />
        </Button>
      </div>

      <Tabs value={tab} onValueChange={(v) => v && setTab(v as 'meetings' | 'checklist')}>
        <TabsList className='mb-3 w-full'>
          <TabsTrigger value='meetings' className='gap-1.5'>
            <Icons.chat className='size-3.5' />
            Meetings
          </TabsTrigger>
          <TabsTrigger value='checklist' className='gap-1.5'>
            <Icons.checks className='size-3.5' />
            Checklist
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {tab === 'meetings' && (
        <div className='space-y-2'>
          {dayMeetings.length === 0 ? (
            <p className='py-6 text-center text-xs text-muted-foreground'>No meetings scheduled.</p>
          ) : (
            dayMeetings.map((meeting) => (
              <div key={meeting.id} className='flex items-start gap-2.5'>
                <span className='w-14 shrink-0 pt-2.5 text-[11px] font-medium text-muted-foreground'>
                  {meeting.time}
                </span>
                <div
                  className={cn(
                    'flex-1 rounded-lg border px-3 py-2',
                    getTimelineBlockClass(meeting.color)
                  )}
                >
                  <p className='flex items-center gap-1.5 text-sm font-semibold'>
                    <span
                      className={cn(
                        'size-1.5 shrink-0 rounded-full',
                        getTimelineDotClass(meeting.color)
                      )}
                    />
                    {meeting.title}
                  </p>
                  <p className='text-xs opacity-80'>{meeting.subtitle}</p>
                </div>
              </div>
            ))
          )}
          <Button
            variant='outline'
            size='sm'
            className='mt-2 h-8 w-full gap-1.5 rounded-lg text-xs active:scale-[0.97]'
            onClick={() => toast.info('Creating meetings — coming soon.', { id: 'create-meeting' })}
          >
            <Icons.add className='size-3.5' />
            Create Meeting
          </Button>
        </div>
      )}

      {tab === 'checklist' && (
        <div className='space-y-3'>
          <div className='space-y-1'>
            {dayTodos.length === 0 ? (
              <p className='py-6 text-center text-xs text-muted-foreground'>
                No to-dos for this day.
              </p>
            ) : (
              dayTodos.map((todo) => (
                <div
                  key={todo.id}
                  className='flex items-center gap-2.5 rounded-lg border px-2.5 py-2'
                >
                  <Checkbox
                    checked={todo.done}
                    onCheckedChange={() => onToggleTodo(todo.id)}
                    className='shrink-0'
                  />
                  <span
                    className={cn(
                      'min-w-0 flex-1 truncate text-sm',
                      todo.done && 'text-muted-foreground line-through'
                    )}
                  >
                    {todo.label}
                  </span>
                  <span
                    className={cn('size-1.5 shrink-0 rounded-full', priorityDot[todo.priority])}
                  />
                  <span className='shrink-0 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground'>
                    {assigneeLabel(todo.assigneeId)}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Inline add row — create for self or assign to a teammate */}
          <div className='space-y-1.5 border-t pt-3'>
            <Input
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAdd();
              }}
              placeholder='Add a to-do or reminder…'
              className='h-8 text-xs'
            />
            <div className='flex items-center gap-1.5'>
              <Select value={newAssignee} onValueChange={(v) => v && setNewAssignee(v)}>
                <SelectTrigger size='sm' className='h-7 flex-1 text-xs'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {assignees.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.id === currentUser.id ? 'Me' : a.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={newPriority}
                onValueChange={(v) => v && setNewPriority(v as SchedulePriority)}
              >
                <SelectTrigger size='sm' className='h-7 w-24 text-xs'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='Low'>Low</SelectItem>
                  <SelectItem value='Medium'>Medium</SelectItem>
                  <SelectItem value='High'>High</SelectItem>
                </SelectContent>
              </Select>
              <Button
                size='sm'
                className='h-7 shrink-0 rounded-lg px-2.5 text-xs active:scale-[0.97]'
                disabled={!newLabel.trim()}
                onClick={handleAdd}
              >
                Add
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
