import React from 'react';

const InstructorHighlights = () => {
    const instructors = [
        {
            name: 'Dr. Priya Mehta',
            title: 'Agricultural Innovation Expert',
            courses: 10,
            students: 12300,
            rating: 4.8,
            image: 'https://placehold.co/150?text=PM',
            bio: 'Expert in sustainable farming practices and rural agricultural innovation. Advocates for technology integration to improve rural farming productivity.'
        },
        {
            name: 'Arvind Kumar',
            title: 'Farmers’ Empowerment Advocate',
            courses: 8,
            students: 9200,
            rating: 4.7,
            image: 'https://placehold.co/150?text=AK',
            bio: 'Specializes in business models for rural farmers. Works closely with grassroots organizations to improve the financial literacy of farmers.'
        },
        {
            name: 'Anita Sharma',
            title: 'Digital Tools for Rural Artisans',
            courses: 6,
            students: 7500,
            rating: 4.9,
            image: 'https://placehold.co/150?text=AS',
            bio: 'Trains rural artisans in using digital tools to enhance their craft, marketing, and sales. Strong proponent of empowering artisans through tech.'
        },
        {
            name: 'Ravi Deshmukh',
            title: 'Sustainable Agriculture and Rural Development',
            courses: 9,
            students: 11000,
            rating: 4.6,
            image: 'https://placehold.co/150?text=RD',
            bio: 'Development professional with expertise in sustainable agriculture and rural community projects. Helps communities develop eco-friendly farming techniques.'
        }
    ];

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4 font-museo">Learn from Rural Empowerment Experts</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Get insights from professionals who are changing the landscape of rural farming, business, and technology.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {instructors.map((instructor, index) => (
                        <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 flex flex-col">
                            <div className="p-6 text-center">
                                <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden">
                                    <img
                                        src={instructor.image}
                                        alt={instructor.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800">{instructor.name}</h3>
                                <p className="text-blue-600 text-sm mb-2">{instructor.title}</p>

                                <div className="flex justify-center items-center mb-4">
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <svg
                                                key={i}
                                                className={`w-4 h-4 ${i < Math.floor(instructor.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-600 ml-2">{instructor.rating}</span>
                                </div>

                                <div className="flex justify-around border-t border-b border-gray-100 py-3 mb-4">
                                    <div className="text-center">
                                        <div className="text-lg font-bold text-gray-800">{instructor.courses}</div>
                                        <div className="text-xs text-gray-500">Courses</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-lg font-bold text-gray-800">{(instructor.students / 1000).toFixed(1)}k</div>
                                        <div className="text-xs text-gray-500">Students</div>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-600 mb-4">
                                    {instructor.bio}
                                </p>

                                <a
                                    href={`/instructor/${instructor.name.toLowerCase().replace(/\s+/g, '-')}`}
                                    className="inline-flex items-center text-blue-600 font-medium text-sm hover:text-blue-700"
                                >
                                    View Profile
                                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default InstructorHighlights;