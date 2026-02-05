import { create } from 'zustand';
import { aiApi } from '../services/apiClient';

const useUserStore = create((set, get) => ({
    users: [],
    loading: false,
    error: null,

    fetchUsers: async () => {
        set({ loading: true, error: null });
        try {
            const data = await aiApi.getUsers();
            set({ users: data, loading: false });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },

    addUser: async (userData) => {
        set({ loading: true });
        try {
            const newUser = await aiApi.createUser(userData);
            set(state => ({
                users: [...state.users, newUser],
                loading: false
            }));
            return newUser;
        } catch (err) {
            set({ error: err.message, loading: false });
            throw err;
        }
    },

    updateUser: async (id, userData) => {
        set({ loading: true });
        try {
            const updated = await aiApi.updateUser(id, userData);
            set(state => ({
                users: state.users.map(u => u.id === id ? updated : u),
                loading: false
            }));
        } catch (err) {
            set({ error: err.message, loading: false });
            throw err;
        }
    },

    deleteUser: async (id) => {
        try {
            await aiApi.deleteUser(id);
            set(state => ({
                users: state.users.filter(u => u.id !== id)
            }));
        } catch (err) {
            console.error("Failed to delete user", err);
        }
    }
}));

export default useUserStore;
