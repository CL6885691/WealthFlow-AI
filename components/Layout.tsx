import React from 'react';
import { View, User } from '../types';
import { 
  LayoutDashboard, 
  Wallet, 
  Receipt, 
  TrendingUp, 
  PieChart, 
  LogOut, 
  UserCircle 
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: View;
  setCurrentView: (view: View) => void;
  user: User | null;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, setCurrentView, user, onLogout }) => {
  const navItems = [
    { view: 'DASHBOARD' as View, label: 'Dashboard', icon: LayoutDashboard },
    { view: 'ACCOUNTS' as View, label: 'Accounts', icon: Wallet },
    { view: 'TRANSACTIONS' as View, label: 'Transactions', icon: Receipt },
    { view: 'STOCKS' as View, label: 'Investments', icon: TrendingUp },
    { view: 'REPORTS' as View, label: 'Analysis', icon: PieChart },
  ];

  if (!user) {
      return <div className="min-h-screen bg-slate-50">{children}</div>;
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
             <TrendingUp className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-slate-800 tracking-tight">WealthFlow</span>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => setCurrentView(item.view)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                currentView === item.view
                  ? 'bg-emerald-50 text-emerald-700 font-medium shadow-sm'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <UserCircle className="w-8 h-8 text-slate-400" />
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-slate-900 truncate">{user.username}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Header (Visible on small screens) */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-50 flex items-center justify-between px-4">
          <span className="font-bold text-slate-800">WealthFlow</span>
          <button onClick={onLogout} className="p-2 text-slate-600">
              <LogOut className="w-5 h-5" />
          </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto md:p-8 pt-20 p-4 md:pt-8 w-full relative">
        <div className="max-w-7xl mx-auto space-y-6 pb-20 md:pb-0">
             {children}
        </div>
      </main>
      
      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 flex justify-around p-2 pb-safe">
         {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => setCurrentView(item.view)}
              className={`flex flex-col items-center p-2 rounded-lg ${
                currentView === item.view ? 'text-emerald-600' : 'text-slate-400'
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-[10px] mt-1">{item.label}</span>
            </button>
          ))}
      </div>
    </div>
  );
};