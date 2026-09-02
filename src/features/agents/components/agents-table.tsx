'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from '@/components/ui/table';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import {
  agents,
  agentDepartments,
  agentFleetSummary,
  type AgentStatus
} from '@/constants/agents-data';

const statusOptions: AgentStatus[] = ['working', 'idle', 'blocked', 'offline'];

const statusBadgeClass: Record<AgentStatus, string> = {
  working: 'border-transparent bg-primary/10 text-primary',
  idle: 'border-transparent bg-muted text-muted-foreground',
  blocked: 'border-transparent bg-destructive/10 text-destructive',
  offline: 'border-transparent bg-muted text-muted-foreground/70'
};

const statusDotClass: Record<AgentStatus, string> = {
  working: 'bg-primary motion-safe:animate-pulse',
  idle: 'bg-muted-foreground/50',
  blocked: 'bg-destructive',
  offline: 'bg-muted-foreground/30'
};

function initials(name: string) {
  return name
    .replace('.', '')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

const summaryTiles: { label: string; value: number; accent?: string }[] = [
  { label: 'Total', value: agentFleetSummary.total },
  { label: 'Working', value: agentFleetSummary.working, accent: 'text-primary' },
  { label: 'Idle', value: agentFleetSummary.idle },
  { label: 'Blocked', value: agentFleetSummary.blocked, accent: 'text-destructive' },
  { label: 'Offline', value: agentFleetSummary.offline }
];

export function AgentsTable() {
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState<string>('all');
  const [status, setStatus] = useState<string>('all');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return agents.filter((agent) => {
      if (department !== 'all' && agent.department !== department) return false;
      if (status !== 'all' && agent.status !== status) return false;
      if (q && !agent.name.toLowerCase().includes(q) && !agent.role.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  }, [search, department, status]);

  return (
    <div className='flex flex-1 flex-col gap-3'>
      {/* Fleet summary strip */}
      <div className='grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6'>
        {summaryTiles.map((tile) => (
          <Card key={tile.label} size='sm'>
            <CardContent className='px-3 py-1.5'>
              <p className='text-[11px] text-muted-foreground'>{tile.label}</p>
              <p className={cn('text-lg font-semibold tabular-nums', tile.accent)}>{tile.value}</p>
            </CardContent>
          </Card>
        ))}
        <Card size='sm'>
          <CardContent className='px-3 py-1.5'>
            <p className='text-[11px] text-muted-foreground'>Avg Success</p>
            <p className='text-lg font-semibold tabular-nums'>
              {agentFleetSummary.avgSuccessRate}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className='flex flex-wrap items-center gap-2'>
        <div className='relative w-full max-w-xs'>
          <Icons.search className='pointer-events-none absolute top-1/2 left-2 size-3.5 -translate-y-1/2 text-muted-foreground' />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Search name or role…'
            className='pl-7'
          />
        </div>
        <Select value={department} onValueChange={(value) => setDepartment(value ?? 'all')}>
          <SelectTrigger size='sm' className='w-[190px]'>
            <SelectValue placeholder='Department' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All departments</SelectItem>
            {agentDepartments.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={(value) => setStatus(value ?? 'all')}>
          <SelectTrigger size='sm' className='w-[140px]'>
            <SelectValue placeholder='Status' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All statuses</SelectItem>
            {statusOptions.map((s) => (
              <SelectItem key={s} value={s} className='capitalize'>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className='ml-auto text-xs text-muted-foreground tabular-nums'>
          {filtered.length} / {agents.length} agents
        </span>
      </div>

      {/* Table */}
      <div className='max-h-[600px] overflow-auto rounded-lg border'>
        <Table>
          <TableHeader className='sticky top-0 z-10 bg-card'>
            <TableRow>
              <TableHead>Agent</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Current Task</TableHead>
              <TableHead className='text-right'>Tasks Today</TableHead>
              <TableHead className='text-right'>Success Rate</TableHead>
              <TableHead>Model</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((agent) => (
              <TableRow key={agent.id}>
                <TableCell>
                  <div className='flex items-center gap-2'>
                    <span className='flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-medium'>
                      {initials(agent.name)}
                    </span>
                    <span className='font-medium'>{agent.name}</span>
                  </div>
                </TableCell>
                <TableCell className='text-muted-foreground'>{agent.department}</TableCell>
                <TableCell className='text-muted-foreground'>{agent.role}</TableCell>
                <TableCell>
                  <Badge className={cn('gap-1.5 capitalize', statusBadgeClass[agent.status])}>
                    <span
                      className={cn('size-1.5 shrink-0 rounded-full', statusDotClass[agent.status])}
                    />
                    {agent.status}
                  </Badge>
                </TableCell>
                <TableCell className='max-w-[260px] truncate text-muted-foreground'>
                  {agent.currentTask}
                </TableCell>
                <TableCell className='text-right tabular-nums'>{agent.tasksToday}</TableCell>
                <TableCell className='text-right tabular-nums'>{agent.successRate}%</TableCell>
                <TableCell className='text-muted-foreground'>{agent.model}</TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className='h-24 text-center text-muted-foreground'>
                  No agents match your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
