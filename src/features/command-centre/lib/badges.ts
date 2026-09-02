export const impactBadgeClass: Record<'high' | 'medium' | 'low', string> = {
  high: 'border-transparent bg-destructive/10 text-destructive',
  medium: 'border-transparent bg-amber-500/10 text-amber-600 dark:text-amber-400',
  low: 'border-transparent bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
};

export const impactLabel: Record<'high' | 'medium' | 'low', string> = {
  high: 'High impact',
  medium: 'Medium impact',
  low: 'Low impact'
};

const timelineDot: Record<string, string> = {
  blue: 'bg-blue-500',
  amber: 'bg-amber-500',
  violet: 'bg-violet-500',
  emerald: 'bg-emerald-500',
  rose: 'bg-rose-500'
};

const timelineBlockClass: Record<string, string> = {
  blue: 'border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300',
  amber: 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300',
  violet: 'border-violet-500/30 bg-violet-500/10 text-violet-700 dark:text-violet-300',
  emerald: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  rose: 'border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300'
};

export function getTimelineDotClass(color: string) {
  return timelineDot[color] ?? 'bg-primary';
}

export function getTimelineBlockClass(color: string) {
  return timelineBlockClass[color] ?? 'border-primary/30 bg-primary/10 text-primary';
}
