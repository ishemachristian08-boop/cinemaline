import React from 'react';
import Icon from './Icon';
import { Link } from 'react-router-dom';


const CinemalineLogo = () => (

    <svg width="24" height="24" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" fill="currentColor" />
    </svg>
);

export default function Footer() {
    return (
        <footer className="footer" role="contentinfo">
            <div className="footer-container container">
                {/* Brand Section */}
                <div className="footer-brand">
                        <div className="brand-wrapper">
                            <CinemalineLogo />
                            <div className="brand-info">
                            <h2 className="brand-name">cinemaline</h2>
                            <p className="brand-tagline">Where every frame tells a story</p>
                        </div>
                    </div>
                    <p className="brand-description">
                        Experience the magic of cinema with our premium services, 
                        state-of-the-art theaters, and unparalleled customer care.
                    </p>
                    <div className="social-icons" aria-label="Social media">
                        <a href="#" aria-label="Facebook" className="social-icon">
                            <Icon name="facebook" ariaLabel="Facebook" size="nav" />
                        </a>
                        <a href="#" aria-label="Twitter" className="social-icon">
                            <Icon name="twitter" ariaLabel="Twitter" size="nav" />
                        </a>
                        <a href="#" aria-label="Instagram" className="social-icon">
                            <Icon name="instagram" ariaLabel="Instagram" size="nav" />
                        </a>
                        <a href="#" aria-label="YouTube" className="social-icon">
                            <Icon name="youtube" ariaLabel="YouTube" size="nav" />
                        </a>
                    </div>

                </div>

                <div className="footer-middle">
                    <div className="footer-links" aria-label="Footer links">
                        <div className="footer-column">
                            <h3 className="footer-title">Quick Navigation</h3>
                            <ul className="footer-list">
                                <li><Link to="/" className="footer-link">Home</Link></li>
                                <li><Link to="/" className="footer-link">Movies</Link></li>
                                <li><Link to="/cinemas" className="footer-link">Cinemas</Link></li>
                                <li><Link to="/checkout" className="footer-link">Book Tickets</Link></li>
                                <li><Link to="/" className="footer-link">Upcoming Movies</Link></li>
                                <li><Link to="/offers" className="footer-link">Offers</Link></li>
                                <li><Link to="/" className="footer-link">Contact</Link></li>
                            </ul>
                        </div>

                        <div className="footer-column">
                            <h3 className="footer-title">User Services</h3>
                            <ul className="footer-list">
                                <li><Link to="/my-tickets" className="footer-link">My Account</Link></li>
                                <li><Link to="/my-tickets" className="footer-link">Booking History</Link></li>
                                <li><a href="mailto:info@cinemaline.com" className="footer-link">info@cinemaline.com</a></li>
                                <li><Link to="/offers" className="footer-link">Refund Policy</Link></li>
                                <li><Link to="/offers" className="footer-link">Terms &amp; Conditions</Link></li>
                                <li><Link to="/offers" className="footer-link">Privacy Policy</Link></li>
                            </ul>
                        </div>

                        <div className="footer-column">
                            <h3 className="footer-title">Contact</h3>
                            <ul className="footer-list">
                                <li><a href="mailto:ishemachristian08@gmail.com" className="footer-link">info@cinemaline.com</a></li>
                                <li><a href="tel:+1234567890" className="footer-link">+250 (791) 792-982</a></li>
                                <li><a href="#" className="footer-link">123 Cinema Drive, Movie City</a></li>
                                <li><a href="#" className="footer-link">Business hours: Mon–Thu 9–22 · Fri–Sun 9–24</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="footer-newsletter">
                        <h3 className="footer-title">Stay Connected</h3>
                        <p className="footer-description">
                            Get premiere alerts, member offers, and cinematic updates.
                        </p>
                        <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                            <label className="sr-only" htmlFor="newsletter-email">Email address</label>
                            <input
                                id="newsletter-email"
                                type="email"
                                placeholder="Email address"
                                className="newsletter-input"
                                required
                            />
                            <button type="submit" className="btn-primary btn-newsletter">
                                Subscribe
                                <Icon name="forward" ariaLabel="Submit newsletter" size="btn" />
                            </button>

                        </form>
                        <p className="footer-small-muted">No spam—unsubscribe anytime.</p>
                    </div>
                </div>
            </div>

            <div className="footer-bottom" aria-label="Footer legal">
                <div className="footer-bottom-content container">
                    <div className="footer-legal">
                        <p className="footer-copyright">
                            © {new Date().getFullYear()} cinemaline. All rights reserved.
                        </p>
                        <div className="footer-small-links" aria-label="Legal navigation">
                            <Link to="/" className="footer-small-link">Home</Link>
                            <Link to="/offers" className="footer-small-link">Offers</Link>
                            <Link to="/offers" className="footer-small-link">Help</Link>
                            <Link to="/offers" className="footer-small-link">Terms</Link>
                            <Link to="/offers" className="footer-small-link">Privacy</Link>
                        </div>
                    </div>

                    <div className="footer-brand-bottom">
                        <p className="footer-designed-by">Built for a premium cinema experience.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

