'use client';

import { Icons } from '@/components/icons';
import { demoOrganization } from '@/constants/demo-user';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar';

export function OrgSwitcher() {
  const { state } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size='lg' className='cursor-default'>
          <div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg'>
            <Icons.galleryVerticalEnd className='size-4' />
          </div>
          <div
            className={`grid flex-1 text-left text-sm leading-tight transition-all duration-200 ease-in-out ${
              state === 'collapsed'
                ? 'invisible max-w-0 overflow-hidden opacity-0'
                : 'visible max-w-full opacity-100'
            }`}
          >
            <span className='truncate font-medium'>{demoOrganization.name}</span>
            <span className='text-muted-foreground truncate text-xs'>{demoOrganization.role}</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
