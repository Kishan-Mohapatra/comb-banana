'use client';

import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Icons } from '@/components/icons';
import { billingInfoContent } from '@/config/infoconfig';
import { demoOrganization } from '@/constants/demo-user';

const plans = [
  { name: 'Free', price: '$0', features: ['1 workspace', 'Basic support'] },
  { name: 'Pro', price: '$29/mo', features: ['Unlimited workspaces', 'Priority support'] }
];

export default function BillingPage() {
  return (
    <PageContainer
      infoContent={billingInfoContent}
      pageTitle='Billing & Plans'
      pageDescription={`Manage your subscription and usage limits for ${demoOrganization.name}`}
    >
      <div className='space-y-6'>
        <Alert>
          <Icons.info className='h-4 w-4' />
          <AlertDescription>
            This is a static demo — no payment provider is wired up in this prototype.
          </AlertDescription>
        </Alert>

        <div className='grid gap-4 sm:grid-cols-2'>
          {plans.map((plan) => (
            <Card key={plan.name}>
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.price}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className='text-muted-foreground list-disc pl-4 text-sm'>
                  {plan.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
