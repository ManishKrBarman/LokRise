import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FiCheckCircle,
    FiAlertCircle,
    FiPackage,
    FiShoppingBag,
    FiBell,
    FiMessageSquare,
    FiBook
} from 'react-icons/fi';

const NotificationsPanel = ({
    notifications = [],
    onClose,
    onMarkAsRead,
    onMarkAllAsRead
}) => {
    const navigate = useNavigate();

    // Function to handle notification click and navigation
    const handleNotificationClick = (notification) => {
        if (!notification.read && onMarkAsRead) {
            onMarkAsRead(notification._id);
        }

        // Navigate to the appropriate link if provided
        if (notification.link) {
            navigate(notification.link);
            if (onClose) onClose();
        }
    };

    // Function to get icon based on notification type
    const getNotificationIcon = (type) => {
        switch (type) {
            case 'order':
                return <FiPackage className="text-blue-500" />;
            case 'payment':
                return <FiShoppingBag className="text-green-500" />;
            case 'system':
                return <FiBell className="text-purple-500" />;
            case 'product':
                return <FiShoppingBag className="text-orange-500" />;
            case 'course':
                return <FiBook className="text-indigo-500" />;
            case 'forum':
                return <FiMessageSquare className="text-pink-500" />;
            default:
                return <FiBell className="text-gray-500" />;
        }
    };

    // Format relative time like "2 hours ago", "Yesterday", etc.
    const getRelativeTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffSecs = Math.floor(diffMs / 1000);
        const diffMins = Math.floor(diffSecs / 60);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffDays > 30) {
            return date.toLocaleDateString();
        } else if (diffDays > 1) {
            return `${diffDays} days ago`;
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffHours >= 1) {
            return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
        } else if (diffMins >= 1) {
            return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
        } else {
            return 'Just now';
        }
    };

    return (
        <div className="bg-white w-full h-full md:h-auto md:w-[320px] flex flex-col overflow-hidden">
            {/* Panel Header */}
            <div className="py-3 px-4 bg-gray-100 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-semibold text-sm">Notifications</h3>
                {notifications.some(n => !n.read) && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onMarkAllAsRead?.();
                        }}
                        className="text-xs text-blue-600 hover:text-blue-800"
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            {/* Panel Content */}
            <div className="flex-1 overflow-y-auto">
                {notifications.length > 0 ? (
                    notifications.reverse().slice(0, 2).map(notification => {
                        const isSellerApplication = notification.message.includes("seller application");
                        return (
                            <div
                                key={notification._id || notification.id}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleNotificationClick(notification);
                                }}
                                className={`cursor-pointer border-b border-gray-100 px-4 py-3 hover:bg-gray-50 transition-colors duration-200
                                    ${notification.read ? 'bg-white' : isSellerApplication ? 'bg-yellow-50' : 'bg-blue-50'}`}
                            >
                                <div className="flex items-start">
                                    <div className="mr-3 mt-1">
                                        {getNotificationIcon(notification.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm ${notification.read ? 'text-gray-600' : 'text-gray-800 font-semibold'} break-words`}>
                                            {notification.message}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {getRelativeTime(notification.createdAt)}
                                        </p>
                                    </div>
                                    {!notification.read && (
                                        <span className="h-2 w-2 bg-blue-500 rounded-full ml-2 mt-1 flex-shrink-0"></span>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="flex flex-col items-center justify-center h-full py-8 text-center text-gray-500">
                        <div className="flex justify-center mb-3">
                            <FiBell className="text-gray-300" size={24} />
                        </div>
                        <p>No notifications</p>
                    </div>
                )}
            </div>

            {/* Panel Footer */}
            {notifications.length > 0 && (
                <div className="py-3 text-center border-t border-gray-100 bg-gray-50">
                    <button
                        className="text-sm text-blue-600 hover:text-blue-800"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate('/profile?tab=notifications');
                            onClose?.();
                        }}
                    >
                        View all notifications
                    </button>
                </div>
            )}
        </div>
    );
};

export default NotificationsPanel;