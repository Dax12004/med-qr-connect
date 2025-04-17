
import React from "react";
import { Link } from "react-router-dom";

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  name: string;
  isActive: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

export const NavLink: React.FC<NavLinkProps> = ({ to, icon, name, isActive, onClick }) => {
  return (
    <Link 
      to={to} 
      className={`flex items-center py-3 px-4 rounded-md transition-colors ${
        isActive 
          ? "bg-medical-beige text-medical-primary" 
          : "text-gray-600 hover:bg-gray-100"
      }`}
      onClick={onClick}
    >
      <span className="mr-3">{icon}</span>
      <span className="text-sm font-medium">{name}</span>
    </Link>
  );
};
