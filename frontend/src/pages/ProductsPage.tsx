import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { SlidersHorizontal, X } from 'lucide-react';
import { productApi } from '../api/products';
import { ProductCard } from '../components/ui/ProductCard';
import { Button } from '../components/ui/Button';

export const ProductsPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [showFilters, setShowFilters] = React.useState(false);

    const keyword = searchParams.get('keyword') || '';
    const category = searchParams.get('category') || '';
    const sortBy = searchParams.get('sortBy') || '';
    const page = Number(searchParams.get('page')) || 1;

    const { data, isLoading, error } = useQuery({
        queryKey: ['products', { keyword, category, sortBy, page }],
        queryFn: () => productApi.getProducts({ keyword, category, sortBy, pageNumber: page }),
    });

    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: productApi.getCategories,
    });

    const updateFilter = (key: string, value: string) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        newParams.set('page', '1');
        setSearchParams(newParams);
    };

    const clearFilters = () => {
        setSearchParams({});
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-16 gap-8">
                <div>
                    <h1 className="text-5xl md:text-7xl font-display font-black text-[#000000] tracking-tighter uppercase leading-none">
                        {keyword ? `SEARCH: "${keyword}"` : category || 'ALL COLLECTIONS'}
                    </h1>
                    {data && <p className="text-[#0066ff] font-black uppercase tracking-[0.3em] text-xs mt-4">{data.total} PIECES DISCOVERED</p>}
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="md:hidden w-full bg-[#000000] text-white py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center space-x-2"
                >
                    <SlidersHorizontal className="w-5 h-5" />
                    <span>FILTERS</span>
                </button>
            </div>

            <div className="flex gap-8">
                {/* Filters Sidebar */}
                <aside className={`${showFilters ? 'fixed inset-0 z-50 bg-[#ffffff] p-10 pt-20' : 'hidden'} md:block md:relative md:w-72 md:flex-shrink-0`}>
                    <div className="flex items-center justify-between md:hidden mb-12">
                        <h2 className="text-3xl font-display font-black uppercase tracking-tighter">FILTERS</h2>
                        <button onClick={() => setShowFilters(false)} className="p-2 bg-[#000000] text-white rounded-lg"><X /></button>
                    </div>

                    {/* Sort */}
                    <div className="mb-12">
                        <h3 className="text-xs font-black text-[#000000] uppercase tracking-[0.3em] mb-6">SORT BY</h3>
                        <select
                            value={sortBy}
                            onChange={(e) => updateFilter('sortBy', e.target.value)}
                            className="w-full border-4 border-[#000000] rounded-2xl px-5 py-4 font-black transition-all focus:outline-none focus:ring-4 focus:ring-[#0066ff]/20 bg-white"
                        >
                            <option value="">NEWEST RELEASES</option>
                            <option value="price_asc">PRICE: ASCENDING</option>
                            <option value="price_desc">PRICE: DESCENDING</option>
                            <option value="rating">TOP RATED ELITE</option>
                        </select>
                    </div>

                    {/* Categories */}
                    {categories && categories.length > 0 && (
                        <div className="mb-12">
                            <h3 className="text-xs font-black text-[#000000] uppercase tracking-[0.3em] mb-6">CATEGORIES</h3>
                            <div className="space-y-3">
                                <button
                                    onClick={() => updateFilter('category', '')}
                                    className={`block w-full text-left px-5 py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all border-2 ${!category ? 'bg-[#000000] text-white border-[#000000] shadow-xl' : 'hover:bg-[#f4f4f5] border-transparent'}`}
                                >
                                    ALL PIECES
                                </button>
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => updateFilter('category', cat)}
                                        className={`block w-full text-left px-5 py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all border-2 ${category === cat ? 'bg-[#000000] text-white border-[#000000] shadow-xl' : 'hover:bg-[#f4f4f5] border-transparent'}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {(keyword || category || sortBy) && (
                        <button
                            onClick={clearFilters}
                            className="w-full py-4 text-[#ff2d55] font-black uppercase tracking-widest text-[10px] border-2 border-[#ff2d55]/20 rounded-xl hover:bg-[#ff2d55] hover:text-white transition-all shadow-lg active:scale-95"
                        >
                            RESET FILTERS
                        </button>
                    )}

                    <button className="w-full mt-8 md:hidden bg-[#0066ff] text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-2xl" onClick={() => setShowFilters(false)}>
                        SEE RESULTS
                    </button>
                </aside>

                {/* Products Grid */}
                <div className="flex-1">
                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="animate-pulse bg-gray-200 rounded-2xl h-80" />
                            ))}
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <p className="text-red-500">Error loading products</p>
                        </div>
                    ) : data?.products.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">No products found</p>
                            <Button onClick={clearFilters} variant="outline" className="mt-4">
                                Clear Filters
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {data?.products.map((product) => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>

                            {/* Pagination */}
                            {data && data.pages > 1 && (
                                <div className="flex justify-center gap-4 mt-20">
                                    {[...Array(data.pages)].map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => updateFilter('page', String(i + 1))}
                                            className={`w-14 h-14 rounded-2xl font-black text-lg shadow-xl shadow-black/5 transition-all active:scale-95 border-2 ${page === i + 1 ? 'bg-[#000000] text-white border-[#000000]' : 'bg-white text-[#000000] border-[#000000]/10 hover:border-[#000000]'}`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
