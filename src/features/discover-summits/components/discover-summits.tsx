'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Icons } from '@/components/icons';
import { summits, summitCountries, summitRegions, type SummitCategory } from '@/constants/summit-data';

const categories: (SummitCategory | 'All')[] = [
  'All',
  'InsurTech',
  'FinTech',
  'HealthTech',
  'SaaS',
  'AI'
];

function ScoreRing({ score }: { score: number }) {
  const color =
    score >= 85 ? 'var(--chart-2)' : score >= 65 ? 'var(--chart-4)' : 'var(--muted-foreground)';
  return (
    <div
      className='relative flex size-14 shrink-0 items-center justify-center rounded-full'
      style={{
        background: `conic-gradient(${color} ${score * 3.6}deg, var(--muted) 0deg)`
      }}
    >
      <div className='bg-card flex size-11 items-center justify-center rounded-full'>
        <span className='text-xs font-semibold tabular-nums'>{score}</span>
      </div>
    </div>
  );
}

export function DiscoverSummits() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<(typeof categories)[number]>('All');
  const [region, setRegion] = useState('All');
  const [country, setCountry] = useState('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const results = useMemo(() => {
    return summits
      .filter((s) => category === 'All' || s.category === category)
      .filter((s) => region === 'All' || s.region === region)
      .filter((s) => country === 'All' || s.country === country)
      .filter((s) => s.name.toLowerCase().includes(query.toLowerCase()))
      .filter((s) => !dateFrom || s.startDate >= dateFrom)
      .filter((s) => !dateTo || s.startDate <= dateTo)
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [query, category, region, country, dateFrom, dateTo]);

  function clearFilters() {
    setQuery('');
    setCategory('All');
    setRegion('All');
    setCountry('All');
    setDateFrom('');
    setDateTo('');
  }

  return (
    <div className='grid grid-cols-1 gap-6 lg:grid-cols-[16rem_1fr]'>
      <aside className='flex flex-col gap-4 rounded-xl border bg-card p-4 lg:h-fit'>
        <div className='flex items-center justify-between'>
          <span className='text-sm font-semibold'>Filters</span>
          <Button
            size='sm'
            variant='ghost'
            className='h-6 px-2 text-xs text-muted-foreground'
            onClick={clearFilters}
          >
            Clear
          </Button>
        </div>

        <div className='relative'>
          <Icons.search className='text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2' />
          <Input
            placeholder='Search summits...'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className='pl-9'
          />
        </div>

        <div className='space-y-1.5'>
          <Label className='text-xs'>Industry</Label>
          <Select value={category} onValueChange={(v) => setCategory(v as typeof category)}>
            <SelectTrigger className='w-full'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c === 'All' ? 'All industries' : c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-1.5'>
          <Label className='text-xs'>Geography</Label>
          <Select value={region} onValueChange={(v) => setRegion(v ?? 'All')}>
            <SelectTrigger className='w-full'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='All'>All regions</SelectItem>
              {summitRegions.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-1.5'>
          <Label className='text-xs'>Country</Label>
          <Select value={country} onValueChange={(v) => setCountry(v ?? 'All')}>
            <SelectTrigger className='w-full'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='All'>All countries</SelectItem>
              {summitCountries.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-1.5'>
          <Label className='text-xs'>Date range</Label>
          <div className='flex items-center gap-2'>
            <Input
              type='date'
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className='text-xs'
            />
            <span className='text-muted-foreground text-xs'>to</span>
            <Input
              type='date'
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className='text-xs'
            />
          </div>
        </div>
      </aside>

      <div className='flex flex-col gap-4'>
        <p className='text-muted-foreground text-sm'>
          {results.length} summit{results.length === 1 ? '' : 's'} found
        </p>
        <div className='grid grid-cols-1 gap-4 xl:grid-cols-2'>
          {results.map((summit) => (
            <Card key={summit.id}>
              <CardHeader className='flex-row items-start gap-3 space-y-0'>
                <ScoreRing score={summit.matchScore} />
                <div className='flex-1'>
                  <CardTitle>{summit.name}</CardTitle>
                  <CardDescription>
                    {summit.location} · {summit.dates}
                  </CardDescription>
                </div>
                <Badge variant='outline'>{summit.category}</Badge>
              </CardHeader>
              <CardContent className='flex flex-col gap-3'>
                <p className='text-muted-foreground text-sm'>{summit.description}</p>
                <div className='text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 text-xs'>
                  <span>{summit.attendees.toLocaleString()} attendees</span>
                  <span>Booths from ${summit.boothTiersFrom.toLocaleString()}</span>
                  <span>Early-bird: {summit.earlyBirdDeadline}</span>
                </div>
                <div className='flex gap-2'>
                  <Button
                    size='sm'
                    variant='outline'
                    onClick={() => router.push(`/dashboard/discover/${summit.id}`)}
                  >
                    Details
                  </Button>
                  <Button
                    size='sm'
                    onClick={() => router.push(`/dashboard/plan/new?summit=${summit.id}`)}
                  >
                    Plan participation <Icons.arrowRight />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {results.length === 0 && (
            <p className='text-muted-foreground col-span-full py-12 text-center text-sm'>
              No summits match your filters.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
