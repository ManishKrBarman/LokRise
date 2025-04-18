import React from 'react';

const LearningPaths = () => {
    const paths = [
        {
            title: 'Web Development Career Path',
            description: 'Learn everything from HTML to React and Node.js to become a full-stack web developer',
            courses: 12,
            duration: '6 months',
            level: 'Beginner to Advanced',
            image: 'https://placehold.co/400x250?text=Web+Dev+Path',
            color: 'from-blue-600 to-indigo-600'
        },
        {
            title: 'Data Science Specialization',
            description: 'Master Python, statistics, machine learning and visualization to become a data professional',
            courses: 10,
            duration: '5 months',
            level: 'Intermediate',
            image: 'https://placehold.co/400x250?text=Data+Science+Path',
            color: 'from-purple-600 to-pink-600'
        },
        {
            title: 'Digital Marketing Professional',
            description: 'Learn SEO, social media, content marketing, analytics and more to drive business growth',
            courses: 8,
            duration: '4 months',
            level: 'Beginner to Intermediate',
            image: 'https://placehold.co/400x250?text=Marketing+Path',
            color: 'from-green-600 to-teal-600'
        }
    ];

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4 font-museo">Learning Paths</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Follow a structured learning journey designed by experts to master a complete skill set
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {paths.map((path, index) => (
                        <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-200 flex flex-col">
                            <div className={`relative h-48 bg-gradient-to-r ${path.color}`}>
                                <img
                                    src={path.image}
                                    alt={path.title}
                                    className="w-full h-full object-cover mix-blend-overlay"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <h3 className="text-2xl font-bold text-white text-center px-6">{path.title}</h3>
                                </div>
                            </div>

                            <div className="p-6 flex-grow">
                                <p className="text-gray-600 mb-4">{path.description}</p>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.727 1.168 1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                                        </svg>
                                        <span className="text-sm">{path.courses} Courses</span>
                                    </div>
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-sm">{path.duration}</span>
                                    </div>
                                </div>

                                <div className="flex items-center mb-4">
                                    <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                    </svg>
                                    <span className="text-sm">{path.level}</span>
                                </div>
                            </div>

                            <div className="px-6 pb-6">
                                <a
                                    href={`/learning-paths/${path.title.toLowerCase().replace(/\s+/g, '-')}`}
                                    className="w-full block py-3 px-4 text-center font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
                                >
                                    Explore Path
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <a
                        href="/learning-paths"
                        className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700"
                    >
                        View All Learning Paths
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default LearningPaths;