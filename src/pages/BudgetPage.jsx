import React, { useMemo } from 'react';
import { 
  TrendingUp, AlertCircle, CheckCircle2, Wallet, Plus,
  ShoppingBag, Utensils, Car, Home, Tag, Tv, IndianRupee
} from 'lucide-react';
const BudgetPage = ({ transactions = [], dark }) => {
  const budgetLimits = useMemo(() => ({
    "Food": 15000,
    "Shopping": 10000,
    "Housing": 25000,
    "Entertainment": 5000,
    "Bills": 8000,
    "Transport": 4000,
    "Uncategorized": 2000
  }), []);
  const budgetData = useMemo(() => {
    const spendingByCategory = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        const cat = t.category || "Uncategorized";
        acc[cat] = (acc[cat] || 0) + Number(t.amount);
        return acc;
      }, {});
    return Object.entries(budgetLimits).map(([category, limit]) => {
      const spent = spendingByCategory[category] || 0;
      const percent = Math.min((spent / limit) * 100, 100);
      return { category, spent, limit, percent };
    });
  }, [transactions, budgetLimits]);
  const totalBudget = useMemo(() => Object.values(budgetLimits).reduce((a, b) => a + b, 0), [budgetLimits]);
  const totalSpent = useMemo(() => budgetData.reduce((acc, curr) => acc + curr.spent, 0), [budgetData]);
  const remainingTotal = totalBudget - totalSpent;

  const theme = {
    bg: dark ? 'bg-[#121416]' : 'bg-gray-50',
    card: dark ? 'bg-[#1a1c1e] border-gray-800' : 'bg-white border-gray-100 shadow-sm',
    text: dark ? 'text-gray-100' : 'text-gray-900',
    subtext: dark ? 'text-gray-400' : 'text-gray-500',
    barBg: dark ? 'bg-gray-800' : 'bg-gray-200'
  };

  return (
    <div className={`min-h-screen p-4 sm:p-6 lg:p-8 transition-colors duration-300 ${theme.bg}`}>
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div className="space-y-1">
            <h1 className={`text-xl sm:text-2xl font-extrabold tracking-tight ${theme.text}`}>Monthly Budgets</h1>
            <p className={`text-xs sm:text-sm ${theme.subtext}`}>Track your spending vs your goals.</p>
          </div>
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-lg shadow-blue-600/20">
            <Plus size={18} />
            Set New Budget
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <StatCard 
            title="Total Budget" 
            value={`₹${totalBudget.toLocaleString()}`} 
            icon={<Wallet className="text-blue-500" size={20} />} 
            theme={theme} 
          />
          <StatCard 
            title="Spent So Far" 
            value={`₹${totalSpent.toLocaleString()}`} 
            icon={<TrendingUp className={totalSpent > totalBudget ? "text-red-500" : "text-emerald-500"} size={20} />} 
            theme={theme} 
            subtitle={`${((totalSpent/totalBudget)*100).toFixed(1)}% used`}
          />
          <StatCard 
            title="Safe to Spend" 
            value={`₹${remainingTotal > 0 ? remainingTotal.toLocaleString() : '0'}`} 
            icon={remainingTotal > 0 ? <CheckCircle2 className="text-emerald-500" size={20} /> : <AlertCircle className="text-red-500" size={20} />} 
            theme={theme} 
            subtitle="Available balance"
            highlight={remainingTotal <= 0}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {budgetData.map((item) => (
            <div key={item.category} className={`p-5 sm:p-6 rounded-2xl border-2 transition-all hover:shadow-lg ${theme.card}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl flex shrink-0 ${dark ? 'bg-gray-800' : 'bg-blue-50'}`}>
                    <CategoryIcon name={item.category} />
                  </div>
                  <div className="min-w-0">
                    <h3 className={`font-bold truncate ${theme.text}`}>{item.category}</h3>
                    <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Goal: ₹{item.limit.toLocaleString()}</p>
                  </div>
                </div>
                <div className={`text-[11px] font-black px-2 py-1 rounded-md shrink-0 ${item.spent > item.limit ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                  {item.percent.toFixed(0)}%
                </div>
              </div>
              <div className={`w-full h-2.5 rounded-full mb-4 overflow-hidden ${theme.barBg}`}>
                <div 
                  className={`h-full transition-all duration-700 rounded-full ${
                    item.percent > 90 ? 'bg-red-500' : item.percent > 70 ? 'bg-orange-500' : 'bg-blue-600'
                  }`}
                  style={{ width: `${item.percent}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] sm:text-xs font-bold">
                <span className={theme.subtext}>₹{item.spent.toLocaleString()} spent</span>
                <span className={item.spent > item.limit ? 'text-red-500' : 'text-blue-500'}>
                  {item.spent > item.limit ? 'Over by' : 'Remaining:'} ₹{Math.abs(item.limit - item.spent).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
const StatCard = ({ title, value, icon, theme, subtitle, highlight }) => (
  <div className={`p-5 rounded-2xl border-2 flex items-center gap-4 transition-all ${theme.card} ${highlight ? 'border-red-500/50' : ''}`}>
    <div className={`p-3 rounded-xl shrink-0 ${theme.barBg}`}>
      {icon}
    </div>
    <div className="min-w-0">
      <p className={`text-[10px] font-bold uppercase tracking-widest ${theme.subtext} truncate`}>{title}</p>
      <h2 className={`text-xl font-black mt-0.5 ${theme.text} truncate`}>{value}</h2>
      {subtitle && <p className="text-[10px] font-medium text-gray-500 mt-0.5 truncate">{subtitle}</p>}
    </div>
  </div>
);
const CategoryIcon = ({ name }) => {
  const props = { size: 18, className: "text-blue-500" };
  switch (name) {
    case 'Food': return <Utensils {...props} />;
    case 'Shopping': return <ShoppingBag {...props} />;
    case 'Transport': return <Car {...props} />;
    case 'Housing': return <Home {...props} />;
    case 'Entertainment': return <Tv {...props} />;
    default: return <Tag {...props} />;
  }
};

export default BudgetPage;