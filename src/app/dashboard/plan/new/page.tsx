import { Suspense } from 'react';
import PageContainer from '@/components/layout/page-container';
import { QuestionnaireWizard } from '@/features/questionnaire/components/questionnaire-wizard';

export const metadata = {
  title: 'Dashboard: Questionnaire'
};

export default function QuestionnairePage() {
  return (
    <PageContainer
      pageTitle='Questionnaire'
      pageDescription='Narrow a summit down into a concrete participation package.'
    >
      <Suspense>
        <QuestionnaireWizard />
      </Suspense>
    </PageContainer>
  );
}
