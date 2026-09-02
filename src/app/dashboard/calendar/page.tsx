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
  title: 'Dashboard: Calendar'
};

export default function CalendarPage() {
  return (
    <PageContainer
      pageTitle='Calendar'
      pageDescription='Showings, inspections and closings in one view.'
    >
      <Empty className='flex-1 border'>
        <EmptyHeader>
          <EmptyMedia variant='icon'>
            <Icons.calendar />
          </EmptyMedia>
          <EmptyTitle>Calendar is coming soon</EmptyTitle>
          <EmptyDescription>A unified team calendar is on the roadmap.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </PageContainer>
  );
}
