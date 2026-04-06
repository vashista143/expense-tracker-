<<<<<<< HEAD
import React, { useState, useEffect, useMemo } from 'react';
import Groq from "groq-sdk";
import { Sparkles, Loader2 } from 'lucide-react';
const groq = new Groq({ 
  apiKey: "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",
  dangerouslyAllowBrowser: true
});

const InsightSection = ({ income, expense, balance, transactions }) => {
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(false);

  const summary = useMemo(() => {
    const topExpenses = transactions
      .filter(t => t.type === 'expense')
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 3)
      .map(t => `${t.title}: ₹${t.amount}`);

    return { income, expense, balance, topExpenses };
  }, [income, expense, balance, transactions]);

  const generateInsights = async () => {
    if (income <= 0 || loading) return;
    
    setLoading(true);
    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [
        {
            role: "system",
            content: `You are a financial advisor. 
            Output exactly 3 bullet points. 
            Each bullet point must be ONE line only. 
            Total words must be under 30. 
            Format: Emoji + Short Sentence.`
        },
        {
            role: "user",
            content: `Data: Income ₹${summary.income}, Spent ₹${summary.expense}, Balance ₹${summary.balance}. Top: ${summary.topExpenses.join(", ")}.`
        }
        ],
        model: "llama-3.1-8b-instant",
      });

      setInsight(chatCompletion.choices[0]?.message?.content || "");
    } catch (error) {
      console.error("Groq Error:", error);
      setInsight("💰 Savings are stable! Watch those top expenses to boost your month-end balance.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (transactions.length > 0 && !insight) {
      generateInsights();
    }
  }, [income, transactions.length]);

  return (
<div className=" p-3 rounded-2xl border-2 border-[#dadde0] shadow-md h-full  relative overflow-hidden group">
  <Sparkles className="absolute -right-2 -top-2 opacity-10 group-hover:rotate-12 transition-transform" size={100} />
  
  <div className="relative z-10 h-full flex flex-col">
    <div className="flex justify-between items-center  shrink-0">
      <div className="flex items-center gap-2">
        <div className="bg-white/20 p-1.5 rounded-lg">
          <Sparkles size={16} className="text-blue-700" />
        </div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-blue-700 font-sans">
          AI Smart Insights
        </h3>
      </div>
      {!loading && insight && (
        <button 
          onClick={generateInsights}
          className="text-[10px] font-bold uppercase bg-gray-500/50 hover:bg-white/20 px-3 py-1 rounded-full transition-all active:scale-95 border border-white/5"
        >
          Refresh
        </button>
      )}
      {loading && <Loader2 size={16} className="animate-spin text-blue-100" />}
    </div>
    <div className="flex-1">
      {loading ? (
        <div className="space-y-3 animate-pulse">
          <div className="h-3 bg-white/20 rounded w-3/4"></div>
          <div className="h-3 bg-white/20 rounded w-full"></div>
          <div className="h-3 bg-white/20 rounded w-5/6"></div>
        </div>
      ) : (
        <div 
          className="text-sm font-medium leading-relaxed opacity-95 italic font-sans h-[80px] overflow-hidden line-clamp-4 whitespace-pre-line"
        >
          {insight || "Analyzing your transactions..."}
        </div>
      )}
    </div>
  </div>
</div>
  );
}

=======
import React, { useState, useEffect, useMemo } from 'react';
import Groq from "groq-sdk";
import { Sparkles, Loader2 } from 'lucide-react';
const groq = new Groq({ 
  apiKey: "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",
  dangerouslyAllowBrowser: true
});

const InsightSection = ({ income, expense, balance, transactions }) => {
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(false);

  const summary = useMemo(() => {
    const topExpenses = transactions
      .filter(t => t.type === 'expense')
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 3)
      .map(t => `${t.title}: ₹${t.amount}`);

    return { income, expense, balance, topExpenses };
  }, [income, expense, balance, transactions]);

  const generateInsights = async () => {
    if (income <= 0 || loading) return;
    
    setLoading(true);
    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [
        {
            role: "system",
            content: `You are a financial advisor. 
            Output exactly 3 bullet points. 
            Each bullet point must be ONE line only. 
            Total words must be under 30. 
            Format: Emoji + Short Sentence.`
        },
        {
            role: "user",
            content: `Data: Income ₹${summary.income}, Spent ₹${summary.expense}, Balance ₹${summary.balance}. Top: ${summary.topExpenses.join(", ")}.`
        }
        ],
        model: "llama-3.1-8b-instant",
      });

      setInsight(chatCompletion.choices[0]?.message?.content || "");
    } catch (error) {
      console.error("Groq Error:", error);
      setInsight("💰 Savings are stable! Watch those top expenses to boost your month-end balance.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (transactions.length > 0 && !insight) {
      generateInsights();
    }
  }, [income, transactions.length]);

  return (
<div className=" p-3 rounded-2xl border-2 border-[#dadde0] shadow-md h-full  relative overflow-hidden group">
  <Sparkles className="absolute -right-2 -top-2 opacity-10 group-hover:rotate-12 transition-transform" size={100} />
  
  <div className="relative z-10 h-full flex flex-col">
    <div className="flex justify-between items-center  shrink-0">
      <div className="flex items-center gap-2">
        <div className="bg-white/20 p-1.5 rounded-lg">
          <Sparkles size={16} className="text-blue-700" />
        </div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-blue-700 font-sans">
          AI Smart Insights
        </h3>
      </div>
      {!loading && insight && (
        <button 
          onClick={generateInsights}
          className="text-[10px] font-bold uppercase bg-gray-500/50 hover:bg-white/20 px-3 py-1 rounded-full transition-all active:scale-95 border border-white/5"
        >
          Refresh
        </button>
      )}
      {loading && <Loader2 size={16} className="animate-spin text-blue-100" />}
    </div>
    <div className="flex-1">
      {loading ? (
        <div className="space-y-3 animate-pulse">
          <div className="h-3 bg-white/20 rounded w-3/4"></div>
          <div className="h-3 bg-white/20 rounded w-full"></div>
          <div className="h-3 bg-white/20 rounded w-5/6"></div>
        </div>
      ) : (
        <div 
          className="text-sm font-medium leading-relaxed opacity-95 italic font-sans h-[80px] overflow-hidden line-clamp-4 whitespace-pre-line"
        >
          {insight || "Analyzing your transactions..."}
        </div>
      )}
    </div>
  </div>
</div>
  );
}

>>>>>>> d95d037875b5a0e814feb2c512e5d933a996893f
export default InsightSection;