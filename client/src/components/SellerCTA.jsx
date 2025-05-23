import React from 'react';
import { Link } from 'react-router-dom';

const SellerCTA = () => {
    return (
        <section className="py-16 px-4 bg-[var(--primary-color)]">
            <div className="max-w-7xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                    Ready to Grow Your Business with Lokrise?
                </h2>
                <p className="text-white/90 text-lg md:text-xl max-w-3xl mx-auto mb-10">
                    Join thousands of sellers who have transformed their business by selling online with Lokrise's 0% commission marketplace
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/become-seller" className="bg-white text-[var(--primary-color)] py-4 px-8 rounded-full font-bold hover:bg-gray-100 transition duration-300 text-lg text-center">
                        Start Selling Now
                    </Link>
                </div>

                <div className="mt-12 bg-white/10 rounded-lg p-6 max-w-2xl mx-auto">
                    <h3 className="text-white text-xl font-semibold mb-4">
                        Lokrise Seller Support Available 24/7
                    </h3>
                    <p className="text-white/80">
                        Our support team is always available to solve all your doubts and issues before and after you start your online selling business.
                    </p>
                    <div className="mt-4 flex justify-center items-center gap-2">
                        <span className="text-white">Email us at: </span>
                        <a href="mailto:thecreons@gmail.com" className="text-white underline">thecreons@gmail.com</a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SellerCTA;