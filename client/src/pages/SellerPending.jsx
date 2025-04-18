import React from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { FiCheckCircle, FiClock, FiMail } from 'react-icons/fi';

const SellerPending = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <NavBar />

            <div className="flex-grow container mx-auto px-4 py-16">
                <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-8">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-20 h-20 rounded-full bg-[var(--primary-color)]/10 flex items-center justify-center mb-6">
                            <FiClock className="w-10 h-10 text-[var(--primary-color)]" />
                        </div>

                        <h1 className="text-3xl font-bold text-gray-800 mb-4">
                            Application Under Review
                        </h1>

                        <p className="text-gray-600 mb-8 max-w-lg">
                            Thank you for applying to become a seller on LokRise! Your application has been submitted and is currently under review.
                        </p>

                        <div className="w-full max-w-md bg-blue-50 rounded-lg p-6 mb-8">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">What happens next?</h2>

                            <div className="space-y-4">
                                <div className="flex">
                                    <div className="flex-shrink-0 mr-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                            <FiCheckCircle className="w-4 h-4 text-blue-600" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-700">
                                            <span className="font-medium">Application Submitted</span><br />
                                            We've received your application
                                        </p>
                                    </div>
                                </div>

                                <div className="flex">
                                    <div className="flex-shrink-0 mr-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                            <FiClock className="w-4 h-4 text-blue-600" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-700">
                                            <span className="font-medium">Review Process (24-48 hours)</span><br />
                                            Our team is reviewing your information
                                        </p>
                                    </div>
                                </div>

                                <div className="flex">
                                    <div className="flex-shrink-0 mr-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                            <FiMail className="w-4 h-4 text-blue-600" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-700">
                                            <span className="font-medium">Email Notification</span><br />
                                            You'll receive an email once your application is approved
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                to="/"
                                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-300"
                            >
                                Return to Homepage
                            </Link>

                            <Link
                                to="/contact"
                                className="px-6 py-3 bg-[var(--primary-color)] text-white rounded-lg hover:bg-opacity-90 transition duration-300"
                            >
                                Contact Support
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="max-w-3xl mx-auto mt-8 p-6 bg-gray-100 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Helpful Tips</h3>
                    <ul className="space-y-2">
                        <li className="flex items-start">
                            <span className="text-[var(--primary-color)] mr-2">•</span>
                            <p className="text-gray-700">Start preparing product descriptions and images while you wait for approval</p>
                        </li>
                        <li className="flex items-start">
                            <span className="text-[var(--primary-color)] mr-2">•</span>
                            <p className="text-gray-700">Read our <a href="/seller-guidelines" className="text-[var(--primary-color)] underline">Seller Guidelines</a> for tips on creating successful product listings</p>
                        </li>
                        <li className="flex items-start">
                            <span className="text-[var(--primary-color)] mr-2">•</span>
                            <p className="text-gray-700">Don't forget to check your email (including spam/junk folders) for updates on your application</p>
                        </li>
                    </ul>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default SellerPending;