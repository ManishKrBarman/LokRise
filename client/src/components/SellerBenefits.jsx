import React from 'react';
import { FiPercent, FiDollarSign, FiTruck, FiCreditCard, FiBarChart2, FiAward } from 'react-icons/fi';

const SellerBenefits = () => {
    const benefits = [
        {
            icon: <FiPercent className="w-8 h-8 text-[var(--primary-color)]" />,
            title: '0% Commission Fee',
            description: 'Sellers on Lokrise keep 100% of their profit by not paying any commission'
        },
        {
            icon: <FiDollarSign className="w-8 h-8 text-[var(--primary-color)]" />,
            title: '0 Penalty Charges',
            description: 'Sell without fear of order cancellation charges with 0 Penalty for late dispatch or cancellations'
        },
        {
            icon: <FiTruck className="w-8 h-8 text-[var(--primary-color)]" />,
            title: 'Lowest Shipping Costs',
            description: 'Sell your products across India to over 19,000+ pincodes at lowest delivery cost'
        },
        {
            icon: <FiCreditCard className="w-8 h-8 text-[var(--primary-color)]" />,
            title: '7-Day Payment Cycle',
            description: 'Payments are deposited directly to your bank account following a 7-day payment cycle'
        },
        {
            icon: <FiBarChart2 className="w-8 h-8 text-[var(--primary-color)]" />,
            title: 'Business Insights',
            description: 'Use product & price recommendations so that you\'re always on top of your business'
        },
        {
            icon: <FiAward className="w-8 h-8 text-[var(--primary-color)]" />,
            title: 'Growth for Every Seller',
            description: 'From small to large businesses, Lokrise fuels growth for all suppliers'
        }
    ];

    return (
        <section className="py-16 px-4 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Sellers Love Lokrise</h2>
                    <p className="text-gray-600 max-w-3xl mx-auto">
                        All the benefits that come with selling on Lokrise are designed to help you sell more, and make it easier to grow your business.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {benefits.map((benefit, index) => (
                        <div key={index} className="p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="mb-4">{benefit.icon}</div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{benefit.title}</h3>
                            <p className="text-gray-600">{benefit.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SellerBenefits;