import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import CartItemList from '../components/CartItemList';
import CartSummary from '../components/CartSummary';

const Cart = () => {
    // This would come from an API or global state in a real app
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            name: "Premium Learning Course",
            price: 49.99,
            image: "https://placehold.co/100x100",
            quantity: 1,
            type: "course"
        },
        {
            id: 2,
            name: "Smart Learning Planner",
            price: 24.99,
            image: "https://placehold.co/100x100",
            quantity: 2,
            type: "product"
        }
    ]);

    const removeItem = (id) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    const updateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) return;

        setCartItems(cartItems.map(item =>
            item.id === id ? { ...item, quantity: newQuantity } : item
        ));
    };

    return (
        <>
            <NavBar fixed={true} cartBtn={true} />
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

                {cartItems.length > 0 ? (
                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="flex-grow">
                            <CartItemList
                                items={cartItems}
                                removeItem={removeItem}
                                updateQuantity={updateQuantity}
                            />
                        </div>
                        <div className="lg:w-1/3">
                            <CartSummary items={cartItems} />
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
                        <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet.</p>
                        <a
                            href="/"
                            className="bg-[var(--primary-color)] text-white py-3 px-6 rounded-lg hover:bg-opacity-90 transition duration-300"
                        >
                            Continue Shopping
                        </a>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default Cart;