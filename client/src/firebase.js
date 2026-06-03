// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB0DrSDV14vE-4odnJqoO0gp4OJmx23sSA",
  authDomain: "cinemaline1-8fa31.firebaseapp.com",
  projectId: "cinemaline1-8fa31",
  storageBucket: "cinemaline1-8fa31.firebasestorage.app",
  messagingSenderId: "317018020452",
  appId: "1:317018020452:web:88e030402f91a8cf725d71",
  measurementId: "G-YYPVCN817R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);