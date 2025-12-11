import { GoogleGenAI } from "@google/genai";
import { Transaction, Stock, BankAccount } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getFinancialAdvice = async (
  transactions: Transaction[],
  portfolio: Stock[],
  accounts: BankAccount[]
): Promise<string> => {
  if (!apiKey) return "Please provide an API Key to get AI insights.";

  const totalBalance = accounts.reduce((acc, curr) => acc + curr.balance, 0);
  const totalStockValue = portfolio.reduce((acc, curr) => acc + (curr.quantity * curr.currentPrice), 0);
  
  // Summarize recent spending
  const recentExpenses = transactions
    .filter(t => t.type === 'EXPENSE')
    .slice(0, 10)
    .map(t => `${t.category}: $${t.amount}`)
    .join(', ');

  const prompt = `
    You are a professional financial advisor. Analyze the following financial snapshot for a user in Taiwan (TWD currency context).
    
    Overview:
    - Total Cash: ${totalBalance} TWD
    - Total Stock Portfolio Value: ${totalStockValue} TWD
    
    Portfolio:
    ${JSON.stringify(portfolio.map(s => ({ symbol: s.symbol, name: s.name, qty: s.quantity, avg: s.avgPrice, curr: s.currentPrice })))}

    Recent Expenses (Last 10):
    ${recentExpenses}

    Please provide:
    1. A brief assessment of financial health.
    2. An observation on spending habits.
    3. Specific advice on the stock portfolio (hold/sell suggestions based on general financial principles, not real-time market data).
    4. Format the response in Markdown. Keep it concise, encouraging, and professional.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Could not generate advice at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error connecting to AI service. Please check your API key.";
  }
};

export const categorizeTransaction = async (description: string): Promise<string> => {
   if (!apiKey) return "General";
   const prompt = `Categorize this financial transaction description into one word (e.g., Food, Transport, Housing, Salary, Shopping, Utilities, Health): "${description}". Return only the category word.`;
   
   try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      return response.text?.trim() || "Other";
   } catch (e) {
       return "Other";
   }
}