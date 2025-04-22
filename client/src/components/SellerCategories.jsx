import React from 'react';

const SellerCategories = () => {
    const categories = [
    'Handloom Sarees',
    'Terracotta Items',
    'Madhubani Paintings',
    'Bamboo Crafts',
    'Chikankari Kurtis',
    'Jute Bags',
    'Organic Spices',
    'Clay Pottery',
    'Handwoven Woolens',
    'Lac Bangles',
    'Tribal Jewellery',
    'Khadi Clothing',
    'Wicker Baskets',
    'Natural Soaps',
    'Aipan Art Decor',
    'Brass Utensils',
    'Wool Shawls',
    'Cane Furniture',
    'Embroidered Dupattas'
];


    return (
        <section className="py-16 px-4 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Popular Categories to Sell Online</h2>
                    <p className="text-gray-600 max-w-3xl mx-auto">
                        Start selling in these high-demand categories and reach millions of customers
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {categories.map((category, index) => (
                        <a
                            key={index}
                            href={`/sell/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
                            className="bg-white rounded-lg p-4 border border-gray-100 hover:shadow-md transition-shadow flex items-center justify-between"
                        >
                            <span className="text-gray-800 hover:text-[var(--primary-color)] transition-colors">
                                Sell {category} Online
                            </span>
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SellerCategories;