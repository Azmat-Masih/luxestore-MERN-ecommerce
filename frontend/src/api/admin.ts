import api from './client';
import { User } from './auth';
import { Product } from './products';
import { Order } from './orders';

export const adminApi = {
    // User management
    getUsers: async (): Promise<User[]> => {
        const { data } = await api.get('/api/users');
        return data;
    },
    deleteUser: async (id: string): Promise<void> => {
        await api.delete(`/api/users/${id}`);
    },
    getUserById: async (id: string): Promise<User> => {
        const { data } = await api.get(`/api/users/${id}`);
        return data;
    },
    updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
        const { data } = await api.put(`/api/users/${id}`, userData);
        return data;
    },

    // Product management
    createProduct: async (productData: Partial<Product>): Promise<Product> => {
        const { data } = await api.post('/api/products', productData);
        return data;
    },
    updateProduct: async (id: string, productData: Partial<Product>): Promise<Product> => {
        const { data } = await api.put(`/api/products/${id}`, productData);
        return data;
    },
    deleteProduct: async (id: string): Promise<void> => {
        await api.delete(`/api/products/${id}`);
    },

    // Order management
    getOrders: async (): Promise<Order[]> => {
        const { data } = await api.get('/api/orders');
        return data;
    },
    deliverOrder: async (id: string): Promise<Order> => {
        const { data } = await api.put(`/api/orders/${id}/deliver`);
        return data;
    },
    updateOrderStatus: async (id: string, status: string): Promise<Order> => {
        const { data } = await api.put(`/api/orders/${id}/status`, { status });
        return data;
    },
};
