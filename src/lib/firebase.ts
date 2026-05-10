import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

type ViteEnv = Record<string, string | undefined>;

// Vite exposes env at import.meta.env; TypeScript needs a hint for this project.
const viteEnv = (import.meta as any).env as ViteEnv;

// Firebase configuration from Vercel / .env.local
const requiredFirebaseEnvKeys = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
] as const;

type RequiredKey = (typeof requiredFirebaseEnvKeys)[number];

const missingKeys = requiredFirebaseEnvKeys.filter(
  (k) => !viteEnv[k as RequiredKey]
);

// Initialize Firebase only when required env vars are present.
// This prevents confusing runtime errors like: "undefined" is not valid JSON
// when Firebase SDK attempts to parse/serialize config-dependent values.
if (missingKeys.length > 0) {
  const pretty = missingKeys.join(', ');
  // eslint-disable-next-line no-console
  console.error(
    `[firebase] Missing required environment variables: ${pretty}. ` +
      'Create them (e.g. in .env.local) with VITE_ prefix and restart the dev server.'
  );
}

const firebaseConfig = {
  apiKey: viteEnv.VITE_FIREBASE_API_KEY,
  authDomain: viteEnv.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: viteEnv.VITE_FIREBASE_PROJECT_ID,
  storageBucket: viteEnv.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: viteEnv.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: viteEnv.VITE_FIREBASE_APP_ID,
};

const missingRequiredEnv = missingKeys.length > 0;

// Initialize Firebase App (only if env is valid)
let app: ReturnType<typeof initializeApp> | null = null;

// Optional Firestore Database ID
const firestoreDatabaseId = viteEnv.VITE_FIRESTORE_DATABASE_ID;

// Initialize Firestore/Auth/Storage (safe exports)
export const db = (() => {
  if (missingRequiredEnv) return null;
  app = initializeApp(firebaseConfig as any);
  return firestoreDatabaseId ? getFirestore(app, firestoreDatabaseId) : getFirestore(app);
})();

export const auth = (() => {
  if (missingRequiredEnv) return null;
  // app should have been created in db initializer
  return getAuth(app as any);
})();

export const storage = (() => {
  if (missingRequiredEnv) return null;
  return getStorage(app as any);
})();

// Default export: app (may be null)
// ---- NOTE ----
// This prevents confusing runtime errors like: "undefined" is not valid JSON
// when Firebase SDK attempts to parse/serialize config-dependent values.

// Connectivity Test

// Avoid eager network calls on import; OAuth/domain errors will show up in console anyway,
// but this keeps the app usable even if Firestore rules/network are temporarily misconfigured.
export async function testFirebaseConnection() {
  try {
    if (!db) {
      console.error('[firebase] Skipping connection test: Firebase is not initialized (missing env vars).');
      return;
    }
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('Firebase connected successfully.');
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration or internet connection.');
    } else {
      console.error('Firebase connection error:', error);
    }
  }
}



