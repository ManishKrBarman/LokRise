import React from 'react';

const CustomerServiceHero = () => {
    return (
        <div className="bg-gradient-to-r from-[#9B7653] to-[#BF9A70] py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
                    How can we help you?
                </h1>
                <p className="mt-6 max-w-3xl mx-auto text-xl text-white opacity-90">
                    Our support team is here to assist you with any questions or issues you may have.
                </p>

                <div className="mt-10 max-w-xl mx-auto">
                    <div className="relative">
                        <input
                            type="text"
                            className="block w-full px-5 py-4 text-base rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#9B7653]"
                            placeholder="Search for answers..."
                        />
                        <button className="absolute right-3 top-2 px-6 py-2 bg-[#9B7653]/90 hover:bg-[#9B7653] text-white font-medium rounded-full transition-colors">
                            Search
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerServiceHero;