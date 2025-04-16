import React from 'react';
import FooterLogo from '../assets/lokrise-logo.svg';
import { AiFillInstagram } from "react-icons/ai";
import { FaDiscord } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className='absolute w-full h-auto py-2 bottom-0 flex flex-col gap-y-3 md:flex-row-reverse justify-between items-center px-4 bg-[#9B7653] text-white'>
            <div className="social-icons flex flex-row md:flex-col space-x-4 md:space-x-0 text-4xl">
                <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer"><AiFillInstagram color='white' /></a>
                <a href="https://discord.com/" target="_blank" rel="noopener noreferrer"><FaDiscord color='white' /></a>
                <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer"><FaYoutube color='white' /></a>
                <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer"><FaTwitter color='white' /></a>
            </div>
            <div className='footer-text flex flex-col text-base gap-y-5 items-center font-light md:flex-row md:items-start md:gap-x-12 md:text-xl'>
                <div className="footer-text flex flex-col items-center text-center">
                    <p className='font-medium'>LOKRISE</p>
                    <p>© 2025 All rights reserved</p>
                    <p>Made with love by Lokrise Team</p>
                </div>
                <div className="footer-text flex flex-col items-center md:items-start text-left">
                    <p className='font-medium'>Get to Know Us:</p>
                    <ul className='list-disc list-inside'>
                        <li>About Lokrise</li>
                        <li>Lokrise Learning</li>
                    </ul>
                </div>
            </div>
            <div className="bg-white rounded-t-4xl rounded-br-4xl footer-logo h-55 w-55 flex justify-center items-center">
                <img className='w-50 h-50' src={FooterLogo} alt="Logo" />
            </div>
        </footer>
    )
}

export default Footer