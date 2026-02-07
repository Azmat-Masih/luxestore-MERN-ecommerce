import React from 'react';

export const TermsPage: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-20 animate-fade-in">
            <h1 className="text-4xl font-display font-bold text-surface-900 mb-8">Terms of Service</h1>
            <div className="prose prose-slate max-w-none text-surface-700 space-y-6">
                <p className="text-lg leading-relaxed">
                    By using LuxeStore, you agree to the following terms and conditions.
                </p>
                <section>
                    <h2 className="text-2xl font-bold text-surface-900 mb-4">Acceptable Use</h2>
                    <p>
                        You agree to use LuxeStore only for lawful purposes and in a way that does not infringe the rights of others.
                    </p>
                </section>
                <section>
                    <h2 className="text-2xl font-bold text-surface-900 mb-4">Intellectual Property</h2>
                    <p>
                        All content on this site, including text, graphics, and logos, is the property of LuxeStore and protected by copyright laws.
                    </p>
                </section>
                <section>
                    <h2 className="text-2xl font-bold text-surface-900 mb-4">Liability</h2>
                    <p>
                        LuxeStore is not liable for any direct or indirect damages arising from the use of our services or products.
                    </p>
                </section>
            </div>
        </div>
    );
};
