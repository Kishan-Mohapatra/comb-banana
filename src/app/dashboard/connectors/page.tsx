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
  title: 'Dashboard: Connectors'
};

export default function ConnectorsPage() {
  return (
    <PageContainer
      pageTitle='Connectors'
      pageDescription='Connect MLS, CRM and marketing integrations.'
    >
      <Empty className='flex-1 border'>
        <EmptyHeader>
          <EmptyMedia variant='icon'>
            <Icons.connectors />
          </EmptyMedia>
          <EmptyTitle>Connectors is coming soon</EmptyTitle>
          <EmptyDescription>Third-party integrations are on the roadmap.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </PageContainer>
  );
}
