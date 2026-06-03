import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { fetchUserRewards } from '../services/api';
import AuthModal from './AuthModal';
import Icon from './Icon';

const CinemalineLogo = () => (
    <svg className="brand__logo" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
        <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" fill="currentColor" />
    </svg>
);


const NAV_LINKS = [

    { to: '/', label: 'Movies', exact: true },
    { to: '/my-tickets', label: 'My Tickets' },
    { to: '/cinemas', label: 'Cinemas' },
    { to: '/offers', label: 'Offers' },
];

export default function Navbar() {
    const { user, logout } = useAuth();
    const { selectedSeats, selectedCombo } = useCart() || { selectedSeats: [], selectedCombo: null };
    const [rewards, setRewards] = useState(null);
    const [showAuth, setShowAuth] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const cartCount = (selectedSeats?.length || 0) + (selectedCombo ? 1 : 0);

    useEffect(() => {
        if (user) {
            fetchUserRewards(user.uid)
                .then(setRewards)
                .catch(err => console.error('Navbar rewards fetch failed:', err));
        } else {
            setRewards(null);
        }
    }, [user, location.pathname]);

    const isActive = (link) => link.exact
        ? location.pathname === link.to
        : location.pathname.startsWith(link.to);

    const handleLogout = async () => {
        try {
            await logout();
            setShowUserMenu(false);
            setMenuOpen(false);
            navigate('/');
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    return (
        <>
            <header className="site-header" role="banner">
                <div className="navbar">
                    {/* Logo */}
                    <Link to="/" className="brand" aria-label="cinemaline Home">
                        <CinemalineLogo />
                        <span className="brand__title">cinemaline</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="nav" aria-label="Primary Navigation">
                        {NAV_LINKS.map(link => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`nav__link ${isActive(link) ? 'nav__link--active' : ''}`}
                                aria-current={isActive(link) ? 'page' : undefined}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* User Controls */}
                    <div className="header-controls">
                        {cartCount > 0 && (
                            <button
                                onClick={() => navigate('/checkout')}
                                className="cart-pill"
                                aria-label={`Open cart with ${cartCount} items`}
                            >
                                <Icon name="shopping_cart" size="btn" aria-hidden="true" />
                                <span className="cart-pill__count" aria-hidden>{cartCount}</span>
                            </button>
                        )}

                        {user ? (
                            <div className="user-wrapper">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="user-btn"
                                    aria-haspopup="menu"
                                    aria-expanded={showUserMenu}
                                >
                                    <div className="user-info">
                                        <div className="user-name">{user.displayName?.toUpperCase()}</div>
                                        <div className="user-tier">{rewards?.tier?.toUpperCase() || 'MEMBER'}</div>
                                    </div>
                                    <Icon name="user" size="nav" className="user-icon" ariaLabel="User account" />
                                </button>

                                {showUserMenu && (
                                    <div className="user-menu" role="menu" aria-label="User menu">
                                        <div className="user-menu__header">
                                            <div className="menu-title">Points Balance</div>
                                            <div className="menu-points">{rewards?.points || 0} PTS</div>
                                        </div>
                                        <div className="menu-divider"></div>
                                        <div className="menu-items" role="none">
                                            <div className="menu-item" role="menuitem" onClick={() => { navigate('/rewards'); setShowUserMenu(false); }}>
                                                <Icon name="stars" size="sm" />
                                                Rewards Dashboard
                                            </div>
                                            <div className="menu-item" role="menuitem" onClick={() => { navigate('/my-tickets'); setShowUserMenu(false); }}>
                                                <Icon name="local_activity" size="sm" />
                                                My Bookings
                                            </div>
                                            {user.role === 'admin' && (
                                                <div className="menu-item admin-item" role="menuitem" onClick={() => { navigate('/admin'); setShowUserMenu(false); }}>
                                                    <Icon name="admin_panel_settings" size="sm" />
                                                    Management
                                                </div>
                                            )}
                                        </div>
                                        <div className="menu-divider"></div>
                                        <div className="menu-item logout-item" role="menuitem" onClick={handleLogout} aria-label="Logout">
                                            <Icon name="logout" size="sm" ariaLabel="Logout" />
                                            Sign Out
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                                <button
                                    onClick={() => setShowAuth(true)}
                                    className="btn btn--primary sign-in-btn"
                                    aria-label="Sign in"
                                >
                                    <Icon name="login" size="btn" ariaLabel="Sign in" />
                                    <span className="btn-label">Sign In</span>
                                </button>
                        )}

                        {/* Mobile Menu Toggle */}
                                <button
                                    onClick={() => setMenuOpen(!menuOpen)}
                                    className="btn btn--ghost mobile-menu-toggle"
                                    aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                                    aria-expanded={menuOpen}
                                >
                                    <Icon name={menuOpen ? 'close' : 'menu'} size="nav" ariaLabel={menuOpen ? 'Close menu' : 'Open menu'} />
                                </button>
                    </div>
                </div>
            </header>

            {/* Mobile Nav Overlay */}
            {menuOpen && (
                <div className="modal-overlay mobile-nav-overlay" onClick={() => setMenuOpen(false)}>
                    <nav className="mobile-nav" aria-label="Mobile navigation" onClick={e => e.stopPropagation()}>
                        {NAV_LINKS.map(link => (
                            <Link
                                key={link.to}
                                to={link.to}
                                onClick={() => setMenuOpen(false)}
                                className={`nav__link ${isActive(link) ? 'nav__link--active' : ''}`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        {!user && (
                            <button
                                onClick={() => { setShowAuth(true); setMenuOpen(false); }}
                                className="btn btn--primary btn--full"
                            >
                                <Icon name="rocket_launch" size="btn" />
                                <span className="btn-label">Get Started</span>
                            </button>
                        )}
                    </nav>
                </div>
            )}

            {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
        </>
    );
}
