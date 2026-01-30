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
    }
};
