'use client';

import { cn } from '@/lib/utils';

interface KpiDetailItem {
  id: string;
  label: string;
  meta: string;
  tag?: string;
}

interface KpiDetailPanelProps {
  items: KpiDetailItem[];
  onItemClick?: (item: KpiDetailItem) => void;
}

export function KpiDetailPanel({ items, onItemClick }: KpiDetailPanelProps) {
  return (
    <div className='space-y-1.5 p-4'>
      {items.map((item) => {
        const Tag = onItemClick ? 'button' : 'div';
        return (
          <Tag
            key={item.id}
            type={onItemClick ? 'button' : undefined}
            onClick={onItemClick ? () => onItemClick(item) : undefined}
            className={cn(
              'flex w-full items-center justify-between gap-3 rounded-lg border px-3 py-2.5 text-left',
              onItemClick && 'transition-colors hover:bg-muted/50 active:scale-[0.99]'
            )}
          >
            <div className='min-w-0'>
              <p className='truncate text-sm font-medium'>{item.label}</p>
              <p className='truncate text-xs text-muted-foreground'>{item.meta}</p>
            </div>
            {item.tag && (
              <span className='shrink-0 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground'>
                {item.tag}
              </span>
            )}
          </Tag>
        );
      })}
    </div>
  );
}
