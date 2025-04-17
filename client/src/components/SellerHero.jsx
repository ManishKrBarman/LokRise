import React from 'react';

const SellerHero = () => {
    return (
        <section className="bg-gradient-to-r from-[var(--primary-color)] to-[var(--tertiary-color)] text-white py-16 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                    <div className="lg:w-1/2">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            Sell online to millions of customers at 0% Commission
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 opacity-90">
                            Become a Lokrise seller and grow your business across the country
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            <button className="bg-white text-[var(--primary-color)] py-3 px-8 rounded-full font-bold hover:bg-gray-100 transition duration-300 text-lg">
                                Start Selling
                            </button>
                            <button className="bg-transparent border-2 border-white text-white py-3 px-8 rounded-full font-bold hover:bg-white/10 transition duration-300 text-lg">
                                Learn More
                            </button>
                        </div>
                        <div className="bg-white/20 p-4 rounded-lg inline-block">
                            <p className="text-white text-sm">Don't have a GSTIN? You can still sell on Lokrise.</p>
                            <a href="/gstin-free-selling" className="text-white underline font-medium">Know more</a>
                        </div>
                    </div>
                    <div className="lg:w-1/2">
                        <img
                            src="/hero-seller.png"
                            alt="Sell on Lokrise"
                            className="w-full h-auto rounded-lg shadow-2xl"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://placehold.co/600x400/7D23E0/ffffff?text=Sell+on+Lokrise";
                            }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SellerHero;