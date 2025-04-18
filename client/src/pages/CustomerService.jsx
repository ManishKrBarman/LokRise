import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import CustomerServiceHero from '../components/CustomerServiceHero';
import FAQSection from '../components/FAQSection';
import ContactForm from '../components/ContactForm';
import SupportOptions from '../components/SupportOptions';

const CustomerService = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <NavBar />
            <main className="flex-grow">
                <CustomerServiceHero />
                <SupportOptions />
                <FAQSection />
                <ContactForm />
            </main>
            <Footer />
        </div>
    );
};

export default CustomerService;