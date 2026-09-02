import PageContainer from '@/components/layout/page-container';
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription
} from '@/components/ui/empty';
import { Icons } from '@/components/icons';

export const metadata = {
  title: 'Dashboard: CRM'
};

export default function CrmPage() {
  return (
    <PageContainer
      pageTitle='CRM'
      pageDescription='Manage leads, contacts and client relationships.'
    >
      <Empty className='flex-1 border'>
        <EmptyHeader>
          <EmptyMedia variant='icon'>
            <Icons.teams />
          </EmptyMedia>
          <EmptyTitle>CRM is coming soon</EmptyTitle>
          <EmptyDescription>Lead and contact management is on the roadmap.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </PageContainer>
  );
}
