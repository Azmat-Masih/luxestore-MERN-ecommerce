import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { formatPrice } from '../lib/utils';
import { Button } from '../components/ui/Button';

export const CartPage: React.FC = () => {
    const { cartItems, removeFromCart, updateQuantity, itemsPrice, shippingPrice, taxPrice, totalPrice } = useCart();
    const { user } = useAuth();

    if (cartItems.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                <div className="max-w-md mx-auto">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
                    <p className="text-gray-500 mb-6">Looks like you haven't added any items yet.</p>
                    <Link to="/products">
                        <Button>Start Shopping</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-black text-[#000000] mb-12 uppercase tracking-tighter">Your Bag</h1>

            <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-8">
                    <div className="bg-white rounded-2xl shadow-sm border divide-y">
                        {cartItems.map((item) => (
                            <div key={item.product} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-6 sm:gap-4 border-b last:border-b-0">
                                <div className="flex gap-4 flex-1 min-w-0">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg flex-shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <Link to={`/product/${item.product}`} className="font-black text-xl sm:text-2xl text-[#000000] hover:text-[#0066ff] line-clamp-2 uppercase tracking-tighter transition-colors">
                                            {item.name}
                                        </Link>
                                        <p className="text-2xl sm:text-3xl font-display font-black text-[#000000] mt-2 tracking-tighter">{formatPrice(item.price)}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between sm:flex-col sm:items-end sm:justify-start gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center border-[3px] border-[#000000] rounded-2xl overflow-hidden bg-white shadow-md scale-90 sm:scale-100 origin-left">
                                            <button
                                                onClick={() => updateQuantity(item.product, Math.max(1, item.qty - 1))}
                                                className="p-3 hover:bg-[#f4f4f5] transition-colors border-r-2 border-[#000000]/10"
                                                disabled={item.qty <= 1}
                                            >
                                                <Minus className="w-5 h-5" strokeWidth={3} />
                                            </button>
                                            <span className="px-6 py-3 font-black text-lg text-[#000000]">{item.qty}</span>
                                            <button
                                                onClick={() => updateQuantity(item.product, Math.min(item.countInStock, item.qty + 1))}
                                                className="p-3 hover:bg-[#f4f4f5] transition-colors border-l-2 border-[#000000]/10"
                                                disabled={item.qty >= item.countInStock}
                                            >
                                                <Plus className="w-5 h-5" strokeWidth={3} />
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.product)}
                                            className="text-[#ff2d55] hover:text-[#ff2d55]/80 p-2 bg-[#ff2d55]/5 rounded-xl transition-all"
                                        >
                                            <Trash2 className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
                                        </button>
                                    </div>
                                    <p className="text-2xl sm:text-3xl font-display font-black text-[#000000] tracking-tighter">
                                        {formatPrice(item.price * item.qty)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-4 mt-12 lg:mt-0">
                    <div className="bg-[#ffffff] rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl border-4 border-[#000000] p-6 sm:p-10 sticky top-24">
                        <h2 className="text-3xl font-display font-black text-[#000000] mb-8 uppercase tracking-tighter border-b-4 border-[#000000] pb-4">ORDER SUM</h2>

                        <div className="space-y-6">
                            <div className="flex justify-between items-center text-sm font-black uppercase tracking-widest text-[#52525b]">
                                <span>Subtotal ({cartItems.reduce((a, i) => a + i.qty, 0)} items)</span>
                                <span className="text-[#000000]">{formatPrice(itemsPrice)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm font-black uppercase tracking-widest text-[#52525b]">
                                <span>Shipping</span>
                                <span className="text-[#0066ff]">{shippingPrice === 0 ? 'FREE' : formatPrice(shippingPrice)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm font-black uppercase tracking-widest text-[#52525b]">
                                <span>Tax</span>
                                <span className="text-[#000000]">{formatPrice(taxPrice)}</span>
                            </div>
                            <div className="border-t-4 border-[#000000] pt-6 mt-6">
                                <div className="flex justify-between items-center text-3xl font-display font-black text-[#000000] tracking-tighter">
                                    <span>TOTAL</span>
                                    <span>{formatPrice(totalPrice)}</span>
                                </div>
                            </div>
                        </div>

                        {shippingPrice > 0 && (
                            <p className="text-xs font-black text-[#0066ff] mt-8 uppercase tracking-[0.2em]">
                                ADD {formatPrice(100 - itemsPrice)} MORE FOR FREE SHIPPING
                            </p>
                        )}

                        <Link to={user ? '/checkout' : '/login?redirect=checkout'}>
                            <button className="w-full mt-10 bg-[#0066ff] hover:bg-[#0055ee] text-white py-6 rounded-2xl font-black text-xl uppercase tracking-widest transition-all shadow-2xl shadow-[#0066ff]/20 active:scale-95 flex items-center justify-center space-x-3">
                                <span>CHECKOUT</span>
                                <ArrowRight className="w-6 h-6" strokeWidth={3} />
                            </button>
                        </Link>

                        <Link to="/products" className="block text-center text-[#000000] font-black uppercase tracking-widest text-xs mt-8 hover:text-[#0066ff] transition-colors border-b-2 border-transparent hover:border-[#0066ff] w-fit mx-auto pb-1">
                            KEEP DISCOVERING
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
