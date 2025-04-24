import React from 'react';
import { Routes, Route } from "react-router-dom";
import HomePage from './pages/home';
import About from "./pages/About";
import SellerLanding from './pages/SellerLanding';
import Edu from './pages/Edu';
import CustomerService from './pages/CustomerService';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import Cart from './pages/Cart';
import Payment from './pages/Payment';
import Wishlist from './pages/Wishlist';
import Orders from './pages/Orders';
import OrderSuccess from './pages/OrderSuccess';
import Forum from './pages/Forum';
import QandA from './pages/QandA';
import BecomeSeller from './pages/BecomeSeller';
import SellerPending from './pages/SellerPending';
import ApplicationStatus from './pages/seller/ApplicationStatus';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Search from './pages/Search';
import ChatbotButton from './components/ChatbotButton';
import HackathonNotice from './components/HackathonNotice';
import ShopPage from './pages/ShopPage';
import ProductPage from './pages/ProductPage';
import CourseDetailsPage from './pages/CourseDetailsPage';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<About />} />
                <Route path="/sell" element={<SellerLanding />} />
                <Route path="/become-seller" element={<BecomeSeller />} />
                <Route path="/seller/pending" element={<SellerPending />} />
                <Route path="/seller/application-status" element={<ApplicationStatus />} />
                <Route path="/courses" element={<Edu />} />
                <Route path="/customer-service" element={<CustomerService />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/order-success" element={<OrderSuccess />} />
                <Route path="/forum" element={<Forum />} />
                <Route path="/qna" element={<QandA />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/search" element={<Search />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/product/:id" element={<CourseDetailsPage />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
            <ChatbotButton />
            <HackathonNotice />
        </>
    );
}

export default App;