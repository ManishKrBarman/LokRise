import React from 'react';
import Navbar from '../components/NavBar';
import CategoryBar from '../components/CategoryBar';
import HeroSection from '../components/HeroSection';
import ProductsSection from '../components/ProductsSection';
import CoursesSection from '../components/CoursesSection';
import Footer from '../components/Footer';
import '../index.css';

const HomePage = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar fixed={true} cartBtn={true} />
            <CategoryBar />
            <main className="flex-grow pt-[128px]">
                <HeroSection />
                <ProductsSection />
                <CoursesSection />
            </main>
            <Footer />
        </div>
    );
};

export default HomePage;