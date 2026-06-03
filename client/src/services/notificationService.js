// notificationService.js — Firebase Messaging removed
import { registerFCMToken } from "./api";
import toast from "react-hot-toast";

export const requestNotificationPermission = async (userId) => {
    try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            // FCM removed: we cannot provide a token. Inform and return null.
            console.log('Notifications granted (FCM removed)');
            // Optionally call backend to mark permission granted
            try {
                await registerFCMToken(userId, null);
            } catch (e) {
                // ignore registration errors
            }
            return null;
        }
        return null;
    } catch (error) {
        console.error('Notification permission request failed:', error);
        return null;
    }
};

export const onMessageListener = () =>
    new Promise((_, reject) => {
        // FCM removed: foreground message listening is not available.
        reject(new Error('FCM messaging has been removed from this project.'));
    });
