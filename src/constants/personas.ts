// Static demo personas — lets the prototype show first-time vs returning user layouts
// without a real auth backend. Switched from the sidebar footer account menu.

export type PersonaId = 'first-time' | 'returning';

export interface Persona {
  id: PersonaId;
  fullName: string;
  imageUrl: string;
  emailAddresses: [{ emailAddress: string }];
  role: string;
  hasActivity: boolean;
  greeting: string;
  subline: string;
}

export const personas: Record<PersonaId, Persona> = {
  'first-time': {
    id: 'first-time',
    fullName: 'Alex Rivera',
    imageUrl: '',
    emailAddresses: [{ emailAddress: 'alex@newcorp.com' }],
    role: 'New member',
    hasActivity: false,
    greeting: 'Welcome to Combo Banana 👋',
    subline: "Ask me anything to get started — I'll help you find and budget your first summit."
  },
  returning: {
    id: 'returning',
    fullName: 'Sarah Kim',
    imageUrl: '',
    emailAddresses: [{ emailAddress: 'sarah@acmecloud.com' }],
    role: 'Admin',
    hasActivity: true,
    greeting: 'Good morning, Sarah ☀️',
    subline: "Here's your AI morning brief"
  }
};

export const personaList = Object.values(personas);
