import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface KioskButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  icon?: React.ReactNode;
  label?: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'outlined';
}

const KioskButton: React.FC<KioskButtonProps> = ({ 
  children, 
  onClick, 
  className, 
  icon, 
  label,
  variant = 'primary' 
}) => {
  const handleClick = () => {
    onClick?.();
  };

  const gradientColors = {
    primary: 'from-blue-600 to-indigo-600',
    secondary: 'from-orange-600 to-rose-600',
    accent: 'from-emerald-600 to-teal-600',
    outlined: 'from-slate-200 to-slate-300'
  };

  const iconBgColors = {
    primary: 'bg-blue-50 text-blue-600',
    secondary: 'bg-orange-50 text-orange-600',
    accent: 'bg-emerald-50 text-emerald-600',
    outlined: 'bg-slate-50 text-slate-600'
  };

  const markerColors = {
    primary: 'bg-blue-500',
    secondary: 'bg-orange-500',
    accent: 'bg-emerald-500',
    outlined: 'bg-slate-400'
  };

  return (
    <div className={cn("group relative w-full h-full cursor-pointer", className)}>
      {/* GLOWING BACKGROUND LAYER */}
      <div className={cn(
        "absolute -inset-1 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-500 bg-gradient-to-r",
        gradientColors[variant]
      )}></div>
      
      {/* MAIN BUTTON CONTAINER */}
      <motion.button
        whileHover={{ y: -8 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleClick}
        className="relative flex flex-col items-center justify-center h-full w-full bg-white border border-slate-200 rounded-[2rem] shadow-xl p-10 transition-transform duration-300 overflow-hidden"
      >
        {/* ICON CONTAINER */}
        <div className={cn(
          "w-20 h-20 mb-8 rounded-3xl flex items-center justify-center transition-transform group-hover:scale-110",
          iconBgColors[variant]
        )}>
          {icon}
        </div>
        
        {/* TEXT CONTENT */}
        <h3 className="text-2xl font-bold text-slate-900 mb-2">{label}</h3>
        <p className="text-center text-slate-400 text-sm leading-relaxed px-4">
          {children}
        </p>
        
        {/* DECORATIVE MARKER */}
        <div className={cn(
          "mt-8 w-12 h-1.5 rounded-full",
          markerColors[variant]
        )}></div>
      </motion.button>
    </div>
  );
};

export default KioskButton;
