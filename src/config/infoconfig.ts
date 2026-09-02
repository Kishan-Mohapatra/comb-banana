import type { InfobarContent } from '@/components/ui/infobar';

export const workspacesInfoContent: InfobarContent = {
  title: 'Workspaces Management',
  sections: [
    {
      title: 'Overview',
      description:
        'The Workspaces page lets you manage your workspaces and switch between them. This is a static demo — workspace data is hardcoded, no backend is wired up.',
      links: []
    },
    {
      title: 'Creating Workspaces',
      description:
        'In a full build, clicking "Create Workspace" would prompt you to enter a name and configure initial settings, then let you switch to it immediately.',
      links: []
    },
    {
      title: 'Switching Workspaces',
      description:
        'You would switch between workspaces by clicking one in the list. The selected workspace becomes your active context for all workspace-scoped features.',
      links: []
    },
    {
      title: 'Workspace Features',
      description:
        'Each workspace would operate independently with its own team members, roles, permissions, and billing, keeping data and settings separate per project or team.',
      links: []
    }
  ]
};

export const teamInfoContent: InfobarContent = {
  title: 'Team Management',
  sections: [
    {
      title: 'Overview',
      description:
        'The Team Management page lets you manage your workspace team, including members, roles, and security settings. This is a static demo with a single hardcoded member.',
      links: []
    },
    {
      title: 'Managing Team Members',
      description:
        'In a full build, you could add, remove, and manage team members here — invite by email, assign roles, and control access levels per member.',
      links: []
    },
    {
      title: 'Roles and Permissions',
      description:
        'Roles define what actions team members can perform within a workspace. Common roles include admin, member, and custom roles you define.',
      links: []
    },
    {
      title: 'Navigation RBAC System',
      description:
        'The nav config in `src/config/nav-config.ts` supports `access` properties (requireOrg, permission, role) for gating items once real auth/org data exists.',
      links: []
    }
  ]
};

export const billingInfoContent: InfobarContent = {
  title: 'Billing & Plans',
  sections: [
    {
      title: 'Overview',
      description:
        'The Billing page lets you manage your subscription and usage limits. This is a static demo — no payment provider is wired up.',
      links: []
    },
    {
      title: 'Available Plans',
      description:
        'View and compare available plans below. In a full build, these would be managed through a billing dashboard and synced with a payment processor.',
      links: []
    },
    {
      title: 'Plan Features',
      description:
        'Each plan can unlock specific functionality in the application. Feature access would be checked in code once a real billing provider is connected.',
      links: []
    },
    {
      title: 'Access Control',
      description:
        'Plans and features would be used for access control throughout the application, with server-side checks and client-side conditional rendering.',
      links: []
    }
  ]
};

export const productInfoContent: InfobarContent = {
  title: 'Product Management',
  sections: [
    {
      title: 'Overview',
      description:
        'The Products page allows you to manage your product catalog. You can view all products in a table format with server-side functionality including sorting, filtering, pagination, and search capabilities. Use the "Add New" button to create new products.',
      links: [
        {
          title: 'Product Management Guide',
          url: '#'
        }
      ]
    },
    {
      title: 'Adding Products',
      description:
        'To add a new product, click the "Add New" button in the page header. You will be taken to a form where you can enter product details including name, description, price, category, and upload product images.',
      links: [
        {
          title: 'Adding Products Documentation',
          url: '#'
        }
      ]
    },
    {
      title: 'Editing Products',
      description:
        'You can edit existing products by clicking on a product row in the table. This will open the product edit form where you can modify any product information. Changes are saved automatically when you submit the form.',
      links: [
        {
          title: 'Editing Products Guide',
          url: '#'
        }
      ]
    },
    {
      title: 'Deleting Products',
      description:
        'Products can be deleted from the product listing table. Click the delete action for the product you want to remove. You will be asked to confirm the deletion before the product is permanently removed from your catalog.',
      links: [
        {
          title: 'Product Deletion Policy',
          url: '#'
        }
      ]
    },
    {
      title: 'Table Features',
      description:
        'The product table includes several powerful features to help you manage large product catalogs efficiently. You can sort columns by clicking on column headers, filter products using the filter controls, navigate through pages using pagination, and quickly find products using the search functionality.',
      links: [
        {
          title: 'Table Features Documentation',
          url: '#'
        },
        {
          title: 'Sorting and Filtering Guide',
          url: '#'
        }
      ]
    },
    {
      title: 'Product Fields',
      description:
        'Each product can have the following fields: Name (required), Description (optional text), Price (numeric value), Category (for organizing products), and Image Upload (for product photos). All fields can be edited when creating or updating a product.',
      links: [
        {
          title: 'Product Fields Specification',
          url: '#'
        }
      ]
    }
  ]
};
