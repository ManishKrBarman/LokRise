import React from 'react';

const SellerSteps = () => {
    const steps = [
        {
            number: 1,
            title: 'Create Account',
            description: 'All you need is: GSTIN (for GST sellers) or Enrolment ID / UIN (for non-GST sellers) and a Bank Account'
        },
        {
            number: 2,
            title: 'List Products',
            description: 'List the products you want to sell in your seller dashboard'
        },
        {
            number: 3,
            title: 'Get Orders',
            description: 'Start getting orders from millions of Indians actively shopping on our platform'
        },
        {
            number: 4,
            title: 'Lowest Cost Shipping',
            description: 'Products are shipped to customers at lowest costs with reliable logistics partners'
        },
        {
            number: 5,
            title: 'Receive Payments',
            description: 'Payments are deposited directly to your bank account following a 7-day payment cycle'
        }
    ];

    return (
        <section className="py-16 px-4 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">How It Works</h2>
                    <p className="text-gray-600 max-w-3xl mx-auto">
                        Get started with Lokrise in just a few simple steps
                    </p>
                </div>

                <div className="flex flex-col">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className={`flex flex-col md:flex-row items-start md:items-center gap-6 p-6 rounded-lg ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'
                                } mb-4 border border-gray-200`}
                        >
                            <div className="flex-none w-12 h-12 flex items-center justify-center rounded-full bg-[var(--primary-color)] text-white font-bold text-xl">
                                {step.number}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-800 mb-1">{step.title}</h3>
                                <p className="text-gray-600">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-10 text-center">
                    <button className="bg-[var(--primary-color)] text-white py-3 px-8 rounded-full font-bold hover:bg-[var(--primary-color)]/90 transition duration-300 text-lg">
                        Start Selling Now
                    </button>
                </div>
            </div>
        </section>
    );
};

export default SellerSteps;