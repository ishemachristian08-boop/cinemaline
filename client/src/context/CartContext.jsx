import React, { createContext, useContext, useState, useCallback } from 'react';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [screening, setScreening] = useState(null); // { id, movie, date, time, hall }
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [selectedCombo, setSelectedCombo] = useState(null);
    const [selectedSnacks, setSelectedSnacks] = useState([]);

    // ---- Seat helpers ----
    const toggleSeat = useCallback((seat) => {
        setSelectedSeats(prev => {
            const exists = prev.find(s => s.id === seat.id);
            if (exists) return prev.filter(s => s.id !== seat.id);
            return [...prev, seat];
        });
    }, []);

    const clearSeats = () => setSelectedSeats([]);

    // ---- Snack helpers ----
    const setCombo = (combo) => setSelectedCombo(combo); // { name, popcorn, drink, snack, price, discount }
    const clearCombo = () => setSelectedCombo(null);

    const addSnack = (snack) => setSelectedSnacks(prev => [...prev, snack]);
    const removeSnack = (index) => setSelectedSnacks(prev => prev.filter((_, i) => i !== index));
    const clearSnacks = () => setSelectedSnacks([]);

    // ---- Pricing ----
    const seatTotal = selectedSeats.reduce((acc, s) => acc + (s.price || 0), 0);
    const comboTotal = selectedCombo ? selectedCombo.price : 0;
    const snacksTotal = selectedSnacks.reduce((acc, s) => acc + (s.price || 0), 0);
    const bookingFee = selectedSeats.length > 0 ? 4.50 : 0;
    const taxRate = 0.10;
    const subtotal = seatTotal + comboTotal + snacksTotal;
    const taxes = parseFloat((subtotal * taxRate).toFixed(2));
    const grandTotal = parseFloat((subtotal + bookingFee + taxes).toFixed(2));

    // ---- Clear everything ----
    const clearCart = () => {
        setSelectedSeats([]);
        setSelectedCombo(null);
        setSelectedSnacks([]);
        setScreening(null);
    };

    return (
        <CartContext.Provider value={{
            screening, setScreening,
            selectedSeats, toggleSeat, clearSeats,
            selectedCombo, setCombo, clearCombo,
            selectedSnacks, addSnack, removeSnack, clearSnacks,
            seatTotal, comboTotal, snacksTotal,
            bookingFee, taxes, subtotal, grandTotal,
            clearCart,
        }}>
            {children}
        </CartContext.Provider>
    );
};
