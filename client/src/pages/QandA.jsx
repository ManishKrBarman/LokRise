import React, { useState } from 'react';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import ForumSidebar from '../components/ForumSidebar';
import { FiSearch, FiFilter, FiMessageCircle, FiCheckCircle, FiHeart } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const QandA = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('recent');

    // Mock data for Q&A posts
    const qaItems = [
        {
            id: 301,
            title: 'How do I set up automatic payments for subscription products?',
            content: 'I want to create a subscription product but I\'m not sure how to configure the automatic payments. Can anyone guide me through the process?',
            author: {
                name: 'Robert Chen',
                avatar: 'https://placehold.co/30?text=RC'
            },
            category: 'Selling',
            tags: ['Payments', 'Subscriptions'],
            timestamp: '3 hours ago',
            answers: 2,
            resolved: true,
            likes: 8
        },
        {
            id: 302,
            title: 'Best practices for organizing course content?',
            content: 'I\'m creating my first educational course and want to know the best way to organize my content modules. Any tips from experienced course creators?',
            author: {
                name: 'Lisa Thompson',
                avatar: 'https://placehold.co/30?text=LT'
            },
            category: 'Education',
            tags: ['Course Creation', 'Organization'],
            timestamp: '1 day ago',
            answers: 5,
            resolved: false,
            likes: 12
        },
        {
            id: 303,
            title: 'Why is my video upload stuck at processing?',
            content: 'I tried uploading a 20-minute course video but it\'s been stuck at the processing stage for over an hour. Is there a size limit or format requirement I\'m missing?',
            author: {
                name: 'James Wilson',
                avatar: 'https://placehold.co/30?text=JW'
            },
            category: 'Technical',
            tags: ['Video Upload', 'Troubleshooting'],
            timestamp: '2 days ago',
            answers: 3,
            resolved: true,
            likes: 3
        },
        {
            id: 304,
            title: 'How to market my digital products effectively?',
            content: 'I\'ve created several digital products but I\'m struggling to get sales. What marketing strategies have worked for other sellers on this platform?',
            author: {
                name: 'Sophia Garcia',
                avatar: 'https://placehold.co/30?text=SG'
            },
            category: 'Marketing',
            tags: ['Digital Products', 'Marketing Strategy'],
            timestamp: '3 days ago',
            answers: 7,
            resolved: false,
            likes: 20
        }
    ];

    // Mock data for trending questions
    const trendingQuestions = [
        {
            id: 401,
            title: 'How to get started with selling digital products?',
            replies: 34,
            lastActivity: '1 hour ago'
        },
        {
            id: 402,
            title: 'Best tools for creating online courses?',
            replies: 28,
            lastActivity: '1 day ago'
        },
        {
            id: 403,
            title: 'What\'s the ideal pricing strategy for ebooks?',
            replies: 19,
            lastActivity: '2 days ago'
        }
    ];

    const handleSearch = (e) => {
        e.preventDefault();
        console.log('Searching for:', searchQuery);
        // Implement search functionality here
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar fixed={true} buttonText="Ask a Question" buttonLink="/forum/new-question" />

            <div className="container mx-auto px-4 py-8 flex-grow">
                <div className="mb-4">
                    <h2 className="text-3xl font-bold text-gray-800">Questions & Answers</h2>
                    <p className="text-gray-600">Get answers to your questions from the LokRise community</p>
                </div>

                {/* Search Section */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
                    <form onSubmit={handleSearch} className="relative">
                        <input
                            type="text"
                            placeholder="Search questions..."
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

                    <div className="flex flex-wrap items-center gap-3 mt-4">
                        <span className="text-gray-600 flex items-center">
                            <FiFilter className="mr-1" /> Filter by:
                        </span>
                        {['recent', 'popular', 'unanswered', 'resolved'].map((filter) => (
                            <button
                                key={filter}
                                className={`px-3 py-1 text-sm rounded-full transition-colors ${activeFilter === filter
                                        ? 'bg-[var(--primary-color)] text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                onClick={() => setActiveFilter(filter)}
                            >
                                {filter.charAt(0).toUpperCase() + filter.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        {/* Q&A List */}
                        <div className="space-y-4">
                            {qaItems.map((item) => (
                                <div key={item.id} className="bg-white rounded-lg shadow-md p-5 border border-gray-200">
                                    <div className="flex items-start justify-between">
                                        <Link to={`/forum/question/${item.id}`} className="text-xl font-semibold text-[var(--primary-color)] hover:underline">
                                            {item.title}
                                        </Link>
                                        {item.resolved && (
                                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full flex items-center">
                                                <FiCheckCircle className="mr-1" /> Resolved
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-gray-600 mt-2 line-clamp-2">{item.content}</p>

                                    <div className="flex flex-wrap gap-2 mt-3">
                                        <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                            {item.category}
                                        </span>
                                        {item.tags.map((tag, index) => (
                                            <span key={index} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
                                        <div className="flex items-center">
                                            <img
                                                src={item.author.avatar}
                                                alt={item.author.name}
                                                className="w-6 h-6 rounded-full mr-2"
                                            />
                                            <span>{item.author.name}</span>
                                            <span className="mx-2">•</span>
                                            <span>{item.timestamp}</span>
                                        </div>

                                        <div className="flex items-center space-x-4">
                                            <span className="flex items-center">
                                                <FiMessageCircle className="mr-1" /> {item.answers} answers
                                            </span>
                                            <span className="flex items-center">
                                                <FiHeart className="mr-1" /> {item.likes}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="mt-8 flex justify-center">
                            <nav className="flex items-center space-x-1">
                                <button className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-500 hover:bg-gray-50">
                                    Previous
                                </button>
                                <button className="px-3 py-1 rounded border border-gray-300 bg-[var(--primary-color)] text-white">
                                    1
                                </button>
                                <button className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
                                    2
                                </button>
                                <button className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
                                    3
                                </button>
                                <span className="px-2 py-1 text-gray-500">...</span>
                                <button className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
                                    10
                                </button>
                                <button className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-500 hover:bg-gray-50">
                                    Next
                                </button>
                            </nav>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        {/* Ask Question Button */}
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200 text-center">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Can't find an answer?</h3>
                            <p className="text-gray-600 mb-4">Ask the community and get help from experienced users</p>
                            <Link
                                to="/forum/new-question"
                                className="inline-block py-3 px-6 bg-[var(--primary-color)] text-white rounded-lg hover:bg-[#8b6b4b] transition-colors w-full"
                            >
                                Ask a Question
                            </Link>
                        </div>

                        <ForumSidebar popularTopics={trendingQuestions} />
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default QandA;