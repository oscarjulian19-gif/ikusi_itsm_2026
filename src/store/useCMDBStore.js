import { create } from 'zustand';
import { aiApi } from '../services/apiClient';

const useCMDBStore = create((set, get) => ({
    cis: [],
    total: 0,
    loading: false,
    error: null,

    fetchCIs: async (params = { skip: 0, limit: 100, search: '' }) => {
        set({ loading: true, error: null });
        try {
            const response = await aiApi.getCIs(params);
            set({
                cis: response.data || [],
                total: response.total || 0,
                loading: false
            });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },

    uploadCIs: async (file) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const result = await aiApi.uploadCMDB(formData);
            return result;
        } catch (err) {
            console.error("Upload failed", err);
            throw err;
        }
    },

    addCI: async (ciData) => {
        try {
            const newCI = await aiApi.createCI(ciData);
            set((state) => ({ cis: [newCI, ...state.cis] }));
            return newCI;
        } catch (err) {
            console.error("Failed to add CI", err);
            throw err;
        }
    },

    updateCI: async (id, ciData) => {
        try {
            await aiApi.updateCI(id, ciData);
            set((state) => ({
                cis: state.cis.map(c => c.id === id ? { ...c, ...ciData } : c)
            }));
        } catch (err) {
            console.error("Failed to update CI", err);
            throw err;
        }
    },

    importCIs: async (newCIsData) => {
        // Loop import
        for (const ci of newCIsData) {
            await get().addCI(ci);
        }
    },

    // Optional: Keep getCIById for instant lookups if already fetched
    getCIById: (id) => get().cis.find((c) => c.id === id)
}));

export default useCMDBStore;
