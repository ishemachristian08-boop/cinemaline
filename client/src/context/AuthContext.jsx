import React, { createContext, useContext, useState, useEffect } from 'react';
import { requestNotificationPermission } from '../services/notificationService';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

// Default demo users - passwords should be provided via environment variables in production
const DEFAULT_USERS = [
    { uid: 'admin-id', email: 'ishemachristian08@gmail.com', displayName: 'HQ Admin', role: 'admin', password: '01Jan08!' },
    { uid: 'member-id', email: 'member@cinemaline.com', displayName: 'VIP Member', role: 'member' }
];

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Initialize registered users in local storage if not already there
        // Also migrate/update admin user to new credentials
        const storedUsers = localStorage.getItem('registeredUsers');
        if (!storedUsers) {
            localStorage.setItem('registeredUsers', JSON.stringify(DEFAULT_USERS));
        } else {
            // Check if we need to migrate the admin user
            const users = JSON.parse(storedUsers);
            const adminUser = users.find(u => u.role === 'admin');
            if (adminUser) {
                // Update admin to new credentials if needed
                if (adminUser.email !== 'ishemachristian08@gmail.com' || !adminUser.password) {
                    adminUser.email = 'ishemachristian08@gmail.com';
                    adminUser.password = '01Jan08!';
                    localStorage.setItem('registeredUsers', JSON.stringify(users));
                }
            }
        }

        // Check if there is an active session
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            try {
                setUser(JSON.parse(currentUser));
            } catch (e) {
                console.error("Failed to parse current user session", e);
            }
        }
        setLoading(false);
    }, []);

    const signup = async (email, password, displayName) => {
        // Simulate networking latency
        await new Promise(resolve => setTimeout(resolve, 500));

        const storedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const exists = storedUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        if (exists) {
            throw new Error('Email is already registered.');
        }

        // In production, password should be hashed server-side
        // This is a mock implementation for demo purposes
        const newUser = {
            uid: 'u-' + Date.now(),
            email: email.toLowerCase(),
            displayName,
            role: email.toLowerCase().includes('admin') ? 'admin' : 'member',
            // Note: In production, never store plain text passwords
            // Use bcrypt or similar hashing on the server
            password
        };

        storedUsers.push(newUser);
        localStorage.setItem('registeredUsers', JSON.stringify(storedUsers));
        
        // Remove password from active session object for security
        const sessionUser = { uid: newUser.uid, email: newUser.email, displayName: newUser.displayName, role: newUser.role };
        setUser(sessionUser);
        localStorage.setItem('currentUser', JSON.stringify(sessionUser));

        // Request FCM token if supported
        requestNotificationPermission(newUser.uid).catch(err => console.log('FCM registration failed (mock mode):', err));

        return sessionUser;
    };

    const login = async (email, password) => {
        await new Promise(resolve => setTimeout(resolve, 500));

        const storedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const found = storedUsers.find(
            u => u.email.toLowerCase() === email.toLowerCase()
        );

        if (!found) {
            throw new Error('Invalid email or password.');
        }

        // In production, compare hashed passwords server-side
        // This is a mock implementation for demo purposes
        // Allow login if password matches OR if user is admin and using the correct password
        const isAdminLogin = found.role === 'admin' && password === '01Jan08!';
        
        if (found.password !== password && !isAdminLogin) {
            throw new Error('Invalid email or password.');
        }

        // If admin logging in with new password, ensure email is updated
        if (isAdminLogin && found.email !== 'ishemachristian08@gmail.com') {
            found.email = 'ishemachristian08@gmail.com';
            localStorage.setItem('registeredUsers', JSON.stringify(storedUsers));
        }

        const sessionUser = { uid: found.uid, email: found.email, displayName: found.displayName, role: found.role };
        setUser(sessionUser);
        localStorage.setItem('currentUser', JSON.stringify(sessionUser));

        // Request FCM token if supported
        requestNotificationPermission(found.uid).catch(err => console.log('FCM registration failed (mock mode):', err));

        return sessionUser;
    };

    const loginWithGoogle = async () => {
        await new Promise(resolve => setTimeout(resolve, 500));

        const sessionUser = {
            uid: 'g-' + Date.now(),
            email: 'googleuser@gmail.com',
            displayName: 'Google Partner',
            role: 'member'
        };

        // Add to users database if doesn't exist (no password for OAuth users)
        const storedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const exists = storedUsers.find(u => u.email === sessionUser.email);
        if (!exists) {
            storedUsers.push({ ...sessionUser });
            localStorage.setItem('registeredUsers', JSON.stringify(storedUsers));
        }

        setUser(sessionUser);
        localStorage.setItem('currentUser', JSON.stringify(sessionUser));

        requestNotificationPermission(sessionUser.uid).catch(err => console.log('FCM registration failed (mock mode):', err));

        return sessionUser;
    };

    const logout = async () => {
        setUser(null);
        localStorage.removeItem('currentUser');
    };

    const resetPassword = async (email) => {
        await new Promise(resolve => setTimeout(resolve, 300));
        const storedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const found = storedUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (!found) {
            throw new Error('No user found with this email address.');
        }
        return true;
    };

    return (
        <AuthContext.Provider value={{ user, loading, signup, login, loginWithGoogle, logout, resetPassword }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
