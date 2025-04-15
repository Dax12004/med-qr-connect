
import React, { createContext, useContext, useState, useEffect } from "react";

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

// Mock users for testing (would be replaced with API calls in a real app)
const MOCK_USERS = [
  {
    id: "p1",
    name: "John Doe",
    email: "patient@example.com",
    password: "password",
    role: "patient" as UserRole,
    patientData: {
      height: "175cm",
      weight: "70kg",
      bloodGroup: "O+",
      emergencyContact: "Jane Doe",
      emergencyPhone: "1234567890",
      allergies: ["Peanuts", "Penicillin"],
    },
  },
  {
    id: "d1",
    name: "Dr. Smith",
    email: "doctor@example.com",
    password: "password",
    role: "doctor" as UserRole,
    doctorData: {
      specialization: "Cardiology",
      degree: "MD",
      licenseNumber: "MED12345",
      experience: 10,
    },
  },
  {
    id: "a1",
    name: "Admin User",
    email: "admin@example.com",
    password: "password",
    role: "admin" as UserRole,
  },
];

// Auth Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<(User & { patientData?: PatientData; doctorData?: DoctorData }) | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing user session on mount
  useEffect(() => {
    // In a real app, this would check for JWT token and validate with backend
    const storedUser = localStorage.getItem("medicalQrUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    // Simulate API call delay
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Find user with matching credentials
    const foundUser = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (!foundUser) {
      setIsLoading(false);
      throw new Error("Invalid email or password");
    }

    // Remove password before storing in state/localStorage
    const { password: _, ...userWithoutPassword } = foundUser;
    setUser(userWithoutPassword);
    localStorage.setItem("medicalQrUser", JSON.stringify(userWithoutPassword));
    setIsLoading(false);
  };

  // Register function
  const register = async (userData: any) => {
    // Simulate API call delay
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In a real app, this would send registration data to backend
    const newUser = {
      id: `user_${Date.now()}`,
      ...userData,
    };

    // For mock purposes, we'll just add it to our in-memory mock
    MOCK_USERS.push(newUser);

    // Log the user in after registration
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem("medicalQrUser", JSON.stringify(userWithoutPassword));
    setIsLoading(false);
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("medicalQrUser");
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
