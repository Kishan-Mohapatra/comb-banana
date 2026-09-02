'use client';

// ponytail: RBAC (permission/role/plan checks) needs a real backend + auth provider.
// This prototype has neither, so nav items are shown unfiltered. Re-add filtering
// logic here once real auth/org data exists.

import type { NavItem, NavGroup } from '@/types';

export function useFilteredNavItems(items: NavItem[]) {
  return items;
}

export function useFilteredNavGroups(groups: NavGroup[]) {
  return groups;
}
