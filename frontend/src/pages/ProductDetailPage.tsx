import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Star, Minus, Plus, ChevronLeft, Truck, Shield, RefreshCw } from 'lucide-react';
import { productApi } from '../api/products';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '../lib/utils';

export const ProductDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { addToCart } = useCart();
    const [qty, setQty] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);

    const { data: product, isLoading, error } = useQuery({
        queryKey: ['product', id],
        queryFn: () => productApi.getProductById(id!),
        enabled: !!id,
    });

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="animate-pulse grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="bg-gray-200 aspect-square rounded-2xl" />
                    <div className="space-y-4">
                        <div className="h-8 bg-gray-200 rounded w-3/4" />
                        <div className="h-6 bg-gray-200 rounded w-1/4" />
                        <div className="h-24 bg-gray-200 rounded" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                <h1 className="text-2xl font-bold text-gray-900">Product not found</h1>
                <Link to="/products" className="text-indigo-600 hover:underline mt-4 inline-block">
                    Back to Products
                </Link>
            </div>
        );
    }

    const images = [product.image, ...(product.images || [])];

    const handleAddToCart = () => {
        addToCart({
            product: product._id,
            name: product.name,
            image: product.image,
            price: product.price,
            qty,
            countInStock: product.countInStock,
        });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Link to="/products" className="inline-flex items-center text-[#000000] hover:text-[#0066ff] mb-10 font-black uppercase tracking-widest text-sm transition-colors border-b-2 border-black pb-1">
                <ChevronLeft className="w-5 h-5 mr-1" strokeWidth={3} /> Back to Catalog
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Images */}
                <div>
                    <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-4">
                        <img
                            src={images[selectedImage]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {images.length > 1 && (
                        <div className="flex gap-3">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImage(idx)}
                                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${selectedImage === idx ? 'border-indigo-600' : 'border-transparent'}`}
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Details */}
                <div>
                    <p className="text-[#0066ff] font-black uppercase tracking-[0.4em] text-xs mb-4">{product.category}</p>
                    <h1 className="text-5xl md:text-7xl font-display font-black text-[#000000] mb-8 leading-tight tracking-tighter uppercase">{product.name}</h1>

                    <div className="flex items-center gap-4 mb-8">
                        <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-5 h-5 ${i < Math.round(product.rating) ? 'text-[#ff2d55] fill-current' : 'text-[#e4e4e7]'}`} strokeWidth={2.5} />
                            ))}
                        </div>
                        <span className="text-[#000000] font-black uppercase tracking-widest text-xs border-l-2 border-black pl-4">{product.numReviews} REVIEWS</span>
                    </div>

                    <p className="text-6xl font-display font-black text-[#000000] mb-10 tracking-tighter">{formatPrice(product.price)}</p>

                    <p className="text-[#52525b] mb-12 text-lg leading-relaxed font-bold">{product.description}</p>

                    {/* Stock Status */}
                    <div className="mb-10">
                        {product.countInStock > 0 ? (
                            <span className="inline-flex items-center px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest bg-[#000000] text-white shadow-xl">
                                IN STOCK: {product.countInStock} AVAILABLE
                            </span>
                        ) : (
                            <span className="inline-flex items-center px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest bg-[#ff2d55] text-white shadow-xl">
                                OUT OF STOCK
                            </span>
                        )}
                    </div>

                    {/* Quantity & Add to Cart */}
                    {product.countInStock > 0 && (
                        <div className="flex items-center gap-6 mb-12">
                            <div className="flex items-center border-[3px] border-[#000000] rounded-2xl overflow-hidden bg-white shadow-lg">
                                <button
                                    onClick={() => setQty(Math.max(1, qty - 1))}
                                    className="p-5 hover:bg-[#f4f4f5] transition-colors border-r-2 border-[#000000]/10"
                                    disabled={qty <= 1}
                                >
                                    <Minus className="w-5 h-5" strokeWidth={3} />
                                </button>
                                <span className="px-10 py-5 font-black text-xl text-[#000000]">{qty}</span>
                                <button
                                    onClick={() => setQty(Math.min(product.countInStock, qty + 1))}
                                    className="p-5 hover:bg-[#f4f4f5] transition-colors border-l-2 border-[#000000]/10"
                                    disabled={qty >= product.countInStock}
                                >
                                    <Plus className="w-5 h-5" strokeWidth={3} />
                                </button>
                            </div>
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 bg-[#0066ff] hover:bg-[#0055ee] text-white py-6 rounded-2xl font-black text-xl uppercase tracking-widest transition-all shadow-2xl shadow-[#0066ff]/20 active:scale-95"
                            >
                                ADD TO CART
                            </button>
                        </div>
                    )}

                    {/* Features */}
                    <div className="grid grid-cols-3 gap-6 pt-10 border-t-4 border-[#000000]">
                        <div className="text-center group cursor-default">
                            <Truck className="w-8 h-8 mx-auto text-[#0066ff] mb-3 group-hover:scale-110 transition-transform" strokeWidth={2.5} />
                            <p className="text-xs font-black uppercase tracking-widest text-[#000000]">FREE SHIPPING</p>
                        </div>
                        <div className="text-center group cursor-default">
                            <Shield className="w-8 h-8 mx-auto text-[#0066ff] mb-3 group-hover:scale-110 transition-transform" strokeWidth={2.5} />
                            <p className="text-xs font-black uppercase tracking-widest text-[#000000]">SECURE PRO</p>
                        </div>
                        <div className="text-center group cursor-default">
                            <RefreshCw className="w-8 h-8 mx-auto text-[#0066ff] mb-3 group-hover:scale-110 transition-transform" strokeWidth={2.5} />
                            <p className="text-xs font-black uppercase tracking-widest text-[#000000]">30-DAY EASY</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
