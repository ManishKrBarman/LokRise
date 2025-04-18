import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import OrdersList from '../components/OrdersList';
import OrderDetails from '../components/OrderDetails';

const Orders = () => {
    const [selectedOrder, setSelectedOrder] = useState(null);
    // This would come from an API in a real app
    const [orders, setOrders] = useState([
        {
            id: "ORD-10012",
            date: "2025-04-15",
            total: 124.97,
            status: "Delivered",
            items: [
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
                    quantity: 3,
                    type: "product"
                }
            ],
            shippingAddress: {
                name: "John Doe",
                street: "123 Main St",
                city: "Anytown",
                zip: "12345",
                country: "United States"
            },
            paymentMethod: "Credit Card (ending in 4242)"
        },
        {
            id: "ORD-10011",
            date: "2025-04-01",
            total: 79.99,
            status: "Processing",
            items: [
                {
                    id: 3,
                    name: "Advanced Web Development",
                    price: 79.99,
                    image: "https://placehold.co/100x100",
                    quantity: 1,
                    type: "course"
                }
            ],
            shippingAddress: {
                name: "John Doe",
                street: "123 Main St",
                city: "Anytown",
                zip: "12345",
                country: "United States"
            },
            paymentMethod: "PayPal"
        }
    ]);

    const viewOrderDetails = (orderId) => {
        const order = orders.find(o => o.id === orderId);
        setSelectedOrder(order);
    };

    const closeOrderDetails = () => {
        setSelectedOrder(null);
    };

    return (
        <>
            <NavBar fixed={true} cartBtn={true} />
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">My Orders</h1>

                {orders.length > 0 ? (
                    <div>
                        {selectedOrder ? (
                            <OrderDetails
                                order={selectedOrder}
                                onBack={closeOrderDetails}
                            />
                        ) : (
                            <OrdersList
                                orders={orders}
                                viewOrderDetails={viewOrderDetails}
                            />
                        )}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <h2 className="text-2xl font-semibold mb-4">You haven't placed any orders yet</h2>
                        <p className="text-gray-600 mb-8">Once you place an order, you'll be able to track it here.</p>
                        <a
                            href="/"
                            className="bg-[var(--primary-color)] text-white py-3 px-6 rounded-lg hover:bg-opacity-90 transition duration-300"
                        >
                            Start Shopping
                        </a>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default Orders;