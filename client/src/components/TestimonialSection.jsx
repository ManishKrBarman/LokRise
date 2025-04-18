import React, { useState, useEffect } from 'react';

const TestimonialSection = () => {
    const testimonials = [
        {
            id: 1,
            name: 'Michael Rodriguez',
            role: 'Software Developer',
            company: 'Tech Solutions Inc.',
            image: 'https://placehold.co/100?text=MR',
            quote: 'The web development courses completely transformed my career. I went from knowing basic HTML to building full-stack applications, which helped me land my dream job. The instructors are amazing and truly care about student success.',
            course: 'Full Stack Web Development Bootcamp'
        },
        {
            id: 2,
            name: 'Jessica Chen',
            role: 'UX Designer',
            company: 'Creative Studio',
            image: 'https://placehold.co/100?text=JC',
            quote: 'As someone with no design background, I was nervous about learning UX/UI design. But the structured approach and real-world projects gave me the confidence I needed. Now I\'m working at a top creative agency!',
            course: 'UX/UI Design Masterclass'
        },
        {
            id: 3,
            name: 'David Thompson',
            role: 'Marketing Director',
            company: 'Global Brands',
            image: 'https://placehold.co/100?text=DT',
            quote: 'The digital marketing courses offered practical skills that I was able to implement immediately. Our company\'s online presence improved dramatically, and I attribute much of our recent growth to what I learned here.',
            course: 'Digital Marketing Professional'
        }
    ];

    const [activeIndex, setActiveIndex] = useState(0);

    // Auto-rotate testimonials
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((current) => (current + 1) % testimonials.length);
        }, 8000);

        return () => clearInterval(interval);
    }, [testimonials.length]);

    return (
        <section className="py-16 bg-white relative">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-5">
                <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-500"></div>
                <div className="absolute top-1/2 right-0 w-64 h-64 rounded-full bg-purple-500"></div>
                <div className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full bg-green-500"></div>
            </div>

            <div className="max-w-6xl mx-auto px-4 relative z-10">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4 font-museo">Student Success Stories</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        See how our courses have helped thousands of students achieve their goals
                    </p>
                </div>

                <div className="relative">
                    {/* Testimonial cards */}
                    <div className="flex flex-col md:flex-row justify-center items-center">
                        <div className="bg-white rounded-xl shadow-lg p-8 max-w-3xl mx-auto border border-gray-100">
                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                <div className="flex-shrink-0">
                                    <div className="w-20 h-20 rounded-full overflow-hidden">
                                        <img
                                            src={testimonials[activeIndex].image}
                                            alt={testimonials[activeIndex].name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>

                                <div className="flex-grow">
                                    <div className="mb-6">
                                        <svg className="h-8 w-8 text-blue-500 mb-4" fill="currentColor" viewBox="0 0 32 32">
                                            <path d="M10 8c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10S15.5 8 10 8zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm20-18c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10S25.5 8 20 8zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z" />
                                        </svg>

                                        <p className="text-gray-700 text-lg italic leading-relaxed">
                                            {testimonials[activeIndex].quote}
                                        </p>
                                    </div>

                                    <div className="border-t border-gray-100 pt-4">
                                        <h4 className="font-bold text-gray-800">{testimonials[activeIndex].name}</h4>
                                        <p className="text-gray-600 text-sm">{testimonials[activeIndex].role}, {testimonials[activeIndex].company}</p>
                                        <p className="text-blue-600 text-sm mt-1">Student in: {testimonials[activeIndex].course}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation indicators */}
                    <div className="flex justify-center mt-8">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveIndex(index)}
                                className={`w-3 h-3 rounded-full mx-2 focus:outline-none transition-colors ${index === activeIndex ? 'bg-blue-600' : 'bg-gray-300 hover:bg-gray-400'
                                    }`}
                                aria-label={`View testimonial ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <a
                        href="/success-stories"
                        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                        Read More Stories
                    </a>
                </div>
            </div>
        </section>
    );
};

export default TestimonialSection;