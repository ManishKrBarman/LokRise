import React, { useState, useEffect, useRef } from 'react';
import '../styles/ChatbotButton.css';

const ChatbotButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({ x: window.innerWidth - 80, y: window.innerHeight - 80 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [dragStarted, setDragStarted] = useState(false);
    const buttonRef = useRef(null);
    const dragStartTime = useRef(0);
    const dragDistance = useRef(0);

    // Handle click on the chatbot button
    const toggleChat = (e) => {
        // Only toggle if it was a simple click, not a drag
        if (!dragStarted) {
            setIsOpen(!isOpen);
        }
        // Reset drag tracking
        setDragStarted(false);
        dragDistance.current = 0;
    };

    // Start dragging
    const handleMouseDown = (e) => {
        if (buttonRef.current && !isOpen) {
            const rect = buttonRef.current.getBoundingClientRect();
            setDragOffset({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            });
            setIsDragging(true);
            dragStartTime.current = Date.now();
            dragDistance.current = 0;
        }
    };

    // Handle dragging
    const handleMouseMove = (e) => {
        if (isDragging) {
            // Calculate drag distance
            if (!dragStarted) {
                dragDistance.current += 1;
                // If moved more than a few pixels, consider it a drag
                if (dragDistance.current > 5) {
                    setDragStarted(true);
                }
            }

            setPosition({
                x: e.clientX - dragOffset.x,
                y: e.clientY - dragOffset.y,
            });
        }
    };

    // End dragging and snap to nearest edge
    const handleMouseUp = () => {
        if (isDragging) {
            // Only snap if we've genuinely dragged (not just clicked)
            if (dragStarted) {
                const snapToEdge = () => {
                    const screenWidth = window.innerWidth;
                    const screenHeight = window.innerHeight;

                    // Ensure button stays within vertical bounds
                    const boundedY = Math.min(
                        Math.max(position.y, 20),
                        screenHeight - 80
                    );

                    // Determine whether to snap to left or right edge
                    if (position.x < screenWidth / 2) {
                        // Snap to left edge
                        return { x: 20, y: boundedY };
                    } else {
                        // Snap to right edge
                        return { x: screenWidth - 80, y: boundedY };
                    }
                };

                setPosition(snapToEdge());
            }

            setIsDragging(false);
        }
    };

    // Set up event listeners for dragging
    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);

            // Also add touch events for mobile
            window.addEventListener('touchmove', handleTouchMove, { passive: false });
            window.addEventListener('touchend', handleTouchEnd);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [isDragging, position]);

    // Touch event handlers
    const handleTouchStart = (e) => {
        if (buttonRef.current && !isOpen) {
            const touch = e.touches[0];
            const rect = buttonRef.current.getBoundingClientRect();
            setDragOffset({
                x: touch.clientX - rect.left,
                y: touch.clientY - rect.top,
            });
            setIsDragging(true);
            dragStartTime.current = Date.now();
            dragDistance.current = 0;
            e.preventDefault();
        }
    };

    const handleTouchMove = (e) => {
        if (isDragging) {
            const touch = e.touches[0];
            if (!dragStarted) {
                dragDistance.current += 1;
                if (dragDistance.current > 5) {
                    setDragStarted(true);
                }
            }

            setPosition({
                x: touch.clientX - dragOffset.x,
                y: touch.clientY - dragOffset.y,
            });
            e.preventDefault();
        }
    };

    const handleTouchEnd = () => {
        handleMouseUp(); // Reuse the same logic
    };

    // Reposition button on window resize
    useEffect(() => {
        const handleResize = () => {
            setPosition(prevPos => {
                const screenWidth = window.innerWidth;

                // If on right side, keep on right side
                if (prevPos.x > screenWidth / 2) {
                    return { ...prevPos, x: screenWidth - 80 };
                } else {
                    // Keep on left side
                    return { ...prevPos, x: 20 };
                }
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="chatbot-container" style={{ pointerEvents: isOpen ? 'all' : 'none' }}>
            {isOpen && (
                <div className="chatbot-panel">
                    <div className="chatbot-header">
                        <h3>Chat Support</h3>
                        <button className="close-button" onClick={() => setIsOpen(false)}>✕</button>
                    </div>
                    <div className="chatbot-messages">
                        <div className="message bot">
                            Hello! How can I help you today?
                        </div>
                        {/* Message history will go here */}
                    </div>
                    <div className="chatbot-input">
                        <input
                            type="text"
                            placeholder="Type your message..."
                        />
                        <button>Send</button>
                    </div>
                </div>
            )}
            <div
                className="chatbot-button"
                ref={buttonRef}
                style={{
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    cursor: isDragging ? 'grabbing' : 'grab',
                    pointerEvents: 'all'
                }}
                onClick={toggleChat}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
            >
                <div className="chatbot-icon">
                    {isOpen ? '✕' : '💬'}
                </div>
            </div>
        </div>
    );
};

export default ChatbotButton;