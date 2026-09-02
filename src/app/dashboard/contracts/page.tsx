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
  title: 'Dashboard: Contracts'
};

export default function ContractsPage() {
  return (
    <PageContainer
      pageTitle='Contracts'
      pageDescription='Review and manage contracts and disclosures.'
    >
      <Empty className='flex-1 border'>
        <EmptyHeader>
          <EmptyMedia variant='icon'>
            <Icons.contracts />
          </EmptyMedia>
          <EmptyTitle>Contracts is coming soon</EmptyTitle>
          <EmptyDescription>Contract review tooling is on the roadmap.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </PageContainer>
  );
}
