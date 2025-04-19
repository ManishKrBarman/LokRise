import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    FiHome,
    FiUsers,
    FiShoppingBag,
    FiShoppingCart,
    FiUserCheck,
    FiBarChart2,
    FiSettings,
    FiMenu,
    FiBell,
    FiLogOut,
    FiChevronDown
} from 'react-icons/fi';

const AdminLayout = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { path: '/', icon: <FiHome size={20} />, label: 'Dashboard' },
        { path: '/users', icon: <FiUsers size={20} />, label: 'Users' },
        { path: '/products', icon: <FiShoppingBag size={20} />, label: 'Products' },
        { path: '/orders', icon: <FiShoppingCart size={20} />, label: 'Orders' },
        { path: '/seller-applications', icon: <FiUserCheck size={20} />, label: 'Seller Applications' },
        { path: '/analytics', icon: <FiBarChart2 size={20} />, label: 'Analytics' },
        { path: '/settings', icon: <FiSettings size={20} />, label: 'Settings' }
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <div className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
                <div className="p-4 flex justify-between items-center">
                    {!sidebarCollapsed && (
                        <div className="text-xl font-semibold text-white">LokRise Admin</div>
                    )}
                    <button
                        className="text-white p-2 rounded hover:bg-gray-700"
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    >
                        <FiMenu />
                    </button>
                </div>

                <nav className="mt-6">
                    {menuItems.map((item) => (
                        <div
                            key={item.path}
                            className={`py-3 px-4 flex items-center cursor-pointer
                ${location.pathname === item.path ? 'bg-blue-600' : 'hover:bg-gray-700'}
              `}
                            onClick={() => navigate(item.path)}
                        >
                            <div className="mr-3">{item.icon}</div>
                            {!sidebarCollapsed && <div>{item.label}</div>}
                        </div>
                    ))}
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1">
                {/* Header */}
                <header className="bg-white shadow-md px-6 py-3 flex justify-between items-center">
                    <h1 className="text-2xl font-semibold text-gray-800">
                        {menuItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
                    </h1>

                    <div className="flex items-center space-x-4">
                        <button className="p-2 rounded-full hover:bg-gray-100">
                            <FiBell size={20} />
                        </button>

                        <div className="relative">
                            <div
                                className="flex items-center space-x-2 cursor-pointer"
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                            >
                                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                                    {user?.name?.charAt(0) || 'A'}
                                </div>
                                {!sidebarCollapsed && (
                                    <>
                                        <span>{user?.name || 'Admin User'}</span>
                                        <FiChevronDown />
                                    </>
                                )}
                            </div>

                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                                    <button
                                        className="flex items-center w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
                                        onClick={handleLogout}
                                    >
                                        <FiLogOut className="mr-2" /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="p-6 bg-gray-50 min-h-[calc(100vh-64px)]">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;