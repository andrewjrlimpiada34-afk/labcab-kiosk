/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Register from './pages/Register';
import BorrowAuth from './pages/BorrowAuth';
import BorrowSelect from './pages/BorrowSelect';
import BorrowReview from './pages/BorrowReview';
import BorrowTime from './pages/BorrowTime';
import BorrowConfirm from './pages/BorrowConfirm';
import ReturnAuth from './pages/ReturnAuth';
import ReturnActive from './pages/ReturnActive';
import ReturnConfirm from './pages/ReturnConfirm';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import { AnimatePresence, motion } from 'motion/react';

function KioskContent() {
  const { view } = useApp();

  const renderView = () => {
    switch (view) {
      case 'home': return <Home />;
      case 'register': return <Register />;
      case 'borrow-auth': return <BorrowAuth />;
      case 'borrow-select': return <BorrowSelect />;
      case 'borrow-review': return <BorrowReview />;
      case 'borrow-time': return <BorrowTime />;
      case 'borrow-confirm': return <BorrowConfirm />;
      case 'return-auth': return <ReturnAuth />;
      case 'return-active': return <ReturnActive />;
      case 'return-confirm': return <ReturnConfirm />;
      case 'admin-login': return <AdminLogin />;
      case 'admin-dashboard': return <AdminDashboard />;
      default: return <Home />;
    }
  };

  return (
    <div className="flex flex-col h-screen select-none">
      {view !== 'admin-dashboard' && view !== 'admin-login' && <Navbar />}
      <main className="flex-1 overflow-hidden relative flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="flex-1 flex flex-col"
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <KioskContent />
    </AppProvider>
  );
}

