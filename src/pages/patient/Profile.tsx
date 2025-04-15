
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";

const PatientProfile = () => {
  const { user } = useAuth();
  
  // Form state
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    height: user?.patientData?.height || "",
    weight: user?.patientData?.weight || "",
    bloodGroup: user?.patientData?.bloodGroup || "",
    emergencyContact: user?.patientData?.emergencyContact || "",
    emergencyPhone: user?.patientData?.emergencyPhone || "",
    allergies: user?.patientData?.allergies?.join(", ") || "",
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
              View and update your personal information
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
                      <p className="text-medical-dark">{formData.name}</p>
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
              
              {/* Medical Information */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-medical-dark mb-4">Medical Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
                      Height
                    </label>
                    {isEditing ? (
                      <input
                        id="height"
                        name="height"
                        type="text"
                        value={formData.height}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                        placeholder="e.g., 175cm"
                      />
                    ) : (
                      <p className="text-medical-dark">{formData.height || "Not specified"}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                      Weight
                    </label>
                    {isEditing ? (
                      <input
                        id="weight"
                        name="weight"
                        type="text"
                        value={formData.weight}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                        placeholder="e.g., 70kg"
                      />
                    ) : (
                      <p className="text-medical-dark">{formData.weight || "Not specified"}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700 mb-1">
                      Blood Group
                    </label>
                    {isEditing ? (
                      <input
                        id="bloodGroup"
                        name="bloodGroup"
                        type="text"
                        value={formData.bloodGroup}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                        placeholder="e.g., A+"
                      />
                    ) : (
                      <p className="text-medical-dark">{formData.bloodGroup || "Not specified"}</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Emergency Contact */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-medical-dark mb-4">Emergency Contact</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700 mb-1">
                      Emergency Contact Name
                    </label>
                    {isEditing ? (
                      <input
                        id="emergencyContact"
                        name="emergencyContact"
                        type="text"
                        value={formData.emergencyContact}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                        required
                      />
                    ) : (
                      <p className="text-medical-dark">{formData.emergencyContact || "Not specified"}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="emergencyPhone" className="block text-sm font-medium text-gray-700 mb-1">
                      Emergency Contact Phone
                    </label>
                    {isEditing ? (
                      <input
                        id="emergencyPhone"
                        name="emergencyPhone"
                        type="text"
                        value={formData.emergencyPhone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                        required
                      />
                    ) : (
                      <p className="text-medical-dark">{formData.emergencyPhone || "Not specified"}</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Allergies */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-medical-dark mb-4">Allergies & Medical Alerts</h2>
                {isEditing ? (
                  <div>
                    <label htmlFor="allergies" className="block text-sm font-medium text-gray-700 mb-1">
                      Allergies (comma separated)
                    </label>
                    <textarea
                      id="allergies"
                      name="allergies"
                      value={formData.allergies}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                      placeholder="e.g., Peanuts, Penicillin, Latex"
                    ></textarea>
                    <p className="text-sm text-gray-500 mt-1">
                      List any allergies or medical conditions that emergency personnel should be aware of.
                    </p>
                  </div>
                ) : (
                  <div>
                    {formData.allergies ? (
                      <ul className="list-disc list-inside space-y-1">
                        {formData.allergies.split(",").map((allergy, index) => (
                          <li key={index} className="text-medical-dark">{allergy.trim()}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">No allergies specified</p>
                    )}
                  </div>
                )}
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
      </div>
    </DashboardLayout>
  );
};

export default PatientProfile;
