// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDWQ7zlEqFhiRAeZfjAvNCJZxX6mOpjKaA",
    authDomain: "pttmc-281e8.firebaseapp.com",
    projectId: "pttmc-281e8",
    storageBucket: "pttmc-281e8.firebasestorage.app",
    messagingSenderId: "31051711952",
    appId: "1:31051711952:web:4de504f05921cbf47d25d5",
    measurementId: "G-75YM8F0D4C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };