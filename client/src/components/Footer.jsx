import React from 'react';
import FooterLogo from '../assets/logo.svg';
import { AiFillInstagram } from "react-icons/ai";
import { FaDiscord, FaYoutube, FaTwitter } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="relative bottom-0 w-full py-6 px-4 bg-[var(--primary-color)] text-white flex flex-col gap-y-8 md:flex-row md:justify-between md:items-start">
            {/* Logo Section */}
            <div className="bg-white p-2 rounded-t-3xl rounded-br-3xl h-auto w-auto flex justify-center items-center self-center md:self-start md:ml-6">
                <img className="w-40" src={FooterLogo} alt="Lokrise Logo" />
            </div>

            {/* Middle Info Section */}
            <div className="flex flex-col md:flex-row gap-8 justify-center items-center text-center md:text-left md:items-start  text-base md:text-lg font-light">
                <div className='flex flex-col items-center md:items-start p-2'>
                    <p className="font-medium text-lg mb-2">LOKRISE</p>
                    <p>© 2025 All rights reserved</p>
                    <p>Made with ❤️ by the Creon Team</p>
                </div>
                <div>
                    <p className="font-semibold mb-2">Get to Know Us:</p>
                    <ul className="space-y-1">
                        <li><a href="/about" className="hover:underline">About Lokrise</a></li>
                        <li><a href="/terms" className="hover:underline">Terms & Conditions</a></li>
                        <li><a href="/privacy" className="hover:underline">Privacy Policy</a></li>
                        <li><a href="/contact" className="hover:underline">Contact Us</a></li>
                    </ul>
                </div>
                <div>
                    <p className="font-semibold mb-2">Helpful Links:</p>
                    <ul className="space-y-1">
                        <li><a href="/help-center" className="hover:underline">Help Center</a></li>
                        <li><a href="/learning" className="hover:underline">Learning</a></li>
                        <li><a href="/community" className="hover:underline">Community</a></li>
                        <li><a href="/dashboard" className="hover:underline">Seller Dashboard</a></li>
                    </ul>
                </div>
            </div>

            {/* Social Icons */}
            <div className="flex justify-center md:mr-6 md:flex-col gap-4 text-3xl md:text-4xl items-center md:items-end">
                <a href="https://www.instagram.com/" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                    <AiFillInstagram />
                </a>
                <a href="https://discord.com/" aria-label="Discord" target="_blank" rel="noopener noreferrer">
                    <FaDiscord />
                </a>
                <a href="https://www.youtube.com/" aria-label="YouTube" target="_blank" rel="noopener noreferrer">
                    <FaYoutube />
                </a>
                <a href="https://twitter.com/" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
                    <FaTwitter />
                </a>
            </div>
        </footer>
    );
};

export default Footer;
