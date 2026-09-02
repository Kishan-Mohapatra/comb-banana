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
  title: 'Dashboard: Settings'
};

export default function SettingsPage() {
  return (
    <PageContainer
      pageTitle='Settings'
      pageDescription='Workspace, notification and account preferences.'
    >
      <Empty className='flex-1 border'>
        <EmptyHeader>
          <EmptyMedia variant='icon'>
            <Icons.settings />
          </EmptyMedia>
          <EmptyTitle>Settings is coming soon</EmptyTitle>
          <EmptyDescription>Workspace settings are on the roadmap.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </PageContainer>
  );
}
