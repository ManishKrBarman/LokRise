import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import '../index.css';

const AboutPage = () => {
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch('http://localhost:3001/about')
            .then((res) => res.json())
            .then((data) => setMessage(data.message))
            .catch((err) => console.error('Error fetching about data:', err));
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-white text-gray-800">
            <Navbar />
            <main className="flex-grow pt-[128px] px-4 md:px-16 lg:px-32 space-y-16">

                {/* Hero Section */}
                <section className="text-center">
                    <motion.section
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Empowering Rural Artisans and Farmers</h1>
                        <p className="text-lg md:text-xl text-gray-600">
                            Lokrise is a tech-driven initiative to uplift India’s grassroots economy by giving local producers direct access to digital markets.
                        </p>
                    </motion.section>
                </section>

                {/* Why Lokrise */}
                <section>
                    <motion.section
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-2xl md:text-3xl font-semibold mb-4">Why Lokrise?</h2>
                        <ul className="space-y-4 text-gray-700 list-disc list-inside">
                            <li>🔗 Connects artisans and farmers directly to consumers</li>
                            <li>📱 Provides a simple and powerful mobile-first platform</li>
                            <li>💬 Offers support in local languages for inclusivity</li>
                            <li>💰 Ensures fair trade by eliminating middlemen</li>
                            <li>⚡ Uses cutting-edge tech like OTP auth and QR payments</li>
                        </ul>
                    </motion.section>
                </section>

                {/* Team Section (optional) */}
                <section>
                    <motion.section
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-center">Meet the Team</h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[{"Manish":"Developer"}, {"Devesh":"Developer"}, {"Raghav":"UI/UX Designer & Cousellor"}, {"Himanshi":"UI/UX Designer"}].map((member, i) => {
                            const [name, role] = Object.entries(member)[0];
                            return (
                            <div key={i} className="bg-gray-100 p-4 rounded-xl shadow hover:shadow-lg transition w-64">
                                <img src={`/team/${name.toLowerCase()}.jpg`} alt={name} className="h-32 w-full object-cover rounded mb-3" />
                                <h3 className="text-lg font-bold">{name}</h3>
                                <p className="text-sm text-gray-600">{role}</p>
                            </div>
                            );
                        })}
                        </div>
                    </motion.section>
                </section>

                {/* Backend Message */}
                <section className="mt-10 text-center">
                    <p className="text-sm text-gray-500 italic">
                        {message ? `Server says: "${message}"` : 'Connecting to backend...'}
                    </p>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default AboutPage;