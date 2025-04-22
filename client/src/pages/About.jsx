import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, useAnimation, useInView } from 'framer-motion';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import '../index.css';
import aboutHero from '../assets/About-Hero-Image.png';

const AboutPage = () => {
    const [message, setMessage] = useState('');
    const scrollRef = useRef(null);
    const scrollAmountRef = useRef(0);
    const animationIdRef = useRef(null);
    const clonedRef = useRef(false);
    const [isScrolling, setIsScrolling] = useState(true);
    const teamRef = useRef(null);
    const isTeamInView = useInView(teamRef, { once: false, margin: "-100px 0px" });
    const teamControls = useAnimation();

    useEffect(() => {
        if (isTeamInView) {
            teamControls.start("visible");
        }
    }, [isTeamInView, teamControls]);

    useEffect(() => {
        fetch('http://localhost:3000/about')
            .then((res) => res.json())
            .then((data) => setMessage(data.message))
            .catch((err) => console.error('Error fetching about data:', err));
    }, []);

    // Testimonial auto-scroll effect
    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer || clonedRef.current) return;

        // Clone testimonials to create infinite scroll effect
        const scrollContent = Array.from(scrollContainer.children);
        scrollContent.forEach(item => {
            const clone = item.cloneNode(true);
            scrollContainer.appendChild(clone);
        });
        clonedRef.current = true;
    }, []);

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer || !isScrolling) return;

        const distance = 0.5; // smooth scroll speed
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

    // Team member data with more details
    const teamMembers = [
        {
            name: "Manish",
            role: "Full Stack Developer",
            specialty: "Backend Architecture",
            quote: "I build with purpose, learn with fire, and dream in code.",
            github: "https://github.com/ManishKrBarman"
        },
        {
            name: "Devesh",
            role: "Full Stack Developer",
            specialty: "React & Animation",
            quote: "Good code is its own best documentation.",
            github: "https://github.com/DilicalFlame"
        },
        {
            name: "Raghav",
            role: "UI/UX Designer & Counsellor",
            specialty: "User Experience",
            quote: "with knowledge as my loom, I wove the threads of fate into my will.",
            github: "https://github.com/raghavo2"
        },
        {
            name: "Himanshi",
            role: "UI/UX Designer",
            specialty: "Visual Design",
            quote: "Simplicity is the ultimate sophistication.",
            github: "https://github.com/notCreatedYetAcct"
        }
    ];

    const testimonials = [
    {
        name: "Aryan Verma",
        position: "Teammate from another squad",
        text: "Bro, what you all built with Lokrise is insane! The QR payment + OTP login for rural sellers? Genius. Total game-changer at Hackazards!"
    },
    {
        name: "Megha Jain",
        position: "Fellow Hacker",
        text: "Lokrise literally felt like a finished product. I loved how clean the UI was and the way you thought about farmers using the app — mad respect!"
    },
    {
        name: "Ankit Deshmukh",
        position: "Dev Squad Buddy",
        text: "Man, your Groq chatbot on the site was next-level. Lokrise wasn't just a project — it felt like something that could launch tomorrow. 🔥"
    },
    {
        name: "Shruti Kapoor",
        position: "Hackazards Volunteer",
        text: "Watching your demo gave me goosebumps! You made rural empowerment tech feel so real and accessible. You guys totally raised the bar!"
    },
    {
        name: "Karan Bhatt",
        position: "UI/UX Enthusiast",
        text: "I still can't believe how smooth your interface was — even the dynamic seller cards adapting on mobile was so clean. Lokrise is hackathon gold!"
    }
];


    return (
        <div className="min-h-screen flex flex-col bg-white text-gray-800">
            <Navbar />

            {/* Hero Section with Image */}
            <section className="relative h-[80vh] w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#9B7653]/90 to-[#9B7653]/70 z-10"></div>
                <img
                    src={aboutHero}
                    alt="Lokrise Empowering Rural Artisans"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="relative z-20 flex items-center justify-center h-full">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center text-white max-w-4xl px-4"
                    >
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">Empowering Rural Artisans and Farmers</h1>
                        <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
                            Lokrise is connecting the heart of India to the world through technology, building a community where tradition meets innovation.
                        </p>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                        >
                            <a href="#mission" className="mt-8 inline-block bg-white text-[#9B7653] py-3 px-8 rounded-full font-bold hover:bg-gray-100 transition duration-300">
                                Our Mission
                            </a>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            <main className="flex-grow px-4 md:px-16 lg:px-32 space-y-24 py-16">
                <section id="mission" className="pt-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-r from-[#9B7653]/10 to-[#D4B996]/10 p-8 md:p-12 rounded-2xl"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-[#9B7653]">Why Lokrise?</h2>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                <div className="bg-[#9B7653]/10 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-7 h-7 text-[#9B7653]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Direct Connections</h3>
                                <p className="text-gray-600">Connects artisans and farmers directly to consumers, eliminating unnecessary middlemen.</p>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                <div className="bg-[#9B7653]/10 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-7 h-7 text-[#9B7653]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Mobile-First Platform</h3>
                                <p className="text-gray-600">Simple and powerful mobile-first platform that works even in areas with limited connectivity.</p>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                <div className="bg-[#9B7653]/10 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-7 h-7 text-[#9B7653]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Local Language Support</h3>
                                <p className="text-gray-600">Offers support in local languages for true inclusivity across rural India.</p>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                <div className="bg-[#9B7653]/10 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-7 h-7 text-[#9B7653]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Fair Trade</h3>
                                <p className="text-gray-600">Ensures fair trade pricing by eliminating middlemen and providing market information.</p>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                <div className="bg-[#9B7653]/10 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-7 h-7 text-[#9B7653]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Cutting-Edge Tech</h3>
                                <p className="text-gray-600">Uses cutting-edge tech like OTP authentication and QR payments for rural accessibility.</p>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                <div className="bg-[#9B7653]/10 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-7 h-7 text-[#9B7653]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Global Reach</h3>
                                <p className="text-gray-600">Opening global markets to local artisans with international shipping and promotion.</p>
                            </div>
                        </div>
                    </motion.div>
                </section>

                <section ref={teamRef} className="py-10">
                    <motion.div
                        variants={{
                            hidden: { opacity: 0 },
                            visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
                        }}
                        initial="hidden"
                        animate={teamControls}
                        className="text-center mb-10"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-[#9B7653] mb-2">Meet Us</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Team <span className="font-bold text-[#9B7653]">Creons</span> behind Lokrise who are competing in Hackazards 2025
                        </p>
                        <h4 className="text-lg text-gray-500">Faces are hidden for privacy concerns</h4>
                    </motion.div>

                    <div className="flex flex-wrap justify-center gap-8">
                        {teamMembers.map((member, index) => (
                            <motion.div
                                key={index}
                                variants={{
                                    hidden: { opacity: 0, y: 50 },
                                    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
                                }}
                                className="relative group cursor-pointer"
                                onClick={() => window.open(member.github, '_blank')}
                            >
                                <div className="w-64 h-80 bg-gray-100 rounded-2xl shadow-lg overflow-hidden group-hover:-translate-y-2 transition-transform duration-300">
                                    <div className="h-40 bg-gradient-to-br from-[#9B7653] to-[#D4B996] flex items-center justify-center overflow-hidden">
                                        {/* Image with fallback */}
                                        <img
                                            src={`/team/${member.name.toLowerCase()}.jpg`}
                                            alt={member.name}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = `https://ui-avatars.com/api/?name=${member.name}&background=9B7653&color=fff&size=150`;
                                            }}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="p-2 text-center">
                                        <h3 className="text-xl font-bold text-gray-800">{member.name}</h3>
                                        <p className="text-[#9B7653] font-medium">{member.role}</p>
                                        <p className="text-gray-600 text-sm mt-1">{member.specialty}</p>
                                        <div className="mt-4 p-2 bg-[#9B7653]/10 rounded-lg">
                                            <p className="italic text-sm text-gray-700">"{member.quote}"</p>
                                        </div>
                                        <div
                                            className="mt-3 inline-flex items-center text-[#9B7653] hover:underline"
                                        >
                                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                            </svg>
                                            GitHub
                                        </div>
                                    </div>
                                </div>

                                {/* Floating emoji animation on hover */}
                                <motion.div
                                    className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100"
                                    initial={{ y: 0 }}
                                    whileHover={{ y: -20, rotate: 10 }}
                                    transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                                >
                                    <span className="text-3xl" role="img" aria-label="coding">
                                        {index === 0 ? "👨‍💻" : index === 1 ? "🚀" : index === 2 ? "🎨" : "✨"}
                                    </span>
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Testimonials & Support Section */}
                <section className="py-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <span className="inline-block bg-[#9B7653]/10 px-4 py-2 rounded-full text-[#9B7653] font-medium mb-2">Hackazards 2025</span>
                        <h2 className="text-3xl md:text-4xl font-bold mb-3">What People Are Saying</h2>
                        <p className="text-gray-600 max-w-xl mx-auto">Feedback from friends on our Hackazards 2025 project</p>
                    </motion.div>

                    <div className="relative overflow-hidden">
                        {/* Gradient overlays for infinite scroll effect */}
                        <div className="absolute left-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r from-white to-transparent"></div>
                        <div className="absolute right-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-l from-white to-transparent"></div>

                        <div
                            ref={scrollRef}
                            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                            onMouseEnter={() => setIsScrolling(false)}
                            onMouseLeave={() => setIsScrolling(true)}
                        >
                            {testimonials.map((testimonial, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    whileHover={{ y: -5 }}
                                    className="min-w-[300px] md:min-w-[380px] bg-white p-6 rounded-xl shadow-md border border-gray-100 flex-shrink-0"
                                >
                                    <div className="flex items-center mb-4">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#9B7653] to-[#D4B996] flex items-center justify-center text-white font-bold">
                                            {testimonial.name.charAt(0)}
                                        </div>
                                        <div className="ml-3">
                                            <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                                            <p className="text-sm text-[#9B7653]">{testimonial.position}</p>
                                        </div>
                                        <div className="ml-auto">
                                            <svg className="w-8 h-8 text-[#9B7653]/20" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <p className="text-gray-700">{testimonial.text}</p>
                                    <div className="mt-4 flex">
                                        {Array(5).fill(0).map((_, i) => (
                                            <svg key={i} className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default AboutPage;