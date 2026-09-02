'use client';

import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { teamInfoContent } from '@/config/infoconfig';
import { demoUser } from '@/constants/demo-user';
import { UserAvatarProfile } from '@/components/user-avatar-profile';

export default function TeamPage() {
  return (
    <PageContainer
      pageTitle='Team Management'
      pageDescription='Manage your workspace team, members, roles, security and more.'
      infoContent={teamInfoContent}
    >
      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
        </CardHeader>
        <CardContent className='flex items-center gap-3'>
          <UserAvatarProfile user={demoUser} showInfo />
          <span className='text-muted-foreground text-xs'>Admin</span>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
