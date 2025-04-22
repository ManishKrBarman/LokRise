import React from 'react';

const CourseCategories = () => {
    const categories = [
    {
        name: 'Organic Farming',
        count: 48,
        icon: (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v2H7v-2H5v-2h2V9h2v2h2v2z" />
            </svg>
        )
    },
    {
        name: 'Handicrafts',
        count: 65,
        icon: (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 3a1 1 0 000 2h1v11a1 1 0 001 1h8a1 1 0 001-1V5h1a1 1 0 100-2H4z" />
            </svg>
        )
    },
    {
        name: 'Traditional Medicine',
        count: 32,
        icon: (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 9H6v2h2v2h2v-2h2V9h-2V7H8v2z" clipRule="evenodd" />
            </svg>
        )
    },
    {
        name: 'Animal Care',
        count: 40,
        icon: (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 016 6v2a6 6 0 01-12 0V8a6 6 0 016-6zM8 14h4v2H8v-2z" />
            </svg>
        )
    },
    {
        name: 'Folk Art & Music',
        count: 29,
        icon: (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 3a1 1 0 011.707-.707L10 7.586l4.293-4.293A1 1 0 0116 4v12a2 2 0 01-2 2H6a2 2 0 01-2-2V3z" />
            </svg>
        )
    },
    {
        name: 'Eco-Building',
        count: 20,
        icon: (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 9l7-7 7 7v8a1 1 0 01-1 1h-4v-4H8v4H4a1 1 0 01-1-1V9z" />
            </svg>
        )
    },
    {
        name: 'Weaving & Textiles',
        count: 37,
        icon: (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 4a1 1 0 011-1h14a1 1 0 011 1v3H2V4zm0 5h16v2H2V9zm0 4h16v3a1 1 0 01-1 1H3a1 1 0 01-1-1v-3z" />
            </svg>
        )
    },
    {
        name: 'Local Cuisine',
        count: 23,
        icon: (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v4a6 6 0 0012 0V8a6 6 0 00-6-6zm-1 6h2v6h-2V8z" />
            </svg>
        )
    }
];


    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4 font-museo">Browse Top Categories</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Learn from a wide variety of courses in our most popular categories
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {categories.map((category, index) => (
                        <a
                            key={index}
                            href={`/courses/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col items-center text-center"
                        >
                            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4">
                                {category.icon}
                            </div>
                            <h3 className="text-lg font-medium text-gray-800 mb-1">{category.name}</h3>
                            <p className="text-sm text-gray-500">{category.count} courses</p>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CourseCategories;