import React, { useState, useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi';

const CategoryBar = () => {
    const categories = [
        {
            name: 'Electronics',
            subcategories: ['Smartphones', 'Laptops', 'Audio', 'Accessories']
        },
        {
            name: 'Fashion',
            subcategories: ['Men', 'Women', 'Kids', 'Footwear', 'Accessories']
        },
        {
            name: 'Home & Living',
            subcategories: ['Furniture', 'Decor', 'Kitchen', 'Bedding']
        },
        {
            name: 'Books',
            subcategories: ['Fiction', 'Non-Fiction', 'Educational', 'Comics']
        },
        {
            name: 'Beauty',
            subcategories: ['Skincare', 'Makeup', 'Haircare', 'Fragrances']
        }
    ];

    const [activeDropdown, setActiveDropdown] = useState(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.category-item')) {
                setActiveDropdown(null);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const toggleDropdown = (index, event) => {
        event.stopPropagation();
        setActiveDropdown(activeDropdown === index ? null : index);
    };

    return (
        <div className="bg-white border-b border-gray-200 sticky top-[0px] left-0 right-0 z-40 shadow-sm">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center h-12 gap-6 overflow-visible">
                    <a href="/"
                        className="flex-none text-[var(--primary-color)] font-medium hover:text-[var(--primary-color)]/80 text-sm whitespace-nowrap">
                        Home
                    </a>

                    {categories.map((category, index) => (
                        <div key={index} className="category-item relative flex-none">
                            <button
                                className="flex items-center text-sm text-gray-700 hover:text-[var(--primary-color)] whitespace-nowrap py-3"
                                onClick={(e) => toggleDropdown(index, e)}
                            >
                                {category.name}
                                <FiChevronDown
                                    size={16}
                                    className={`ml-1 transition-transform duration-200 ${activeDropdown === index ? 'rotate-180' : ''
                                        }`}
                                />
                            </button>

                            {activeDropdown === index && (
                                <div
                                    className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-[999]"
                                    style={{
                                        filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))',
                                        transformOrigin: 'top'
                                    }}
                                >
                                    {category.subcategories.map((subcat, idx) => (
                                        <a
                                            key={idx}
                                            href={`/category/${category.name.toLowerCase()}/${subcat.toLowerCase()}`}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[var(--primary-color)] transition-colors"
                                        >
                                            {subcat}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                    <a href="/courses"
                        className="flex-none text-gray-700 hover:text-[var(--primary-color)] text-sm whitespace-nowrap">
                        Courses
                    </a>
                    <a href="/about"
                        className="flex-none text-gray-700 hover:text-[var(--primary-color)] text-sm whitespace-nowrap">
                        About
                    </a>
                    <a href="/forum"
                        className="flex-none text-gray-700 hover:text-[var(--primary-color)] text-sm whitespace-nowrap">
                        Forum
                    </a>
                    <a href="/qna"
                        className="flex-none text-gray-700 hover:text-[var(--primary-color)] text-sm whitespace-nowrap">
                        Q&A
                    </a>
                    <a href="/sell"
                        className="flex-none text-gray-700 hover:text-[var(--primary-color)] text-sm whitespace-nowrap">
                        Sell on Lokrise
                    </a>
                    <a href="/customer-service"
                        className="flex-none text-gray-700 hover:text-[var(--primary-color)] text-sm whitespace-nowrap">
                        Customer Service
                    </a>
                </div>
            </div>
        </div>
    );
};

export default CategoryBar;