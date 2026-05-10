import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { db } from '../lib/firebase';
import { collection, addDoc, updateDoc, doc, serverTimestamp, increment } from 'firebase/firestore';
import { motion } from 'motion/react';
import { Calendar, Clock, User, Package, ChevronRight, Check, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import SuccessScreen from './SuccessScreen';
import LoadingOverlay from '../components/LoadingOverlay';

const BorrowConfirm: React.FC = () => {
  const { setView, currentUser, selectedItems, returnDeadline } = useApp();
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleConfirm = async () => {
    if (!currentUser || !returnDeadline) return;
    
    setLoading(true);
    try {
      // 1. Create Transaction
      const transactionData = {
        borrowerID: currentUser.studentID,
        borrowerName: currentUser.fullname,
        borrowedItems: selectedItems,
        borrowTime: serverTimestamp(),
        returnDeadline: returnDeadline,
        status: 'active'
      };

      await addDoc(collection(db, 'transactions'), transactionData);

      // 2. Deduct inventory
      for (const item of selectedItems) {
        const itemRef = doc(db, 'inventory', item.itemId);
        await updateDoc(itemRef, {
          availableQuantity: increment(-item.quantity)
        });
      }

      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      alert('Failed to process transaction. Please contact admin.');
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <SuccessScreen 
        title="Borrowing Successful!"
        message="Please collect your apparatus from the cabinet. Don't forget to return them before the deadline."
        nextView="home"
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col p-12 bg-slate-50/30 overflow-y-auto custom-scrollbar">
      <LoadingOverlay isVisible={loading} message="Finalizing session..." />
      
      <div className="max-w-4xl mx-auto w-full">
        <div className="mb-14 text-center">
          <h2 className="text-6xl font-black text-slate-900 mb-6 tracking-tight leading-none">Authentication Finalized</h2>
          <p className="text-xl text-slate-500 font-medium tracking-tight max-w-2xl mx-auto">Confirm your credentials and the apparatus list before unlocking the cabinet.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
          {/* User Section */}
          <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-indigo-600 text-white rounded-3xl flex items-center justify-center mb-10 shadow-xl shadow-indigo-100">
              <User size={36} strokeWidth={1.5} />
            </div>
            
            <div className="w-full space-y-8">
              <div>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-2">Primary User</p>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-none">{currentUser?.fullname}</h3>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-1 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">ID Number</p>
                  <p className="text-lg font-black text-slate-900 tracking-tight">{currentUser?.studentID}</p>
                </div>
                <div className="flex-1 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Department</p>
                  <p className="text-lg font-black text-slate-900 tracking-tight">{currentUser?.course}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Time Section */}
          <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-rose-600 text-white rounded-3xl flex items-center justify-center mb-10 shadow-xl shadow-rose-100">
              <Clock size={36} strokeWidth={1.5} />
            </div>
            
            <div className="w-full space-y-8">
              <div>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-2">Deadline for Return</p>
                <h3 className="text-5xl font-black text-rose-600 tabular-nums tracking-tight leading-none">
                  {returnDeadline ? format(returnDeadline, 'hh:mm') : 'N/A'}
                  <span className="text-xl ml-2 uppercase">{returnDeadline ? format(returnDeadline, 'aa') : ''}</span>
                </h3>
              </div>

              <div className="bg-slate-900 p-6 rounded-3xl text-white">
                <div className="flex items-center justify-center gap-3">
                  <Calendar size={18} className="text-indigo-400" />
                  <span className="font-bold text-lg tracking-tight uppercase tracking-widest text-sm">{format(new Date(), 'EEEE, MMMM dd, yyyy')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Apparatus List Section */}
        <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 mb-20 relative overflow-hidden group transition-all hover:border-indigo-100">
          <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full blur-3xl translate-x-12 -translate-y-12"></div>
          
          <div className="flex items-center gap-6 mb-12">
            <div className="w-14 h-14 bg-slate-50 text-slate-900 rounded-2xl flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
              <Package size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Apparatus Inventory Check</h3>
              <p className="text-slate-400 font-medium tracking-tight">Confirms items for this borrowing session.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {selectedItems.map((item, idx) => (
              <div key={item.itemId} className="flex items-center justify-between p-7 bg-slate-50/50 rounded-3xl border border-slate-100 group-hover:bg-white group-hover:shadow-md transition-all">
                <div className="flex items-center gap-5">
                  <span className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center font-black text-slate-300 text-xs border border-slate-100 shadow-sm">
                    {idx + 1}
                  </span>
                  <span className="text-xl font-black text-slate-800 tracking-tight uppercase leading-tight">{item.name}</span>
                </div>
                <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-slate-100">
                  <span className="text-3xl font-black text-indigo-600 tabular-nums leading-none">{item.quantity}</span>
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1">Qty</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 mb-24">
          <button 
            onClick={() => setView('borrow-time')}
            className="flex-1 py-7 bg-white border border-slate-200 text-slate-400 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-50 hover:text-slate-600 transition-all flex items-center justify-center gap-4 group shadow-xl shadow-slate-100/50"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Wait, Modify Schedule
          </button>
          
          <motion.button
            whileHover={{ scale: 1.03, y: -5 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleConfirm}
            className="flex-[1.8] py-8 gradient-blue text-white rounded-[2.5rem] font-black text-3xl shadow-[0_30px_60px_rgba(79,70,229,0.25)] flex items-center justify-center gap-6 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            <Check size={40} strokeWidth={4} className="relative z-10 transition-transform group-hover:scale-125" />
            <span className="relative z-10">Confirm Borrow Request</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default BorrowConfirm;
