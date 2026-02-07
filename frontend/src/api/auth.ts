import api from './client';

export interface User {
    _id: string;
    name: string;
    email: string;
    isAdmin: boolean;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
}

export const authApi = {
    login: async (credentials: LoginCredentials): Promise<User> => {
        const { data } = await api.post('/api/users/auth', credentials);
        return data;
    },

    register: async (userData: RegisterData): Promise<User> => {
        const { data } = await api.post('/api/users', userData);
        return data;
    },

    logout: async (): Promise<void> => {
        await api.post('/api/users/logout');
    },

    getProfile: async (): Promise<User> => {
        const { data } = await api.get('/api/users/profile');
        return data;
    },

    updateProfile: async (userData: Partial<User & { password?: string }>): Promise<User> => {
        const { data } = await api.put('/api/users/profile', userData);
        return data;
    },
};
