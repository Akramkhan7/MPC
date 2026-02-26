import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import LandingPage from "./Pages/LandingPage";
import LoginPage from "./components/LoginPage";
import DashboardOverview from "./Pages/DashboardOverview";
import Header from "./components/Header";
import UploadCSV from "./Pages/UploadCSV";
import Certificates from "./Pages/Certificates";
import EmailStatus from "./Pages/EmailStatus";
import UploadHistory from "./Pages/UploadHistory";
import ErrorLogs from "./Pages/ErrorLogs";
import Settings from "./Pages/Settings";
import { useEffect } from "react";
import axios from "axios";

const App = () => {
  const baseURL = `${import.meta.env.VITE_BACKEND_URL}/api`;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${baseURL}/auth/verify`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.valid) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route
        path="/login"
        element={<LoginPage setIsAuthenticated={setIsAuthenticated} />}
      />

      <Route
        path="/*"
        element={
          isAuthenticated ? (
            <div className="flex h-screen bg-[#F9FAFB] font-['Inter',sans-serif] overflow-hidden">
              <Sidebar />
              <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Header setIsAuthenticated={setIsAuthenticated} />

                <main className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-[#F5F5F5]">
                  <Routes>
                    <Route
                      path="/dashboard"
                      element={
                        <DashboardOverview
                          setIsAuthenticated={setIsAuthenticated}
                        />
                      }
                    />
                    <Route path="/upload" element={<UploadCSV />} />
                    <Route path="/certificates" element={<Certificates />} />
                    <Route path="/email-status" element={<EmailStatus />} />
                    <Route path="/history" element={<UploadHistory />} />
                    <Route path="/error-logs" element={<ErrorLogs />} />
                    <Route path="/settings" element={<Settings />} />
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
