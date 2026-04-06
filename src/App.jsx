import { useState } from 'react'
import './App.css'
import Dashboard from './pages/DashboardPage'
import TransactionsPage from './pages/TransactionsPage'
import SideBar from './components/SideBar'
import Budget from './pages/BudgetPage'
import Reports from './pages/ReportsPage'
import { useEffect } from 'react'
import Settings from './pages/SettingsPage'
function App() {
  const [dark, setdark] = useState(() => {
    const saved = localStorage.getItem("dark_mode");
    return saved !== null ? JSON.parse(saved) : false;
  });

  const [admin, setAdmin] = useState(() => {
    const saved = localStorage.getItem("is_admin");
    return saved !== null ? JSON.parse(saved) : false;
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState('dashboard')
  const [transactions, settransactions]= useState([])
  const [balance, setbalance]= useState(0)
  const [income, setincome]= useState(0)
  const [expense, setexpense]= useState(0)
  useEffect(() => {
    localStorage.setItem("dark_mode", JSON.stringify(dark));
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    localStorage.setItem("is_admin", JSON.stringify(admin));
  }, [admin]);
  const renderPage = () => {
    switch (activePage) {
      case 'transactions':
        return <TransactionsPage transactions={transactions} dark={dark} />
      case 'budgets':
        return <Budget transactions={transactions} dark={dark} />
      case 'reports':
        return <Reports transactions={transactions} dark={dark}/>
      case 'settings':
        return <Settings dark={dark} transactions={transactions} setDark={setdark}/>
      case 'dashboard':
      default:
        return <Dashboard onUpdateTransaction={onUpdateTransaction} onDeleteTransaction={onDeleteTransaction} admin={admin} onAddTransaction={onAddTransaction} dark={dark} setdark={setdark} income={income} expense={expense} balance={balance} transactions={transactions} />
    }
  }


const onUpdateTransaction = async (updatedTx) => {
  try {
    const res = await fetch("/api/transactions", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTx),
    });

    if (!res.ok) throw new Error("Update Failed");

    const savedData = await res.json();
    
    const updatedList = transactions.map(t => t.id === savedData.id ? savedData : t);
    localStorage.setItem("transactions", JSON.stringify(updatedList));
    settransactions(updatedList);
    
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};
const onAddTransaction = async (newTransaction) => {
  try {
    const response = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...newTransaction,
        amount: Number(newTransaction.amount), 
        id: String(Date.now()) 
      }),
    });

    if (!response.ok) throw new Error("Sync Failed");
    const savedData = await response.json();

    const localData = JSON.parse(localStorage.getItem("transactions") || "[]");
    const updatedLocal = [savedData, ...localData];
    localStorage.setItem("transactions", JSON.stringify(updatedLocal));
    settransactions(updatedLocal);
    
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const onDeleteTransaction = async (id) => {
  try {
    const res = await fetch(`/api/transactions?id=${id}`, { 
      method: 'DELETE' 
    });

    if (!res.ok) throw new Error("Delete Failed");
    const localData = JSON.parse(localStorage.getItem("transactions") || "[]");
    const updatedLocal = localData.filter(t => t.id !== id);
    localStorage.setItem("transactions", JSON.stringify(updatedLocal));
    settransactions(updatedLocal);

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};
useEffect(() => {
  const fetchdata = async()=>{
  try{
    const stored= JSON.parse(localStorage.getItem("transactions"));
    if(stored && stored.length>0){
      settransactions(stored);
      return;
    }
    const res = await fetch("/api/transactions");
    if(res.ok)
      {const data= await res.json();
        settransactions(data);
        localStorage.setItem("transactions", JSON.stringify(data));
      }
    else{
      settransactions(null);
      console.log(res);
    }
  }catch(err){
    console.log("Error fetching transactions data: ", err);  
  }}
  fetchdata();
},[])

useEffect(() => {
  if (!transactions) return;

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthlyIncome = transactions
    .filter(t => {
      const date = new Date(t.date);
      return (
        t.type === "income" &&
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear
      );
    })
    .reduce((acc, t) => acc + t.amount, 0);

  const monthlyExpense = transactions
    .filter(t => {
      const date = new Date(t.date);
      return (
        t.type === "expense" &&
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear
      );
    })
    .reduce((acc, t) => acc + t.amount, 0);

  setincome(monthlyIncome);
  setexpense(monthlyExpense);
  setbalance(monthlyIncome - monthlyExpense);
}, [transactions]);
console.log(transactions)
useEffect(() => {
  document.documentElement.classList.toggle("dark", dark)
}, [dark])

return (
    <div className={`flex flex-col lg:grid lg:grid-cols-[17%_83%] min-h-screen transition-colors duration-300 ${dark ? 'bg-[#121416]' : 'bg-[#EBEEF1]'}`}>
        <div className={`lg:hidden flex justify-between items-center p-4 border-b shrink-0 z-[100] ${dark ? 'bg-[#1A1C22] border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-800'}`}>
        <div className='flex items-center gap-2'>
          <img src="/cropped_circle_image.png" alt='logo' className='h-8 w-8' />
          <span className="font-bold text-sm">Sarah Chen</span>
        </div>
        <button 
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 rounded-lg hover:bg-gray-500/10"
        >
          <div className={`w-6 h-0.5 mb-1 ${dark ? 'bg-white' : 'bg-black'}`}></div>
          <div className={`w-6 h-0.5 mb-1 ${dark ? 'bg-white' : 'bg-black'}`}></div>
          <div className={`w-6 h-0.5 ${dark ? 'bg-white' : 'bg-black'}`}></div>
        </button>
      </div>
      <div className={`
        ${menuOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 fixed lg:static top-0 left-0 h-full w-[70%] sm:w-[50%] lg:w-auto 
        z-[150] transition-transform duration-300 ease-in-out
      `}>
        <SideBar 
          dark={dark} 
          setActivePage={(page) => { setActivePage(page); setMenuOpen(false); }} 
          activePage={activePage} 
          admin={admin} 
          setAdmin={setAdmin} 
        />
      </div>
      {menuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[140] lg:hidden" 
          onClick={() => setMenuOpen(false)}
        ></div>
      )}
      <div className={`flex-1 h-screen overflow-y-auto ${dark ? 'bg-[#121416]' : 'bg-[#EBEEF1]'}`}>
        {renderPage()}
      </div>
    </div>
  )
}

export default App
