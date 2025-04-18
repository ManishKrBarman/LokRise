import React from 'react';
import { Link } from 'react-router-dom';
import { FiMessageSquare } from 'react-icons/fi';

const ForumCategoryCard = ({ category }) => {
    return (
        <Link
            to={`/forum/${category.slug}`}
            className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 mb-4 border border-gray-200"
        >
            <div className="flex items-start space-x-4">
                <div className="p-3 bg-[var(--primary-color)] bg-opacity-10 rounded-lg">
                    {category.icon ? (
                        <category.icon className="text-[var(--primary-color)]" size={24} />
                    ) : (
                        <FiMessageSquare className="text-[var(--primary-color)]" size={24} />
                    )}
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">{category.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">{category.description}</p>
                </div>
                <div className="text-center">
                    <div className="text-lg font-semibold text-gray-700">{category.topics}</div>
                    <div className="text-xs text-gray-500">Topics</div>
                </div>
            </div>
        </Link>
    );
};

export default ForumCategoryCard;