import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCzR9tzxa5NLAGlHHWVaI2ix1Ox1eCu7i0",
  authDomain: "retail-trader-f5a0b.firebaseapp.com",
  projectId: "retail-trader-f5a0b",
  storageBucket: "retail-trader-f5a0b.firebasestorage.app",
  messagingSenderId: "255061434853",
  appId: "1:255061434853:web:e4287390481b76cbe4cf0c",
  measurementId: "G-QLK3NKHKTZ"
};

// Initialize Firebase securely for Next.js SSR
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
