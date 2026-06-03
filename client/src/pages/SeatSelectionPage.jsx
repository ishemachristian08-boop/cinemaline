import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/AuthModal';
import { fetchScreeningSeats } from '../services/api';
import toast from 'react-hot-toast';

const generateSeats = (rows, cols, section, pricePerSeat, bookedSeatsSet) => {
    const seats = [];
    rows.forEach((row, ri) => {
        for (let col = 1; col <= cols; col++) {
            const label = `Row ${row} - Seat ${col}`;
            const isOccupied = bookedSeatsSet.has(label);
            seats.push({
                id: `${section}-${row}-${col}`,
                row, col, section,
                price: pricePerSeat,
                status: isOccupied ? 'occupied' : 'available',
                label,
            });
        }
    });
    return seats;
};

const SEAT_SECTIONS = [
    { key: 'TOP_LEFT',  label: 'Premium Left',  tier: 'premium',  cols: 6, rows: ['A', 'B'] },
    { key: 'TOP_RIGHT', label: 'Premium Right', tier: 'premium',  cols: 6, rows: ['A', 'B'] },
    { key: 'BTM_LEFT',  label: 'Standard Left', tier: 'standard', cols: 6, rows: ['C', 'D'] },
    { key: 'BTM_RIGHT', label: 'Standard Right',tier: 'standard', cols: 6, rows: ['C', 'D'] },
];

const FORMAT_CONFIG = {
    'IMAX':         { color: 'var(--primary)', glow: 'rgba(212, 175, 55, 0.35)', label: 'IMAX®',          icon: 'panorama_wide_angle', screen: 'IMAX Giant Screen' },
    'Dolby Cinema': { color: '#be123c', glow: 'rgba(190, 18, 60, 0.35)',  label: 'Dolby Cinema',   icon: 'speaker', screen: 'Dolby Atmos & Vision' },
    '4DX':          { color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.35)',  label: '4DX',            icon: 'wind_power', screen: '4DX Motion Experience' },
    '3D':           { color: '#10b981', glow: 'rgba(16, 185, 129, 0.35)',  label: '3D',             icon: '3d_rotation', screen: '3D Projection' },
    '2D':           { color: '#9ca3af', glow: 'rgba(156, 163, 175, 0.2)',  label: 'Standard 2D',   icon: 'movie', screen: 'Standard Screen' },
};

const getFormatConfig = (format) => FORMAT_CONFIG[format] || FORMAT_CONFIG['2D'];

export default function SeatSelectionPage() {
    const { screeningId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { screening, selectedSeats, toggleSeat, seatTotal, bookingFee, grandTotal } = useCart();
    const [showAuth, setShowAuth] = useState(false);
    const [bookedSeatsSet, setBookedSeatsSet] = useState(new Set());
    const [loadingSeats, setLoadingSeats] = useState(true);

    const base = screening?.basePrice || 12;
    const sectionPrices = {
        premium: parseFloat((base * 1.5).toFixed(2)),
        standard: parseFloat((base * 0.85).toFixed(2)),
    };

    useEffect(() => {
        const loadSeats = async () => {
            if (!screeningId) return;
            try {
                const data = await fetchScreeningSeats(screeningId);
                setBookedSeatsSet(new Set(data.bookedSeats || []));
            } catch (error) {
                console.error('Failed to load booked seats', error);
            } finally {
                setLoadingSeats(false);
            }
        };
        loadSeats();
    }, [screeningId]);

    const [allSeats, setAllSeats] = useState({});

    useEffect(() => {
        let seatMap = {};
        SEAT_SECTIONS.forEach(s => {
            const price = sectionPrices[s.tier];
            const generated = generateSeats(s.rows, s.cols, s.key, price, bookedSeatsSet);
            generated.forEach(seat => { seatMap[seat.id] = seat; });
        });
        setAllSeats(seatMap);
    }, [bookedSeatsSet, base]);

    const isSelected = (seatId) => selectedSeats.some(s => s.id === seatId);

    const handleSeatClick = (seat) => {
        if (seat.status === 'occupied') return;
        toggleSeat(seat);
    };

    const handleCheckout = () => {
        if (selectedSeats.length === 0) {
            toast.error('Please select at least one seat');
            return;
        }
        if (!user) {
            setShowAuth(true);
            return;
        }
        navigate('/snacks');
    };

    const movie = screening?.movie || 'Select a Movie';
    const movieTime = screening ? `${screening.hall} | ${screening.date} · ${screening.time}` : 'No screening selected';
    const fmt = getFormatConfig(screening?.format);

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '3rem 1.5rem' }}>
            <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '3rem', alignItems: 'start' }}>

                {/* LEFT: Seat Map */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Breadcrumbs */}
                    <nav className="desktop-only" style={{ display: 'flex', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                        <span style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Home</span>
                        <span>/</span>
                        <span style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Movies</span>
                        <span>/</span>
                        <span style={{ color: 'white' }}>Seat Selection</span>
                    </nav>

                    {/* Title */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem' }}>
                        <div>
                            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1.1, color: 'white', fontFamily: 'var(--font-display)' }}>{movie}</h1>
                            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '1rem', fontWeight: 500 }}>{movieTime}</p>
                        </div>
                    </div>

                    {/* Format Banner */}
                    {screening?.format && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.5rem', background: 'rgba(212, 175, 55, 0.1)', border: `1px solid rgba(212, 175, 55, 0.22)`, borderRadius: '1.25rem' }}>
                            <span className="material-symbols-outlined" style={{ color: fmt.color, fontSize: '1.75rem' }}>{fmt.icon}</span>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontWeight: 900, fontSize: '1rem', color: fmt.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{fmt.label} Experience</p>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>{fmt.screen}</p>
                            </div>
                            <div className="desktop-only" style={{ background: 'var(--primary)', borderRadius: '0.75rem', padding: '0.4rem 1rem', fontSize: '0.85rem', fontWeight: 900, color: 'white', boxShadow: '0 4px 10px rgba(212,175,55,0.3)' }}>${screening.basePrice?.toFixed(2)} BASE</div>
                        </div>
                    )}

                    {/* Seat Map Area */}
                    <div className="seat-container" style={{ background: 'rgba(18, 2, 4, 0.4)', borderRadius: '2rem', padding: '4rem 2rem', border: `1px solid rgba(212, 175, 55, 0.15)`, boxShadow: `0 30px 60px rgba(0, 0, 0, 0.6)`, position: 'relative', overflow: 'auto', opacity: loadingSeats ? 0.5 : 1, transition: 'opacity 0.3s' }}>
                        {loadingSeats && (
                            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(8,5,6,0.85)', zIndex: 10 }}>
                                <span style={{ color: 'white', fontWeight: 800, fontFamily: 'var(--font-accent)', letterSpacing: '0.1em' }}>LOADING THEATRE MAP...</span>
                            </div>
                        )}
                        
                        {/* Curved Screen projection */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '5rem' }}>
                            <div className="screen-curve" style={{ width: '85%', maxWidth: '800px' }} />
                            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.4em', color: fmt.color, fontWeight: 900, marginTop: '1.25rem', opacity: 0.8 }}>{fmt.screen}</span>
                        </div>

                        {/* Seat Grid - 2x2 layout */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) minmax(280px, 1fr)', gap: '3rem 4rem', width: 'fit-content', margin: '0 auto' }}>
                            {SEAT_SECTIONS.map(section => (
                                <div key={section.key}>
                                    <p style={{ fontSize: '0.75rem', color: section.tier === 'premium' ? '#f59e0b' : 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'center', marginBottom: '1rem', letterSpacing: '0.1em', fontWeight: 900 }}>
                                        {section.label}
                                    </p>
                                    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${section.cols}, 1fr)`, gap: '0.6rem' }}>
                                        {section.rows.flatMap(row =>
                                            Array.from({ length: section.cols }, (_, ci) => {
                                                const seatId = `${section.key}-${row}-${ci + 1}`;
                                                const seat = allSeats[seatId];
                                                if (!seat) return null;
                                                const selected = isSelected(seatId);
                                                const occupied = seat.status === 'occupied';
                                                return (
                                                    <div key={seatId}
                                                        className={`seat ${occupied ? 'occupied' : selected ? 'selected' : 'available'}`}
                                                        onClick={() => handleSeatClick(seat)}
                                                        style={{ width: '1.85rem', height: '1.85rem' }}
                                                        title={occupied ? 'Occupied' : selected ? `Selected — $${seat.price}` : `${seat.label} — $${seat.price}`}
                                                    />
                                                );
                                            })
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Legend */}
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginTop: '5rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                            {[
                                { class: 'available', label: 'Available' },
                                { class: 'occupied', label: 'Occupied' },
                                { class: 'selected', label: 'Selected' },
                            ].map(({ class: cls, label }) => (
                                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div className={`seat ${cls}`} style={{ width: '1.25rem', height: '1.25rem', cursor: 'default' }} />
                                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT: Order Summary Sidebar */}
                <div className="sidebar-fixed" style={{ position: 'sticky', top: '96px' }}>
                    <div className="glass-card" style={{ padding: '2.25rem', border: '1px solid rgba(225, 29, 72, 0.25)', boxShadow: '0 30px 60px rgba(0,0,0,0.6)' }}>
                        {/* Movie info */}
                        <div style={{ display: 'flex', gap: '1.25rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '1.5rem' }}>
                            {screening?.poster && (
                                <img src={screening.poster} alt={movie} style={{ width: '80px', height: '115px', objectFit: 'cover', borderRadius: '0.75rem', boxShadow: '0 10px 25px rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.06)' }} />
                            )}
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.2rem' }}>
                                <h3 style={{ fontWeight: 900, fontSize: '1.25rem', lineHeight: 1.2, color: '#fff', fontFamily: 'var(--font-display)', margin: 0 }}>{movie}</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>English · {screening?.format || '2D'}</p>
                                <p style={{ color: fmt.color, fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>{fmt.label} EXPERIENCE</p>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <h4 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-muted)', margin: 0 }}>Order Summary</h4>
                            
                            {selectedSeats.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '2.5rem 0', color: 'var(--text-muted)' }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem', opacity: 0.3 }}>event_seat</span>
                                    <p style={{ fontSize: '0.9rem', fontWeight: 500, margin: 0 }}>No seats selected yet</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                    {selectedSeats.map(seat => (
                                        <div key={seat.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.95rem', fontWeight: 600 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: '1.15rem' }}>event_seat</span>
                                                <span style={{ color: 'white' }}>{seat.label}</span>
                                            </div>
                                            <span style={{ color: 'white', fontFamily: 'var(--font-mono)' }}>${seat.price.toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div style={{ paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                                    <span>Subtotal</span><span style={{ color: 'white', fontFamily: 'var(--font-mono)' }}>${seatTotal.toFixed(2)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                                    <span>Booking Fee</span><span style={{ color: 'white', fontFamily: 'var(--font-mono)' }}>${bookingFee.toFixed(2)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.6rem', fontWeight: 900, paddingTop: '0.75rem', color: 'white', fontFamily: 'var(--font-display)', letterSpacing: '0.02em', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                                    <span>Total</span>
                                    <span style={{ color: 'var(--primary)' }}>${(seatTotal + bookingFee).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* CTA */}
                        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <button onClick={handleCheckout} className="btn-primary" style={{ width: '100%', height: '56px', fontSize: '1rem', borderRadius: '1rem', gap: '0.75rem' }}>
                                {user ? (
                                    <>
                                        <span className="material-symbols-outlined">restaurant</span>
                                        Continue to Snacks
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined">login</span>
                                        Sign In to Checkout
                                    </>
                                )}
                            </button>
                            <p style={{ fontSize: '0.75rem', textAlign: 'center', color: 'var(--text-muted)', lineHeight: 1.6, fontWeight: 500, margin: 0 }}>
                                By proceeding, you agree to our Terms of Service. All sales are final.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {showAuth && (
                <AuthModal
                    initialMode="login"
                    onClose={() => setShowAuth(false)}
                    onSuccess={() => { setShowAuth(false); navigate('/snacks'); }}
                />
            )}
        </div>
    );
}
