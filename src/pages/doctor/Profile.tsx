
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";

const DoctorProfile = () => {
  const { user } = useAuth();
  
  // Form state
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    specialization: user?.doctorData?.specialization || "",
    degree: user?.doctorData?.degree || "",
    licenseNumber: user?.doctorData?.licenseNumber || "",
    experience: user?.doctorData?.experience?.toString() || "",
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would send an API request to update the user's profile
    // For now, we'll just show a success message
    setSuccessMessage("Profile updated successfully");
    setIsEditing(false);
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-medical-dark">Profile Settings</h1>
            <p className="text-gray-500 mt-1">
              View and update your professional information
            </p>
          </div>
          <div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-4 py-2 bg-medical-primary text-white rounded-md hover:bg-medical-secondary transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Edit Profile
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-100 p-4 rounded-md text-green-800">
            {successMessage}
          </div>
        )}

        {/* Profile Form */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              {/* Basic Information */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-medical-dark mb-4">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                        required
                      />
                    ) : (
                      <p className="text-medical-dark">Dr. {formData.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                        required
                        disabled
                      />
                    ) : (
                      <p className="text-medical-dark">{formData.email}</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Professional Information */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-medical-dark mb-4">Professional Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">
                      Specialization
                    </label>
                    {isEditing ? (
                      <input
                        id="specialization"
                        name="specialization"
                        type="text"
                        value={formData.specialization}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                        required
                      />
                    ) : (
                      <p className="text-medical-dark">{formData.specialization}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="degree" className="block text-sm font-medium text-gray-700 mb-1">
                      Degree
                    </label>
                    {isEditing ? (
                      <input
                        id="degree"
                        name="degree"
                        type="text"
                        value={formData.degree}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                      />
                    ) : (
                      <p className="text-medical-dark">{formData.degree}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      License Number
                    </label>
                    {isEditing ? (
                      <input
                        id="licenseNumber"
                        name="licenseNumber"
                        type="text"
                        value={formData.licenseNumber}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                        required
                      />
                    ) : (
                      <p className="text-medical-dark">{formData.licenseNumber}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                      Years of Experience
                    </label>
                    {isEditing ? (
                      <input
                        id="experience"
                        name="experience"
                        type="number"
                        min="0"
                        value={formData.experience}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                      />
                    ) : (
                      <p className="text-medical-dark">{formData.experience} years</p>
                    )}
                  </div>
                </div>
              </div>
              
              {isEditing && (
                <div className="mt-8 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-medical-primary text-white rounded-md hover:bg-medical-secondary"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Professional Statement */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-medical-dark mb-4">Professional Statement</h2>
            {isEditing ? (
              <textarea
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                placeholder="Write a brief statement about your professional practice and expertise..."
              ></textarea>
            ) : (
              <p className="text-gray-600">
                {user?.doctorData?.specialization === "Cardiology" 
                  ? "I am a board-certified cardiologist with extensive experience in diagnosing and treating heart conditions. My approach combines the latest medical advancements with personalized care for each patient."
                  : "No professional statement has been added yet. Click 'Edit Profile' to add one."}
              </p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorProfile;
