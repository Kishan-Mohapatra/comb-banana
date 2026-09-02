'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import type { Summit, SummitCategory } from '@/constants/summit-data';

const categoryGradient: Record<SummitCategory, string> = {
  InsurTech: 'linear-gradient(135deg, var(--chart-1), var(--chart-5))',
  FinTech: 'linear-gradient(135deg, var(--chart-2), var(--chart-1))',
  HealthTech: 'linear-gradient(135deg, var(--chart-3), var(--chart-2))',
  SaaS: 'linear-gradient(135deg, var(--chart-4), var(--chart-3))',
  AI: 'linear-gradient(135deg, var(--chart-5), var(--chart-4))'
};

export function SummitDetail({ summit }: { summit: Summit }) {
  const router = useRouter();

  return (
    <div className='flex flex-col gap-4'>
      {/* Banner */}
      <div
        className='relative flex aspect-[3/1] w-full flex-col justify-end overflow-hidden rounded-xl border p-5 sm:p-6'
        style={{ background: categoryGradient[summit.category] }}
      >
        <div className='absolute inset-0 bg-black/15' />
        <Badge variant='secondary' className='absolute top-4 right-4'>
          {summit.matchScore}% fit
        </Badge>
        <div className='relative'>
          <Badge className='mb-2 bg-white/20 text-white backdrop-blur-sm'>{summit.category}</Badge>
          <h1 className='text-2xl font-bold text-white drop-shadow-sm sm:text-3xl'>
            {summit.name}
          </h1>
        </div>
      </div>

      <p className='text-muted-foreground text-sm'>{summit.description}</p>

      {/* Metadata */}
      <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5'>
        <Card size='sm'>
          <CardHeader>
            <CardDescription>Geography</CardDescription>
            <CardTitle className='text-base font-semibold'>{summit.region}</CardTitle>
          </CardHeader>
        </Card>
        <Card size='sm'>
          <CardHeader>
            <CardDescription>Where</CardDescription>
            <CardTitle className='text-base font-semibold'>{summit.location}</CardTitle>
          </CardHeader>
        </Card>
        <Card size='sm'>
          <CardHeader>
            <CardDescription>When</CardDescription>
            <CardTitle className='text-base font-semibold'>{summit.dates}</CardTitle>
          </CardHeader>
        </Card>
        <Card size='sm'>
          <CardHeader>
            <CardDescription>Size</CardDescription>
            <CardTitle className='text-base font-semibold'>{summit.sizeLabel}</CardTitle>
          </CardHeader>
        </Card>
        <Card size='sm'>
          <CardHeader>
            <CardDescription>Budget range</CardDescription>
            <CardTitle className='text-base font-semibold tabular-nums'>
              ${summit.boothTiersFrom.toLocaleString()}–${summit.boothTiersTo.toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Criteria — member vs audience */}
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Criteria — as a member</CardTitle>
            <CardDescription>What to have ready to exhibit or sponsor</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className='space-y-2'>
              {summit.participationCriteria.map((c) => (
                <li key={c} className='flex items-start gap-2 text-sm'>
                  <Icons.circleCheck className='mt-0.5 size-4 shrink-0 text-emerald-500' />
                  {c}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Criteria — as an audience</CardTitle>
            <CardDescription>What you need just to attend</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className='space-y-2'>
              {summit.audienceCriteria.map((c) => (
                <li key={c} className='flex items-start gap-2 text-sm'>
                  <Icons.circleCheck className='mt-0.5 size-4 shrink-0 text-emerald-500' />
                  {c}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className='flex gap-2'>
        <Button variant='outline' onClick={() => router.push('/dashboard/discover')}>
          <Icons.chevronLeft className='size-4' /> Back to Discover Summits
        </Button>
        <Button onClick={() => router.push(`/dashboard/plan/new?summit=${summit.id}`)}>
          Plan participation <Icons.arrowRight className='size-4' />
        </Button>
      </div>
    </div>
  );
}
