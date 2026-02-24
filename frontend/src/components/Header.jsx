import React, { Profiler, useState } from "react";
import { useLocation } from "react-router-dom"; // URL detect karne ke liye
import {
  Bell,
  User,
  ChevronDown,
  LogOut,
  Settings as SettingsIcon,
} from "lucide-react";

const Header = ({ setIsAuthenticated }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation(); // Current path (/dashboard, /upload, etc.)

  // Path ke basis par Title aur Subtitle mapping
  const getHeaderContent = () => {
    switch (location.pathname) {
      case "/dashboard":
        return {
          title: "Dashboard Overview",
          subtitle: "Monitor your certificate generation and delivery metrics",
        };
      case "/upload":
        return {
          title: "Upload CSV",
          subtitle: "Import your data files to start generating certificates",
        };
      case "/certificates":
        return {
          title: "Certificate Records",
          subtitle: "View and manage all issued certificates",
        };
      case "/email-status":
        return {
          title: "Email Delivery Logs",
          subtitle: "Track the real-time status of sent emails",
        };
      case "/settings":
        return {
          title: "System Settings",
          subtitle: "Manage your profile and application preferences",
        };
      default:
        return {
          title: "CertiFlow Admin",
          subtitle: "Welcome back to your administration panel",
        };
    }
  };

  const { title, subtitle } = getHeaderContent();

  return (
   <header className="h-20 bg-white border-b border-[#C6C6D0] flex items-center justify-between px-10 sticky top-0 z-50 font-['poppins', sans-serif]">
      {/* 1. Dynamic Titles: Poppins for Heading, Urbanist for Subtitle */}
      <div className="flex flex-col">
        <h1 className="text-xl font-black text-[#0A0A0F] tracking-tight font-['Poppins',sans-serif] transition-all duration-300">
          {title}
        </h1>
        <p className="text-[11px] text-[#75757F] font-bold uppercase tracking-wider transition-all duration-300">
          {subtitle}
        </p>
      </div>

      {/* 2. Right Side Actions */}
      <div className="flex items-center gap-5">
        {/* Notification Bell: Updated to Vibrant Red (#FF3B3B) */}
        <button className="relative p-2.5 text-[#44444F] hover:bg-[#F5F5F7] rounded-xl transition-all group border border-transparent hover:border-[#C6C6D0]">
          <Bell size={20} strokeWidth={2.5} className="group-hover:text-[#0066FF] transition-colors" />
          <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-[#FF3B3B] rounded-full border-2 border-white shadow-[0_0_8px_rgba(255,59,59,0.4)]"></span>
        </button>

        {/* Profile Dropdown: Using Primary Blue (#0066FF) Accents */}
        <div className="relative border-l border-[#C6C6D0] pl-5 ml-2">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 p-1.5 pr-4 hover:bg-[#F5F5F7] rounded-2xl transition-all group border border-transparent hover:border-[#C6C6D0]"
          >
            <div className="w-9 h-9 bg-[#0066FF] rounded-xl flex items-center justify-center shadow-[0_4px_12px_rgba(0,102,255,0.25)] group-hover:scale-105 transition-transform">
              <User size={18} color="white" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col items-start leading-tight">
              <span className="text-xs font-black text-[#0A0A0F] font-['Poppins',sans-serif] tracking-tight">Admin</span>
              <span className="text-[9px] text-[#0066FF] font-black uppercase tracking-widest">
                Owner
              </span>
            </div>
            <ChevronDown
              size={14}
              strokeWidth={3}
              className={`text-[#75757F] transition-transform duration-300 ${isDropdownOpen ? "rotate-180 text-[#0066FF]" : ""}`}
            />
          </button>

          {/* Dropdown Menu: Updated to match Vibrant Theme surfacing */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-52 bg-white border border-[#C6C6D0] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] py-2 z-[60] overflow-hidden animate-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-2 border-b border-[#F5F5F7] mb-1">
                <p className="text-[10px] font-black text-[#75757F] uppercase tracking-widest">Account Settings</p>
              </div>
              <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#0A0A0F] hover:bg-[#F5F5F7] hover:text-[#0066FF] transition-all font-bold">
                <User size={16} strokeWidth={2.5} />
                <span>My Profile</span>
              </button>
              <button
                onClick={() => setIsAuthenticated(false)}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#FF3B3B] hover:bg-[#FF3B3B]/5 transition-all font-black"
              >
                <LogOut size={16} strokeWidth={2.5} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Backdrop */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/5 backdrop-blur-[1px]"
          onClick={() => setIsDropdownOpen(false)}
        ></div>
      )}
    </header>
  );
};

export default Header;
