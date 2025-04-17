
import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Settings = () => {
  const { user, updateAdminCredentials } = useAuth();
  const [credentials, setCredentials] = useState({
    currentUsername: "",
    currentPassword: "",
    newUsername: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    // Get stored admin credentials
    const storedCreds = localStorage.getItem('adminCredentials');
    if (storedCreds) {
      const { username } = JSON.parse(storedCreds);
      // Auto-fill the current username if available
      if (username) {
        setCredentials(prev => ({
          ...prev,
          currentUsername: username
        }));
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    // Basic validation
    if (credentials.newPassword !== credentials.confirmPassword) {
      toast.error("New passwords do not match");
      return false;
    }
    
    // Verify current credentials
    const storedCreds = localStorage.getItem('adminCredentials');
    if (!storedCreds) {
      // Check against default admin credentials
      if (
        credentials.currentUsername !== 'admin@qrmedi.com' || 
        credentials.currentPassword !== 'admin123'
      ) {
        toast.error("Current credentials are incorrect");
        return false;
      }
    } else {
      // Check against stored admin credentials
      const { username, password } = JSON.parse(storedCreds);
      if (
        credentials.currentUsername !== username || 
        credentials.currentPassword !== password
      ) {
        toast.error("Current credentials are incorrect");
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Show confirmation dialog before proceeding
    setShowConfirmDialog(true);
  };
  
  const confirmCredentialUpdate = async () => {
    setShowConfirmDialog(false);
    setIsLoading(true);
    
    try {
      // Update admin credentials
      await updateAdminCredentials(credentials.newUsername, credentials.newPassword);
      
      // Show success dialog
      setShowSuccessDialog(true);
      
      // Reset form
      setCredentials({
        currentUsername: credentials.newUsername,
        currentPassword: "",
        newUsername: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error("Failed to update credentials");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const closeSuccessDialog = () => {
    setShowSuccessDialog(false);
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
            Default admin credentials: Username: <code className="bg-medical-beige px-1 py-0.5 rounded">admin@qrmedi.com</code> / Password: <code className="bg-medical-beige px-1 py-0.5 rounded">admin123</code>
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

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Update</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to update the admin credentials?
              You will need to login again with the new credentials after this change.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCredentialUpdate}>
              Yes, Update Credentials
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={closeSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Credentials Updated Successfully</DialogTitle>
            <DialogDescription>
              Your admin credentials have been updated. Please use your new username and password the next time you log in.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              onClick={closeSuccessDialog}
              className="px-4 py-2 bg-medical-primary text-white rounded-md hover:bg-medical-secondary focus:outline-none"
            >
              Got it
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Settings;
