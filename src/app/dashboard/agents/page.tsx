import PageContainer from '@/components/layout/page-container';
import { AgentsTable } from '@/features/agents/components/agents-table';

export const metadata = {
  title: 'Dashboard: Agents'
};

export default function AgentsPage() {
  return (
    <PageContainer
      pageTitle='AI Agent Fleet'
      pageDescription='Command view of the 112 AI agents working alongside your team.'
    >
      <AgentsTable />
    </PageContainer>
  );
}
