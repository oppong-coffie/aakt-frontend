import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBeB5bFumau3-x7hSRJ1HbVVuEsJwnfbNo",
  authDomain: "blaccbook-dev.firebaseapp.com",
  projectId: "blaccbook-dev",
  storageBucket: "blaccbook-dev.firebasestorage.app",
  messagingSenderId: "547353025123",
  appId: "1:547353025123:web:7534528877693468cf7656",
  measurementId: "G-VE3WQ9NBLF"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;