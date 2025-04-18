import React, { useState } from 'react';
import CourseCard from './CourseCard';

const PopularCourses = () => {
    const [activeTab, setActiveTab] = useState('trending');

    // Sample course data
    const trendingCourses = [
        {
            id: 101,
            title: "Complete Python Pro Bootcamp",
            price: 94.99,
            originalPrice: 189.99,
            rating: 4.9,
            reviewCount: 3254,
            studentsCount: 28750,
            level: "All Levels",
            imageUrl: "https://placehold.co/300x200?text=Python+Course",
            instructor: { name: "PythonMaster", avatar: "https://placehold.co/40?text=PM" }
        },
        {
            id: 102,
            title: "UX/UI Design Masterclass",
            price: 79.99,
            originalPrice: 129.99,
            rating: 4.8,
            reviewCount: 1867,
            studentsCount: 15320,
            level: "Intermediate",
            imageUrl: "https://placehold.co/300x200?text=UI/UX+Design",
            instructor: { name: "DesignPro", avatar: "https://placehold.co/40?text=DP" }
        },
        {
            id: 103,
            title: "Data Science & Machine Learning",
            price: 109.99,
            originalPrice: 199.99,
            rating: 4.7,
            reviewCount: 2156,
            studentsCount: 19450,
            level: "Advanced",
            imageUrl: "https://placehold.co/300x200?text=Data+Science",
            instructor: { name: "DataGenius", avatar: "https://placehold.co/40?text=DG" }
        },
        {
            id: 104,
            title: "AWS Certified Solutions Architect",
            price: 124.99,
            originalPrice: 199.99,
            rating: 4.9,
            reviewCount: 2735,
            studentsCount: 22160,
            level: "Intermediate",
            imageUrl: "https://placehold.co/300x200?text=AWS+Certification",
            instructor: { name: "CloudExpert", avatar: "https://placehold.co/40?text=CE" }
        }
    ];

    const topRatedCourses = [
        {
            id: 201,
            title: "Advanced React & Redux",
            price: 89.99,
            originalPrice: 159.99,
            rating: 4.95,
            reviewCount: 1954,
            studentsCount: 17820,
            level: "Advanced",
            imageUrl: "https://placehold.co/300x200?text=React+Redux",
            instructor: { name: "ReactNinja", avatar: "https://placehold.co/40?text=RN" }
        },
        {
            id: 202,
            title: "iOS App Development with SwiftUI",
            price: 94.99,
            originalPrice: 169.99,
            rating: 4.92,
            reviewCount: 1532,
            studentsCount: 13670,
            level: "Intermediate",
            imageUrl: "https://placehold.co/300x200?text=iOS+Dev",
            instructor: { name: "SwiftGuru", avatar: "https://placehold.co/40?text=SG" }
        },
        {
            id: 203,
            title: "Financial Accounting Fundamentals",
            price: 74.99,
            originalPrice: 129.99,
            rating: 4.91,
            reviewCount: 2187,
            studentsCount: 20340,
            level: "Beginner",
            imageUrl: "https://placehold.co/300x200?text=Accounting",
            instructor: { name: "FinanceExpert", avatar: "https://placehold.co/40?text=FE" }
        },
        {
            id: 204,
            title: "Artificial Intelligence: Deep Learning",
            price: 129.99,
            originalPrice: 219.99,
            rating: 4.9,
            reviewCount: 1876,
            studentsCount: 15980,
            level: "Advanced",
            imageUrl: "https://placehold.co/300x200?text=Deep+Learning",
            instructor: { name: "AIWizard", avatar: "https://placehold.co/40?text=AI" }
        }
    ];

    const newCourses = [
        {
            id: 301,
            title: "Cybersecurity Fundamentals",
            price: 84.99,
            originalPrice: 149.99,
            rating: 4.5,
            reviewCount: 352,
            studentsCount: 4820,
            level: "Beginner",
            imageUrl: "https://placehold.co/300x200?text=Cybersecurity",
            instructor: { name: "SecurityPro", avatar: "https://placehold.co/40?text=SP" }
        },
        {
            id: 302,
            title: "Blockchain Development",
            price: 119.99,
            originalPrice: 189.99,
            rating: 4.6,
            reviewCount: 487,
            studentsCount: 5640,
            level: "Intermediate",
            imageUrl: "https://placehold.co/300x200?text=Blockchain",
            instructor: { name: "CryptoExpert", avatar: "https://placehold.co/40?text=CE" }
        },
        {
            id: 303,
            title: "Flutter App Development",
            price: 79.99,
            originalPrice: 139.99,
            rating: 4.7,
            reviewCount: 568,
            studentsCount: 6325,
            level: "Intermediate",
            imageUrl: "https://placehold.co/300x200?text=Flutter",
            instructor: { name: "FlutterDev", avatar: "https://placehold.co/40?text=FD" }
        },
        {
            id: 304,
            title: "Digital Marketing Analytics",
            price: 69.99,
            originalPrice: 119.99,
            rating: 4.4,
            reviewCount: 412,
            studentsCount: 5120,
            level: "All Levels",
            imageUrl: "https://placehold.co/300x200?text=Marketing",
            instructor: { name: "MarketingGuru", avatar: "https://placehold.co/40?text=MG" }
        }
    ];

    const coursesByTab = {
        trending: trendingCourses,
        topRated: topRatedCourses,
        new: newCourses
    };

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0 font-museo">Popular Courses</h2>

                    <div className="flex space-x-4 border-b border-gray-200 pb-1">
                        <button
                            onClick={() => setActiveTab('trending')}
                            className={`pb-2 text-sm font-medium transition-colors ${activeTab === 'trending'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-600 hover:text-blue-600'
                                }`}
                        >
                            Trending
                        </button>
                        <button
                            onClick={() => setActiveTab('topRated')}
                            className={`pb-2 text-sm font-medium transition-colors ${activeTab === 'topRated'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-600 hover:text-blue-600'
                                }`}
                        >
                            Top Rated
                        </button>
                        <button
                            onClick={() => setActiveTab('new')}
                            className={`pb-2 text-sm font-medium transition-colors ${activeTab === 'new'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-600 hover:text-blue-600'
                                }`}
                        >
                            New
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {coursesByTab[activeTab].map(course => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>

                <div className="mt-10 text-center">
                    <a
                        href="/courses"
                        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                        Browse All Courses
                        <svg className="w-5 h-5 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default PopularCourses;