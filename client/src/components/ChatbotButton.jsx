import React, { useState, useEffect, useRef } from 'react';
import '../styles/ChatbotButton.css';

const ChatbotButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [position, setPosition] = useState({ x: window.innerWidth - 80, y: window.innerHeight - 80 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [dragStarted, setDragStarted] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'bot', content: 'Hello! How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const buttonRef = useRef(null);
    const messagesEndRef = useRef(null);
    const panelRef = useRef(null);

    const handleClickOutside = (event) => {
        if (panelRef.current && !panelRef.current.contains(event.target)) {
            handleClosePanel();
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const newMessages = [...messages, { role: 'user', content: input }];
        setMessages(newMessages);
        setInput('');

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input }),
            });

            const data = await response.json();
            const botReply = data.reply || 'Sorry, I didn’t understand that.';
            setMessages(prev => [...prev, { role: 'bot', content: botReply }]);
        } catch (err) {
            console.error('Chat error:', err);
            setMessages(prev => [...prev, { role: 'bot', content: 'Error connecting to server.' }]);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') sendMessage();
    };

    const handleClosePanel = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsOpen(false);
            setIsClosing(false);
        }, 300);
    };

    const toggleChat = () => {
        if (!dragStarted) {
            if (isOpen) {
                handleClosePanel();
            } else {
                setIsOpen(true);
            }
        }
        setDragStarted(false);
    };

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setDragOffset({
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        });
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            setDragStarted(true);
            setPosition({
                x: e.clientX - dragOffset.x,
                y: e.clientY - dragOffset.y,
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleTouchStart = (e) => {
        const touch = e.touches[0];
        setIsDragging(true);
        setDragOffset({
            x: touch.clientX - position.x,
            y: touch.clientY - position.y,
        });
    };

    const handleTouchMove = (e) => {
        if (isDragging) {
            e.preventDefault();
            setDragStarted(true);
            const touch = e.touches[0];
            setPosition({
                x: touch.clientX - dragOffset.x,
                y: touch.clientY - dragOffset.y,
            });
        }
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            window.addEventListener('touchmove', handleTouchMove, { passive: false });
            window.addEventListener('touchend', handleTouchEnd);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [isDragging]);

    useEffect(() => {
        const handleResize = () => {
            setPosition(prevPos => {
                const screenWidth = window.innerWidth;
                return {
                    ...prevPos,
                    x: prevPos.x > screenWidth / 2 ? screenWidth - 80 : 20,
                };
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="chatbot-container" style={{ pointerEvents: isOpen ? 'all' : 'none' }}>
            {(isOpen || isClosing) && (
                <div
                    className={`chatbot-panel ${isClosing ? 'fade-out' : ''}`}
                    ref={panelRef}
                >
                    <div className="chatbot-header">
                        <h3>Chat Support</h3>
                        <button className="close-button" onClick={handleClosePanel}>✕</button>
                    </div>
                    <div className="chatbot-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.role}`}>
                                {msg.content}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="chatbot-input">
                        <input
                            type="text"
                            placeholder="Type your message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyPress}
                        />
                        <button onClick={sendMessage}>Send</button>
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
