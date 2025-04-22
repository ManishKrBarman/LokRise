import React from 'react';

const SellerStats = () => {
    const stats = [
        {
            value: '0',
            label: 'Trust Lokrise to sell online'
        },
        {
            value: '0',
            label: 'Customers buying across India'
        },
        {
            value: '0',
            label: 'Pincode Supported for delivery'
        },
        {
            value: '0',
            label: 'Categories to sell online'
        }
    ];

    return (
        <section className="py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    {stats.map((stat, index) => (
                        <div key={index} className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
                            <h3 className="text-3xl md:text-4xl font-bold text-[var(--primary-color)] mb-2">{stat.value}</h3>
                            <p className="text-gray-600">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SellerStats;