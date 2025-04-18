import React, { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const SellerTestimonials = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const testimonials = [
        {
            id: 1,
            name: 'Amit Kumar',
            business: 'Smartees Fashion, Delhi',
            image: 'https://placehold.co/200x200/7D23E0/ffffff?text=A',
            quote: 'Our business has grown beyond our imagination, getting up to 5,000 orders consistently during sale days. We are now constantly bringing new products thanks to Lokrise\'s insights.'
        },
        {
            id: 2,
            name: 'Priya Sharma',
            business: 'Elegant Jewels, Mumbai',
            image: 'https://placehold.co/200x200/7D23E0/ffffff?text=P',
            quote: 'Lokrise made it extremely simple to transition to online business. Suddenly we were all over India to our surprise, seeing up to 3X growth on sale days.'
        },
        {
            id: 3,
            name: 'Rajesh Singh',
            business: 'Tech Gadgets, Bangalore',
            image: 'https://placehold.co/200x200/7D23E0/ffffff?text=R',
            quote: 'I started selling on Lokrise with 4-5 orders on the very first day. In no time I was getting over 500 orders a day, like a dream come true.'
        }
    ];

    const nextTestimonial = () => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
    };

    return (
        <section className="py-16 px-4 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Experienced Sellers Love to Talk About</h2>
                    <p className="text-gray-600 max-w-3xl mx-auto">
                        Hear from businesses that have grown with Lokrise
                    </p>
                </div>

                <div className="relative">
                    <div className="flex items-center justify-center">
                        <button
                            onClick={prevTestimonial}
                            className="absolute left-0 z-10 lg:left-10 bg-white w-10 h-10 rounded-full shadow-md flex items-center justify-center hover:bg-gray-100"
                            aria-label="Previous testimonial"
                        >
                            <FiChevronLeft size={24} className="text-[var(--primary-color)]" />
                        </button>

                        <div className="bg-gray-50 rounded-xl p-6 md:p-10 shadow-sm border border-gray-100 max-w-3xl mx-12">
                            <div className="flex flex-col md:flex-row gap-8 items-center">
                                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden flex-shrink-0">
                                    <img
                                        src={testimonials[activeIndex].image}
                                        alt={testimonials[activeIndex].name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1">
                                    <p className="text-gray-600 italic text-lg mb-4">"{testimonials[activeIndex].quote}"</p>
                                    <h4 className="font-bold text-xl text-gray-800">{testimonials[activeIndex].name}</h4>
                                    <p className="text-[var(--primary-color)]">{testimonials[activeIndex].business}</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={nextTestimonial}
                            className="absolute right-0 z-10 lg:right-10 bg-white w-10 h-10 rounded-full shadow-md flex items-center justify-center hover:bg-gray-100"
                            aria-label="Next testimonial"
                        >
                            <FiChevronRight size={24} className="text-[var(--primary-color)]" />
                        </button>
                    </div>

                    <div className="flex justify-center mt-8 gap-2">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveIndex(index)}
                                className={`w-3 h-3 rounded-full ${index === activeIndex ? 'bg-[var(--primary-color)]' : 'bg-gray-300'
                                    }`}
                                aria-label={`Go to testimonial ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SellerTestimonials;