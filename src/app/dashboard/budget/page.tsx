import { Suspense } from 'react';
import PageContainer from '@/components/layout/page-container';
import { BudgetOutput } from '@/features/budget-vendors/components/budget-output';

export const metadata = {
  title: 'Dashboard: Budget & Vendors'
};

export default function BudgetPage() {
  return (
    <PageContainer
      pageTitle='Budget & Vendors'
      pageDescription='Itemized budget, floor plan slot, and vendor fulfillment capacity.'
    >
      <Suspense>
        <BudgetOutput />
      </Suspense>
    </PageContainer>
  );
}
