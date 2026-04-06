import React from 'react'
import { useState } from 'react'
const SideBar = ({ dark, setActivePage, activePage, admin, setAdmin }) => {
  const [openDropdown, setOpenDropdown] = useState(false);

  return (
    <div className={`p-5 h-full flex flex-col border-r-2 ${dark ? 'bg-[#1A1C22] text-white border-gray-700' : 'bg-white text-gray-800 border-[#dadde0]'}`}>
            <div className='text-xl font-semibold mb-2'>
        <img src="/cropped_circle_image.png" alt='logo' className='inline-block h-8 w-8 mr-2' />
        <span>sarah chen</span>
      </div>
      <div className="mt-8 flex flex-col gap-1">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: '/dashboard.png' },
          { id: 'transactions', label: 'Transactions', icon: '/transaction.png' },
          { id: 'budgets', label: 'Budgets', icon: '/budget.png' },
          { id: 'reports', label: 'Reports', icon: '/report.png' },
          { id: 'settings', label: 'Settings', icon: '/settings.png' },
        ].map((item) => (
          <p
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`px-5 py-3 cursor-pointer rounded-xl transition-all flex items-center ${
              activePage === item.id
                ? dark 
                  ? 'bg-gray-700/50 text-white shadow-sm' 
                  : 'bg-gray-400 text-gray-900 shadow-sm' 
                : 'hover:bg-gray-500/10' 
            }`}
          >
            <img
              src={item.icon}
              alt="logo"
              className={`h-5 w-5 mr-3 transition-all ${dark ? 'brightness-0 invert' : ''}`}
            />
            <span className="font-medium">{item.label}</span>
          </p>
        ))}
      </div>
      <div className='mt-auto pt-6 relative'>
        {openDropdown && (
          <div className={`absolute bottom-16 left-0 w-full shadow-2xl rounded-xl p-2 z-[160] border ${dark ? 'bg-[#2A2D35] border-gray-600 text-white' : 'bg-white border-gray-200 text-black'}`}>
            <p onClick={() => { setAdmin(true); setOpenDropdown(false); }} className={`p-3 hover:bg-blue-500/10 cursor-pointer rounded-lg font-medium`}>Admin</p>
            <p onClick={() => { setAdmin(false); setOpenDropdown(false); }} className={`p-3 hover:bg-blue-500/10 cursor-pointer rounded-lg font-medium`}>Viewer</p>
          </div>
        )}
        
        <div 
          onClick={() => setOpenDropdown(!openDropdown)}
          className={`flex p-3 rounded-xl items-center cursor-pointer transition-all ${dark ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200"}`}
        >
          <img src="/cropped_circle_image.png" className='h-8 w-8 rounded-full border-2 border-blue-500' />
          <div className='flex flex-col ml-3 overflow-hidden'>
            <p className={`font-bold text-xs truncate ${dark ? 'text-white' : 'text-black'}`}>
              Role: {admin ? 'Admin' : 'User'}
            </p>
            <p className='text-blue-500 text-[10px] font-bold uppercase tracking-tighter'>
              Tap to Switch
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SideBar
