'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { trackedSummits, type SummitStatus } from '@/constants/summit-data';

const statusVariant: Record<SummitStatus, 'default' | 'secondary' | 'outline'> = {
  Planning: 'outline',
  'Budget Approved': 'secondary',
  Booked: 'default',
  Attended: 'secondary'
};

export function MySummitsTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Summit</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Booth</TableHead>
          <TableHead>Team</TableHead>
          <TableHead>Spend vs budget</TableHead>
          <TableHead>Deadline</TableHead>
          <TableHead className='text-right'>Plan</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {trackedSummits.map((s) => (
          <TableRow key={s.id}>
            <TableCell className='font-medium'>{s.summitName}</TableCell>
            <TableCell>
              <Badge variant={statusVariant[s.status]}>{s.status}</Badge>
            </TableCell>
            <TableCell>{s.boothTier}</TableCell>
            <TableCell className='tabular-nums'>{s.teamSize}</TableCell>
            <TableCell className='min-w-40'>
              <div className='flex items-center gap-2'>
                <Progress value={(s.spent / s.budget) * 100} className='h-2' />
                <span className='text-muted-foreground shrink-0 text-xs tabular-nums'>
                  ${s.spent.toLocaleString()} / ${s.budget.toLocaleString()}
                </span>
              </div>
            </TableCell>
            <TableCell className='text-muted-foreground text-sm'>{s.deadline}</TableCell>
            <TableCell className='text-right'>
              <Button
                size='sm'
                variant='outline'
                nativeButton={false}
                render={<Link href={`/dashboard/budget?summit=${s.id}`} />}
              >
                View plan
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
