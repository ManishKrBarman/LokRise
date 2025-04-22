import React from 'react';
import NavBar from '../components/NavBar';
import CategoryBar from '../components/CategoryBar';
import Footer from '../components/Footer';
import EduHero from '../components/EduHero';
import PopularCourses from '../components/PopularCourses';
import CourseCategories from '../components/CourseCategories';
import InstructorHighlights from '../components/InstructorHighlights';
import LearningPaths from '../components/LearningPaths';
import TestimonialSection from '../components/TestimonialSection';
import EduCTA from '../components/EduCTA';

const Edu = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <NavBar />
            <main className="flex-grow">
                <EduHero />
                <CourseCategories />
                <LearningPaths />
                <InstructorHighlights />
                <TestimonialSection />
                <EduCTA />
            </main>
            <Footer bgcolor="bg-gradient-to-r from-indigo-800 to-blue-900" />
        </div>
    );
};

export default Edu;