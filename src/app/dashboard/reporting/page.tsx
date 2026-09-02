import PageContainer from '@/components/layout/page-container';
import { ReportingDashboard } from '@/features/reporting/components/reporting-dashboard';

export const metadata = {
  title: 'Dashboard: Reporting'
};

export default function ReportingPage() {
  return (
    <PageContainer pageTitle='Reporting' pageDescription='Spend across summits at a glance.'>
      <ReportingDashboard />
    </PageContainer>
  );
}
