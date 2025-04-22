import React from 'react';
import { FiPhone, FiMail, FiBookOpen } from 'react-icons/fi';

const SupportOptions = () => {
    const options = [
        {
            icon: <FiPhone className="w-10 h-10 text-[#9B7653]" />,
            title: 'Call Us',
            description: 'Speak directly with our customer service team',
            action: 'Call now',
            link: `tel:${import.meta.env.VITE_PHONE}`
        },
        {
            icon: <FiMail className="w-10 h-10 text-[#9B7653]" />,
            title: 'Email Support',
            description: 'Send us an email and we\'ll respond within 24 hours',
            action: 'Email us',
            link: `mailto:${import.meta.env.VITE_MAIL}`
        }
    ];

    return (
        <div className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Get Support</h2>
                    <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
                        Choose how you'd like to connect with our customer support team
                    </p>
                </div>

                <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4" style={{display: 'flex', justifyContent: 'space-evenly'}}>
                    {options.map((option, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow"
                        >
                            <div className="flex justify-center items-center w-16 h-16 rounded-full bg-[#9B7653]/10 mb-4">
                                {option.icon}
                            </div>
                            <h3 className="text-xl font-medium text-gray-900 mb-2">{option.title}</h3>
                            <p className="text-gray-600 mb-6 flex-grow">{option.description}</p>
                            <a
                                href={option.link}
                                className="px-4 py-2 bg-[#9B7653] text-white rounded-md hover:bg-[#8A684A] transition-colors inline-block"
                            >
                                {option.action}
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SupportOptions;
