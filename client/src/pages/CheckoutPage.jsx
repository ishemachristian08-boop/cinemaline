import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder, fetchUserRewards, redeemPoints } from '../services/api';
import toast from 'react-hot-toast';

const ProgressBar = ({ step }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '3.5rem', width: '100%' }}>
        {['Seats', 'Snacks', 'Payment'].map((label, i) => (
            <React.Fragment key={label}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', position: 'relative', zIndex: 2 }}>
                    <div style={{
                        width: '2.5rem', height: '2.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: i < step ? '#10b981' : i === step ? 'var(--primary)' : 'rgba(255,255,255,0.08)',
                        border: i === step ? '4px solid rgba(225, 29, 72, 0.2)' : 'none',
                        color: 'white', fontWeight: 900, fontSize: '0.9rem', transition: 'all 0.3s',
                        boxShadow: i === step ? '0 0 20px var(--primary-glow)' : 'none'
                    }}>
                        {i < step ? <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>check</span> : i + 1}
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: i === step ? 'white' : 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
                </div>
                {i < 2 && <div style={{ flex: 1, height: '3px', background: i < step ? '#10b981' : 'rgba(255,255,255,0.1)', margin: '0 0.75rem', marginBottom: '1.5rem', borderRadius: '2px', position: 'relative', zIndex: 1 }} />}
            </React.Fragment>
        ))}
    </div>
);

export default function CheckoutPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { 
        selectedSeats, selectedCombo, seatTotal, comboTotal, snacksTotal, 
        grandTotal, bookingFee, taxes, clearCart, screening 
    } = useCart();

    const [activePayment, setActivePayment] = useState('card');
    const [loading, setLoading] = useState(false);
    const [showCvv, setShowCvv] = useState(false);
    const [form, setForm] = useState({ name: '', number: '', expiry: '', cvv: '' });
    const [rewards, setRewards] = useState(null);
    const [discountApplied, setDiscountApplied] = useState(0);

    useEffect(() => {
        if (user) {
            fetchUserRewards(user.uid)
                .then(setRewards)
                .catch(err => console.error('Rewards fetch failed:', err));
        }
    }, [user]);

    const handleRedeemToggle = async () => {
        if (discountApplied > 0) {
            setDiscountApplied(0);
            return;
        }
        if (!rewards || rewards.points < 500) {
            toast.error('You need at least 500 points to redeem a discount.');
            return;
        }
        
        if (window.confirm('Redeem 500 points for an instant $5 discount?')) {
            try {
                setLoading(true);
                const res = await redeemPoints(user.uid);
                if (res.success) {
                    setDiscountApplied(5);
                    setRewards(prev => ({ ...prev, points: prev.points - 500 }));
                    toast.success('Points redeemed! $5 discount applied.');
                }
            } catch (err) {
                toast.error(err.message || 'Redemption failed');
            } finally {
                setLoading(false);
            }
        }
    };

    const finalTotal = Math.max(0, grandTotal - discountApplied);

    const formatCardNumber = (val) => val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
    const formatExpiry = (val) => {
        const d = val.replace(/\D/g, '').slice(0, 4);
        return d.length >= 3 ? `${d.slice(0, 2)} / ${d.slice(2)}` : d;
    };

    const handlePurchase = async (e) => {
        e.preventDefault();
        if (selectedSeats.length === 0) { toast.error('No seats selected!'); return; }
        setLoading(true);

        try {
            const orderData = {
                userId:      user?.uid   || 'guest',
                userEmail:   user?.email || null,
                userName:    user?.displayName || form.name || 'Movie Lover',
                screeningId: screening?.id     || 'unknown',
                movie:       screening?.movie  || '',
                hall:        screening?.hall   || '',
                date:        screening?.date   || '',
                time:        screening?.time   || '',
                format:      screening?.format || '2D',
                poster:      screening?.poster || '',
                seats:       selectedSeats.map(s => s.label),
                snackItems:  selectedCombo,
                totalPaid:   finalTotal,
            };

            const response = await createOrder(orderData);

            if (response.success) {
                sessionStorage.setItem('lastOrder', JSON.stringify({
                    orderId:      response.orderId,
                    movie:        screening?.movie   || 'Movie Title',
                    poster:       screening?.poster,
                    time:         `${screening?.date || ''} · ${screening?.time || ''}`,
                    hall:         screening?.hall    || 'Cinema Hall',
                    format:       screening?.format  || '2D',
                    seats:        selectedSeats.map(s => s.label),
                    combo:        selectedCombo,
                    total:        finalTotal,
                    emailSent:    response.emailSent,
                    emailPreview: response.emailPreview || null,
                    pointsEarned: response.pointsEarned,
                }));
                clearCart();
                toast.success('Booking confirmed! Welcome to the show.');
                navigate('/booking-confirmed');
            }
        } catch (error) {
            console.error('Order creation failed:', error);
            toast.error('Payment failed. Please check credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '3rem 1.5rem' }}>
            <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '3rem', alignItems: 'start' }}>

                {/* LEFT — Payment Form */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <ProgressBar step={2} />

                    <div>
                        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)', fontWeight: 900, letterSpacing: '-0.02em', color: 'white', fontFamily: 'var(--font-display)', marginBottom: '0.5rem', margin: 0 }}>SECURE CHECKOUT</h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', fontWeight: 500, margin: 0 }}>Confirm details and process payment securely.</p>
                    </div>

                    <div className="glass-card" style={{ padding: '2.5rem', border: '1px solid rgba(225, 29, 72, 0.25)', boxShadow: '0 30px 60px rgba(0,0,0,0.6)' }}>
                        {/* Payment Method Tabs */}
                        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2.5rem' }}>
                            {[
                                { id: 'card', label: 'Credit Card', icon: 'credit_card' },
                                { id: 'wallet', label: 'Digital Wallets', icon: 'account_balance_wallet' },
                            ].map(tab => (
                                <button key={tab.id} onClick={() => setActivePayment(tab.id)} style={{
                                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '1rem',
                                    borderRadius: '1rem', cursor: 'pointer',
                                    background: activePayment === tab.id ? 'rgba(225, 29, 72, 0.15)' : 'rgba(255,255,255,0.03)',
                                    border: activePayment === tab.id ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.08)',
                                    color: activePayment === tab.id ? '#fff' : 'var(--text-secondary)',
                                    fontWeight: 800, fontSize: '0.9rem', transition: 'all 0.2s',
                                }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '1.4rem', color: activePayment === tab.id ? 'var(--primary)' : 'inherit' }}>{tab.icon}</span>
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {activePayment === 'card' ? (
                            <form onSubmit={handlePurchase} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 900, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Cardholder Name</label>
                                    <input type="text" className="form-input" placeholder="FULL NAME AS ON CARD" required
                                        value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} style={{ textTransform: 'uppercase' }} />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 900, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Card Number</label>
                                    <div style={{ position: 'relative' }}>
                                        <input type="text" className="form-input" placeholder="0000 0000 0000 0000" required
                                            value={form.number} onChange={e => setForm(p => ({ ...p, number: formatCardNumber(e.target.value) }))}
                                            style={{ paddingRight: '3.5rem', fontFamily: 'var(--font-mono)' }}
                                        />
                                        <span className="material-symbols-outlined" style={{ position: 'absolute', right: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '1.5rem' }}>credit_card</span>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 900, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Expiry Date</label>
                                        <input type="text" className="form-input" placeholder="MM / YY" required
                                            value={form.expiry} onChange={e => setForm(p => ({ ...p, expiry: formatExpiry(e.target.value) }))} style={{ fontFamily: 'var(--font-mono)' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 900, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>CVV / CVC</label>
                                        <div style={{ position: 'relative' }}>
                                            <input type={showCvv ? 'text' : 'password'} className="form-input" placeholder="000" required
                                                maxLength={4} value={form.cvv} onChange={e => setForm(p => ({ ...p, cvv: e.target.value.replace(/\D/g, '') }))}
                                                style={{ paddingRight: '3rem', fontFamily: 'var(--font-mono)' }}
                                            />
                                            <button type="button" onClick={() => setShowCvv(!showCvv)} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>{showCvv ? 'visibility_off' : 'visibility'}</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <button type="submit" className="btn-primary" disabled={loading} style={{ height: '60px', fontSize: '1.15rem', borderRadius: '1rem', marginTop: '1rem', width: '100%' }}>
                                    {loading ? (
                                        <><span style={{ display: 'inline-block', width: '20px', height: '20px', borderRadius: '50%', border: '3px solid rgba(255,255,255,0.3)', borderTopColor: 'white', animation: 'spin 0.8s linear infinite', marginRight: '0.5rem' }} /> AUTHORIZING...</>
                                    ) : (
                                        <><span className="material-symbols-outlined">verified_user</span> AUTHORIZE ${finalTotal.toFixed(2)}</>
                                    )}
                                </button>
                            </form>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '4.5rem', display: 'block', marginBottom: '1.5rem', opacity: 0.2, color: 'var(--primary)' }}>account_balance_wallet</span>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'white', marginBottom: '0.5rem', fontFamily: 'var(--font-display)' }}>DIGITAL WALLETS</h3>
                                <p style={{ fontWeight: 500, fontSize: '0.95rem' }}>Apple Pay, Google Pay, and PayPal integration coming soon.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT — Order Summary */}
                <div style={{ position: 'sticky', top: '96px' }}>
                    <div className="glass-card" style={{ padding: 0, overflow: 'hidden', border: '1px solid rgba(225, 29, 72, 0.25)', boxShadow: '0 30px 60px rgba(0,0,0,0.6)' }}>
                        <div style={{ padding: '1.25rem 2rem', background: 'rgba(225, 29, 72, 0.08)', borderBottom: '1px solid rgba(225, 29, 72, 0.18)' }}>
                            <h3 style={{ fontWeight: 900, fontSize: '1.1rem', color: '#fff', fontFamily: 'var(--font-display)', letterSpacing: '0.05em', margin: 0 }}>ORDER SUMMARY</h3>
                        </div>
                        
                        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {/* Movie info */}
                            <div style={{ display: 'flex', gap: '1.25rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                                {screening?.poster && (
                                    <img src={screening.poster} style={{ width: '70px', height: '100px', objectFit: 'cover', borderRadius: '0.75rem', boxShadow: '0 8px 20px rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }} alt="poster" />
                                )}
                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.15rem' }}>
                                    <h4 style={{ fontWeight: 900, fontSize: '1.15rem', color: '#fff', margin: 0, lineHeight: 1.2 }}>{screening?.movie}</h4>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>{screening?.hall} · {screening?.format}</p>
                                    <p style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 800, margin: 0 }}>{screening?.date} @ {screening?.time}</p>
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                    <p style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)', margin: 0 }}>SEATS ({selectedSeats.length})</p>
                                    {selectedSeats.map(s => (
                                        <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', fontWeight: 600, color: 'white' }}>
                                            <span>{s.label}</span><span style={{ fontFamily: 'var(--font-mono)' }}>${s.price.toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>

                                {selectedCombo && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                                        <p style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)', margin: 0 }}>CONCESSIONS</p>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', fontWeight: 700, color: '#f59e0b' }}>
                                            <span>{selectedCombo.name}</span>
                                            <span style={{ fontFamily: 'var(--font-mono)' }}>${selectedCombo.price.toFixed(2)}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Totals */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                                    <span>Subtotal</span><span style={{ color: 'white', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>${(seatTotal + comboTotal + snacksTotal).toFixed(2)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                                    <span>Booking Fee</span><span style={{ color: 'white', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>${bookingFee.toFixed(2)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                                    <span>Tax (10%)</span><span style={{ color: 'white', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>${taxes.toFixed(2)}</span>
                                </div>
                                {discountApplied > 0 && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', color: '#10b981', fontWeight: 800 }}>
                                        <span>OmniRewards Credit</span><span style={{ fontFamily: 'var(--font-mono)' }}>-$5.00</span>
                                    </div>
                                )}
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '2rem', fontWeight: 900, paddingTop: '1rem', color: 'white', fontFamily: 'var(--font-display)', borderTop: '1px solid rgba(255,255,255,0.08)', letterSpacing: '0.02em' }}>
                                    <span>TOTAL</span>
                                    <span style={{ color: 'var(--primary)' }}>${finalTotal.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Rewards Widget */}
                            {user && rewards && (
                                <div style={{ marginTop: '0.5rem', padding: '1.25rem', background: 'rgba(245, 158, 11, 0.06)', borderRadius: '1.25rem', border: '1px solid rgba(245, 158, 11, 0.25)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <span className="material-symbols-outlined" style={{ color: 'white', fontSize: '1.25rem' }}>stars</span>
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '0.7rem', fontWeight: 900, color: '#f59e0b', textTransform: 'uppercase', margin: 0, letterSpacing: '0.05em' }}>LOYALTY BALANCE</p>
                                            <p style={{ fontSize: '1.05rem', fontWeight: 900, color: 'white', margin: 0, fontFamily: 'var(--font-accent)' }}>{rewards.points} POINTS</p>
                                        </div>
                                    </div>
                                    
                                    {rewards.points >= 500 || discountApplied > 0 ? (
                                        <button type="button" onClick={handleRedeemToggle} disabled={loading} style={{
                                            width: '100%', height: '42px', background: discountApplied > 0 ? '#10b981' : '#f59e0b',
                                            color: 'white', border: 'none', borderRadius: '0.75rem',
                                            fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer', transition: 'all 0.3s',
                                            letterSpacing: '0.05em'
                                        }}>
                                            {discountApplied > 0 ? '✓ REWARD ACTIVATED' : 'REDEEM 500 PTS (-$5.00)'}
                                        </button>
                                    ) : (
                                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', fontWeight: 600, margin: 0 }}>Earn 500 pts to unlock a $5 discount!</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
