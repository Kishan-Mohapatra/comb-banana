import PageContainer from '@/components/layout/page-container';
import { CommandCentreShell } from '@/features/command-centre/components/command-centre-shell';

export const metadata = {
  title: 'Dashboard: Morning Command Centre'
};

export default function CommandCentrePage() {
  return (
    <PageContainer>
      <CommandCentreShell />
    </PageContainer>
  );
}
