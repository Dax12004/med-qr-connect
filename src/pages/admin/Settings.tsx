
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { toast } from "@/components/ui/use-toast";

const Settings = () => {
  const [credentials, setCredentials] = useState({
    currentUsername: "",
    currentPassword: "",
    newUsername: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (credentials.newPassword !== credentials.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive"
      });
      return;
    }
    
    // Default admin credentials check (in a real app, this would be a backend check)
    if (credentials.currentUsername !== "admin" || credentials.currentPassword !== "admin") {
      toast({
        title: "Error",
        description: "Current credentials are incorrect",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Here you would make an API call to update credentials
      // For this demo, we'll just simulate a successful update
      setTimeout(() => {
        toast({
          title: "Success",
          description: "Admin credentials updated successfully",
        });
        
        setCredentials({
          currentUsername: "",
          currentPassword: "",
          newUsername: "",
          newPassword: "",
          confirmPassword: "",
        });
        
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update credentials",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-medical-dark">Admin Settings</h1>
          <p className="text-gray-500 mt-1">
            Manage admin credentials and system settings
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-medical-dark mb-4">Change Admin Credentials</h2>
          <p className="text-gray-500 mb-6">
            Default admin credentials: Username: <code className="bg-medical-beige px-1 py-0.5 rounded">admin</code> / Password: <code className="bg-medical-beige px-1 py-0.5 rounded">admin</code>
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Credentials */}
            <div className="space-y-4">
              <h3 className="text-md font-medium text-medical-dark">Current Credentials</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="currentUsername" className="block text-sm font-medium text-gray-700 mb-1">
                    Current Username
                  </label>
                  <input
                    id="currentUsername"
                    name="currentUsername"
                    type="text"
                    value={credentials.currentUsername}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                  />
                </div>
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={credentials.currentPassword}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                  />
                </div>
              </div>
            </div>
            
            {/* New Credentials */}
            <div className="space-y-4">
              <h3 className="text-md font-medium text-medical-dark">New Credentials</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="newUsername" className="block text-sm font-medium text-gray-700 mb-1">
                    New Username
                  </label>
                  <input
                    id="newUsername"
                    name="newUsername"
                    type="text"
                    value={credentials.newUsername}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                  />
                </div>
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={credentials.newPassword}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={credentials.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                  />
                </div>
              </div>
            </div>
            
            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-medical-primary text-white rounded-md hover:bg-medical-brown/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medical-primary disabled:opacity-50"
              >
                {isLoading ? "Updating..." : "Update Credentials"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
