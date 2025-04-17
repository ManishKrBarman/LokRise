import React, { useEffect, useRef, useState } from 'react';
import { FiPause, FiPlay } from 'react-icons/fi';

const HeroSection = () => {
    const [isScrolling, setIsScrolling] = useState(true);
    const scrollRef = useRef(null);
    const scrollAmountRef = useRef(0);
    const lastTimeRef = useRef(performance.now());
    const animationIdRef = useRef(null);
    const clonedRef = useRef(false); // Prevent re-cloning

    const banners = [
        {
            id: 1,
            title: "Summer Collection 2025",
            description: "Discover the latest trends for the season",
            bgColor: "bg-gradient-to-r from-[var(--tertiary-color)] to-blue-400",
            imageUrl: "/api/placeholder/600/300"
        },
        {
            id: 2,
            title: "Tech Gadgets Sale",
            description: "Up to 40% off on premium electronics",
            bgColor: "bg-gradient-to-r from-[var(--primary-color)] to-amber-400",
            imageUrl: "/api/placeholder/600/300"
        },
        {
            id: 3,
            title: "Home Decor Collection",
            description: "Transform your space with our exclusive items",
            bgColor: "bg-gradient-to-r from-[var(--secondary-color)] to-green-300",
            imageUrl: "/api/placeholder/600/300"
        }
    ];

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer || clonedRef.current) return;

        // Clone banners only once
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

        const distance = 0.5; // smoother scroll
        let lastTime = performance.now();

        const scroll = (timestamp) => {
            if (!isScrolling) return;

            const deltaTime = timestamp - lastTime;
            lastTime = timestamp;

            scrollAmountRef.current += distance * (deltaTime / 16); // normalize
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

    return (
        <section className="py-8 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Trending Now</h2>
                    {/* <button
                        onClick={() => setIsScrolling(!isScrolling)}
                        className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full transition-colors"
                    >
                        {isScrolling ? <FiPause size={16} /> : <FiPlay size={16} />}
                        {isScrolling ? 'Pause' : 'Play'} Scroll
                    </button> */}
                </div>

                <div className="overflow-hidden"  style={{ borderRadius: '10px'}}>
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
                                className="min-w-[300px] md:min-w-[500px] rounded-lg overflow-hidden shadow-md flex-shrink-0"
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
                                            className="w-full h-40 object-cover rounded"
                                        />
                                        <button className="mt-4 bg-white text-[var(--primary-color)] py-2 px-6 rounded-full font-medium hover:bg-gray-100 transition duration-300">
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