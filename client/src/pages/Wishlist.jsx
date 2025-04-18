import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import WishlistItems from '../components/WishlistItems';

const Wishlist = () => {
    // This would come from an API or global state in a real app
    const [wishlistItems, setWishlistItems] = useState([
        {
            id: 1,
            name: "Advanced Web Development Course",
            price: 79.99,
            image: "https://placehold.co/100x100",
            type: "course",
            inStock: true
        },
        {
            id: 2,
            name: "Digital Study Notebook",
            price: 34.99,
            image: "https://placehold.co/100x100",
            type: "product",
            inStock: true
        },
        {
            id: 3,
            name: "Professional Certification Course",
            price: 199.99,
            image: "https://placehold.co/100x100",
            type: "course",
            inStock: false
        }
    ]);

    const removeItem = (id) => {
        setWishlistItems(wishlistItems.filter(item => item.id !== id));
    };

    const moveToCart = (id) => {
        // In a real app, this would call an API or update global state
        console.log(`Moving item ${id} to cart`);
        // Then remove from wishlist
        removeItem(id);
    };

    return (
        <>
            <NavBar fixed={true} cartBtn={true} />
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>

                {wishlistItems.length > 0 ? (
                    <WishlistItems
                        items={wishlistItems}
                        removeItem={removeItem}
                        moveToCart={moveToCart}
                    />
                ) : (
                    <div className="text-center py-12">
                        <h2 className="text-2xl font-semibold mb-4">Your wishlist is empty</h2>
                        <p className="text-gray-600 mb-8">Save items you're interested in by clicking the heart icon.</p>
                        <a
                            href="/"
                            className="bg-[var(--primary-color)] text-white py-3 px-6 rounded-lg hover:bg-opacity-90 transition duration-300"
                        >
                            Explore Products & Courses
                        </a>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default Wishlist;