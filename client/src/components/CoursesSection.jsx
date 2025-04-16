import React from 'react';
import CourseCard from './CourseCard';

const CoursesSection = () => {
    // Sample course data
    const courses = [
        {
            id: 1,
            title: "Complete Web Development Bootcamp",
            price: 89.99,
            originalPrice: 129.99,
            rating: 4.8,
            reviewCount: 2734,
            studentsCount: 12500,
            level: "All Levels",
            imageUrl: "/api/placeholder/400/230",
            instructor: { name: "CodeMaster", avatar: "/api/placeholder/40/40" }
        },
        {
            id: 2,
            title: "Digital Marketing Masterclass",
            price: 69.99,
            originalPrice: 99.99,
            rating: 4.6,
            reviewCount: 1856,
            studentsCount: 8700,
            level: "Beginner",
            imageUrl: "/api/placeholder/400/230",
            instructor: { name: "MarketPro", avatar: "/api/placeholder/40/40" }
        },
        {
            id: 3,
            title: "Photography Fundamentals",
            price: 49.99,
            rating: 4.7,
            reviewCount: 1245,
            studentsCount: 6300,
            level: "Beginner",
            imageUrl: "/api/placeholder/400/230",
            instructor: { name: "PhotoArt", avatar: "/api/placeholder/40/40" }
        },
        {
            id: 4,
            title: "Financial Analysis & Investment",
            price: 119.99,
            originalPrice: 149.99,
            rating: 4.9,
            reviewCount: 978,
            studentsCount: 4200,
            level: "Intermediate",
            imageUrl: "/api/placeholder/400/230",
            instructor: { name: "FinanceGuru", avatar: "/api/placeholder/40/40" }
        }
    ];

    return (
        <section className="py-8 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 font-museo">Featured Courses</h2>
                    <a href="/courses" className="text-[var(--primary-color)] hover:underline font-medium">
                        View All
                    </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {courses.map(course => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CoursesSection;