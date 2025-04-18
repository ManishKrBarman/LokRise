import React from 'react';

const EduCTA = () => {
    return (
        <section className="py-20 bg-gradient-to-r from-indigo-800 to-blue-900 text-white">
            <div className="max-w-7xl mx-auto px-4 text-center">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-4xl font-bold mb-6 font-museo">Start Your Learning Journey Today</h2>
                    <p className="text-lg text-blue-100 mb-8">
                        Join millions of students around the world and unlock your potential with our expert-led courses.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="/courses"
                            className="inline-block py-3 px-8 bg-white text-blue-900 font-medium rounded-md hover:bg-gray-100 transition-colors"
                        >
                            Explore Courses
                        </a>
                        <a
                            href="/signup"
                            className="inline-block py-3 px-8 bg-transparent border-2 border-white text-white font-medium rounded-md hover:bg-white hover:text-blue-900 transition-colors"
                        >
                            Sign Up Free
                        </a>
                    </div>

                    <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold">10K+</div>
                            <div className="text-blue-200 text-sm">Online Courses</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold">8M+</div>
                            <div className="text-blue-200 text-sm">Students</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold">200+</div>
                            <div className="text-blue-200 text-sm">Expert Instructors</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold">4.8</div>
                            <div className="text-blue-200 text-sm">Avg. Course Rating</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EduCTA;