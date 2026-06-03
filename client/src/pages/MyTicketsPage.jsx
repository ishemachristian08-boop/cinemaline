import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchUserOrders } from '../services/api';
import QRCode from 'qrcode';
import toast from 'react-hot-toast';

function QRCodeCanvas({ data }) {
    const canvasRef = useRef(null);
    useEffect(() => {
        if (canvasRef.current && data) {
            QRCode.toCanvas(canvasRef.current, data, {
                width: 200, margin: 2, color: { dark: '#000000', light: '#ffffff' },
            });
        }
    }, [data]);
    return <canvas ref={canvasRef} style={{ borderRadius: '1rem', display: 'block', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />;
}

export default function MyTicketsPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('active');
    const [featured, setFeatured] = useState(null);

    useEffect(() => {
        if (user) {
            loadOrders();
        } else {
            setLoading(false);
        }
    }, [user]);

    const loadOrders = async () => {
        try {
            const data = await fetchUserOrders(user.uid);
            setOrders(data);
            if (data.length > 0) setFeatured(data[0]);
        } catch (error) {
            toast.error('Failed to load tickets');
        } finally {
            setLoading(false);
        }
    };

    const filteredTickets = orders.filter(t => {
        if (activeTab === 'active') return t.status !== 'cancelled';
        return t.status === 'cancelled';
    });

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', color: 'white' }}>
            <span style={{ width: '48px', height: '48px', borderRadius: '50%', border: '4px solid rgba(225,29,72,0.1)', borderTopColor: '#e11d48', animation: 'spin 1s linear infinite' }} />
        </div>
    );

    if (!user) {
        return (
            <div style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center', padding: '4rem 2rem', background: 'rgba(255,255,255,0.05)', borderRadius: '2rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '5rem', color: '#e11d48', marginBottom: '1.5rem' }}>lock</span>
                <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'white', marginBottom: '1rem' }}>SAY HELLO TO YOUR TICKETS</h2>
                <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2.5rem', fontSize: '1.1rem' }}>Please sign in to view and manage your cinema passes.</p>
                <button className="btn-primary" onClick={() => navigate('/')} style={{ height: '60px', padding: '0 3rem', fontSize: '1.1rem' }}>GET STARTED</button>
            </div>
        );
    }

    const qrData = featured ? JSON.stringify({ orderId: featured.id, seats: featured.seats }) : '';

    return (
        <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '3rem 1.5rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '2rem' }}>
                <div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(225, 29, 72, 0.15)', border: '1px solid rgba(225, 29, 72, 0.3)', borderRadius: '999px', padding: '0.5rem 1.25rem', marginBottom: '1rem', fontSize: '0.8rem', fontWeight: 900, color: '#ff4d7d', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>confirmation_number</span>
                        Member Area
                    </div>
                    <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 3.5rem)', fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1, fontFamily: 'var(--font-display)', color: 'white' }}>MY DIGITAL TICKETS</h1>
                    <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '0.5rem', fontSize: '1.1rem', fontWeight: 500 }}>Welcome back, {user.displayName?.split(' ')[0] || 'Member'}. Your passes are ready for scanning.</p>
                </div>
                <button className="btn-primary" style={{ padding: '0 2rem', height: '56px', fontSize: '1rem' }} onClick={() => navigate('/')}>
                    <span className="material-symbols-outlined">add</span> BOOK NEW TICKETS
                </button>
            </div>

            <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: orders.length > 0 ? '1fr 420px' : '1fr', gap: '3rem', alignItems: 'start' }}>
                {/* LEFT: Ticket List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '1rem', padding: '0.4rem', gap: '0.4rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                        {[['active', 'VALID PASSES'], ['cancelled', 'HISTORY']].map(([id, label]) => (
                            <button key={id} onClick={() => setActiveTab(id)} style={{
                                flex: 1, padding: '1rem', borderRadius: '0.75rem', border: 'none', cursor: 'pointer',
                                background: activeTab === id ? '#e11d48' : 'transparent',
                                color: 'white', fontWeight: 900, fontSize: '0.9rem', letterSpacing: '0.05em',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: activeTab === id ? '0 8px 20px rgba(225, 29, 72, 0.3)' : 'none'
                            }}>{label}</button>
                        ))}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {filteredTickets.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '6rem 2rem', background: 'rgba(255,255,255,0.03)', borderRadius: '2rem', border: '1px dashed rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '4rem', display: 'block', marginBottom: '1rem' }}>sentiment_dissatisfied</span>
                                <p style={{ fontSize: '1.25rem', fontWeight: 700 }}>No tickets found in this section.</p>
                            </div>
                        ) : filteredTickets.map(ticket => (
                            <div key={ticket.id} onClick={() => setFeatured(ticket)} style={{
                                background: featured?.id === ticket.id ? 'rgba(225, 29, 72, 0.1)' : 'rgba(255,255,255,0.03)',
                                border: `1px solid ${featured?.id === ticket.id ? '#e11d48' : 'rgba(255,255,255,0.1)'}`,
                                borderRadius: '1.25rem', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', display: 'flex',
                                transform: featured?.id === ticket.id ? 'translateX(10px)' : 'none'
                            }}>
                                <img src={ticket.poster} alt={ticket.movie} style={{ width: '100px', objectFit: 'cover' }} />
                                <div style={{ padding: '1.5rem', flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                        <h3 style={{ fontWeight: 900, fontSize: '1.25rem', fontFamily: 'var(--font-display)', color: 'white' }}>{ticket.movie}</h3>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 900, background: ticket.status === 'active' ? '#22c55e' : '#e11d48', padding: '0.2rem 0.6rem', borderRadius: '0.4rem', textTransform: 'uppercase' }}>{ticket.status}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', fontWeight: 600 }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: '1.1rem', color: '#e11d48' }}>calendar_today</span>
                                        <span>{ticket.time}</span>
                                    </div>
                                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', fontWeight: 500, marginTop: '0.25rem' }}>{ticket.hall} · {ticket.seats?.join(', ')}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT: Ticket Details */}
                {featured && (
                    <div style={{ position: 'sticky', top: '100px' }}>
                        <div className="glass-card" style={{ padding: 0, overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.6)' }}>
                            <div style={{ height: '8px', background: 'linear-gradient(90deg, #e11d48, #9f1239)' }} />
                            <div style={{ padding: '2.5rem' }}>
                                <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
                                    <img src={featured.poster} style={{ width: '90px', height: '130px', objectFit: 'cover', borderRadius: '1rem', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }} />
                                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                        <h2 style={{ fontWeight: 900, fontSize: '1.75rem', fontFamily: 'var(--font-display)', color: '#000', lineHeight: 1.1, marginBottom: '0.5rem' }}>{featured.movie}</h2>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#e11d48', fontWeight: 800, fontSize: '0.9rem' }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>schedule</span>
                                            <span>{featured.time}</span>
                                        </div>
                                        <p style={{ color: '#6b7280', fontSize: '0.85rem', fontWeight: 700, marginTop: '0.25rem' }}>{featured.hall}</p>
                                    </div>
                                </div>

                                <div style={{ borderTop: '2px dashed rgba(0,0,0,0.06)', padding: '2rem 0', textAlign: 'center' }}>
                                    <p style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.15em' }}>ASSIGNED SEATS</p>
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                                        {featured.seats?.map(s => (
                                            <span key={s} style={{ background: '#000', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.75rem', fontSize: '1.1rem', fontWeight: 900, fontFamily: 'var(--font-accent)' }}>{s}</span>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', background: '#f9fafb', padding: '2.5rem', borderRadius: '1.5rem', border: '1px solid rgba(0,0,0,0.03)' }}>
                                    <div style={{ background: 'white', borderRadius: '1.25rem', padding: '1rem', boxShadow: '0 15px 40px rgba(0,0,0,0.08)' }}>
                                        <QRCodeCanvas data={qrData} />
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <p style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>ENTRY PASS ID</p>
                                        <p style={{ fontSize: '1.1rem', fontWeight: 900, color: '#000', fontFamily: 'monospace' }}>#{featured.id?.slice(-12).toUpperCase()}</p>
                                    </div>
                                </div>

                                {featured.snackItems && (
                                    <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <span className="material-symbols-outlined" style={{ color: '#f59e0b', fontSize: '2rem' }}>fastfood</span>
                                        <div>
                                            <p style={{ fontWeight: 900, fontSize: '1rem', color: '#92400e', marginBottom: '0.2rem' }}>CONCESSIONS INCLUDED</p>
                                            <p style={{ color: '#000', fontWeight: 700, fontSize: '0.9rem' }}>{featured.snackItems.name || 'Custom Bundle'}</p>
                                        </div>
                                    </div>
                                )}

                                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                    <button className="btn-primary" onClick={() => window.print()} style={{ flex: 1, height: '56px' }}>PRINT PASS</button>
                                    <button className="btn-secondary" style={{ background: '#f3f4f6', color: '#000', width: '56px', padding: 0 }} title="Share Ticket">
                                        <span className="material-symbols-outlined">share</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
