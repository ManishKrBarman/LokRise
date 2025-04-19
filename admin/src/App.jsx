import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

// Layout Components
import AdminLayout from './components/layout/AdminLayout'

// Pages
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Users from './pages/Users'
import Products from './pages/Products'
import Orders from './pages/Orders'
import SellerApplications from './pages/SellerApplications'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading, user } = useAuth()

    if (loading) {
        return <div className="flex h-screen items-center justify-center">
            <div className="text-2xl">Loading...</div>
        </div>
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    // Check if user is admin
    if (!user || user.role !== 'admin') {
        return <div className="flex h-screen items-center justify-center flex-col">
            <div className="text-2xl text-red-600 mb-4">Access Denied</div>
            <div className="text-lg">You do not have permission to access the admin panel.</div>
        </div>
    }

    return children
}

function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />

            {/* Protected Admin Routes */}
            <Route path="/" element={
                <ProtectedRoute>
                    <AdminLayout />
                </ProtectedRoute>
            }>
                <Route index element={<Dashboard />} />
                <Route path="users" element={<Users />} />
                <Route path="products" element={<Products />} />
                <Route path="orders" element={<Orders />} />
                <Route path="seller-applications" element={<SellerApplications />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="settings" element={<Settings />} />
            </Route>

            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}

export default App