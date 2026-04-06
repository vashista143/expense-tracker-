<<<<<<< HEAD
import React from 'react'
import Switch from '../components/ToggleSwitch'
import BalenceSection from '../components/BalenceSection'
import Reports from '../components/Reports'
import TransactionSection from '../components/TransactionSection'
import InsightSection from '../components/InsightSection'
import { useState } from 'react'
import { X } from 'lucide-react'
const DashboardPage = ({dark, admin, onUpdateTransaction, onDeleteTransaction, setdark, onAddTransaction, income, expense, balance, transactions}) => {
const [showForm, setShowForm] = useState(false);
  return (
    <div className={`p-6 min-h-screen flex flex-col  ${dark? "bg-[#23232C] text-white" : "bg-gray-50 text-black"}`}>
      <div className='flex justify-between items-center mb-6'>
        <p className={`text-2xl font-bold ${dark ? "text-white" : "text-gray-800"}`}>Finance Tracker</p>
        <div className='flex gap-4'>
          {admin &&<button 
  onClick={() => setShowForm(!showForm)}
  className={`px-6 py-2.5 rounded-xl font-bold transition-all active:scale-95 border-2 ${
    dark ? "bg-emerald-500 border-emerald-400 text-black shadow-lg shadow-emerald-500/20" : "bg-white border-gray-100 text-gray-800"
  }`}
>
  {showForm ? 'Cancel' : '+ New Transaction'}
</button>}
 
{showForm && (
        <div className={`mb-8 p-6 rounded-3xl border-2 animate-in slide-in-from-top duration-300 ${
          dark ? "bg-[#1a1c1e] border-gray-800" : "bg-white border-gray-100 shadow-xl"
        }`}>
          <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end"
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const success = await onAddTransaction({
                title: formData.get("title"),
                amount: formData.get("amount"),
                category: formData.get("category"),
                type: formData.get("type"),
                date: formData.get("date"),
              });
              if (success) {
                setShowForm(false);
                e.target.reset();
              }
            }}
          >
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold uppercase text-gray-500 ml-1">Title</label>
        <input name="title" required className={`p-2 rounded-lg border-2 outline-none ${dark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'}`} placeholder="Salary, Rent..." />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold uppercase text-gray-500 ml-1">Amount</label>
        <input name="amount" type="number" required className={`p-2 rounded-lg border-2 outline-none ${dark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'}`} placeholder="0.00" />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold uppercase text-gray-500 ml-1">Category</label>
        <select name="category" className={`p-2 rounded-lg border-2 outline-none ${dark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
          <option value="Job">Job</option>
          <option value="Food">Food</option>
          <option value="Shopping">Shopping</option>
          <option value="Housing">Housing</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold uppercase text-gray-500 ml-1">Type</label>
        <select name="type" className={`p-2 rounded-lg border-2 outline-none ${dark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold uppercase text-gray-500 ml-1">Date</label>
        <input name="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} className={`p-2 rounded-lg border-2 outline-none ${dark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-100'}`} />
      </div>

      <button type="submit" className="lg:col-span-5 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
        Confirm & Sync Transaction
      </button>
    </form>
  </div>
)}
        <div className={`flex items-center ${dark? "bg-[#23232C]" : "bg-white"} px-4 py-2 rounded-full shadow-sm gap-3 border border-gray-100`}>
          <p className={`font-semibold text-sm ${dark ? "text-white" : "text-gray-800"}`}>{dark ? 'Dark' : 'Light'} mode</p>
          <Switch dark={dark} setdark={setdark} />
        </div>
        </div>
      </div>
      <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <BalenceSection income={income} expense={expense} balance={balance} dark={dark} />
          <InsightSection income={income} expense={expense} balance={balance} transactions={transactions}/>

        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch lg:h-[550px]"> 
          <Reports dark={dark} transactions={transactions} />
          <TransactionSection onUpdateTransaction={onUpdateTransaction} onDeleteTransaction={onDeleteTransaction} admin={admin} dark={dark} transactions={transactions}/>
        </div>
        
      </div>
    </div>
  )
}

=======
import React from 'react'
import Switch from '../components/ToggleSwitch'
import BalenceSection from '../components/BalenceSection'
import Reports from '../components/Reports'
import TransactionSection from '../components/TransactionSection'
import InsightSection from '../components/InsightSection'
import { useState } from 'react'
import { X } from 'lucide-react'
const DashboardPage = ({dark, admin, onUpdateTransaction, onDeleteTransaction, setdark, onAddTransaction, income, expense, balance, transactions}) => {
const [showForm, setShowForm] = useState(false);
  return (
    <div className={`p-6 min-h-screen flex flex-col  ${dark? "bg-[#23232C] text-white" : "bg-gray-50 text-black"}`}>
      <div className='flex justify-between items-center mb-6'>
        <p className={`text-2xl font-bold ${dark ? "text-white" : "text-gray-800"}`}>Finance Tracker</p>
        <div className='flex gap-4'>
          {admin &&<button 
  onClick={() => setShowForm(!showForm)}
  className={`px-6 py-2.5 rounded-xl font-bold transition-all active:scale-95 border-2 ${
    dark ? "bg-emerald-500 border-emerald-400 text-black shadow-lg shadow-emerald-500/20" : "bg-white border-gray-100 text-gray-800"
  }`}
>
  {showForm ? 'Cancel' : '+ New Transaction'}
</button>}
 
{showForm && (
        <div className={`mb-8 p-6 rounded-3xl border-2 animate-in slide-in-from-top duration-300 ${
          dark ? "bg-[#1a1c1e] border-gray-800" : "bg-white border-gray-100 shadow-xl"
        }`}>
          <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end"
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const success = await onAddTransaction({
                title: formData.get("title"),
                amount: formData.get("amount"),
                category: formData.get("category"),
                type: formData.get("type"),
                date: formData.get("date"),
              });
              if (success) {
                setShowForm(false);
                e.target.reset();
              }
            }}
          >
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold uppercase text-gray-500 ml-1">Title</label>
        <input name="title" required className={`p-2 rounded-lg border-2 outline-none ${dark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'}`} placeholder="Salary, Rent..." />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold uppercase text-gray-500 ml-1">Amount</label>
        <input name="amount" type="number" required className={`p-2 rounded-lg border-2 outline-none ${dark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'}`} placeholder="0.00" />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold uppercase text-gray-500 ml-1">Category</label>
        <select name="category" className={`p-2 rounded-lg border-2 outline-none ${dark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
          <option value="Job">Job</option>
          <option value="Food">Food</option>
          <option value="Shopping">Shopping</option>
          <option value="Housing">Housing</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold uppercase text-gray-500 ml-1">Type</label>
        <select name="type" className={`p-2 rounded-lg border-2 outline-none ${dark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold uppercase text-gray-500 ml-1">Date</label>
        <input name="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} className={`p-2 rounded-lg border-2 outline-none ${dark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-100'}`} />
      </div>

      <button type="submit" className="lg:col-span-5 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
        Confirm & Sync Transaction
      </button>
    </form>
  </div>
)}
        <div className={`flex items-center ${dark? "bg-[#23232C]" : "bg-white"} px-4 py-2 rounded-full shadow-sm gap-3 border border-gray-100`}>
          <p className={`font-semibold text-sm ${dark ? "text-white" : "text-gray-800"}`}>{dark ? 'Dark' : 'Light'} mode</p>
          <Switch dark={dark} setdark={setdark} />
        </div>
        </div>
      </div>
      <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <BalenceSection income={income} expense={expense} balance={balance} dark={dark} />
          <InsightSection income={income} expense={expense} balance={balance} transactions={transactions}/>

        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch lg:h-[550px]"> 
          <Reports dark={dark} transactions={transactions} />
          <TransactionSection onUpdateTransaction={onUpdateTransaction} onDeleteTransaction={onDeleteTransaction} admin={admin} dark={dark} transactions={transactions}/>
        </div>
        
      </div>
    </div>
  )
}

>>>>>>> d95d037875b5a0e814feb2c512e5d933a996893f
export default DashboardPage