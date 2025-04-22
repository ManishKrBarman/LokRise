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
            title: "Home Decor Collection",
            description: "Transform your space with our exclusive items",
            imageUrl: "https://i.ibb.co/7J149T7m/title-Home-Decor-Collection-description-Transform-your-space-with-our-exclusive-items.jpg",
            textColor: "text-white",
            borderColor: "border-white",
            category: "homedecor"
        },
        {
            id: 2,
            title: "Summer Collection 2025",
            description: "Discover the latest trends for the season",
            imageUrl: "https://i.ibb.co/JTDWQHQ/title-Summer-Collection-2025-description-Discover-the-latest-trends-for-the-season-give-rural-vibe-n.jpg",
            textColor: "text-yellow-300",
            borderColor: "border-yellow-300",
            category: "summer"
        },
        {
            id: 3,
            title: "Tech Gadgets Sale",
            description: "Up to 40% off on premium electronics",
            imageUrl: "https://i.ibb.co/VpJd7P7d/tech-gadgets-sale-banner-trends-give-the-feel-of-rural.jpg",
            textColor: "text-indigo-200",
            borderColor: "border-indigo-200",
            category: "electronics"
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
                        <h2 className="text-3xl font-bold text-gray-800 mb-1">Trending Now 🔥</h2>
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
                                <div
                                    style={{
                                        backgroundImage: `url(${banner.imageUrl})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    }}
                                    className="group relative p-6 h-[300px] flex flex-col justify-between rounded-xl overflow-hidden shadow-lg border transition-all duration-500"
                                >
                                    {/* Overlay with blur */}
                                    <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] group-hover:backdrop-blur-0 transition-all duration-500 rounded-xl" />

                                    {/* Animated disappearing text */}
                                    <div
                                        className={`relative z-10 transition-all duration-500 ease-in-out group-hover:opacity-0 group-hover:-translate-y-4 
                                        ${banner.textColor} ${banner.borderColor} border-2 rounded-md p-3 bg-black/40 drop-shadow-md`}
                                    >
                                        <h3 className="text-2xl font-extrabold mb-1">{banner.title}</h3>
                                        <p className="text-sm">{banner.description}</p>
                                    </div>

                                    {/* Shop Now Button */}
                                    <div className="relative z-10 mt-4">
                                        <button
                                            onClick={() => handleShopNow(banner)}
                                            className="bg-white text-[var(--primary-color)] py-2 px-6 rounded-full font-semibold hover:bg-opacity-90 transition duration-300 shadow-md"
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