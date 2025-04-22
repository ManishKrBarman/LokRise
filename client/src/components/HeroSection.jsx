import React, { useEffect, useRef, useState } from 'react';
import { FiPause, FiPlay } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
    const [isScrolling, setIsScrolling] = useState(true);
    const scrollRef = useRef(null);
    const scrollAmountRef = useRef(0);
    const animationIdRef = useRef(null);
    const clonedRef = useRef(false);
    const navigate = useNavigate();

    const banners = [
        {
            id: 1,
            title: "Summer Collection 2025",
            description: "Discover the latest trends for the season",
            bgColor: "bg-gradient-to-r from-[var(--tertiary-color)] to-blue-400",
            imageUrl: "https://placehold.co/600x300?text=Summer+Collection+2025",
            category: "summer"
        },
        {
            id: 2,
            title: "Tech Gadgets Sale",
            description: "Up to 40% off on premium electronics",
            bgColor: "bg-gradient-to-r from-[var(--primary-color)] to-amber-400",
            imageUrl: "https://placehold.co/600x300?text=Tech+Gadgets+Sale",
            category: "electronics"
        },
        {
            id: 3,
            title: "Home Decor Collection",
            description: "Transform your space with our exclusive items",
            bgColor: "bg-gradient-to-r from-[var(--secondary-color)] to-green-300",
            imageUrl: "https://placehold.co/600x300?text=Home+Decor+Collection",
            category: "homedecor"
        }
    ];

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer || clonedRef.current) return;

        const scrollContent = Array.from(scrollContainer.children);
        scrollContent.forEach(item => {
            const clone = item.cloneNode(true);
            scrollContainer.appendChild(clone);
        });
        clonedRef.current = true;
    }, []);

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        const distance = 0.5;
        let lastTime = performance.now();

        const scroll = (timestamp) => {
            if (!isScrolling) return;

            const deltaTime = timestamp - lastTime;
            lastTime = timestamp;

            scrollAmountRef.current += distance * (deltaTime / 16);
            scrollContainer.scrollLeft = scrollAmountRef.current;

            if (scrollAmountRef.current >= scrollContainer.scrollWidth / 2) {
                scrollAmountRef.current = 0;
                scrollContainer.scrollLeft = 0;
            }

            animationIdRef.current = requestAnimationFrame(scroll);
        };

        animationIdRef.current = requestAnimationFrame(scroll);

        return () => {
            if (animationIdRef.current) {
                cancelAnimationFrame(animationIdRef.current);
            }
        };
    }, [isScrolling]);

    const handleShopNow = (banner) => {
        navigate('/shop', { state: banner });
    };

    return (
        <section className="py-8 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-1">Trending Now 🔥 </h2>
                        <p className="text-gray-600 text-sm md:text-base">Explore what's hot and happening across fashion, gadgets, and home trends.</p>
                    </div>
                </div>

                <div className="overflow-hidden" style={{ borderRadius: '10px' }}>
                    <div
                        ref={scrollRef}
                        className="flex gap-4 overflow-x-auto scrollbar-hide"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        onMouseEnter={() => setIsScrolling(false)}
                        onMouseLeave={() => setIsScrolling(true)}
                    >
                        {banners.map((banner) => (
                            <div
                                key={banner.id}
                                className="min-w-[300px] md:min-w-[500px] rounded-lg overflow-hidden shadow-md flex-shrink-0 transition-transform duration-500"
                            >
                                <div className={`${banner.bgColor} p-6 h-full flex flex-col justify-between`}>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-2">{banner.title}</h3>
                                        <p className="text-white opacity-80">{banner.description}</p>
                                    </div>
                                    <div className="mt-4">
                                        <img
                                            src={banner.imageUrl}
                                            alt={banner.title}
                                            className="w-full h-40 opacity-50 object-cover rounded"
                                        />
                                        <button
                                            onClick={() => handleShopNow(banner)}
                                            className="mt-4 bg-white text-[var(--primary-color)] py-2 px-6 rounded-full font-medium hover:bg-gray-100 transition duration-300"
                                        >
                                            Shop Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;