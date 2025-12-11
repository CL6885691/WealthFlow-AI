import { db } from "../firebaseConfig";
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  getDocs,
  onSnapshot,
  Timestamp
} from "firebase/firestore";
import { BankAccount, Transaction, Stock, User } from "../types";

// Helper to convert Firestore data to our types
const convertDoc = <T>(doc: any): T => ({
  id: doc.id,
  ...doc.data()
});

// --- Accounts ---
export const subscribeToAccounts = (userId: string, callback: (accounts: BankAccount[]) => void) => {
  const q = query(collection(db, "accounts"), where("userId", "==", userId));
  return onSnapshot(q, (snapshot) => {
    const accounts = snapshot.docs.map(doc => convertDoc<BankAccount>(doc));
    callback(accounts);
  });
};

export const addAccount = async (userId: string, account: Omit<BankAccount, 'id'>) => {
  await addDoc(collection(db, "accounts"), { ...account, userId });
};

export const updateAccount = async (id: string, data: Partial<BankAccount>) => {
  const ref = doc(db, "accounts", id);
  await updateDoc(ref, data);
};

export const deleteAccount = async (id: string) => {
  await deleteDoc(doc(db, "accounts", id));
};

// --- Transactions ---
export const subscribeToTransactions = (userId: string, callback: (txs: Transaction[]) => void) => {
  const q = query(collection(db, "transactions"), where("userId", "==", userId));
  return onSnapshot(q, (snapshot) => {
    const txs = snapshot.docs.map(doc => convertDoc<Transaction>(doc));
    // Sort by date desc locally
    txs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    callback(txs);
  });
};

export const addTransaction = async (userId: string, tx: Omit<Transaction, 'id'>) => {
  await addDoc(collection(db, "transactions"), { ...tx, userId });
};

export const deleteTransaction = async (id: string) => {
  await deleteDoc(doc(db, "transactions", id));
};

// --- Portfolio ---
export const subscribeToPortfolio = (userId: string, callback: (stocks: Stock[]) => void) => {
  const q = query(collection(db, "portfolio"), where("userId", "==", userId));
  return onSnapshot(q, (snapshot) => {
    const stocks = snapshot.docs.map(doc => convertDoc<Stock>(doc));
    callback(stocks);
  });
};

export const addStock = async (userId: string, stock: Omit<Stock, 'id'>) => {
  await addDoc(collection(db, "portfolio"), { ...stock, userId });
};

export const deleteStock = async (id: string) => {
  await deleteDoc(doc(db, "portfolio", id));
};

export const updateStock = async (id: string, data: Partial<Stock>) => {
  const ref = doc(db, "portfolio", id);
  await updateDoc(ref, data);
};
