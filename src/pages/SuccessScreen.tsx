import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SuccessScreenProps {
  title: string;
  message: string;
  nextView: any;
  duration?: number;
}

const SuccessScreen: React.FC<SuccessScreenProps> = ({ title, message, nextView, duration = 4000 }) => {
  const { setView, resetToHome } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (nextView === 'home') resetToHome();
      else setView(nextView);
    }, duration);

    return () => clearTimeout(timer);
  }, [nextView, duration, setView, resetToHome]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-12 bg-slate-50 z-50 overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2"></div>

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 15, stiffness: 150 }}
        className="w-56 h-56 bg-indigo-600 rounded-[3.5rem] flex items-center justify-center text-white mb-12 shadow-[0_40px_80px_rgba(79,70,229,0.3)] relative z-10"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-indigo-600 rounded-[3.5rem] blur-xl opacity-20"
        ></motion.div>
        <CheckCircle2 size={112} strokeWidth={1.5} className="relative z-10" />
      </motion.div>

      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-6xl font-black text-slate-900 mb-6 text-center tracking-tight leading-none relative z-10"
      >
        {title}
      </motion.h2>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-2xl text-slate-500 text-center max-w-2xl font-medium leading-relaxed tracking-tight relative z-10 px-6"
      >
        {message}
      </motion.p>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-16 text-slate-400 font-black uppercase text-[10px] tracking-[0.4em] flex items-center gap-6 bg-white px-10 py-5 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 relative z-10"
      >
        <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <span>System Resetting</span>
      </motion.div>
    </div>
  );
};

export default SuccessScreen;
