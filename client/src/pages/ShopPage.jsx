import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ShopPage = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    if (!state) {
        return (
            <div className="flex flex-col items-center justify-center h-screen text-center px-4">
                <h2 className="text-3xl font-bold mb-4">Oops! No data received 😅</h2>
                <p className="text-gray-600 mb-6">Please go back and select a collection from the homepage.</p>
                <button
                    className="bg-[var(--primary-color)] text-white px-6 py-2 rounded-full hover:bg-opacity-90 transition"
                    onClick={() => navigate('/')}
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <section className="min-h-screen py-10 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold mb-2 text-gray-800">{state.title}</h1>
                <p className="text-gray-600 mb-6">{state.description}</p>
                <img
                    src={state.imageUrl}
                    alt={state.title}
                    className="w-full max-h-[400px] object-cover rounded-lg mb-8"
                />

                {/* Placeholder for actual products */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((item) => (
                        <div key={item} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition">
                            <div className="bg-gray-100 h-40 rounded mb-4 flex items-center justify-center text-gray-400">
                                Product {item}
                            </div>
                            <h3 className="text-lg font-semibold mb-2">{state.category} Item {item}</h3>
                            <p className="text-sm text-gray-600 mb-4">This is a sample description of the product.</p>
                            <button className="bg-[var(--primary-color)] text-white px-4 py-2 rounded-full hover:bg-opacity-90 transition">
                                Buy Now
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ShopPage;