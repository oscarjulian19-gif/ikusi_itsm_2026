import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { INITIAL_CASES } from '../data/initialData';

const useCaseStore = create(
    persist(
        (set, get) => ({
            cases: INITIAL_CASES,

            addCase: (newCase) => set((state) => ({
                cases: [newCase, ...state.cases]
            })),

            updateCase: (id, updates) => set((state) => ({
                cases: state.cases.map((c) =>
                    c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
                )
            })),

            deleteCase: (id) => set((state) => ({
                cases: state.cases.filter((c) => c.id !== id)
            })),

            getCaseById: (id) => {
                return get().cases.find((c) => c.id === id);
            },

            // Analytics helpers
            getStats: () => {
                const cases = get().cases;
                return {
                    total: cases.length,
                    open: cases.filter(c => c.status !== 'Cerrado' && c.status !== 'Resuelto').length,
                    critical: cases.filter(c => c.priority === 'P1').length,
                    slaBreached: 0 // Placeholder logic for now
                };
            }
        }),
        {
            name: 'ikusi-service-storage', // name of the item in the storage (must be unique)
            getStorage: () => localStorage, // (optional) by default, 'localStorage' is used
        }
    )
);

export default useCaseStore;
