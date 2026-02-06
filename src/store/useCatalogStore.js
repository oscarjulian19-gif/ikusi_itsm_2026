import { create } from 'zustand';
import { SERVICE_CATALOG, INCIDENT_SCENARIOS, REQUEST_SCENARIOS } from '../data/catalogData';

const API_URL = 'http://localhost:8000/api/v1';

const useCatalogStore = create((set, get) => ({
    services: [],
    incidents: [],
    requests: [],
    categories: [],
    loading: false,
    error: null,

    // Initial Fetch
    fetchCatalog: async () => {
        set({ loading: true });
        try {
            // Parallel fetch
            const [servicesRes, scenariosRes] = await Promise.all([
                fetch(`${API_URL}/services`),
                fetch(`${API_URL}/scenarios`)
            ]);

            if (!servicesRes.ok || !scenariosRes.ok) throw new Error('Failed to fetch catalog');

            const servicesData = await servicesRes.json();
            const scenariosData = await scenariosRes.json();

            // Split scenarios into incidents and requests
            // Map service_id (DB) to serviceId (Frontend)
            const mapScenario = (s) => ({ ...s, serviceId: s.service_id });

            const incidents = scenariosData.filter(s => s.type === 'incident').map(mapScenario);
            const requests = scenariosData.filter(s => s.type === 'request').map(mapScenario);
            const categories = [...new Set(servicesData.map(s => s.category))];

            set({
                services: servicesData,
                incidents,
                requests,
                categories,
                loading: false
            });
        } catch (err) {
            console.error(err);
            // Fallback to static data if API fails (optional, but good for stability during dev)
            set({
                services: SERVICE_CATALOG,
                incidents: INCIDENT_SCENARIOS,
                requests: REQUEST_SCENARIOS,
                categories: [...new Set(SERVICE_CATALOG.map(s => s.category))],
                loading: false,
                error: 'Modo Offline: No se pudo conectar con la BD'
            });
        }
    },

    // CRUD Actions with API
    addIncident: async (newIncident) => {
        try {
            // Map logic: Frontend uses serviceId, Backend expects service_id
            const payload = {
                ...newIncident,
                type: 'incident',
                service_id: newIncident.serviceId // Map manually
            };
            const res = await fetch(`${API_URL}/scenarios`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error('Failed to create');
            const saved = await res.json();
            // Saved comes back with service_id, map it for state
            const savedState = { ...saved, serviceId: saved.service_id };
            set((state) => ({ incidents: [...state.incidents, savedState] }));
        } catch (e) {
            console.error(e);
            alert("Error al guardar en BD");
        }
    },

    updateIncident: async (id, updatedData) => {
        try {
            const payload = {
                ...updatedData,
                type: 'incident',
                service_id: updatedData.serviceId
            };
            const res = await fetch(`${API_URL}/scenarios/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error('Failed to update');
            const saved = await res.json();
            const savedState = { ...saved, serviceId: saved.service_id };
            set((state) => ({
                incidents: state.incidents.map(i => i.id === id ? savedState : i)
            }));
        } catch (e) {
            console.error(e);
        }
    },

    deleteIncident: async (id) => {
        try {
            await fetch(`${API_URL}/scenarios/${id}`, { method: 'DELETE' });
            set((state) => ({
                incidents: state.incidents.filter(i => i.id !== id)
            }));
        } catch (e) { console.error(e); }
    },

    addRequest: async (newRequest) => {
        try {
            const payload = {
                ...newRequest,
                type: 'request',
                service_id: newRequest.serviceId
            };
            const res = await fetch(`${API_URL}/scenarios`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error('Failed to create');
            const saved = await res.json();
            const savedState = { ...saved, serviceId: saved.service_id };
            set((state) => ({ requests: [...state.requests, savedState] }));
        } catch (e) {
            console.error(e);
            alert("Error al guardar en BD");
        }
    },

    updateRequest: async (id, updatedData) => {
        try {
            const payload = {
                ...updatedData,
                type: 'request',
                service_id: updatedData.serviceId
            };
            const res = await fetch(`${API_URL}/scenarios/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error('Failed to update');
            const saved = await res.json();
            const savedState = { ...saved, serviceId: saved.service_id };
            set((state) => ({
                requests: state.requests.map(r => r.id === id ? savedState : r)
            }));
        } catch (e) { console.error(e); }
    },

    updateService: async (id, updatedData) => {
        try {
            const res = await fetch(`${API_URL}/services/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            });
            if (!res.ok) throw new Error('Failed to update service');
            const saved = await res.json();
            set((state) => ({
                services: state.services.map(s => s.id === id ? saved : s)
            }));
        } catch (e) { console.error(e); }
    },

    importData: async (formData) => {
        try {
            set({ loading: true });
            // Direct fetch or use apiClient if imported
            const res = await fetch(`${API_URL}/imports/catalog`, {
                method: 'POST',
                body: formData
            });
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.detail || "Upload failed");
            }
            const data = await res.json();

            // Show result
            let msg = `Proceso completado. Servicios: ${data.services_processed}, Escenarios: ${data.scenarios_processed}.`;
            if (data.errors && data.errors.length > 0) {
                msg += `\nAdvertencias (${data.errors.length}): Ver consola para detalles.`;
                console.warn("Import Warnings:", data.errors);
            }
            alert(msg);

            await get().fetchCatalog(); // Refresh data
        } catch (e) {
            console.error(e);
            alert(`Error en importación: ${e.message}`);
            throw e;
        } finally {
            set({ loading: false });
        }
    },

    // Getters Actions (Synchronous from local state)
    getIncident: (id) => get().incidents.find(i => String(i.id).trim() === String(id).trim()),
    getRequest: (id) => get().requests.find(r => String(r.id).trim() === String(id).trim()),
    getService: (id) => get().services.find(s => s.id === id),

    // Helpers
    getNextServiceId: () => 'NEW-000',
    getServicesByCategory: (cat) => get().services.filter(s => s.category === cat),
    getScenariosForService: (serviceId, type = 'incident') => {
        const list = type === 'incident' ? get().incidents : get().requests;
        return list.filter(item => item.serviceId === serviceId);
    }
}));

export default useCatalogStore;
