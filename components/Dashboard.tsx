import React from 'react';
import { BankAccount, Transaction, Stock, TransactionType, View } from '../types';
import { ArrowUpRight, ArrowDownRight, Wallet, TrendingUp, CreditCard } from 'lucide-react';

interface DashboardProps {
  accounts: BankAccount[];
  transactions: Transaction[];
  portfolio: Stock[];
  changeView: (view: View) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ accounts, transactions, portfolio, changeView }) => {
  const totalCash = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const totalStockValue = portfolio.reduce((sum, stock) => sum + (stock.currentPrice * stock.quantity), 0);
  const netWorth = totalCash + totalStockValue;

  const incomeThisMonth = transactions
    .filter(t => t.type === TransactionType.INCOME) // Simplified date check for demo
    .reduce((sum, t) => sum + t.amount, 0);
  
  const expenseThisMonth = transactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-8">
      <div>
         <h2 className="text-2xl font-bold text-slate-800">Overview</h2>
         <p className="text-slate-500">Welcome back, here is your financial summary.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Net Worth Card */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-slate-400 font-medium mb-1">Net Worth</p>
            <h3 className="text-4xl font-bold tracking-tight">${netWorth.toLocaleString()}</h3>
            <div className="mt-4 flex gap-4 text-sm">
                <div className="flex items-center gap-1 text-emerald-400">
                    <Wallet className="w-4 h-4" />
                    <span>Cash: ${(totalCash/netWorth * 100).toFixed(0)}%</span>
                </div>
                <div className="flex items-center gap-1 text-blue-400">
                    <TrendingUp className="w-4 h-4" />
                    <span>Stocks: ${(totalStockValue/netWorth * 100).toFixed(0)}%</span>
                </div>
            </div>
          </div>
          <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-white/10 to-transparent transform skew-x-12 translate-x-16 group-hover:translate-x-8 transition-transform duration-500"></div>
        </div>

        {/* Income Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
            <div>
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 mb-3">
                    <ArrowUpRight className="w-6 h-6" />
                </div>
                <p className="text-slate-500 font-medium">Total Income</p>
                <h3 className="text-2xl font-bold text-slate-900">${incomeThisMonth.toLocaleString()}</h3>
            </div>
            <p className="text-xs text-slate-400 mt-2">Recorded transactions</p>
        </div>

        {/* Expense Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
            <div>
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-600 mb-3">
                    <ArrowDownRight className="w-6 h-6" />
                </div>
                <p className="text-slate-500 font-medium">Total Expenses</p>
                <h3 className="text-2xl font-bold text-slate-900">${expenseThisMonth.toLocaleString()}</h3>
            </div>
             <p className="text-xs text-slate-400 mt-2">Recorded transactions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Accounts View */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-slate-800 text-lg">My Accounts</h3>
                  <button onClick={() => changeView('ACCOUNTS')} className="text-sm text-emerald-600 font-medium hover:underline">View All</button>
              </div>
              <div className="space-y-4">
                  {accounts.slice(0, 3).map(acc => (
                      <div key={acc.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200">
                          <div className="flex items-center gap-3">
                              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                                  <CreditCard className="w-5 h-5" />
                              </div>
                              <div>
                                  <p className="font-semibold text-slate-800">{acc.name}</p>
                                  <p className="text-xs text-slate-500">{acc.bankName}</p>
                              </div>
                          </div>
                          <span className="font-bold text-slate-800">${acc.balance.toLocaleString()}</span>
                      </div>
                  ))}
                  {accounts.length === 0 && <p className="text-center text-slate-400 py-4">No accounts added.</p>}
              </div>
          </div>

          {/* Recent Stocks */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-slate-800 text-lg">Top Holdings</h3>
                  <button onClick={() => changeView('STOCKS')} className="text-sm text-emerald-600 font-medium hover:underline">View All</button>
              </div>
               <div className="space-y-4">
                  {portfolio.slice(0, 3).map(stock => {
                       const gain = (stock.currentPrice - stock.avgPrice) * stock.quantity;
                       return (
                        <div key={stock.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-600">
                                    {stock.symbol}
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-800">{stock.name}</p>
                                    <p className="text-xs text-slate-500">{stock.quantity} Shares</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-slate-800">${stock.currentPrice}</p>
                                <p className={`text-xs font-medium ${gain >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                    {gain >= 0 ? '+' : ''}{gain.toFixed(0)}
                                </p>
                            </div>
                        </div>
                   )})}
                  {portfolio.length === 0 && <p className="text-center text-slate-400 py-4">No stocks added.</p>}
              </div>
          </div>
      </div>
    </div>
  );
};