import React, { useState } from 'react';
import { FiShoppingCart, FiBell, FiSearch } from 'react-icons/fi';
import logo from '../assets/logo.svg';

const Navbar = () => {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <nav className="fixed top-0 left-0 right-0 bg-white shadow-md py-4 px-6 z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo and Brand Name */}
                <div className="flex items-center">
                    <img src={logo} alt="Logo" className="h-10 mr-2" />
                    <span className="font-bold font-museo text-xl text-[var(--primary-color)]">Lokrise</span>
                </div>

                {/* Search Bar */}
                <div className="hidden md:flex items-center flex-1 max-w-xl mx-8">
                    <div className="relative w-full">
                        <input
                            type="text"
                            placeholder="Search products, courses, and more..."
                            className="w-full py-2 px-4 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[var(--primary-color)]">
                            <FiSearch size={20} />
                        </button>
                    </div>
                </div>

                {/* Navigation Icons and Login */}
                <div className="flex items-center space-x-4">
                    {/* Search Icon for Mobile */}
                    <button className="md:hidden text-gray-700 hover:text-[var(--primary-color)]">
                        <FiSearch size={24} />
                    </button>

                    {/* Notifications */}
                    <button className="text-gray-700 hover:text-[var(--primary-color)] relative">
                        <FiBell size={24} />
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">3</span>
                    </button>

                    {/* Cart */}
                    <button className="text-gray-700 hover:text-[var(--primary-color)] relative">
                        <FiShoppingCart size={24} />
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">2</span>
                    </button>

                    {/* Login Button */}
                    <button className="bg-[var(--primary-color)] hover:bg-[#8b6b4b] text-white py-2 px-4 rounded-lg transition duration-300">
                        Login
                    </button>

                    {/* Register Button */}
                    <button className="bg-[var(--primary-color)] hover:bg-[#8b6b4b] text-white py-2 px-4 rounded-lg transition duration-300">
                        Register
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;