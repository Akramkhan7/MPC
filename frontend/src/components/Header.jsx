import React, { useState } from 'react';
import { Bell, User, ChevronDown, LogOut, Settings as SettingsIcon } from 'lucide-react';

const Header = ({ setIsAuthenticated }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="h-20 border-b border-[#E0E0E0] flex items-center justify-between px-10  z-50">
      {/* Left Side: Title & Subtitle */}
      <div className="flex flex-col">
        <h1 className="text-xl font-bold text-[#1A1A1A] tracking-tight">
          Dashboard Overview
        </h1>
        <p className="text-xs text-[#666666] font-medium">
          Monitor your certificate generation and delivery metrics
        </p>
      </div>

      {/* Right Side: Actions & Profile Dropdown */}
      <div className="flex items-center ">
        
        {/* Bell Icon with Notification Dot */}
        <button className="relative p-2.5 text-[#666666] hover:bg-[#F5F5F5] rounded-xl transition-all group">
          <Bell size={19} strokeWidth={2} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#B00020] rounded-full border-2 border-white"></span>
        </button>

        {/* Profile Dropdown Container */}
        <div className="relative border-l border-[#E0E0E0] pl-3 ml-1">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 p-1 pr-3 hover:bg-[#F5F5F5] rounded-full transition-all group border border-transparent hover:border-[#E0E0E0]"
          >
            {/* Profile Avatar */}
            <div className="w-8 h-8 bg-[#1A1A1A] rounded-full flex items-center justify-center shadow-sm">
              <User size={17} color="white" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col items-start leading-tight">
              <span className="text-xs font-bold text-[#1A1A1A]">Admin</span>
              <span className="text-[9px] text-[#A0A0A0] font-medium">Owner</span>
            </div>
            <ChevronDown size={14} className={`text-[#A0A0A0] transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Actual Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-48 bg-white border border-[#E0E0E0] rounded-2xl shadow-xl py-2 z-[60] overflow-hidden">
              <div className="px-4 py-2 border-b border-[#F5F5F5] mb-1">
                <p className="text-[10px] font-bold text-[#A0A0A0] uppercase tracking-widest">Account</p>
              </div>
              
              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#666666] hover:bg-[#F5F5F5] hover:text-[#1A1A1A] transition-all">
                <SettingsIcon size={16} />
                <span>Settings</span>
              </button>

              <button 
                onClick={() => setIsAuthenticated(false)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#B00020] hover:bg-red-50 transition-all font-semibold"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Click outside to close dropdown (Overlay) */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsDropdownOpen(false)}
        ></div>
      )}
    </header>
  );
};

export default Header;