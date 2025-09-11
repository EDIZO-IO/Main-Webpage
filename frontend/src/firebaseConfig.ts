// src/firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';


// TODO: Replace with your project's configuration
const firebaseConfig = {
  apiKey: "AIzaSyBa_gD1ALHXV7aiOK-pMKOqIoS7DGgoLIw",
  authDomain: "edizobackend.firebaseapp.com",
  databaseURL: "https://edizobackend-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "edizobackend",
  storageBucket: "edizobackend.firebasestorage.app",
  messagingSenderId: "1002381596917",
  appId: "1:1002381596917:web:eb9e1aadfbc1a49c638dbc",
  measurementId: "G-HGQB8FZ18D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;