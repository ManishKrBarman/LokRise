import React, { useState, useEffect, useRef } from 'react';
import { FiChevronDown, FiMenu, FiX } from 'react-icons/fi';

const CategoryBar = () => {
    const categories = [
        {
            name: 'Electronics',
            subcategories: ['Home appliances', 'Solar products', 'Lighting products', 'Small kitchen appliances', 'Health devices']
        },
        {
            name: 'Fashion',
            subcategories: ['Traditional wear', 'Casual wear', 'Sleep wear', 'Children schoolwear', 'Bag & luggage', 'Jewellery', 'Health & wellness']
        },
        {
            name: 'Home & Living',
            subcategories: ['Storage & organiser', 'Lighting', 'Home cleaning', 'Garden & outdoor', 'Bath & hygiene', 'Cooking appliances', 'Mattresses & Cushions', 'Safety & security']
        },
        {
            name: 'Books',
            subcategories: ["Children's book", 'Local literature', 'Self help & motivation', 'Religion book', 'Health & wellness book', 'Agriculture & farming', 'Cooking', 'Language learning book']
        },
        {
            name: 'Beauty',
            subcategories: ['Natural & herbal', "Men's grooming", 'Bath & body essentials', 'Personal hygiene products', 'Beauty tools & accessories', 'Affordable beauty kits', 'Traditional beauty items']
        },
        {
            name: 'Farming',
            subcategories: ['Manure', 'Fertilizers', 'Seeds', 'Farming tools & equipement', 'Pesticides & insectisides', 'Animal feed & care', 'Crop protection & storage', 'Farm wear & safety wear', 'Greenhouse & nursery kits', 'Guids & educational kits']
        }
    ];

    const [activeDropdown, setActiveDropdown] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const mobileMenuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            // Close mobile menu when clicking outside
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && 
                !event.target.closest('[data-menu-toggle]')) {
                setIsMobileMenuOpen(false);
            }
            // Close dropdown when clicking outside
            if (!event.target.closest('.category-item')) {
                setActiveDropdown(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    const toggleDropdown = (index, event) => {
        event.stopPropagation();
        setActiveDropdown(activeDropdown === index ? null : index);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        setActiveDropdown(null);
    };

    return (
        <div className="bg-white border-b border-gray-200 sticky top-[0px] left-0 right-0 z-40 shadow-sm">
            <div className="max-w-7xl mx-auto px-4" ref={menuRef}>
                {/* Mobile Menu Button */}
                <button
                    className="md:hidden absolute left-4 top-3 text-gray-700 hover:text-[var(--primary-color)] z-50"
                    onClick={toggleMobileMenu}
                    data-menu-toggle
                    aria-label="Toggle menu"
                >
                    <FiMenu size={24} />
                </button>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center h-12 gap-6 overflow-visible">
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
                                    className={`ml-1 transition-transform duration-200 ${activeDropdown === index ? 'rotate-180' : ''}`}
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
                                            href={`/category/${category.name.toLowerCase()}/${subcat.toLowerCase().replace(/\s+/g, '-')}`}
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

                {/* Mobile Menu */}
                <div ref={mobileMenuRef}>
                    <div 
                        className={`fixed inset-0 bg-black bg-opacity-50 z-[60] transition-opacity duration-300 md:hidden ${
                            isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                        }`}
                    >
                        <div className={`fixed inset-y-0 left-0 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-[61] ${
                            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                        }`}>
                            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                                <span className="font-medium text-lg text-[var(--primary-color)]">Menu</span>
                                <button
                                    onClick={toggleMobileMenu}
                                    className="text-gray-500 hover:text-gray-700"
                                    aria-label="Close menu"
                                >
                                    <FiX size={24} />
                                </button>
                            </div>
                            <nav className="py-4">
                                <a href="/" className="block px-4 py-2 text-[var(--primary-color)] hover:bg-gray-50">
                                    Home
                                </a>
                                {categories.map((category, index) => (
                                    <div key={index} className="category-item">
                                        <button
                                            className="w-full px-4 py-2 flex items-center justify-between text-gray-700 hover:bg-gray-50"
                                            onClick={(e) => toggleDropdown(index, e)}
                                        >
                                            <span>{category.name}</span>
                                            <FiChevronDown
                                                size={16}
                                                className={`transition-transform duration-200 ${activeDropdown === index ? 'rotate-180' : ''}`}
                                            />
                                        </button>
                                        {activeDropdown === index && (
                                            <div className="bg-gray-50 py-2">
                                                {category.subcategories.map((subcat, idx) => (
                                                    <a
                                                        key={idx}
                                                        href={`/category/${category.name.toLowerCase()}/${subcat.toLowerCase().replace(/\s+/g, '-')}`}
                                                        className="block px-8 py-2 text-sm text-gray-700 hover:text-[var(--primary-color)]"
                                                    >
                                                        {subcat}
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <div className="border-t border-gray-200 mt-2 pt-2">
                                    <a href="/courses" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Courses</a>
                                    <a href="/about" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">About</a>
                                    <a href="/forum" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Forum</a>
                                    <a href="/qna" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Q&A</a>
                                    <a href="/sell" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Sell on Lokrise</a>
                                    <a href="/customer-service" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">Customer Service</a>
                                </div>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryBar;