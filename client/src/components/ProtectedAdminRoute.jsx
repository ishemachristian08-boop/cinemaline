import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedAdminRoute - Guards admin routes by checking authentication and role
 * Redirects to home if not authenticated or not an admin
 */
const ProtectedAdminRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    // Show loading state while checking auth
    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #0a0a0a, #1a0202)',
                color: 'white'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div className="loading-spinner" style={{
                        width: '40px',
                        height: '40px',
                        border: '3px solid rgba(225, 29, 72, 0.3)',
                        borderTop: '3px solid #e11d48',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 1rem'
                    }}></div>
                    <p>Checking permissions...</p>
                </div>
            </div>
        );
    }

    // Redirect to home if not authenticated
    if (!user) {
        return <Navigate to="/" state={{ from: location, message: 'Please sign in to access admin features' }} replace />;
    }

    // Redirect to home if not admin
    if (user.role !== 'admin') {
        return <Navigate to="/" state={{ from: location, message: 'Access denied. Admin privileges required.' }} replace />;
    }

    // Render admin content
    return children;
};

export default ProtectedAdminRoute;