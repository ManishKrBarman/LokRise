import React, { useState, useRef, useEffect } from 'react';
import { FiShoppingCart, FiBell, FiSearch, FiHeart, FiPackage, FiUser } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.svg';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { BASE_URL } from '../services/api';
import NotificationsPanel from './NotificationsPanel';
import { authAPI } from '../services/api';

const Navbar = (props) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [imageError, setImageError] = useState(false);
    const notificationRef = useRef(null);
    const profileMenuRef = useRef(null);
    const navigate = useNavigate();

    // Get authentication state from context
    const { isAuthenticated, user, logout, loading: authLoading, getCurrentUser } = useAuth();

    // Get cart state from context
    const { cartItems } = useCart();

    // Get wishlist state from context
    const { wishlistItems } = useWishlist();

    // Handle search submit
    const handleSearch = async (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    // Reset image error when user changes
    useEffect(() => {
        setImageError(false);
    }, [user]);

    const getProfileImageUrl = () => {
        if (!user?._id) return null;
        return `${BASE_URL}/auth/profile-image/${user._id}?t=${Date.now()}`;
    };

    const profileImage = !imageError && user?._id ? getProfileImageUrl() : null;

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

    // Handle marking a notification as read
    const handleMarkAsRead = async (notificationId) => {
        try {
            await authAPI.markNotificationRead(notificationId);
            // Refresh user data to get updated notifications
            getCurrentUser();
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    // Handle marking all notifications as read
    const handleMarkAllAsRead = async () => {
        try {
            await authAPI.markAllNotificationsRead();
            // Refresh user data to get updated notifications
            getCurrentUser();
        } catch (error) {
            console.error("Error marking all notifications as read:", error);
        }
    };

    // Handle logout
    const handleLogout = () => {
        logout();
        setShowProfileMenu(false);
    }

    // Get unread notifications count
    const unreadNotificationsCount = user?.notifications?.filter(n => !n.read)?.length || 0;

    return (
        <nav className={`${props.fixed ? 'sticky' : 'relative'} top-0 left-0 right-0 bg-white shadow-md py-4 px-6 z-50`}>
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo and Brand Name */}
                <a className="flex items-center" href='/'>
                    <img src={logo} alt="Logo" className="h-10 mr-2" />
                    <span className="font-bold font-museo text-xl text-[var(--primary-color)]">Lokrise</span>
                </a>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-xl mx-8">
                    <div className="relative w-full">
                        <input
                            type="text"
                            placeholder="Search products, courses, and more..."
                            className="w-full py-2 px-4 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[var(--primary-color)]"
                        >
                            <FiSearch size={20} />
                        </button>
                    </div>
                </form>

                {/* Navigation Icons and Login */}
                <div className="flex items-center space-x-4">
                    {/* Search Icon for Mobile */}
                    <button className="md:hidden text-gray-700 hover:text-[var(--primary-color)]">
                        <FiSearch size={24} />
                    </button>

                    {/* Only show these icons when authenticated */}
                    {isAuthenticated && (
                        <>
                            {/* Notifications - with proper positioning */}
                            <div className="relative" ref={notificationRef}>
                                <button
                                    className="text-gray-700 hover:text-[var(--primary-color)] relative"
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    aria-label="Notifications"
                                >
                                    <FiBell size={24} />
                                    {unreadNotificationsCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                            {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                                        </span>
                                    )}
                                </button>

                                {/* Notification Panel */}
                                {showNotifications && (
                                    <NotificationsPanel
                                        notifications={user?.notifications || []}
                                        onClose={() => setShowNotifications(false)}
                                        onMarkAsRead={handleMarkAsRead}
                                        onMarkAllAsRead={handleMarkAllAsRead}
                                    />
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
                                    src={profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=8B6B4B&color=fff&t=${Date.now()}`}
                                    alt="Profile"
                                    className="h-10 w-10 rounded-full border-2 border-[var(--primary-color)] cursor-pointer"
                                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        setImageError(true);
                                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=8B6B4B&color=fff&t=${Date.now()}`;
                                    }}
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
                                            {/* Add option to view seller application if pending or rejected */}
                                            {user?.sellerApplication && user.role !== 'seller' && (
                                                <Link to="/profile?tab=seller" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                    Seller Application {user.sellerApplication.status === 'rejected' ? '(Rejected)' : '(Pending)'}
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