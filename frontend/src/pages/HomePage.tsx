import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Truck, Shield, CreditCard, Headphones } from 'lucide-react';
import { productApi } from '../api/products';
import { ProductCard } from '../components/ui/ProductCard';

export const HomePage: React.FC = () => {
    const { data: topProducts, isLoading } = useQuery({
        queryKey: ['topProducts'],
        queryFn: productApi.getTopProducts,
    });

    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: productApi.getCategories,
    });

    const features = [
        { icon: Truck, title: 'Free Shipping', desc: 'On orders over $100' },
        { icon: Shield, title: 'Secure Payment', desc: '100% secure checkout' },
        { icon: CreditCard, title: 'Easy Returns', desc: '30-day return policy' },
        { icon: Headphones, title: '24/7 Support', desc: 'Dedicated support' },
    ];

    return (
        <div className="min-h-screen bg-surface-50">
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center bg-[#000000] pt-20 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#0066ff]/20 blur-[150px] rounded-full" />
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#ff2d55]/10 blur-[150px] rounded-full" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-24">
                    <div className="max-w-4xl animate-slide-up">
                        <div className="inline-flex items-center space-x-3 px-5 py-2.5 bg-[#ffffff]/10 rounded-full border border-[#ffffff]/20 mb-10">
                            <span className="w-2.5 h-2.5 bg-[#0066ff] rounded-full animate-pulse" />
                            <span className="text-[12px] font-black uppercase tracking-[0.3em] text-[#ffffff]">
                                NEW COLLECTION 2025
                            </span>
                        </div>

                        <h1 className="text-5xl sm:text-7xl md:text-[9rem] font-display font-black text-white mb-10 leading-[0.9] tracking-tighter">
                            THE NEW
                            <span className="block text-[#0066ff]">STANDARD</span>
                        </h1>

                        <p className="text-2xl text-[#d1d1d6] mb-14 max-w-2xl leading-relaxed font-bold">
                            Experience the fusion of minimalist design and high-performance craftsmanship. Curated for those who demand excellence.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-8 animate-slide-up animation-delay-300">
                            <Link
                                to="/products"
                                className="w-full sm:w-auto px-12 py-6 bg-[#0066ff] text-white rounded-2xl font-black text-lg hover:bg-[#0055ee] transition-all duration-300 shadow-2xl shadow-[#0066ff]/25 flex items-center justify-center space-x-3 active:scale-95 group"
                            >
                                <span>EXPLORE NOW</span>
                                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                to="/sustainability"
                                className="w-full sm:w-auto px-12 py-6 bg-[#ffffff]/10 text-white border-2 border-[#ffffff]/20 rounded-2xl font-black text-lg hover:bg-[#ffffff]/20 transition-all duration-300 flex items-center justify-center active:scale-95"
                            >
                                OUR STORY
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Perspective Elements */}
                <div className="absolute right-[-10%] top-1/2 -translate-y-1/2 hidden lg:block w-[40%] aspect-[4/5] bg-gradient-to-tr from-surface-800 to-surface-700 rounded-[4rem] shadow-2xl rotate-[-12deg] border border-white/5 opacity-50 overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center grayscale mix-blend-overlay" />
                </div>
            </section>

            {/* Features Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 p-10 bg-[#ffffff] rounded-[3rem] shadow-2xl border-4 border-[#000000]">
                    {features.map((feature, idx) => (
                        <div key={idx} className="flex flex-col items-center text-center px-6 py-8 rounded-[2rem] hover:bg-[#f4f4f5] transition-colors duration-500">
                            <div className="w-16 h-16 bg-[#000000] rounded-2xl flex items-center justify-center text-[#ffffff] mb-8 shadow-xl">
                                <feature.icon className="w-8 h-8" />
                            </div>
                            <h3 className="font-display font-black text-2xl text-[#000000] mb-4 uppercase tracking-tighter">{feature.title}</h3>
                            <p className="text-base text-[#000000] leading-relaxed font-black">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Categories Selection */}
            {categories && categories.length > 0 && (
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
                    <div className="flex flex-col items-center mb-16 text-center">
                        <span className="text-primary-600 font-bold uppercase tracking-widest text-[11px] mb-4">Curated Styles</span>
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-surface-900 tracking-tight">Browse by Category</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {categories.map((category: string) => (
                            <Link
                                key={category}
                                to={`/products?category=${category}`}
                                className="group relative h-[450px] overflow-hidden rounded-[3rem] bg-[#000000] flex items-center justify-center text-center shadow-2xl border-2 border-[#ffffff]/10"
                            >
                                <div className="absolute inset-0 bg-[#0066ff]/10 transition-opacity group-hover:opacity-30" />
                                <div className="relative z-10 p-10 transform group-hover:scale-105 transition-transform duration-700">
                                    <h3 className="text-[10px] uppercase tracking-[0.4em] font-black text-[#0066ff] mb-4 sm:mb-6">{category}</h3>
                                    <div className="text-4xl sm:text-5xl font-display font-black text-white mb-6 sm:mb-10 capitalize tracking-tighter">{category}</div>
                                    <div className="inline-flex items-center space-x-3 text-white font-black text-sm border-b-4 border-[#0066ff] pb-2">
                                        <span>VIEW COLLECTION</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* Featured Products */}
            <section className="bg-[#ffffff] py-32 border-t-4 border-[#000000]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                        <div className="max-w-3xl">
                            <span className="text-[#0066ff] font-black uppercase tracking-[0.4em] text-[10px] sm:text-xs mb-4 sm:mb-6 block text-center md:text-left">SEASONAL CURATION</span>
                            <h2 className="text-5xl sm:text-6xl md:text-8xl font-display font-black text-[#000000] tracking-tighter uppercase leading-[0.9] text-center md:text-left">TOP SELLERS</h2>
                        </div>
                        <Link to="/products" className="text-[#000000] font-black text-xl hover:text-[#0066ff] transition-colors flex items-center space-x-3 group border-b-4 border-[#000000] pb-2">
                            <span>VIEW ENTIRE CATALOG</span>
                            <ArrowRight className="w-6 h-6 transform group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                            {[1, 2, 3, 4].map(n => (
                                <div key={n} className="h-[500px] bg-[#f4f4f5] rounded-[2rem] animate-pulse border-2 border-[#000000]/5" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                            {topProducts?.map(product => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Newsletter/CTA */}
            <section className="bg-[#ffffff] py-32 relative overflow-hidden border-t-4 border-[#000000]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-5xl sm:text-6xl md:text-8xl font-display font-black text-[#000000] mb-8 sm:mb-10 tracking-tighter uppercase">Join The Elite</h2>
                        <p className="text-[#52525b] text-lg sm:text-2xl mb-12 sm:mb-14 font-black max-w-2xl mx-auto">
                            BECOME PART OF THE LUXESTORE INNER CIRCLE. EXCLUSIVE ACCESS, ZERO NOISE.
                        </p>
                        <form className="flex flex-col sm:flex-row gap-6 max-w-xl mx-auto" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="ENTER YOUR EMAIL"
                                className="flex-1 bg-[#f4f4f5] border-4 border-[#000000] rounded-2xl px-8 py-5 text-[#000000] focus:outline-none focus:bg-[#ffffff] transition-all font-black placeholder:text-[#a1a1aa]"
                            />
                            <button className="bg-[#000000] hover:bg-[#1a1a1a] text-white px-10 py-5 rounded-2xl font-black text-lg transition-all shadow-2xl active:scale-95 border-2 border-[#000000] hover:scale-105">
                                SUBSCRIBE
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};
