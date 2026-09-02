'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { reportingMetrics, spendBySummit } from '@/constants/summit-data';

const chartConfig = {
  spend: { label: 'Spend', color: 'var(--chart-1)' }
} satisfies ChartConfig;

export function ReportingDashboard() {
  return (
    <div className='flex flex-col gap-4'>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {reportingMetrics.map((metric) => (
          <Card key={metric.label} size='sm'>
            <CardHeader>
              <CardDescription>{metric.label}</CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums'>{metric.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Spend by summit</CardTitle>
          <CardDescription>Actuals against committed budget</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className='aspect-auto h-64 w-full'>
            <BarChart data={spendBySummit}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey='name' tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey='spend' fill='var(--color-spend)' radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
