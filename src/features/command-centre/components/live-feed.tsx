import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { liveFeed, type FeedEvent } from '@/constants/command-centre-scenarios';

interface LiveFeedProps {
  events?: FeedEvent[];
  onViewAll?: () => void;
}

export function LiveFeed({ events = liveFeed, onViewAll }: LiveFeedProps) {
  return (
    <div>
      <div className='mb-2 flex items-center justify-between'>
        <h3 className='text-sm font-semibold'>Live Feed</h3>
        <Button
          variant='link'
          size='sm'
          className='h-auto p-0 text-xs text-primary'
          onClick={onViewAll}
        >
          View all
        </Button>
      </div>
      <ul className='space-y-2.5'>
        {events.map((event) => (
          <li key={event.id} className='flex items-start gap-2 text-sm'>
            <span className='relative mt-1.5 flex size-1.5 shrink-0'>
              {event.isNew && (
                <span className='absolute inline-flex size-full animate-ping rounded-full bg-emerald-500/60' />
              )}
              <span
                className={cn(
                  'relative inline-flex size-1.5 rounded-full',
                  event.isNew ? 'bg-emerald-500' : 'bg-primary'
                )}
              />
            </span>
            <p className='min-w-0 flex-1'>
              <span className='font-medium'>{event.actor}</span>{' '}
              <span className='text-muted-foreground'>{event.action}</span>
            </p>
            <span
              className={cn(
                'shrink-0 text-xs',
                event.isNew
                  ? 'font-medium text-emerald-600 dark:text-emerald-400'
                  : 'text-muted-foreground'
              )}
            >
              {event.timeAgo}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
