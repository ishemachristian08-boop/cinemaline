const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
let admin;
try {
    admin = require('firebase-admin');
} catch (err) {
    admin = null;
    console.warn('firebase-admin not installed: running in Mock Mode');
}
const { sendBookingConfirmation } = require('./emailService');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Firebase Admin
let db;
try {
    if (admin && process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PROJECT_ID !== 'your-project-id') {
        let privateKey = process.env.FIREBASE_PRIVATE_KEY;
        
        if (privateKey) {
            privateKey = privateKey.replace(/\\n/g, '\n');
            if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
                privateKey = privateKey.substring(1, privateKey.length - 1);
            }
        }

        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: privateKey,
            }),
        });
        db = admin.firestore();
        console.log('✅ Firebase Admin initialized');
    } else {
        console.warn('⚠️ Firebase Admin not initialized. Running in Mock Mode.');
    }
} catch (error) {
    console.error('❌ Firebase initialization error:', error.message);
}

// CORS configuration - restrict to specific origins in production
const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? (process.env.ALLOWED_ORIGINS?.split(',') || ['https://cinemaline.com'])
        : ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));

// Rate limiting to prevent abuse
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: { error: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', limiter);

// Stricter rate limit for auth endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { error: 'Too many authentication attempts, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/auth/', authLimiter);

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:", "http:"],
            scriptSrc: ["'self'"],
            connectSrc: ["'self'", "http://localhost:3001"],
        },
    },
    crossOriginEmbedderPolicy: false,
}));

// Security headers middleware (additional custom headers)
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    next();
});

// --------------- Mock Database Storage ---------------
const mockDb = {
    movies: [],
    products: [],
    staff: [],
    screenings: [],
    orders: [],
    rewards: {}, // keyed by userId
};

// Seed function to initialize the mock data
const seedMockDb = () => {
    mockDb.movies = [
        {
            id: 'dune-2',
            title: 'Dune: Part Two',
            genre: 'Sci-Fi', rating: 'PG-13', duration: '2h 46m',
            poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=600&fit=crop',
            description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
            trailerId: 'Way9Dexny3w',
        },
        {
            id: 'oppenheimer',
            title: 'Oppenheimer',
            genre: 'Drama', rating: 'R', duration: '3h 0m',
            poster: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=600&fit=crop',
            description: 'The story of J. Robert Oppenheimer and his role in the development of the first nuclear weapons during World War II.',
            trailerId: 'uYPbbksJxIg',
        },
        {
            id: 'dark-knight',
            title: 'The Dark Knight',
            genre: 'Action', rating: 'PG-13', duration: '2h 32m',
            poster: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=600&fit=crop',
            description: 'Batman raises the stakes in his war on crime when the Joker, a sadistic criminal mastermind, wreaks chaos across Gotham City.',
            trailerId: 'EXeTwQWrcwY',
        },
    ];

    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    mockDb.screenings = [
        { id: 'scr-1', movieId: 'dune-2', movieTitle: 'Dune: Part Two', hall: 'IMAX Hall 1', format: 'IMAX', date: today, time: '2:30 PM', basePrice: 20.00, bookedSeats: [] },
        { id: 'scr-2', movieId: 'dune-2', movieTitle: 'Dune: Part Two', hall: 'IMAX Hall 1', format: 'IMAX', date: today, time: '8:00 PM', basePrice: 20.00, bookedSeats: [] },
        { id: 'scr-3', movieId: 'dune-2', movieTitle: 'Dune: Part Two', hall: 'Hall 3', format: '2D', date: tomorrow, time: '11:00 AM', basePrice: 10.20, bookedSeats: [] },
        { id: 'scr-4', movieId: 'oppenheimer', movieTitle: 'Oppenheimer', hall: 'Dolby Cinema', format: 'Dolby Cinema', date: today, time: '6:00 PM', basePrice: 17.00, bookedSeats: [] },
        { id: 'scr-5', movieId: 'oppenheimer', movieTitle: 'Oppenheimer', hall: 'Hall 2', format: '2D', date: tomorrow, time: '1:00 PM', basePrice: 10.20, bookedSeats: [] },
        { id: 'scr-6', movieId: 'dark-knight', movieTitle: 'The Dark Knight', hall: '4DX Hall', format: '4DX', date: today, time: '9:30 PM', basePrice: 22.00, bookedSeats: [] },
        { id: 'scr-7', movieId: 'dark-knight', movieTitle: 'The Dark Knight', hall: 'Hall 4', format: '3D', date: tomorrow, time: '4:00 PM', basePrice: 14.00, bookedSeats: [] },
    ];

    mockDb.products = [
        { id: 'pop-lrg', name: 'Large Popcorn', category: 'popcorn', price: 12.50 },
        { id: 'pop-med', name: 'Medium Popcorn', category: 'popcorn', price: 9.50 },
        { id: 'nachos', name: 'Nachos & Salsa', category: 'snack', price: 8.50 },
        { id: 'coke-lrg', name: 'Coca-Cola Large', category: 'drink', price: 6.00 },
        { id: 'coke-med', name: 'Coca-Cola Medium', category: 'drink', price: 4.50 },
        { id: 'water', name: 'Water Bottle', category: 'drink', price: 3.00 },
        { id: 'candy', name: 'Candy Bundle', category: 'snack', price: 5.50 },
    ];

    mockDb.staff = [
        { id: 's1', name: 'N.Kevin', role: 'General Manager', shift: 'Morning' },
        { id: 's2', name: 'N.Aline', role: 'Head Projectionist', shift: 'Evening' },
        { id: 's3', name: 'A.Andy', role: 'Concessions Lead', shift: 'Afternoon' },
        { id: 's4', name: 'I.Armando', role: 'Ticketing Supervisor', shift: 'Morning' },
    ];
    mockDb.orders = [];
    mockDb.rewards = {};
};

// Initial Seed
seedMockDb();

// --------------- Helpers ---------------
const getCollection = async (collectionName, fallbackData) => {
    if (!db) return fallbackData;
    try {
        const snapshot = await db.collection(collectionName).get();
        if (snapshot.empty) return fallbackData;
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error(`Error fetching ${collectionName}:`, error);
        return fallbackData;
    }
};

// --------------- Routes ---------------

// Movies
app.get('/api/movies', async (req, res) => {
    if (!db) {
        return res.json(mockDb.movies);
    }
    const fallback = mockDb.movies;
    const movies = await getCollection('movies', fallback);
    res.json(movies);
});

// Input sanitization helper
const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    return input.trim().replace(/[<>]/g, '');
};

app.post('/api/movies', async (req, res) => {
    try {
        // Sanitize input to prevent XSS
        const sanitizedBody = {};
        for (const [key, value] of Object.entries(req.body)) {
            if (typeof value === 'string') {
                sanitizedBody[key] = sanitizeInput(value);
            } else {
                sanitizedBody[key] = value;
            }
        }
        
        if (!db) {
            const newMovie = { id: `movie-${Date.now()}`, ...sanitizedBody };
            mockDb.movies.push(newMovie);
            return res.json(newMovie);
        }
        const docRef = await db.collection('movies').add(sanitizedBody);
        res.json({ id: docRef.id, ...sanitizedBody });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/movies/:id', async (req, res) => {
    try {
        if (!db) {
            const index = mockDb.movies.findIndex(m => m.id === req.params.id);
            if (index !== -1) {
                mockDb.movies[index] = { ...mockDb.movies[index], ...req.body };
                return res.json({ success: true });
            }
            return res.status(404).json({ error: 'Movie not found' });
        }
        await db.collection('movies').doc(req.params.id).update(req.body);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/movies/:id', async (req, res) => {
    try {
        if (!db) {
            mockDb.movies = mockDb.movies.filter(m => m.id !== req.params.id);
            return res.json({ success: true });
        }
        await db.collection('movies').doc(req.params.id).delete();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Products
app.get('/api/products', async (req, res) => {
    if (!db) {
        return res.json(mockDb.products);
    }
    const fallback = mockDb.products;
    const products = await getCollection('products', fallback);
    res.json(products);
});

app.post('/api/products', async (req, res) => {
    try {
        const sanitizedBody = {};
        for (const [key, value] of Object.entries(req.body)) {
            if (typeof value === 'string') {
                sanitizedBody[key] = sanitizeInput(value);
            } else {
                sanitizedBody[key] = value;
            }
        }
        
        if (!db) {
            const newProduct = { id: `prod-${Date.now()}`, ...sanitizedBody };
            mockDb.products.push(newProduct);
            return res.json(newProduct);
        }
        const docRef = await db.collection('products').add(sanitizedBody);
        res.json({ id: docRef.id, ...sanitizedBody });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/products/:id', async (req, res) => {
    try {
        if (!db) {
            const index = mockDb.products.findIndex(p => p.id === req.params.id);
            if (index !== -1) {
                mockDb.products[index] = { ...mockDb.products[index], ...req.body };
                return res.json({ success: true });
            }
            return res.status(404).json({ error: 'Product not found' });
        }
        await db.collection('products').doc(req.params.id).update(req.body);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/products/:id', async (req, res) => {
    try {
        if (!db) {
            mockDb.products = mockDb.products.filter(p => p.id !== req.params.id);
            return res.json({ success: true });
        }
        await db.collection('products').doc(req.params.id).delete();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Staff
app.get('/api/staff', async (req, res) => {
    if (!db) {
        return res.json(mockDb.staff);
    }
    const fallback = mockDb.staff;
    const staff = await getCollection('staff', fallback);
    res.json(staff);
});

app.post('/api/staff', async (req, res) => {
    try {
        const sanitizedBody = {};
        for (const [key, value] of Object.entries(req.body)) {
            if (typeof value === 'string') {
                sanitizedBody[key] = sanitizeInput(value);
            } else {
                sanitizedBody[key] = value;
            }
        }
        
        if (!db) {
            const newStaff = { id: `staff-${Date.now()}`, ...sanitizedBody };
            mockDb.staff.push(newStaff);
            return res.json(newStaff);
        }
        const docRef = await db.collection('staff').add(sanitizedBody);
        res.json({ id: docRef.id, ...sanitizedBody });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/staff/:id', async (req, res) => {
    try {
        if (!db) {
            const index = mockDb.staff.findIndex(s => s.id === req.params.id);
            if (index !== -1) {
                mockDb.staff[index] = { ...mockDb.staff[index], ...req.body };
                return res.json({ success: true });
            }
            return res.status(404).json({ error: 'Staff member not found' });
        }
        await db.collection('staff').doc(req.params.id).update(req.body);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/staff/:id', async (req, res) => {
    try {
        if (!db) {
            mockDb.staff = mockDb.staff.filter(s => s.id !== req.params.id);
            return res.json({ success: true });
        }
        await db.collection('staff').doc(req.params.id).delete();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Admin Stats
app.get('/api/admin/stats', async (req, res) => {
    try {
        if (!db) {
            const revenue = mockDb.orders.reduce((sum, o) => sum + (o.totalPaid || 0), 0);
            const ticketsSold = mockDb.orders.reduce((sum, o) => sum + (o.seats?.length || 0), 0);
            return res.json({
                revenue: 14520 + revenue,
                ticketsSold: 847 + ticketsSold,
                visitors: 1204 + mockDb.orders.length,
                occupancy: 62.5
            });
        }
        const ordersSnapshot = await db.collection('orders').get();
        const orders = ordersSnapshot.docs.map(doc => doc.data());
        const revenue = orders.reduce((sum, o) => sum + (o.totalPaid || 0), 0);
        const ticketsSold = orders.reduce((sum, o) => sum + (o.seats?.length || 0), 0);
        res.json({
            revenue: 14520 + revenue,
            ticketsSold: 847 + ticketsSold,
            visitors: 1204 + ordersSnapshot.size,
            occupancy: 62.5
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Admin Authentication Endpoint
// Validates admin credentials and returns user data with role
app.post('/api/admin/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Get admin credentials from environment
        const adminEmail = process.env.ADMIN_EMAIL || 'ishemachristian08@gmail.com';
        const adminPassword = process.env.ADMIN_PASSWORD || '01Jan08!';
        
        // Validate credentials
        if (email === adminEmail && password === adminPassword) {
            return res.json({
                success: true,
                user: {
                    uid: 'admin-id',
                    email: adminEmail,
                    displayName: 'HQ Admin',
                    role: 'admin'
                }
            });
        }
        
        return res.status(401).json({ 
            success: false, 
            error: 'Invalid admin credentials' 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ─── Rewards Helpers ──────────────────────────────────────────────────────────
const getTier = (pts) => {
    if (pts >= 5000) return 'Platinum';
    if (pts >= 2000) return 'Gold';
    if (pts >= 500)  return 'Silver';
    return 'Bronze';
};
const getPointsMultiplier = (format) => {
    if (['IMAX', 'Dolby Cinema'].includes(format)) return 2;
    if (format === '4DX') return 1.5;
    return 1;
};

// ─── Send FCM Push Notification ───────────────────────────────────────────────
const sendPushNotification = async (userId, title, body, data = {}) => {
    if (!db) return;
    try {
        const userSnap = await db.collection('users').doc(userId).get();
        const fcmToken = userSnap.data()?.fcmToken;
        if (!fcmToken) return;
        await admin.messaging().send({
            token: fcmToken,
            notification: { title, body },
            data,
            webpush: {
                notification: {
                    title, body,
                    icon: '/favicon.ico',
                    badge: '/favicon.ico',
                    requireInteraction: false,
                },
                fcmOptions: { link: '/' },
            },
        });
        console.log(`🔔 Push sent to user ${userId}: ${title}`);
    } catch (err) {
        console.error('🔔 Push failed:', err.message);
    }
};

// ─── Schedule Pre-Show Reminder ───────────────────────────────────────────────
const schedulePreShowReminder = (userId, movie, date, time) => {
    try {
        const [timePart, meridiem] = (time || '').split(' ');
        let [hours, minutes] = (timePart || '12:00').split(':').map(Number);
        if (meridiem === 'PM' && hours !== 12) hours += 12;
        if (meridiem === 'AM' && hours === 12) hours = 0;
        const showDate = new Date(date);
        showDate.setHours(hours, minutes || 0, 0, 0);
        const reminderTime = showDate.getTime() - 60 * 60 * 1000; // 1 hour before
        const delay = reminderTime - Date.now();
        if (delay < 0) return; // Already past
        setTimeout(() => {
            sendPushNotification(userId, `🎬 Starting Soon: ${movie}`, `Your screening starts in 1 hour. Head to the cinema now!`, { type: 'reminder' });
        }, delay);
        console.log(`⏰ Reminder scheduled for ${movie} in ${Math.round(delay / 60000)} min`);
    } catch (err) {
        console.error('⏰ Reminder schedule failed:', err.message);
    }
};

// Orders
app.post('/api/orders', async (req, res) => {
    try {
        // Validate required fields
        const requiredFields = ['screeningId', 'movie', 'seats', 'totalPaid', 'userEmail', 'userName'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        if (missingFields.length > 0) {
            return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
        }

        // Sanitize input
        const sanitizedBody = {};
        for (const [key, value] of Object.entries(req.body)) {
            if (typeof value === 'string') {
                sanitizedBody[key] = sanitizeInput(value);
            } else if (Array.isArray(value)) {
                sanitizedBody[key] = value.map(item => typeof item === 'string' ? sanitizeInput(item) : item);
            } else {
                sanitizedBody[key] = value;
            }
        }

        const orderId = `order-${Date.now()}`;
        const order = {
            id: orderId,
            ...sanitizedBody,
            createdAt: new Date().toISOString(),
            status: 'confirmed',
        };

        // ── Earn OmniRewards points
        let pointsEarned = 0;
        if (order.userId && order.userId !== 'guest' && order.totalPaid) {
            const multiplier = getPointsMultiplier(order.format);
            pointsEarned = Math.round(order.totalPaid * 10 * multiplier);

            if (!db) {
                if (!mockDb.rewards[order.userId]) {
                    mockDb.rewards[order.userId] = {
                        userId: order.userId,
                        points: 0,
                        lifetimePoints: 0,
                        tier: 'Bronze',
                        history: [],
                    };
                }
                const r = mockDb.rewards[order.userId];
                r.points += pointsEarned;
                r.lifetimePoints += pointsEarned;
                r.tier = getTier(r.points);
                r.history.push({
                    type: 'earned',
                    points: pointsEarned,
                    reason: `${order.movie}${multiplier > 1 ? ` (${order.format} ${multiplier}×)` : ''}`,
                    orderId,
                    date: new Date().toISOString().split('T')[0],
                });
                console.log(`⭐ Mocked ${pointsEarned} points earned for user ${order.userId}`);
            } else {
                try {
                    const rewardRef = db.collection('rewards').doc(order.userId);
                    const rewardSnap = await rewardRef.get();
                    const historyEntry = {
                        type: 'earned',
                        points: pointsEarned,
                        reason: `${order.movie}${multiplier > 1 ? ` (${order.format} ${multiplier}×)` : ''}`,
                        orderId,
                        date: new Date().toISOString().split('T')[0],
                    };
                    if (rewardSnap.exists) {
                        const current = rewardSnap.data();
                        const newPoints = (current.points || 0) + pointsEarned;
                        await rewardRef.update({
                            points: newPoints,
                            lifetimePoints: (current.lifetimePoints || 0) + pointsEarned,
                            tier: getTier(newPoints),
                            history: admin.firestore.FieldValue.arrayUnion(historyEntry),
                        });
                    } else {
                        await rewardRef.set({
                            userId: order.userId,
                            points: pointsEarned,
                            lifetimePoints: pointsEarned,
                            tier: getTier(pointsEarned),
                            history: [historyEntry],
                        });
                    }
                    console.log(`⭐ ${pointsEarned} points earned for user ${order.userId}`);
                } catch (err) {
                    console.error('⭐ Rewards earn failed:', err.message);
                }
            }
        }

        if (!db) {
            mockDb.orders.push(order);
            const screening = mockDb.screenings.find(s => s.id === order.screeningId);
            if (screening) {
                if (!screening.bookedSeats) screening.bookedSeats = [];
                screening.bookedSeats = screening.bookedSeats.concat(order.seats || []);
            }
            return res.json({
                success: true,
                orderId,
                pointsEarned,
                emailSent: false,
            });
        }

        // Firestore Flow
        const docRef = await db.collection('orders').add(order);
        const fbOrderId = docRef.id;

        // Send email
        const emailResult = await sendBookingConfirmation({
            orderId: fbOrderId,
            movie:      order.movie,
            hall:       order.hall,
            date:       order.date,
            time:       order.time,
            format:     order.format,
            seats:      order.seats,
            totalPaid:  order.totalPaid,
            userEmail:  order.userEmail,
            userName:   order.userName,
        });

        // Push / Reminder
        if (order.userId && order.userId !== 'guest') {
            sendPushNotification(
                order.userId,
                `🎬 Booking Confirmed: ${order.movie}`,
                `${order.seats?.length} seat(s) · ${order.time} · ${order.hall}${pointsEarned > 0 ? ` · +${pointsEarned} OmniPoints!` : ''}`,
                { type: 'booking', orderId: fbOrderId }
            );
            if (order.date && order.time) {
                schedulePreShowReminder(order.userId, order.movie, order.date, order.time);
            }
        }

        res.json({
            success: true,
            orderId: fbOrderId,
            pointsEarned,
            emailSent: !!emailResult,
            ...(emailResult?.previewUrl ? { emailPreview: emailResult.previewUrl } : {}),
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/orders', async (req, res) => {
    try {
        if (!db) return res.json(mockDb.orders);
        const snapshot = await db.collection('orders').orderBy('createdAt', 'desc').get();
        const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/orders/user/:userId', async (req, res) => {
    try {
        if (!db) {
            const userOrders = mockDb.orders.filter(o => o.userId === req.params.userId);
            return res.json(userOrders);
        }
        const snapshot = await db.collection('orders')
            .where('userId', '==', req.params.userId)
            .get();
        const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/orders/screening/:screeningId', async (req, res) => {
    try {
        if (!db) {
            const screening = mockDb.screenings.find(s => s.id === req.params.screeningId);
            const bookedSeats = screening ? (screening.bookedSeats || []) : [];
            return res.json({ bookedSeats });
        }
        const snapshot = await db.collection('orders')
            .where('screeningId', '==', req.params.screeningId)
            .where('status', 'in', ['confirmed', 'checked-in'])
            .get();
        
        let bookedSeats = [];
        snapshot.docs.forEach(doc => {
            const data = doc.data();
            if (data.seats && Array.isArray(data.seats)) {
                bookedSeats = bookedSeats.concat(data.seats);
            }
        });
        
        res.json({ bookedSeats });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/orders/:id', async (req, res) => {
    try {
        if (!db) {
            const index = mockDb.orders.findIndex(o => o.id === req.params.id);
            if (index !== -1) {
                mockDb.orders[index] = { ...mockDb.orders[index], ...req.body };
                // If cancelled, free up seats in the screening
                if (req.body.status === 'cancelled') {
                    const order = mockDb.orders[index];
                    const screening = mockDb.screenings.find(s => s.id === order.screeningId);
                    if (screening && screening.bookedSeats) {
                        screening.bookedSeats = screening.bookedSeats.filter(seat => !order.seats.includes(seat));
                    }
                }
                return res.json({ success: true });
            }
            return res.status(404).json({ error: 'Order not found' });
        }
        await db.collection('orders').doc(req.params.id).update(req.body);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ─── Rewards Endpoints ────────────────────────────────────────────────────────
app.get('/api/rewards/:userId', async (req, res) => {
    try {
        if (!db) {
            if (!mockDb.rewards[req.params.userId]) {
                mockDb.rewards[req.params.userId] = {
                    userId: req.params.userId,
                    points: 0,
                    lifetimePoints: 0,
                    tier: 'Bronze',
                    history: [],
                };
            }
            return res.json(mockDb.rewards[req.params.userId]);
        }
        const snap = await db.collection('rewards').doc(req.params.userId).get();
        if (!snap.exists) return res.json({ points: 0, tier: 'Bronze', lifetimePoints: 0, history: [] });
        res.json(snap.data());
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/rewards/:userId/redeem', async (req, res) => {
    try {
        if (!db) {
            const r = mockDb.rewards[req.params.userId];
            if (!r || r.points < 500) {
                return res.status(400).json({ success: false, message: 'Insufficient points. Need at least 500.' });
            }
            r.points -= 500;
            r.tier = getTier(r.points);
            r.history.push({
                type: 'redeemed',
                points: -500,
                reason: '$5 discount redemption',
                date: new Date().toISOString().split('T')[0]
            });
            return res.json({ success: true, newPoints: r.points, discount: 5 });
        }
        const rewardRef = db.collection('rewards').doc(req.params.userId);
        const snap = await rewardRef.get();
        if (!snap.exists || (snap.data().points || 0) < 500)
            return res.status(400).json({ success: false, message: 'Insufficient points. Need at least 500.' });
        const current = snap.data();
        const newPoints = current.points - 500;
        const historyEntry = { type: 'redeemed', points: -500, reason: '$5 discount redemption', date: new Date().toISOString().split('T')[0] };
        await rewardRef.update({
            points: newPoints,
            tier: getTier(newPoints),
            history: admin.firestore.FieldValue.arrayUnion(historyEntry),
        });
        res.json({ success: true, newPoints, discount: 5 });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

// ─── Notification Registration ─────────────────────────────────────────────────
app.post('/api/notifications/register', async (req, res) => {
    try {
        const { userId, fcmToken } = req.body;
        if (!userId || !fcmToken) return res.status(400).json({ error: 'userId and fcmToken required' });
        if (db) {
            await db.collection('users').doc(userId).set({ fcmToken }, { merge: true });
        }
        console.log(`🔔 FCM token registered for user ${userId}`);
        res.json({ success: true });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

// --------------- Screenings ---------------
app.get('/api/screenings', async (req, res) => {
    try {
        if (!db) {
            let list = mockDb.screenings;
            if (req.query.movieId) list = list.filter(s => s.movieId === req.query.movieId);
            if (req.query.date) list = list.filter(s => s.date === req.query.date);
            return res.json(list);
        }
        let query = db.collection('screenings');
        if (req.query.movieId) query = query.where('movieId', '==', req.query.movieId);
        if (req.query.date) query = query.where('date', '==', req.query.date);
        const snapshot = await query.get();
        const screenings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(screenings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/screenings', async (req, res) => {
    try {
        const sanitizedBody = {};
        for (const [key, value] of Object.entries(req.body)) {
            if (typeof value === 'string') {
                sanitizedBody[key] = sanitizeInput(value);
            } else {
                sanitizedBody[key] = value;
            }
        }
        
        if (!db) {
            const screening = {
                id: `scr-${Date.now()}`,
                ...sanitizedBody,
                createdAt: new Date().toISOString(),
                bookedSeats: [],
            };
            mockDb.screenings.push(screening);
            return res.json(screening);
        }
        const screening = {
            ...sanitizedBody,
            createdAt: new Date().toISOString(),
            bookedSeats: [],
        };
        const docRef = await db.collection('screenings').add(screening);
        res.json({ id: docRef.id, ...screening });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/screenings/:id', async (req, res) => {
    try {
        if (!db) {
            const index = mockDb.screenings.findIndex(s => s.id === req.params.id);
            if (index !== -1) {
                mockDb.screenings[index] = { ...mockDb.screenings[index], ...req.body };
                return res.json({ success: true });
            }
            return res.status(404).json({ error: 'Screening not found' });
        }
        await db.collection('screenings').doc(req.params.id).update(req.body);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/screenings/:id', async (req, res) => {
    try {
        if (!db) {
            mockDb.screenings = mockDb.screenings.filter(s => s.id !== req.params.id);
            return res.json({ success: true });
        }
        await db.collection('screenings').doc(req.params.id).delete();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Pricing helper
const calculateSeatPrice = (format, time) => {
    let base = 12.00;
    if (format === 'IMAX') base = 20.00;
    else if (format === 'Dolby Cinema') base = 17.00;
    else if (format === '4DX') base = 22.00;
    else if (format === '3D') base = 14.00;
    try {
        const [timePart, meridiem] = (time || '').split(' ');
        let [hours] = timePart.split(':').map(Number);
        if (meridiem === 'PM' && hours !== 12) hours += 12;
        if (meridiem === 'AM' && hours === 12) hours = 0;
        if (hours < 16) base = Math.round(base * 0.85 * 100) / 100;
    } catch {}
    return base;
};

app.get('/api/screenings/:id/price', (req, res) => {
    const { format, time } = req.query;
    res.json({ price: calculateSeatPrice(format, time) });
});

app.get('/', (req, res) => {
    res.send(`<h1 style="color: #e11d48; text-align: center; font-family: sans-serif; padding-top: 50px; background: #0a0102; height: 100vh; margin: 0;">🎬 cinemaline API: Mock Mode Fallback Active</h1>`);
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', firebase: !!db, mockMode: !db, timestamp: new Date().toISOString() });
});

// Seed Endpoint
app.post('/api/seed', async (req, res) => {
    seedMockDb();
    if (!db) {
        return res.json({ message: 'Database seeded successfully in-memory (Mock Mode Fallback)!' });
    }
    try {
        const batch = db.batch();
        const moviesData = [
            {
                title: 'Dune: Part Two',
                genre: 'Sci-Fi', rating: 'PG-13', duration: '2h 46m',
                poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=600&fit=crop',
                description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
                trailerId: 'Way9Dexny3w',
            },
            {
                title: 'Oppenheimer',
                genre: 'Drama', rating: 'R', duration: '3h 0m',
                poster: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=600&fit=crop',
                description: 'The story of J. Robert Oppenheimer and his role in the development of the first nuclear weapons during World War II.',
                trailerId: 'uYPbbksJxIg',
            },
            {
                title: 'The Dark Knight',
                genre: 'Action', rating: 'PG-13', duration: '2h 32m',
                poster: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=600&fit=crop',
                description: 'Batman raises the stakes in his war on crime when the Joker, a sadistic criminal mastermind, wreaks chaos across Gotham City.',
                trailerId: 'EXeTwQWrcwY',
            },
        ];

        const movieRefs = moviesData.map(() => db.collection('movies').doc());
        moviesData.forEach((m, i) => batch.set(movieRefs[i], m));

        const today = new Date().toISOString().split('T')[0];
        const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
        const screeningsData = [
            { movieId: movieRefs[0].id, movieTitle: 'Dune: Part Two', hall: 'IMAX Hall 1', format: 'IMAX', date: today, time: '2:30 PM', basePrice: 20.00, bookedSeats: [] },
            { movieId: movieRefs[0].id, movieTitle: 'Dune: Part Two', hall: 'IMAX Hall 1', format: 'IMAX', date: today, time: '8:00 PM', basePrice: 20.00, bookedSeats: [] },
            { movieId: movieRefs[0].id, movieTitle: 'Dune: Part Two', hall: 'Hall 3', format: '2D', date: tomorrow, time: '11:00 AM', basePrice: 10.20, bookedSeats: [] },
            { movieId: movieRefs[1].id, movieTitle: 'Oppenheimer', hall: 'Dolby Cinema', format: 'Dolby Cinema', date: today, time: '6:00 PM', basePrice: 17.00, bookedSeats: [] },
            { movieId: movieRefs[1].id, movieTitle: 'Oppenheimer', hall: 'Hall 2', format: '2D', date: tomorrow, time: '1:00 PM', basePrice: 10.20, bookedSeats: [] },
            { movieId: movieRefs[2].id, movieTitle: 'The Dark Knight', hall: '4DX Hall', format: '4DX', date: today, time: '9:30 PM', basePrice: 22.00, bookedSeats: [] },
            { movieId: movieRefs[2].id, movieTitle: 'The Dark Knight', hall: 'Hall 4', format: '3D', date: tomorrow, time: '4:00 PM', basePrice: 14.00, bookedSeats: [] },
        ];
        screeningsData.forEach(s => batch.set(db.collection('screenings').doc(), { ...s, createdAt: new Date().toISOString() }));

        const products = [
            { name: 'Large Popcorn', category: 'popcorn', price: 12.50 },
            { name: 'Medium Popcorn', category: 'popcorn', price: 9.50 },
            { name: 'Nachos & Salsa', category: 'snack', price: 8.50 },
            { name: 'Coca-Cola Large', category: 'drink', price: 6.00 },
            { name: 'Coca-Cola Medium', category: 'drink', price: 4.50 },
            { name: 'Water Bottle', category: 'drink', price: 3.00 },
            { name: 'Candy Bundle', category: 'snack', price: 5.50 },
        ];
        products.forEach(p => batch.set(db.collection('products').doc(), p));

        const staff = [
            { name: 'Alice Johnson', role: 'General Manager', shift: 'Morning' },
            { name: 'Bob Smith', role: 'Head Projectionist', shift: 'Evening' },
            { name: 'Charlie Davis', role: 'Concessions Lead', shift: 'Afternoon' },
            { name: 'Diana Lee', role: 'Ticketing Supervisor', shift: 'Morning' },
        ];
        staff.forEach(s => batch.set(db.collection('staff').doc(), s));

        await batch.commit();
        res.json({ message: 'Database seeded successfully with relational screenings!' });
    } catch (error) {
        res.status(500).json({ error: 'Seeding failed', details: error.message });
    }
});

app.listen(PORT, () => console.log(`🎬 API: http://localhost:${PORT}`));
