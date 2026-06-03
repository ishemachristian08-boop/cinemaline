import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HALLS = [
    {
        id: 'hall-imax',
        name: 'IMAX® Theatre',
        format: 'IMAX',
        capacity: 250,
        screen: '26m × 19m Giant Screen',
        sound: 'IMAX 12-channel Surround',
        features: ['Premium Recliners', 'Laser Projection', 'Immersive Sound', 'VIP Lounge Access'],
        color: '#e11d48',
        icon: 'panorama_wide_angle',
        badge: 'Flagship Experience',
        image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=400&fit=crop',
    },
    {
        id: 'hall-dolby',
        name: 'Dolby Cinema',
        format: 'Dolby Cinema',
        capacity: 180,
        screen: 'Dolby Vision Dual Laser',
        sound: 'Dolby Atmos 64-channel',
        features: ['Power Recliners', 'Dual Laser Projector', 'Spatial Audio', 'Reserved Seating'],
        color: '#9f1239',
        icon: 'speaker',
        badge: 'Crystal Clear Audio',
        image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&h=400&fit=crop',
    },
    {
        id: 'hall-4dx',
        name: '4DX Experience',
        format: '4DX',
        capacity: 120,
        screen: '4DX Motion Enhanced',
        sound: '7.1 High-Fidelity',
        features: ['Motion Seats', 'Environmental Effects', 'Scent Technology', 'Strobe Lighting'],
        color: '#f59e0b',
        icon: 'wind_power',
        badge: 'Full Sensory',
        image: 'https://images.unsplash.com/photo-1500461706-0a75aca86d87?w=800&h=400&fit=crop',
    },
    {
        id: 'hall-3',
        name: 'Prime 3D',
        format: '3D',
        capacity: 200,
        screen: 'RealD 3D Digital',
        sound: '5.1 Digital Surround',
        features: ['Active 3D Tech', 'Luxury Seating', 'Optimized Sightlines', 'Family Preferred'],
        color: '#e11d48',
        icon: '3d_rotation',
        badge: 'Best Value',
        image: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=800&h=400&fit=crop',
    },
    {
        id: 'hall-4',
        name: 'Standard Digital',
        format: '2D',
        capacity: 220,
        screen: 'Digital 2D Cinema',
        sound: 'Dolby Digital 5.1',
        features: ['Signature Seating', 'Laser Projection', 'Aisle Access', 'Essential Cinema'],
        color: '#4b5563',
        icon: 'movie',
        badge: 'The Classic',
        image: 'https://images.unsplash.com/photo-1567593810070-7a3d471af022?w=800&h=400&fit=crop',
    },
];

const AMENITIES = [
    { icon: 'local_parking', label: 'Valet Parking', desc: 'Secure underground parking with valet service' },
    { icon: 'restaurant', label: 'Gourmet Dining', desc: 'Curated menu with 12 premium dining options' },
    { icon: 'accessible', label: 'Full Access', desc: 'ADA compliant seating and assistive audio' },
    { icon: 'child_care', label: 'Kids Lounge', desc: 'Supervised entertainment for younger visitors' },
    { icon: 'wifi', label: 'High-Speed WiFi', desc: 'Gigabit fiber connectivity throughout the lobby' },
    { icon: 'local_atm', label: 'Swift Concierge', desc: 'Automated kiosks for rapid ticketing' },
];

export default function CinemasPage() {
    const [selectedHall, setSelectedHall] = useState(HALLS[0]);
    const navigate = useNavigate();

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '4rem 1.5rem' }}>
            <style>{`
                @keyframes fadeIn { from { opacity:0; transform:translateY(20px);} to { opacity:1; transform:translateY(0);} }
                .hall-card { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer; }
                .hall-card:hover { transform: translateY(-5px); border-color: #e11d48 !important; }
                .tab-btn:hover { background: rgba(225, 29, 72, 0.1) !important; color: #e11d48 !important; }
            `}</style>

            {/* Page Header */}
            <div style={{ marginBottom: '4rem', animation: 'fadeIn 0.8s ease-out' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(225, 29, 72, 0.15)', border: '1px solid rgba(225, 29, 72, 0.3)', borderRadius: '999px', padding: '0.5rem 1.25rem', marginBottom: '1.5rem' }}>
                    <span className="material-symbols-outlined" style={{ color: '#e11d48', fontSize: '1.2rem' }}>theater_comedy</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#e11d48', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Our Premium Screens</span>
                </div>
                <h1 style={{ fontSize: 'clamp(3rem, 8vw, 4.5rem)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 0.9, marginBottom: '1.5rem', fontFamily: 'var(--font-display)', color: 'white' }}>
                    WORLD-CLASS<br />
                    <span style={{ color: '#e11d48', textShadow: '0 0 30px rgba(225, 29, 72, 0.3)' }}>CINEMA HALLS</span>
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.2rem', lineHeight: 1.6, maxWidth: '650px', fontWeight: 500 }}>
cinemaline sets the standard for cinematic excellence.
                </p>
            </div>

            {/* Hall Selector Grid */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
                {HALLS.map(hall => (
                    <button key={hall.id} onClick={() => setSelectedHall(hall)} className="tab-btn"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1.75rem', borderRadius: '999px', border: `2px solid ${selectedHall.id === hall.id ? hall.color : 'rgba(255,255,255,0.1)'}`, background: selectedHall.id === hall.id ? 'white' : 'rgba(255,255,255,0.05)', color: selectedHall.id === hall.id ? '#000' : 'rgba(255,255,255,0.5)', cursor: 'pointer', fontWeight: 900, fontSize: '0.9rem', transition: 'all 0.3s' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '1.25rem', color: selectedHall.id === hall.id ? hall.color : 'inherit' }}>{hall.icon}</span>
                        {hall.name.toUpperCase()}
                    </button>
                ))}
            </div>

            {/* Selected Hall Detail */}
            <div key={selectedHall.id} style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '3rem', marginBottom: '5rem', animation: 'fadeIn 0.6s ease-out' }}>
                {/* Left: image + details */}
                <div>
                    <div style={{ position: 'relative', borderRadius: '2rem', overflow: 'hidden', marginBottom: '2.5rem', height: '450px', boxShadow: '0 30px 60px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <img src={selectedHall.image} alt={selectedHall.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, rgba(18, 1, 1, 0.9) 0%, transparent 60%)` }} />
                        
                        <div style={{ position: 'absolute', top: '2rem', left: '2rem', display: 'flex', gap: '1rem' }}>
                            <span style={{ background: selectedHall.color, color: 'white', borderRadius: '0.75rem', padding: '0.5rem 1.25rem', fontSize: '0.9rem', fontWeight: 900, boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}>{selectedHall.format}</span>
                            <span style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '0.75rem', padding: '0.5rem 1.25rem', fontSize: '0.9rem', fontWeight: 800, color: 'white' }}>{selectedHall.badge}</span>
                        </div>
                        <div style={{ position: 'absolute', bottom: '2.5rem', left: '2.5rem' }}>
                            <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '0.5rem', fontFamily: 'var(--font-display)', color: 'white' }}>{selectedHall.name}</h2>
                            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem', fontWeight: 600 }}>{selectedHall.screen}</p>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                        {selectedHall.features.map(f => (
                            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1.25rem', padding: '1.25rem 1.5rem' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(225, 29, 72, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <span className="material-symbols-outlined" style={{ color: '#e11d48', fontSize: '1.25rem', fontWeight: 900 }}>check</span>
                                </div>
                                <span style={{ fontSize: '1rem', fontWeight: 700, color: 'white' }}>{f}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Spec Card */}
                <div style={{ position: 'sticky', top: '100px' }}>
                    <div className="glass-card" style={{ padding: '2.5rem', boxShadow: '0 40px 100px rgba(0,0,0,0.4)' }}>
                        <h3 style={{ fontSize: '0.85rem', fontWeight: 900, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '2rem' }}>TECHNICAL SPECIFICATIONS</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {[
                                { label: 'Viewing Format', value: selectedHall.format, icon: selectedHall.icon },
                                { label: 'Guest Capacity', value: `${selectedHall.capacity} Premium Seats`, icon: 'groups' },
                                { label: 'Acoustic Array', value: selectedHall.sound, icon: 'surround_sound' },
                                { label: 'Optics', value: selectedHall.screen, icon: 'visibility' },
                            ].map(({ label, value, icon }) => (
                                <div key={label} style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ width: '52px', height: '52px', borderRadius: '1rem', background: 'rgba(225, 29, 72, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <span className="material-symbols-outlined" style={{ color: '#e11d48', fontSize: '1.5rem' }}>{icon}</span>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.25rem', fontWeight: 800 }}>{label.toUpperCase()}</p>
                                        <p style={{ fontSize: '1.1rem', fontWeight: 950, color: 'white' }}>{value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button className="btn-primary" style={{ width: '100%', height: '64px', fontSize: '1.1rem', marginTop: '1.5rem', borderRadius: '1.25rem' }} onClick={() => navigate('/')}>
                            <span className="material-symbols-outlined">confirmation_number</span>
                            EXPLORE SCREENINGS
                        </button>
                    </div>
                </div>
            </div>

            {/* Compare All Halls */}
            <div style={{ marginBottom: '6rem' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '2rem', fontFamily: 'var(--font-display)', color: 'white' }}>THE COMPLETE CATALOG</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
                    {HALLS.map(hall => (
                        <div key={hall.id} onClick={() => setSelectedHall(hall)} className="hall-card"
                            style={{ background: 'rgba(255,255,255,0.03)', border: `2px solid ${selectedHall.id === hall.id ? '#e11d48' : 'rgba(255,255,255,0.08)'}`, borderRadius: '1.5rem', padding: '1.75rem', cursor: 'pointer', boxShadow: selectedHall.id === hall.id ? `0 15px 30px rgba(225, 29, 72, 0.2)` : 'none' }}>
                            <div style={{ width: '56px', height: '56px', borderRadius: '1rem', background: 'rgba(225, 29, 72, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                                <span className="material-symbols-outlined" style={{ color: '#e11d48', fontSize: '1.75rem' }}>{hall.icon}</span>
                            </div>
                            <h4 style={{ fontWeight: 900, fontSize: '1.2rem', marginBottom: '0.4rem', color: 'white' }}>{hall.name}</h4>
                            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', marginBottom: '1.25rem', fontWeight: 600 }}>{hall.capacity} EXCLUSIVE SEATS</p>
                            <span style={{ background: hall.color, color: 'white', borderRadius: '0.5rem', padding: '0.35rem 0.75rem', fontSize: '0.8rem', fontWeight: 900 }}>{hall.format}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Amenities Section */}
            <div style={{ padding: '5rem', background: '#1e0202', borderRadius: '3rem', border: '1px solid rgba(225, 29, 72, 0.2)', boxShadow: '0 40px 100px rgba(0,0,0,0.4)' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1rem', fontFamily: 'var(--font-display)', color: 'white' }}>SIGNATURE AMENITIES</h2>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.25rem', fontWeight: 500 }}>Excellence beyond the screen. Every visit is a premium experience.</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                    {AMENITIES.map(a => (
                        <div key={a.label} style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1.5rem', padding: '2rem' }}>
                            <div style={{ width: '60px', height: '60px', borderRadius: '1.25rem', background: 'rgba(225, 29, 72, 0.1)', border: '1px solid rgba(225, 29, 72, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <span className="material-symbols-outlined" style={{ color: '#e11d48', fontSize: '2rem' }}>{a.icon}</span>
                            </div>
                            <div>
                                <h4 style={{ fontWeight: 900, color: 'white', marginBottom: '0.5rem', fontSize: '1.1rem' }}>{a.label.toUpperCase()}</h4>
                                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.95rem', lineHeight: 1.6, fontWeight: 500 }}>{a.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
