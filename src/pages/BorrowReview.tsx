import React from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Package, AlertTriangle } from 'lucide-react';

const BorrowReview: React.FC = () => {
  const { setView, selectedItems } = useApp();

  if (selectedItems.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-amber-50">
        <AlertTriangle size={80} className="text-amber-500 mb-6" />
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Your Basket is Empty</h2>
        <p className="text-xl text-gray-600 mb-10 text-center max-w-lg">Please select at least one laboratory apparatus to continue with the borrowing process.</p>
        <button 
          onClick={() => setView('borrow-select')}
          className="px-10 py-4 gradient-blue text-white rounded-2xl font-bold text-xl shadow-lg"
        >
          Go Back to Selection
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-12 bg-slate-50/30 custom-scrollbar">
      <div className="max-w-4xl mx-auto w-full">
        <div className="mb-14 flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Review Selection</h2>
            <p className="text-xl text-slate-500 font-medium tracking-tight">Verify your items before setting a return time.</p>
          </div>
          <button 
            onClick={() => setView('borrow-select')}
            className="flex items-center gap-3 text-indigo-600 font-black text-lg hover:underline underline-offset-[12px] decoration-2 uppercase tracking-widest text-sm"
          >
            <ArrowLeft size={18} />
            Edit Selection
          </button>
        </div>

        <div className="space-y-6">
          {selectedItems.map((item, idx) => (
            <motion.div
              key={item.itemId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 flex items-center justify-between hover:border-indigo-100 transition-all group"
            >
              <div className="flex items-center gap-8">
                <div className="w-20 h-20 bg-slate-50 text-indigo-600 rounded-[1.5rem] flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                  <Package size={40} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 mb-1 leading-tight">{item.name}</h3>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Scientific Equipment</p>
                </div>
              </div>
              
              <div className="bg-slate-50/80 px-10 py-6 rounded-3xl border border-slate-100 text-center min-w-[160px]">
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest block mb-2">Quantity</span>
                <span className="text-5xl font-black text-slate-900 tabular-nums leading-none">{item.quantity}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 flex justify-between items-center bg-slate-900 p-12 rounded-[3.5rem] shadow-[0_40px_80px_rgba(15,23,42,0.15)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full translate-x-32 -translate-y-32"></div>
          
          <div className="relative z-10">
            <p className="text-indigo-400 text-sm font-black uppercase tracking-[0.2em] mb-3">Session Schedule</p>
            <h4 className="text-white text-4xl font-black tracking-tight">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</h4>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05, x: 10 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setView('borrow-time')}
            className="relative z-10 flex items-center gap-6 px-14 py-7 bg-white text-slate-900 rounded-[2.5rem] font-black text-2xl shadow-2xl transition-all group"
          >
            <span>Set Return Time</span>
            <ArrowRight size={32} strokeWidth={3} className="text-indigo-600 transition-transform group-hover:translate-x-2" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default BorrowReview;
