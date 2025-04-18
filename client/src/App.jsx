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
import Forum from './pages/Forum';
import QandA from './pages/QandA';
import BecomeSeller from './pages/BecomeSeller';
import SellerPending from './pages/SellerPending';
import ChatbotButton from './components/ChatbotButton';
import './App.css'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<About />} />
                <Route path="/sell" element={<SellerLanding />} />
                <Route path="/become-seller" element={<BecomeSeller />} />
                <Route path="/seller/pending" element={<SellerPending />} />
                <Route path="/courses" element={<Edu />} />
                <Route path="/customer-service" element={<CustomerService />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/forum" element={<Forum />} />
                <Route path="/qna" element={<QandA />} />
            </Routes>
            <ChatbotButton />
        </Router>
    );
}
export default App