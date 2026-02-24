import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./components/LoginPage";
import DashboardOverview from "./pages/DashboardOverview";
import { Bell, User, ChevronDown } from "lucide-react";
// ... other imports

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Routes>
      {/* Public Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Login Page with authentication logic */}
      <Route
        path="/login"
        element={<LoginPage setIsAuthenticated={setIsAuthenticated} />}
      />

      {/* Protected Admin Routes */}
      <Route
        path="/*"
        element={
          isAuthenticated ? (
            <div className="flex min-h-screen bg-[#F9FAFB] font-['Inter',sans-serif]">
              <Sidebar />
              <div className="flex-1 flex flex-col">
                <header className="h-20 bg-white border-b border-[#E0E0E0] flex items-center justify-between px-10 sticky top-0 z-50">
                  {/* Left Side: Page Title & Subtitle based on design specs */}
                  <div className="flex flex-col">
                    <h1 className="text-xl font-bold text-[#1A1A1A] tracking-tight">
                      Dashboard Overview
                    </h1>
                    <p className="text-xs text-[#666666] font-medium">
                      Monitor your certificate generation and delivery metrics
                    </p>
                  </div>

                  {/* Right Side: Actions & Profile */}
                  <div className="flex items-center gap-5">
                    {/* Lucide Bell with Enterprise Notification Badge */}
                    <button className="relative p-2.5 text-[#666666] hover:bg-[#F5F5F5] rounded-xl transition-all group">
                      <Bell size={20} strokeWidth={2} />
                      {/* Status Dot using #B00020 (Error/Notification Red) */}
                      <span className="absolute top-2 right-2 w-2 h-2 bg-[#B00020] rounded-full border-2 border-white"></span>
                    </button>

                    {/* User Profile Dropdown */}
                    <div className="flex items-center gap-3 pl-5 border-l border-[#E0E0E0] ml-2">
                      <div className="flex flex-col items-end">
                        <span className="text-xs font-bold text-[#1A1A1A]">
                          Admin User
                        </span>
                        <button
                          onClick={() => setIsAuthenticated(false)}
                          className="text-[10px] font-bold text-[#A0A0A0] uppercase tracking-wider hover:text-[#B00020] transition-colors"
                        >
                          Sign Out
                        </button>
                      </div>

                      {/* Profile Avatar with Lucide User Icon */}
                      <div className="flex items-center gap-2 p-1 pr-3 hover:bg-[#F5F5F5] rounded-full transition-all cursor-pointer group border border-transparent hover:border-[#E0E0E0]">
                        <div className="w-9 h-9 bg-[#1A1A1A] rounded-full flex items-center justify-center shadow-sm">
                          <User size={18} color="white" strokeWidth={2.5} />
                        </div>
                        <ChevronDown
                          size={14}
                          className="text-[#A0A0A0] group-hover:text-[#1A1A1A] transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </header>
                <main className="p-10">
                  <Routes>
                    <Route path="/dashboard" element={<DashboardOverview />} />
                    {/* Add other admin routes here */}
                  </Routes>
                </main>
              </div>
            </div>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
};

export default App;
