import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { productAPI } from '../services/api';

const CourseDetailsPage = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await productAPI.getProductById(id);
                setCourse(response.data.product);
            } catch (err) {
                console.error('Error fetching course:', err);
            }
        };

        fetchCourse();
    }, [id]);

    if (!course) return <p>Loading...</p>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4">{course.name}</h1>
            <img src={course.imageUrl} alt={course.name} className="w-full h-72 object-cover rounded mb-6" />
            <p className="text-lg mb-4">{course.description}</p>
            <p className="text-2xl font-bold text-[var(--primary-color)]">₹{course.price}</p>
        </div>
    );
};

export default CourseDetailsPage;