import api from './client';

export interface Product {
    _id: string;
    name: string;
    slug: string;
    image: string;
    images: string[];
    brand: string;
    category: string;
    description: string;
    rating: number;
    numReviews: number;
    price: number;
    countInStock: number;
    attributes: {
        size: string[];
        color: string[];
    };
}

export interface ProductsResponse {
    products: Product[];
    page: number;
    pages: number;
    total: number;
}

export interface ProductFilters {
    keyword?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    pageNumber?: number;
    pageSize?: number;
}

export const productApi = {
    getProducts: async (filters: ProductFilters = {}): Promise<ProductsResponse> => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined) params.append(key, String(value));
        });
        const { data } = await api.get(`/api/products?${params.toString()}`);
        return data;
    },

    getProductById: async (id: string): Promise<Product> => {
        const { data } = await api.get(`/api/products/${id}`);
        return data;
    },

    getTopProducts: async (): Promise<Product[]> => {
        const { data } = await api.get('/api/products/top');
        return data;
    },

    getCategories: async (): Promise<string[]> => {
        const { data } = await api.get('/api/products/categories');
        return data;
    },

    createReview: async (productId: string, review: { rating: number; comment: string }): Promise<void> => {
        await api.post(`/api/products/${productId}/reviews`, review);
    },
};
