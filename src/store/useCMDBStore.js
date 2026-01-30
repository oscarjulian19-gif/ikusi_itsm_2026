import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { INITIAL_CIS } from '../data/initialData';

const useCMDBStore = create(
    persist(
        (set, get) => ({
            cis: INITIAL_CIS,

            addCI: (newCI) => set((state) => ({ cis: [newCI, ...state.cis] })),

            updateCI: (id, updates) => set((state) => ({
                cis: state.cis.map((c) => (c.id === id ? { ...c, ...updates } : c))
            })),

            deleteCI: (id) => set((state) => ({
                cis: state.cis.filter((c) => c.id !== id)
            })),

            getCIById: (id) => get().cis.find((c) => c.id === id)
        }),
        {
            name: 'ikusi-cmdb-storage',
            getStorage: () => localStorage,
        }
    )
);

export default useCMDBStore;
