import { create } from 'zustand';
import { aiApi } from '../services/apiClient';

const useSlaStore = create((set, get) => ({
    slas: [],
    packages: [],
    loading: false,
    error: null,

    fetchSlas: async () => {
        set({ loading: true });
        try {
            const data = await aiApi.getSlas();
            set({ slas: data, loading: false });
        } catch (err) { set({ error: err.message, loading: false }); }
    },

    updateSla: async (id, data) => {
        set({ loading: true });
        try {
            const updated = await aiApi.updateSla(id, data);
            set(state => ({
                slas: state.slas.map(s => s.id === id ? updated : s),
                loading: false
            }));
        } catch (err) { set({ error: err.message, loading: false }); }
    },

    fetchPackages: async () => {
        set({ loading: true });
        try {
            const data = await aiApi.getPackages();
            set({ packages: data, loading: false });
        } catch (err) { set({ error: err.message, loading: false }); }
    },

    createPackage: async (data) => {
        set({ loading: true });
        try {
            const newPkg = await aiApi.createPackage(data);
            set(state => ({
                packages: [...state.packages, newPkg],
                loading: false
            }));
        } catch (err) { set({ error: err.message, loading: false }); }
    },

    updatePackage: async (id, data) => {
        set({ loading: true });
        try {
            const updated = await aiApi.updatePackage(id, data);
            set(state => ({
                packages: state.packages.map(p => p.id === id ? updated : p),
                loading: false
            }));
        } catch (err) { set({ error: err.message, loading: false }); }
    },

    deletePackage: async (id) => {
        set({ loading: true });
        try {
            await aiApi.deletePackage(id);
            set(state => ({
                packages: state.packages.filter(p => p.id !== id),
                loading: false
            }));
        } catch (err) { set({ error: err.message, loading: false }); }
    }
}));

export default useSlaStore;
