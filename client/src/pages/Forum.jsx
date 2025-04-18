import React from 'react';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import ForumHeader from '../components/ForumHeader';
import ForumCategoryCard from '../components/ForumCategoryCard';
import ForumTopicList from '../components/ForumTopicList';
import ForumSidebar from '../components/ForumSidebar';
import { FiMessageSquare, FiAlertCircle, FiHelpCircle, FiStar, FiBookOpen, FiCode, FiShare2 } from 'react-icons/fi';

const Forum = () => {
    // Mock data for categories
    const categories = [
        {
            id: 1,
            name: 'Help & Support',
            slug: 'help-support',
            description: 'Get help from fellow users. Check out our documentation first!',
            topics: 2083,
            icon: FiHelpCircle
        },
        {
            id: 2,
            name: 'Bug Reports',
            slug: 'bug-reports',
            description: 'Report bugs so that we can squash them. Please search for duplicates first.',
            topics: 297,
            icon: FiAlertCircle
        },
        {
            id: 3,
            name: 'Feature Requests',
            slug: 'feature-requests',
            description: 'Suggest features you would like to see. Likes = Votes.',
            topics: 549,
            icon: FiStar
        },
        {
            id: 4,
            name: 'Knowledge Management',
            slug: 'knowledge-management',
            description: 'Talk about methodologies and best practices.',
            topics: 149,
            icon: FiBookOpen
        },
        {
            id: 5,
            name: 'Developers Corner',
            slug: 'developers',
            description: 'Technical discussions for developers and API users.',
            topics: 91,
            icon: FiCode
        },
        {
            id: 6,
            name: 'Share & Showcase',
            slug: 'share-showcase',
            description: 'Share your creations, workflows, and success stories.',
            topics: 252,
            icon: FiShare2
        }
    ];

    // Mock data for trending topics
    const trendingTopics = [
        {
            id: 101,
            title: 'How to optimize your product listings',
            replies: 24,
            lastActivity: '2 hours ago'
        },
        {
            id: 102,
            title: 'New course recommendation system feedback',
            replies: 18,
            lastActivity: 'Yesterday'
        },
        {
            id: 103,
            title: 'Mobile app feature requests',
            replies: 32,
            lastActivity: '3 days ago'
        },
        {
            id: 104,
            title: 'Beginner tips for new sellers',
            replies: 56,
            lastActivity: '5 days ago'
        }
    ];

    // Mock data for recent topics
    const recentTopics = [
        {
            id: 201,
            title: 'Payment processing issue with international cards',
            category: 'Help & Support',
            replies: 7,
            likes: 3,
            author: {
                name: 'Emma Johnson',
                avatar: 'https://placehold.co/30?text=EJ'
            },
            lastActivity: '30 minutes ago',
            lastUser: 'Support Team'
        },
        {
            id: 202,
            title: 'Feature request: Dark mode for the marketplace',
            category: 'Feature Requests',
            replies: 12,
            likes: 25,
            author: {
                name: 'Michael Smith',
                avatar: 'https://placehold.co/30?text=MS'
            },
            lastActivity: '2 hours ago',
            lastUser: 'Product Manager'
        },
        {
            id: 203,
            title: 'Bug: Course videos not playing on Safari',
            category: 'Bug Reports',
            replies: 5,
            likes: 8,
            author: {
                name: 'Sarah Williams',
                avatar: 'https://placehold.co/30?text=SW'
            },
            lastActivity: '1 day ago',
            lastUser: 'Tech Support'
        },
        {
            id: 204,
            title: 'How I organized my digital products for better sales',
            category: 'Share & Showcase',
            replies: 18,
            likes: 42,
            author: {
                name: 'David Brown',
                avatar: 'https://placehold.co/30?text=DB'
            },
            lastActivity: '3 days ago',
            lastUser: 'Marketing Lead'
        }
    ];

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar fixed={true} buttonText="Create Account" buttonLink="/register" />

            <div className="container mx-auto px-4 py-8 flex-grow">
                <div className="mb-4">
                    <h2 className="text-3xl font-bold text-gray-800">Community Forum</h2>
                    <p className="text-gray-600">Connect, learn, and share with the LokRise community</p>
                </div>

                <ForumHeader
                    title="Welcome to our Community Forum"
                    description="Ask questions, share ideas, report bugs, and connect with other LokRise users"
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="mb-8">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Categories</h3>
                            <div className="space-y-3">
                                {categories.map(category => (
                                    <ForumCategoryCard key={category.id} category={category} />
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Discussions</h3>
                            <ForumTopicList topics={recentTopics} />
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <ForumSidebar popularTopics={trendingTopics} />
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Forum;