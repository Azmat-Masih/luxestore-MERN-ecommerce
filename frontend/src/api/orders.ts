import api from './client';

export interface ShippingAddress {
    address: string;
    city: string;
    postalCode: string;
    country: string;
}

export interface OrderItem {
    name: string;
    qty: number;
    image: string;
    price: number;
    product: string;
}

export interface Order {
    _id: string;
    user: string;
    orderItems: OrderItem[];
    shippingAddress: ShippingAddress;
    paymentMethod: string;
    itemsPrice: number;
    taxPrice: number;
    shippingPrice: number;
    totalPrice: number;
    isPaid: boolean;
    paidAt?: string;
    isDelivered: boolean;
    deliveredAt?: string;
    status: string;
    createdAt: string;
}

export interface CreateOrderData {
    orderItems: OrderItem[];
    shippingAddress: ShippingAddress;
    paymentMethod: string;
    itemsPrice: number;
    taxPrice: number;
    shippingPrice: number;
    totalPrice: number;
}

export const orderApi = {
    createOrder: async (orderData: CreateOrderData): Promise<Order> => {
        const { data } = await api.post('/api/orders', orderData);
        return data;
    },

    getOrderById: async (id: string): Promise<Order> => {
        const { data } = await api.get(`/api/orders/${id}`);
        return data;
    },

    getMyOrders: async (): Promise<Order[]> => {
        const { data } = await api.get('/api/orders/myorders');
        return data;
    },

    payOrder: async (orderId: string, paymentResult: { id: string; status: string; update_time: string; payer?: { email_address: string } }): Promise<Order> => {
        const { data } = await api.put(`/api/orders/${orderId}/pay`, paymentResult);
        return data;
    },
};

export const paymentApi = {
    getStripeConfig: async (): Promise<{ publishableKey: string }> => {
        const { data } = await api.get('/api/payments/config');
        return data;
    },

    createPaymentIntent: async (orderId: string): Promise<{ clientSecret: string }> => {
        const { data } = await api.post('/api/payments/create-payment-intent', { orderId });
        return data;
    },
};
