import React from 'react';

export const PrivacyPage: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-20 animate-fade-in">
            <h1 className="text-4xl font-display font-bold text-surface-900 mb-8">Privacy Policy</h1>
            <div className="prose prose-slate max-w-none text-surface-700 space-y-6">
                <p className="text-lg leading-relaxed">
                    At LuxeStore, we take your privacy seriously. This policy explains how we collect and protect your data.
                </p>
                <section>
                    <h2 className="text-2xl font-bold text-surface-900 mb-4">Data Collection</h2>
                    <p>
                        We collect information you provide directly to us (e.g., name, email, address) when you create an account or make a purchase.
                    </p>
                </section>
                <section>
                    <h2 className="text-2xl font-bold text-surface-900 mb-4">Usage</h2>
                    <p>
                        Your data is used to process orders, personalize your experience, and improve our services. We never sell your personal information.
                    </p>
                </section>
                <section>
                    <h2 className="text-2xl font-bold text-surface-900 mb-4">Cookies</h2>
                    <p>
                        We use essential cookies to maintain your session and cart functionality. No third-party tracking cookies are used without your consent.
                    </p>
                </section>
            </div>
        </div>
    );
};
