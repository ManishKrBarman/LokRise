import React, { useState } from 'react';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        orderNumber: '',
        subject: '',
        message: ''
    });

    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        // Here you would typically send the form data to your server
        setSubmitted(true);

        // Reset form after submission
        setFormData({
            name: '',
            email: '',
            orderNumber: '',
            subject: '',
            message: ''
        });

        // Reset the success message after 5 seconds
        setTimeout(() => {
            setSubmitted(false);
        }, 5000);
    };

    const subjects = [
        "Order Status",
        "Returns & Refunds",
        "Product Information",
        "Payment Issues",
        "Shipping & Delivery",
        "Account Problems",
        "Technical Support",
        "Other"
    ];

    return (
        <div id="contact" className="py-16 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Contact Us
                    </h2>
                    <p className="mt-4 text-xl text-gray-600">
                        Fill out the form below and we'll get back to you as soon as possible
                    </p>
                </div>

                {submitted ? (
                    <div className="bg-[#9B7653]/10 border-l-4 border-[#9B7653] p-4 mb-6">
                        <div className="flex">
                            <div>
                                <p className="text-[#9B7653] font-medium">
                                    Thank you for your message! We'll get back to you shortly.
                                </p>
                            </div>
                        </div>
                    </div>
                ) : null}

                <form
                    onSubmit={handleSubmit}
                    className="bg-white shadow-md rounded-lg p-8"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#9B7653] focus:border-[#9B7653]"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#9B7653] focus:border-[#9B7653]"
                            />
                        </div>

                        <div>
                            <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700">
                                Order Number (if applicable)
                            </label>
                            <input
                                type="text"
                                id="orderNumber"
                                name="orderNumber"
                                value={formData.orderNumber}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#9B7653] focus:border-[#9B7653]"
                            />
                        </div>

                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                                Subject
                            </label>
                            <select
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#9B7653] focus:border-[#9B7653]"
                            >
                                <option value="">Select a subject</option>
                                {subjects.map((subject, index) => (
                                    <option key={index} value={subject}>{subject}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mt-6">
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                            Message
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            rows="5"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#9B7653] focus:border-[#9B7653]"
                            placeholder="Please provide as much detail as possible about your inquiry..."
                        ></textarea>
                    </div>

                    <div className="mt-6">
                        <button
                            type="submit"
                            className="w-full bg-[#9B7653] py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white hover:bg-[#8A684A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#9B7653]"
                        >
                            Submit
                        </button>
                    </div>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-gray-600">
                        For urgent inquiries, please call our support hotline:
                    </p>
                    <a
                        href="tel:+18001234567"
                        className="font-medium text-[#9B7653] hover:text-[#8A684A] text-lg mt-1 inline-block"
                    >
                        1-800-123-4567
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ContactForm;