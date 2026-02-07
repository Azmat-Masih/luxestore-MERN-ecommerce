import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

export const Header: React.FC = () => {
    const { user, logout } = useAuth();
    const { cartItems } = useCart();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');

    const itemCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/products?keyword=${encodeURIComponent(searchQuery)}`;
        }
    };

    return (
        <header className="sticky top-0 z-50 bg-[#ffffff] border-b border-[#000000]/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-4 group">
                        <div className="relative">
                            <div className="w-12 h-12 bg-[#000000] rounded-2xl flex items-center justify-center transform group-hover:rotate-[135deg] transition-transform duration-700 ease-in-out shadow-2xl">
                                <span className="text-white font-black text-xl tracking-tighter transform group-hover:rotate-[-135deg] transition-transform duration-700 ease-in-out">LX</span>
                            </div>
                            <div className="absolute -inset-1 border-2 border-[#0066ff] rounded-[1.25rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>
                        <span className="text-3xl font-display font-black tracking-tighter text-[#000000] relative overflow-hidden group-hover:text-[#0066ff] transition-colors duration-300">
                            LUXESTORE
                            <span className="absolute bottom-0 left-0 w-full h-1 bg-[#0066ff] transform translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500" />
                        </span>
                    </Link>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-md mx-12">
                        <div className="relative w-full group">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search the collection..."
                                className="w-full pl-12 pr-4 py-2.5 bg-[#f4f4f5] border-2 border-transparent focus:border-[#000000] rounded-2xl focus:outline-none focus:bg-white transition-all duration-300 text-[#000000] font-bold"
                            />
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#a1a1aa] w-5 h-5 group-focus-within:text-[#000000] transition-colors" />
                        </div>
                    </form>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link to="/products" className="text-[#000000] hover:text-[#0066ff] font-black uppercase tracking-widest text-xs transition-colors">
                            EXPLORE
                        </Link>

                        {/* Cart */}
                        <Link to="/cart" className="relative p-2.5 text-[#000000] hover:text-[#0066ff] hover:bg-[#f4f4f5] rounded-2xl transition-all duration-300 group/cart">
                            <ShoppingCart className="w-7 h-7" strokeWidth={2.5} />
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-[#000000] text-white text-[11px] font-black rounded-full min-w-[22px] h-[22px] flex items-center justify-center border-2 border-white shadow-xl group-hover/cart:scale-110 transition-transform">
                                    {itemCount}
                                </span>
                            )}
                        </Link>

                        {user ? (
                            <div className="relative group">
                                <button className="flex items-center space-x-2 pl-2 pr-1 py-1 bg-[#f4f4f5] font-black text-[#000000] hover:bg-[#e4e4e7] transition-colors rounded-2xl border-2 border-transparent hover:border-[#000000]/10">
                                    <div className="w-8 h-8 bg-[#000000] rounded-xl flex items-center justify-center text-white">
                                        <User className="w-5 h-5" strokeWidth={2.5} />
                                    </div>
                                    <span className="pr-1 uppercase tracking-tighter text-sm">{user.name.split(' ')[0]}</span>
                                </button>

                                <div className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-lg rounded-2xl shadow-premium border border-surface-200/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 p-2">
                                    <Link to="/profile" className="flex items-center space-x-2 px-4 py-2.5 text-surface-700 hover:bg-primary-50 hover:text-primary-700 rounded-xl transition-colors">
                                        Profile
                                    </Link>
                                    <Link to="/orders" className="flex items-center space-x-2 px-4 py-2.5 text-surface-700 hover:bg-primary-50 hover:text-primary-700 rounded-xl transition-colors">
                                        Order History
                                    </Link>
                                    {user.isAdmin && (
                                        <Link to="/admin" className="flex items-center space-x-2 px-4 py-2.5 text-primary-600 font-semibold hover:bg-primary-50 rounded-xl transition-colors border-t border-surface-100 mt-1 pt-3">
                                            Admin Console
                                        </Link>
                                    )}
                                    <button onClick={logout} className="w-full text-left flex items-center space-x-2 px-4 py-2.5 text-accent-600 hover:bg-accent-50 rounded-xl transition-colors mt-1">
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Link to="/login" className="bg-[#000000] hover:bg-[#1a1a1a] text-[#ffffff] px-8 py-2.5 rounded-2xl font-bold transition-all duration-300 shadow-xl shadow-black/10 active:scale-95 border border-black/20">
                                SIGN IN
                            </Link>
                        )}
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-surface-600 bg-surface-100 rounded-xl"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden py-6 animate-fade-in border-t border-surface-100">
                        <form onSubmit={handleSearch} className="mb-6">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 w-5 h-5" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search..."
                                    className="w-full pl-12 pr-4 py-3 bg-surface-100 border-none rounded-2xl"
                                />
                            </div>
                        </form>
                        <div className="space-y-2">
                            <Link to="/products" className="block px-4 py-3 rounded-xl hover:bg-primary-50 text-surface-800 font-semibold transition-colors">Explore</Link>
                            <Link to="/cart" className="block px-4 py-3 rounded-xl hover:bg-primary-50 text-surface-800 font-semibold transition-colors">Cart ({itemCount})</Link>
                            {user ? (
                                <>
                                    <Link to="/profile" className="block px-4 py-3 rounded-xl hover:bg-primary-50 text-surface-800 font-semibold transition-colors">Profile</Link>
                                    <Link to="/orders" className="block px-4 py-3 rounded-xl hover:bg-primary-50 text-surface-800 font-semibold transition-colors">Order History</Link>
                                    {user.isAdmin && <Link to="/admin" className="block px-4 py-3 rounded-xl bg-primary-50 text-primary-700 font-bold transition-colors">Admin Console</Link>}
                                    <button onClick={logout} className="w-full text-left px-4 py-3 rounded-xl hover:bg-accent-50 text-accent-600 transition-colors">Sign Out</button>
                                </>
                            ) : (
                                <Link to="/login" className="block px-4 py-3 rounded-xl bg-primary-600 text-white text-center font-bold">Sign In</Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};
