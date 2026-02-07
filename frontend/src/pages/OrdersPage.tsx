import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import { orderApi } from '../api/orders';
import { formatPrice } from '../lib/utils';

const statusIcons: Record<string, React.ElementType> = {
    'Pending': Clock,
    'Processing': Package,
    'Shipped': Package,
    'Delivered': CheckCircle,
    'Cancelled': XCircle,
};

const statusColors: Record<string, string> = {
    'Pending': 'text-white bg-[#000000]',
    'Processing': 'text-white bg-[#0066ff]',
    'Shipped': 'text-white bg-[#ff2d55]',
    'Delivered': 'text-white bg-[#000000]',
    'Cancelled': 'text-white bg-[#71717a]',
};

export const OrdersPage: React.FC = () => {
    const { data: orders, isLoading, error } = useQuery({
        queryKey: ['myOrders'],
        queryFn: orderApi.getMyOrders,
    });

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="animate-pulse bg-gray-200 rounded-2xl h-32" />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-16 text-center">
                <p className="text-red-500">Error loading orders</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-16">
            <h1 className="text-5xl md:text-7xl font-display font-black text-[#000000] mb-12 uppercase tracking-tighter leading-none">ORDER HISTORY</h1>

            {orders?.length === 0 ? (
                <div className="text-center py-24 bg-[#f4f4f5] rounded-[3rem] border-4 border-dashed border-[#000000]/20">
                    <Package className="w-24 h-24 text-[#000000]/20 mx-auto mb-8" strokeWidth={1} />
                    <p className="text-[#000000] text-3xl font-display font-black uppercase tracking-tighter mb-8">NO ORDERS FOUND</p>
                    <Link to="/products" className="inline-block bg-[#000000] text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-[#0066ff] transition-all shadow-2xl">
                        START YOUR COLLECTION
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders?.map((order) => {
                        const StatusIcon = statusIcons[order.status] || Clock;
                        const statusColor = statusColors[order.status] || 'text-gray-600 bg-gray-50';

                        return (
                            <Link
                                key={order._id}
                                to={`/order/${order._id}`}
                                className="block bg-[#ffffff] rounded-[2.5rem] shadow-2xl border-4 border-[#000000] p-10 hover:shadow-[#000000]/20 transition-all hover:-translate-y-2"
                            >
                                <div className="flex items-center justify-between mb-8 border-b-4 border-[#000000]/5 pb-6">
                                    <div>
                                        <p className="text-[10px] font-black text-[#71717a] uppercase tracking-widest mb-1 font-black">ORDER ID: {order._id.slice(-8).toUpperCase()}</p>
                                        <p className="text-xl font-black text-[#000000] uppercase tracking-tighter">
                                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                    <div className={`flex items-center gap-3 px-6 py-2 rounded-full shadow-lg ${statusColor}`}>
                                        <StatusIcon className="w-5 h-5" strokeWidth={3} />
                                        <span className="text-xs font-black uppercase tracking-widest">{order.status}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8">
                                    <div className="flex -space-x-5">
                                        {order.orderItems.slice(0, 3).map((item, idx) => (
                                            <div key={idx} className="relative group">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-16 h-16 rounded-xl border-4 border-white object-cover shadow-xl grayscale hover:grayscale-0 transition-all"
                                                />
                                            </div>
                                        ))}
                                        {order.orderItems.length > 3 && (
                                            <div className="w-16 h-16 rounded-xl bg-black border-4 border-white flex items-center justify-center text-white font-black text-xs shadow-xl">
                                                +{order.orderItems.length - 3}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs font-black text-[#000000] uppercase tracking-widest">
                                            {order.orderItems.length} PIECES IN PACKAGE
                                        </p>
                                    </div>
                                    <p className="text-3xl font-display font-black text-[#000000] tracking-tighter">{formatPrice(order.totalPrice)}</p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
