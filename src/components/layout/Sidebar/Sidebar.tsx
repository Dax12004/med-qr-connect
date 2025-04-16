
import React from "react";
import { useLocation } from "react-router-dom";
import { NavLink } from "../Navigation/NavLink";
import { icons } from "../icons";

interface SidebarProps {
  isOpen: boolean;
  navLinks: Array<{
    name: string;
    icon: React.ReactNode;
    path: string;
  }>;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, navLinks, onLogout }) => {
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => onLogout()}
        />
      )}
      
      <aside 
        className={`fixed top-[65px] h-[calc(100vh-65px)] bg-white shadow-md z-30 transition-all duration-300 ease-in-out overflow-y-auto
          md:z-10 
          ${isOpen ? "w-64 left-0" : "w-64 -left-64 md:-left-64"}
        `}
      >
        <nav className="h-full flex flex-col justify-between">
          <div className="py-6 px-4 space-y-1 flex-grow">
            {navLinks.map(link => (
              <NavLink 
                key={link.path}
                to={link.path}
                icon={link.icon}
                name={link.name}
                isActive={location.pathname === link.path}
              />
            ))}
          </div>
          <div className="p-4 border-t border-gray-200">
            <button 
              onClick={onLogout} 
              className="flex items-center w-full py-3 rounded-md text-gray-600 hover:bg-gray-100 transition-colors px-[16px]"
            >
              <span className="mr-3">{icons.logout}</span>
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
};
