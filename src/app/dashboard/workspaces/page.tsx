'use client';

import PageContainer from '@/components/layout/page-container';
import { workspacesInfoContent } from '@/config/infoconfig';
import { demoOrganization } from '@/constants/demo-user';

export default function WorkspacesPage() {
  return (
    <PageContainer
      pageTitle='Workspaces'
      pageDescription='Manage your workspaces and switch between them'
      infoContent={workspacesInfoContent}
    >
      <div className='space-y-2'>
        <div className='rounded-lg border p-4'>
          <div className='text-lg font-semibold'>{demoOrganization.name}</div>
          <div className='text-muted-foreground text-sm'>{demoOrganization.role}</div>
        </div>
      </div>
    </PageContainer>
  );
}
