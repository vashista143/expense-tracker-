import React, { useState, useEffect, useMemo } from 'react';
import { 
  PieChart, Line, Area, AreaChart, LineChart, BarChart, 
  Bar, CartesianGrid, XAxis, YAxis, Pie, Tooltip, 
  ResponsiveContainer, Cell, LabelList 
} from "recharts";
import { ArrowLeft, ArrowRight, TrendingUp, X, Info, Maximize2, BarChart3 } from 'lucide-react';

const ReportsPage = ({ transactions = [], dark }) => {
  const icons = {
    Food: "/food-dinner-svgrepo-com.svg",
    Health: "/health-care-love-svgrepo-com.svg",
    Housing: "/home-1-svgrepo-com.svg",
    Transport: "/transport-truck-svgrepo-com.svg",
    Shopping: "/shopping-cart-svgrepo-com.svg",
    Entertainment: "/entertainment-expenses-svgrepo-com.svg",
    Bills: "/pop-up-bill-and-wallet-2-svgrepo-com.svg",
    Uncategorized: "/other-svgrepo-com.svg",
  };
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [balance, setBalance] = useState(0);
  const [expandDonut, setExpandDonut] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [half, setHalf] = useState(0);
  const [cashflowYear, setCashflowYear] = useState(2026);

  useEffect(() => {
    if (!transactions) return;
    const inc = transactions.filter(t => t.type === "income").reduce((acc, t) => acc + t.amount, 0);
    const exp = transactions.filter(t => t.type === "expense").reduce((acc, t) => acc + t.amount, 0);
    setIncome(inc);
    setExpense(exp);
    setBalance(inc - exp);
  }, [transactions]);

  const pieData = useMemo(() => {
    const result = transactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, curr) => {
        const category = curr.category || 'Uncategorized';
        acc[category] = (acc[category] || 0) + curr.amount;
        return acc;
      }, {});
    return Object.entries(result).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const availableYears = useMemo(() => {
    const years = new Set(transactions.map(t => new Date(t.date).getFullYear()));
    return Array.from(years).sort((a, b) => b - a);
  }, [transactions]);

  const monthlyData = useMemo(() => {
    const monthsOrder = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const res = transactions
      .filter(t => t.type === "expense" && new Date(t.date).getFullYear() === selectedYear)
      .reduce((acc, curr) => {
        const m = new Date(curr.date).toLocaleString("default", { month: "short" });
        acc[m] = (acc[m] || 0) + curr.amount;
        return acc;
      }, {});
    return monthsOrder.map(m => ({ month: m, total: res[m] || 0 }));
  }, [transactions, selectedYear]);

  const displayedBarData = half === 0 ? monthlyData.slice(0, 6) : monthlyData.slice(6, 12);

  const cashflowData = useMemo(() => {
    const monthsOrder = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const map = {};
    monthsOrder.forEach(m => map[m] = { month: m, income: 0, expense: 0 });
    transactions.forEach((t) => {
      if (new Date(t.date).getFullYear() !== cashflowYear) return;
      const m = new Date(t.date).toLocaleString("default", { month: "short" });
      if (t.type === "income") map[m].income += t.amount;
      else map[m].expense += t.amount;
    });
    return monthsOrder.map(m => map[m]);
  }, [transactions, cashflowYear]);

  const theme = {
    bg: dark ? 'bg-[#121416]' : 'bg-gray-50',
    card: dark ? 'bg-[#1a1c1e] border-gray-800 shadow-xl' : 'bg-white border-[#dadde0] shadow-sm',
    text: dark ? 'text-gray-100' : 'text-gray-900',
    subtext: dark ? 'text-gray-400' : 'text-gray-500',
    grid: dark ? '#2d3136' : '#e5e7eb'
  };

  const getColor = (value) => {
    const values = pieData.map(d => d.value);
    const max = Math.max(...values, 1);
    const min = Math.min(...values, 0);
    const ratio = (value - min) / (max - min);
    return `rgb(${Math.round(88 + (28 - 88) * ratio)}, ${Math.round(100 + (149 - 100) * ratio)}, ${Math.round(117 + (104 - 117) * ratio)})`;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black text-white text-[10px] px-2 py-1 rounded-md shadow-xl border border-gray-700">
          ₹{payload[0].value.toLocaleString()}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 p-4 sm:p-6 lg:p-8 ${theme.bg}`}>
      <div className="max-w-[1600px] mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${theme.text}`}>Financial Analytics</h1>
            <p className={`text-sm ${theme.subtext}`}>Visualizing patterns in your 2026 cashflow.</p>
          </div>
          <div className={`flex items-center gap-4 p-2 rounded-2xl ${theme.card}`}>
             <div className="text-right px-2">
                <p className="text-[10px] font-bold uppercase text-gray-500">Current Balance</p>
                <p className={`text-lg font-black ${theme.text}`}>₹{balance.toLocaleString()}</p>
             </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className={`lg:col-span-5 rounded-3xl border-2 p-6 flex flex-col ${theme.card}`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className={`font-bold flex items-center gap-2 ${theme.text}`}><Info size={16} className="text-blue-500" /> Spending Categories</h3>
              <button onClick={() => setExpandDonut(true)} className={`p-2 rounded-xl transition-all ${dark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
                <Maximize2 size={16} className={theme.subtext} />
              </button>
            </div>
            <div className="h-[300px] sm:h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    innerRadius="55%"
                    outerRadius="85%"
                    stroke="none"
                    label={({ cx, cy, midAngle, outerRadius, name, value }) => {
                      const RADIAN = Math.PI / 180;
                      const radius = outerRadius + 15;
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);
                      const textAnchor = x > cx ? "start" : "end";
                      return (
                        <g>
                          <image
                            href={icons[name] || icons["Uncategorized"]}
                            x={textAnchor === "start" ? x : x - 14} y={y - 7}
                            width={14} height={14}
                            className={dark ? "filter invert" : ""}
                          />
                          <text x={textAnchor === "start" ? x + 18 : x - 18} y={y + 4} fontSize="10" fill={dark ? "#FFFFFF" : "#333333"} textAnchor={textAnchor} className="font-medium">{name}</text>
                        </g>
                      );
                    }}
                  >
                    {pieData.map((entry, index) => <Cell key={index} fill={getColor(entry.value)} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className={`lg:col-span-7 rounded-3xl border-2 p-6 flex flex-col ${theme.card}`}>
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <h3 className={`font-bold flex items-center gap-2 ${theme.text}`}><BarChart3 size={16} className="text-emerald-500" /> Expense Trends</h3>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                   <select 
                     value={selectedYear} 
                     onChange={(e) => setSelectedYear(Number(e.target.value))}
                     className={`text-xs font-bold px-3 py-1.5 rounded-lg border outline-none w-full sm:w-auto ${dark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'}`}
                   >
                     {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
                   </select>
                   <div className="flex bg-gray-500/10 rounded-lg p-1">
                      <button onClick={() => setHalf(0)} className={`p-1.5 rounded-md ${half === 0 ? 'bg-blue-600 text-white shadow-lg' : theme.subtext}`}><ArrowLeft size={16}/></button>
                      <button onClick={() => setHalf(1)} className={`p-1.5 rounded-md ${half === 1 ? 'bg-blue-600 text-white shadow-lg' : theme.subtext}`}><ArrowRight size={16}/></button>
                   </div>
                </div>
             </div>
             <div className="flex-1 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={displayedBarData}>
                    <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={11} tick={{fill: theme.subtext}} dy={10} />
                    <Tooltip content={<CustomTooltip />} cursor={{fill: dark ? '#2d3136' : '#f3f4f6', radius: 8}} />
                    <Bar dataKey="total" radius={[8, 8, 8, 8]} barSize={45}>
                      {displayedBarData.map((entry, index) => (
                        <Cell key={index} fill={entry.month === new Date().toLocaleString("default", { month: "short" }) ? "#1c9568" : "#2563eb"} fillOpacity={0.8} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
             </div>
          </div>
        </div>
        <div className={`rounded-3xl border-2 p-6 sm:p-8 ${theme.card}`}>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
            <div className="space-y-1">
               <p className="text-[10px] font-bold uppercase text-blue-500 tracking-[0.2em]">Net Cashflow</p>
               <h3 className={`text-2xl font-black ${theme.text}`}>Income vs Expenses</h3>
            </div>
            <div className="flex flex-wrap items-center gap-6 bg-gray-500/5 p-3 rounded-2xl border border-gray-500/10">
               <div className="flex gap-4 text-[10px] font-black uppercase">
                  <div className="flex items-center gap-2"><div className="h-2.5 w-2.5 rounded-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]" /> <span className={theme.text}>Income</span></div>
                  <div className="flex items-center gap-2"><div className="h-2.5 w-2.5 rounded-full bg-orange-600 shadow-[0_0_10px_rgba(234,88,12,0.5)]" /> <span className={theme.text}>Expenses</span></div>
               </div>
               <select 
                  className={`text-xs font-bold bg-transparent border-none outline-none ${theme.text}`}
                  value={cashflowYear} 
                  onChange={(e) => setCashflowYear(Number(e.target.value))}
                >
                  {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
            </div>
          </div>
          <div className="w-full h-[350px] sm:h-[450px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashflowData}>
                <defs>
                  <linearGradient id="incG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2563eb" stopOpacity={0.4}/><stop offset="95%" stopColor="#2563eb" stopOpacity={0}/></linearGradient>
                  <linearGradient id="expG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ea580c" stopOpacity={0.4}/><stop offset="95%" stopColor="#ea580c" stopOpacity={0}/></linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={11} tick={{fill: theme.subtext}} dy={10} />
                <YAxis axisLine={false} tickLine={false} fontSize={11} tick={{fill: theme.subtext}} tickFormatter={v => `₹${v/1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="income" stroke="#2563eb" strokeWidth={4} fill="url(#incG)" animationDuration={1500} />
                <Area type="monotone" dataKey="expense" stroke="#ea580c" strokeWidth={4} fill="url(#expG)" animationDuration={1500} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {expandDonut && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className={`relative w-full max-w-4xl aspect-square sm:aspect-video rounded-3xl p-8 border-2 ${theme.card}`}>
            <button onClick={() => setExpandDonut(false)} className="absolute top-6 right-6 p-2 rounded-full bg-red-500 text-white shadow-xl hover:scale-110 transition-transform">
               <X size={20} />
            </button>
            <h2 className={`text-2xl font-black mb-8 ${theme.text}`}>Category Distribution</h2>
            <ResponsiveContainer width="100%" height="90%">
               <PieChart>
                  <Pie data={pieData} dataKey="value" innerRadius="60%" outerRadius="90%" label={({name, value}) => `${name}: ₹${value}`}>
                     {pieData.map((entry, index) => <Cell key={index} fill={getColor(entry.value)} />)}
                  </Pie>
                  <Tooltip />
               </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;