import React, { useState } from 'react';
import { BankAccount } from '../types';
import { Plus, Trash2, Edit2, CreditCard } from 'lucide-react';

interface AccountsProps {
  accounts: BankAccount[];
  // Replaced setAccounts with explicit handlers
  onAdd: (account: Omit<BankAccount, 'id'>) => void;
  onUpdate: (id: string, data: Partial<BankAccount>) => void;
  onDelete: (id: string) => void;
  setAccounts?: any; // kept for TS compatibility if needed during refactor, but unused
}

export const Accounts: React.FC<AccountsProps> = ({ accounts, onAdd, onUpdate, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<BankAccount>>({
    name: '',
    bankName: '',
    accountNumber: '',
    balance: 0,
    currency: 'TWD'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
        name: formData.name!,
        bankName: formData.bankName!,
        accountNumber: formData.accountNumber!,
        balance: Number(formData.balance),
        currency: formData.currency!
    };

    if (editingId) {
      onUpdate(editingId, data);
    } else {
      onAdd(data);
    }
    closeModal();
  };

  const openModal = (account?: BankAccount) => {
    if (account) {
      setEditingId(account.id);
      setFormData(account);
    } else {
      setEditingId(null);
      setFormData({ name: '', bankName: '', accountNumber: '', balance: 0, currency: 'TWD' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this account? Transactions linked to it might lose context.')) {
      onDelete(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Bank Accounts</h2>
          <p className="text-slate-500">Manage your bank details and balances</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Account
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map(account => (
          <div key={account.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                <CreditCard className="w-6 h-6" />
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openModal(account)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(account.id)} className="p-2 hover:bg-red-50 rounded-full text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <h3 className="font-semibold text-lg text-slate-900">{account.name}</h3>
            <p className="text-slate-500 text-sm mb-4">{account.bankName} • {account.accountNumber.slice(-4)}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-medium text-slate-400">{account.currency}</span>
              <span className="text-2xl font-bold text-slate-900">{account.balance.toLocaleString()}</span>
            </div>
          </div>
        ))}
        
        {accounts.length === 0 && (
          <div className="col-span-full py-12 flex flex-col items-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
            <CreditCard className="w-12 h-12 mb-2 opacity-50" />
            <p>No accounts linked yet. Add one to get started.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold mb-4">{editingId ? 'Edit Account' : 'New Account'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Account Nickname</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Primary Savings"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Bank Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  value={formData.bankName}
                  onChange={e => setFormData({ ...formData, bankName: e.target.value })}
                  placeholder="e.g., CTBC Bank"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Account Number</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  value={formData.accountNumber}
                  onChange={e => setFormData({ ...formData, accountNumber: e.target.value })}
                  placeholder="xxxx-xxxx-xxxx"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Current Balance</label>
                  <input
                    type="number"
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    value={formData.balance}
                    onChange={e => setFormData({ ...formData, balance: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Currency</label>
                  <select
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    value={formData.currency}
                    onChange={e => setFormData({ ...formData, currency: e.target.value })}
                  >
                    <option value="TWD">TWD</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="JPY">JPY</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg font-medium transition-colors"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};