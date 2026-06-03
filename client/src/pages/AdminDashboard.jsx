import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { 
    fetchAdminStats, fetchMovies, addMovie, updateMovie, deleteMovie, 
    fetchAllOrders, updateOrder, fetchProducts, addProduct, updateProduct, deleteProduct,
    fetchStaff, addStaff, updateStaff, deleteStaff
} from '../services/api';
import toast from 'react-hot-toast';

const SIDEBAR_ITEMS = [
    { icon: 'dashboard', label: 'Dashboard' },
    { icon: 'event', label: 'Scheduling' },
    { icon: 'confirmation_number', label: 'Ticketing' },
    { icon: 'restaurant', label: 'Concessions' },
    { icon: 'supervised_user_circle', label: 'Staff' },
    { icon: 'settings', label: 'Settings' },
];

const MovieForm = ({ movie, onSave, onCancel }) => {
    const [formData, setFormData] = useState(movie || {
        title: '', genre: 'Action', rating: 'PG-13', duration: '', poster: '', description: ''
    });
    const GENRES = ['Action', 'Sci-Fi', 'Drama', 'Fantasy', 'Comedy', 'Horror'];
    const RATINGS = ['G', 'PG', 'PG-13', 'R', 'NC-17'];

    return (
        <div style={{ background: '#1e0202', padding: '2.5rem', borderRadius: '2rem', width: '100%', maxWidth: '500px', border: '1px solid rgba(225, 29, 72, 0.2)', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
            <h3 style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'white' }}>{movie ? 'Edit Movie' : 'Add New Movie'}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <input className="form-input" placeholder="Movie Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <select className="form-input" value={formData.genre} onChange={e => setFormData({ ...formData, genre: e.target.value })}>
                        {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                    <select className="form-input" value={formData.rating} onChange={e => setFormData({ ...formData, rating: e.target.value })}>
                        {RATINGS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                </div>
                <input className="form-input" placeholder="Duration (e.g. 2h 30m)" value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} />
                <input className="form-input" placeholder="Poster URL" value={formData.poster} onChange={e => setFormData({ ...formData, poster: e.target.value })} />
                <textarea className="form-input" placeholder="Description" rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button className="btn-primary" style={{ flex: 1 }} onClick={() => onSave(formData)}>Save Movie</button>
                    <button className="btn-secondary" style={{ flex: 1, background: 'rgba(255,255,255,0.05)' }} onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

const ProductForm = ({ product, onSave, onCancel }) => {
    const [formData, setFormData] = useState(product || { name: '', category: 'popcorn', price: '' });
    return (
        <div style={{ background: '#1e0202', padding: '2.5rem', borderRadius: '2rem', width: '100%', maxWidth: '400px', border: '1px solid rgba(225, 29, 72, 0.2)', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
            <h3 style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'white' }}>{product ? 'Edit Product' : 'Add Product'}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <input className="form-input" placeholder="Product Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                <select className="form-input" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                    <option value="popcorn">Popcorn</option>
                    <option value="drink">Drink</option>
                    <option value="snack">Snack</option>
                </select>
                <input className="form-input" type="number" placeholder="Price" value={formData.price} onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })} />
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button className="btn-primary" style={{ flex: 1 }} onClick={() => onSave(formData)}>Save</button>
                    <button className="btn-secondary" style={{ flex: 1, background: 'rgba(255,255,255,0.05)' }} onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

const StaffForm = ({ staff, onSave, onCancel }) => {
    const [formData, setFormData] = useState(staff || { name: '', role: 'Staff', shift: 'Morning' });
    return (
        <div style={{ background: '#1e0202', padding: '2.5rem', borderRadius: '2rem', width: '100%', maxWidth: '400px', border: '1px solid rgba(225, 29, 72, 0.2)', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
            <h3 style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'white' }}>{staff ? 'Edit Staff' : 'Add Staff'}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <input className="form-input" placeholder="Staff Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                <input className="form-input" placeholder="Role" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} />
                <select className="form-input" value={formData.shift} onChange={e => setFormData({ ...formData, shift: e.target.value })}>
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Evening">Evening</option>
                </select>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button className="btn-primary" style={{ flex: 1 }} onClick={() => onSave(formData)}>Save</button>
                    <button className="btn-secondary" style={{ flex: 1, background: 'rgba(255,255,255,0.05)' }} onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

const OrderDetailsModal = ({ order, onClose, onUpdate }) => {
    if (!order) return null;
    const handleCheckIn = async () => {
        try { await updateOrder(order.id, { status: 'checked-in' }); toast.success('Ticket checked-in successfully'); onUpdate(); onClose(); } catch (e) { toast.error('Failed to update'); }
    };
    const handleCancel = async () => {
        if (!window.confirm('Cancel this booking?')) return;
        try { await updateOrder(order.id, { status: 'cancelled' }); toast.success('Booking cancelled'); onUpdate(); onClose(); } catch (e) { toast.error('Failed to cancel'); }
    };
    return (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
            <div style={{ background: '#1e0202', padding: '2.5rem', borderRadius: '2rem', width: '100%', maxWidth: '450px', border: '1px solid rgba(225, 29, 72, 0.2)', position: 'relative', boxShadow: '0 40px 100px rgba(0,0,0,0.7)' }}>
                <button onClick={onClose} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>
                    <span className="material-symbols-outlined">close</span>
                </button>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{ width: '100px', height: '100px', background: 'white', padding: '0.75rem', borderRadius: '1rem', margin: '0 auto 1.5rem', boxShadow: '0 15px 40px rgba(0,0,0,0.3)' }}>
                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${order.id}`} style={{ width: '100%' }} />
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'white' }}>Order Details</h3>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Order ID: #{order.id?.toUpperCase()}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        <div style={{ flex: 1 }}>
                            <p style={{ fontSize: '0.75rem', color: '#e11d48', textTransform: 'uppercase', marginBottom: '0.4rem', fontWeight: 900 }}>Seats</p>
                            <p style={{ fontWeight: 800, fontSize: '1.1rem' }}>{order.seats?.join(', ')}</p>
                        </div>
                        <div style={{ flex: 1 }}>
                            <p style={{ fontSize: '0.75rem', color: '#e11d48', textTransform: 'uppercase', marginBottom: '0.4rem', fontWeight: 900 }}>Total Paid</p>
                            <p style={{ fontWeight: 800, fontSize: '1.1rem' }}>${order.totalPaid?.toFixed(2)}</p>
                        </div>
                    </div>
                    {order.snackItems && (
                        <div>
                            <p style={{ fontSize: '0.75rem', color: '#e11d48', textTransform: 'uppercase', marginBottom: '0.6rem', fontWeight: 900 }}>Snacks & Combos</p>
                            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '1rem', padding: '1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <p style={{ fontSize: '0.95rem', fontWeight: 600 }}>{order.snackItems.name || 'Custom Selection'}</p>
                            </div>
                        </div>
                    )}
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        {order.status !== 'checked-in' && order.status !== 'cancelled' && (
                            <button className="btn-primary" style={{ flex: 1, height: '52px' }} onClick={handleCheckIn}><span className="material-symbols-outlined">check_circle</span> Check-in</button>
                        )}
                        {order.status !== 'cancelled' && (
                            <button className="btn-secondary" style={{ flex: 1, height: '52px', color: '#f87171', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)' }} onClick={handleCancel}><span className="material-symbols-outlined">cancel</span> Cancel Booking</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function AdminDashboard() {
    const [activeNav, setActiveNav] = useState('Dashboard');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [stats, setStats] = useState(null);
    const [movies, setMovies] = useState([]);
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingItem, setEditingItem] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => { loadData(); }, [activeNav]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [s, m, o, p, st] = await Promise.all([
                fetchAdminStats(), fetchMovies(), fetchAllOrders(), fetchProducts(), fetchStaff()
            ]);
            setStats(s); setMovies(m); setOrders(o); setProducts(p); setStaff(st);
        } catch (error) { toast.error('Failed to load admin data'); } finally { setLoading(false); }
    };

    const handleSaveMovie = async (data) => {
        try { if (data.id) { await updateMovie(data.id, data); toast.success('Movie updated'); } else { await addMovie(data); toast.success('Movie added'); } setShowForm(false); setEditingItem(null); loadData(); } catch (e) { toast.error('Failed to save movie'); }
    };

    const handleSaveProduct = async (data) => {
        try { if (data.id) { await updateProduct(data.id, data); toast.success('Product updated'); } else { await addProduct(data); toast.success('Product added'); } setShowForm(false); setEditingItem(null); loadData(); } catch (e) { toast.error('Failed to save product'); }
    };

    const handleSaveStaff = async (data) => {
        try { if (data.id) { await updateStaff(data.id, data); toast.success('Staff updated'); } else { await addStaff(data); toast.success('Staff added'); } setShowForm(false); setEditingItem(null); loadData(); } catch (e) { toast.error('Failed to save staff'); }
    };

    const exportToCSV = () => {
        const headers = ['Order ID', 'Date', 'Seats', 'Total Paid', 'Status'];
        const rows = orders.map(o => [o.id, new Date(o.createdAt).toLocaleDateString(), o.seats?.join('|'), o.totalPaid, o.status]);
        const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");
        const link = document.createElement("a"); link.setAttribute("href", encodeURI(csvContent)); link.setAttribute("download", `Cinemaline_Report_${new Date().toISOString().slice(0,10)}.csv`); document.body.appendChild(link); link.click(); toast.success('Report downloaded');
    };

    const filteredOrders = orders.filter(o => o.id?.toLowerCase().includes(searchTerm.toLowerCase()) || o.seats?.join(', ').toLowerCase().includes(searchTerm.toLowerCase()));

    const revenueData = [
        { time: '9AM', revenue: 1200 }, { time: '11AM', revenue: 3400 }, { time: '1PM', revenue: 6700 },
        { time: '3PM', revenue: 5200 }, { time: '5PM', revenue: 9100 }, { time: '7PM', revenue: 11800 },
        { time: '9PM', revenue: stats?.revenue || 14500 },
    ];

    return (
        <div style={{ display: 'flex', height: '100vh', background: '#120101', overflow: 'hidden', color: 'white' }}>
            <aside style={{ width: sidebarCollapsed ? '80px' : '260px', flexShrink: 0, background: '#1e0202', borderRight: '1px solid rgba(225, 29, 72, 0.15)', display: 'flex', flexDirection: 'column', transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)', overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(225, 29, 72, 0.15)', display: 'flex', alignItems: 'center', gap: '1rem', height: '72px' }}>
                    <div style={{ flexShrink: 0, width: '40px', height: '40px', borderRadius: '0.75rem', background: 'linear-gradient(135deg, #e11d48, #9f1239)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(225, 29, 72, 0.3)' }}><span className="material-symbols-outlined" style={{ fontSize: '1.5rem', color: 'white' }}>theaters</span></div>
                    {!sidebarCollapsed && <span style={{ fontWeight: 900, fontSize: '1.1rem', whiteSpace: 'nowrap', fontFamily: 'var(--font-display)', letterSpacing: '0.02em' }}>CINEMALINE <span style={{ color: '#e11d48' }}>HQ</span></span>}
                </div>
                <nav style={{ flex: 1, padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {SIDEBAR_ITEMS.map(item => (
                        <button key={item.label} onClick={() => setActiveNav(item.label)} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.85rem 1rem', borderRadius: '1rem', border: 'none', cursor: 'pointer', textAlign: 'left', background: activeNav === item.label ? 'rgba(225, 29, 72, 0.15)' : 'transparent', color: activeNav === item.label ? '#e11d48' : 'rgba(255,255,255,0.4)', fontWeight: 800, fontSize: '0.9rem', transition: 'all 0.2s', fontFamily: 'var(--font-accent)', letterSpacing: '0.02em' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '1.4rem' }}>{item.icon}</span> {!sidebarCollapsed && item.label.toUpperCase()}
                        </button>
                    ))}
                </nav>
                <div style={{ padding: '1rem', borderTop: '1px solid rgba(225, 29, 72, 0.15)' }}>
                    <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', borderRadius: '0.75rem', fontSize: '0.8rem', fontWeight: 800, fontFamily: 'var(--font-accent)' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '1.2rem', transform: sidebarCollapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}>keyboard_double_arrow_left</span> {!sidebarCollapsed && 'COLLAPSE'}
                    </button>
                </div>
            </aside>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <header style={{ height: '72px', borderBottom: '1px solid rgba(225, 29, 72, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2.5rem', background: 'rgba(18, 1, 1, 0.8)', backdropFilter: 'blur(20px)', flexShrink: 0 }}>
                    <div><h2 style={{ fontWeight: 900, fontSize: '1.25rem', fontFamily: 'var(--font-display)', letterSpacing: '0.02em' }}>{activeNav.toUpperCase()} COMMAND</h2><p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontWeight: 600 }}>LIVE ANALYTICS · {new Date().toLocaleDateString().toUpperCase()}</p></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '999px', padding: '0.4rem 1rem' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', animation: 'pulse-glow 1.5s ease-in-out infinite' }} />
                            <span style={{ fontSize: '0.8rem', fontWeight: 900, color: '#22c55e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Operational</span>
                        </div>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #e11d48, #9f1239)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: 'white', cursor: 'pointer', boxShadow: '0 4px 12px rgba(225, 29, 72, 0.4)' }}>A</div>
                    </div>
                </header>

                <div style={{ flex: 1, overflowY: 'auto', padding: '2.5rem' }}>
                    {activeNav === 'Dashboard' && (
                        <>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
                                {[
                                    { icon: 'payments', label: "Daily Revenue", value: `$${stats?.revenue?.toLocaleString() || '14,520'}`, change: '+12.3%', up: true },
                                    { icon: 'confirmation_number', label: 'Tickets Issued', value: stats?.ticketsSold || '847', change: '+8.1%', up: true },
                                    { icon: 'group', label: 'Active Visitors', value: stats?.visitors || '1,204', change: '+5.7%', up: true },
                                    { icon: 'chair', label: 'House Fill', value: `${stats?.occupancy || '59.75'}%`, change: '-2.1%', up: false },
                                ].map(k => (
                                    <div key={k.label} style={{ background: '#1e0202', border: '1px solid rgba(225, 29, 72, 0.15)', borderRadius: '1.25rem', padding: '1.5rem', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                            <span className="material-symbols-outlined" style={{ color: '#e11d48', fontSize: '1.5rem' }}>{k.icon}</span>
                                            <span style={{ fontSize: '0.75rem', color: k.up ? '#22c55e' : '#f87171', fontWeight: 900, background: k.up ? 'rgba(34,197,94,0.1)' : 'rgba(248,113,113,0.1)', borderRadius: '999px', padding: '0.25rem 0.6rem' }}>{k.change}</span>
                                        </div>
                                        <p style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'var(--font-accent)', color: 'white' }}>{k.value}</p>
                                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.25rem' }}>{k.label}</p>
                                    </div>
                                ))}
                            </div>
                            <div style={{ background: '#1e0202', border: '1px solid rgba(225, 29, 72, 0.15)', borderRadius: '1.5rem', padding: '2rem', marginBottom: '2.5rem', boxShadow: '0 15px 40px rgba(0,0,0,0.3)' }}>
                                <h3 style={{ fontWeight: 900, fontSize: '1.1rem', marginBottom: '2rem', fontFamily: 'var(--font-display)', letterSpacing: '0.05em', color: 'white' }}>PERFORMANCE METRICS</h3>
                                <ResponsiveContainer width="100%" height={300}><AreaChart data={revenueData}><defs><linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#e11d48" stopOpacity={0.4} /><stop offset="95%" stopColor="#e11d48" stopOpacity={0} /></linearGradient></defs><XAxis dataKey="time" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 700 }} axisLine={false} tickLine={false} /><YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 700 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(1)}K`} /><Tooltip contentStyle={{ background: '#1e0202', border: '1px solid rgba(225, 29, 72, 0.3)', borderRadius: '1rem', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }} /><Area type="monotone" dataKey="revenue" stroke="#e11d48" strokeWidth={4} fill="url(#revGradient)" /></AreaChart></ResponsiveContainer>
                            </div>
                        </>
                    )}

                    {activeNav === 'Scheduling' && (
                        <div style={{ animation: 'fadeIn 0.5s ease' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                                <h3 style={{ fontSize: '1.75rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: 'white' }}>CATALOG MANAGER</h3>
                                <button className="btn-primary" style={{ padding: '0 2rem' }} onClick={() => { setEditingItem(null); setShowForm(true); }}><span className="material-symbols-outlined">add</span> ADD NEW MOVIE</button>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                                {movies.map(movie => (
                                    <div key={movie.id} style={{ background: '#1e0202', borderRadius: '1.5rem', border: '1px solid rgba(225, 29, 72, 0.15)', overflow: 'hidden', display: 'flex', gap: '1.25rem', padding: '1.25rem', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
                                        <img src={movie.poster} style={{ width: '90px', height: '135px', objectFit: 'cover', borderRadius: '0.75rem', boxShadow: '0 5px 15px rgba(0,0,0,0.4)' }} />
                                        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                            <h4 style={{ fontWeight: 900, fontSize: '1.15rem', marginBottom: '0.4rem', fontFamily: 'var(--font-display)', color: 'white', lineHeight: 1.2 }}>{movie.title}</h4>
                                            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1rem' }}>{movie.genre.toUpperCase()} · {movie.rating}</p>
                                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                                <button className="btn-secondary" style={{ flex: 1, height: '38px', borderRadius: '0.6rem', padding: 0 }} onClick={() => { setEditingItem(movie); setShowForm(true); }}><span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>edit</span></button>
                                                <button className="btn-secondary" style={{ flex: 1, height: '38px', borderRadius: '0.6rem', padding: 0, color: '#f87171', border: '1px solid rgba(248,113,113,0.2)' }} onClick={async () => { if(window.confirm('Delete movie?')) { await deleteMovie(movie.id); loadData(); } }}><span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>delete</span></button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeNav === 'Ticketing' && (
                        <div style={{ animation: 'fadeIn 0.5s ease' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                                <div><h3 style={{ fontSize: '1.75rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: 'white' }}>TRANSACTION LOGS</h3><p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', fontWeight: 600 }}>MANAGE CUSTOMER BOOKINGS & VERIFICATIONS</p></div>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button className="btn-secondary" onClick={exportToCSV}><span className="material-symbols-outlined">download</span> EXPORT CSV</button>
                                    <div style={{ position: 'relative' }}>
                                        <input className="form-input" placeholder="SEARCH ORDER ID..." style={{ width: '280px', paddingLeft: '3rem', height: '48px' }} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                                        <span className="material-symbols-outlined" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }}>search</span>
                                    </div>
                                </div>
                            </div>
                            <div style={{ background: '#1e0202', borderRadius: '1.5rem', border: '1px solid rgba(225, 29, 72, 0.15)', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead><tr style={{ borderBottom: '1px solid rgba(225, 29, 72, 0.15)', background: 'rgba(225, 29, 72, 0.05)' }}><th style={{ padding: '1.25rem', color: 'rgba(255,255,255,0.5)', fontWeight: 900, fontSize: '0.75rem', letterSpacing: '0.1em' }}>ORDER ID</th><th style={{ padding: '1.25rem', color: 'rgba(255,255,255,0.5)', fontWeight: 900, fontSize: '0.75rem', letterSpacing: '0.1em' }}>DATE</th><th style={{ padding: '1.25rem', color: 'rgba(255,255,255,0.5)', fontWeight: 900, fontSize: '0.75rem', letterSpacing: '0.1em' }}>SEATS</th><th style={{ padding: '1.25rem', color: 'rgba(255,255,255,0.5)', fontWeight: 900, fontSize: '0.75rem', letterSpacing: '0.1em' }}>REVENUE</th><th style={{ padding: '1.25rem', color: 'rgba(255,255,255,0.5)', fontWeight: 900, fontSize: '0.75rem', letterSpacing: '0.1em' }}>STATUS</th><th style={{ padding: '1.25rem', color: 'rgba(255,255,255,0.5)', fontWeight: 900, fontSize: '0.75rem', letterSpacing: '0.1em' }}>ACTIONS</th></tr></thead>
                                    <tbody>{filteredOrders.map(order => (<tr key={order.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }} className="table-row"><td style={{ padding: '1.25rem', fontWeight: 900, color: 'white', fontFamily: 'monospace', fontSize: '1rem' }}>#{order.id?.toUpperCase().slice(-8)}</td><td style={{ padding: '1.25rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>{new Date(order.createdAt).toLocaleDateString()}</td><td style={{ padding: '1.25rem' }}><div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>{order.seats?.map(s => (<span key={s} style={{ background: 'rgba(225, 29, 72, 0.1)', color: '#e11d48', padding: '0.2rem 0.6rem', borderRadius: '0.4rem', fontSize: '0.8rem', fontWeight: 900 }}>{s}</span>))}</div></td><td style={{ padding: '1.25rem', fontWeight: 900, color: 'white' }}>${order.totalPaid?.toFixed(2)}</td><td style={{ padding: '1.25rem' }}><span style={{ background: order.status === 'checked-in' ? 'rgba(34,197,94,0.1)' : order.status === 'cancelled' ? 'rgba(248,113,113,0.1)' : 'rgba(225, 29, 72, 0.1)', color: order.status === 'checked-in' ? '#22c55e' : order.status === 'cancelled' ? '#f87171' : '#e11d48', padding: '0.35rem 0.75rem', borderRadius: '0.6rem', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{order.status}</span></td><td style={{ padding: '1.25rem' }}><button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', fontWeight: 800 }} onClick={() => setSelectedOrder(order)}>VIEW DETAILS</button></td></tr>))}</tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeNav === 'Concessions' && (
                        <div style={{ animation: 'fadeIn 0.5s ease' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                                <h3 style={{ fontSize: '1.75rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: 'white' }}>INVENTORY CONTROL</h3>
                                <button className="btn-primary" style={{ padding: '0 2rem' }} onClick={() => { setEditingItem(null); setShowForm(true); }}><span className="material-symbols-outlined">add</span> ADD STOCK ITEM</button>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                                {products.map(p => (
                                    <div key={p.id} style={{ background: '#1e0202', borderRadius: '1.5rem', padding: '1.75rem', border: '1px solid rgba(225, 29, 72, 0.15)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                                            <div style={{ width: '56px', height: '56px', borderRadius: '1rem', background: 'rgba(225, 29, 72, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: '2rem', color: '#e11d48' }}>{p.category === 'drink' ? 'local_drink' : p.category === 'popcorn' ? 'icecream' : 'restaurant'}</span>
                                            </div>
                                            <span style={{ fontWeight: 900, fontSize: '1.4rem', color: 'white' }}>${p.price?.toFixed(2)}</span>
                                        </div>
                                        <h4 style={{ fontWeight: 900, fontSize: '1.1rem', marginBottom: '0.4rem', color: 'white' }}>{p.name.toUpperCase()}</h4>
                                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1.5rem', letterSpacing: '0.05em' }}>{p.category}</p>
                                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                                            <button className="btn-secondary" style={{ flex: 1, fontWeight: 800 }} onClick={() => { setEditingItem(p); setShowForm(true); }}>EDIT</button>
                                            <button className="btn-secondary" style={{ flex: 1, fontWeight: 800, color: '#f87171', border: '1px solid rgba(248,113,113,0.2)' }} onClick={async () => { if(window.confirm('Delete item?')) { await deleteProduct(p.id); loadData(); } }}>DELETE</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeNav === 'Staff' && (
                        <div style={{ animation: 'fadeIn 0.5s ease' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                                <h3 style={{ fontSize: '1.75rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: 'white' }}>PERSONNEL ROSTER</h3>
                                <button className="btn-primary" style={{ padding: '0 2rem' }} onClick={() => { setEditingItem(null); setShowForm(true); }}><span className="material-symbols-outlined">person_add</span> ASSIGN STAFF</button>
                            </div>
                            <div style={{ background: '#1e0202', borderRadius: '1.5rem', border: '1px solid rgba(225, 29, 72, 0.15)', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead><tr style={{ borderBottom: '1px solid rgba(225, 29, 72, 0.15)', background: 'rgba(225, 29, 72, 0.05)' }}><th style={{ padding: '1.25rem', color: 'rgba(255,255,255,0.5)', fontWeight: 900, fontSize: '0.75rem', letterSpacing: '0.1em' }}>NAME</th><th style={{ padding: '1.25rem', color: 'rgba(255,255,255,0.5)', fontWeight: 900, fontSize: '0.75rem', letterSpacing: '0.1em' }}>ROLE</th><th style={{ padding: '1.25rem', color: 'rgba(255,255,255,0.5)', fontWeight: 900, fontSize: '0.75rem', letterSpacing: '0.1em' }}>SHIFT</th><th style={{ padding: '1.25rem', color: 'rgba(255,255,255,0.5)', fontWeight: 900, fontSize: '0.75rem', letterSpacing: '0.1em' }}>ACTIONS</th></tr></thead>
                                    <tbody>{staff.map(s => (<tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }} className="table-row"><td style={{ padding: '1.25rem', fontWeight: 900, color: 'white' }}>{s.name.toUpperCase()}</td><td style={{ padding: '1.25rem', color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>{s.role}</td><td style={{ padding: '1.25rem' }}><span style={{ background: 'rgba(255,255,255,0.05)', color: 'white', padding: '0.35rem 0.75rem', borderRadius: '0.6rem', fontWeight: 800, fontSize: '0.8rem' }}>{s.shift.toUpperCase()}</span></td><td style={{ padding: '1.25rem' }}><div style={{ display: 'flex', gap: '0.75rem' }}><button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', fontWeight: 800 }} onClick={() => { setEditingItem(s); setShowForm(true); }}>EDIT</button><button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', fontWeight: 800, color: '#f87171', border: '1px solid rgba(248,113,113,0.2)' }} onClick={async () => { if(window.confirm('Remove staff member?')) { await deleteStaff(s.id); loadData(); } }}>REMOVE</button></div></td></tr>))}</tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeNav === 'Settings' && (
                        <div style={{ animation: 'fadeIn 0.5s ease', maxWidth: '700px' }}>
                            <h3 style={{ fontSize: '1.75rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: 'white', marginBottom: '2rem' }}>SYSTEM CONFIGURATION</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', background: '#1e0202', padding: '2.5rem', borderRadius: '2rem', border: '1px solid rgba(225, 29, 72, 0.15)', boxShadow: '0 30px 60px rgba(0,0,0,0.4)' }}>
cinemaline Premium Cinema
                                <div><label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 900, color: '#e11d48', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Global HQ Address</label><input className="form-input" defaultValue="999 Cinematic Plaza, Hollywood North, CA" /></div>
                                <div style={{ display: 'flex', gap: '1.5rem' }}><div style={{ flex: 1 }}><label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 900, color: '#e11d48', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Operational Start</label><input className="form-input" type="time" defaultValue="09:00" /></div><div style={{ flex: 1 }}><label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 900, color: '#e11d48', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Operational End</label><input className="form-input" type="time" defaultValue="01:00" /></div></div>
                                <button className="btn-primary" style={{ marginTop: '1.5rem', height: '60px', fontSize: '1.1rem' }} onClick={() => toast.success('Operational settings updated')}>SAVE CONFIGURATION</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {showForm && (
                <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowForm(false)}>
                    {activeNav === 'Scheduling' && <MovieForm movie={editingItem} onSave={handleSaveMovie} onCancel={() => setShowForm(false)} />}
                    {activeNav === 'Concessions' && <ProductForm product={editingItem} onSave={handleSaveProduct} onCancel={() => setShowForm(false)} />}
                    {activeNav === 'Staff' && <StaffForm staff={editingItem} onSave={handleSaveStaff} onCancel={() => setShowForm(false)} />}
                </div>
            )}
            {selectedOrder && (<OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} onUpdate={loadData} />)}
            <style>{`
                @keyframes pulse-glow { 0%,100%{opacity:1;box-shadow:0 0 10px rgba(34,197,94,0.5);} 50%{opacity:0.6;box-shadow:0 0 5px rgba(34,197,94,0.2);} }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .table-row:hover { background: rgba(225, 29, 72, 0.05) !important; cursor: default; }
                .form-input:focus { border-color: #e11d48 !important; box-shadow: 0 0 0 4px rgba(225, 29, 72, 0.1) !important; }
            `}</style>
        </div>
    );
}
