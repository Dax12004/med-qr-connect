
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Sidebar } from "./Sidebar/Sidebar";
import { UserMenu } from "./Navigation/UserMenu";
import { icons } from "./icons";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Navigation links based on user role
  const getNavLinks = () => {
    if (user?.role === "patient") {
      return [
        { name: "Dashboard", icon: icons.dashboard, path: "/patient/dashboard" },
        { name: "My Records", icon: icons.records, path: "/patient/records" },
        { name: "Book Appointment", icon: icons.appointment, path: "/patient/appointments" },
        { name: "Emergency Data", icon: icons.emergency, path: "/patient/emergency" },
        { name: "Profile", icon: icons.profile, path: "/patient/profile" }
      ];
    } else if (user?.role === "doctor") {
      return [
        { name: "Dashboard", icon: icons.dashboard, path: "/doctor/dashboard" },
        { name: "My Patients", icon: icons.patients, path: "/doctor/patients" },
        { name: "Appointments", icon: icons.appointment, path: "/doctor/appointments" },
        { name: "Profile", icon: icons.profile, path: "/doctor/profile" }
      ];
    } else if (user?.role === "admin") {
      return [
        { name: "Dashboard", icon: icons.dashboard, path: "/admin/dashboard" },
        { name: "User Management", icon: icons.userManagement, path: "/admin/users" },
        { name: "QR Management", icon: icons.qrManagement, path: "/admin/qr-management" },
        { name: "Settings", icon: icons.settings, path: "/admin/settings" }
      ];
    }
    return [];
  };
  
  const navLinks = getNavLinks();
  
  return (
    <div className="min-h-screen flex flex-col bg-medical-light">
      {/* Top Navbar */}
      <header className="bg-white shadow-sm z-10 fixed top-0 left-0 right-0">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
              className="mr-4 text-gray-500 hover:text-medical-primary"
              aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link to="/" className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-medical-primary">
                <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
                <path d="M12 16v-4" />
                <path d="M12 12h4" />
                <path d="M12 8v.01" />
              </svg>
              <span className="font-bold text-xl text-medical-dark">QR Medical Records</span>
            </Link>
          </div>

          <UserMenu 
            userName={user?.name || ""} 
            userRole={user?.role || ""} 
            onLogout={handleLogout}
          />
        </div>
      </header>

      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen}
        navLinks={navLinks}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className={`flex-grow p-8 transition-all duration-300 min-h-[calc(100vh-65px)] ${
        isSidebarOpen ? "ml-64" : "ml-0"
      }`}>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
