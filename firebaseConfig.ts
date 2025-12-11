import { initializeApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

// Declare process to avoid TypeScript errors
declare const process: { env: Record<string, string> };

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

let app;
let auth: Auth;
let db: Firestore;
let initializationError: string | null = null;

try {
  // Check if config is valid to prevent silent crashes or confusing errors
  if (!firebaseConfig.apiKey || firebaseConfig.apiKey === 'undefined') {
     throw new Error("Firebase API Key is missing. Please configure GitHub Secrets.");
  }

  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error: any) {
  console.error("Firebase Initialization Error:", error);
  initializationError = error.message;
}

export { auth, db, initializationError };