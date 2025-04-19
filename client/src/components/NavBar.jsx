import React, { useState, useRef, useEffect } from 'react';
import { FiShoppingCart, FiBell, FiSearch, FiHeart, FiPackage, FiUser } from 'react-icons/fi';
import logo from '../assets/logo.svg';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const Navbar = (props) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const notificationRef = useRef(null);
    const profileMenuRef = useRef(null);

    // Get authentication state from context
    const { isAuthenticated, user, logout, loading: authLoading } = useAuth();

    // Get cart state from context
    const { cartItems } = useCart();

    // Get wishlist state from context
    const { wishlistItems } = useWishlist();

    // Close notification panel when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setShowProfileMenu(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [notificationRef, profileMenuRef]);

    // Sample notifications data - this would come from an API in a real application
    const notifications = [
        {
            id: 1,
            message: "Your order has been shipped!",
            time: "2 hours ago",
            read: false
        },
        {
            id: 2,
            message: "New course available: React Advanced",
            time: "Yesterday",
            read: false
        },
        {
            id: 3,
            message: "Your payment was successful",
            time: "3 days ago",
            read: true
        }
    ];

    // Handle logout
    const handleLogout = () => {
        logout();
        setShowProfileMenu(false);
    }

    return (
        <nav className={`${props.fixed ? 'sticky' : 'relative'} top-0 left-0 right-0 bg-white shadow-md py-4 px-6 z-50`}>
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo and Brand Name */}
                <a className="flex items-center" href='/'>
                    <img src={logo} alt="Logo" className="h-10 mr-2" />
                    <span className="font-bold font-museo text-xl text-[var(--primary-color)]">Lokrise</span>
                </a>

                {/* Search Bar */}
                <div className="hidden md:flex items-center flex-1 max-w-xl mx-8">
                    <div className="relative w-full">
                        <input
                            type="text"
                            placeholder="Search products, courses, and more..."
                            className="w-full py-2 px-4 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[var(--primary-color)]">
                            <FiSearch size={20} />
                        </button>
                    </div>
                </div>

                {/* Navigation Icons and Login */}
                <div className="flex items-center space-x-4">
                    {/* Search Icon for Mobile */}
                    <button className="md:hidden text-gray-700 hover:text-[var(--primary-color)]">
                        <FiSearch size={24} />
                    </button>

                    {/* Only show these icons when authenticated */}
                    {isAuthenticated && (
                        <>
                            {/* Notifications */}
                            <div className="relative" ref={notificationRef}>
                                <button
                                    className="text-gray-700 hover:text-[var(--primary-color)] relative"
                                    onClick={() => setShowNotifications(!showNotifications)}
                                >
                                    <FiBell size={24} />
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                                        {notifications.filter(n => !n.read).length}
                                    </span>
                                </button>

                                {/* Notification Panel */}
                                {showNotifications && (
                                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50 overflow-hidden">
                                        <div className="py-2 px-3 bg-gray-100 border-b border-gray-200">
                                            <div className="flex justify-between items-center">
                                                <h3 className="font-semibold text-sm">Notifications</h3>
                                                <button className="text-xs text-blue-600 hover:text-blue-800">
                                                    Mark all as read
                                                </button>
                                            </div>
                                        </div>

                                        <div className="max-h-80 overflow-y-auto">
                                            {notifications.length > 0 ? (
                                                notifications.map(notification => (
                                                    <div
                                                        key={notification.id}
                                                        className={`border-b border-gray-100 px-4 py-3 hover:bg-gray-50 transition-colors duration-200
                                                            ${notification.read ? 'bg-white' : 'bg-blue-50'}`}
                                                    >
                                                        <div className="flex justify-between">
                                                            <p className={`text-sm ${notification.read ? 'text-gray-600' : 'text-gray-800 font-semibold'}`}>
                                                                {notification.message}
                                                            </p>
                                                            {!notification.read && (
                                                                <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="py-6 text-center text-gray-500">
                                                    No notifications
                                                </div>
                                            )}
                                        </div>

                                        <div className="py-2 text-center border-t border-gray-100">
                                            <button className="text-sm text-blue-600 hover:text-blue-800">
                                                View all notifications
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Cart */}
                            {props.cartBtn && (
                                <Link to="/cart" className="text-gray-700 hover:text-[var(--primary-color)] relative">
                                    <FiShoppingCart size={24} />
                                    {cartItems && cartItems.length > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                                            {cartItems.length}
                                        </span>
                                    )}
                                </Link>
                            )}
                        </>
                    )}

                    {/* User Profile / Login Button - Only render after authLoading is complete */}
                    {!authLoading && (
                        isAuthenticated ? (
                            <div className="relative" ref={profileMenuRef}>
                                <img
                                    src={user?.profileImage || "https://placehold.co/40?text=" + (user?.name?.[0] || "U")}
                                    alt="Profile"
                                    className="h-10 w-10 rounded-full border-2 border-[var(--primary-color)] cursor-pointer"
                                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                                />

                                {/* Profile Dropdown Menu */}
                                {showProfileMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 overflow-hidden">
                                        <div className="py-2 px-4 bg-gray-50 border-b border-gray-200">
                                            <p className="font-semibold text-sm">{user?.name || 'User'}</p>
                                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                        </div>

                                        <div className="py-1">
                                            <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                Profile
                                            </Link>
                                            <Link to="/orders" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                <FiPackage size={16} className="mr-2" />
                                                Orders
                                            </Link>
                                            <Link to="/wishlist" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                <FiHeart size={16} className="mr-2" />
                                                Wishlist {wishlistItems.length > 0 && `(${wishlistItems.length})`}
                                            </Link>
                                            {user?.role === 'seller' && (
                                                <Link to="/seller/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                    Seller Dashboard
                                                </Link>
                                            )}
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to={props.buttonLink || "/login"}>
                                <button className="bg-[var(--primary-color)] hover:bg-[#8b6b4b] text-white py-2 px-4 rounded-lg transition duration-300 flex items-center">
                                    <FiUser size={18} className="mr-2" />
                                    {props.buttonText || 'Login'}
                                </button>
                            </Link>
                        )
                    )}

                    {/* Show placeholder while authentication is loading to prevent flickering */}
                    {authLoading && (
                        <div className="h-10 w-28 rounded-lg bg-gray-200 animate-pulse"></div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;