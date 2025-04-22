import React from 'react';
import { Link } from 'react-router-dom';

const SellerHero = () => {
    return (
        <section className="bg-gradient-to-r from-[#2c6b4e] to-[#a6b82a] text-white py-16 px-4">
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
                            <Link to="/become-seller" className="bg-white text-[var(--primary-color)] py-3 px-8 rounded-full font-bold hover:bg-gray-100 transition duration-300 text-lg text-center">
                                Start Selling
                            </Link>
                        </div>
                    </div>
                    <div className="lg:w-1/2">
                        <img
                            src="/hero-seller.png"
                            alt="Sell on Lokrise"
                            className="w-full h-auto rounded-lg shadow-2xl"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://i.ibb.co/G3djJH1B/sell-on-our-site-lokrise-with-eco-friendly-items.jpg";
                            }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SellerHero;