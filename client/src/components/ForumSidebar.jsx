import React from 'react';
import { Link } from 'react-router-dom';
import { FiFileText, FiTrendingUp, FiHelpCircle, FiBookOpen } from 'react-icons/fi';

const ForumSidebar = ({ popularTopics }) => {
    return (
        <div className="space-y-6">
            {/* Guidelines Panel */}
            <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <FiFileText className="mr-2 text-[var(--primary-color)]" />
                    Guidelines
                </h3>
                <ul className="space-y-2 text-sm">
                    <li>
                        <Link to="/forum/guidelines" className="text-[var(--primary-color)] hover:underline">
                            Community Guidelines
                        </Link>
                    </li>
                    <li>
                        <Link to="/forum/faq" className="text-[var(--primary-color)] hover:underline">
                            Frequently Asked Questions
                        </Link>
                    </li>
                    <li>
                        <Link to="/terms-of-service" className="text-[var(--primary-color)] hover:underline">
                            Terms of Service
                        </Link>
                    </li>
                </ul>
            </div>

            {/* Popular Topics */}
            <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <FiTrendingUp className="mr-2 text-[var(--primary-color)]" />
                    Popular Topics
                </h3>
                <ul className="space-y-3">
                    {popularTopics && popularTopics.map((topic) => (
                        <li key={topic.id} className="border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                            <Link to={`/forum/topic/${topic.id}`} className="text-sm text-gray-700 hover:text-[var(--primary-color)]">
                                {topic.title}
                            </Link>
                            <div className="flex items-center mt-1 text-xs text-gray-500">
                                <span>{topic.replies} replies</span>
                                <span className="mx-1">•</span>
                                <span>{topic.lastActivity}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Help Resources */}
            <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <FiHelpCircle className="mr-2 text-[var(--primary-color)]" />
                    Help Resources
                </h3>
                <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                        <FiBookOpen className="mt-1 mr-2 text-[var(--primary-color)]" />
                        <Link to="/documentation" className="text-[var(--primary-color)] hover:underline">
                            Documentation
                        </Link>
                    </li>
                    <li className="flex items-start">
                        <FiBookOpen className="mt-1 mr-2 text-[var(--primary-color)]" />
                        <Link to="/tutorials" className="text-[var(--primary-color)] hover:underline">
                            Tutorials & Guides
                        </Link>
                    </li>
                    <li className="flex items-start">
                        <FiBookOpen className="mt-1 mr-2 text-[var(--primary-color)]" />
                        <Link to="/customer-service" className="text-[var(--primary-color)] hover:underline">
                            Customer Service
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default ForumSidebar;