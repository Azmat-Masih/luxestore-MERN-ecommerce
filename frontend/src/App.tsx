import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrdersPage } from './pages/OrdersPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminProductList } from './pages/AdminProductList';
import { AdminOrderList } from './pages/AdminOrderList';
import { AdminUserList } from './pages/AdminUserList';
import { AdminProductEdit } from './pages/AdminProductEdit';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { SustainabilityPage } from './pages/SustainabilityPage';
import { ProfilePage } from './pages/ProfilePage';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5,
            retry: 1,
        },
    },
});

const Layout: React.FC = () => (
    <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 overflow-x-hidden">
            <Outlet />
        </main>
        <Footer />
    </div>
);

const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({ children, adminOnly }) => {
    const { user, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (adminOnly && !user.isAdmin) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

const App: React.FC = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <CartProvider>
                    <Router>
                        <Routes>
                            <Route path="/" element={<Layout />}>
                                <Route index element={<HomePage />} />
                                <Route path="products" element={<ProductsPage />} />
                                <Route path="product/:id" element={<ProductDetailPage />} />
                                <Route path="cart" element={<CartPage />} />
                                <Route path="checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                                <Route path="orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
                                <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

                                {/* Admin Routes */}
                                <Route path="admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
                                <Route path="admin/products" element={<ProtectedRoute adminOnly><AdminProductList /></ProtectedRoute>} />
                                <Route path="admin/products/new" element={<ProtectedRoute adminOnly><AdminProductEdit /></ProtectedRoute>} />
                                <Route path="admin/products/:id/edit" element={<ProtectedRoute adminOnly><AdminProductEdit /></ProtectedRoute>} />
                                <Route path="admin/orders" element={<ProtectedRoute adminOnly><AdminOrderList /></ProtectedRoute>} />
                                <Route path="admin/users" element={<ProtectedRoute adminOnly><AdminUserList /></ProtectedRoute>} />

                                <Route path="privacy" element={<PrivacyPage />} />
                                <Route path="terms" element={<TermsPage />} />
                                <Route path="sustainability" element={<SustainabilityPage />} />
                            </Route>
                            <Route path="login" element={<LoginPage />} />
                            <Route path="register" element={<RegisterPage />} />
                        </Routes>
                    </Router>
                </CartProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
};

export default App;
