import React from 'react';

const InstructorHighlights = () => {
    const instructors = [
        {
            name: 'Dr. Sarah Johnson',
            title: 'Data Science & AI Expert',
            courses: 15,
            students: 85600,
            rating: 4.9,
            image: 'https://placehold.co/150?text=SJ',
            bio: 'Former ML researcher at Google with PhD in Computer Science. Specializes in machine learning and artificial intelligence.'
        },
        {
            name: 'Mark Williams',
            title: 'Web Development Instructor',
            courses: 12,
            students: 124000,
            rating: 4.8,
            image: 'https://placehold.co/150?text=MW',
            bio: 'Full-stack developer with over 10 years of industry experience at top tech companies including Facebook and Airbnb.'
        },
        {
            name: 'Emily Chen',
            title: 'UX/UI Design Expert',
            courses: 8,
            students: 62400,
            rating: 4.9,
            image: 'https://placehold.co/150?text=EC',
            bio: 'Award-winning designer with experience at major design firms. Teaches modern design principles and practical UI/UX workflows.'
        },
        {
            name: 'Robert Taylor',
            title: 'Business & Marketing Professor',
            courses: 10,
            students: 93200,
            rating: 4.7,
            image: 'https://placehold.co/150?text=RT',
            bio: 'MBA from Harvard Business School with 15+ years of marketing leadership experience at Fortune 500 companies.'
        }
    ];

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4 font-museo">Learn from Top Instructors</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Get taught by industry experts who are passionate about sharing their knowledge and experience
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

                <div className="mt-12 text-center">
                    <a
                        href="/instructors"
                        className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700"
                    >
                        Browse All Instructors
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default InstructorHighlights;