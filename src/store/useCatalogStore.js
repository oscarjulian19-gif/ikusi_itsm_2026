import { create } from 'zustand';
import { SERVICE_CATALOG, INCIDENT_SCENARIOS, REQUEST_SCENARIOS } from '../data/catalogData';

const useCatalogStore = create((set, get) => ({
    services: SERVICE_CATALOG,
    incidents: INCIDENT_SCENARIOS,
    requests: REQUEST_SCENARIOS,
    categories: [...new Set(SERVICE_CATALOG.map(s => s.category))],

    // Actions
    addCategory: (newCategory) => set((state) => ({ categories: [...state.categories, newCategory] })),
    addService: (newService) => set((state) => ({ services: [...state.services, newService] })),

    addIncident: (newIncident) => set((state) => ({ incidents: [...state.incidents, newIncident] })),
    updateIncident: (id, updatedData) => set((state) => ({
        incidents: state.incidents.map(i => i.id === id ? { ...i, ...updatedData } : i)
    })),

    addRequest: (newRequest) => set((state) => ({ requests: [...state.requests, newRequest] })),
    updateRequest: (id, updatedData) => set((state) => ({
        requests: state.requests.map(r => r.id === id ? { ...r, ...updatedData } : r)
    })),

    // Getters Actions (Simulating async for consistency with other stores if needed, but synchronous here)
    getIncident: (id) => get().incidents.find(i => i.id === id),
    getRequest: (id) => get().requests.find(r => r.id === id),
    getService: (id) => get().services.find(s => s.id === id),


    // Helpers for ID generation
    getNextServiceId: (categoryPrefix) => {
        // Simple heuristic: find max ID with prefix
        // For now, let's assume user provides ID or we generate simple one
        // Ideally we scan existing IDs.
        // Implementation can be added in the UI component or here.
        return 'NEW-000';
    },

    // Getters that act as selectors (optional, but good for logic)
    getServicesByCategory: (cat) => get().services.filter(s => s.category === cat),
    getScenariosForService: (serviceId, type = 'incident') => {
        const list = type === 'incident' ? get().incidents : get().requests;
        return list.filter(item => item.serviceId === serviceId);
    }
}));

export default useCatalogStore;
