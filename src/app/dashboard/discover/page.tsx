import PageContainer from '@/components/layout/page-container';
import { DiscoverSummits } from '@/features/discover-summits/components/discover-summits';

export const metadata = {
  title: 'Dashboard: Discover Summits'
};

export default function DiscoverSummitsPage() {
  return (
    <PageContainer
      pageTitle='Discover Summits'
      pageDescription='Browse and filter industry summits ranked by fit.'
    >
      <DiscoverSummits />
    </PageContainer>
  );
}
