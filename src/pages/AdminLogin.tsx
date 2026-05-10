import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { auth, db } from '../lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { motion } from 'motion/react';
import { ShieldCheck, Mail, Lock, ArrowLeft, AlertCircle } from 'lucide-react';
import LoadingOverlay from '../components/LoadingOverlay';

const AdminLogin: React.FC = () => {
  const { setView, setIsAdmin } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (!auth || !db) {
        setError('Firebase is not configured. Check VITE_FIREBASE_* env vars.');
        return;
      }

      // 1) Auth Login
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // 2) Check if user is admin by matching your Firestore rules:
      // firestore.rules: isAdmin() => exists(admins/{request.auth.uid})
      const uid = userCredential.user.uid;
      const adminDoc = await getDoc(doc(db, 'admins', uid));

      if (!adminDoc.exists()) {
        setError('Access denied. You are not registered as an administrator.');
        return;
      }

      // Ensure admin state flips only after Firestore authz is confirmed
      setIsAdmin(true);

      setView('admin-dashboard');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid administrator email or password.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please try again later.');
      } else {
        setError('Authentication failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-950 overflow-hidden relative">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

      <LoadingOverlay isVisible={loading} message="Authenticating Administrator..." />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg z-10"
      >
        <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-200">
          <div className="p-12 border-b border-slate-50 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-slate-900 text-white rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-slate-200">
              <ShieldCheck size={40} />
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Admin Portal</h2>
            <p className="text-lg text-slate-500 font-medium leading-relaxed">Secure access to manual controls and system inventory.</p>
          </div>

          <form onSubmit={handleLogin} className="p-12 space-y-8">
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-700 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-16 pr-8 py-5 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-bold text-lg transition-all"
                  placeholder="admin@labcab.com"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-slate-700 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-16 pr-8 py-5 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-bold text-lg transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }}
                className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl flex items-center gap-3 font-bold text-sm animate-shake"
              >
                <AlertCircle size={20} />
                <span>{error}</span>
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-6 bg-slate-900 text-white rounded-2xl font-black text-xl shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3"
            >
              Log In to Dashboard
            </motion.button>
          </form>
        </div>

        <button 
          onClick={() => setView('home')}
          className="mt-8 text-slate-400 hover:text-white transition-colors font-bold flex items-center gap-2 mx-auto uppercase text-xs tracking-widest"
        >
          <ArrowLeft size={16} />
          Back to Public Kiosk
        </button>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
