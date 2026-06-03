import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

// Consistent icon wrapper
const Icon = ({ name, size = 'md', className = '', ...props }) => (
    <span className={`material-symbols-outlined icon icon--${size} ${className}`} {...props}>
        {name}
    </span>
);

const CinemalineLogo = () => (
    <Icon name="confirmation_number" size="xl" style={{ color: 'white' }} />
);

export default function AuthModal({ initialMode = 'login', onClose, onSuccess }) {
    const [mode, setMode] = useState(initialMode); // 'login' | 'signup'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [forgotMode, setForgotMode] = useState(false);

    const { login, signup, loginWithGoogle, resetPassword } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (forgotMode) {
                await resetPassword(email);
                toast.success('Password reset email sent!');
                setForgotMode(false);
            } else if (mode === 'signup') {
                await signup(email, password, displayName);
toast.success('Account created! Welcome to cinemaline 🎬');
                onSuccess?.();
                onClose();
            } else {
                await login(email, password);
                toast.success('Welcome back!');
                onSuccess?.();
                onClose();
            }
        } catch (err) {
            toast.error(err.message?.replace('Firebase: ', '').replace(/\(auth.*\)/, '') || 'Something went wrong');
        }
        setLoading(false);
    };

    const handleGoogle = async () => {
        setLoading(true);
        try {
            await loginWithGoogle();
            toast.success('Signed in with Google!');
            onSuccess?.();
            onClose();
        } catch (err) {
            toast.error('Google sign-in failed');
        }
        setLoading(false);
    };

    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="glass-card" style={{ 
                position: 'relative', 
                width: '100%', 
                maxWidth: '440px',
                padding: '3rem 2.5rem',
                border: '1px solid rgba(225, 29, 72, 0.3)',
                boxShadow: '0 0 50px rgba(0,0,0,0.5), 0 0 20px rgba(225, 29, 72, 0.1)'
            }}>
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="icon-btn"
                    aria-label="Close dialog"
                    style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }}
                >
                    <Icon name="close" size="md" />
                </button>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                 <div style={{
                         display: 'inline-flex', background: 'linear-gradient(135deg, #e11d48, #9f1239)', borderRadius: '1rem',
                         padding: '1rem', marginBottom: '1.25rem', boxShadow: '0 10px 25px rgba(225, 29, 72, 0.4)',
                     }}>
                         <CinemalineLogo />
                     </div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '0.5rem', lineHeight: 1 }}>
                        {forgotMode ? 'RESET' : mode === 'login' ? 'SIGN IN' : 'JOIN US'}
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', fontWeight: 500 }}>
                        {forgotMode ? 'Recover your cinematic access' : mode === 'login' ? 'Welcome back, Movie Lover' : 'Your cinematic journey starts here'}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {mode === 'signup' && !forgotMode && (
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, marginBottom: '0.5rem', color: '#e11d48', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Full Name</label>
                            <input
                                type="text" value={displayName} onChange={e => setDisplayName(e.target.value)}
                                className="form-input" placeholder="e.g. John Doe" required
                            />
                        </div>
                    )}
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, marginBottom: '0.5rem', color: '#e11d48', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Address</label>
                        <input
                            type="email" value={email} onChange={e => setEmail(e.target.value)}
                            className="form-input" placeholder="Enter your email" required
                        />
                    </div>
                    {!forgotMode && (
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, marginBottom: '0.5rem', color: '#e11d48', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password} onChange={e => setPassword(e.target.value)}
                                    className="form-input" placeholder="••••••••" required
                                    style={{ paddingRight: '3.5rem' }}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                                    position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)',
                                    background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer',
                                }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>
                                        {showPassword ? 'visibility_off' : 'visibility'}
                                    </span>
                                </button>
                            </div>
                        </div>
                    )}

                    {mode === 'login' && !forgotMode && (
                        <div style={{ textAlign: 'right', marginTop: '-0.5rem' }}>
                            <button type="button" onClick={() => setForgotMode(true)} style={{
                                background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '0.8rem', textDecoration: 'underline'
                            }}>Forgot Password?</button>
                        </div>
                    )}

                    <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '0.75rem', height: '56px', fontSize: '1rem' }}>
                        {loading ? 'PROCESSING...' : forgotMode ? 'SEND RESET LINK' : mode === 'login' ? 'SECURE LOGIN' : 'CREATE ACCOUNT'}
                    </button>
                </form>

                {!forgotMode && (
                    <>
                        {/* Divider */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.75rem 0' }}>
                            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
                            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700 }}>Or continue with</span>
                            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
                        </div>

                        {/* Google */}
                        <button onClick={handleGoogle} disabled={loading} style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                            width: '100%', height: '52px', borderRadius: '1rem',
                            border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)',
                            color: 'white', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 700,
                            transition: 'all 0.2s',
                        }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                        >
                            <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
                                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
                                <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853" />
                                <path d="M3.964 10.707C3.784 10.167 3.682 9.6 3.682 9c0-.6.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9c0 1.45.348 2.825.957 4.039l3.007-2.332z" fill="#FBBC05" />
                                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
                            </svg>
                            GOOGLE ACCOUNT
                        </button>

                         {/* Toggle */}
                         <p style={{ textAlign: 'center', marginTop: '2rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', fontWeight: 500 }}>
                             {mode === 'login' ? "NEW TO CINEMALINE? " : 'ALREADY A MEMBER? '}
                             <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} style={{
                                 background: 'none', border: 'none', color: '#e11d48', fontWeight: 800, cursor: 'pointer', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em'
                             }}>
                                 {mode === 'login' ? 'Create Account' : 'Sign In'}
                             </button>
                         </p>
                    </>
                )}

                {forgotMode && (
                    <p style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                        <button onClick={() => setForgotMode(false)} style={{
                            background: 'none', border: 'none', color: '#e11d48', cursor: 'pointer', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.1em'
                        }}>← Back to Login</button>
                    </p>
                )}
            </div>
        </div>
    );
}
