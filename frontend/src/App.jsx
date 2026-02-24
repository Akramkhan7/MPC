import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./components/LoginPage";
import DashboardOverview from "./pages/DashboardOverview";
import Header from "./components/Header";
import UploadCSV from "./Pages/UploadCSV";
import Certificates from "./pages/Certificates";
import EmailStatus from "./pages/EmailStatus";
import UploadHistory from "./pages/UploadHistory";
import ErrorLogs from "./pages/ErrorLogs";
import Settings from "./pages/Settings";
import { useEffect } from "react";
import axios from "axios";

const App = () => {
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
        const response = await axios.get(
          "http://localhost:5005/api/auth/verify",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

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
