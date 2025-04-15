import React, { createContext, useContext, useState } from 'react';
// User role types
export type UserRole = "patient" | "doctor" | "admin";

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profilePicture?: string;
}

// Patient specific data
export interface PatientData {
  height?: string;
  weight?: string;
  bloodGroup?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  allergies?: string[];
}

// Doctor specific data
export interface DoctorData {
  specialization?: string;
  degree?: string;
  licenseNumber?: string;
  experience?: number;
}

// Authentication context type
interface AuthContextType {
  user: (User & { patientData?: PatientData; doctorData?: DoctorData }) | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  isAuthenticated: false,
  isLoading: true,
});

// Auth Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<(User & { patientData?: PatientData; doctorData?: DoctorData }) | null>(null);
  const [isLoading, setIsLoading] = useState(true);


  // Login function
  const login = async (email: string, password: string) => {
    try {
      // Implement actual login logic here
      setIsLoading(false);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Register function
  const register = async (userData: any) => {
    try {
      // Implement actual registration logic here
      setIsLoading(false);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using the auth context
export const useAuth = () => useContext(AuthContext);