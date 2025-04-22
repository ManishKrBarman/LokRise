import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState(0);

    const faqs = [
        {
            question: 'How do I track my order?',
            answer: 'You can track your order by logging into your account and navigating to the "Orders" section. There, you will find all your recent orders and their current status. You can also click on any order to view detailed tracking information.'
        },
        {
            question: 'What is the return policy?',
            answer: 'We offer a 30-day return policy for most items. Products must be in their original condition with tags attached and original packaging. Some items like electronics may have different return windows. Please check the product page for specific return policy details.'
        },
        {
            question: 'How can I cancel my order?',
            answer: 'If your order hasn\'t shipped yet, you can cancel it through your account\'s "Orders" section. If the order has already shipped, you\'ll need to wait for delivery and then initiate a return. For assistance with cancellations, please contact our customer service team.'
        },
        {
            question: 'When will I receive my refund?',
            answer: 'Once we receive and process your return, refunds typically take 3-5 business days to appear in your account. The exact timing depends on your payment method and financial institution.'
        },
        {
            question: 'Do you ship internationally?',
            answer: 'Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by location. You can see the shipping options available to your country during checkout.'
        },
        {
            question: 'How do I change my account details?',
            answer: 'You can update your account information by logging in and navigating to "Account Settings" or "My Profile." There, you\'ll be able to edit your personal information, shipping addresses, payment methods, and communication preferences.'
        }
    ];

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="py-16 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Frequently Asked Questions
                    </h2>
                    <p className="mt-4 text-xl text-gray-600">
                        Find answers to common questions about our services
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="border border-gray-200 rounded-lg overflow-hidden"
                        >
                            <button
                                className="flex justify-between items-center w-full px-6 py-4 text-lg font-medium text-left bg-white hover:bg-gray-50 focus:outline-none"
                                onClick={() => toggleFAQ(index)}
                            >
                                <span>{faq.question}</span>
                                {openIndex === index ? (
                                    <FiChevronUp className="h-6 w-6 text-[#9B7653]" />
                                ) : (
                                    <FiChevronDown className="h-6 w-6 text-[#9B7653]" />
                                )}
                            </button>

                            {openIndex === index && (
                                <div className="px-6 pb-4 text-gray-600">
                                    <p>{faq.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* <div className="mt-10 text-center">
                    <p className="text-gray-600">
                        Can't find what you're looking for?
                    </p>
                    <a
                        href="#contact"
                        className="mt-2 inline-block text-[#9B7653] font-medium hover:text-[#8A684A]"
                    >
                        Contact our support team
                    </a>
                </div> */}
            </div>
        </div>
    );
};

export default FAQSection;