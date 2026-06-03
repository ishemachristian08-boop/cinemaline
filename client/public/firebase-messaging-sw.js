// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.14.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.14.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDikJlEINevSDqNjFnLuCnSNbZChn70Mqs",
  authDomain: "omnview.firebaseapp.com",
  projectId: "omnview",
  storageBucket: "omnview.firebasestorage.app",
  messagingSenderId: "1058315020244",
  appId: "1:1058315020244:web:64b7e559978ead7d8f5841",
});

const messaging = firebase.messaging();

// Background notification handler
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo192.png' // Ensure this exists or use a generic icon
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
