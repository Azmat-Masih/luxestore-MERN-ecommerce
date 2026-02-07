import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { adminApi } from '../api/admin';
import { productApi } from '../api/products';
import { formatPrice } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';

export const AdminProductList: React.FC = () => {
    const queryClient = useQueryClient();
    const { data, isLoading } = useQuery({
        queryKey: ['adminProducts'],
        queryFn: () => productApi.getProducts({}),
    });

    const deleteMutation = useMutation({
        mutationFn: adminApi.deleteProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
            alert('Product deleted successfully');
        },
    });

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            deleteMutation.mutate(id);
        }
    };

    if (isLoading) return <div className="p-8">Loading products...</div>;

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Products</h1>
                <Link to="/admin/products/new">
                    <Button className="flex items-center gap-2">
                        <Plus size={20} /> Add Product
                    </Button>
                </Link>
            </div>

            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b">
                            <th className="p-4 font-semibold text-gray-600">ID</th>
                            <th className="p-4 font-semibold text-gray-600">NAME</th>
                            <th className="p-4 font-semibold text-gray-600">PRICE</th>
                            <th className="p-4 font-semibold text-gray-600">CATEGORY</th>
                            <th className="p-4 font-semibold text-gray-600">STOCK</th>
                            <th className="p-4 font-semibold text-gray-600">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {data?.products.map((product) => (
                            <tr key={product._id} className="hover:bg-gray-50">
                                <td className="p-4 text-sm text-gray-500">{product._id.slice(-6)}</td>
                                <td className="p-4 font-medium">{product.name}</td>
                                <td className="p-4">{formatPrice(product.price)}</td>
                                <td className="p-4">{product.category}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.countInStock < 10 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                        {product.countInStock}
                                    </span>
                                </td>
                                <td className="p-4 flex gap-2">
                                    <Link to={`/admin/products/${product._id}/edit`}>
                                        <Button variant="outline" size="sm">
                                            <Edit size={16} />
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-red-600 hover:bg-red-50"
                                        onClick={() => handleDelete(product._id)}
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
