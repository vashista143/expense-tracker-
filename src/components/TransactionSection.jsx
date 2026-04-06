<<<<<<< HEAD
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Calendar, Tag, ArrowUpNarrowWide, SlidersHorizontal, 
  ArrowUpCircle, ArrowDownCircle, Search, X, Download, Pencil, MoreHorizontal 
} from 'lucide-react';
import EditModal from './EditForm';
const TransactionDashboard = ({onUpdateTransaction ,onDeleteTransaction, transactions = [], dark, admin }) => {
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('none'); 
  const [activeActionId, setActiveActionId] = useState(null);
  const [isSearchHovered, setIsSearchHovered] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const datePickerRef = useRef(null);
  const filterMenuRef = useRef(null);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');


const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      const success = await onDeleteTransaction(id);
      if (success) {
        setActiveActionId(null); 
      }
    }
  };

const [isEditModalOpen, setIsEditModalOpen] = useState(false);
const [editingItem, setEditingItem] = useState(null);

const handleEdit = (item) => {
  setEditingItem(item); 
  setIsEditModalOpen(true); 
  setActiveActionId(null); 
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
  link.setAttribute("download", `Transactions_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filterCategory !== 'All') count++;
    if (sortOrder !== 'none') count++;
    if (dateRange.start || dateRange.end) count++;
    return count;
  }, [filterCategory, sortOrder, dateRange]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDatePicker && datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setShowDatePicker(false);
      }
      if (showFilterMenu && filterMenuRef.current && !filterMenuRef.current.contains(event.target)) {
        setShowFilterMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDatePicker, showFilterMenu]);

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];
    if (searchTerm) {
      result = result.filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (filterCategory !== 'All') {
      result = result.filter(t => t.category === filterCategory);
    }
    if (dateRange.start && dateRange.end) {
      result = result.filter(t => {
        const tDate = new Date(t.date); 
        return tDate >= new Date(dateRange.start) && tDate <= new Date(dateRange.end);
      });
    }
    if (sortOrder === 'asc') result.sort((a, b) => a.amount - b.amount);
    else if (sortOrder === 'desc') result.sort((a, b) => b.amount - a.amount);
    return result;
  }, [transactions, filterCategory, sortOrder, dateRange, searchTerm]);

  const categories = ['All', ...new Set(transactions.map(t => t.category))];
  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < filteredTransactions.length) {
          setVisibleCount((prev) => prev + 20);
        }
      },
      { threshold: 1.0 }
    );
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => { if (observerTarget.current) observer.unobserve(observerTarget.current); };
  }, [visibleCount, filteredTransactions.length]);
  const theme = {
    bg: dark ? 'bg-[#23232C]' : 'bg-white',
    border: dark ? 'border-white' : 'border-[#dadde0]',
    text: dark ? 'text-gray-100' : 'text-gray-800',
    subtext: dark ? 'text-gray-400' : 'text-gray-500',
    card: dark ? 'bg-[#25282c]' : 'bg-gray-50/50',
    input: dark ? 'bg-[#2d3136] border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-900',
    hover: dark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50',
    dropdown: dark ? 'bg-[#1a1c1e] border-gray-700 shadow-2xl' : 'bg-white border-gray-200 shadow-2xl'
  };
  return (
    <div className={`border-2 ${theme.border} ${theme.bg} rounded-xl p-4 flex flex-col gap-4 h-full overflow-hidden transition-colors duration-300`}>
      <div className="flex justify-between items-center shrink-0">
        <h2 className={`text-lg font-bold ${theme.text}`}>Recent Transactions</h2>
        
        <div 
          onMouseEnter={() => setIsSearchHovered(true)}
          onMouseLeave={() => setIsSearchHovered(false)}
          className={`flex gap-2 p-1 rounded-xl transition-all duration-300 relative items-center min-h-[46px] ${
            isSearchHovered ? (dark ? 'bg-gray-800 ring-1 ring-gray-700' : 'bg-blue-50 ring-1 ring-blue-100') : ''
          }`}
        >
          {showSearchBar ? (
            <div className="flex items-center gap-2 w-full animate-in slide-in-from-right-4 duration-300">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  autoFocus
                  type="text"
                  placeholder="Search by description..."
                  className={`w-full pl-9 pr-4 py-2 border rounded-lg text-sm outline-none shadow-sm focus:ring-2 focus:ring-blue-500/20 ${theme.input}`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button 
                onClick={() => { setShowSearchBar(false); setSearchTerm(''); }}
                className={`p-2 rounded-lg border ${theme.border} ${theme.hover} shadow-sm ${theme.subtext}`}
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            <>
              <button 
  onClick={handleExportCSV} 
  title="Download CSV"
  className={`p-2 rounded-lg border shadow-sm relative transition-all active:scale-95 ${theme.hover} ${
    activeFilterCount > 0 ? 'border-orange-400 text-orange-500' : `${theme.border} ${theme.text}`
  }`}
>
  <Download size={18}/> 
    {activeFilterCount > 0 && (
    <span className="absolute -top-1 -right-1 bg-orange-500 w-2 h-2 rounded-full border border-white" />
  )}
</button>
              <button onClick={() => setShowSearchBar(true)} className={`p-2 rounded-lg border ${theme.border} ${theme.hover} shadow-sm ${theme.text}`}>
                <Search size={18}/>
              </button>

              <div className="relative" ref={datePickerRef}> 
                <button 
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className={`p-2 rounded-lg border shadow-sm transition-colors ${theme.hover} ${
                    dateRange.start ? 'border-blue-500 text-blue-500 font-bold' : `${theme.border} ${theme.text}`
                  }`}
                >
                  <Calendar size={18}/>
                </button>

                {showDatePicker && (
                  <div className={`absolute top-12 left-0 z-50 border p-4 rounded-xl flex flex-col gap-3 min-w-[220px] animate-in fade-in zoom-in duration-200 ${theme.dropdown}`}>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Start Date</label>
                      <input 
                        type="date" 
                        className={`text-xs p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 ${theme.input}`}
                        value={dateRange.start}
                        onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">End Date</label>
                      <input 
                        type="date" 
                        className={`text-xs p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 ${theme.input}`}
                        value={dateRange.end}
                        onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                      />
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-700/50">
                      <button onClick={() => { setDateRange({ start: '', end: '' }); setShowDatePicker(false); }} className="text-[10px] text-red-500 font-bold hover:opacity-80">Clear</button>
                      <button onClick={() => setShowDatePicker(false)} className="text-[10px] bg-blue-600 text-white px-3 py-1 rounded-md font-bold">Apply</button>
                    </div>
                  </div>
                )}
              </div>

              <select 
                className={`p-2 rounded-lg border text-sm outline-none cursor-pointer shadow-sm ${theme.input}`}
                onChange={(e) => setFilterCategory(e.target.value)}
                value={filterCategory}
              >
                {categories.map(cat => <option key={cat} value={cat} className={dark ? 'bg-[#1a1c1e]' : ''}>{cat}</option>)}
              </select>

              <button 
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                className={`p-2 rounded-lg border shadow-sm ${theme.hover} ${sortOrder !== 'none' ? 'text-blue-500 border-blue-500' : `${theme.border} ${theme.text}`}`}
              >
                <ArrowUpNarrowWide size={18}/>
              </button>

              <div className="relative" ref={filterMenuRef}>
                <button 
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                  className={`p-2 rounded-lg border shadow-sm relative transition-all ${theme.hover} ${
                    activeFilterCount > 0 ? 'border-orange-400 text-orange-500' : `${theme.border} ${theme.text}`
                  }`}
                >
                  <SlidersHorizontal size={18}/>
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[8px] font-bold px-1 rounded-full min-w-[14px]">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                {showFilterMenu && (
                  <div className={`absolute top-12 right-0 z-50 border p-4 rounded-xl min-w-[240px] animate-in slide-in-from-top-2 duration-200 ${theme.dropdown}`}>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className={`text-xs font-bold uppercase tracking-widest ${theme.text}`}>Active Filters</h3>
                      {activeFilterCount > 0 && (
                        <button onClick={() => { setFilterCategory('All'); setSortOrder('none'); setDateRange({ start: '', end: '' }); setShowFilterMenu(false); }} className="text-[10px] text-blue-500 font-bold">Reset All</button>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      {activeFilterCount === 0 ? <p className="text-xs text-gray-500 italic py-2">No filters applied</p> : (
                        <>
                          {filterCategory !== 'All' && <FilterTag label="Category" value={filterCategory} onClear={() => setFilterCategory('All')} dark={dark} />}
                          {sortOrder !== 'none' && <FilterTag label="Sort" value={sortOrder === 'asc' ? 'Low to High' : 'High to Low'} onClear={() => setSortOrder('none')} dark={dark} />}
                        </>
                      )}
                    </div>
                    <button onClick={() => setShowFilterMenu(false)} className={`w-full mt-4 py-2 rounded-lg text-[11px] font-bold transition-colors ${dark ? 'bg-blue-600 text-white' : 'bg-gray-900 text-white'}`}>Done</button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <div className={`flex flex-col rounded-xl border overflow-hidden flex-1 shadow-inner ${theme.card} ${theme.border}`}>
        <div className="overflow-x-hidden overflow-y-auto flex-1 custom-scrollbar">
          <table className="w-full text-left table-fixed">
            <thead className={`text-[11px] uppercase font-bold sticky top-0 z-10 border-b ${dark ? 'bg-[#25282c] border-gray-700 text-gray-500' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
              <tr>
                <th className="px-3 py-2 w-[12%]">Status</th>
                <th className="px-3 py-2 w-[15%]">Date</th>
                <th className="px-3 py-2">Description</th>
                <th className="px-3 py-2 w-[20%]">Category</th>
                <th className="px-3 py-2 text-right w-[20%]">Amount</th>
                {admin && <th className="px-3 py-2 text-right w-[10%]">Actions</th>} {/* Admin Column */}
              </tr>
            </thead>
            <tbody className={`divide-y ${dark ? 'divide-gray-700/50' : 'divide-gray-100'}`}>
  {filteredTransactions.slice(0, visibleCount).map((item) => (
    <tr key={item.id} className={`group transition-colors ${dark ? 'hover:bg-gray-700/30' : 'hover:bg-gray-100/50'}`}>
       <td className="px-3 py-2">
                    {item.type === 'income' ? 
                      <ArrowUpCircle className="text-emerald-500 bg-emerald-500/10 rounded-full p-1" size={28} /> : 
                      <ArrowDownCircle className={`rounded-full p-1 ${dark ? 'text-gray-500 bg-gray-500/10' : 'text-gray-400 bg-gray-100'}`} size={28} />
                    }
                  </td>
                  <td className={`px-3 py-2 text-sm whitespace-nowrap ${theme.subtext}`}>{item.date}</td>
                  <td className={`px-3 py-2 font-semibold text-sm ${theme.text}`}>
                    <div className="truncate ml-3" title={item.title}>{item.title}</div>
                  </td>
                  <td className="px-3 py-2">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-tight ${dark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-500'}`}>
                      {item.category}
                    </span>
                  </td>
                  <td className={`px-3 py-2 text-right font-bold text-sm ${item.type === 'income' ? 'text-emerald-500' : theme.text}`}>
                    <div className="flex justify-end">
                      <span title={`₹${item.amount.toLocaleString()}`} className="max-w-25 truncate block cursor-help">
                        {item.type === 'income' ? `+₹${item.amount.toLocaleString()}` : `-₹${item.amount.toLocaleString()}`}
                      </span>
                    </div>
                  </td>
                  {admin && (
                    <td className="px-3 py-2 text-right relative">
                      <button onClick={() => setActiveActionId(activeActionId === item.id ? null : item.id)}>
                        <MoreHorizontal size={18} className={theme.subtext} />
                      </button>

                      {activeActionId === item.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setActiveActionId(null)} />
                          <div className={`absolute right-10 top-2 z-20 w-32 rounded-xl border shadow-xl animate-in fade-in zoom-in duration-100 ${theme.dropdown}`}>
                            {/* FIX: The button triggers the state, NOT the modal component itself */}
                            <button 
                              onClick={() => handleEdit(item)}
                              className={`w-full flex items-center gap-2 px-4 py-2 text-xs font-bold ${theme.hover} rounded-t-xl`}
                            >
                              <Pencil size={14} className="text-blue-500" /> Edit
                            </button>
                            
                            <button 
                              onClick={() => handleDeleteClick(item.id)}
                              className={`w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-500 ${theme.hover} rounded-b-xl border-t ${dark ? 'border-gray-700' : 'border-gray-100'}`}
                            >
                              <X size={14} /> Delete
                            </button>
                          </div>
                        </>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <EditModal 
  isOpen={isEditModalOpen}
  item={editingItem}
  dark={dark}
  onClose={() => {
    setIsEditModalOpen(false);
    setEditingItem(null);
  }}
  onSave={async (data) => {
    const success = await onUpdateTransaction(data);
    if (success) {
      setIsEditModalOpen(false);
    }
    return success; 
  }}
/>
        <div ref={observerTarget} className="h-4 w-full flex justify-center py-4">
          {visibleCount < filteredTransactions.length && <div className="text-[10px] text-green-400 animate-pulse">Loading more...</div>}
        </div>
      </div>
    </div>
  );
};
const FilterTag = ({ label, value, onClear, dark }) => (
  <div className={`flex justify-between items-center p-2 rounded-lg border ${dark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
    <span className={`text-[11px] font-medium ${dark ? 'text-gray-300' : 'text-gray-600'}`}>{label}: <b>{value}</b></span>
    <button onClick={onClear} className="text-gray-400 hover:text-red-500">×</button>
  </div>
);

=======
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Calendar, Tag, ArrowUpNarrowWide, SlidersHorizontal, 
  ArrowUpCircle, ArrowDownCircle, Search, X, Download, Pencil, MoreHorizontal 
} from 'lucide-react';
import EditModal from './EditForm';
const TransactionDashboard = ({onUpdateTransaction ,onDeleteTransaction, transactions = [], dark, admin }) => {
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('none'); 
  const [activeActionId, setActiveActionId] = useState(null);
  const [isSearchHovered, setIsSearchHovered] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const datePickerRef = useRef(null);
  const filterMenuRef = useRef(null);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');


const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      const success = await onDeleteTransaction(id);
      if (success) {
        setActiveActionId(null); 
      }
    }
  };

const [isEditModalOpen, setIsEditModalOpen] = useState(false);
const [editingItem, setEditingItem] = useState(null);

const handleEdit = (item) => {
  setEditingItem(item); 
  setIsEditModalOpen(true); 
  setActiveActionId(null); 
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
  link.setAttribute("download", `Transactions_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filterCategory !== 'All') count++;
    if (sortOrder !== 'none') count++;
    if (dateRange.start || dateRange.end) count++;
    return count;
  }, [filterCategory, sortOrder, dateRange]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDatePicker && datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setShowDatePicker(false);
      }
      if (showFilterMenu && filterMenuRef.current && !filterMenuRef.current.contains(event.target)) {
        setShowFilterMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDatePicker, showFilterMenu]);

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];
    if (searchTerm) {
      result = result.filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (filterCategory !== 'All') {
      result = result.filter(t => t.category === filterCategory);
    }
    if (dateRange.start && dateRange.end) {
      result = result.filter(t => {
        const tDate = new Date(t.date); 
        return tDate >= new Date(dateRange.start) && tDate <= new Date(dateRange.end);
      });
    }
    if (sortOrder === 'asc') result.sort((a, b) => a.amount - b.amount);
    else if (sortOrder === 'desc') result.sort((a, b) => b.amount - a.amount);
    return result;
  }, [transactions, filterCategory, sortOrder, dateRange, searchTerm]);

  const categories = ['All', ...new Set(transactions.map(t => t.category))];
  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < filteredTransactions.length) {
          setVisibleCount((prev) => prev + 20);
        }
      },
      { threshold: 1.0 }
    );
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => { if (observerTarget.current) observer.unobserve(observerTarget.current); };
  }, [visibleCount, filteredTransactions.length]);
  const theme = {
    bg: dark ? 'bg-[#23232C]' : 'bg-white',
    border: dark ? 'border-white' : 'border-[#dadde0]',
    text: dark ? 'text-gray-100' : 'text-gray-800',
    subtext: dark ? 'text-gray-400' : 'text-gray-500',
    card: dark ? 'bg-[#25282c]' : 'bg-gray-50/50',
    input: dark ? 'bg-[#2d3136] border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-900',
    hover: dark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50',
    dropdown: dark ? 'bg-[#1a1c1e] border-gray-700 shadow-2xl' : 'bg-white border-gray-200 shadow-2xl'
  };
  return (
    <div className={`border-2 ${theme.border} ${theme.bg} rounded-xl p-4 flex flex-col gap-4 h-full overflow-hidden transition-colors duration-300`}>
      <div className="flex justify-between items-center shrink-0">
        <h2 className={`text-lg font-bold ${theme.text}`}>Recent Transactions</h2>
        
        <div 
          onMouseEnter={() => setIsSearchHovered(true)}
          onMouseLeave={() => setIsSearchHovered(false)}
          className={`flex gap-2 p-1 rounded-xl transition-all duration-300 relative items-center min-h-[46px] ${
            isSearchHovered ? (dark ? 'bg-gray-800 ring-1 ring-gray-700' : 'bg-blue-50 ring-1 ring-blue-100') : ''
          }`}
        >
          {showSearchBar ? (
            <div className="flex items-center gap-2 w-full animate-in slide-in-from-right-4 duration-300">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  autoFocus
                  type="text"
                  placeholder="Search by description..."
                  className={`w-full pl-9 pr-4 py-2 border rounded-lg text-sm outline-none shadow-sm focus:ring-2 focus:ring-blue-500/20 ${theme.input}`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button 
                onClick={() => { setShowSearchBar(false); setSearchTerm(''); }}
                className={`p-2 rounded-lg border ${theme.border} ${theme.hover} shadow-sm ${theme.subtext}`}
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            <>
              <button 
  onClick={handleExportCSV} 
  title="Download CSV"
  className={`p-2 rounded-lg border shadow-sm relative transition-all active:scale-95 ${theme.hover} ${
    activeFilterCount > 0 ? 'border-orange-400 text-orange-500' : `${theme.border} ${theme.text}`
  }`}
>
  <Download size={18}/> 
    {activeFilterCount > 0 && (
    <span className="absolute -top-1 -right-1 bg-orange-500 w-2 h-2 rounded-full border border-white" />
  )}
</button>
              <button onClick={() => setShowSearchBar(true)} className={`p-2 rounded-lg border ${theme.border} ${theme.hover} shadow-sm ${theme.text}`}>
                <Search size={18}/>
              </button>

              <div className="relative" ref={datePickerRef}> 
                <button 
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className={`p-2 rounded-lg border shadow-sm transition-colors ${theme.hover} ${
                    dateRange.start ? 'border-blue-500 text-blue-500 font-bold' : `${theme.border} ${theme.text}`
                  }`}
                >
                  <Calendar size={18}/>
                </button>

                {showDatePicker && (
                  <div className={`absolute top-12 left-0 z-50 border p-4 rounded-xl flex flex-col gap-3 min-w-[220px] animate-in fade-in zoom-in duration-200 ${theme.dropdown}`}>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Start Date</label>
                      <input 
                        type="date" 
                        className={`text-xs p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 ${theme.input}`}
                        value={dateRange.start}
                        onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">End Date</label>
                      <input 
                        type="date" 
                        className={`text-xs p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 ${theme.input}`}
                        value={dateRange.end}
                        onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                      />
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-700/50">
                      <button onClick={() => { setDateRange({ start: '', end: '' }); setShowDatePicker(false); }} className="text-[10px] text-red-500 font-bold hover:opacity-80">Clear</button>
                      <button onClick={() => setShowDatePicker(false)} className="text-[10px] bg-blue-600 text-white px-3 py-1 rounded-md font-bold">Apply</button>
                    </div>
                  </div>
                )}
              </div>

              <select 
                className={`p-2 rounded-lg border text-sm outline-none cursor-pointer shadow-sm ${theme.input}`}
                onChange={(e) => setFilterCategory(e.target.value)}
                value={filterCategory}
              >
                {categories.map(cat => <option key={cat} value={cat} className={dark ? 'bg-[#1a1c1e]' : ''}>{cat}</option>)}
              </select>

              <button 
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                className={`p-2 rounded-lg border shadow-sm ${theme.hover} ${sortOrder !== 'none' ? 'text-blue-500 border-blue-500' : `${theme.border} ${theme.text}`}`}
              >
                <ArrowUpNarrowWide size={18}/>
              </button>

              <div className="relative" ref={filterMenuRef}>
                <button 
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                  className={`p-2 rounded-lg border shadow-sm relative transition-all ${theme.hover} ${
                    activeFilterCount > 0 ? 'border-orange-400 text-orange-500' : `${theme.border} ${theme.text}`
                  }`}
                >
                  <SlidersHorizontal size={18}/>
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[8px] font-bold px-1 rounded-full min-w-[14px]">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                {showFilterMenu && (
                  <div className={`absolute top-12 right-0 z-50 border p-4 rounded-xl min-w-[240px] animate-in slide-in-from-top-2 duration-200 ${theme.dropdown}`}>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className={`text-xs font-bold uppercase tracking-widest ${theme.text}`}>Active Filters</h3>
                      {activeFilterCount > 0 && (
                        <button onClick={() => { setFilterCategory('All'); setSortOrder('none'); setDateRange({ start: '', end: '' }); setShowFilterMenu(false); }} className="text-[10px] text-blue-500 font-bold">Reset All</button>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      {activeFilterCount === 0 ? <p className="text-xs text-gray-500 italic py-2">No filters applied</p> : (
                        <>
                          {filterCategory !== 'All' && <FilterTag label="Category" value={filterCategory} onClear={() => setFilterCategory('All')} dark={dark} />}
                          {sortOrder !== 'none' && <FilterTag label="Sort" value={sortOrder === 'asc' ? 'Low to High' : 'High to Low'} onClear={() => setSortOrder('none')} dark={dark} />}
                        </>
                      )}
                    </div>
                    <button onClick={() => setShowFilterMenu(false)} className={`w-full mt-4 py-2 rounded-lg text-[11px] font-bold transition-colors ${dark ? 'bg-blue-600 text-white' : 'bg-gray-900 text-white'}`}>Done</button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <div className={`flex flex-col rounded-xl border overflow-hidden flex-1 shadow-inner ${theme.card} ${theme.border}`}>
        <div className="overflow-x-hidden overflow-y-auto flex-1 custom-scrollbar">
          <table className="w-full text-left table-fixed">
            <thead className={`text-[11px] uppercase font-bold sticky top-0 z-10 border-b ${dark ? 'bg-[#25282c] border-gray-700 text-gray-500' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
              <tr>
                <th className="px-3 py-2 w-[12%]">Status</th>
                <th className="px-3 py-2 w-[15%]">Date</th>
                <th className="px-3 py-2">Description</th>
                <th className="px-3 py-2 w-[20%]">Category</th>
                <th className="px-3 py-2 text-right w-[20%]">Amount</th>
                {admin && <th className="px-3 py-2 text-right w-[10%]">Actions</th>} {/* Admin Column */}
              </tr>
            </thead>
            <tbody className={`divide-y ${dark ? 'divide-gray-700/50' : 'divide-gray-100'}`}>
  {filteredTransactions.slice(0, visibleCount).map((item) => (
    <tr key={item.id} className={`group transition-colors ${dark ? 'hover:bg-gray-700/30' : 'hover:bg-gray-100/50'}`}>
       <td className="px-3 py-2">
                    {item.type === 'income' ? 
                      <ArrowUpCircle className="text-emerald-500 bg-emerald-500/10 rounded-full p-1" size={28} /> : 
                      <ArrowDownCircle className={`rounded-full p-1 ${dark ? 'text-gray-500 bg-gray-500/10' : 'text-gray-400 bg-gray-100'}`} size={28} />
                    }
                  </td>
                  <td className={`px-3 py-2 text-sm whitespace-nowrap ${theme.subtext}`}>{item.date}</td>
                  <td className={`px-3 py-2 font-semibold text-sm ${theme.text}`}>
                    <div className="truncate ml-3" title={item.title}>{item.title}</div>
                  </td>
                  <td className="px-3 py-2">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-tight ${dark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-500'}`}>
                      {item.category}
                    </span>
                  </td>
                  <td className={`px-3 py-2 text-right font-bold text-sm ${item.type === 'income' ? 'text-emerald-500' : theme.text}`}>
                    <div className="flex justify-end">
                      <span title={`₹${item.amount.toLocaleString()}`} className="max-w-25 truncate block cursor-help">
                        {item.type === 'income' ? `+₹${item.amount.toLocaleString()}` : `-₹${item.amount.toLocaleString()}`}
                      </span>
                    </div>
                  </td>
                  {admin && (
                    <td className="px-3 py-2 text-right relative">
                      <button onClick={() => setActiveActionId(activeActionId === item.id ? null : item.id)}>
                        <MoreHorizontal size={18} className={theme.subtext} />
                      </button>

                      {activeActionId === item.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setActiveActionId(null)} />
                          <div className={`absolute right-10 top-2 z-20 w-32 rounded-xl border shadow-xl animate-in fade-in zoom-in duration-100 ${theme.dropdown}`}>
                            {/* FIX: The button triggers the state, NOT the modal component itself */}
                            <button 
                              onClick={() => handleEdit(item)}
                              className={`w-full flex items-center gap-2 px-4 py-2 text-xs font-bold ${theme.hover} rounded-t-xl`}
                            >
                              <Pencil size={14} className="text-blue-500" /> Edit
                            </button>
                            
                            <button 
                              onClick={() => handleDeleteClick(item.id)}
                              className={`w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-500 ${theme.hover} rounded-b-xl border-t ${dark ? 'border-gray-700' : 'border-gray-100'}`}
                            >
                              <X size={14} /> Delete
                            </button>
                          </div>
                        </>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <EditModal 
  isOpen={isEditModalOpen}
  item={editingItem}
  dark={dark}
  onClose={() => {
    setIsEditModalOpen(false);
    setEditingItem(null);
  }}
  onSave={async (data) => {
    const success = await onUpdateTransaction(data);
    if (success) {
      setIsEditModalOpen(false);
    }
    return success; 
  }}
/>
        <div ref={observerTarget} className="h-4 w-full flex justify-center py-4">
          {visibleCount < filteredTransactions.length && <div className="text-[10px] text-green-400 animate-pulse">Loading more...</div>}
        </div>
      </div>
    </div>
  );
};
const FilterTag = ({ label, value, onClear, dark }) => (
  <div className={`flex justify-between items-center p-2 rounded-lg border ${dark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
    <span className={`text-[11px] font-medium ${dark ? 'text-gray-300' : 'text-gray-600'}`}>{label}: <b>{value}</b></span>
    <button onClick={onClear} className="text-gray-400 hover:text-red-500">×</button>
  </div>
);

>>>>>>> d95d037875b5a0e814feb2c512e5d933a996893f
export default TransactionDashboard;