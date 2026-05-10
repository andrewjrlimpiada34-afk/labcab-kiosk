import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { db } from '../lib/firebase';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { Minus, Plus, Search, Info, ShoppingBasket, ArrowRight, Loader2 } from 'lucide-react';
import LoadingOverlay from '../components/LoadingOverlay';
import { InventoryItem, BorrowedItem } from '../types';

const INITIAL_INVENTORY = [
  { apparatusName: 'Beaker (250ml)', totalQuantity: 50, availableQuantity: 50, description: 'Borosilicate glass beaker for mixing and heating.' },
  { apparatusName: 'Erlenmeyer Flask (250ml)', totalQuantity: 40, availableQuantity: 40, description: 'Conical flask ideal for titration and storage.' },
  { apparatusName: 'Test Tube (Set of 5)', totalQuantity: 30, availableQuantity: 30, description: 'Standard glass test tubes for small chemical reactions.' },
  { apparatusName: 'Stirring Rod', totalQuantity: 100, availableQuantity: 100, description: 'Glass rod for manual mixing of liquids.' },
  { apparatusName: 'Funnel (Short Stem)', totalQuantity: 25, availableQuantity: 25, description: 'Glass funnel for precise pouring and filtration.' },
];

const BorrowSelect: React.FC = () => {
  const { setView, setSelectedItems, selectedItems } = useApp();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Local cart state - maps itemId to quantity
  const [cart, setCart] = useState<Record<string, number>>(
    selectedItems.reduce((acc, item) => ({ ...acc, [item.itemId]: item.quantity }), {})
  );

  useEffect(() => {
    const fetchInventory = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'inventory'));
        if (querySnapshot.empty) {
          // Seed initial data
          const newItems: InventoryItem[] = [];
          for (const item of INITIAL_INVENTORY) {
            const docRef = doc(collection(db, 'inventory'));
            const newItem = { id: docRef.id, ...item };
            await setDoc(docRef, item);
            newItems.push(newItem);
          }
          setInventory(newItems);
        } else {
          setInventory(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as InventoryItem)));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  const updateQuantity = (itemId: string, delta: number, available: number) => {
    setCart(prev => {
      const current = prev[itemId] || 0;
      const next = Math.max(0, Math.min(available, current + delta));
      if (next === 0) {
        const { [itemId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [itemId]: next };
    });
  };

  const filteredInventory = inventory.filter(item => 
    item.apparatusName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleContinue = () => {
    const selected: BorrowedItem[] = Object.entries(cart).map(([itemId, quantity]) => {
      const item = inventory.find(i => i.id === itemId);
      return {
        itemId,
        name: item?.apparatusName || 'Unknown',
        quantity: quantity as number
      };
    });
    setSelectedItems(selected);
    setView('borrow-review');
  };

  const cartTotal = Object.values(cart).reduce((a, b) => (a as number) + (b as number), 0) as number;

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50/50">
      <div className="bg-white border-b border-slate-100 px-10 py-8 flex items-center justify-between nav-shadow relative z-10">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Select Apparatus</h2>
          <p className="text-slate-500 font-medium tracking-tight">Browse and select items for your session.</p>
        </div>
        
        <div className="relative w-96 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
          <input 
            type="text"
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-7 py-4.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-bold transition-all text-slate-800 shadow-xs"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-6">
            <div className="relative">
              <Loader2 size={64} className="animate-spin text-indigo-500 opacity-20" />
              <Loader2 size={64} className="animate-spin text-indigo-600 absolute top-0 left-0 clip-path-half" />
            </div>
            <p className="text-xl font-black uppercase tracking-widest text-slate-300">Scanning Inventory...</p>
          </div>
        ) : filteredInventory.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredInventory.map(item => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white rounded-[2.5rem] p-10 border-2 transition-all duration-500 relative overflow-hidden group ${cart[item.id] ? 'border-indigo-500 shadow-2xl shadow-indigo-100 scale-[1.02]' : 'border-slate-100 hover:border-slate-200 hover:shadow-xl hover:shadow-slate-200/50'}`}
              >
                {cart[item.id] && (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                )}
                
                <div className="flex justify-between items-start mb-10">
                  <div className={`w-16 h-16 rounded-3xl flex items-center justify-center transition-colors duration-500 ${cart[item.id] ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100 group-hover:text-slate-600'}`}>
                    <Info size={32} strokeWidth={2} />
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-2">Available</span>
                    <span className={`text-3xl font-black tabular-nums transition-colors ${item.availableQuantity > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {item.availableQuantity}
                    </span>
                    <span className="text-slate-300 font-bold ml-1">/ {item.totalQuantity}</span>
                  </div>
                </div>

                <h3 className="text-2xl font-black text-slate-900 mb-2 leading-tight tracking-tight">{item.apparatusName}</h3>
                <p className="text-slate-400 text-sm mb-10 line-clamp-2 font-medium leading-relaxed">{item.description}</p>

                <div className="flex items-center justify-between pt-8 border-t border-slate-50">
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Select Qty</span>
                  <div className="flex items-center gap-6 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => updateQuantity(item.id, -1, item.availableQuantity)}
                      className="w-12 h-12 rounded-xl bg-white text-slate-400 flex items-center justify-center hover:text-rose-500 hover:shadow-md hover:border-slate-200 shadow-sm border border-slate-100 disabled:opacity-30 transition-all"
                      disabled={!cart[item.id]}
                    >
                      <Minus size={18} strokeWidth={3} />
                    </motion.button>
                    <span className="text-2xl font-black text-slate-900 w-8 text-center tabular-nums">
                      {cart[item.id] || 0}
                    </span>
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => updateQuantity(item.id, 1, item.availableQuantity)}
                      className="w-12 h-12 rounded-xl bg-white text-slate-400 flex items-center justify-center hover:text-indigo-600 hover:shadow-md hover:border-slate-200 shadow-sm border border-slate-100 disabled:opacity-30 transition-all"
                      disabled={(cart[item.id] || 0) >= item.availableQuantity}
                    >
                      <Plus size={18} strokeWidth={3} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-300">
            <Search size={80} strokeWidth={1.5} className="mb-8 opacity-20" />
            <h3 className="text-3xl font-black text-slate-400 uppercase tracking-tight">No Results Found</h3>
            <p className="text-lg font-medium opacity-60">Refine your search criteria for available stock.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {cartTotal > 0 && (
          <motion.div
            initial={{ y: 200 }}
            animate={{ y: 0 }}
            exit={{ y: 200 }}
            className="bg-white border-t border-slate-100 p-10 px-12 flex items-center justify-between shadow-[0_-30px_60px_rgba(0,0,0,0.1)] z-40 relative"
          >
            <div className="flex items-center gap-8">
              <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-slate-300">
                <ShoppingBasket size={40} strokeWidth={1.5} />
              </div>
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="text-6xl font-black text-slate-900 tabular-nums">{cartTotal}</span>
                  <span className="text-xl font-black text-slate-300 uppercase tracking-[0.2em]">Items</span>
                </div>
                <p className="text-slate-400 font-bold tracking-tight">Ready for review</p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleContinue}
              className="flex items-center gap-6 px-16 py-7 gradient-blue text-white rounded-[2rem] font-black text-2xl shadow-2xl shadow-indigo-100 transition-all hover:shadow-indigo-200 relative group"
            >
              <span>Review Selection</span>
              <ArrowRight size={32} strokeWidth={3} className="transition-transform group-hover:translate-x-2" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BorrowSelect;
