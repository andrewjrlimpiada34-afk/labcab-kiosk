import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { View, UserProfile, InventoryItem, BorrowedItem, Transaction } from '../types';

interface AppContextType {
  view: View;
  setView: (view: View) => void;
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
  selectedItems: BorrowedItem[];
  setSelectedItems: (items: BorrowedItem[]) => void;
  returnDeadline: Date | null;
  setReturnDeadline: (date: Date | null) => void;
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
  lastActivity: number;
  resetToHome: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [view, setView] = useState<View>('home');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [selectedItems, setSelectedItems] = useState<BorrowedItem[]>([]);
  const [returnDeadline, setReturnDeadline] = useState<Date | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());

  const resetToHome = () => {
    setView('home');
    setCurrentUser(null);
    setSelectedItems([]);
    setReturnDeadline(null);
    setIsAdmin(false);
  };

  // Idle reset logic
  useEffect(() => {
    if (view === 'home') return;

    const interval = setInterval(() => {
      const now = Date.now();
      if (now - lastActivity > 120000) { // 2 minutes of inactivity
        resetToHome();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [view, lastActivity]);

  const updateActivity = () => setLastActivity(Date.now());

  return (
    <AppContext.Provider 
      value={{ 
        view, setView, 
        currentUser, setCurrentUser, 
        selectedItems, setSelectedItems,
        returnDeadline, setReturnDeadline,
        isAdmin, setIsAdmin,
        lastActivity, resetToHome
      }}
    >
      <div onMouseMove={updateActivity} onClick={updateActivity} onKeyDown={updateActivity} className="h-full w-full">
        {children}
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
