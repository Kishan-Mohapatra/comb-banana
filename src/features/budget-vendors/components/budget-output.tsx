'use client';

import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Icons } from '@/components/icons';
import {
  summits,
  boothLineItems,
  budgetSummary,
  vendorCapacity,
  planConstraints
} from '@/constants/summit-data';

export function BudgetOutput() {
  const searchParams = useSearchParams();
  const summitId = searchParams.get('summit');
  const summit = summits.find((s) => s.id === summitId) ?? summits[0];

  const lineItemsTotal = boothLineItems.reduce((sum, li) => sum + li.qty * li.unitCost, 0);
  const total =
    budgetSummary.boothCost +
    lineItemsTotal +
    budgetSummary.travelStayEstimate +
    budgetSummary.ticketsEstimate +
    budgetSummary.miscContingency;

  return (
    <div className='flex flex-col gap-4'>
      <Card>
        <CardHeader>
          <CardTitle>{summit.name}</CardTitle>
          <CardDescription>
            {budgetSummary.boothTier} booth · {summit.location} · {summit.dates}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='bg-muted/40 text-muted-foreground flex aspect-[3/1] items-center justify-center rounded-lg border text-sm'>
            Floor plan slot & booth preview — placeholder
          </div>
        </CardContent>
      </Card>

      <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
        <Card className='lg:col-span-2'>
          <CardHeader>
            <CardTitle>Furniture & AV line items</CardTitle>
            <CardDescription>Itemized booth package</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead className='text-right'>Qty</TableHead>
                  <TableHead className='text-right'>Unit</TableHead>
                  <TableHead className='text-right'>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {boothLineItems.map((li) => (
                  <TableRow key={li.sku}>
                    <TableCell className='text-muted-foreground font-mono text-xs'>{li.sku}</TableCell>
                    <TableCell>{li.item}</TableCell>
                    <TableCell className='text-right tabular-nums'>{li.qty}</TableCell>
                    <TableCell className='text-right tabular-nums'>${li.unitCost.toLocaleString()}</TableCell>
                    <TableCell className='text-right tabular-nums'>
                      ${(li.qty * li.unitCost).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total budget</CardTitle>
            <CardDescription>Booth tier: {budgetSummary.boothTier}</CardDescription>
          </CardHeader>
          <CardContent className='flex flex-col gap-2 text-sm'>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Booth</span>
              <span className='tabular-nums'>${budgetSummary.boothCost.toLocaleString()}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Furniture & AV</span>
              <span className='tabular-nums'>${lineItemsTotal.toLocaleString()}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Travel & stay</span>
              <span className='tabular-nums'>${budgetSummary.travelStayEstimate.toLocaleString()}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Tickets</span>
              <span className='tabular-nums'>${budgetSummary.ticketsEstimate.toLocaleString()}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Contingency</span>
              <span className='tabular-nums'>${budgetSummary.miscContingency.toLocaleString()}</span>
            </div>
            <div className='mt-2 flex justify-between border-t pt-2 font-semibold'>
              <span>Total</span>
              <span className='tabular-nums'>${total.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Vendor fulfillment capacity</CardTitle>
            <CardDescription>{vendorCapacity.vendorName}</CardDescription>
          </CardHeader>
          <CardContent className='flex flex-col gap-3'>
            <div className='grid grid-cols-3 gap-3 text-center'>
              <div>
                <p className='text-2xl font-semibold tabular-nums'>{vendorCapacity.locations}</p>
                <p className='text-muted-foreground text-xs'>Locations</p>
              </div>
              <div>
                <p className='text-2xl font-semibold tabular-nums'>{vendorCapacity.continents}</p>
                <p className='text-muted-foreground text-xs'>Continents</p>
              </div>
              <div>
                <p className='text-2xl font-semibold tabular-nums'>{vendorCapacity.countries}</p>
                <p className='text-muted-foreground text-xs'>Countries</p>
              </div>
            </div>
            <p className='text-muted-foreground text-sm'>
              Capacity of {vendorCapacity.annualCapacity.toLocaleString()} projects/year.
            </p>
            <Badge variant={vendorCapacity.canDeliverAtLocation ? 'default' : 'outline'} className='w-fit'>
              {vendorCapacity.canDeliverAtLocation ? 'Can deliver at this venue' : 'Capacity constrained'}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Constraints</CardTitle>
            <CardDescription>Deadlines & flags to plan around</CardDescription>
          </CardHeader>
          <CardContent className='flex flex-col gap-3'>
            {planConstraints.map((c) => (
              <div key={c.label} className='flex items-center justify-between gap-3 text-sm'>
                <div className='flex items-center gap-2'>
                  <Icons.alertCircle
                    className={
                      c.risk === 'high'
                        ? 'text-destructive size-4'
                        : c.risk === 'medium'
                          ? 'size-4 text-amber-500'
                          : 'text-muted-foreground size-4'
                    }
                  />
                  <span>{c.label}</span>
                </div>
                <span className='text-muted-foreground tabular-nums'>{c.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
