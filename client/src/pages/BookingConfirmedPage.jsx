import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BookingConfirmedPage() {
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const data = sessionStorage.getItem('lastOrder');
        if (data) setOrder(JSON.parse(data));
    }, []);

    return (
        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '4rem 1.5rem', textAlign: 'center' }}>
            {/* Success Icon */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem' }}>
                <div className="animate-success" style={{
                    width: '110px', height: '110px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 20px 50px rgba(225, 29, 72, 0.4)',
                    animation: 'success-pop 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards',
                }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '3.75rem', color: 'white', fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                </div>
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '999px', padding: '0.4rem 1.25rem', marginBottom: '1.5rem', fontSize: '0.8rem', fontWeight: 900, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>verified</span>
                Payment Authorized
            </div>

            <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 3.75rem)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '1rem', lineHeight: 1.05, fontFamily: 'var(--font-display)', color: 'white' }}>
                BOOKING<br />
                <span style={{ color: 'var(--primary)', textShadow: '0 0 20px var(--primary-glow)' }}>CONFIRMED!</span>
            </h1>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '3rem', lineHeight: 1.6, fontWeight: 500 }}>
                Your cinematic journey is locked in. We've sent your entry passes and transaction details directly to your inbox.
            </p>

            {order && (
                <div className="glass-card" style={{ padding: 0, overflow: 'hidden', marginBottom: '2.5rem', textAlign: 'left', border: '1px solid rgba(225,29,72,0.25)', boxShadow: '0 30px 60px rgba(0,0,0,0.6)' }}>
                    {/* Header border */}
                    <div style={{ height: '6px', background: 'linear-gradient(90deg, var(--primary), var(--primary-dark))' }} />

                    {/* Movie info */}
                    <div style={{ padding: '2rem', display: 'flex', gap: '1.5rem', alignItems: 'center', borderBottom: '1px dashed rgba(255,255,255,0.08)', flexWrap: 'wrap' }}>
                        {order.poster && (
                            <img src={order.poster} alt={order.movie} style={{ width: '80px', height: '115px', objectFit: 'cover', borderRadius: '0.75rem', boxShadow: '0 8px 20px rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.06)' }} />
                        )}
                        <div style={{ flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                            <h3 style={{ fontWeight: 900, fontSize: '1.6rem', color: '#fff', fontFamily: 'var(--font-display)', margin: 0, letterSpacing: '0.01em' }}>{order.movie}</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontWeight: 700, fontSize: '0.9rem', marginTop: '0.25rem' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>event</span>
                                <span>{order.time}</span>
                            </div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>{order.hall} · {order.format}</p>
                        </div>
                    </div>

                    {/* Seats */}
                    <div style={{ padding: '1.5rem 2rem', borderBottom: '1px dashed rgba(255,255,255,0.08)' }}>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.12em', margin: '0 0 0.75rem' }}>YOUR SEATS</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                            {order.seats?.map((s, i) => (
                                <span key={i} style={{ background: 'rgba(225, 29, 72, 0.12)', border: '1px solid rgba(225, 29, 72, 0.25)', borderRadius: '0.5rem', padding: '0.4rem 0.8rem', fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-accent)' }}>{s}</span>
                            ))}
                        </div>
                    </div>

                    {/* Total & Order ID */}
                    <div style={{ padding: '1.75rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', background: 'rgba(255,255,255,0.015)' }}>
                        <div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.12em', margin: 0 }}>ORDER REFERENCE</p>
                            <p style={{ fontWeight: 900, fontFamily: 'var(--font-mono)', fontSize: '1.15rem', letterSpacing: '0.05em', color: '#fff', margin: '0.2rem 0 0' }}>#{order.orderId.toUpperCase()}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.12em', margin: 0 }}>TOTAL PAID</p>
                            <p style={{ fontWeight: 900, fontSize: '1.85rem', color: 'var(--primary)', fontFamily: 'var(--font-display)', margin: 0 }}>${order.total?.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* OmniPoints Earned Badge */}
            {order && order.pointsEarned > 0 && (
                <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'center' }}>
                    <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: '1.25rem', padding: '1.25rem 2rem', display: 'flex', alignItems: 'center', gap: '1.25rem', boxShadow: '0 12px 30px rgba(245,158,11,0.08)' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <span className="material-symbols-outlined" style={{ color: 'white', fontSize: '1.5rem', fontWeight: 900 }}>stars</span>
                        </div>
                        <div style={{ textAlign: 'left' }}>
                            <p style={{ fontSize: '1.05rem', fontWeight: 900, color: 'white', margin: 0 }}>+{order.pointsEarned} OmniPoints Credited!</p>
                            <p style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Loyalty Member Program</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button onClick={() => navigate('/my-tickets')} className="btn-primary" style={{ height: '60px', fontSize: '1.1rem', borderRadius: '1rem', gap: '0.75rem', width: '100%' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '1.4rem' }}>qr_code_2</span>
                    VIEW MY PASSES
                </button>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => window.print()} className="btn-secondary" style={{ flex: 1, height: '52px', fontSize: '0.9rem', background: 'rgba(255,255,255,0.04)', borderRadius: '0.875rem' }}>
                        <span className="material-symbols-outlined">print</span>
                        Print Receipt
                    </button>
                    <button onClick={() => navigate('/')} className="btn-secondary" style={{ flex: 1, height: '52px', fontSize: '0.9rem', background: 'rgba(255,255,255,0.04)', borderRadius: '0.875rem' }}>
                        <span className="material-symbols-outlined">local_movies</span>
                        Home Page
                    </button>
                </div>
            </div>
        </div>
    );
}
