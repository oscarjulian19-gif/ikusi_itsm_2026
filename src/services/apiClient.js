const API_BASE_URL = 'http://localhost:8000/api/v1';

/**
 * Generic fetch wrapper to handle JSON and Errors
 */
async function request(endpoint, options = {}) {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(errorBody.detail || `API Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API Request Failed:', error);
        throw error;
    }
}

export const aiApi = {
    /**
     * Send ticket data to Python Backend for Gemini Analysis (RAG)
     * @param {Object} ticket - { id, title, description, priority, status }
     */
    analyzeTicket: async (ticket) => {
        return request('/tickets/analyze', {
            method: 'POST',
            body: JSON.stringify(ticket)
        });
    },

    chat: async (message) => {
        return request('/chat', {
            method: 'POST',
            body: JSON.stringify({ message })
        });
    },

    /**
     * Health check for Flash 2.0 Backend
     */
    checkHealth: async () => {
        try {
            await fetch('http://localhost:8000/');
            return true;
        } catch (e) {
            return false;
        }
    },

    // --- CONTRACTS ---
    getContracts: async (params) => {
        const query = new URLSearchParams(params).toString();
        return request(`/contracts?${query}`);
    },

    getContract: async (id) => {
        return request(`/contracts/${id}`);
    },

    createContract: async (contractData) => {
        return request('/contracts', {
            method: 'POST',
            body: JSON.stringify(contractData)
        });
    },

    updateContract: async (id, contractData) => {
        return request(`/contracts/${id}`, {
            method: 'PUT',
            body: JSON.stringify(contractData)
        });
    },

    uploadContracts: async (formData) => {
        const response = await fetch(`${API_BASE_URL}/imports/contracts`, {
            method: 'POST',
            body: formData
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ detail: 'Network error or server failed' }));
            throw new Error(errorData.detail || `Upload failed: ${response.status}`);
        }
        return response.json();
    },

    // --- CMDB ---
    getCIs: async (params) => {
        const query = new URLSearchParams(params).toString();
        return request(`/cmdb?${query}`);
    },

    uploadCMDB: async (formData) => {
        const response = await fetch(`${API_BASE_URL}/imports/cmdb`, {
            method: 'POST',
            body: formData
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ detail: 'Network error or server failed' }));
            throw new Error(errorData.detail || `Upload failed: ${response.status}`);
        }
        return response.json();
    },

    uploadCatalog: async (formData) => {
        const response = await fetch(`${API_BASE_URL}/imports/catalog`, {
            method: 'POST',
            body: formData
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ detail: 'Network error or server failed' }));
            throw new Error(errorData.detail || `Upload failed: ${response.status}`);
        }
        return response.json();
    },

    createCI: async (ciData) => {
        return request('/cmdb', {
            method: 'POST',
            body: JSON.stringify(ciData)
        });
    },

    updateCI: async (id, ciData) => {
        return request(`/cmdb/${id}`, {
            method: 'PUT',
            body: JSON.stringify(ciData)
        });
    },

    // --- USERS ---
    getUsers: async () => {
        return request('/users?limit=100');
    },

    createUser: async (userData) => {
        return request('/users', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    },

    updateUser: async (id, userData) => {
        return request(`/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(userData)
        });
    },

    deleteUser: async (id) => {
        return request(`/users/${id}`, {
            method: 'DELETE'
        });
    },

    // --- INCIDENTS (P7M6) ---
    getTickets: async () => {
        return request('/tickets?limit=100');
    },

    createTicket: async (ticketData) => {
        return request('/tickets', {
            method: 'POST',
            body: JSON.stringify(ticketData)
        });
    },

    startResolution: async (id) => {
        return request(`/tickets/${id}/start_resolution`, { method: 'PUT' });
    },

    validateStep: async (id, stepNumber, content) => {
        return request(`/tickets/${id}/validate_step`, {
            method: 'POST',
            body: JSON.stringify({ step_number: stepNumber, content })
        });
    },

    submitStep: async (id, stepNumber, content) => {
        return request(`/tickets/${id}/submit_step`, {
            method: 'PUT',
            body: JSON.stringify({ step_number: stepNumber, content })
        });
    },

    pauseTicket: async (id, reason, comments) => {
        return request(`/tickets/${id}/pause`, {
            method: 'POST',
            body: JSON.stringify({ reason, comments })
        });
    },

    resumeTicket: async (id) => {
        return request(`/tickets/${id}/resume`, { method: 'POST' });
    },

    confirmClosure: async (id) => {
        return request(`/tickets/${id}/confirm_closure`, { method: 'PUT' });
    },

    // --- CONFIG (SLAs & Packages) ---
    getSlas: async () => {
        return request('/config/slas');
    },
    updateSla: async (id, data) => {
        return request(`/config/slas/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    },
    getPackages: async () => {
        return request('/config/packages');
    },
    createPackage: async (data) => {
        return request('/config/packages', { method: 'POST', body: JSON.stringify(data) });
    },
    updatePackage: async (id, data) => {
        return request(`/config/packages/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    },
    deletePackage: async (id) => {
        return request(`/config/packages/${id}`, { method: 'DELETE' });
    }
};
