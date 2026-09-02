import { notFound } from 'next/navigation';
import PageContainer from '@/components/layout/page-container';
import { SummitDetail } from '@/features/discover-summits/components/summit-detail';
import { summits } from '@/constants/summit-data';

interface PageProps {
  params: Promise<{ summitId: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { summitId } = await params;
  const summit = summits.find((s) => s.id === summitId);
  return { title: `Dashboard: ${summit?.name ?? 'Summit'}` };
}

export default async function SummitDetailPage({ params }: PageProps) {
  const { summitId } = await params;
  const summit = summits.find((s) => s.id === summitId);
  if (!summit) notFound();

  return (
    <PageContainer pageTitle={summit.name} pageDescription={summit.location}>
      <SummitDetail summit={summit} />
    </PageContainer>
  );
}
