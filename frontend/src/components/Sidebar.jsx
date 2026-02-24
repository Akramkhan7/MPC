import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutGrid,
  UploadCloud,
  Award,
  Mail,
  History,
  AlertCircle,
  Settings,
  HelpCircle,
} from "lucide-react";

const Sidebar = () => {
  // Navigation mapping to your design menu
  const mainLinks = [
    { to: "/dashboard", label: "Dashboard", icon: <LayoutGrid size={18} /> },
    { to: "/upload", label: "Upload CSV", icon: <UploadCloud size={18} /> },
    { to: "/certificates", label: "Certificates", icon: <Award size={18} /> },
    { to: "/email-status", label: "Email Status", icon: <Mail size={18} /> },
    { to: "/history", label: "Upload History", icon: <History size={18} /> },
    { to: "/error-logs", label: "Error Logs", icon: <AlertCircle size={18} /> },
  ];

  // Colors from theme spec: Surface #F5F5F5, Hint #A0A0A0
  const activeClass =
    "flex items-center gap-3 px-4 py-3 rounded-xl bg-[#ECECEC] text-[#0066FF] font-bold transition-all ";
  const inactiveClass =
    "flex items-center gap-3 px-4 py-3 rounded-xl text-[#666666] hover:bg-[#E0E0E0] hover:text-[#1A1A1A] transition-all group";

  return (
    <div className="w-55 border-r border-[#E0E0E0] min-h-screen bg-[#F5F5F5]  flex flex-col justify-between sticky top-0 z-50 font-['Inter',sans-serif]">
      <div className="flex flex-col h-full py-6 px-6">
        {/* Top Section */}
        <div className="flex flex-col">
          {/* Logo Section: #1A1A1A Box with White Dot */}
          <div className="flex items-center gap-3 px-2 mb-7">
            <div className="w-8 h-8 bg-[#1A1A1A] rounded-md flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
            </div>
            <span className="text-xl font-bold tracking-tight text-[#1A1A1A]">
              CertiFlow
            </span>
          </div>

          {/* Main Menu Label */}
          <p className="px-4 text-[10px] font-bold text-[#A0A0A0] uppercase tracking-[0.2em] mb-4">
            Main Menu
          </p>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1">
            {mainLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  isActive ? activeClass : inactiveClass
                }
              >
                <span className="shrink-0 opacity-70 group-hover:opacity-100">
                  {link.icon}
                </span>
                <p className="text-sm">{link.label}</p>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Spacer to push content down */}
        <div className="flex-1"></div>

        {/* Bottom Section: Settings and Support */}
        <div className="mt-auto">
          <div className="pt-4 border-t border-[#E0E0E0]">
            <nav className="flex flex-col gap-1">
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  isActive ? activeClass : inactiveClass
                }
              >
                <Settings
                  size={18}
                  className="opacity-70 group-hover:opacity-100"
                />
                <p className="text-sm">Settings</p>
              </NavLink>
              <NavLink
                to="/support"
                className={({ isActive }) =>
                  isActive ? activeClass : inactiveClass
                }
              >
                <HelpCircle
                  size={18}
                  className="opacity-70 group-hover:opacity-100"
                />
                <p className="text-sm">Support</p>
              </NavLink>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
