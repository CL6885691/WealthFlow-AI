import { BankAccount, Transaction, TransactionType, Stock, User } from './types';

export const CATEGORIES = {
  INCOME: ['Salary', 'Investment', 'Bonus', 'Other'],
  EXPENSE: ['Food', 'Transport', 'Housing', 'Entertainment', 'Utilities', 'Shopping', 'Health'],
};

export const DEMO_USER: User = {
  id: 'u1',
  username: 'DemoUser',
  email: 'demo@wealthflow.ai',
};

export const DEMO_ACCOUNTS: BankAccount[] = [
  { id: 'a1', name: 'Primary Savings', bankName: 'CTBC Bank', accountNumber: '822-1234567890', balance: 150000, currency: 'TWD' },
  { id: 'a2', name: 'Salary Account', bankName: 'E.SUN Bank', accountNumber: '808-9876543210', balance: 45000, currency: 'TWD' },
];

export const DEMO_STOCKS: Stock[] = [
  { id: 's1', symbol: '2330', name: 'TSMC', market: 'TWSE', quantity: 1000, avgPrice: 500, currentPrice: 980 },
  { id: 's2', symbol: 'AAPL', name: 'Apple Inc.', market: 'NASDAQ', quantity: 50, avgPrice: 150, currentPrice: 175 },
  { id: 's3', symbol: '0050', name: 'Yuanta Taiwan 50', market: 'TWSE', quantity: 2000, avgPrice: 120, currentPrice: 165 },
];

export const DEMO_TRANSACTIONS: Transaction[] = [
  { id: 't1', accountId: 'a2', amount: 65000, type: TransactionType.INCOME, category: 'Salary', date: new Date(Date.now() - 86400000 * 5).toISOString(), note: 'Monthly Salary' },
  { id: 't2', accountId: 'a1', amount: 12000, type: TransactionType.EXPENSE, category: 'Housing', date: new Date(Date.now() - 86400000 * 3).toISOString(), note: 'Rent Payment' },
  { id: 't3', accountId: 'a1', amount: 350, type: TransactionType.EXPENSE, category: 'Food', date: new Date(Date.now() - 86400000 * 1).toISOString(), note: 'Lunch with colleagues' },
  { id: 't4', accountId: 'a2', amount: 1500, type: TransactionType.EXPENSE, category: 'Transport', date: new Date(Date.now() - 86400000 * 2).toISOString(), note: 'HSR Ticket' },
];