import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD7mZecZfK7A4YAS862QcjC8oO3_UPSiT0",
  authDomain: "vocal-morph.firebaseapp.com",
  projectId: "vocal-morph",
  storageBucket: "vocal-morph.firebasestorage.app",
  messagingSenderId: "609577046526",
  appId: "1:609577046526:web:2f80f5100f44dab17c70af"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);