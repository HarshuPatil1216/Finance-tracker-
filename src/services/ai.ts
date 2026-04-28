import { GoogleGenAI } from "@google/genai";
import { Transaction } from "../types";

export const getFinancialInsights = async (transactions: Transaction[], currentBudget: any[]) => {
  if (transactions.length === 0) return "Add some transactions to get personalized insights!";

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });
  
  const recentTransactionsStr = transactions
    .slice(0, 10)
    .map(t => `${t.date}: ${t.type} ${t.amount} in ${t.category}`)
    .join('\n');

  const prompt = `
    You are a smart personal finance assistant. Here are the user's recent transactions:
    ${recentTransactionsStr}

    Analyze the spending patterns and provide 2-3 concise, actionable insights (max 50 words each).
    Focus on areas like overspending, savings tips, or unusual patterns.
    Return the response as a bulleted list.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || "No insights available at the moment.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Unable to generate insights right now. Keep tracking your expenses!";
  }
};
