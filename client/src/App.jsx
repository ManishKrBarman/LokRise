import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from './pages/home'
import About from "./pages/About";
import SellerLanding from './pages/SellerLanding';
import './App.css'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<About />} />
                <Route path="/sell" element={<SellerLanding />} />
            </Routes>
        </Router>
    );
}
export default App