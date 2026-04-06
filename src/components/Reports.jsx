import React, {useEffect, useMemo } from 'react'
import { PieChart, Line, Area, AreaChart ,LineChart, BarChart, Bar, CartesianGrid, XAxis, YAxis, Pie, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts";
import { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
const Reports = ({ transactions, dark }) => {
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
const[income, setincome]= useState(0);
const[expense, setexpense]= useState(0);
const[balance, setbalance]= useState(0);
useEffect(() => {
  if (!transactions) return; 
  const incomeval = transactions
    .filter(t => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);
  const expenses = transactions
    .filter(t => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);
  setincome(incomeval);
  setexpense(expenses);
  setbalance(incomeval - expenses);
}, [transactions]);


  const data = useMemo(() => {
    const result = (transactions || [])
      .filter((t) => t.type === 'expense')
      .reduce((acc, curr) => {
        const category = curr.category || 'Uncategorized';
        acc[category] = (acc[category] || 0) + curr.amount;
        return acc;
      }, {});

    return Object.entries(result).map(([name, value]) => ({
      name,
      value
    }));
  }, [transactions]);

const getColor = (value, min, max) => {
  if (max === min) return "#1c9568"; 
  const ratio = (value - min) / (max - min); 
  const start = { r: 88, g: 100, b: 117 };   
  const end   = { r: 0, g: 188, b: 125 };   
  const r = Math.round(start.r + (end.r - start.r) * ratio);
  const g = Math.round(start.g + (end.g - start.g) * ratio);
  const b = Math.round(start.b + (end.b - start.b) * ratio);
  return `rgb(${r}, ${g}, ${b}`;
};

const values = data.map(d => d.value);
const maxValue = Math.max(...values, 1);
const minValue = Math.min(...values, 0);
const total = data.reduce((sum, d) => sum + d.value, 0);
const [expanddonut, setexpanddonut] = useState(false);
const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

const availableYears = useMemo(() => {
  const years = new Set(
    (transactions || []).map(t => new Date(t.date).getFullYear())
  );
  return Array.from(years).sort((a, b) => b - a); 
}, [transactions]);

const getMonthlyExpenses = (transactions, year) => {
  const monthsOrder = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const result = (transactions || [])
    .filter(t => 
      t.type === "expense" && 
      new Date(t.date).getFullYear() === year
    )
    .reduce((acc, curr) => {
      const month = new Date(curr.date).toLocaleString("default", { month: "short" });
      acc[month] = (acc[month] || 0) + curr.amount;
      return acc;
    }, {});
  return monthsOrder.map(month => ({
    month,
    total: result[month] || 0
  }));
};

const monthlyData = useMemo(() => {
  return getMonthlyExpenses(transactions, selectedYear);
}, [transactions, selectedYear]);

const currentMonth = new Date().toLocaleString("default", { month: "short" });
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        padding: "2px 6px",
        fontSize: "10px",
        background: "black",
        color: "white",
        borderRadius: "6px",
        lineHeight: "1"
      }}>
        ₹{payload[0].value}
      </div>
    );
  }
  return null;
};
const [half, setHalf] = useState(0); 

const displayedData = half === 0 
  ? monthlyData.slice(0, 6)
  : monthlyData.slice(6, 12);

const cashflowYears = useMemo(() => {
  const map = {};
  (transactions || []).forEach((t) => {
    const date = new Date(t.date);
    const year = date.getFullYear();
    if (!map[year]) {
      map[year] = { income: 0, expense: 0 };
    }
    if (t.type === "income") {
      map[year].income += t.amount;
    } else {
      map[year].expense += t.amount;
    }
  });
  return Object.entries(map)
    .filter(([_, val]) => val.income > 0 || val.expense > 0)
    .map(([year]) => Number(year))
    .sort((a, b) => b - a);
}, [transactions]);

const generateCashflowData = (transactions = [], selectedYear) => {
  const monthsOrder = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  const monthsMap = {};
  monthsOrder.forEach(month => {
    monthsMap[month] = { month, income: 0, expense: 0 };
  });
  transactions.forEach((t) => {
    const date = new Date(t.date);
    const year = date.getFullYear();
    if (year !== selectedYear) return;
    const month = date.toLocaleString("default", { month: "short" });
    if (t.type === "income") {
      monthsMap[month].income += t.amount;
    } else {
      monthsMap[month].expense += t.amount;
    }
  });
  return monthsOrder.map(month => monthsMap[month]);
};

const [year, setYear] = useState(2026);
const monthsOrder = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const sortedData = generateCashflowData(transactions, year).sort(
  (a, b) => monthsOrder.indexOf(a.month) - monthsOrder.indexOf(b.month)
);
if (expanddonut) {
    return (
      <div className="relative  p-4 rounded-xl border-2 border-[#dadde0] aspect-square max-h-[80vh] w-full fade-in">
        <button
          onClick={() => setexpanddonut(false)}
          className="absolute top-4 right-4 border-gray-400 border bg-white/80 p-2 rounded-full shadow-sm z-50"
        >
          <img src="/minimize.png" alt="toggle" className="h-4 w-4" />
        </button>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={120}
              innerRadius={80}
              label={({ cx, cy, midAngle, outerRadius, name, value }) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 30;

  const x = (cx + radius * Math.cos(-midAngle * RADIAN));
  const y = (cy + radius * Math.sin(-midAngle * RADIAN));

  const textAnchor = x > cx ? "start" : "end";

  const iconSize = 14;
  const spacing = 4;

  return (
    <g>
      <image
      className={`${dark?"invert filter" :""}`}
        href={icons[name] || icons["Uncategorized"]}
        x={textAnchor === "start" ? x : x - iconSize}
        y={y - iconSize / 2}
        width={iconSize}
        height={iconSize}
      />
      <text
        x={textAnchor === "start" ? x + iconSize + spacing : x - spacing}
        y={y + 4}
        fontSize="9"
        fill={dark ? "#FFFFFF" : "#333333"} 
        textAnchor={textAnchor}
        className="font-medium transition-colors duration-300"
            >
        {name}: ₹{value}
      </text>
    </g>
  );
}}
                style={{ fontSize: '9px' }}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.value, minValue, maxValue)} />
              ))}
              <LabelList dataKey="value" position="inside" fill="#fff" fontSize={10} formatter={(v) => `${((v / total) * 100).toFixed(0)}%`} />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="border-2 h-full border-[#dadde0] rounded-xl p-4  flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
          <p className="font-bold text-sm mb-2 ">Spending breakdown</p>
          <div className={`${dark?"":"border-1 border-[#dadde0]"}  rounded-xl p-2 aspect-square w-full relative group`}>
            <button
              onClick={() => setexpanddonut(true)}
              className="absolute top-2 right-2 border-gray-300 border bg-white/90 p-1 rounded-full shadow-sm z-10"
            >
              <img src="/expand.png" alt="toggle" className="h-3 w-3" />
            </button>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  innerRadius="45%"
                  outerRadius="75%"
                  label={({ cx, cy, midAngle, outerRadius, name, value }) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 10;

  const x = (cx + radius * Math.cos(-midAngle * RADIAN));
  const y = (cy + radius * Math.sin(-midAngle * RADIAN));

  const textAnchor = x > cx ? "start" : "end";

  const iconSize = 14;
  const spacing = 4;

  return (
    <g>
      <image
        href={icons[name] || icons["Uncategorized"]}
        x={textAnchor === "start" ? x : x - iconSize}
        y={y - iconSize / 2}
        width={iconSize}
        height={iconSize}
        className={`${dark ? "filter invert" : ""}`}
      />
      <text
  x={textAnchor === "start" ? x + iconSize + spacing : x - spacing}
  y={y + 4}
  fontSize="9"
  fill={dark ? "#FFFFFF" : "#333333"} 
  textAnchor={textAnchor}
  className="font-medium transition-colors duration-300"
>
  {name}: ₹{value}
</text>
    </g>
  );
}}
                style={{ fontSize: '9px' }}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getColor(entry.value, minValue, maxValue)} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <p className="font-bold text-sm ">Monthly expenses</p>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className={`text-[10px] ${dark ? 'bg-[#23232C] text-white' : 'bg-white text-black'} border rounded px-1 `}
            >
              {availableYears.map(year => <option key={year} value={year}>{year}</option>)}
            </select>
          </div>
          <div className={`rounded-xl aspect-4/3 w-full ${dark ? "bg-[#23232C]" : "border border-gray-100"} p-2`}>
            <div className="flex justify-between mb-1">
              <button onClick={() => setHalf(0)} className={`text-[10px] px-2 py-0.5 rounded border-1 border-gray-500`}><ArrowLeft color={dark ? "white" : "black"} size={15} /></button>
              <button onClick={() => setHalf(1)} className={`text-[10px] px-2 py-0.5 rounded border-1 border-gray-500`}><ArrowRight color={dark ? "white" : "black"} size={15} /></button>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={displayedData}>
                <defs>
                  <pattern id="diagonalLines" patternUnits="userSpaceOnUse" width="4" height="4">
                    <path d="M0 4 L4 0" stroke="#1c9568" strokeWidth="1" />
                  </pattern>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={10} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="total" radius={[4, 4, 4, 4]}>
                  {displayedData.map((entry, index) => (
                    <Cell 
                      key={index} 
                      fill={entry.month === currentMonth && selectedYear === 2026 ? "#1c9568" : "url(#diagonalLines)"} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className=" p-3 rounded-xl flex flex-col transition-all duration-300 ease-in-out">
  <div className="flex justify-between items-center mb-1">
    <p className="font-bold text-sm">Cashflow</p>
    <select 
      className="text-[10px] bg-transparent border-none outline-none cursor-pointer" 
      value={year} 
      onChange={(e) => setYear(Number(e.target.value))}
    >
      {cashflowYears.map(y => <option key={y} value={y}>{y}</option>)}
    </select>
  </div>
  
  <div className="flex justify-between items-end mb-2">
    <div>
      <p className="text-[10px]  font-medium">Total Balance</p>
      <p className="font-bold text-lg leading-none">₹{balance.toLocaleString("en-IN")}</p>
    </div>
    <div className="flex gap-3 text-[10px] font-bold uppercase tracking-tighter">
      <div className="flex items-center gap-1">
        <div className="h-2 w-2 rounded-full bg-blue-600" /> <span>Income</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="h-2 w-2 rounded-full bg-orange-600" /> <span>Expense</span>
      </div>
    </div>
  </div>
  <div className="w-full aspect-3/1 min-h-30">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={sortedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ea580c" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#ea580c" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis 
          dataKey="month" 
          axisLine={false} 
          tickLine={false} 
          fontSize={10} 
          tick={{fill: dark?"#ffffff":"#9ca3af"}}
          dy={5}
        />
        
        <YAxis
          hide={false}
          axisLine={false}
          tickLine={false}
          fontSize={10}
          tick={{fill: dark?"#ffffff":"#9ca3af"}}
          width={30}
          tickFormatter={(value) => value >= 1000 ? `${value / 1000}k` : value}
        />

        <Tooltip content={<CustomTooltip />} />

        <Area
          type="monotone"
          dataKey="income"
          stroke="#2563eb"
          strokeWidth={2}
          fill="url(#incomeGradient)"
          animationDuration={1000}
        />

        <Area
          type="monotone"
          dataKey="expense"
          stroke="#ea580c"
          strokeWidth={2}
          fill="url(#expenseGradient)"
          animationDuration={1000}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
</div>
    </div>
  );
};

export default Reports;