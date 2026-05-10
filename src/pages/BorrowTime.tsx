import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'motion/react';
import { Clock, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { addHours, format, setHours, setMinutes } from 'date-fns';

const TIME_OPTIONS = [
  { label: '1 Hour', value: 1 },
  { label: '2 Hours', value: 2 },
  { label: '3 Hours', value: 3 },
  { label: '4 Hours', value: 4 },
  { label: 'Until the End of Day', value: 'eod' }
];

const BorrowTime: React.FC = () => {
  const { setView, setReturnDeadline } = useApp();
  const [selectedOption, setSelectedOption] = useState<number | 'eod' | 'custom'>(1);
  const [customTime, setCustomTime] = useState(format(addHours(new Date(), 2), 'HH:mm'));

  const calculateDeadline = () => {
    const now = new Date();
    if (selectedOption === 'eod') {
      return setMinutes(setHours(now, 17), 0); // Default 5:00 PM
    } else if (selectedOption === 'custom') {
      const [hours, minutes] = customTime.split(':').map(Number);
      return setMinutes(setHours(now, hours), minutes);
    } else {
      return addHours(now, selectedOption as number);
    }
  };

  const handleContinue = () => {
    setReturnDeadline(calculateDeadline());
    setView('borrow-confirm');
  };

  return (
    <div className="flex-1 flex flex-col p-12 bg-slate-50/30 overflow-y-auto custom-scrollbar">
      <div className="max-w-4xl mx-auto w-full text-center mb-16">
        <h2 className="text-6xl font-black text-slate-900 mb-6 tracking-tight leading-none">Schedule Return</h2>
        <p className="text-xl text-slate-500 font-medium tracking-tight max-w-2xl mx-auto leading-relaxed">Specify the duration for your laboratory session to ensure availability.</p>
      </div>

      <div className="max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        {TIME_OPTIONS.map((opt) => (
          <motion.div
            key={opt.label}
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedOption(opt.value as any)}
            className={`p-10 rounded-[3rem] cursor-pointer transition-all border-4 relative overflow-hidden group shadow-2xl ${
              selectedOption === opt.value 
                ? 'bg-slate-900 border-indigo-600 text-white shadow-indigo-950/20' 
                : 'bg-white border-white text-slate-600 shadow-slate-200/50 hover:border-slate-100'
            }`}
          >
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full flex items-center justify-center transition-all ${selectedOption === opt.value ? 'bg-indigo-600/20 text-indigo-400' : 'bg-slate-50 text-slate-100 group-hover:text-slate-200'}`}>
              <Clock size={40} />
            </div>
            <div className={`w-14 h-14 rounded-2xl mb-8 flex items-center justify-center transition-colors ${selectedOption === opt.value ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-300'}`}>
              {selectedOption === opt.value ? <Check size={28} strokeWidth={4} /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />}
            </div>
            <h3 className="text-3xl font-black leading-tight tracking-tight pr-4">{opt.label}</h3>
          </motion.div>
        ))}

        <motion.div
          whileHover={{ y: -8, scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSelectedOption('custom')}
          className={`p-10 rounded-[3rem] cursor-pointer transition-all border-4 relative overflow-hidden flex flex-col justify-between shadow-2xl ${
            selectedOption === 'custom' 
              ? 'bg-slate-900 border-indigo-600 text-white shadow-indigo-950/20' 
              : 'bg-white border-white text-slate-600 shadow-slate-200/50 hover:border-slate-100'
          }`}
        >
          <div className="flex flex-col gap-2">
            <h3 className="text-3xl font-black leading-tight tracking-tight">Custom</h3>
            <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${selectedOption === 'custom' ? 'text-indigo-400' : 'text-slate-400'}`}>Specify exact hour</p>
          </div>
          
          <input 
            type="time" 
            value={customTime}
            onChange={(e) => {
              setCustomTime(e.target.value);
              setSelectedOption('custom');
            }}
            className={`mt-4 w-full bg-transparent border-b-4 text-4xl font-black py-2 focus:outline-hidden tabular-nums transition-colors ${
              selectedOption === 'custom' ? 'border-indigo-600 text-white' : 'border-slate-100 text-slate-300'
            }`}
          />
        </motion.div>
      </div>

      <div className="max-w-4xl mx-auto w-full flex items-center justify-between mt-auto pt-12 border-t border-slate-100">
        <button 
          onClick={() => setView('borrow-review')}
          className="flex items-center gap-4 px-10 py-5 bg-white border border-slate-200 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft size={18} />
          Go Back
        </button>

        <div className="flex items-center gap-12">
          <div className="text-right">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-2 leading-none">Expected Return</p>
            <p className="text-slate-900 text-4xl font-black tabular-nums leading-none tracking-tight">{format(calculateDeadline(), 'hh:mm aa')}</p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05, x: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleContinue}
            className="flex items-center gap-6 px-14 py-7 gradient-blue text-white rounded-[2rem] font-black text-2xl shadow-2xl shadow-indigo-100 transition-all hover:shadow-indigo-200 group"
          >
            <span>Confirm & Verify</span>
            <ArrowRight size={32} strokeWidth={3} className="transition-transform group-hover:translate-x-2" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default BorrowTime;
