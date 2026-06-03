import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Icon from '../components/Icon';


// ─── Data ─────────────────────────────────────────────────────────────────────

const OFFERS = [
    {
        id: 'matinee-magic',
        category: 'Daily Deal',
        title: 'MATINEE MAGIC',
        subtitle: 'Every show before 4 PM',
        description: 'Save 15% on all tickets for any screening starting before 4:00 PM. Includes all formats — even IMAX and Dolby Cinema.',
        discount: '15% OFF',
        discountType: 'auto',
        code: null,
        color: '#e11d48',
        icon: 'wb_sunny',
        badge: 'AUTO-APPLIED',
        badgeColor: '#22c55e',
        expiry: 'Applied automatically',
        terms: 'Valid Monday–Sunday on all formats. Discount applied at seat selection.',
    },
    {
        id: 'combo-saver',
        category: 'Bundle Deal',
        title: 'FAMILY COMBO SAVER',
        subtitle: '4 tickets + popcorn + drinks',
        description: 'Book 4 tickets in a single order and get a free Large Popcorn combo (2 popcorns + 2 large drinks) added automatically.',
        discount: 'FREE COMBO',
        discountType: 'code',
        code: 'FAMILY4',
        color: '#9f1239',
        icon: 'family_restroom',
        badge: 'USE CODE',
        badgeColor: '#e11d48',
        expiry: 'Valid until 31 May 2026',
        terms: 'Minimum 4 tickets in a single booking. One combo per order. Cannot be combined with other offers.',
    },
    {
        id: 'student-pass',
        category: 'Member Exclusive',
        title: 'STUDENT PASS',
        subtitle: 'Valid student ID required',
        description: 'Students get 20% off all Standard 2D and 3D screenings. Show your student ID at the kiosk before collecting tickets.',
        discount: '20% OFF',
        discountType: 'code',
        code: 'STUDENT20',
        color: '#f59e0b',
        icon: 'school',
        badge: 'MEMBERS ONLY',
        badgeColor: '#f59e0b',
        expiry: 'Valid until 31 Dec 2026',
        terms: 'Must present valid student ID. Valid on 2D and 3D screenings only. Not valid on IMAX, Dolby, or 4DX.',
    },
    {
        id: 'imax-premiere',
        category: 'Premium',
        title: 'IMAX PREMIERE NIGHT',
        subtitle: 'Every Friday after 7 PM',
        description: 'Experience IMAX on Friday evenings at a special flat rate. Includes a complimentary drink at the premium lounge bar.',
        discount: 'FLAT $18',
        discountType: 'code',
        code: 'IMAXFRI',
        color: '#e11d48',
        icon: 'panorama_wide_angle',
        badge: 'FRIDAY ONLY',
        badgeColor: '#e11d48',
        expiry: 'Ongoing Promotion',
        terms: 'Valid for Friday screenings after 7 PM only. One drink per ticket. While stocks last.',
    },
    {
        id: 'birthday-special',
        category: 'Celebration',
        title: 'BIRTHDAY SPECIAL',
        subtitle: 'On your birthday month',
        description: 'Celebrate your birthday with a free ticket! One complimentary standard ticket when you book any premium format ticket in your birthday month.',
        discount: 'FREE TICKET',
        discountType: 'code',
        code: 'BDAY2026',
        color: '#be123c',
        icon: 'celebration',
        badge: 'BIRTH MONTH',
        badgeColor: '#be123c',
        expiry: 'Valid per account',
        terms: 'Requires account with birthday on file. One free 2D ticket per account per year. Must be used in the same calendar month as your birthday.',
    },
    {
        id: 'loyalty-points',
        category: 'Loyalty',
        title: 'OMNIREWARDS POINTS',
        subtitle: 'Earn on every booking',
        description: 'Earn 10 OmniPoints per dollar spent. Redeem 500 points for a free standard ticket. Double points on IMAX and Dolby bookings.',
        discount: '2× POINTS',
        discountType: 'loyalty',
        code: null,
        color: '#e11d48',
        icon: 'stars',
        badge: 'LAUNCHING SOON',
        badgeColor: '#6b7280',
        expiry: 'Program starts Q3 2026',
        terms: 'OmniRewards loyalty program. Points earned from account launch date. No cash value.',
        comingSoon: true,
    },
];

const CATEGORIES = ['ALL', 'DAILY DEAL', 'BUNDLE DEAL', 'MEMBER EXCLUSIVE', 'PREMIUM', 'CELEBRATION', 'LOYALTY'];

// ─── Copy Code Component ─────────────────────────────────────────────────────
const CopyButton = ({ code }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(code).catch(() => {});
        setCopied(true);
        toast.success(`Code "${code}" copied!`);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button onClick={handleCopy} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: copied ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.05)', border: `1px solid ${copied ? '#22c55e' : 'rgba(255,255,255,0.1)'}`, borderRadius: '0.875rem', padding: '0.6rem 1.25rem', color: copied ? '#22c55e' : 'white', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 800, fontFamily: 'var(--font-mono)', transition: 'all 0.2s' }}>
            <Icon
                name={copied ? 'success' : 'save'}
                ariaLabel={copied ? 'Copied' : 'Copy code'}
                size="btn"
                style={{ fontSize: '1.25rem' }}
            />
            {copied ? 'COPIED!' : code}

        </button>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function OffersPage() {
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [expandedOffer, setExpandedOffer] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    const filtered = selectedCategory === 'ALL'
        ? OFFERS
        : OFFERS.filter(o => o.category.toUpperCase() === selectedCategory);

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '4rem 1.5rem' }}>
            <style>{`
                @keyframes fadeIn { from { opacity:0; transform:translateY(20px);} to { opacity:1; transform:translateY(0);} }
                @keyframes shimmer { 0%,100% { opacity:0.4; } 50% { opacity:0.8; } }
                .offer-card { transition: all 0.4s cubic-bezier(0.4,0,0.2,1); }
                .offer-card:hover { transform: translateY(-8px); border-color: #e11d48 !important; }
            `}</style>

            {/* Hero Banner */}
            <div style={{ background: 'linear-gradient(135deg, #1e0202 0%, #120101 100%)', borderRadius: '2.5rem', padding: '4rem', marginBottom: '4rem', position: 'relative', overflow: 'hidden', border: '1px solid rgba(225, 29, 72, 0.2)', animation: 'fadeIn 0.8s ease-out', boxShadow: '0 40px 100px rgba(0,0,0,0.6)' }}>
                <div style={{ position: 'absolute', top: '-100px', right: '-50px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(225, 29, 72, 0.15) 0%, transparent 70%)' }} />
                <div style={{ position: 'absolute', bottom: '-50px', left: '20%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(225, 29, 72, 0.1) 0%, transparent 70%)' }} />
                
                <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2.5rem' }}>
                    <div style={{ flex: '1 1 500px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(225, 29, 72, 0.2)', border: '1px solid rgba(225, 29, 72, 0.4)', borderRadius: '999px', padding: '0.6rem 1.5rem', marginBottom: '1.5rem' }}>
                            <Icon name="favorites" ariaLabel="Exclusive deals" size="btn" className="" />
                            <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#e11d48', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Exclusive Member Deals</span>
                        </div>

                        <h1 style={{ fontSize: 'clamp(3rem, 8vw, 4.5rem)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 0.9, marginBottom: '1.5rem', fontFamily: 'var(--font-display)', color: 'white' }}>
                            SAVE MORE,<br />
                            <span style={{ color: '#e11d48', textShadow: '0 0 30px rgba(225, 29, 72, 0.3)' }}>WATCH MORE</span>
                        </h1>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.25rem', lineHeight: 1.6, maxWidth: '500px', fontWeight: 500 }}>
                            Unlock the ultimate cinema experience with our curated seasonal offers. From matinee specials to premium format bundle deals.
                        </p>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', minWidth: '280px' }}>
                        {[
                            { icon: 'local_activity', label: `${OFFERS.filter(o => !o.comingSoon).length} ACTIVE PROMOTIONS`, color: '#22c55e' },
                            { icon: 'stars', label: 'OMNIREWARDS STATUS: LIVE', color: '#f59e0b' },
                        ].map(({ icon, label, color }) => (
                            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1.25rem', padding: '1rem 1.5rem' }}>
                                <Icon name="dashboard" ariaLabel={label} size="btn" style={{ color, fontSize: '1.5rem' }} />
                                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'white', letterSpacing: '0.02em' }}>{label}</span>

                            </div>
                        ))}
                        {!user && (
                            <button onClick={() => navigate('/')} className="btn-primary" style={{ height: '64px', fontSize: '1.1rem' }} aria-label="Sign in for member deals">
                                <Icon name="login" ariaLabel="Sign in" size="btn" />
                                SIGN IN FOR MEMBER DEALS
                            </button>

                        )}
                    </div>
                </div>
            </div>

            {/* Category Filter */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '3rem', justifyContent: 'center' }}>
                {CATEGORIES.map(cat => (
                    <button key={cat} onClick={() => setSelectedCategory(cat)} style={{ padding: '0.85rem 1.75rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 900, cursor: 'pointer', border: selectedCategory === cat ? '2px solid #e11d48' : '1px solid rgba(255,255,255,0.1)', background: selectedCategory === cat ? '#e11d48' : 'rgba(255,255,255,0.03)', color: 'white', transition: 'all 0.3s', letterSpacing: '0.1em' }}>
                        {cat}
                    </button>
                ))}
            </div>

            {/* Offers Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '2rem', marginBottom: '6rem' }}>
                {filtered.map(offer => (
                    <div key={offer.id} className="offer-card"
                        style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${expandedOffer === offer.id ? '#e11d48' : 'rgba(255,255,255,0.1)'}`, borderRadius: '2rem', overflow: 'hidden', opacity: offer.comingSoon ? 0.6 : 1, position: 'relative' }}>

                        {/* Visual accent */}
                        <div style={{ height: '8px', background: offer.color }} />

                        <div style={{ padding: '2.5rem' }}>
                            {/* Header row */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                                    <div style={{ width: '60px', height: '60px', borderRadius: '1.25rem', background: `${offer.color}15`, border: `1px solid ${offer.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <Icon name="ticket" ariaLabel="Offer" size="xl" className="" style={{ color: offer.color }} />
                                    </div>

                                    <div>
                                        <p style={{ fontSize: '0.75rem', fontWeight: 900, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.4rem' }}>{offer.category}</p>
                                        <h3 style={{ fontWeight: 900, fontSize: '1.5rem', fontFamily: 'var(--font-display)', color: 'white', lineHeight: 1.1 }}>{offer.title}</h3>
                                    </div>
                                </div>
                                {/* Discount badge */}
                                <div style={{ background: offer.color, borderRadius: '0.75rem', padding: '0.5rem 1rem', textAlign: 'center', flexShrink: 0, boxShadow: `0 8px 20px ${offer.color}30` }}>
                                    <span style={{ fontSize: '0.9rem', fontWeight: 900, color: 'white' }}>{offer.discount}</span>
                                </div>
                            </div>

                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.5rem', fontWeight: 500 }}>{offer.description}</p>

                            {/* Status badges */}
                            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                                <span style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', borderRadius: '0.5rem', padding: '0.35rem 0.75rem', fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.05em' }}>{offer.badge}</span>
                                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
                                    <Icon name="calendar" ariaLabel="Offer expiry" size="sm" />
                                    {offer.expiry.toUpperCase()}

                                </span>
                            </div>

                            {/* Actions */}
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                {offer.code && !offer.comingSoon && <CopyButton code={offer.code} />}
                                {offer.discountType === 'auto' && (
                                    <span style={{ fontSize: '0.9rem', color: '#22c55e', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Icon name="success" ariaLabel="Auto-applied" size="btn" />
                                        AUTO-APPLIED AT CHECKOUT
                                    </span>

                                )}
                                {offer.comingSoon && (
                                    <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.4)', fontWeight: 900, animation: 'shimmer 2s infinite', letterSpacing: '0.1em' }}>RELEASING Q3 2026</span>
                                )}

                                {/* Expand terms */}
                                <button onClick={() => setExpandedOffer(expandedOffer === offer.id ? null : offer.id)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    TERMS
                                    <Icon
                                        name="sort"
                                        ariaLabel="Expand terms"
                                        size="btn"
                                        style={{ transition: 'transform 0.3s', transform: expandedOffer === offer.id ? 'rotate(180deg)' : 'none' }}
                                    />
                                </button>

                            </div>

                            {/* Expanded terms */}
                            {expandedOffer === offer.id && (
                                <div style={{ marginTop: '1.5rem', padding: '1.25rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '1rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, animation: 'fadeIn 0.4s ease-out' }}>
                                    <p style={{ fontWeight: 900, color: 'white', marginBottom: '0.5rem', fontSize: '0.75rem', letterSpacing: '0.1em' }}>DETAILED TERMS & CONDITIONS</p>
                                    {offer.terms}
                                </div>
                            )}
                        </div>

                        {/* CTA Footer */}
                        {!offer.comingSoon && (
                            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '1.75rem 2.5rem', background: 'rgba(255,255,255,0.01)' }}>
                                <button onClick={() => navigate('/')} style={{ width: '100%', height: '56px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', color: 'white', cursor: 'pointer', fontWeight: 900, fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', transition: 'all 0.4s' }}
                                    onMouseEnter={e => { e.currentTarget.style.background = offer.color; e.currentTarget.style.borderColor = offer.color; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}>
                                    <Icon name="showtime" ariaLabel="Activate and book" size="btn" />
                                    ACTIVATE & BOOK NOW

                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* How It Works */}
            <div style={{ background: '#1e0202', border: '1px solid rgba(225, 29, 72, 0.2)', borderRadius: '3rem', padding: '4rem', boxShadow: '0 40px 100px rgba(0,0,0,0.4)' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h2 style={{ fontWeight: 900, fontSize: '2.5rem', marginBottom: '1rem', fontFamily: 'var(--font-display)', color: 'white' }}>HOW TO REDEEM</h2>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1.1rem', fontWeight: 600 }}>SAVING ON YOUR CINEMA EXPERIENCE IS A SEAMLESS PROCESS.</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2.5rem' }}>
                    {[
                        { step: '01', icon: 'movie_filter', label: 'PICK A MOVIE', desc: 'Browse our latest releases and choose your preferred showtime.' },
                        { step: '02', icon: 'event_seat', label: 'CHOOSE SEATS', desc: 'Select your seats in any of our premium halls or immersive screens.' },
                        { step: '03', icon: 'confirmation_number', label: 'ENTER PROMO', desc: 'Apply your offer code in the payment section to unlock savings.' },
                        { step: '04', icon: 'verified', label: 'ENJOY SHOW', desc: 'Your discount is applied instantly. Welcome to the show!' },
                    ].map(({ step, icon, label, desc }) => (
                        <div key={step} style={{ textAlign: 'center' }}>
                            <div style={{ width: '72px', height: '72px', borderRadius: '1.5rem', background: 'rgba(225, 29, 72, 0.1)', border: '1px solid rgba(225, 29, 72, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 10px 30px rgba(225,29,72,0.1)' }}>
                                <Icon name="movie" ariaLabel={label} size="xl" style={{ color: '#e11d48' }} />
                            </div>

                            <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#e11d48', letterSpacing: '0.2em', marginBottom: '0.75rem' }}>STEP {step}</div>
                            <h4 style={{ fontWeight: 900, marginBottom: '0.75rem', fontSize: '1.1rem', color: 'white' }}>{label}</h4>
                            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', lineHeight: 1.6, fontWeight: 500 }}>{desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
