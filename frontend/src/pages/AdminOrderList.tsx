import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Eye, CheckCircle, Clock, Truck } from 'lucide-react';
import { adminApi } from '../api/admin';
import { formatPrice } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';

export const AdminOrderList: React.FC = () => {
    const queryClient = useQueryClient();
    const { data: orders, isLoading } = useQuery({
        queryKey: ['adminOrders'],
        queryFn: adminApi.getOrders,
    });

    const deliverMutation = useMutation({
        mutationFn: adminApi.deliverOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
            alert('Order marked as delivered');
        },
    });

    if (isLoading) return <div className="p-8">Loading orders...</div>;

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-8">Orders</h1>

            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b">
                            <th className="p-4 font-semibold text-gray-600">ID</th>
                            <th className="p-4 font-semibold text-gray-600">USER</th>
                            <th className="p-4 font-semibold text-gray-600">DATE</th>
                            <th className="p-4 font-semibold text-gray-600">TOTAL</th>
                            <th className="p-4 font-semibold text-gray-600">PAID</th>
                            <th className="p-4 font-semibold text-gray-600">DELIVERED</th>
                            <th className="p-4 font-semibold text-gray-600">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {orders?.map((order) => (
                            <tr key={order._id} className="hover:bg-gray-50">
                                <td className="p-4 text-sm text-gray-500">{order._id.slice(-6).toUpperCase()}</td>
                                <td className="p-4">{(order.user as any).name || 'Unknown'}</td>
                                <td className="p-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td className="p-4 font-bold">{formatPrice(order.totalPrice)}</td>
                                <td className="p-4">
                                    {order.isPaid ? (
                                        <span className="flex items-center gap-1 text-green-600 font-medium">
                                            <CheckCircle size={16} /> {new Date(order.paidAt!).toLocaleDateString()}
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-red-600 font-medium">
                                            <Clock size={16} /> Not Paid
                                        </span>
                                    )}
                                </td>
                                <td className="p-4">
                                    {order.isDelivered ? (
                                        <span className="flex items-center gap-1 text-green-600 font-medium">
                                            <CheckCircle size={16} /> {new Date(order.deliveredAt!).toLocaleDateString()}
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-orange-600 font-medium">
                                            <Truck size={16} /> Not Delivered
                                        </span>
                                    )}
                                </td>
                                <td className="p-4 flex gap-2">
                                    <Link to={`/order/${order._id}`}>
                                        <Button variant="outline" size="sm">
                                            <Eye size={16} />
                                        </Button>
                                    </Link>
                                    {order.isPaid && !order.isDelivered && (
                                        <Button
                                            size="sm"
                                            onClick={() => deliverMutation.mutate(order._id)}
                                        >
                                            Mark as Delivered
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
