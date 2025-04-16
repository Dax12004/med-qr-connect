import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LayoutDashboard, FileText, Calendar, ShieldAlert, User } from 'lucide-react';

// Icons for the sidebar
const icons = {
  dashboard: <LayoutDashboard className="h-5 w-5" />,
  records: <FileText className="h-5 w-5" />,
  appointment: <Calendar className="h-5 w-5" />,
  emergency: <ShieldAlert className="h-5 w-5" />,
  profile: <User className="h-5 w-5" />,
  patients: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>,
  userManagement: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="19" x2="19" y1="8" y2="14" />
      <line x1="22" x2="16" y1="11" y2="11" />
    </svg>,
  qrManagement: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="5" height="5" x="3" y="3" rx="1" />
      <rect width="5" height="5" x="16" y="3" rx="1" />
      <rect width="5" height="5" x="3" y="16" rx="1" />
      <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
      <path d="M21 21v.01" />
      <path d="M12 7v3a2 2 0 0 1-2 2H7" />
      <path d="M3 12h.01" />
      <path d="M12 3h.01" />
      <path d="M12 16v.01" />
      <path d="M16 12h1" />
      <path d="M21 12v.01" />
      <path d="M12 21v-1" />
    </svg>,
  logout: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>,
  settings: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
};

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children
}) => {
  const {
    user,
    logout
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Navigation links based on user role
  const getNavLinks = () => {
    if (user?.role === "patient") {
      return [{
        name: "Dashboard",
        icon: icons.dashboard,
        path: "/patient/dashboard"
      }, {
        name: "My Records",
        icon: icons.records,
        path: "/patient/records"
      }, {
        name: "Book Appointment",
        icon: icons.appointment,
        path: "/patient/appointments"
      }, {
        name: "Emergency Data",
        icon: icons.emergency,
        path: "/patient/emergency"
      }, {
        name: "Profile",
        icon: icons.profile,
        path: "/patient/profile"
      }];
    } else if (user?.role === "doctor") {
      return [{
        name: "Dashboard",
        icon: icons.dashboard,
        path: "/doctor/dashboard"
      }, {
        name: "My Patients",
        icon: icons.patients,
        path: "/doctor/patients"
      }, {
        name: "Appointments",
        icon: icons.appointment,
        path: "/doctor/appointments"
      }, {
        name: "Profile",
        icon: icons.profile,
        path: "/doctor/profile"
      }];
    } else if (user?.role === "admin") {
      return [{
        name: "Dashboard",
        icon: icons.dashboard,
        path: "/admin/dashboard"
      }, {
        name: "User Management",
        icon: icons.userManagement,
        path: "/admin/users"
      }, {
        name: "QR Management",
        icon: icons.qrManagement,
        path: "/admin/qr-management"
      }, {
        name: "Settings",
        icon: icons.settings,
        path: "/admin/settings"
      }];
    }
    return [];
  };
  
  const navLinks = getNavLinks();
  
  return (
    <div className="min-h-screen flex flex-col bg-medical-light">
      {/* Top Navbar - Fixed */}
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

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-medical-dark">
                Welcome, {user?.role === "doctor" ? "Dr. " : ""}{user?.name}
              </p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
            <button onClick={handleLogout} className="p-2 rounded text-gray-500 hover:text-medical-primary hover:bg-gray-100" title="Logout">
              {icons.logout}
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar and Main Content - With fixed header offset */}
      <div className="flex flex-grow pt-[65px]">
        {/* Sidebar - Fixed position with scrolling */}
        <aside 
          className={`fixed top-[65px] h-[calc(100vh-65px)] bg-white shadow-md z-10 transition-all duration-300 ease-in-out overflow-y-auto ${
            isSidebarOpen ? "w-64 left-0" : "w-64 -left-64"
          }`}
        >
          <nav className="h-full flex flex-col justify-between">
            <div className="py-6 px-4 space-y-1 flex-grow">
              {navLinks.map(link => (
                <Link 
                  key={link.path} 
                  to={link.path} 
                  className={`flex items-center py-3 px-4 rounded-md transition-colors ${
                    location.pathname === link.path 
                      ? "bg-medical-beige text-medical-primary" 
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <span className="mr-3">{link.icon}</span>
                  <span>{link.name}</span>
                </Link>
              ))}
            </div>

            <div className="p-4 border-t border-gray-200">
              <button 
                onClick={handleLogout} 
                className="flex items-center w-full py-3 rounded-md text-gray-600 hover:bg-gray-100 transition-colors px-[16px]"
              >
                <span className="mr-3">{icons.logout}</span>
                <span>Logout</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content - Adjusted margin based on sidebar state */}
        <main className={`flex-grow p-8 transition-all duration-300 min-h-[calc(100vh-65px)] ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
