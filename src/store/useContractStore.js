import { create } from 'zustand';
import { aiApi } from '../services/apiClient';

const useContractStore = create((set, get) => ({
    contracts: [],
    total: 0,
    loading: false,
    error: null,

    // Fetch from API
    fetchContracts: async (params = { skip: 0, limit: 100, search: '' }) => {
        set({ loading: true, error: null });
        try {
            const response = await aiApi.getContracts(params);
            set({
                contracts: response.data || [],
                total: response.total || 0,
                loading: false
            });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },

    getContract: async (id) => {
        try {
            set({ loading: true });
            const contract = await aiApi.getContract(id);
            // Update or add to list
            set((state) => {
                const existingIdx = state.contracts.findIndex(c => c.id === id);
                if (existingIdx >= 0) {
                    const newContracts = [...state.contracts];
                    newContracts[existingIdx] = contract;
                    return { contracts: newContracts, loading: false };
                } else {
                    return { contracts: [...state.contracts, contract], loading: false };
                }
            });
            return contract;
        } catch (err) {
            set({ error: err.message, loading: false });
            throw err;
        }
    },

    uploadContracts: async (file) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const result = await aiApi.uploadContracts(formData);
            return result;
        } catch (err) {
            console.error("Upload failed", err);
            throw err;
        }
    },

    // Add via API
    addContract: async (contractData) => {
        try {
            const newContract = await aiApi.createContract(contractData);
            set((state) => ({ contracts: [newContract, ...state.contracts] }));
            return newContract;
        } catch (err) {
            console.error("Failed to add contract", err);
            throw err;
        }
    },

    // Initial Load Logic (can be called by Component or Router)
    // For now we keep updateContract mock-ish or impl later
    // Updated with Real API Call
    updateContract: async (id, data) => {
        try {
            set({ loading: true });
            const updated = await aiApi.updateContract(id, data);
            set((state) => ({
                loading: false,
                contracts: state.contracts.map(c => c.id === id ? { ...c, ...data } : c)
            }));
            return updated;
        } catch (err) {
            console.error("Failed to update contract", err);
            set({ error: err.message, loading: false });
            throw err;
        }
    },

    importContracts: async (newContractsData) => {
        // Batch create not implemented in backend yet, doing loop for now
        for (const c of newContractsData) {
            await get().addContract(c);
        }
    }
}));

export default useContractStore;
