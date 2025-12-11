import React, { useState, useEffect } from 'react';
import { View, User, BankAccount, Transaction, Stock } from './types';
import { Layout } from './components/Layout';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { Accounts } from './components/Accounts';
import { Transactions } from './components/Transactions';
import { Stocks } from './components/Stocks';
import { Reports } from './components/Reports';
import { auth, initializationError } from './firebaseConfig'; // Import initializationError
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { 
  subscribeToAccounts, 
  subscribeToTransactions, 
  subscribeToPortfolio, 
  addAccount, 
  updateAccount, 
  deleteAccount,
  addTransaction,
  deleteTransaction as deleteTxService,
  addStock,
  deleteStock as deleteStockService,
  updateStock
} from './services/dbService';

const App: React.FC = () => {
  // 0. Safety Check for Config
  if (initializationError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
         <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border-l-4 border-red-500">
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Configuration Error</h1>
            <p className="text-slate-600 mb-4">The application could not start because the database configuration is missing.</p>
            <div className="bg-slate-100 p-4 rounded-lg text-left text-xs font-mono text-slate-700 overflow-auto mb-4">
              Error: {initializationError}
            </div>
            <p className="text-sm text-slate-500">
              Please check your <strong>GitHub Secrets</strong> settings. Ensure <code>FIREBASE_API_KEY</code> and other variables are set correctly in the repository settings.
            </p>
         </div>
      </div>
    );
  }

  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>('LOGIN');
  const [loading, setLoading] = useState(true);

  // Application Data State
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [portfolio, setPortfolio] = useState<Stock[]>([]);

  // 1. Auth Listener
  useEffect(() => {
    if (!auth) return; // Guard against undefined auth

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          username: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User'
        });
        setCurrentView('DASHBOARD');
      } else {
        setUser(null);
        setCurrentView('LOGIN');
        setAccounts([]);
        setTransactions([]);
        setPortfolio([]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Data Listeners (Real-time updates)
  useEffect(() => {
    if (!user) return;

    const unsubAccounts = subscribeToAccounts(user.id, (data) => setAccounts(data));
    const unsubTransactions = subscribeToTransactions(user.id, (data) => setTransactions(data));
    const unsubPortfolio = subscribeToPortfolio(user.id, (data) => setPortfolio(data));

    return () => {
      unsubAccounts();
      unsubTransactions();
      unsubPortfolio();
    };
  }, [user]);

  const handleLogout = async () => {
    if (auth) await signOut(auth);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">Loading WealthFlow...</div>;
  }

  if (!user) {
    return <Auth onLogin={() => {}} />;
  }

  return (
    <Layout currentView={currentView} setCurrentView={setCurrentView} user={user} onLogout={handleLogout}>
      {currentView === 'DASHBOARD' && (
        <Dashboard 
          accounts={accounts} 
          transactions={transactions} 
          portfolio={portfolio} 
          changeView={setCurrentView} 
        />
      )}
      {currentView === 'ACCOUNTS' && (
        <Accounts 
          accounts={accounts} 
          // @ts-ignore
          setAccounts={null} 
          onAdd={(acc) => addAccount(user.id, acc)}
          onUpdate={(id, data) => updateAccount(id, data)}
          onDelete={(id) => deleteAccount(id)}
        />
      )}
      {currentView === 'TRANSACTIONS' && (
        <Transactions 
          transactions={transactions} 
          // @ts-ignore
          setTransactions={null} 
          accounts={accounts} 
          // @ts-ignore
          setAccounts={null}
          onAdd={(tx) => {
             addTransaction(user.id, tx);
             const acc = accounts.find(a => a.id === tx.accountId);
             if (acc) {
                const change = tx.type === 'INCOME' ? tx.amount : -tx.amount;
                updateAccount(acc.id, { balance: acc.balance + change });
             }
          }}
          onDelete={(txId) => {
             const tx = transactions.find(t => t.id === txId);
             if (tx) {
                deleteTxService(txId);
                const acc = accounts.find(a => a.id === tx.accountId);
                if (acc) {
                    const revert = tx.type === 'INCOME' ? -tx.amount : tx.amount;
                    updateAccount(acc.id, { balance: acc.balance + revert });
                }
             }
          }}
        />
      )}
      {currentView === 'STOCKS' && (
        <Stocks 
          portfolio={portfolio} 
          // @ts-ignore
          setPortfolio={null}
          onAdd={(stock) => addStock(user.id, stock)}
          onDelete={(id) => deleteStockService(id)}
          onUpdate={(id, data) => updateStock(id, data)}
        />
      )}
      {currentView === 'REPORTS' && (
        <Reports transactions={transactions} portfolio={portfolio} accounts={accounts} />
      )}
    </Layout>
  );
};

export default App;