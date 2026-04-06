<<<<<<< HEAD
import React, { useState } from 'react';
import { 
  User, Bell, Lock, Eye, EyeOff, Shield, 
  Database, Trash2, Download, Moon, Sun, 
  ChevronRight, Smartphone, Globe, CreditCard, X, AlertTriangle
} from 'lucide-react';

const SettingsPage = ({ dark, setDark, transactions, setTransactions }) => {
  const [hideBalances, setHideBalances] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const theme = {
    bg: dark ? 'bg-[#121416]' : 'bg-gray-50',
    card: dark ? 'bg-[#1a1c1e] border-gray-800' : 'bg-white border-gray-100 shadow-sm',
    text: dark ? 'text-gray-100' : 'text-gray-900',
    subtext: dark ? 'text-gray-400' : 'text-gray-500',
    hover: dark ? 'hover:bg-gray-800' : 'hover:bg-gray-50',
    input: dark ? 'bg-[#2d3136] border-gray-700' : 'bg-gray-100 border-transparent',
    modal: dark ? 'bg-[#1a1c1e] border-gray-700' : 'bg-white border-gray-200'
  };

  const handleExportCSV = () => {
    if (!transactions || transactions.length === 0) {
      alert("No data available to export.");
      return;
    }
    const headers = ["ID", "Title", "Amount", "Type", "Category", "Date"];
    const csvContent = [
      headers.join(","), 
      ...transactions.map(t => [
        t.id,
        `"${t.title}"`, 
        t.amount,
        t.type,
        t.category,
        t.date
      ].join(","))
    ].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Zorvyn_Report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const handleClearData = () => {
    setTransactions([]); 
    setShowDeleteConfirm(false);
    alert("All transaction data has been permanently deleted.");
  };

  return (
    <div className={`min-h-screen p-4 sm:p-6 lg:p-8 transition-colors duration-300 ${theme.bg}`}>
      <div className="max-w-4xl mx-auto space-y-8">
                <div>
          <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${theme.text}`}>Settings</h1>
          <p className={theme.subtext}>Manage your account preferences and data security.</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <section className={`p-6 rounded-3xl border-2 ${theme.card}`}>
            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-2xl font-bold shadow-lg">SC</div>
              <div>
                <h3 className={`text-lg font-bold ${theme.text}`}>Sarah Chen</h3>
                <p className="text-xs font-medium text-blue-500">sarah.chen@zorvyn.com</p>
              </div>
            </div>
          </section>
          <section className="space-y-4">
            <h2 className={`text-xs font-black uppercase tracking-[0.2em] ml-2 ${theme.subtext}`}>Preferences</h2>
            <div className={`rounded-3xl border-2 overflow-hidden ${theme.card}`}>
              <ToggleRow icon={<Moon size={20} className="text-purple-500" />} title="Dark Mode" description="Switch between light and dark themes" value={dark} onChange={() => setDark(!dark)} theme={theme} />
            </div>
          </section>
          <section className="space-y-4">
            <h2 className={`text-xs font-black uppercase tracking-[0.2em] ml-2 ${theme.subtext}`}>Data & Security</h2>
            <div className={`rounded-3xl border-2 divide-y ${dark ? 'divide-gray-800' : 'divide-gray-100'} ${theme.card}`}>   
              <ActionRow 
                icon={<Download size={20} className="text-blue-500" />}
                title="Export Data"
                description="Download all transactions as a CSV file"
                theme={theme}
                onClick={handleExportCSV}
              /> 
              <ActionRow 
                icon={<Trash2 size={20} className="text-red-500" />}
                title="Clear All Data"
                description="Permanently delete all transaction history"
                theme={theme}
                danger
                onClick={() => setShowDeleteConfirm(true)}
              />

            </div>
          </section>
        </div>
      </div>
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className={`w-full max-w-md p-6 rounded-3xl border-2 shadow-2xl ${theme.modal}`}>
            <div className="flex items-center gap-3 text-red-500 mb-4">
              <AlertTriangle size={24} />
              <h3 className="text-lg font-bold">Dangerous Action</h3>
            </div>
            <p className={`text-sm mb-6 ${theme.subtext}`}>
              This will permanently delete all your recorded transactions. This action cannot be undone. Are you sure?
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className={`flex-1 py-3 rounded-xl font-bold text-sm border ${theme.border} ${theme.text} ${theme.hover}`}
              >
                Cancel
              </button>
              <button 
                onClick={handleClearData}
                className="flex-1 py-3 rounded-xl font-bold text-sm bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20 transition-all active:scale-95"
              >
                Delete Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
const ToggleRow = ({ icon, title, description, value, onChange, theme }) => (
  <div className={`flex items-center justify-between p-4 sm:p-6 transition-colors ${theme.hover}`}>
    <div className="flex items-center gap-4">
      <div className={`p-2.5 rounded-xl ${theme.bg}`}>{icon}</div>
      <div>
        <h4 className={`text-sm font-bold ${theme.text}`}>{title}</h4>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </div>
    <button onClick={onChange} className={`w-12 h-6 rounded-full relative transition-all duration-300 ${value ? 'bg-blue-600' : 'bg-gray-400'}`}>
      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${value ? 'left-7' : 'left-1'}`} />
    </button>
  </div>
);

const ActionRow = ({ icon, title, description, theme, danger, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between p-4 sm:p-6 transition-colors text-left ${theme.hover}`}
  >
    <div className="flex items-center gap-4">
      <div className={`p-2.5 rounded-xl ${theme.bg}`}>{icon}</div>
      <div>
        <h4 className={`text-sm font-bold ${danger ? 'text-red-500' : theme.text}`}>{title}</h4>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </div>
    <ChevronRight size={18} className="text-gray-500" />
  </button>
);

=======
import React, { useState } from 'react';
import { 
  User, Bell, Lock, Eye, EyeOff, Shield, 
  Database, Trash2, Download, Moon, Sun, 
  ChevronRight, Smartphone, Globe, CreditCard, X, AlertTriangle
} from 'lucide-react';

const SettingsPage = ({ dark, setDark, transactions, setTransactions }) => {
  const [hideBalances, setHideBalances] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const theme = {
    bg: dark ? 'bg-[#121416]' : 'bg-gray-50',
    card: dark ? 'bg-[#1a1c1e] border-gray-800' : 'bg-white border-gray-100 shadow-sm',
    text: dark ? 'text-gray-100' : 'text-gray-900',
    subtext: dark ? 'text-gray-400' : 'text-gray-500',
    hover: dark ? 'hover:bg-gray-800' : 'hover:bg-gray-50',
    input: dark ? 'bg-[#2d3136] border-gray-700' : 'bg-gray-100 border-transparent',
    modal: dark ? 'bg-[#1a1c1e] border-gray-700' : 'bg-white border-gray-200'
  };

  const handleExportCSV = () => {
    if (!transactions || transactions.length === 0) {
      alert("No data available to export.");
      return;
    }
    const headers = ["ID", "Title", "Amount", "Type", "Category", "Date"];
    const csvContent = [
      headers.join(","), 
      ...transactions.map(t => [
        t.id,
        `"${t.title}"`, 
        t.amount,
        t.type,
        t.category,
        t.date
      ].join(","))
    ].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Zorvyn_Report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const handleClearData = () => {
    setTransactions([]); 
    setShowDeleteConfirm(false);
    alert("All transaction data has been permanently deleted.");
  };

  return (
    <div className={`min-h-screen p-4 sm:p-6 lg:p-8 transition-colors duration-300 ${theme.bg}`}>
      <div className="max-w-4xl mx-auto space-y-8">
                <div>
          <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${theme.text}`}>Settings</h1>
          <p className={theme.subtext}>Manage your account preferences and data security.</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <section className={`p-6 rounded-3xl border-2 ${theme.card}`}>
            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-2xl font-bold shadow-lg">SC</div>
              <div>
                <h3 className={`text-lg font-bold ${theme.text}`}>Sarah Chen</h3>
                <p className="text-xs font-medium text-blue-500">sarah.chen@zorvyn.com</p>
              </div>
            </div>
          </section>
          <section className="space-y-4">
            <h2 className={`text-xs font-black uppercase tracking-[0.2em] ml-2 ${theme.subtext}`}>Preferences</h2>
            <div className={`rounded-3xl border-2 overflow-hidden ${theme.card}`}>
              <ToggleRow icon={<Moon size={20} className="text-purple-500" />} title="Dark Mode" description="Switch between light and dark themes" value={dark} onChange={() => setDark(!dark)} theme={theme} />
            </div>
          </section>
          <section className="space-y-4">
            <h2 className={`text-xs font-black uppercase tracking-[0.2em] ml-2 ${theme.subtext}`}>Data & Security</h2>
            <div className={`rounded-3xl border-2 divide-y ${dark ? 'divide-gray-800' : 'divide-gray-100'} ${theme.card}`}>   
              <ActionRow 
                icon={<Download size={20} className="text-blue-500" />}
                title="Export Data"
                description="Download all transactions as a CSV file"
                theme={theme}
                onClick={handleExportCSV}
              /> 
              <ActionRow 
                icon={<Trash2 size={20} className="text-red-500" />}
                title="Clear All Data"
                description="Permanently delete all transaction history"
                theme={theme}
                danger
                onClick={() => setShowDeleteConfirm(true)}
              />

            </div>
          </section>
        </div>
      </div>
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className={`w-full max-w-md p-6 rounded-3xl border-2 shadow-2xl ${theme.modal}`}>
            <div className="flex items-center gap-3 text-red-500 mb-4">
              <AlertTriangle size={24} />
              <h3 className="text-lg font-bold">Dangerous Action</h3>
            </div>
            <p className={`text-sm mb-6 ${theme.subtext}`}>
              This will permanently delete all your recorded transactions. This action cannot be undone. Are you sure?
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className={`flex-1 py-3 rounded-xl font-bold text-sm border ${theme.border} ${theme.text} ${theme.hover}`}
              >
                Cancel
              </button>
              <button 
                onClick={handleClearData}
                className="flex-1 py-3 rounded-xl font-bold text-sm bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20 transition-all active:scale-95"
              >
                Delete Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
const ToggleRow = ({ icon, title, description, value, onChange, theme }) => (
  <div className={`flex items-center justify-between p-4 sm:p-6 transition-colors ${theme.hover}`}>
    <div className="flex items-center gap-4">
      <div className={`p-2.5 rounded-xl ${theme.bg}`}>{icon}</div>
      <div>
        <h4 className={`text-sm font-bold ${theme.text}`}>{title}</h4>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </div>
    <button onClick={onChange} className={`w-12 h-6 rounded-full relative transition-all duration-300 ${value ? 'bg-blue-600' : 'bg-gray-400'}`}>
      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${value ? 'left-7' : 'left-1'}`} />
    </button>
  </div>
);

const ActionRow = ({ icon, title, description, theme, danger, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between p-4 sm:p-6 transition-colors text-left ${theme.hover}`}
  >
    <div className="flex items-center gap-4">
      <div className={`p-2.5 rounded-xl ${theme.bg}`}>{icon}</div>
      <div>
        <h4 className={`text-sm font-bold ${danger ? 'text-red-500' : theme.text}`}>{title}</h4>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </div>
    <ChevronRight size={18} className="text-gray-500" />
  </button>
);

>>>>>>> d95d037875b5a0e814feb2c512e5d933a996893f
export default SettingsPage;