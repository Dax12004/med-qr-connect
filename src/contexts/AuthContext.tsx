
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
  updateAdminCredentials: (newUsername: string, newPassword: string) => Promise<void>;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  isAuthenticated: false,
  isLoading: true,
  updateAdminCredentials: async () => {},
});

// Default admin credentials
const DEFAULT_ADMIN = {
  email: 'admin@qrmedi.com',
  password: 'admin123'
};

// Auth Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<(User & { patientData?: PatientData; doctorData?: DoctorData }) | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Check for admin login
      if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
        // Admin login
        const adminUser = {
          id: 'admin-1',
          name: 'Admin',
          email: DEFAULT_ADMIN.email,
          role: 'admin' as UserRole
        };
        
        setUser(adminUser);
        localStorage.setItem('user', JSON.stringify(adminUser));
        
        // Store admin credentials (in a real app, this would be more secure)
        const adminCredentials = { 
          username: DEFAULT_ADMIN.email, 
          password: DEFAULT_ADMIN.password 
        };
        localStorage.setItem('adminCredentials', JSON.stringify(adminCredentials));
        
        setIsLoading(false);
        return;
      }
      
      // Check for custom admin credentials
      const storedAdminCreds = localStorage.getItem('adminCredentials');
      if (storedAdminCreds) {
        const adminCreds = JSON.parse(storedAdminCreds);
        if (email === adminCreds.username && password === adminCreds.password) {
          const adminUser = {
            id: 'admin-1',
            name: 'Admin',
            email: adminCreds.username,
            role: 'admin' as UserRole
          };
          
          setUser(adminUser);
          localStorage.setItem('user', JSON.stringify(adminUser));
          setIsLoading(false);
          return;
        }
      }
      
      // Mock login for patient/doctor - replace with actual API call
      const mockUser = {
        id: '1',
        name: 'Test Patient',
        email: email,
        role: 'patient' as UserRole,
        patientData: {
          height: '170cm',
          weight: '70kg'
        }
      };
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error('Login error:', error);
      throw error;
    }
  };

  // Register function - Updated to properly save user data
  const register = async (userData: any) => {
    try {
      setIsLoading(true);
      
      // Generate a unique ID
      const userId = Date.now().toString();
      
      // Create user object based on role
      const newUser = {
        id: userId,
        name: userData.name,
        email: userData.email,
        role: userData.role as UserRole,
      };
      
      // Add role-specific data
      if (userData.role === 'patient' && userData.patientData) {
        Object.assign(newUser, { patientData: userData.patientData });
      } else if (userData.role === 'doctor' && userData.doctorData) {
        Object.assign(newUser, { doctorData: userData.doctorData });
      }
      
      // Save user to localStorage
      localStorage.setItem('user', JSON.stringify(newUser));
      
      // Set user in state
      setUser(newUser);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error('Registration error:', error);
      throw error;
    }
  };

  // Update admin credentials
  const updateAdminCredentials = async (newUsername: string, newPassword: string) => {
    try {
      // Update the stored admin credentials
      const adminCredentials = {
        username: newUsername,
        password: newPassword
      };
      
      localStorage.setItem('adminCredentials', JSON.stringify(adminCredentials));
      
      // Update the current user if it's an admin
      if (user && user.role === 'admin') {
        const updatedUser = {
          ...user,
          email: newUsername
        };
        
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      return Promise.resolve();
    } catch (error) {
      console.error('Update admin credentials error:', error);
      return Promise.reject(error);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateAdminCredentials,
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
