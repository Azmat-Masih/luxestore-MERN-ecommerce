import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import { Product } from '../../api/products';
import { formatPrice } from '../../lib/utils';
import { useCart } from '../../contexts/CartContext';

interface ProductCardProps {
    product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { addToCart } = useCart();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        if (product.countInStock > 0) {
            addToCart({
                product: product._id,
                name: product.name,
                image: product.image,
                price: product.price,
                qty: 1,
                countInStock: product.countInStock,
            });
        }
    };

    return (
        <Link
            to={`/product/${product._id}`}
            className="group block bg-[#ffffff] rounded-[2rem] overflow-hidden shadow-2xl hover:shadow-[#000000]/20 transition-all duration-500 border-2 border-[#000000]/5 hover:-translate-y-2"
        >
            <div className="relative overflow-hidden aspect-[4/5] bg-surface-50">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />

                {/* Overlay Badge */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.countInStock === 0 ? (
                        <span className="bg-[#000000] text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-xl">
                            SOLD OUT
                        </span>
                    ) : (
                        <span className="bg-[#0066ff] text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-xl">
                            {product.category}
                        </span>
                    )}
                </div>

                {/* Quick Add Button */}
                <button
                    onClick={handleAddToCart}
                    disabled={product.countInStock === 0}
                    className="absolute bottom-6 right-6 p-4 bg-[#000000] text-white rounded-2xl shadow-2xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-[#0066ff] disabled:hidden border-2 border-[#ffffff]/20"
                >
                    <ShoppingCart className="w-6 h-6" strokeWidth={2.5} />
                </button>
            </div>

            <div className="p-8">
                <div className="flex items-center gap-1.5 mb-4">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.round(product.rating) ? 'text-[#ff2d55] fill-current' : 'text-[#e4e4e7]'}`}
                            strokeWidth={2.5}
                        />
                    ))}
                    <span className="text-[11px] font-black text-[#71717a] ml-1 uppercase tracking-widest">
                        {product.numReviews} REVIEWS
                    </span>
                </div>

                <h3 className="font-display font-black text-2xl text-[#000000] mb-3 line-clamp-2 leading-tight uppercase tracking-tighter group-hover:text-[#0066ff] transition-colors">
                    {product.name}
                </h3>

                <div className="flex items-end justify-between mt-6">
                    <div className="flex flex-col">
                        <span className="text-3xl font-display font-black text-[#000000] tracking-tighter">
                            {formatPrice(product.price)}
                        </span>
                        {product.countInStock > 0 && product.countInStock <= 5 && (
                            <span className="text-[10px] font-black text-[#ff2d55] uppercase mt-2 tracking-widest bg-[#ff2d55]/5 px-2 py-0.5 rounded">
                                ONLY {product.countInStock} LEFT
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
};
