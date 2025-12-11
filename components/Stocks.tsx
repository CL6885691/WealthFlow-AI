import React, { useState } from 'react';
import { Stock } from '../types';
import { Plus, Trash2, RefreshCw } from 'lucide-react';

interface StocksProps {
  portfolio: Stock[];
  // Replaced setters with handlers
  onAdd: (stock: Omit<Stock, 'id'>) => void;
  onUpdate: (id: string, data: Partial<Stock>) => void;
  onDelete: (id: string) => void;
  setPortfolio?: any;
}

export const Stocks: React.FC<StocksProps> = ({ portfolio, onAdd, onUpdate, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Stock>>({
    symbol: '',
    name: '',
    market: 'TWSE',
    quantity: 0,
    avgPrice: 0,
    currentPrice: 0
  });

  // Function to simulate real-time updates
  const simulateMarketUpdate = () => {
    portfolio.forEach(stock => {
      const fluctuation = 1 + (Math.random() * 0.04 - 0.02);
      const newPrice = Math.round(stock.currentPrice * fluctuation * 100) / 100;
      onUpdate(stock.id, { currentPrice: newPrice });
    });
  };

  const calculateTotalValue = () => portfolio.reduce((acc, stock) => acc + (stock.currentPrice * stock.quantity), 0);
  const calculateTotalCost = () => portfolio.reduce((acc, stock) => acc + (stock.avgPrice * stock.quantity), 0);
  const totalValue = calculateTotalValue();
  const totalCost = calculateTotalCost();
  const totalGain = totalValue - totalCost;
  const totalGainPercent = totalCost === 0 ? 0 : (totalGain / totalCost) * 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newStock = {
      symbol: formData.symbol!.toUpperCase(),
      name: formData.name!,
      market: formData.market!,
      quantity: Number(formData.quantity),
      avgPrice: Number(formData.avgPrice),
      currentPrice: Number(formData.currentPrice)
    };
    onAdd(newStock);
    setIsModalOpen(false);
    setFormData({ symbol: '', name: '', market: 'TWSE', quantity: 0, avgPrice: 0, currentPrice: 0 });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Investment Portfolio</h2>
          <p className="text-slate-500">Track your stocks and market performance</p>
        </div>
        <div className="flex gap-2">
           <button
            onClick={simulateMarketUpdate}
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            <RefreshCw className="w-4 h-4" /> Sync Prices
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Stock
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
           <p className="text-sm font-medium text-slate-500 mb-1">Portfolio Value</p>
           <h3 className="text-3xl font-bold text-slate-900">${totalValue.toLocaleString()}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
           <p className="text-sm font-medium text-slate-500 mb-1">Total Cost</p>
           <h3 className="text-3xl font-bold text-slate-900">${totalCost.toLocaleString()}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
           <p className="text-sm font-medium text-slate-500 mb-1">Unrealized P/L</p>
           <div className="flex items-center gap-2">
             <h3 className={`text-3xl font-bold ${totalGain >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                {totalGain >= 0 ? '+' : ''}{totalGain.toLocaleString()}
             </h3>
             <span className={`text-sm font-semibold px-2 py-0.5 rounded-full ${totalGain >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
               {totalGainPercent.toFixed(2)}%
             </span>
           </div>
        </div>
      </div>

      {/* Stock Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 font-semibold text-slate-600 text-sm">Symbol</th>
                <th className="p-4 font-semibold text-slate-600 text-sm">Name</th>
                <th className="p-4 font-semibold text-slate-600 text-sm">Shares</th>
                <th className="p-4 font-semibold text-slate-600 text-sm">Avg. Price</th>
                <th className="p-4 font-semibold text-slate-600 text-sm">Market Price</th>
                <th className="p-4 font-semibold text-slate-600 text-sm text-right">Market Value</th>
                <th className="p-4 font-semibold text-slate-600 text-sm text-right">Gain/Loss</th>
                <th className="p-4 font-semibold text-slate-600 text-sm"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {portfolio.map(stock => {
                const gain = (stock.currentPrice - stock.avgPrice) * stock.quantity;
                const gainPercent = ((stock.currentPrice - stock.avgPrice) / stock.avgPrice) * 100;
                return (
                  <tr key={stock.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-medium text-slate-900">
                      <span className="px-2 py-1 rounded-md bg-slate-100 text-xs font-bold mr-2">{stock.market}</span>
                      {stock.symbol}
                    </td>
                    <td className="p-4 text-slate-600">{stock.name}</td>
                    <td className="p-4 text-slate-600">{stock.quantity}</td>
                    <td className="p-4 text-slate-600">${stock.avgPrice}</td>
                    <td className="p-4 font-medium text-slate-900">${stock.currentPrice}</td>
                    <td className="p-4 font-bold text-slate-900 text-right">${(stock.currentPrice * stock.quantity).toLocaleString()}</td>
                    <td className="p-4 text-right">
                       <div className={`flex flex-col items-end ${gain >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                         <span className="font-semibold">{gain >= 0 ? '+' : ''}{gain.toLocaleString()}</span>
                         <span className="text-xs">{gainPercent.toFixed(2)}%</span>
                       </div>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => onDelete(stock.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {portfolio.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-slate-400">
                    No stocks in portfolio yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold mb-4">Add Holding</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                 <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Market</label>
                  <select
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={formData.market}
                    onChange={e => setFormData({ ...formData, market: e.target.value as any })}
                  >
                    <option value="TWSE">Taiwan (TWSE)</option>
                    <option value="NASDAQ">US (NASDAQ)</option>
                    <option value="NYSE">US (NYSE)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Symbol</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={formData.symbol}
                    onChange={e => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
                    placeholder="e.g., 2330"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., TSMC"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={formData.quantity}
                    onChange={e => setFormData({ ...formData, quantity: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Avg Price</label>
                  <input
                    type="number"
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={formData.avgPrice}
                    onChange={e => setFormData({ ...formData, avgPrice: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Current Price</label>
                  <input
                    type="number"
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={formData.currentPrice}
                    onChange={e => setFormData({ ...formData, currentPrice: Number(e.target.value) })}
                  />
                </div>
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
                  Add Holding
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};