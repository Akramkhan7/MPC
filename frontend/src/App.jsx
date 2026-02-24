import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./components/LoginPage";
import DashboardOverview from "./pages/DashboardOverview";
import { Bell, User, ChevronDown } from "lucide-react";
import Header from "./components/Header";
import UploadCSV from "./pages/UploadCSV";
import Certificates from "./pages/Certificates";
import EmailStatus from "./pages/EmailStatus";
import UploadHistory from "./pages/UploadHistory";
import ErrorLogs from "./pages/ErrorLogs";
import Settings from "./pages/Settings";
// ... other imports

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Routes>
  {/* Public Landing Page */}
  <Route path="/" element={<LandingPage />} />

  {/* Login Page */}
  <Route
    path="/login"
    element={<LoginPage setIsAuthenticated={setIsAuthenticated} />}
  />

  {/* Protected Admin Routes */}
  <Route
    path="/*"
    element={
      isAuthenticated ? (
        /* h-screen: Fixes the total height to the viewport.
           overflow-hidden: Prevents the whole page from scrolling.
        */
        <div className="flex h-screen bg-[#F9FAFB] font-['Inter',sans-serif] overflow-hidden">
          
          {/* Sidebar: Sticky by nature because parent is h-screen */}
          <Sidebar />

          {/* Right Side: This container will handle its own scrolling */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            
            {/* Header: Fixed at the top */}
            <Header setIsAuthenticated={setIsAuthenticated} />
            
            {/* Main Content: This is the scrollable area */}
            <main className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-[#F5F5F5]">
              <Routes>
                <Route path="/dashboard" element={<DashboardOverview />} />
                <Route path="/upload" element={<UploadCSV />} />
                <Route path="/certificates" element={<Certificates />} />
                <Route path="/email-status" element={<EmailStatus />} />
                <Route path="/history" element={<UploadHistory />} />
                <Route path="/error-logs" element={<ErrorLogs />} />
                <Route path="/settings" element={<Settings />} />
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
