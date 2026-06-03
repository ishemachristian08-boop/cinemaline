import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { fetchProducts } from '../services/api';
import toast from 'react-hot-toast';

const STEPS = [
    { icon: 'local_popcorn', label: '1. Popcorn' },
    { icon: 'local_drink', label: '2. Drinks' },
    { icon: 'lunch_dining', label: '3. Snacks' },
];

const BUNDLE_DISCOUNT = 0.20;

const SkeletonItem = () => (
    <div className="glass-card shimmer-bg" style={{ height: '140px', background: 'rgba(255,255,255,0.02)', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }} />
);

export default function SnackPage() {
    const navigate = useNavigate();
    const { setCombo, clearCombo } = useCart();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [step, setStep] = useState(0);
    const [selections, setSelections] = useState({ popcorn: null, flavor: null, drink: null, snack: null });

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const data = await fetchProducts();
                setProducts(data);
            } catch (error) {
                console.error('Failed to load products:', error);
                toast.error('Failed to load snack menu');
            } finally {
                setLoading(false);
            }
        };
        loadProducts();
    }, []);

    const popcornOptions = products.filter(p => p.category === 'popcorn').map(p => ({
        ...p,
        label: p.name,
        size: p.id.includes('lrg') ? '170oz Giant' : p.id.includes('med') ? '130oz Large' : '85oz Standard',
        image: p.image || (p.id.includes('lrg') ? 'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=400&h=500&fit=crop' : 'https://images.unsplash.com/photo-1625695679703-7e43ebb2438e?w=400&h=500&fit=crop')
    }));

    const flavorOptions = [
        { id: 'butter', label: 'Classic Butter', extra: 0 },
        { id: 'salted', label: 'Sea Salt', extra: 0 },
        { id: 'caramel', label: 'Premium Caramel', extra: 1.50 },
    ];

    const drinkOptions = products.filter(p => p.category === 'drink').map(p => ({
        ...p,
        label: p.name,
        size: 'Large 32oz',
        image: p.image || 'https://images.unsplash.com/photo-1586195831835-99f5e65f4e37?w=400&h=500&fit=crop'
    }));

    const snackOptions = [
        ...products.filter(p => p.category === 'snack').map(p => ({
            ...p,
            label: p.name,
            image: p.image || 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400&h=500&fit=crop'
        })),
        { id: 'skip', label: 'No Snack', price: 0, image: null }
    ];

    const setSelection = (key, value) => setSelections(prev => ({ ...prev, [key]: value }));

    const isComplete = selections.popcorn && selections.flavor !== null && selections.drink && selections.snack !== null;

    const popcornPrice = selections.popcorn ? selections.popcorn.price + (selections.flavor?.extra || 0) : 0;
    const drinkPrice = selections.drink?.price || 0;
    const snackPrice = selections.snack?.price || 0;
    const rawTotal = popcornPrice + drinkPrice + snackPrice;
    const discount = rawTotal > 0 ? rawTotal * BUNDLE_DISCOUNT : 0;
    const comboPrice = parseFloat((rawTotal - discount).toFixed(2));

    const handleConfirm = () => {
        if (!isComplete) return;
        setCombo({
            name: 'Custom Cinema Combo',
            popcorn: `${selections.popcorn.label} (${selections.flavor.label})`,
            drink: selections.drink.label,
            snack: selections.snack.label,
            price: comboPrice,
            discount,
            rawTotal,
        });
        toast.success('Gourmet combo added! 🍿');
        navigate('/checkout');
    };

    const handleSkipSnacks = () => {
        clearCombo();
        navigate('/checkout');
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-dark)', color: 'white' }}>
            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
                .snack-card { transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1); cursor: pointer; }
                .snack-card:hover { transform: translateY(-6px); border-color: var(--primary) !important; box-shadow: 0 15px 30px var(--primary-glow); }
            `}</style>
            
            {/* Header progress bar */}
            <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', position: 'relative' }}>
                <div style={{ 
                    position: 'absolute', top: 0, left: 0, height: '100%', 
                    width: `${((step + 1) / 3) * 100}%`, background: 'var(--primary)',
                    transition: 'width 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)',
                    boxShadow: '0 0 12px var(--primary-glow)'
                }} />
            </div>

            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '3.5rem 1.5rem', display: 'flex', gap: '3rem', alignItems: 'start', flexWrap: 'wrap' }}>
                {/* Left Side: Selectors */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2.5rem', minWidth: '320px' }}>
                    <div>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(225, 29, 72, 0.12)', border: '1px solid rgba(225, 29, 72, 0.25)', borderRadius: '999px', padding: '0.4rem 1.25rem', marginBottom: '1.25rem' }}>
                            <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: '1.15rem' }}>restaurant</span>
                            <span style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Concessions Experience</span>
                        </div>
                        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: '0.75rem', fontFamily: 'var(--font-display)' }}>BUILD YOUR<br /><span style={{ color: 'var(--primary)', textShadow: '0 0 20px rgba(225,29,72,0.2)' }}>GOURMET COMBO</span></h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', fontWeight: 500 }}>Select one item from each section to unlock an automatic 20% bundle discount.</p>
                    </div>

                    {/* Step Tabs */}
                    <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '1.5rem', padding: '0.4rem', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '0.4rem' }}>
                        {STEPS.map((s, i) => (
                            <button key={i} onClick={() => i <= step && setStep(i)} style={{
                                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                                padding: '1rem', borderRadius: '1.15rem', border: 'none', cursor: i <= step ? 'pointer' : 'default',
                                background: step === i ? 'var(--primary)' : 'transparent',
                                color: step === i ? 'white' : 'var(--text-secondary)',
                                fontWeight: 800, fontSize: '0.85rem', transition: 'all 0.3s', letterSpacing: '0.05em'
                            }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '1.35rem' }}>{s.icon}</span>
                                <span className="desktop-only">{s.label}</span>
                                {i < step && <span className="material-symbols-outlined" style={{ fontSize: '1.15rem', marginLeft: 'auto', color: 'white' }}>check_circle</span>}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                            <SkeletonItem /><SkeletonItem /><SkeletonItem />
                        </div>
                    ) : (
                        <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
                            {step === 0 && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
                                        {popcornOptions.map(opt => (
                                            <div key={opt.id} onClick={() => setSelection('popcorn', opt)} className="snack-card glass-card" style={{
                                                padding: 0, overflow: 'hidden',
                                                border: selections.popcorn?.id === opt.id ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.06)',
                                                position: 'relative',
                                                background: selections.popcorn?.id === opt.id ? 'rgba(225,29,72,0.04)' : 'rgba(255,255,255,0.02)'
                                            }}>
                                                <img src={opt.image} alt={opt.label} style={{ width: '100%', height: '170px', objectFit: 'cover', borderBottom: '1px solid rgba(255,255,255,0.06)' }} />
                                                <div style={{ padding: '1.25rem' }}>
                                                    <h3 style={{ fontWeight: 900, fontSize: '1.1rem', color: 'white', fontFamily: 'var(--font-display)', margin: 0 }}>{opt.label.toUpperCase()}</h3>
                                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700, marginTop: '0.2rem', margin: 0 }}>{opt.size}</p>
                                                    <p style={{ fontWeight: 900, marginTop: '0.75rem', fontSize: '1.2rem', color: 'var(--primary)', margin: '0.5rem 0 0' }}>${opt.price.toFixed(2)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <div>
                                        <h3 style={{ fontWeight: 900, fontSize: '1.15rem', marginBottom: '1rem', fontFamily: 'var(--font-display)', color: 'white', letterSpacing: '0.05em' }}>SIGNATURE FLAVORS</h3>
                                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                            {flavorOptions.map(f => (
                                                <button key={f.id} onClick={() => setSelection('flavor', f)} style={{
                                                    padding: '0.75rem 1.75rem', borderRadius: '999px',
                                                    border: selections.flavor?.id === f.id ? '2.5px solid var(--primary)' : '1.5px solid rgba(255,255,255,0.1)',
                                                    background: selections.flavor?.id === f.id ? 'rgba(225,29,72,0.1)' : 'transparent',
                                                    color: 'white', cursor: 'pointer', fontWeight: 800, transition: 'all 0.3s', fontSize: '0.85rem'
                                                }}>
                                                    {f.label.toUpperCase()}{f.extra > 0 ? ` (+$${f.extra.toFixed(2)})` : ''}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                                        <button className="btn-primary" style={{ padding: '0.75rem 2.25rem', borderRadius: '0.875rem' }} disabled={!selections.popcorn || !selections.flavor} onClick={() => setStep(1)}>SELECT DRINKS <span className="material-symbols-outlined">arrow_forward</span></button>
                                    </div>
                                </div>
                            )}

                            {step === 1 && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                                        {drinkOptions.map(opt => (
                                            <div key={opt.id} onClick={() => setSelection('drink', opt)} className="snack-card glass-card" style={{
                                                display: 'flex', gap: '1.25rem', padding: '1.25rem',
                                                border: selections.drink?.id === opt.id ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.06)',
                                                background: selections.drink?.id === opt.id ? 'rgba(225,29,72,0.04)' : 'rgba(255,255,255,0.02)',
                                                alignItems: 'center'
                                            }}>
                                                <img src={opt.image} alt={opt.label} style={{ width: '70px', height: '95px', objectFit: 'cover', borderRadius: '0.75rem', boxShadow: '0 8px 15px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }} />
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                                                    <h3 style={{ fontWeight: 900, fontSize: '1.1rem', color: '#fff', fontFamily: 'var(--font-display)', margin: 0 }}>{opt.label.toUpperCase()}</h3>
                                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, margin: 0 }}>{opt.size}</p>
                                                    <p style={{ fontWeight: 900, fontSize: '1.15rem', color: 'var(--primary)', margin: 0 }}>${opt.price.toFixed(2)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
                                        <button onClick={() => setStep(0)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 800, fontSize: '0.9rem' }}>← BACK</button>
                                        <button className="btn-primary" style={{ padding: '0.75rem 2.25rem', borderRadius: '0.875rem' }} disabled={!selections.drink} onClick={() => setStep(2)}>CHOOSE SNACKS <span className="material-symbols-outlined">arrow_forward</span></button>
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                                        {snackOptions.map(opt => (
                                            <div key={opt.id} onClick={() => setSelection('snack', opt)} className="snack-card glass-card" style={{
                                                display: 'flex', gap: '1.25rem', padding: '1.25rem',
                                                border: selections.snack?.id === opt.id ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.06)',
                                                background: selections.snack?.id === opt.id ? 'rgba(225,29,72,0.04)' : 'rgba(255,255,255,0.02)',
                                                alignItems: 'center'
                                            }}>
                                                {opt.image ? (
                                                    <img src={opt.image} alt={opt.label} style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.06)' }} />
                                                ) : (
                                                    <div style={{ width: '70px', height: '70px', background: 'rgba(255,255,255,0.04)', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.06)' }}><span className="material-symbols-outlined" style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>close</span></div>
                                                )}
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                                                    <h3 style={{ fontWeight: 900, fontSize: '1.1rem', color: '#fff', fontFamily: 'var(--font-display)', margin: 0 }}>{opt.label.toUpperCase()}</h3>
                                                    <p style={{ fontWeight: 900, color: opt.price === 0 ? 'var(--text-muted)' : 'var(--primary)', fontSize: '1.15rem', margin: 0 }}>{opt.price === 0 ? 'SKIPPED' : `$${opt.price.toFixed(2)}`}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
                                        <button onClick={() => setStep(1)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 800, fontSize: '0.9rem' }}>← BACK</button>
                                        <button className="btn-primary" style={{ padding: '0.75rem 2.25rem', borderRadius: '0.875rem' }} onClick={handleConfirm} disabled={!isComplete}>FINALIZE COMBO <span className="material-symbols-outlined">celebration</span></button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    
                    <button onClick={handleSkipSnacks} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', textDecoration: 'underline', alignSelf: 'flex-start', fontWeight: 700, fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>Proceed to checkout without snacks</button>
                </div>

                {/* Right Side: Sidebar Order Preview */}
                <aside style={{ width: '380px', flexShrink: 0, position: 'sticky', top: '96px' }}>
                    <div className="glass-card" style={{ padding: '2.25rem', border: '1px solid rgba(225, 29, 72, 0.25)', boxShadow: '0 30px 60px rgba(0,0,0,0.6)' }}>
                        <h3 style={{ fontWeight: 900, fontSize: '1.1rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', letterSpacing: '0.1em', fontFamily: 'var(--font-display)', color: 'white', margin: '0 0 2rem' }}>
                            <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: '1.4rem' }}>shopping_bag</span> YOUR COMBO
                        </h3>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {[
                                { label: 'POPCORN', value: selections.popcorn ? `$${popcornPrice.toFixed(2)}` : '—', sub: selections.popcorn ? `${selections.popcorn.label} (${selections.flavor?.label || 'Classic'})` : null },
                                { label: 'BEVERAGE', value: selections.drink ? `$${drinkPrice.toFixed(2)}` : '—', sub: selections.drink?.label },
                                { label: 'GOURMET SNACK', value: selections.snack ? (selections.snack.price === 0 ? 'SKIPPED' : `$${snackPrice.toFixed(2)}`) : '—', sub: selections.snack?.id !== 'skip' ? selections.snack?.label : null },
                            ].map(item => (
                                <div key={item.label} style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 800 }}>
                                        <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                                        <span style={{ color: 'white', fontFamily: 'var(--font-mono)' }}>{item.value}</span>
                                    </div>
                                    {item.sub && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, margin: 0 }}>{item.sub.toUpperCase()}</p>}
                                </div>
                            ))}
                            
                            <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '0.5rem 0' }} />
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900, fontSize: '1.75rem', fontFamily: 'var(--font-display)' }}>
                                <span style={{ color: 'white' }}>TOTAL</span>
                                <span style={{ color: 'var(--primary)' }}>${comboPrice.toFixed(2)}</span>
                            </div>
                            
                            {selections.popcorn && selections.drink && selections.snack && (
                                <div style={{ background: 'rgba(225,29,72,0.06)', borderRadius: '1rem', padding: '1.25rem', textAlign: 'center', border: '1px solid rgba(225, 29, 72, 0.2)', animation: 'fadeIn 0.4s ease-out' }}>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 900, letterSpacing: '0.05em', margin: 0 }}>BUNDLE SAVINGS ACTIVATED</p>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem', fontWeight: 600, margin: '0.25rem 0 0' }}>20% OFF ALL SELECTIONS</p>
                                </div>
                            )}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
