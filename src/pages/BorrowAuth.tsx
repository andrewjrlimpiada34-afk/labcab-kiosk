import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { QrCode, Keyboard, ArrowLeft, AlertCircle } from 'lucide-react';
import QRScanner from '../components/QRScanner';
import PINPad from '../components/PINPad';
import LoadingOverlay from '../components/LoadingOverlay';

const BorrowAuth: React.FC = () => {
  const { setView, setCurrentUser } = useApp();
  const [method, setMethod] = useState<'qr' | 'pin'>('qr');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [studentID, setStudentID] = useState('');
  const [pin, setPin] = useState('');

  const handleAuth = async (id: string, code?: string) => {
    setLoading(true);
    setError(null);
    try {
      const usersRef = collection(db, 'users');
      let q;
      if (code) {
        // QR Login
        q = query(usersRef, where('qrCode', '==', id));
      } else {
        // PIN Login
        q = query(usersRef, where('studentID', '==', id), where('pin', '==', pin));
      }
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        setError(code ? 'Invalid QR Code.' : 'Invalid Student ID or PIN.');
        setLoading(false);
        return;
      }

      const userDoc = querySnapshot.docs[0];
      const data = userDoc.data() as object;
      setCurrentUser({ id: userDoc.id, ...data } as any);
      setView('borrow-select');
    } catch (err) {
      console.error(err);
      setError('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <LoadingOverlay isVisible={loading} message="Verifying account..." />
      
      <div className="w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl border border-slate-200 overflow-hidden">
        <div className="p-10 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Authentication</h2>
            <p className="text-slate-500 font-medium">Verify your identity to borrow apparatus.</p>
          </div>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => setView('home')}
            className="p-3 bg-slate-100 rounded-2xl text-slate-400 hover:text-slate-600 transition-colors"
          >
            <ArrowLeft size={24} />
          </motion.button>
        </div>

        <div className="p-4 bg-slate-50 flex gap-2">
          <button 
            onClick={() => setMethod('qr')}
            className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl font-bold transition-all ${method === 'qr' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
          >
            <QrCode size={20} />
            Via QR Code
          </button>
          <button 
            onClick={() => setMethod('pin')}
            className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl font-bold transition-all ${method === 'pin' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
          >
            <Keyboard size={20} />
            Via Student ID + PIN
          </button>
        </div>

        <div className="p-12 min-h-[500px] flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {method === 'qr' ? (
              <motion.div
                key="qr"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full text-center"
              >
                <div className="mb-8">
                  <QRScanner onScan={(data) => handleAuth(data, 'code')} />
                </div>
                <p className="text-lg text-gray-500 font-medium">Scan your LabCab ID card containing the QR code.</p>
              </motion.div>
            ) : (
              <motion.div
                key="pin"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full flex flex-col items-center"
              >
                <div className="w-full max-w-sm mb-8 space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">Student ID</label>
                    <input 
                      type="text" 
                      value={studentID} 
                      onChange={(e) => setStudentID(e.target.value)}
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-black text-xl text-center tracking-[0.2em] text-slate-900 placeholder:tracking-normal placeholder:font-medium placeholder:text-base"
                      placeholder="e.g. 2024-1234"
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1 text-center">Enter 6-digit PIN</p>
                    <PINPad 
                      value={pin} 
                      onChange={setPin} 
                      maxLength={6} 
                      onComplete={() => studentID && handleAuth(studentID)}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }}
              className="mt-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl flex items-center gap-3 font-bold text-sm animate-shake"
            >
              <AlertCircle size={20} />
              <span>{error}</span>
            </motion.div>
          )}

          {method === 'pin' && (
            <motion.button
              disabled={!studentID || pin.length < 6}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAuth(studentID)}
              className="mt-10 w-full max-w-xs py-5 gradient-blue text-white rounded-2xl font-black text-xl shadow-xl shadow-indigo-100 disabled:opacity-50 disabled:grayscale transition-all"
            >
              Log In
            </motion.button>
          )}

          <div className="mt-12 text-center">
            <p className="text-slate-400 font-bold text-sm uppercase tracking-tight">Don't have an account?</p>
            <button 
              onClick={() => setView('register')}
              className="mt-2 text-indigo-600 font-black text-lg hover:underline decoration-2 underline-offset-4"
            >
              Register for a new LabCab ID
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BorrowAuth;
