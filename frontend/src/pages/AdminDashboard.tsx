import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    Users,
    Package,
    ShoppingCart,
    TrendingUp,
    AlertCircle
} from 'lucide-react';
import { adminApi } from '../api/admin';
import { productApi } from '../api/products';
import { formatPrice } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
    const { data: users, isLoading: usersLoading } = useQuery({
        queryKey: ['adminUsers'],
        queryFn: adminApi.getUsers,
    });

    const { data: orders, isLoading: ordersLoading } = useQuery({
        queryKey: ['adminOrders'],
        queryFn: adminApi.getOrders,
    });

    const { data: productData, isLoading: productsLoading } = useQuery({
        queryKey: ['adminProducts'],
        queryFn: () => productApi.getProducts({}),
    });

    const isLoading = usersLoading || ordersLoading || productsLoading;

    if (isLoading) return <div className="p-8">Loading dashboard...</div>;

    const totalRevenue = orders?.reduce((acc, order) => acc + (order.isPaid ? order.totalPrice : 0), 0) || 0;
    const pendingOrders = orders?.filter(o => o.status === 'Pending').length || 0;
    const totalProducts = productData?.total || 0;
    const totalUsers = users?.length || 0;

    const stats = [
        { label: 'Market Revenue', value: formatPrice(totalRevenue), icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Global Orders', value: orders?.length || 0, icon: ShoppingCart, color: 'text-primary-600', bg: 'bg-primary-50' },
        { label: 'Active Catalog', value: totalProducts, icon: Package, color: 'text-primary-500', bg: 'bg-primary-50' },
        { label: 'Client Base', value: totalUsers, icon: Users, color: 'text-accent-600', bg: 'bg-accent-50' },
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto animate-fade-in">
            <header className="mb-12">
                <span className="text-primary-600 font-bold uppercase tracking-widest text-[11px] mb-2 block tracking-[0.1em]">System Overview</span>
                <h1 className="text-4xl font-display font-bold text-surface-900 tracking-tight">Admin Console</h1>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2rem] border border-surface-100 shadow-premium hover:shadow-premium-hover transition-all duration-500 group">
                        <div className="flex items-center justify-between mb-6">
                            <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                                <stat.icon size={22} />
                            </div>
                            <TrendingUp className="text-surface-300 w-5 h-5" />
                        </div>
                        <p className="text-[10px] font-bold text-surface-500 uppercase tracking-[0.15em] mb-1">{stat.label}</p>
                        <p className="text-3xl font-display font-bold text-surface-900 tracking-tight">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Quick Actions */}
                <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] border border-surface-100 shadow-premium">
                    <h2 className="text-2xl font-display font-bold text-surface-900 mb-8 tracking-tight">Management Suite</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Link to="/admin/products/new">
                            <Button className="w-full h-14 text-sm uppercase tracking-widest shadow-primary-500/10">Add New Product</Button>
                        </Link>
                        <Link to="/admin/orders">
                            <Button variant="outline" className="w-full h-14 text-sm uppercase tracking-widest">Global Orders</Button>
                        </Link>
                        <Link to="/admin/users">
                            <Button variant="outline" className="w-full h-14 text-sm uppercase tracking-widest">User Database</Button>
                        </Link>
                        <Link to="/admin/products">
                            <Button variant="outline" className="w-full h-14 text-sm uppercase tracking-widest">Product Catalog</Button>
                        </Link>
                    </div>
                </div>

                {/* Status Bar */}
                <div className="bg-surface-900 p-10 rounded-[2.5rem] text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 blur-[60px] rounded-full" />
                    <h2 className="text-2xl font-display font-bold text-white mb-8 tracking-tight relative z-10">Critical Alerts</h2>
                    <div className="space-y-4 relative z-10">
                        {pendingOrders > 0 && (
                            <div className="flex items-start gap-4 p-5 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 group hover:bg-white/10 transition-colors">
                                <div className="p-2 bg-accent-500/20 text-accent-400 rounded-lg">
                                    <AlertCircle size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white mb-1">Processing Required</p>
                                    <p className="text-xs text-surface-300 leading-relaxed font-medium">
                                        You have {pendingOrders} pending orders awaiting fulfillment.
                                    </p>
                                </div>
                            </div>
                        )}
                        {productData?.products.some(p => p.countInStock < 10) && (
                            <div className="flex items-start gap-4 p-5 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 group hover:bg-white/10 transition-colors">
                                <div className="p-2 bg-primary-500/20 text-primary-400 rounded-lg">
                                    <Package size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white mb-1">Inventory Alert</p>
                                    <p className="text-xs text-surface-300 leading-relaxed font-medium">
                                        Multiple items have fallen below safety stock thresholds.
                                    </p>
                                </div>
                            </div>
                        )}
                        {pendingOrders === 0 && !productData?.products.some(p => p.countInStock < 10) && (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                                    <TrendingUp className="text-primary-400 w-8 h-8" />
                                </div>
                                <p className="text-surface-300 font-medium">System status: Optimal</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
