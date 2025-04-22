import React from 'react';

const EduCTA = () => {
    return (
        <section className="py-20 bg-gradient-to-r from-indigo-800 to-blue-900 text-white">
            <div className="max-w-7xl mx-auto px-4 text-center">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-4xl font-bold mb-6 font-museo">Empower Your Rural Journey Today</h2>
                    <p className="text-lg text-blue-100 mb-8">
                        Join thousands of rural artisans, farmers, and entrepreneurs and learn skills that transform lives and communities.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="/courses"
                            className="inline-block py-3 px-8 bg-white text-blue-900 font-medium rounded-md hover:bg-gray-100 transition-colors"
                        >
                            Explore Rural Courses
                        </a>
                        <a
                            href="/register"
                            className="inline-block py-3 px-8 bg-transparent border-2 border-white text-white font-medium rounded-md hover:bg-white hover:text-blue-900 transition-colors"
                        >
                            Sign Up Free
                        </a>
                    </div>

                    <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold">50+</div>
                            <div className="text-blue-200 text-sm">Rural Empowerment Courses</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold">20+</div>
                            <div className="text-blue-200 text-sm">Rural Students Enrolled</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold">8+</div>
                            <div className="text-blue-200 text-sm">Local Expert Trainers</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold">4.3</div>
                            <div className="text-blue-200 text-sm">Avg. Course Rating</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EduCTA;