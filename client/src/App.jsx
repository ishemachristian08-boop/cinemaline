import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';

import HomePage from './pages/HomePage';
import SeatSelectionPage from './pages/SeatSelectionPage';
import SnackPage from './pages/SnackPage';
import CheckoutPage from './pages/CheckoutPage';
import BookingConfirmedPage from './pages/BookingConfirmedPage';
import MyTicketsPage from './pages/MyTicketsPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminOperational from './pages/AdminOperational';
import CinemasPage from './pages/CinemasPage';
import OffersPage from './pages/OffersPage';
import RewardsPage from './pages/RewardsPage';
import { onMessageListener } from './services/notificationService';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AppLayout = ({ children }) => (
  <div className="app-layout">
    <Navbar />
    <main className="app-main">{children}</main>
    <Footer />
  </div>
);

function App() {
  useEffect(() => {
    onMessageListener().catch(err => console.log('Notification listener failed: ', err));
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <CartProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1e0202',
                color: '#fff',
                border: '1px solid rgba(225, 29, 72, 0.3)',
                fontFamily: 'var(--font-accent)',
                fontWeight: 800,
                fontSize: '0.9rem',
                borderRadius: '1rem',
                boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
              },
              success: {
                iconTheme: {
                  primary: '#e11d48',
                  secondary: '#fff',
                },
              },
            }}
          />
          <Routes>
            {/* Admin (no navbar/footer) - Protected by role-based route guard */}
            <Route path="/admin" element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            } />
            <Route path="/admin/ops" element={
              <ProtectedAdminRoute>
                <AdminOperational />
              </ProtectedAdminRoute>
            } />

            {/* Main app with Navbar + Footer */}
            <Route path="/" element={<AppLayout><HomePage /></AppLayout>} />
            <Route path="/select-seats/:screeningId" element={<AppLayout><SeatSelectionPage /></AppLayout>} />
            <Route path="/snacks" element={<AppLayout><SnackPage /></AppLayout>} />
            <Route path="/checkout" element={<AppLayout><CheckoutPage /></AppLayout>} />
            <Route path="/booking-confirmed" element={<AppLayout><BookingConfirmedPage /></AppLayout>} />
            <Route path="/my-tickets" element={<AppLayout><MyTicketsPage /></AppLayout>} />
            <Route path="/cinemas" element={<AppLayout><CinemasPage /></AppLayout>} />
            <Route path="/offers" element={<AppLayout><OffersPage /></AppLayout>} />
            <Route path="/rewards" element={<AppLayout><RewardsPage /></AppLayout>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
