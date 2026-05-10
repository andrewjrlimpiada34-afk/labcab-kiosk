import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Clock, Package, CheckCircle, AlertTriangle, ArrowRight, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { Transaction } from '../types';

const ReturnActive: React.FC = () => {
  const { setView, currentUser, setSelectedItems } = useApp();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTx, setSelectedTx] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!currentUser) return;
      setLoading(true);
      try {
        const q = query(
          collection(db, 'transactions'), 
          where('borrowerID', '==', currentUser.studentID),
          where('status', '==', 'active')
        );
        const querySnapshot = await getDocs(q);
        setTransactions(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction)));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [currentUser]);

  const handleSelectTransaction = (tx: Transaction) => {
    setSelectedTx(tx.id!);
    setSelectedItems(tx.borrowedItems);
  };

  const currentTx = transactions.find(t => t.id === selectedTx);

  return (
    <div className="flex-1 flex flex-col p-12 bg-slate-50/30 overflow-y-auto custom-scrollbar">
      <div className="max-w-4xl mx-auto w-full">
        <div className="mb-14 flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Active Sessions</h2>
            <p className="text-xl text-slate-500 font-medium tracking-tight">Select the borrowed assets you wish to return.</p>
          </div>
          <button 
            onClick={() => setView('return-auth')}
            className="flex items-center gap-2 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-600 transition-colors"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>

        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center text-slate-400 gap-6">
            <div className="relative">
              <Loader2 size={64} className="animate-spin text-indigo-500 opacity-20" />
              <Loader2 size={64} className="animate-spin text-indigo-600 absolute top-0 left-0 clip-path-half" />
            </div>
            <p className="font-black uppercase tracking-widest text-slate-300">Searching your borrows...</p>
          </div>
        ) : transactions.length > 0 ? (
          <div className="space-y-8">
            {transactions.map((tx) => (
              <motion.div
                key={tx.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectTransaction(tx)}
                className={`p-10 rounded-[3rem] cursor-pointer transition-all border-4 relative overflow-hidden group ${
                  selectedTx === tx.id 
                    ? 'bg-white border-indigo-600 shadow-2xl shadow-indigo-100' 
                    : 'bg-white border-white shadow-xl shadow-slate-200/50 hover:border-slate-100'
                }`}
              >
                <div className="flex justify-between items-start mb-10">
                  <div className="flex items-center gap-6">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${selectedTx === tx.id ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-400'}`}>
                      <Package size={32} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 leading-tight">Laboratory Session</h3>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Ref: {tx.id?.slice(-8).toUpperCase()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 block mb-2">Return Deadline</span>
                    <span className={`text-2xl font-black tabular-nums leading-none ${new Date(tx.returnDeadline.toDate()) < new Date() ? 'text-rose-500' : 'text-slate-900'}`}>
                      {format(tx.returnDeadline.toDate(), 'hh:mm aa')}
                    </span>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 opacity-50">{format(tx.returnDeadline.toDate(), 'EEE, MMM dd')}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-10">
                  <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100/50">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest block mb-2">Started At</span>
                    <div className="flex items-center gap-3">
                      <Clock size={16} className="text-indigo-500" />
                      <span className="text-lg font-black text-slate-700 tracking-tight">{format(tx.borrowTime.toDate(), 'hh:mm aa')}</span>
                    </div>
                  </div>
                  <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100/50">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest block mb-2">Stock Count</span>
                    <div className="flex items-center gap-3">
                      <Package size={16} className="text-emerald-500" />
                      <span className="text-lg font-black text-slate-700 tracking-tight">{tx.borrowedItems.reduce((acc, i) => acc + i.quantity, 0)} Units</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {tx.borrowedItems.map((item, i) => (
                    <span key={i} className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-tight border border-indigo-100/50">
                      {item.quantity}× {item.name}
                    </span>
                  ))}
                </div>

                {selectedTx === tx.id && (
                  <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute top-8 right-8 w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-xl shadow-indigo-100 border-4 border-white"
                  >
                    <CheckCircle size={28} strokeWidth={3} />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="h-[500px] flex flex-col items-center justify-center text-center p-16 bg-white rounded-[4rem] shadow-2xl shadow-slate-200/50 border border-slate-100 border-dashed relative overflow-hidden">
            <div className="absolute inset-0 bg-slate-50/20"></div>
            <div className="relative z-10 w-36 h-36 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-10 border border-slate-100">
              <Package size={80} strokeWidth={1} />
            </div>
            <h3 className="relative z-10 text-4xl font-black text-slate-900 mb-4 tracking-tight">No Active Borrows</h3>
            <p className="relative z-10 text-xl text-slate-400 max-w-md font-medium leading-relaxed tracking-tight">Our records indicate no pending apparatus returns for this account. If this is unexpected, please consult the laboratory supervisor.</p>
            <button 
              onClick={() => setView('home')}
              className="relative z-10 mt-12 px-16 py-6 bg-slate-900 text-white rounded-3xl font-black text-xl hover:bg-slate-800 transition-all shadow-2xl shadow-slate-300 uppercase tracking-widest text-sm"
            >
              Back to System Home
            </button>
          </div>
        )}

        <AnimatePresence>
          {selectedTx && (
            <motion.div
              initial={{ y: 200 }}
              animate={{ y: 0 }}
              exit={{ y: 200 }}
              className="mt-20 flex items-center justify-between p-12 bg-slate-900 rounded-[3.5rem] shadow-[0_40px_80px_rgba(15,23,42,0.15)] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full translate-x-32 -translate-y-32"></div>
              
              <div className="flex items-center gap-8 relative z-10">
                <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-indigo-950/40">
                  <CheckCircle size={40} />
                </div>
                <div>
                  <h4 className="text-white text-3xl font-black tracking-tight leading-none">Confirm {currentTx?.borrowedItems.reduce((a, b) => a + b.quantity, 0)} Items</h4>
                  <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-3 flex items-center gap-3">
                    <AlertTriangle size={16} className="text-amber-500" />
                    Verify each individual component before confirming
                  </p>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05, x: 10 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setView('return-confirm')}
                className="relative z-10 flex items-center gap-6 px-16 py-7 gradient-blue text-white rounded-[2rem] font-black text-2xl shadow-2xl transition-all group"
              >
                <span>Process Return</span>
                <ArrowRight size={32} strokeWidth={3} className="transition-transform group-hover:translate-x-2" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ReturnActive;
