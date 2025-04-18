import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from './pages/home'
import About from "./pages/About";
import SellerLanding from './pages/SellerLanding';
import Edu from './pages/Edu';
import CustomerService from './pages/CustomerService';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Orders from './pages/Orders';
import ChatbotButton from './components/ChatbotButton';
import './App.css'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<About />} />
                <Route path="/sell" element={<SellerLanding />} />
                <Route path="/courses" element={<Edu />} />
                <Route path="/customer-service" element={<CustomerService />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/orders" element={<Orders />} />
            </Routes>
            <ChatbotButton />
        </Router>
    );
}
export default App