import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, updateDoc, doc, serverTimestamp, increment } from 'firebase/firestore';
import { motion } from 'motion/react';
import { ShieldCheck, Package, Check, Lock } from 'lucide-react';
import SuccessScreen from './SuccessScreen';
import LoadingOverlay from '../components/LoadingOverlay';

const ReturnConfirm: React.FC = () => {
  const { setView, selectedItems, currentUser } = useApp();
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleConfirm = async () => {
    if (!currentUser || selectedItems.length === 0) return;
    
    setLoading(true);
    try {
      // 1. Find the active transaction
      const q = query(
        collection(db, 'transactions'), 
        where('borrowerID', '==', currentUser.studentID),
        where('status', '==', 'active')
      );
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        // In this simple demo, we mark the first active transaction as returned
        // In a real system, you'd match by specific transaction ID from selectedItems context
        const txDoc = querySnapshot.docs[0];
        
        // 2. Update Transaction
        await updateDoc(doc(db, 'transactions', txDoc.id), {
          status: 'returned',
          actualReturnTime: serverTimestamp()
        });

        // 3. Update inventory (add back)
        for (const item of selectedItems) {
          const itemRef = doc(db, 'inventory', item.itemId);
          await updateDoc(itemRef, {
            availableQuantity: increment(item.quantity)
          });
        }
      }

      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      alert('Failed to process return. Please contact admin.');
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <SuccessScreen 
        title="Return Successful!"
        message="Thank you for returning the apparatus. The compartments have been locked securely."
        nextView="home"
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-12 bg-slate-50/30 overflow-y-auto custom-scrollbar">
      <LoadingOverlay isVisible={loading} message="Securing return..." />
      
      <div className="w-full max-w-2xl bg-white rounded-[4rem] shadow-[0_40px_80px_rgba(15,23,42,0.15)] border border-slate-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -translate-y-32 translate-x-32 group-hover:bg-indigo-50 transition-colors"></div>
        
        <div className="p-12 border-b border-slate-50 text-center relative z-10">
          <div className="w-24 h-24 bg-slate-900 text-white rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-slate-200">
            <Lock size={44} strokeWidth={1.5} />
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-3">Cabinet Access Check</h2>
          <p className="text-xl text-slate-400 font-medium tracking-tight">Confirm you have secured all items in their bays.</p>
        </div>

        <div className="p-12 relative z-10">
          <div className="bg-indigo-50/50 p-10 rounded-[2.5rem] border border-indigo-100/50 mb-12 text-center group transition-all hover:bg-white hover:shadow-md">
            <p className="text-xl font-bold text-slate-900 leading-relaxed tracking-tight">
              The designated cabinet compartments for {selectedItems.length} items will be prioritized for your return session.
            </p>
          </div>

          <div className="space-y-4 mb-14">
            {selectedItems.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-8 bg-slate-50/50 border border-slate-100 rounded-3xl transition-all hover:bg-white hover:shadow-lg">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm text-indigo-600">
                     <Package size={24} />
                  </div>
                  <span className="text-2xl font-black text-slate-800 tracking-tight uppercase leading-tight">{item.name}</span>
                </div>
                <div className="px-8 py-3 bg-slate-900 text-white rounded-[1.25rem] font-black text-2xl tabular-nums shadow-lg shadow-slate-200">
                  {item.quantity}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-6">
            <button 
              onClick={() => setView('return-active')}
              className="flex-1 py-8 bg-white border border-slate-200 text-slate-400 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-50 hover:text-slate-600 transition-all flex items-center justify-center shadow-xl shadow-slate-100/50"
            >
              Cancel Access
            </button>
            <motion.button
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleConfirm}
              className="flex-[2] py-8 gradient-blue text-white rounded-[2rem] font-black text-3xl shadow-[0_20px_40px_rgba(79,70,229,0.25)] flex items-center justify-center gap-6 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              <Check size={40} strokeWidth={4} className="relative z-10 transition-transform group-hover:scale-125" />
              <span className="relative z-10">Confirm Return</span>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnConfirm;
