import React from 'react';
import { FiSearch } from 'react-icons/fi';

const EduHero = () => {
    return (
        <section className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white py-16">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center">
                    <div className="lg:w-1/2 mb-10 lg:mb-0">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 font-museo leading-tight">
                            Unlock Your Potential with Experience & Expert-Led Courses
                        </h1>
                        <p className="text-lg mb-8 text-blue-100 max-w-xl">
                            Gain skills that matter with our high-quality courses designed by rural & industry experts. Learn at your own pace and transform your career.
                        </p>

                        <div className="relative max-w-md">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="What do you want to learn today?"
                                className="bg-white rounded-full py-3 pl-10 pr-4 w-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white rounded-full px-5 py-2 text-sm font-medium transition duration-200">
                                Search
                            </button>
                        </div>

                        <div className="mt-6 flex items-center text-sm">
                            <span className="text-blue-200">Popular Courses:</span>
                            <div className="ml-2 flex flex-wrap gap-2">
                                {['Pottery','Textile dyeing','Ayurvedic','Organic farming techniques', 'Animal husbandry', 'Crop rotation', 'Fish farming'].map((topic, i) => (
                                    <a key={i} href={`/courses/${topic.toLowerCase().replace(/\s+/g, '-')}`} className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded-full transition">
                                        {topic}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="lg:w-1/2 lg:pl-10">
                        <div className="relative">
                            <img
                                src="https://i.ibb.co/BVgkLX89/learning-platform-banner-photo-for-showcasing-with-illustrations-without-background.jpg"
                                alt="Learning Platform"
                                className="rounded-lg shadow-2xl"
                            />
                            <div className="absolute -bottom-5 -left-5 bg-white rounded-lg p-4 shadow-lg">
                                <div className="flex items-center">
                                    <div className="bg-blue-100 p-3 rounded-full">
                                        <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.727 1.168 1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-gray-800 font-medium">10+ Courses</div>
                                        <div className="text-gray-500 text-sm">From leading experts</div>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -top-5 -right-5 bg-white rounded-lg p-4 shadow-lg">
                                <div className="flex items-center">
                                    <div className="bg-green-100 p-3 rounded-full">
                                        <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-gray-800 font-medium">Trusted Content</div>
                                        <div className="text-gray-500 text-sm">Quality guaranteed</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EduHero;