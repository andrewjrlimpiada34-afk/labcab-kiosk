import React from 'react';
import { motion } from 'motion/react';
import { Delete, ChevronLeft } from 'lucide-react';

interface PINPadProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  onComplete?: () => void;
}

const PINPad: React.FC<PINPadProps> = ({ value, onChange, maxLength = 6, onComplete }) => {
  const handleNumber = (num: string) => {
    if (value.length < maxLength) {
      const newValue = value + num;
      onChange(newValue);
      if (newValue.length === maxLength && onComplete) {
        onComplete();
      }
    }
  };

  const handleBackspace = () => {
    onChange(value.slice(0, -1));
  };

  const handleDeleteAll = () => {
    onChange('');
  };

  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  return (
    <div className="w-full max-w-xs mx-auto">
      <div className="flex justify-center gap-4 mb-10">
        {Array.from({ length: maxLength }).map((_, i) => (
          <div 
            key={i}
            className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
              i < value.length 
                ? 'bg-indigo-600 border-indigo-600 scale-125 shadow-[0_0_15px_rgba(79,70,229,0.5)]' 
                : 'border-slate-300'
            }`}
          />
        ))}
      </div>
      
      <div className="grid grid-cols-3 gap-6">
        {numbers.map(num => (
          <motion.button
            key={num}
            whileTap={{ scale: 0.92 }}
            onClick={() => handleNumber(num)}
            className="w-20 h-20 rounded-3xl bg-white border border-slate-200 shadow-sm text-2xl font-black text-slate-800 flex items-center justify-center hover:bg-slate-50 hover:border-slate-300 active:bg-indigo-50 active:text-indigo-600 transition-all"
          >
            {num}
          </motion.button>
        ))}
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={handleDeleteAll}
          className="w-20 h-20 rounded-3xl bg-white border border-slate-200 shadow-sm text-2xl font-black text-slate-800 flex items-center justify-center hover:bg-slate-50 hover:border-slate-300 active:bg-indigo-50 active:text-indigo-600 transition-all"
        >
          C
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => handleNumber('0')}

          className="w-20 h-20 rounded-3xl bg-white border border-slate-200 shadow-sm text-2xl font-black text-slate-800 flex items-center justify-center hover:bg-slate-50 hover:border-slate-300 active:bg-indigo-50 active:text-indigo-600 transition-all"
        >
          0
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={handleBackspace}
          className="w-20 h-20 rounded-3xl bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 hover:text-slate-900 transition-all"
        >
          <Delete size={28} />
        </motion.button>
      </div>
    </div>
  );
};

export default PINPad;
