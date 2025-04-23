import React, { useState, useEffect } from 'react';
import { FiX, FiAlertTriangle } from 'react-icons/fi';

const HackathonNotice = () => {
    const [isVisible, setIsVisible] = useState(false);
    const sessionStorageKey = 'hackathonNoticeDismissed';

    useEffect(() => {
        // Check if the notice has been dismissed before in this session
        const hasBeenDismissed = sessionStorage.getItem(sessionStorageKey);

        if (!hasBeenDismissed) {
            // Show the notice after a short delay for better UX
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 500);

            return () => clearTimeout(timer);
        }
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        // Mark as dismissed in session storage so it doesn't show again in this session
        sessionStorage.setItem(sessionStorageKey, 'true');
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 transition-opacity duration-300">
            <div className="bg-white max-w-lg w-full mx-4 rounded-xl shadow-2xl transform transition-all overflow-hidden">
                <div className="bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <FiAlertTriangle className="text-white text-2xl mr-2" />
                        <h3 className="text-white text-xl font-bold">Hackathon Project Notice</h3>
                    </div>
                    <button
                        onClick={handleDismiss}
                        className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
                        aria-label="Close"
                    >
                        <FiX className="text-xl" />
                    </button>
                </div>

                <div className="p-6">
                    <div className="prose max-w-none">
                        <p className="text-lg font-medium text-gray-800 mb-3">
                            Welcome to Lokrise! This is a demonstration project created for Hackazards 2025.
                        </p>
                        <p className="text-gray-600 mb-4">
                            This website is a mockup created by Team Creons. All products, UPI IDs, and transaction options
                            are simulated for demonstration purposes only. <span className="font-bold text-red-600">Please do not attempt
                                real transactions</span> as we will not be responsible for any financial losses.
                        </p>
                        <p className="text-gray-600 mb-4">
                            Feel free to explore the features we've built to showcase rural artisan empowerment through technology.
                            Enjoy your journey through our platform!
                        </p>
                        <p className="text-gray-600 mb-4">
                            Check out our source code at: <a href="https://github.com/ManishKrBarman/LokRise"
                                target="_blank" rel="noopener noreferrer"
                                className="text-blue-600 hover:underline">
                                Link
                            </a>
                        </p>
                        <div className="italic text-sm text-gray-500 border-t border-gray-200 pt-3 mt-3">
                            <p>— Team Creons, Hackazards 2025</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 px-6 py-4 flex justify-end">
                    <button
                        onClick={handleDismiss}
                        className="bg-[var(--primary-color)] hover:bg-opacity-90 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                    >
                        Got it!
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HackathonNotice;