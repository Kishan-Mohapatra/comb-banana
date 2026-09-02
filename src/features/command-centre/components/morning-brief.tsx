import { Card, CardContent } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { morningBrief } from '@/constants/command-centre-scenarios';

const pills = [
  {
    icon: Icons.checks,
    label: 'Yesterday recap',
    value: `${morningBrief.yesterdayDealsClosed} deals`,
    sub: 'closed'
  },
  {
    icon: Icons.contracts,
    label: 'Contracts signed',
    value: `${morningBrief.contractsSigned.count}`,
    sub: `worth $${morningBrief.contractsSigned.worth.toLocaleString()}`
  },
  {
    icon: Icons.teams,
    label: 'New leads',
    value: `${morningBrief.newLeads.count}`,
    sub: `+${morningBrief.newLeads.deltaPct}% vs yesterday`
  },
  {
    icon: Icons.agent,
    label: 'Agent shoutout',
    value: morningBrief.agentShoutout.name,
    sub: `$${morningBrief.agentShoutout.commission.toLocaleString()} in commission`
  },
  {
    icon: Icons.warning,
    label: 'Needs attention',
    value: `${morningBrief.needsAttention}`,
    sub: 'items'
  }
];

export function MorningBrief() {
  return (
    <Card id='morning-brief' className='border-primary/20 bg-primary/5 dark:bg-primary/10'>
      <CardContent className='flex gap-3 overflow-x-auto pb-1'>
        {pills.map((pill) => (
          <div
            key={pill.label}
            className='flex min-w-40 shrink-0 items-start gap-2.5 rounded-lg bg-card p-3 ring-1 ring-foreground/10'
          >
            <pill.icon className='mt-0.5 size-4 shrink-0 text-primary' />
            <div className='min-w-0'>
              <p className='truncate text-xs text-muted-foreground'>{pill.label}</p>
              <p className='truncate text-base font-semibold'>{pill.value}</p>
              <p className='truncate text-xs text-muted-foreground'>{pill.sub}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
