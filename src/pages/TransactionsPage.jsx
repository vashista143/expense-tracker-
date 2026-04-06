import React from 'react';
import TransactionDashboard from '../components/TransactionSection';

const TransactionsPage = ({ transactions, dark }) => {
  return (
    <div className={`min-h-screen transition-colors duration-300 ${dark ? 'bg-[#121416] text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="p-4 lg:p-8 max-w-[1600px] mx-auto h-screen flex flex-col">
                <div className="mb-6 shrink-0">
          <h1 className="text-2xl font-extrabold tracking-tight">Full Transaction History</h1>
          <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
            Manage, filter, and export your financial records.
          </p>
        </div>
        <div className="flex-1 min-h-0"> 
          <TransactionDashboard transactions={transactions} dark={dark} />
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;