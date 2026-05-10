import React from 'react';
import { useApp } from '../context/AppContext';
import KioskButton from '../components/KioskButton';
import { UserPlus, Package, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';

const Home: React.FC = () => {
  const { setView } = useApp();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <main className="flex-1 flex flex-col items-center justify-center p-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">
            Welcome to <span className="text-indigo-600">LabCab</span>
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium lead-relaxed">
            Automated laboratory apparatus management system. Please select an action below to begin your session.
          </p>
        </motion.div>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full max-w-5xl"
        >
          <motion.div variants={item} className="h-80">
            <KioskButton 
              className="w-full h-full"
              variant="primary"
              icon={<UserPlus size={40} strokeWidth={2} />}
              label="Register"
              onClick={() => setView('register')}
            >
              Create a new student account to access laboratory inventory.
            </KioskButton>
          </motion.div>

          <motion.div variants={item} className="h-80">
            <KioskButton 
              className="w-full h-full"
              variant="accent"
              icon={<Package size={40} strokeWidth={2} />}
              label="Borrow"
              onClick={() => setView('borrow-auth')}
            >
              Authenticate to borrow apparatus and track your usage.
            </KioskButton>
          </motion.div>

          <motion.div variants={item} className="h-80">
            <KioskButton 
              className="w-full h-full"
              variant="secondary"
              icon={<RotateCcw size={40} strokeWidth={2} />}
              label="Return"
              onClick={() => setView('return-auth')}
            >
              Returning items? Log in to update inventory status.
            </KioskButton>
          </motion.div>
        </motion.div>
      </main>

      <footer className="h-16 bg-slate-900 flex items-center justify-between px-10 text-white shrink-0 shadow-2xl">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-3">
            <span className="text-slate-500 font-bold text-[10px] uppercase tracking-wider">Active Borrows:</span>
            <span className="bg-indigo-500 text-[11px] font-black px-2.5 py-1 rounded">24</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-500 font-bold text-[10px] uppercase tracking-wider">Overdue:</span>
            <span className="bg-rose-500 text-[11px] font-black px-2.5 py-1 rounded">03</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-slate-400 font-medium">System Online</span>
          </div>
          <div className="h-4 w-px bg-slate-700"></div>
          <span className="text-xs text-slate-500 font-mono">v2.4.1 • Raspberry Pi Kiosk</span>
        </div>
      </footer>
    </div>
  );
};

export default Home;
