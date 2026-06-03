// Use environment variable for API base URL, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// --- Movies ---
export const fetchMovies = async () => {
    const response = await fetch(`${API_BASE_URL}/movies`);
    if (!response.ok) throw new Error('Failed to fetch movies');
    return response.json();
};

export const addMovie = async (movieData) => {
    const response = await fetch(`${API_BASE_URL}/movies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movieData),
    });
    if (!response.ok) throw new Error('Failed to add movie');
    return response.json();
};

export const updateMovie = async (id, movieData) => {
    const response = await fetch(`${API_BASE_URL}/movies/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movieData),
    });
    if (!response.ok) throw new Error('Failed to update movie');
    return response.json();
};

export const deleteMovie = async (id) => {
    const response = await fetch(`${API_BASE_URL}/movies/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete movie');
    return response.json();
};

// --- Products (Concessions) ---
export const fetchProducts = async () => {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
};

export const addProduct = async (data) => {
    const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return response.json();
};

export const updateProduct = async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return response.json();
};

export const deleteProduct = async (id) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
    });
    return response.json();
};

// --- Staff ---
export const fetchStaff = async () => {
    const response = await fetch(`${API_BASE_URL}/staff`);
    if (!response.ok) throw new Error('Failed to fetch staff');
    return response.json();
};

export const addStaff = async (data) => {
    const response = await fetch(`${API_BASE_URL}/staff`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return response.json();
};

export const updateStaff = async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/staff/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return response.json();
};

export const deleteStaff = async (id) => {
    const response = await fetch(`${API_BASE_URL}/staff/${id}`, {
        method: 'DELETE',
    });
    return response.json();
};

// --- Orders ---
export const createOrder = async (orderData) => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
    });
    if (!response.ok) throw new Error('Failed to create order');
    return response.json();
};

export const fetchAllOrders = async () => {
    const response = await fetch(`${API_BASE_URL}/orders`);
    if (!response.ok) throw new Error('Failed to fetch orders');
    return response.json();
};

export const fetchUserOrders = async (userId) => {
    const response = await fetch(`${API_BASE_URL}/orders/user/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch user orders');
    return response.json();
};

export const fetchScreeningSeats = async (screeningId) => {
    const response = await fetch(`${API_BASE_URL}/orders/screening/${screeningId}`);
    if (!response.ok) throw new Error('Failed to fetch booked seats');
    return response.json();
};


export const updateOrder = async (id, orderData) => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
    });
    if (!response.ok) throw new Error('Failed to update order');
    return response.json();
};

// --- Admin ---
export const fetchAdminStats = async () => {
    const response = await fetch(`${API_BASE_URL}/admin/stats`);
    if (!response.ok) throw new Error('Failed to fetch admin stats');
    return response.json();
};

// --- Screenings ---
export const fetchScreenings = async ({ movieId, date } = {}) => {
    const params = new URLSearchParams();
    if (movieId) params.append('movieId', movieId);
    if (date) params.append('date', date);
    const response = await fetch(`${API_BASE_URL}/screenings?${params}`);
    if (!response.ok) throw new Error('Failed to fetch screenings');
    return response.json();
};

export const addScreening = async (data) => {
    const response = await fetch(`${API_BASE_URL}/screenings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to add screening');
    return response.json();
};

export const updateScreening = async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/screenings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update screening');
    return response.json();
};

export const deleteScreening = async (id) => {
    const response = await fetch(`${API_BASE_URL}/screenings/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete screening');
    return response.json();
};

export const fetchScreeningPrice = async (screeningId, format, time) => {
    const params = new URLSearchParams({ format, time });
    const response = await fetch(`${API_BASE_URL}/screenings/${screeningId}/price?${params}`);
    if (!response.ok) return { price: 12.00 };
    return response.json();
};

// --- Rewards ---
export const fetchUserRewards = async (userId) => {
    const response = await fetch(`${API_BASE_URL}/rewards/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch rewards');
    return response.json();
};

export const redeemPoints = async (userId) => {
    const response = await fetch(`${API_BASE_URL}/rewards/${userId}/redeem`, { method: 'POST' });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to redeem points');
    }
    return response.json();
};

// --- Notifications ---
export const registerFCMToken = async (userId, fcmToken) => {
    const response = await fetch(`${API_BASE_URL}/notifications/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, fcmToken }),
    });
    if (!response.ok) throw new Error('Failed to register notifications');
    return response.json();
};

