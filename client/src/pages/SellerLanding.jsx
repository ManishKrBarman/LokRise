import React from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import SellerHero from '../components/SellerHero';
import SellerBenefits from '../components/SellerBenefits';
import SellerSteps from '../components/SellerSteps';
import SellerStats from '../components/SellerStats';
import SellerTestimonials from '../components/SellerTestimonials';
import SellerCategories from '../components/SellerCategories';
import SellerCTA from '../components/SellerCTA';

const SellerLanding = () => {
    return (
        <div className="seller-landing">
            <NavBar buttonText="Start Selling" buttonLink="/become-seller" />
            <div>
                <div className="pt-12">
                    <SellerHero />
                    <SellerStats />
                    <SellerBenefits />
                    <SellerSteps />
                    <SellerTestimonials />
                    <SellerCategories />
                    <SellerCTA />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default SellerLanding;