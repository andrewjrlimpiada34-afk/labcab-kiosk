import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { db } from '../lib/firebase';
import { collection, getDocs, doc, updateDoc, addDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, 
  Package, 
  Users, 
  ClipboardList, 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  ArrowLeft,
  Settings,
  LogOut,
  ChevronDown,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { InventoryItem, Transaction, UserProfile } from '../types';

const AdminDashboard: React.FC = () => {
  const { setView, resetToHome } = useApp();
  const [tab, setTab] = useState<'inventory' | 'users' | 'logs' | 'analytics'>('inventory');
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [logs, setLogs] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const invSnap = await getDocs(collection(db, 'inventory'));
        setInventory(invSnap.docs.map(d => ({ id: d.id, ...d.data() } as InventoryItem)));

        const usersSnap = await getDocs(collection(db, 'users'));
        setUsers(usersSnap.docs.map(d => ({ id: d.id, ...d.data() } as UserProfile)));

        const logsQuery = query(collection(db, 'transactions'), orderBy('borrowTime', 'desc'));
        const logsSnap = await getDocs(logsQuery);
        setLogs(logsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Transaction)));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tab]);

  const handleLogout = () => resetToHome();

  return (
    <div className="flex-1 h-full flex flex-col bg-slate-50">
      {/* Admin Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-80 bg-slate-900 text-slate-400 p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full translate-x-12 -translate-y-12"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 text-white mb-16">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white rounded-sm rotate-45"></div>
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight leading-none">Admin<span className="text-indigo-500">Cab</span></h2>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-2">Management Suite</p>
              </div>
            </div>

            <nav className="space-y-3">
              <button 
                onClick={() => setTab('inventory')}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all text-sm ${tab === 'inventory' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-950/40' : 'hover:bg-white/5'}`}
              >
                <Package size={18} />
                Inventory
              </button>
              <button 
                onClick={() => setTab('logs')}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all text-sm ${tab === 'logs' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-950/40' : 'hover:bg-white/5'}`}
              >
                <ClipboardList size={18} />
                Borrow Logs
              </button>
              <button 
                onClick={() => setTab('users')}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all text-sm ${tab === 'users' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-950/40' : 'hover:bg-white/5'}`}
              >
                <Users size={18} />
                Registered Users
              </button>
              <button 
                onClick={() => setTab('analytics')}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all text-sm ${tab === 'analytics' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-950/40' : 'hover:bg-white/5'}`}
              >
                <BarChart3 size={18} />
                Analytics
              </button>
            </nav>
          </div>

          <div className="space-y-3 relative z-10">
            <button className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm hover:bg-white/5 transition-all text-slate-500">
              <Settings size={18} />
              Settings
            </button>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm text-rose-500 hover:bg-rose-500/10 transition-all border border-transparent hover:border-rose-500/20"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-50">
          <header className="bg-white px-12 py-8 flex items-center justify-between sticky top-0 z-10 nav-shadow border-b border-slate-100">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight capitalize">{tab} Management</h1>
              <p className="text-slate-500 font-medium">Control and monitor all LabCab activities.</p>
            </div>
            
            <div className="relative w-96 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
              <input 
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-7 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-bold transition-all text-slate-800"
              />
            </div>
          </header>

          <div className="p-12">
            {tab === 'inventory' && (
              <div className="space-y-10">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">Apparatus List ({inventory.length})</h3>
                  <button className="flex items-center gap-2 px-7 py-3.5 gradient-blue text-white rounded-2xl font-black shadow-xl shadow-indigo-100 hover:translate-y-[-2px] transition-transform">
                    <Plus size={20} />
                    Add Apparatus
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {inventory.map((item) => (
                    <div key={item.id} className="bg-white p-8 rounded-[2rem] border border-slate-200/60 shadow-xl shadow-slate-100/50 flex items-center justify-between hover:border-indigo-200 transition-all group">
                      <div className="flex items-center gap-8">
                        <div className="w-16 h-16 bg-slate-50 text-indigo-600 rounded-3xl flex items-center justify-center group-hover:bg-indigo-50 group-hover:scale-110 transition-all">
                          <Package size={32} />
                        </div>
                        <div>
                          <h4 className="text-2xl font-black text-slate-900 leading-tight">{item.apparatusName}</h4>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">{item.id}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-20">
                        <div className="text-center">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Available</span>
                          <span className={`text-3xl font-black tabular-nums ${item.availableQuantity < 5 ? 'text-rose-500' : 'text-slate-900'}`}>{item.availableQuantity}</span>
                        </div>
                        <div className="text-center">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Total Stock</span>
                          <span className="text-3xl font-black tabular-nums text-slate-900">{item.totalQuantity}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <button className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                          <Edit2 size={20} />
                        </button>
                        <button className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:text-rose-600 hover:bg-rose-50 transition-all">
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === 'logs' && (
              <div className="space-y-10">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">Transaction History</h3>
                  <div className="flex gap-4">
                    <button className="px-7 py-3.5 bg-white border border-slate-200 rounded-2xl font-black text-slate-600 shadow-sm hover:bg-slate-50 transition-all text-sm uppercase tracking-wider">Export PDF</button>
                    <button className="px-7 py-3.5 bg-white border border-slate-200 rounded-2xl font-black text-slate-600 shadow-sm hover:bg-slate-50 transition-all text-sm uppercase tracking-wider">Advanced Filter</button>
                  </div>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-2xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                          <th className="px-10 py-7 font-black text-slate-400 uppercase text-[10px] tracking-[0.2em]">Borrower</th>
                          <th className="px-10 py-7 font-black text-slate-400 uppercase text-[10px] tracking-[0.2em]">Items</th>
                          <th className="px-10 py-7 font-black text-slate-400 uppercase text-[10px] tracking-[0.2em]">Timestamp</th>
                          <th className="px-10 py-7 font-black text-slate-400 uppercase text-[10px] tracking-[0.2em]">Status</th>
                          <th className="px-10 py-7 font-black text-slate-400 uppercase text-[10px] tracking-[0.2em]">Details</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {logs.map((log) => (
                          <tr key={log.id} className="hover:bg-indigo-50/10 transition-colors group">
                            <td className="px-10 py-8">
                              <div className="font-black text-slate-900 text-lg uppercase tracking-tight">{log.borrowerName}</div>
                              <div className="text-[11px] font-black text-indigo-600 tracking-widest mt-1 opacity-70">{log.borrowerID}</div>
                            </td>
                            <td className="px-10 py-8">
                              <div className="flex flex-wrap gap-2">
                                {log.borrowedItems.map((item, i) => (
                                  <span key={i} className="px-3.5 py-1.5 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-tight">
                                    {item.quantity}× {item.name}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="px-10 py-8">
                              <div className="font-bold text-slate-700">{format(log.borrowTime.toDate(), 'MMM dd, yyyy')}</div>
                              <div className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-tight">{format(log.borrowTime.toDate(), 'hh:mm aa')}</div>
                            </td>
                            <td className="px-10 py-8">
                              <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border-2 flex items-center gap-2 w-fit ${
                                log.status === 'active' 
                                  ? 'bg-amber-50 text-amber-500 border-amber-100' 
                                  : 'bg-emerald-50 text-emerald-500 border-emerald-100'}`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${log.status === 'active' ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                                {log.status}
                              </span>
                            </td>
                            <td className="px-10 py-8 text-right">
                              <button className="text-indigo-600 font-black text-xs uppercase tracking-widest hover:underline decoration-2 underline-offset-4">Review</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {(tab === 'analytics' || tab === 'users') && (
              <div className="min-h-[400px] flex items-center justify-center p-20 border-2 border-dashed border-slate-200 rounded-[3rem] text-slate-300 bg-white">
                <div className="text-center group">
                  <div className="w-24 h-24 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mx-auto mb-8 transition-colors group-hover:bg-indigo-50 group-hover:text-indigo-100">
                    <BarChart3 size={48} />
                  </div>
                  <h4 className="text-3xl font-black text-slate-400 mb-2 uppercase tracking-tight">{tab} Module</h4>
                  <p className="font-bold text-slate-400/60 max-w-xs mx-auto">This module is currently being finalized for high-density laboratory environments.</p>
                  <div className="mt-8 px-6 py-2 bg-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full inline-block">Estimated Update: Q3 2026</div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
