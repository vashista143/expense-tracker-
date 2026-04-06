import React from 'react'

const BalenceSection = ({income, expense, dark, balance}) => {
  return ( 
    <div className='border-2 shadow-md border-[#dadde0] rounded-xl p-5 flex justify-between'>
       <div className='flex justify-content gap-5 items-center'>
        <div className='flex flex-col'>
       <p className='text-lg font-semibold'>Total Balance</p>
        <p className='text-[2.5em] font-semibold'>₹{balance.toLocaleString('en-IN')}</p>
        </div>
        <img src='/grap.png' className='h-15 w-30'/>
        </div>
        <div className='flex flex-col gap-2 w-[30%]'>
            <div className={`flex-1  bg-[#abc4b2] px-2 py-1 rounded-lg ${dark? "text-black": "text-black"}`}>
                <p className={`text-sm `}>Income</p>
                <p className='text-sm font-semibold'>₹{income.toLocaleString('en-IN')}</p>
            </div>
            <div className={`flex-1 bg-gray-200  px-2 py-1 rounded-lg ${dark? "text-black": "text-black"}`}>
                <p className={`text-sm `}>Expense</p>
                <p className='text-sm font-semibold'>₹{expense.toLocaleString('en-IN')}</p>
            </div>
        </div>
    </div>
  )
}

export default BalenceSection
