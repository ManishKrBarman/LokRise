import React, { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const SellerTestimonials = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const testimonials = [
    {
        id: 1,
        name: 'Geeta Devi',
        business: 'Madhubani Art Collective, Darbhanga (Bihar)',
        image: 'https://placehold.co/200x200/7D23E0/ffffff?text=G',
        quote: 'Earlier, I sold only in local fairs. With Lokrise, I now receive orders from cities like Pune and Chennai. The Hindi interface and QR payment made it easy even for my neighbors to join and earn.'
    },
    {
        id: 2,
        name: 'Ramesh Patel',
        business: 'Organic Grains Co-op, Sabarkantha (Gujarat)',
        image: 'https://placehold.co/200x200/7D23E0/ffffff?text=R',
        quote: 'Thanks to Lokrise, our grains now reach customers in metros directly. We didn’t need a website or tech knowledge—just our phone. The platform handles everything from listing to payments.'
    },
    {
        id: 3,
        name: 'Kavita Joshi',
        business: 'Pahadi Woolens, Chamoli (Uttarakhand)',
        image: 'https://placehold.co/200x200/7D23E0/ffffff?text=K',
        quote: 'My hand-knitted sweaters are now worn in cities like Delhi and Bengaluru! Lokrise’s support in Hindi and easy OTP login helped even my mother-in-law manage product listings.'
    },
    {
        id: 4,
        name: 'Ismail Sheikh',
        business: 'Terracotta Creations, Bhavnagar (Gujarat)',
        image: 'https://placehold.co/200x200/7D23E0/ffffff?text=I',
        quote: 'Our handmade items used to be sold by middlemen. With Lokrise, I get full price and track every order. We even trained local youth to manage packaging and shipping through the app.'
    },
    {
        id: 5,
        name: 'Savita Kumari',
        business: 'Chikankari Studio, Faizabad (U.P.)',
        image: 'https://placehold.co/200x200/7D23E0/ffffff?text=S',
        quote: 'I was scared of online selling, but Lokrise made it feel like home. With local language support and voice instructions, I listed my embroidery and got my first 100 orders in just a week.'
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