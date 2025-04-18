import React, { useState } from 'react';
import { FiSearch, FiPlusCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const ForumHeader = ({ title, description }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        // Handle search functionality here
        console.log('Searching for:', searchQuery);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
                    <p className="text-gray-600 mt-1">{description}</p>
                </div>

                <div className="mt-4 md:mt-0">
                    <Link
                        to="/forum/new-topic"
                        className="inline-flex items-center px-4 py-2 bg-[var(--primary-color)] text-white rounded-lg hover:bg-[#8b6b4b] transition-colors"
                    >
                        <FiPlusCircle className="mr-2" />
                        New Topic
                    </Link>
                </div>
            </div>

            <form onSubmit={handleSearch} className="relative">
                <input
                    type="text"
                    placeholder="Search the forum..."
                    className="w-full py-3 px-4 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                    type="submit"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[var(--primary-color)]"
                >
                    <FiSearch size={20} />
                </button>
            </form>
        </div>
    );
};

export default ForumHeader;