import { create } from 'zustand';
import { aiApi } from '../services/apiClient';

const useAuthStore = create((set) => ({
    user: JSON.parse(localStorage.getItem('ikusi_user')) || null,
    loading: false,
    error: null,

    login: async (email, password) => {
        set({ loading: true, error: null });
        try {
            const user = await aiApi.login(email, password);
            localStorage.setItem('ikusi_user', JSON.stringify(user));
            set({ user, loading: false });
            return user;
        } catch (err) {
            set({ error: err.message, loading: false });
            throw err;
        }
    },

    logout: () => {
        localStorage.removeItem('ikusi_user');
        set({ user: null });
    },

    isAdmin: () => {
        const user = JSON.parse(localStorage.getItem('ikusi_user'));
        return user?.role?.toLowerCase() === 'admin';
    }
}));

export default useAuthStore;
