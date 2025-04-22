import React, { useState, useEffect } from 'react';

const TestimonialSection = () => {
    const testimonials = [
        {
            id: 1,
            name: 'Suresh Kumar',
            role: 'Farmer',
            company: 'Suresh Agro Farms',
            image: 'https://placehold.co/100?text=SK',
            quote: 'The agriculture training I received helped me increase my crop yield and improve farm management. Now, I am able to market my products directly to buyers, and my business has grown significantly.',
            course: 'Sustainable Farming Techniques'
        },
        {
            id: 2,
            name: 'Radha Devi',
            role: 'Handicraft Artisan',
            company: 'Radha’s Handmade Creations',
            image: 'https://placehold.co/100?text=RD',
            quote: 'Learning the art of handicrafts through the course gave me the skills to expand my small business. I now create and sell beautiful handmade items, and I can reach customers worldwide with the help of digital platforms.',
            course: 'Handicraft Business Management'
        },
        {
            id: 3,
            name: 'Vijay Singh',
            role: 'Small Business Owner',
            company: 'Vijay’s Organic Goods',
            image: 'https://placehold.co/100?text=VS',
            quote: 'The courses in digital marketing and e-commerce empowered me to bring my organic products online. I have a growing customer base and increased sales thanks to the skills I learned.',
            course: 'Digital Marketing for Rural Entrepreneurs'
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
                    <h2 className="text-3xl font-bold text-gray-800 mb-4 font-museo">Rural Empowerment Success Stories</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        See how our courses are helping rural artisans, farmers, and entrepreneurs thrive in the modern economy
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
            </div>
        </section>
    );
};

export default TestimonialSection;