import React, { useState } from 'react';
import { Transaction, Stock, BankAccount, TransactionType } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { getFinancialAdvice } from '../services/geminiService';
import { Bot, Sparkles } from 'lucide-react';

interface ReportsProps {
  transactions: Transaction[];
  portfolio: Stock[];
  accounts: BankAccount[];
}

export const Reports: React.FC<ReportsProps> = ({ transactions, portfolio, accounts }) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // --- Data Preparation ---
  const expenses = transactions.filter(t => t.type === TransactionType.EXPENSE);
  const expenseByCategory = expenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(expenseByCategory).map(([name, value]) => ({ name, value }));

  // Monthly Data (simplified for demo: just showing last 5 transactions as "recent flow")
  // In a real app, we'd aggregate by month
  const monthlyData = transactions.slice(0, 7).reverse().map(t => ({
      name: new Date(t.date).toLocaleDateString(),
      amount: t.type === TransactionType.INCOME ? t.amount : -t.amount
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  const handleGetAdvice = async () => {
    setLoading(true);
    const result = await getFinancialAdvice(transactions, portfolio, accounts);
    setAdvice(result);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Financial Reports</h2>
          <p className="text-slate-500">Visualize your income and expenses</p>
        </div>
        <button
          onClick={handleGetAdvice}
          disabled={loading}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-lg transition-all shadow-md disabled:opacity-70"
        >
          {loading ? (
             <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
                <Sparkles className="w-4 h-4" /> AI Financial Advisor
            </>
          )}
        </button>
      </div>

      {advice && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-purple-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
          <div className="flex gap-4">
             <div className="p-3 bg-purple-50 rounded-xl h-fit text-purple-600">
                <Bot className="w-6 h-6" />
             </div>
             <div className="flex-1">
                <h3 className="font-bold text-lg text-slate-800 mb-2">AI Assessment</h3>
                <div className="prose prose-sm prose-purple text-slate-600 max-w-none">
                    <pre className="whitespace-pre-wrap font-sans">{advice}</pre>
                </div>
             </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Breakdown */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Expense Breakdown</h3>
          <div className="h-64 w-full">
            {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    >
                    {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                </PieChart>
                </ResponsiveContainer>
            ) : (
                <div className="h-full flex items-center justify-center text-slate-400">No expense data</div>
            )}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
             {pieData.map((entry, index) => (
                 <div key={index} className="flex items-center gap-2">
                     <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                     <span className="text-slate-600 truncate">{entry.name}: ${entry.value.toLocaleString()}</span>
                 </div>
             ))}
          </div>
        </div>

        {/* Recent Cash Flow */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Recent Cash Flow</h3>
           <div className="h-64 w-full">
             {monthlyData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{fontSize: 12}} stroke="#94a3b8" />
                    <YAxis tick={{fontSize: 12}} stroke="#94a3b8" />
                    <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                    <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
             ) : (
                <div className="h-full flex items-center justify-center text-slate-400">No transaction data</div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};