import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-[#000000] text-[#ffffff] border-t border-white/10 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-24">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center space-x-3 mb-10 group cursor-default">
                            <div className="w-12 h-12 bg-[#ffffff] rounded-[1.25rem] flex items-center justify-center shadow-2xl shadow-white/10 overflow-hidden group/flogo">
                                <div className="w-full h-full bg-white flex items-center justify-center group-hover/flogo:rotate-[135deg] transition-transform duration-700 ease-in-out">
                                    <span className="text-black font-black text-xl tracking-tighter group-hover/flogo:rotate-[-135deg] transition-transform duration-700 ease-in-out">LX</span>
                                </div>
                            </div>
                            <span className="text-3xl font-display font-black tracking-tighter text-white">
                                LUXESTORE
                            </span>
                        </div>
                        <p className="text-[#a1a1aa] max-w-sm leading-relaxed text-lg font-medium">
                            Synthesizing minimalist aesthetics with premium craftsmanship to create an unparalleled shopping experience.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-display font-black uppercase tracking-[0.2em] text-[11px] mb-10">Navigation</h3>
                        <ul className="space-y-5">
                            <li><Link to="/products" className="text-[#f4f4f5] hover:text-[#0066ff] transition-colors font-bold text-lg">Collection</Link></li>
                            <li><Link to="/cart" className="text-[#f4f4f5] hover:text-[#0066ff] transition-colors font-bold text-lg">Your Cart</Link></li>
                            <li><Link to="/orders" className="text-[#f4f4f5] hover:text-[#0066ff] transition-colors font-bold text-lg">Orders</Link></li>
                            <li><Link to="/profile" className="text-[#f4f4f5] hover:text-[#0066ff] transition-colors font-bold text-lg">Profile</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-display font-black uppercase tracking-[0.2em] text-[11px] mb-10">Connect</h3>
                        <ul className="space-y-5">
                            <li className="text-[#f4f4f5] font-bold text-lg hover:text-[#0066ff] transition-colors cursor-pointer tracking-tight">support@luxestore.com</li>
                            <li className="text-[#f4f4f5] font-bold text-lg hover:text-[#0066ff] transition-colors cursor-pointer tracking-tight">+1 (555) Luxe-Elite</li>
                            <li className="text-[#71717a] leading-relaxed font-bold text-base">
                                405 Fifth Avenue,<br />
                                New York, NY 10016
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 mt-24 pt-12 flex flex-col md:flex-row justify-between items-center text-[11px] font-black uppercase tracking-[0.2em] text-[#71717a]">
                    <p className="text-[#f4f4f5]">&copy; {new Date().getFullYear()} LUXESTORE. ALL RIGHTS RESERVED.</p>
                    <div className="flex space-x-10 mt-6 md:mt-0">
                        <Link to="/privacy" className="text-[#f4f4f5] hover:text-[#0066ff] transition-colors">Privacy</Link>
                        <Link to="/terms" className="text-[#f4f4f5] hover:text-[#0066ff] transition-colors">Terms</Link>
                        <Link to="/sustainability" className="text-[#f4f4f5] hover:text-[#0066ff] transition-colors">Sustainability</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};
