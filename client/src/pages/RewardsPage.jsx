import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchUserRewards, redeemPoints } from '../services/api';
import toast from 'react-hot-toast';

const TIER_COLORS = {
    Bronze: 'var(--primary)',
    Silver: '#94a3b8',
    Gold: '#fbbf24',
    Platinum: '#f8fafc'
};

const TIER_BENEFITS = {
    Bronze: ['Earn 10 pts per $1 spent', 'Standard booking access'],
    Silver: ['Earn 10 pts per $1 spent', 'Priority booking window', 'No booking fees'],
    Gold: ['Earn 12 pts per $1 spent', 'Free monthly IMAX upgrade', 'Priority booking window'],
    Platinum: ['Earn 15 pts per $1 spent', 'VIP Lounge access', 'Free monthly combo', 'Instant entry']
};

export default function RewardsPage() {
    const { user } = useAuth();
    const [rewards, setRewards] = useState(null);
    const [loading, setLoading] = useState(true);
    const [redeeming, setRedeeming] = useState(false);

    useEffect(() => {
        if (user) {
            loadRewards();
        }
    }, [user]);

    const loadRewards = async () => {
        try {
            setLoading(true);
            const data = await fetchUserRewards(user.uid);
            setRewards(data);
        } catch (error) {
            console.error('Failed to load rewards:', error);
            toast.error('Could not load rewards profile');
        } finally {
            setLoading(false);
        }
    };

    const handleRedeem = async () => {
        if (!rewards || rewards.points < 500) return;
        if (!window.confirm('Redeem 500 points for a $5 discount on your next booking?')) return;

        try {
            setRedeeming(true);
            const result = await redeemPoints(user.uid);
            if (result.success) {
                toast.success('Successfully redeemed 500 points! A $5 discount is waiting for you at checkout.');
                loadRewards();
            }
        } catch (error) {
            toast.error(error.message || 'Redemption failed');
        } finally {
            setRedeeming(false);
        }
    };

    if (loading) {
        return (
            <div style={{ padding: '8rem 0', textAlign: 'center', color: 'var(--primary)' }}>
                <span className="material-symbols-outlined animate-spin" style={{ fontSize: '4rem' }}>progress_activity</span>
                <p style={{ marginTop: '1.5rem', fontWeight: 900, fontSize: '1.2rem', fontFamily: 'var(--font-display)' }}>LOADING REWARDS...</p>
            </div>
        );
    }

    const nextTierGoal = rewards.tier === 'Bronze' ? 500 : rewards.tier === 'Silver' ? 2000 : rewards.tier === 'Gold' ? 5000 : null;
    const progress = nextTierGoal ? Math.min((rewards.lifetimePoints / nextTierGoal) * 100, 100) : 100;

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 1.5rem' }}>
            <style>{`
                @keyframes progressGrow { from { width: 0; } to { width: ${progress}%; } }
                @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
                .reward-card { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
                .reward-card:hover { transform: translateY(-8px); border-color: #e11d48 !important; }
                .history-row:hover { background: rgba(225, 29, 72, 0.05) !important; }
            `}</style>

            <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '999px', padding: '0.5rem 1.25rem', marginBottom: '1.5rem' }}>
                    <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>stars</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Loyalty Program</span>
                </div>
                <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: '1rem', fontFamily: 'var(--font-display)', color: 'white' }}>
                    OMNI<span style={{ color: '#e11d48' }}>REWARDS</span>
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.2rem', fontWeight: 500 }}>Your cinematic passion, rewarded at every turn.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '3rem' }}>
                {/* Left Column */}
                <div>
                    {/* Status Card */}
            <div className="reward-card" style={{ background: 'linear-gradient(135deg, #1e0202 0%, #120101 100%)', border: '2px solid rgba(212, 175, 55, 0.2)', borderRadius: '2.5rem', padding: '3rem', marginBottom: '3rem', position: 'relative', overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.5)' }}>
                <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '250px', height: '250px', background: `radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 70%)` }} />
                        
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
                                <div>
                                    <span style={{ fontSize: '0.9rem', fontWeight: 900, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.5rem', display: 'block' }}>AVAILABLE BALANCE</span>
                                    <h2 style={{ fontSize: '5rem', fontWeight: 900, color: '#ffffff', lineHeight: 0.9, fontFamily: 'var(--font-display)' }}>{rewards.points} <span style={{ fontSize: '1.5rem', color: 'var(--primary)', verticalAlign: 'middle', fontWeight: 950 }}>PTS</span></h2>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${TIER_COLORS[rewards.tier]}`, borderRadius: '1rem', padding: '0.75rem 1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.75rem', boxShadow: `0 10px 30px ${TIER_COLORS[rewards.tier]}30` }}>
                                        <span className="material-symbols-outlined" style={{ color: TIER_COLORS[rewards.tier], fontSize: '2rem' }}>verified</span>
                                        <span style={{ fontSize: '1.25rem', fontWeight: 950, color: 'white', fontFamily: 'var(--font-display)' }}>{rewards.tier.toUpperCase()}</span>
                                    </div>
                                    <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.75rem', fontWeight: 800 }}>{rewards.lifetimePoints} LIFETIME EARNED</p>
                                </div>
                            </div>

                            {nextTierGoal && (
                                <div style={{ marginBottom: '3rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', marginBottom: '1rem', fontWeight: 800 }}>
                                        <span style={{ color: 'rgba(255,255,255,0.6)' }}>NEXT MILESTONE: <strong style={{ color: 'white' }}>{rewards.tier === 'Bronze' ? 'SILVER' : rewards.tier === 'Silver' ? 'GOLD' : 'PLATINUM'}</strong></span>
                                        <span style={{ color: 'var(--primary)' }}>{rewards.lifetimePoints} / {nextTierGoal} PTS</span>
                                    </div>
                                        <div style={{ height: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                                        <div style={{ height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--primary-dark))', borderRadius: '6px', animation: 'progressGrow 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards' }} />
                                    </div>
                                </div>
                            )}

                            <button onClick={handleRedeem} disabled={rewards.points < 500 || redeeming} className="btn-primary" style={{ width: '100%', height: '72px', fontSize: '1.2rem', opacity: rewards.points < 500 ? 0.3 : 1 }}>
                                {redeeming ? 'PROCESSING REDEMPTION...' : rewards.points < 500 ? '500 POINTS MINIMUM FOR DISCOUNT' : 'REDEEM 500 PTS FOR $5 REWARD'}
                            </button>
                        </div>
                    </div>

                    {/* History */}
                    <div>
                        <h3 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '2rem', fontFamily: 'var(--font-display)', color: 'white' }}>TRANSACTION LOG</h3>
                        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1.5rem', overflow: 'hidden' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                                        <th style={{ textAlign: 'left', padding: '1.25rem 2rem', fontSize: '0.85rem', fontWeight: 900, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>ACTIVITY</th>
                                        <th style={{ textAlign: 'left', padding: '1.25rem 2rem', fontSize: '0.85rem', fontWeight: 900, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>DATE</th>
                                        <th style={{ textAlign: 'right', padding: '1.25rem 2rem', fontSize: '0.85rem', fontWeight: 900, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>VALUE</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rewards.history && rewards.history.length > 0 ? (
                                        rewards.history.slice().reverse().map((entry, i) => (
                                            <tr key={i} className="history-row" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                                <td style={{ padding: '1.25rem 2rem', fontSize: '1rem', fontWeight: 800, color: 'white' }}>{entry.reason.toUpperCase()}</td>
                                                <td style={{ padding: '1.25rem 2rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>{entry.date}</td>
                                                <td style={{ padding: '1.25rem 2rem', textAlign: 'right', fontSize: '1.1rem', fontWeight: 900, color: entry.points > 0 ? '#22c55e' : '#e11d48' }}>
                                                    {entry.points > 0 ? `+${entry.points}` : entry.points} PTS
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" style={{ padding: '4rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>No loyalty activity recorded yet. Start booking to earn points.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Column: Perks */}
                <div>
                    <h3 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '2rem', fontFamily: 'var(--font-display)', color: 'white' }}>TIER PRIVILEGES</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {Object.entries(TIER_BENEFITS).map(([tier, perks]) => (
                            <div key={tier} style={{ background: 'rgba(255,255,255,0.03)', border: `2px solid ${rewards.tier === tier ? '#e11d48' : 'rgba(255,255,255,0.08)'}`, borderRadius: '2rem', padding: '2rem', opacity: rewards.tier === tier ? 1 : 0.4, transition: 'all 0.3s' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                        <span className="material-symbols-outlined" style={{ color: TIER_COLORS[tier], fontSize: '1.75rem' }}>military_tech</span>
                                        <span style={{ fontSize: '1.2rem', fontWeight: 950, color: 'white', textTransform: 'uppercase', fontFamily: 'var(--font-display)' }}>{tier}</span>
                                        {rewards.tier === tier && <span style={{ marginLeft: 'auto', fontSize: '0.75rem', fontWeight: 900, background: 'var(--primary)', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '0.6rem', letterSpacing: '0.05em' }}>ACTIVE</span>}
                                    </div>
                                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                    {perks.map((perk, i) => (
                                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.95rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: '1.25rem', color: 'var(--primary)', fontWeight: 900 }}>check</span>
                                            {perk}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: '3rem', background: '#1e0202', border: '1px solid rgba(225, 29, 72, 0.2)', borderRadius: '2rem', padding: '2rem', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
                        <h4 style={{ fontWeight: 950, fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'white', letterSpacing: '0.05em' }}>
                            <span className="material-symbols-outlined" style={{ color: '#e11d48' }}>info</span>
                            EARNING PROTOCOL
                        </h4>
                        <ul style={{ padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {[
                                '10 points per $1 spent on all bookings',
                                '2× Multiplier on IMAX & Dolby formats',
                                '1.5× Multiplier on 4DX screenings',
                                'Points credited instantly post-confirmation'
                            ].map(text => (
                                <li key={text} style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, fontWeight: 500, display: 'flex', gap: '0.5rem' }}>
                                    <span style={{ color: '#e11d48' }}>•</span> {text}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
