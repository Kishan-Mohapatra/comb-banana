'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { summits } from '@/constants/summit-data';

type BreadcrumbItem = {
  title: string;
  link: string;
};

// This allows to add custom title as well
const routeMapping: Record<string, BreadcrumbItem[]> = {
  '/dashboard': [{ title: 'Dashboard', link: '/dashboard' }],
  '/dashboard/employee': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Employee', link: '/dashboard/employee' }
  ],
  '/dashboard/product': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Product', link: '/dashboard/product' }
  ],
  '/dashboard/discover': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Discover Summits', link: '/dashboard/discover' }
  ]
  // Add more custom mappings as needed
};

export function useBreadcrumbs() {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    // Check if we have a custom mapping for this exact path
    if (routeMapping[pathname]) {
      return routeMapping[pathname];
    }

    // 3rd-level: /dashboard/discover/<summitId> — show the summit's real name
    const discoverDetailMatch = pathname.match(/^\/dashboard\/discover\/([^/]+)$/);
    if (discoverDetailMatch) {
      const summit = summits.find((s) => s.id === discoverDetailMatch[1]);
      return [
        { title: 'Dashboard', link: '/dashboard' },
        { title: 'Discover Summits', link: '/dashboard/discover' },
        { title: summit?.name ?? 'Summit', link: pathname }
      ];
    }

    // If no exact match, fall back to generating breadcrumbs from the path
    const segments = pathname.split('/').filter(Boolean);
    return segments.map((segment, index) => {
      const path = `/${segments.slice(0, index + 1).join('/')}`;
      return {
        title: segment.charAt(0).toUpperCase() + segment.slice(1),
        link: path
      };
    });
  }, [pathname]);

  return breadcrumbs;
}
