import api from './client';

export interface CartItem {
    product: string;
    name: string;
    image: string;
    price: number;
    qty: number;
    countInStock: number;
}

export interface Cart {
    _id: string;
    user: string;
    cartItems: CartItem[];
}

export const cartApi = {
    getCart: async (): Promise<Cart> => {
        const { data } = await api.get('/api/cart');
        return data;
    },

    addToCart: async (productId: string, qty: number): Promise<Cart> => {
        const { data } = await api.post('/api/cart', { productId, qty });
        return data;
    },

    removeFromCart: async (productId: string): Promise<Cart> => {
        const { data } = await api.delete(`/api/cart/${productId}`);
        return data;
    },

    clearCart: async (): Promise<void> => {
        await api.delete('/api/cart');
    },

    syncCart: async (cartItems: CartItem[]): Promise<Cart> => {
        const { data } = await api.put('/api/cart/sync', { cartItems });
        return data;
    },
};
