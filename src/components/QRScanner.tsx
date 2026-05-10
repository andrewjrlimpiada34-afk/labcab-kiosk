import React, { useState } from 'react';
import Scanner from 'react-qr-scanner';
import { motion } from 'motion/react';
import { Camera, RefreshCw } from 'lucide-react';

interface QRScannerProps {
  onScan: (data: string) => void;
  onError?: (err: any) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan, onError }) => {
  const [active, setActive] = useState(true);

  const handleScan = (data: any) => {
    if (data && data.text) {
      onScan(data.text);
      setActive(false);
    }
  };

  const handleReload = () => {
    setActive(false);
    setTimeout(() => setActive(true), 100);
  };

  return (
    <div className="relative w-full max-w-sm mx-auto overflow-hidden rounded-[4rem] border-[12px] border-white shadow-[0_40px_80px_rgba(15,23,42,0.15)] bg-slate-900 aspect-square group transition-all hover:scale-[1.02]">
      {active ? (
        <Scanner
          delay={300}
          onError={onError || console.error}
          onScan={handleScan}
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.9) contrast(1.1)' }}
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-8">
          <div className="w-24 h-24 bg-slate-800 rounded-[2rem] flex items-center justify-center text-slate-600">
            <Camera size={48} strokeWidth={1} />
          </div>
          <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 text-slate-500">Scanner Inactive</p>
            <button 
              onClick={handleReload}
              className="flex items-center gap-4 bg-white text-slate-900 px-10 py-5 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 active:scale-95 transition-all shadow-xl shadow-black/20"
            >
              <RefreshCw size={18} />
              Re-initialize
            </button>
          </div>
        </div>
      )}
      
      {active && (
        <>
          <div className="absolute inset-0 bg-slate-900/10 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 border-2 border-indigo-500/20 rounded-[3rem] pointer-events-none">
            <div className="absolute -top-1 -left-1 w-12 h-12 border-t-[6px] border-l-[6px] border-indigo-600 rounded-tl-[1.5rem]" />
            <div className="absolute -top-1 -right-1 w-12 h-12 border-t-[6px] border-r-[6px] border-indigo-600 rounded-tr-[1.5rem]" />
            <div className="absolute -bottom-1 -left-1 w-12 h-12 border-b-[6px] border-l-[6px] border-indigo-600 rounded-bl-[1.5rem]" />
            <div className="absolute -bottom-1 -right-1 w-12 h-12 border-b-[6px] border-r-[6px] border-indigo-600 rounded-br-[1.5rem]" />
            
            <motion.div 
              animate={{ top: ['15%', '85%', '15%'] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="absolute left-6 right-6 h-1 bg-linear-to-r from-transparent via-indigo-600 to-transparent shadow-[0_0_20px_rgba(79,70,229,0.8)]"
            />
          </div>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur-xl text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.3em] whitespace-nowrap shadow-2xl">
            Align QR Within Target Area
          </div>
        </>
      )}
    </div>
  );
};

export default QRScanner;
