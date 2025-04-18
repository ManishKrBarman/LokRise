import React, { useMemo } from 'react';

const CartSummary = ({ items }) => {
    const subtotal = useMemo(() => {
        return items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }, [items]);

    const shipping = 5.99; // Could be calculated based on items, location, etc.
    const tax = subtotal * 0.08; // Tax rate could be dynamic based on location
    const total = subtotal + shipping + tax;

    return (
        <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-medium">${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Tax</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <button className="w-full bg-[var(--primary-color)] text-white py-3 rounded-lg hover:bg-opacity-90 transition duration-300">
                Proceed to Checkout
            </button>

            <div className="mt-4">
                <button className="w-full border border-[var(--primary-color)] text-[var(--primary-color)] py-2 rounded-lg hover:bg-gray-50 transition duration-300">
                    Continue Shopping
                </button>
            </div>
        </div>
    );
};

export default CartSummary;