import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isVisible, message = 'Processing...' }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-xl"
        >
          <div className="bg-white p-16 rounded-[4rem] shadow-[0_40px_80px_rgba(0,0,0,0.2)] text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -translate-y-12 translate-x-12"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="relative w-24 h-24 mb-10">
                <Loader2 size={80} className="text-indigo-600 animate-spin absolute top-0 left-0" />
                <Loader2 size={80} className="text-slate-100 absolute top-0 left-0 opacity-20" />
              </div>
              
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] mb-4">System in Progress</p>
              <h3 className="text-3xl font-black text-slate-800 tracking-tight leading-none">{message}</h3>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingOverlay;
