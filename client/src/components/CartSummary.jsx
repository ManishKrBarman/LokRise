import React from 'react';
import { FiShoppingCart } from 'react-icons/fi';

const CartSummary = ({ totals, onCheckout }) => {
    const { subtotal, shipping, total, itemCount } = totals;

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="space-y-3">
                <div className="flex justify-between">
                    <span>Subtotal ({itemCount} items)</span>
                    <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-medium">{shipping > 0 ? `₹${shipping.toFixed(2)}` : 'Free'}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>₹{total.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <button 
                onClick={onCheckout}
                className="w-full mt-6 bg-[var(--primary-color)] text-white py-3 rounded-lg hover:bg-opacity-90 transition duration-300 flex items-center justify-center"
            >
                <FiShoppingCart className="mr-2" />
                Proceed to Checkout
            </button>

            {shipping === 0 && (
                <p className="mt-4 text-sm text-green-600 text-center">
                    🎉 Congratulations! You get free shipping on this order.
                </p>
            )}
            
            {shipping > 0 && (
                <p className="mt-4 text-sm text-gray-600 text-center">
                    Add ₹{(1000 - subtotal).toFixed(2)} more to get free shipping!
                </p>
            )}
        </div>
    );
};

export default CartSummary;