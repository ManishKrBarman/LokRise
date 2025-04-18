import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from './pages/home'
import About from "./pages/About";
import SellerLanding from './pages/SellerLanding';
import Edu from './pages/Edu';
import CustomerService from './pages/CustomerService';
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
            </Routes>
        </Router>
    );
}
export default App