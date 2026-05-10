import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

type ViteEnv = Record<string, string | undefined>;

// Vite exposes env at import.meta.env; TypeScript needs a hint for this project.
const viteEnv = (import.meta as any).env as ViteEnv;

// Firebase configuration from Vercel / .env.local
const firebaseConfig = {
  apiKey: viteEnv.VITE_FIREBASE_API_KEY,
  authDomain: viteEnv.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: viteEnv.VITE_FIREBASE_PROJECT_ID,
  storageBucket: viteEnv.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: viteEnv.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: viteEnv.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig as any);

// Optional Firestore Database ID
const firestoreDatabaseId = viteEnv.VITE_FIRESTORE_DATABASE_ID;

// Initialize Firestore
export const db = firestoreDatabaseId
  ? getFirestore(app, firestoreDatabaseId)
  : getFirestore(app);

// Initialize Firebase Services
export const auth = getAuth(app);
export const storage = getStorage(app);

// Connectivity Test
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('Firebase connected successfully.');
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes('the client is offline')
    ) {
      console.error(
        'Please check your Firebase configuration or internet connection.'
      );
    } else {
      console.error('Firebase connection error:', error);
    }
  }
}

testConnection();

export default app;