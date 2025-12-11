export interface User {
  id: string;
  username: string;
  email: string;
}

export interface BankAccount {
  id: string;
  name: string;
  bankName: string;
  accountNumber: string;
  balance: number;
  currency: string;
}

export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  TRANSFER = 'TRANSFER'
}

export interface Transaction {
  id: string;
  accountId: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  note: string;
}

export interface Stock {
  id: string;
  symbol: string;
  name: string;
  market: 'TWSE' | 'NASDAQ' | 'NYSE';
  quantity: number;
  avgPrice: number;
  currentPrice: number;
}

export interface AppState {
  user: User | null;
  accounts: BankAccount[];
  transactions: Transaction[];
  portfolio: Stock[];
}

export type View = 'DASHBOARD' | 'ACCOUNTS' | 'TRANSACTIONS' | 'STOCKS' | 'REPORTS' | 'LOGIN';