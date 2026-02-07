import React from 'react';
import { Leaf, Globe, Recycle } from 'lucide-react';

export const SustainabilityPage: React.FC = () => {
    return (
        <div className="max-w-5xl mx-auto px-4 py-20 animate-fade-in">
            <header className="text-center mb-16">
                <span className="text-primary-600 font-bold uppercase tracking-widest text-xs mb-4 block">Our Commitment</span>
                <h1 className="text-5xl font-display font-bold text-surface-900 tracking-tight">Future-Forward Fashion</h1>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
                <div className="bg-white p-8 rounded-[2.5rem] border border-surface-100 shadow-premium text-center">
                    <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Leaf className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-4">Eco-Materials</h3>
                    <p className="text-surface-600 leading-relaxed font-medium">
                        90% of our products are made from organic, recycled, or upcycled materials.
                    </p>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] border border-surface-100 shadow-premium text-center text-center">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Globe className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-4">Ethical Sourcing</h3>
                    <p className="text-surface-600 leading-relaxed font-medium">
                        We partner only with GOTS-certified factories that guarantee fair wages and safe conditions.
                    </p>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] border border-surface-100 shadow-premium text-center text-center">
                    <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Recycle className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-4">Circular Lifecycle</h3>
                    <p className="text-surface-600 leading-relaxed font-medium">
                        Our recycling program has diverted over 10 tons of textile waste from landfills last year.
                    </p>
                </div>
            </div>

            <div className="prose prose-slate max-w-none text-surface-700 bg-surface-50 p-12 rounded-[3rem]">
                <h2 className="text-3xl font-display font-bold text-surface-900 mb-6">Our Vision for 2030</h2>
                <p className="text-lg leading-relaxed mb-6 font-medium">
                    Sustainability isn't just a buzzword at LuxeStore; it's the core of our business model. We are committed to reaching net-zero carbon emissions across our entire supply chain by 2030.
                </p>
                <p className="leading-relaxed font-medium">
                    Through investment in innovative textiles and carbon-neutral logistics, we are redefining what luxury means. True luxury is having the peace of mind that your style doesn't come at the cost of our planet.
                </p>
            </div>
        </div>
    );
};
