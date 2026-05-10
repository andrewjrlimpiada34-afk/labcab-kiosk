import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Fix for Firebase SDK bug where it tries to parse "undefined" as JSON
(function fixFirebaseDefaults() {
  if (typeof window !== 'undefined') {
    const globals = [window, (window as any).process?.env, (window as any).zf, globalThis];
    globals.forEach(obj => {
      if (!obj) return;
      try {
        if (obj.__FIREBASE_DEFAULTS__ === 'undefined' || obj.__FIREBASE_DEFAULTS__ === undefined) {
          obj.__FIREBASE_DEFAULTS__ = '{}';
        }
        if (obj.FIREBASE_CONFIG === 'undefined' || obj.FIREBASE_CONFIG === undefined) {
          obj.FIREBASE_CONFIG = '{}';
        }
      } catch (e) {
        // Ignore potential cross-origin or read-only errors
      }
    });
  }
})();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
