
import React from "react";
import { icons } from "../icons";

interface UserMenuProps {
  userName: string;
  userRole: string;
  onLogout: () => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({ userName, userRole, onLogout }) => {
  return (
    <div className="flex items-center space-x-4">
      <div className="text-right">
        <p className="text-sm text-medical-dark">
          Welcome, {userRole === "doctor" ? "Dr. " : ""}{userName}
        </p>
        <p className="text-xs text-gray-500 capitalize">{userRole}</p>
      </div>
      <button 
        onClick={onLogout} 
        className="p-2 rounded text-gray-500 hover:text-medical-primary hover:bg-gray-100" 
        title="Logout"
      >
        {icons.logout}
      </button>
    </div>
  );
};
