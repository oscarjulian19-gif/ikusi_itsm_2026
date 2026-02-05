import { create } from 'zustand';
import { aiApi } from '../services/apiClient';

const useIncidentStore = create((set, get) => ({
    incidents: [],
    currentIncident: null,
    loading: false,
    error: null,
    validationResult: null, // Stores AI feedback for the current step

    fetchIncidents: async () => {
        set({ loading: true, error: null });
        try {
            const data = await aiApi.getTickets();
            set({ incidents: data, loading: false });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },

    getIncidentById: (id) => {
        const { incidents } = get();
        return incidents.find(i => i.id === id) || null;
    },

    createIncident: async (data) => {
        set({ loading: true });
        try {
            const newInc = await aiApi.createTicket(data);
            set(state => ({
                incidents: [newInc, ...state.incidents],
                loading: false
            }));
            return newInc;
        } catch (err) {
            set({ error: err.message, loading: false });
            throw err;
        }
    },

    startResolution: async (id) => {
        set({ loading: true });
        try {
            const updated = await aiApi.startResolution(id);
            set(state => ({
                incidents: state.incidents.map(i => i.id === id ? updated : i),
                currentIncident: updated,
                loading: false
            }));
        } catch (err) { set({ error: err.message, loading: false }); }
    },

    validateStep: async (id, stepNumber, content) => {
        set({ loading: true, validationResult: null });
        try {
            const result = await aiApi.validateStep(id, stepNumber, content);
            set({ validationResult: result, loading: false });
            return result;
        } catch (err) {
            set({ error: err.message, loading: false });
            return null;
        }
    },

    submitStep: async (id, stepNumber, content) => {
        set({ loading: true, validationResult: null });
        try {
            const updated = await aiApi.submitStep(id, stepNumber, content);
            set(state => ({
                incidents: state.incidents.map(i => i.id === id ? updated : i),
                currentIncident: updated,
                loading: false
            }));
        } catch (err) { set({ error: err.message, loading: false }); }
    },

    pauseIncident: async (id, reason, comments) => {
        set({ loading: true });
        try {
            const updated = await aiApi.pauseTicket(id, reason, comments);
            set(state => ({
                incidents: state.incidents.map(i => i.id === id ? updated : i),
                currentIncident: updated,
                loading: false
            }));
        } catch (err) { set({ error: err.message, loading: false }); }
    },

    resumeIncident: async (id) => {
        set({ loading: true });
        try {
            const updated = await aiApi.resumeTicket(id);
            set(state => ({
                incidents: state.incidents.map(i => i.id === id ? updated : i),
                currentIncident: updated,
                loading: false
            }));
        } catch (err) { set({ error: err.message, loading: false }); }
    },

    closeIncident: async (id) => {
        set({ loading: true });
        try {
            const updated = await aiApi.closeTicket(id);
            set(state => ({
                incidents: state.incidents.map(i => i.id === id ? updated : i),
                currentIncident: updated,
                loading: false
            }));
        } catch (err) { set({ error: err.message, loading: false }); }
    }
}));

export default useIncidentStore;
