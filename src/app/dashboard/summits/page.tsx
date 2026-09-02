import PageContainer from '@/components/layout/page-container';
import { MySummitsTable } from '@/features/summits-tracker/components/my-summits-table';

export const metadata = {
  title: 'Dashboard: My Summits'
};

export default function MySummitsPage() {
  return (
    <PageContainer
      pageTitle='My Summits'
      pageDescription='Track participation status, spend, and deadlines across summits.'
    >
      <MySummitsTable />
    </PageContainer>
  );
}
