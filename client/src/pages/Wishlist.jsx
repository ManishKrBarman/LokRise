import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import WishlistItems from '../components/WishlistItems';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Wishlist = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { wishlistItems, removeFromWishlist, loading, error } = useWishlist();

    // Redirect to login if not authenticated
    React.useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login', { state: { returnUrl: '/wishlist' } });
        }
    }, [isAuthenticated, navigate]);

    const handleRemoveItem = async (productId) => {
        await removeFromWishlist(productId);
    };

    if (loading) {
        return (
            <>
                <NavBar fixed={true} cartBtn={true} />
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="flex justify-center items-center min-h-[400px]">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-color)]"></div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    if (error) {
        return (
            <>
                <NavBar fixed={true} cartBtn={true} />
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="text-center py-12">
                        <h2 className="text-2xl font-semibold mb-4 text-red-600">Oops! Something went wrong</h2>
                        <p className="text-gray-600 mb-8">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-[var(--primary-color)] text-white py-3 px-6 rounded-lg hover:bg-opacity-90 transition duration-300"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <NavBar fixed={true} cartBtn={true} />
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>

                {wishlistItems.length > 0 ? (
                    <WishlistItems
                        items={wishlistItems}
                        removeItem={handleRemoveItem}
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