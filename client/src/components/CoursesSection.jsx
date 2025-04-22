import React, { useState, useEffect } from 'react';
import CourseCard from './CourseCard';
import { productAPI } from '../services/api';

const CoursesSection = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);

                // Use a larger limit initially but only with exact course type filter
                const response = await productAPI.getProducts({
                    productType: 'course',
                    limit: 165, // Fetch more than needed to ensure we get enough courses
                    sort: 'popularity'
                });

                if (response.data && response.data.products) {
                    // Double check to confirm we only have courses
                    const coursesOnly = response.data.products.filter(
                        product => product.productType === 'course'
                    );

                    // Only take the first 4 courses
                    setCourses(coursesOnly.slice(0, 4));
                } else {
                    setCourses([]);
                }
                setError(null);
            } catch (err) {
                console.error('Error fetching courses:', err);
                setError('Failed to load courses');
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

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
                    {loading ? (
                        [...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                                <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        ))
                    ) : error ? (
                        <div className="col-span-full text-center text-red-500">{error}</div>
                    ) : courses.length === 0 ? (
                        <div className="col-span-full text-center text-gray-500">No courses available</div>
                    ) : (
                        courses.map(course => (
                            <CourseCard key={course._id} course={course} />
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};

export default CoursesSection;