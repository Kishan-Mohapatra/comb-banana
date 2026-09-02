import { cn } from '@/lib/utils';

// ponytail: 3-band read (Low/Medium/High) over exact %, matches how a lead actually scans capacity.
export function band(capacity: number) {
  if (capacity < 50)
    return {
      label: 'Low',
      color: 'bg-emerald-500',
      text: 'text-emerald-600 dark:text-emerald-400'
    };
  if (capacity < 85)
    return { label: 'Medium', color: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400' };
  return { label: 'High', color: 'bg-destructive', text: 'text-destructive' };
}

export function WorkloadIndicator({
  capacity,
  className
}: {
  capacity: number;
  className?: string;
}) {
  const b = band(capacity);
  const litSegments = capacity < 50 ? 1 : capacity < 85 ? 2 : 3;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className='flex gap-0.5'>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={cn('h-1.5 w-4 rounded-full', i < litSegments ? b.color : 'bg-muted')}
          />
        ))}
      </div>
      <span className={cn('text-[11px] font-medium', b.text)}>{b.label}</span>
      <span className='font-mono text-[11px] text-muted-foreground'>{capacity}%</span>
    </div>
  );
}
