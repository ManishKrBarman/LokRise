import React, { useState, useRef, useEffect } from 'react';
import { FiShoppingCart, FiBell, FiSearch, FiHeart, FiPackage, FiUser, FiMenu, FiX, FiGrid } from 'react-icons/fi';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/logo.svg';
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
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const notificationRef = useRef(null);
    const profileMenuRef = useRef(null);
    const searchRef = useRef(null);
    const mobileMenuRef = useRef(null);
    const navigate = useNavigate();

    const { isAuthenticated, user, logout, loading: authLoading, getCurrentUser } = useAuth();
    const { cartItems } = useCart();
    const { wishlistItems } = useWishlist();

    const handleSearch = async (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setShowMobileSearch(false);
        }
    };

    useEffect(() => {
        setImageError(false);
    }, [user]);

    const getProfileImageUrl = () => {
        if (!user?._id) return null;
        return `${BASE_URL}/auth/profile-image/${user._id}?t=${Date.now()}`;
    };

    const profileImage = !imageError && user?._id ? getProfileImageUrl() : null;

    useEffect(() => {
        function handleClickOutside(event) {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setShowProfileMenu(false);
            }
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowMobileSearch(false);
            }
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
                setShowMobileMenu(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Handle window resize to reset mobile menu states
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setShowMobileMenu(false);
                setShowMobileSearch(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleMarkAsRead = async (notificationId) => {
        try {
            await authAPI.markNotificationRead(notificationId);
            getCurrentUser();
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await authAPI.markAllNotificationsRead();
            getCurrentUser();
        } catch (error) {
            console.error("Error marking all notifications as read:", error);
        }
    };

    const handleLogout = () => {
        logout();
        setShowProfileMenu(false);
        setShowNotifications(false);
        setShowMobileMenu(false);
        navigate('/');
    };

    const unreadNotificationsCount = user?.notifications?.filter(n => !n.read)?.length || 0;

    const toggleMobileMenu = () => {
        setShowMobileMenu(!showMobileMenu);
        setShowMobileSearch(false);
        setShowNotifications(false);
        setShowProfileMenu(false);
    };

    const toggleMobileSearch = () => {
        setShowMobileSearch(!showMobileSearch);
        setShowMobileMenu(false);
        setShowNotifications(false);
        setShowProfileMenu(false);
    };

    // Function to ensure dropdowns stay within viewport
    const getDropdownPosition = (ref) => {
        if (!ref.current) return {};

        const rect = ref.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;

        // If dropdown would extend beyond right edge
        if (rect.right + 320 > viewportWidth) {
            return { right: '0', left: 'auto' };
        }

        return { left: '0', right: 'auto' };
    };

    return (
        <nav className={`${props.fixed ? 'sticky' : 'relative'} top-0 left-0 right-0 bg-white shadow-md py-4 z-50`}>
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center">
                            <img src={logo} alt="Logo" className="h-10 mr-2" />
                            <span className="font-bold font-museo text-xl text-[var(--primary-color)]">Lokrise</span>
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={toggleMobileSearch}
                            className="p-2 mr-2 hover:bg-gray-100 rounded-full"
                            aria-label="Search"
                        >
                            <FiSearch size={20} />
                        </button>

                        {isAuthenticated && props.cartBtn && (
                            <Link to="/cart" className="p-2 mr-2 hover:bg-gray-100 rounded-full relative">
                                <FiShoppingCart size={20} />
                                {cartItems?.length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                                        {cartItems.length}
                                    </span>
                                )}
                            </Link>
                        )}

                        <button
                            onClick={toggleMobileMenu}
                            className="p-2 hover:bg-gray-100 rounded-full"
                            aria-label="Menu"
                        >
                            {showMobileMenu ? <FiX size={22} /> : <FiMenu size={22} />}
                        </button>
                    </div>

                    {/* Search Bar - Hidden on Mobile */}
                    <div className="hidden md:block flex-1 max-w-xl mx-8">
                        <form onSubmit={handleSearch} className="relative">
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
                        </form>
                    </div>

                    {/* Mobile Search Overlay */}
                    {showMobileSearch && (
                        <div className="fixed inset-0 bg-black bg-opacity-20 z-50 flex items-start justify-center pt-16 px-4" ref={searchRef}>
                            <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-md">
                                <form onSubmit={handleSearch} className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search products, courses, and more..."
                                        className="w-full py-2 px-4 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        autoFocus
                                    />
                                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex">
                                        <button
                                            type="submit"
                                            className="text-gray-500 hover:text-[var(--primary-color)] p-1"
                                        >
                                            <FiSearch size={20} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowMobileSearch(false)}
                                            className="ml-1 text-gray-500 hover:text-red-500 p-1"
                                        >
                                            <FiX size={20} />
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        {isAuthenticated && (
                            <>
                                {/* Notifications */}
                                <div className="relative" ref={notificationRef}>
                                    <button
                                        className="p-2 hover:bg-gray-100 rounded-full relative"
                                        onClick={() => {
                                            setShowNotifications(!showNotifications);
                                            setShowProfileMenu(false);
                                        }}
                                    >
                                        <FiBell size={20} />
                                        {unreadNotificationsCount > 0 && (
                                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                                {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                                            </span>
                                        )}
                                    </button>

                                    {/* Desktop Notifications Panel */}
                                    {showNotifications && (
                                        <div
                                            className="absolute mt-2 w-80 bg-white rounded-lg shadow-lg overflow-hidden z-50"
                                            style={getDropdownPosition(notificationRef)}
                                        >
                                            <NotificationsPanel
                                                notifications={user?.notifications || []}
                                                onClose={() => setShowNotifications(false)}
                                                onMarkAsRead={handleMarkAsRead}
                                                onMarkAllAsRead={handleMarkAllAsRead}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Cart */}
                                {props.cartBtn && (
                                    <Link to="/cart" className="p-2 hover:bg-gray-100 rounded-full relative">
                                        <FiShoppingCart size={20} />
                                        {cartItems?.length > 0 && (
                                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                                                {cartItems.length}
                                            </span>
                                        )}
                                    </Link>
                                )}

                                {/* Profile */}
                                <div className="relative" ref={profileMenuRef}>
                                    <button
                                        className="flex items-center"
                                        onClick={() => {
                                            setShowProfileMenu(!showProfileMenu);
                                            setShowNotifications(false);
                                        }}
                                    >
                                        <img
                                            src={profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=8B6B4B&color=fff`}
                                            alt="Profile"
                                            className="h-8 w-8 rounded-full border-2 border-[var(--primary-color)]"
                                            onError={(e) => {
                                                setImageError(true);
                                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=8B6B4B&color=fff`;
                                            }}
                                        />
                                    </button>

                                    {/* Desktop Profile Menu */}
                                    {showProfileMenu && (
                                        <div
                                            className="absolute mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden z-50"
                                            style={getDropdownPosition(profileMenuRef)}
                                        >
                                            <div className="px-4 py-3 border-b border-gray-100">
                                                <p className="text-sm font-semibold">{user?.name}</p>
                                                <p className="text-xs text-gray-600 truncate">{user?.email}</p>
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
                                                    <Link to="/dashboard" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                        <FiGrid size={16} className="mr-2" />
                                                        Dashboard
                                                    </Link>
                                                )}
                                                {user?.role === 'seller' && (
                                                    <Link to="/seller/orders" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                        <div className="relative mr-2">
                                                            <FiPackage size={16} />
                                                            {/* Show notification badge for new orders */}
                                                            {user.notifications?.filter(n => n.type === 'order' && !n.read).length > 0 && (
                                                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                                                    {user.notifications.filter(n => n.type === 'order' && !n.read).length}
                                                                </span>
                                                            )}
                                                        </div>
                                                        Manage Orders
                                                    </Link>
                                                )}
                                                {/* Add option to view seller application if pending or rejected */}
                                                {user?.sellerApplication && user?.sellerApplication?.status && user.role !== 'seller' && (
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
                            </>
                        )}

                        {!isAuthenticated && !authLoading && (
                            <Link
                                to={props.buttonLink || "/login"}
                                className="bg-[var(--primary-color)] hover:bg-[#8b6b4b] text-white py-2 px-4 rounded-lg transition duration-300 flex items-center"
                            >
                                <FiUser size={18} className="mr-2" />
                                {props.buttonText || 'Login'}
                            </Link>
                        )}
                    </div>
                </div>

                {/* Mobile Menu */}
                {showMobileMenu && (
                    <div
                        className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50"
                        onClick={() => setShowMobileMenu(false)}
                    >
                        <div
                            className="absolute right-0 top-0 h-full w-2/3 max-w-xs bg-white shadow-xl transform transition-all duration-300"
                            ref={mobileMenuRef}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex flex-col h-full">
                                <div className="p-4 border-b border-gray-200">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-semibold text-lg">Menu</h3>
                                        <button
                                            onClick={() => setShowMobileMenu(false)}
                                            className="p-2 hover:bg-gray-100 rounded-full"
                                        >
                                            <FiX size={24} />
                                        </button>
                                    </div>

                                    {isAuthenticated ? (
                                        <div className="flex items-center mb-2">
                                            <img
                                                src={profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=8B6B4B&color=fff`}
                                                alt="Profile"
                                                className="h-10 w-10 rounded-full border-2 border-[var(--primary-color)] mr-3"
                                                onError={(e) => {
                                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=8B6B4B&color=fff`;
                                                }}
                                            />
                                            <div>
                                                <p className="font-semibold">{user?.name}</p>
                                                <p className="text-xs text-gray-600 truncate">{user?.email}</p>
                                            </div>
                                        </div>
                                    ) : !authLoading ? (
                                        <Link
                                            to={props.buttonLink || "/login"}
                                            className="bg-[var(--primary-color)] hover:bg-[#8b6b4b] text-white py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center w-full"
                                            onClick={() => setShowMobileMenu(false)}
                                        >
                                            <FiUser size={18} className="mr-2" />
                                            {props.buttonText || 'Login'}
                                        </Link>
                                    ) : null}
                                </div>

                                {isAuthenticated && (
                                    <div className="flex-1 overflow-y-auto">
                                        <div className="py-2">
                                            <Link
                                                to="/profile"
                                                className="flex items-center px-4 py-3 hover:bg-gray-100"
                                                onClick={() => setShowMobileMenu(false)}
                                            >
                                                <FiUser size={18} className="mr-3" />
                                                <span>Profile</span>
                                            </Link>

                                            <Link
                                                to="/orders"
                                                className="flex items-center px-4 py-3 hover:bg-gray-100"
                                                onClick={() => setShowMobileMenu(false)}
                                            >
                                                <FiPackage size={18} className="mr-3" />
                                                <span>Orders</span>
                                            </Link>

                                            <Link
                                                to="/wishlist"
                                                className="flex items-center px-4 py-3 hover:bg-gray-100"
                                                onClick={() => setShowMobileMenu(false)}
                                            >
                                                <FiHeart size={18} className="mr-3" />
                                                <span>Wishlist {wishlistItems.length > 0 && `(${wishlistItems.length})`}</span>
                                            </Link>

                                            {user?.role === 'seller' && (
                                                <Link
                                                    to="/dashboard"
                                                    className="flex items-center px-4 py-3 hover:bg-gray-100"
                                                    onClick={() => setShowMobileMenu(false)}
                                                >
                                                    <FiGrid size={18} className="mr-3" />
                                                    <span>Dashboard</span>
                                                </Link>
                                            )}

                                            {user?.role === 'seller' && (
                                                <Link
                                                    to="/seller/orders"
                                                    className="flex items-center px-4 py-3 hover:bg-gray-100"
                                                    onClick={() => setShowMobileMenu(false)}
                                                >
                                                    <div className="relative mr-3">
                                                        <FiPackage size={18} />
                                                        {/* Show notification badge for new orders */}
                                                        {user.notifications?.filter(n => n.type === 'order' && !n.read).length > 0 && (
                                                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                                                {user.notifications.filter(n => n.type === 'order' && !n.read).length}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span>Manage Orders</span>
                                                </Link>
                                            )}

                                            {user?.sellerApplication && user?.sellerApplication?.status && user.role !== 'seller' && (
                                                <Link
                                                    to="/profile?tab=seller"
                                                    className="flex items-center px-4 py-3 hover:bg-gray-100"
                                                    onClick={() => setShowMobileMenu(false)}
                                                >
                                                    <FiShoppingCart size={18} className="mr-3" />
                                                    <span>
                                                        Seller Application
                                                        {user.sellerApplication.status === 'rejected' ? ' (Rejected)' : ' (Pending)'}
                                                    </span>
                                                </Link>
                                            )}

                                            {/* Notifications in mobile menu */}
                                            <div className="px-4 py-3 border-t border-gray-200">
                                                <div className="flex justify-between items-center mb-2">
                                                    <h3 className="font-semibold">Notifications</h3>
                                                    {unreadNotificationsCount > 0 && (
                                                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                                            {unreadNotificationsCount}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="max-h-48 overflow-y-auto">
                                                    {user?.notifications?.length > 0 ? (
                                                        user.notifications.slice(0, 3).map((notification) => (
                                                            <div
                                                                key={notification._id}
                                                                className={`p-3 mb-2 text-sm rounded cursor-pointer flex items-start ${notification.read ? 'bg-gray-50' : 'bg-blue-50'}`}
                                                                onClick={() => {
                                                                    handleMarkAsRead(notification._id);
                                                                    if (notification.link) {
                                                                        setShowMobileMenu(false);
                                                                        navigate(notification.link);
                                                                    }
                                                                }}
                                                            >
                                                                <div className="flex-1">
                                                                    <p className={`${notification.read ? 'text-gray-600' : 'text-gray-800 font-semibold'}`}>
                                                                        {notification.message}
                                                                    </p>
                                                                    {notification.createdAt && (
                                                                        <p className="text-xs text-gray-500 mt-1">
                                                                            {new Date(notification.createdAt).toLocaleDateString('en-US', {
                                                                                month: 'short',
                                                                                day: 'numeric'
                                                                            })}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                                {!notification.read && (
                                                                    <span className="h-2 w-2 bg-blue-500 rounded-full ml-2 mt-1 flex-shrink-0"></span>
                                                                )}
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <p className="text-sm text-gray-500">No notifications</p>
                                                    )}
                                                </div>
                                                {user?.notifications?.length > 3 && (
                                                    <button
                                                        className="w-full text-sm text-[var(--primary-color)] mt-2 py-2 hover:bg-gray-100 rounded"
                                                        onClick={() => {
                                                            setShowMobileMenu(false);
                                                            navigate('/profile?tab=notifications');
                                                        }}
                                                    >
                                                        See all notifications
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="border-t border-gray-200 mt-auto p-4">
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center text-left px-4 py-3 text-red-600 hover:bg-gray-100 rounded"
                                            >
                                                <FiX size={18} className="mr-3" />
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;