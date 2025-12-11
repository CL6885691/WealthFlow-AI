import React, { useState } from 'react';
import { Transaction, TransactionType, BankAccount } from '../types';
import { CATEGORIES } from '../constants';
import { Plus, Trash2, Sparkles } from 'lucide-react';
import { categorizeTransaction } from '../services/geminiService';

interface TransactionsProps {
  transactions: Transaction[];
  accounts: BankAccount[];
  // Replaced setters with handlers
  onAdd: (tx: Omit<Transaction, 'id'>) => void;
  onDelete: (id: string) => void;
  setTransactions?: any; 
  setAccounts?: any;
}

export const Transactions: React.FC<TransactionsProps> = ({ transactions, accounts, onAdd, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [formData, setFormData] = useState<Partial<Transaction>>({
    amount: 0,
    type: TransactionType.EXPENSE,
    category: CATEGORIES.EXPENSE[0],
    date: new Date().toISOString().split('T')[0],
    accountId: accounts[0]?.id || '',
    note: ''
  });

  const handleAISuggest = async () => {
      if(!formData.note) return;
      setLoadingAI(true);
      const suggestedCategory = await categorizeTransaction(formData.note);
      setFormData(prev => ({ ...prev, category: suggestedCategory }));
      setLoadingAI(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.accountId) {
        alert("Please create an account first.");
        return;
    }

    const newTx = {
      accountId: formData.accountId,
      amount: Number(formData.amount),
      type: formData.type as TransactionType,
      category: formData.category!,
      date: formData.date!,
      note: formData.note || ''
    };

    onAdd(newTx);

    setIsModalOpen(false);
    setFormData({
      amount: 0,
      type: TransactionType.EXPENSE,
      category: CATEGORIES.EXPENSE[0],
      date: new Date().toISOString().split('T')[0],
      accountId: accounts[0]?.id || '',
      note: ''
    });
  };

  const handleDelete = (id: string) => {
    onDelete(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Transactions</h2>
          <p className="text-slate-500">Record income and expenses</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> New Record
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 font-semibold text-slate-600 text-sm">Date</th>
                <th className="p-4 font-semibold text-slate-600 text-sm">Account</th>
                <th className="p-4 font-semibold text-slate-600 text-sm">Category</th>
                <th className="p-4 font-semibold text-slate-600 text-sm">Note</th>
                <th className="p-4 font-semibold text-slate-600 text-sm text-right">Amount</th>
                <th className="p-4 font-semibold text-slate-600 text-sm"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.map(tx => (
                <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-slate-600 text-sm">{new Date(tx.date).toLocaleDateString()}</td>
                  <td className="p-4 text-slate-600 text-sm">{accounts.find(a => a.id === tx.accountId)?.name || 'Unknown Account'}</td>
                  <td className="p-4 text-slate-600">
                    <span className="px-2 py-1 rounded-md bg-slate-100 text-xs font-medium text-slate-700 border border-slate-200">
                      {tx.category}
                    </span>
                  </td>
                  <td className="p-4 text-slate-800 text-sm max-w-xs truncate">{tx.note}</td>
                  <td className={`p-4 text-right font-medium ${tx.type === TransactionType.INCOME ? 'text-emerald-600' : 'text-slate-900'}`}>
                     {tx.type === TransactionType.INCOME ? '+' : '-'}${tx.amount.toLocaleString()}
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => handleDelete(tx.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                   <td colSpan={6} className="p-12 text-center text-slate-400">No transactions recorded yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold mb-4">Add Transaction</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-4 p-1 bg-slate-100 rounded-lg">
                {[TransactionType.EXPENSE, TransactionType.INCOME].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({ ...formData, type, category: type === TransactionType.INCOME ? CATEGORIES.INCOME[0] : CATEGORIES.EXPENSE[0] })}
                    className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                      formData.type === type 
                      ? 'bg-white text-emerald-600 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Account</label>
                   <select
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                      value={formData.accountId}
                      onChange={e => setFormData({ ...formData, accountId: e.target.value })}
                   >
                     {accounts.map(acc => (
                       <option key={acc.id} value={acc.id}>{acc.name} (${acc.balance})</option>
                     ))}
                   </select>
                </div>
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
                   <input
                      type="number"
                      required
                      min="0"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                      value={formData.amount}
                      onChange={e => setFormData({ ...formData, amount: Number(e.target.value) })}
                   />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Note / Description</label>
                <div className="flex gap-2">
                    <input
                    type="text"
                    required
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={formData.note}
                    onChange={e => setFormData({ ...formData, note: e.target.value })}
                    placeholder="e.g., Starbucks Coffee"
                    />
                     <button
                        type="button"
                        onClick={handleAISuggest}
                        disabled={loadingAI || !formData.note}
                        className="px-3 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors disabled:opacity-50"
                        title="Auto-categorize with AI"
                    >
                        {loadingAI ? <div className="animate-spin w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full"/> : <Sparkles className="w-5 h-5" />}
                    </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                >
                  {(formData.type === TransactionType.INCOME ? CATEGORIES.INCOME : CATEGORIES.EXPENSE).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  {!CATEGORIES.INCOME.includes(formData.category || '') && !CATEGORIES.EXPENSE.includes(formData.category || '') && (
                      <option value={formData.category}>{formData.category}</option>
                  )}
                </select>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg font-medium"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};