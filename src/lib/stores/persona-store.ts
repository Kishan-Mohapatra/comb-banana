import { create } from 'zustand';
import { personas, type PersonaId } from '@/constants/personas';

interface PersonaState {
  personaId: PersonaId;
  setPersonaId: (id: PersonaId) => void;
}

export const usePersonaStore = create<PersonaState>((set) => ({
  personaId: 'returning',
  setPersonaId: (id) => set({ personaId: id })
}));

export function useCurrentPersona() {
  return usePersonaStore((s) => personas[s.personaId]);
}
