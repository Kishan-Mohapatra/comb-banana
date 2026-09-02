import { NavGroup } from '@/types';

/**
 * Navigation configuration for the AI Morning Command Centre.
 *
 * Used for both the sidebar navigation and the Cmd+K bar.
 * Items are organized into groups, each rendered with a SidebarGroupLabel.
 */
export const navGroups: NavGroup[] = [
  {
    label: 'Core',
    items: [
      {
        title: 'Command Centre',
        url: '/dashboard/command-centre',
        icon: 'brokerage',
        isActive: false,
        shortcut: ['c', 'c'],
        items: []
      },
      {
        title: 'Discover Summits',
        url: '/dashboard/discover',
        icon: 'search',
        isActive: false,
        shortcut: ['d', 's'],
        items: []
      },
      {
        title: 'My Summits',
        url: '/dashboard/summits',
        icon: 'listings',
        isActive: false,
        shortcut: ['m', 's'],
        items: []
      },
      {
        title: 'Budget & Vendors',
        url: '/dashboard/budget',
        icon: 'transactions',
        isActive: false,
        shortcut: ['b', 'v'],
        items: []
      }
    ]
  },
  {
    label: 'Ops',
    items: [
      {
        title: 'Reporting',
        url: '/dashboard/reporting',
        icon: 'reports',
        isActive: false,
        shortcut: ['r', 'e'],
        items: []
      },
      {
        title: 'Calendar',
        url: '/dashboard/calendar',
        icon: 'calendar',
        isActive: false,
        shortcut: ['c', 'a'],
        items: []
      },
      {
        title: 'Team',
        url: '/dashboard/workspaces/team',
        icon: 'teams',
        isActive: false,
        items: []
      }
    ]
  },
  {
    label: '',
    items: [
      {
        title: 'Account',
        url: '#',
        icon: 'account',
        isActive: true,
        items: [
          {
            title: 'Profile',
            url: '/dashboard/profile',
            icon: 'profile',
            shortcut: ['m', 'm']
          },
          {
            title: 'Notifications',
            url: '/dashboard/notifications',
            icon: 'notification',
            shortcut: ['n', 'n']
          },
          {
            title: 'Billing',
            url: '/dashboard/billing',
            icon: 'billing',
            shortcut: ['b', 'b']
          },
          {
            title: 'Settings',
            url: '/dashboard/settings',
            icon: 'settings',
            shortcut: ['s', 's']
          }
        ]
      }
    ]
  }
];
