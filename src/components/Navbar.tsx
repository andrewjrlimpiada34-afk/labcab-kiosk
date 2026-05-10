import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Clock, Calendar, ShieldCheck, Home } from 'lucide-react';
import { motion } from 'motion/react';

const Navbar: React.FC = () => {
  const { view, setView, resetToHome } = useApp();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <nav className="h-24 px-10 flex items-center justify-between bg-white border-b border-slate-200 nav-shadow z-50">
      <div className="flex items-center gap-4 cursor-pointer group" onClick={resetToHome}>
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105">
          <div className="w-5 h-5 border-2 border-white rounded-sm rotate-45"></div>
        </div>
        <div className="flex flex-col">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 leading-none">
            Lab<span className="text-indigo-600">Cab</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1 leading-none">
            Smart Laboratory Cabinet
          </p>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="hidden md:flex items-center gap-8">
          <div className="text-right">
            <div className="text-xl font-bold text-slate-700 leading-none">
              {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
            </div>
            <div className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">
              {time.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
          <div className="h-10 w-px bg-slate-200"></div>
        </div>

        <div className="flex items-center gap-3">
          {view !== 'home' && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={resetToHome}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-full transition-colors"
            >
              <Home size={18} />
              <span>Home</span>
            </motion.button>
          )}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setView('admin-login')}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-full transition-colors"
          >
            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></span>
            Admin Login
          </motion.button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
