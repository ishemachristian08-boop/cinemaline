import React, { useState } from 'react';

const SCREENINGS = [
    { hall: 'Hall 01 — IMAX', movies: [{ title: 'Dune: Part Two', start: '10:00', end: '12:45', left: 40, width: 250 }, { title: 'Dune: Part Two', start: '14:30', end: '17:15', left: 350, width: 250 }, { title: 'Dune: Part Two', start: '19:00', end: '21:45', left: 650, width: 250 }] },
    { hall: 'Hall 02 — 2D', movies: [{ title: 'Oppenheimer', start: '11:00', end: '14:00', left: 100, width: 280 }, { title: 'The Dark Knight', start: '16:00', end: '18:30', left: 450, width: 230 }, { title: 'Oppenheimer', start: '20:15', end: '23:15', left: 750, width: 280 }] },
    { hall: 'Hall 03 — 2D', movies: [{ title: 'Interstellar', start: '13:00', end: '15:50', left: 220, width: 260 }, { title: 'Poor Things', start: '18:00', end: '20:20', left: 550, width: 220 }] },
];

const ACTIONS = [
    { icon: 'payments', title: 'Update Pricing', desc: 'Modify tier rates across all halls.' },
    { icon: 'add_to_photos', title: 'Add Movie', desc: 'CMS entry for new releases & posters.' },
    { icon: 'bar_chart_4_bars', title: 'Sales Report', desc: 'Export PDF of daily performance.' },
];

const ACTIVITY = [
    { user: 'Sarah J.', action: 'Booked Hall 01', seats: 'H12, H13', time: 'Just now' },
    { user: 'System', action: 'Hall 03 Cleaned', seats: null, time: '5m ago' },
    { user: 'Mike T.', action: 'Snacks Collected', seats: 'Order #A1B2', time: '12m ago' },
    { user: 'System', action: 'Low Stock Alert', seats: 'Popcorn Kernels', time: '22m ago' },
];

export default function AdminOperational() {
    const [activeTab, setActiveTab] = useState('Scheduling');

    return (
        <div style={{ display: 'flex', height: '100vh', background: '#120101', overflow: 'hidden', color: 'white' }}>
            <aside style={{ width: '260px', flexShrink: 0, background: '#1e0202', borderRight: '1px solid rgba(225, 29, 72, 0.15)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(225, 29, 72, 0.15)', display: 'flex', alignItems: 'center', gap: '1rem', height: '72px' }}>
                    <div style={{ flexShrink: 0, width: '40px', height: '40px', borderRadius: '0.75rem', background: 'linear-gradient(135deg, #e11d48, #9f1239)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(225, 29, 72, 0.3)' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '1.5rem', color: 'white' }}>theaters</span>
                    </div>
                    <span style={{ fontWeight: 900, fontSize: '1.1rem', fontFamily: 'var(--font-display)', letterSpacing: '0.02em' }}>CINEMALINE <span style={{ color: '#e11d48' }}>HQ</span></span>
                </div>
                <nav style={{ padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {['Dashboard', 'Analytics', 'Scheduling', 'Ticketing', 'Settings'].map(label => (
                        <button key={label} onClick={() => setActiveTab(label)} style={{
                            display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.85rem 1rem',
                            borderRadius: '1rem', border: 'none', cursor: 'pointer', textAlign: 'left',
                            background: activeTab === label ? 'rgba(225, 29, 72, 0.15)' : 'transparent',
                            color: activeTab === label ? '#e11d48' : 'rgba(255,255,255,0.4)',
                            fontWeight: 800, fontSize: '0.9rem', transition: 'all 0.2s', fontFamily: 'var(--font-accent)',
                        }}>{label.toUpperCase()}</button>
                    ))}
                </nav>
            </aside>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <header style={{ height: '72px', borderBottom: '1px solid rgba(225, 29, 72, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2.5rem', background: 'rgba(18, 1, 1, 0.8)', backdropFilter: 'blur(20px)' }}>
                    <div>
                        <h2 style={{ fontWeight: 900, fontSize: '1.25rem', fontFamily: 'var(--font-display)', letterSpacing: '0.02em' }}>OPERATIONAL CONTROL</h2>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontWeight: 600 }}>REAL-TIME THEATRE MANAGEMENT</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', fontWeight: 700 }}>21 FEB 2024</span>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #e11d48, #9f1239)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, boxShadow: '0 4px 12px rgba(225, 29, 72, 0.4)' }}>A</div>
                    </div>
                </header>

                <div style={{ flex: 1, overflowY: 'auto', padding: '2.5rem', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2.5rem' }}>
                    <main style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                        <section>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '1.5rem', fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}>QUICK COMMANDS</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                                {ACTIONS.map(a => (
                                    <div key={a.title} className="glass-card" style={{ background: '#1e0202', border: '1px solid rgba(225, 29, 72, 0.15)', padding: '1.75rem', cursor: 'pointer', transition: 'transform 0.3s' }}>
                                        <div style={{ width: '48px', height: '48px', borderRadius: '0.75rem', background: 'rgba(225, 29, 72, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                                            <span className="material-symbols-outlined" style={{ color: '#e11d48', fontSize: '1.75rem' }}>{a.icon}</span>
                                        </div>
                                        <h4 style={{ fontWeight: 900, fontSize: '1rem', marginBottom: '0.5rem', color: 'white' }}>{a.title.toUpperCase()}</h4>
                                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', lineHeight: 1.5, fontWeight: 500 }}>{a.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section style={{ background: '#1e0202', border: '1px solid rgba(225, 29, 72, 0.15)', borderRadius: '1.5rem', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
                            <div style={{ padding: '1.5rem 2rem', background: 'rgba(225, 29, 72, 0.05)', borderBottom: '1px solid rgba(225, 29, 72, 0.15)' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 900, fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}>SCREENING BOARD</h3>
                            </div>
                            <div style={{ overflowX: 'auto' }}>
                                <div style={{ minWidth: '1000px' }}>
                                    <div style={{ display: 'flex', borderBottom: '1px solid rgba(225, 29, 72, 0.15)', background: 'rgba(255,255,255,0.02)' }}>
                                        <div style={{ width: '200px', flexShrink: 0, padding: '1rem 1.5rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', fontWeight: 800, textTransform: 'uppercase' }}>HALL / TIME</div>
                                        <div style={{ flex: 1, display: 'flex' }}>
                                            {['10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'].map(t => (
                                                <div key={t} style={{ flex: 1, padding: '1rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)', fontWeight: 700, textAlign: 'left', borderLeft: '1px solid rgba(225, 29, 72, 0.1)' }}>{t}</div>
                                            ))}
                                        </div>
                                    </div>
                                    {SCREENINGS.map(h => (
                                        <div key={h.hall} style={{ display: 'flex', borderBottom: '1px solid rgba(225, 29, 72, 0.1)', height: '120px' }}>
                                            <div style={{ width: '200px', flexShrink: 0, padding: '2rem 1.5rem', background: 'rgba(255,255,255,0.01)', borderRight: '1px solid rgba(225, 29, 72, 0.15)' }}>
                                                <h4 style={{ fontSize: '0.9rem', fontWeight: 900, color: 'white' }}>{h.hall.toUpperCase()}</h4>
                                            </div>
                                            <div style={{ flex: 1, position: 'relative', background: 'repeating-linear-gradient(90deg, transparent, transparent 142px, rgba(225, 29, 72, 0.05) 142px, rgba(225, 29, 72, 0.05) 143px)' }}>
                                                {h.movies.map((m, i) => (
                                                    <div key={i} style={{
                                                        position: 'absolute', top: '20px', left: `${m.left}px`, width: `${m.width}px`, height: '80px',
                                                        background: 'rgba(18, 1, 1, 0.95)', borderLeft: '5px solid #e11d48', borderRadius: '0.75rem',
                                                        padding: '1rem', boxShadow: '0 15px 30px rgba(0,0,0,0.5)', cursor: 'grab',
                                                        display: 'flex', flexDirection: 'column', justifyContent: 'center', border: '1px solid rgba(225, 29, 72, 0.2)', borderLeftWidth: '5px'
                                                    }}>
                                                        <h5 style={{ fontSize: '0.85rem', fontWeight: 900, marginBottom: '0.25rem', color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.title}</h5>
                                                        <p style={{ fontSize: '0.75rem', color: '#e11d48', fontWeight: 800 }}>{m.start} — {m.end}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </main>

                    <aside style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                        <section style={{ background: '#1e0202', border: '1px solid rgba(225, 29, 72, 0.15)', borderRadius: '1.5rem', padding: '1.75rem', boxShadow: '0 15px 40px rgba(0,0,0,0.2)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
                                <div style={{ width: '10px', height: '100%', background: '#e11d48', borderRadius: '2px' }} />
                                <h3 style={{ fontSize: '1rem', fontWeight: 900, fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}>LIVE FEED</h3>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                {ACTIVITY.map((a, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem' }}>
                                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#e11d48', marginTop: '0.4rem', flexShrink: 0, boxShadow: '0 0 10px rgba(225, 29, 72, 0.5)' }} />
                                        <div style={{ flex: 1 }}>
                                            <p><strong style={{ color: 'white', fontWeight: 800 }}>{a.user}</strong> <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>{a.action}</span></p>
                                            {a.seats && <p style={{ fontSize: '0.75rem', color: '#e11d48', marginTop: '0.2rem', fontWeight: 800 }}>{a.seats}</p>}
                                            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', marginTop: '0.4rem', fontWeight: 700 }}>{a.time.toUpperCase()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button style={{ width: '100%', marginTop: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}>VIEW ALL LOGS</button>
                        </section>
                    </aside>
                </div>
            </div>
        </div>
    );
}
