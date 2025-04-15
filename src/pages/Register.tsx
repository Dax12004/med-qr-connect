
import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import MainLayout from "@/components/layout/MainLayout";

const Register = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get("role") as UserRole || "patient";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: initialRole,
    // Patient-specific fields
    height: "",
    weight: "",
    bloodGroup: "",
    emergencyContact: "",
    emergencyPhone: "",
    // Doctor-specific fields
    specialization: "",
    degree: "",
    licenseNumber: "",
    experience: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    // Role-specific validation
    if (formData.role === "patient") {
      if (!formData.emergencyContact || !formData.emergencyPhone) {
        setError("Emergency contact information is required for patients");
        return;
      }
    }

    if (formData.role === "doctor") {
      if (!formData.specialization || !formData.licenseNumber) {
        setError("Specialization and license number are required for doctors");
        return;
      }
    }

    setIsLoading(true);

    try {
      // Prepare the data based on the role
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      };

      // Add role-specific data
      if (formData.role === "patient") {
        Object.assign(userData, {
          patientData: {
            height: formData.height,
            weight: formData.weight,
            bloodGroup: formData.bloodGroup,
            emergencyContact: formData.emergencyContact,
            emergencyPhone: formData.emergencyPhone,
            allergies: [],
          },
        });
      } else if (formData.role === "doctor") {
        Object.assign(userData, {
          doctorData: {
            specialization: formData.specialization,
            degree: formData.degree,
            licenseNumber: formData.licenseNumber,
            experience: formData.experience ? parseInt(formData.experience, 10) : 0,
          },
        });
      }

      await register(userData);

      // Redirect based on role
      if (formData.role === "patient") {
        navigate("/patient/dashboard");
      } else if (formData.role === "doctor") {
        navigate("/doctor/dashboard");
      } else if (formData.role === "admin") {
        navigate("/admin/dashboard");
      }
    } catch (err) {
      setError("Registration failed. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden mb-10">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-center text-medical-dark mb-6">Register</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic information - common for all roles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                  placeholder="Create a password"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                  placeholder="Confirm your password"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                  required
                >
                  <option value="patient">Patient</option>
                  <option value="doctor">Doctor</option>
                </select>
              </div>
            </div>
            
            {/* Patient-specific fields */}
            {formData.role === "patient" && (
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-lg font-medium text-medical-dark mb-4">Patient Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
                      Height (cm)
                    </label>
                    <input
                      id="height"
                      name="height"
                      type="text"
                      value={formData.height}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                      placeholder="e.g., 175"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                      Weight (kg)
                    </label>
                    <input
                      id="weight"
                      name="weight"
                      type="text"
                      value={formData.weight}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                      placeholder="e.g., 70"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700 mb-1">
                      Blood Group
                    </label>
                    <input
                      id="bloodGroup"
                      name="bloodGroup"
                      type="text"
                      value={formData.bloodGroup}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                      placeholder="e.g., A+"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700 mb-1">
                      Emergency Contact Name*
                    </label>
                    <input
                      id="emergencyContact"
                      name="emergencyContact"
                      type="text"
                      value={formData.emergencyContact}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                      placeholder="Full name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="emergencyPhone" className="block text-sm font-medium text-gray-700 mb-1">
                      Emergency Contact Phone*
                    </label>
                    <input
                      id="emergencyPhone"
                      name="emergencyPhone"
                      type="text"
                      value={formData.emergencyPhone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                      placeholder="Phone number"
                      required
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* Doctor-specific fields */}
            {formData.role === "doctor" && (
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-lg font-medium text-medical-dark mb-4">Doctor Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">
                      Specialization*
                    </label>
                    <input
                      id="specialization"
                      name="specialization"
                      type="text"
                      value={formData.specialization}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                      placeholder="e.g., Cardiology"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="degree" className="block text-sm font-medium text-gray-700 mb-1">
                      Degree
                    </label>
                    <input
                      id="degree"
                      name="degree"
                      type="text"
                      value={formData.degree}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                      placeholder="e.g., MD"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      License Number*
                    </label>
                    <input
                      id="licenseNumber"
                      name="licenseNumber"
                      type="text"
                      value={formData.licenseNumber}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                      placeholder="Your medical license number"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                      Years of Experience
                    </label>
                    <input
                      id="experience"
                      name="experience"
                      type="number"
                      min="0"
                      max="70"
                      value={formData.experience}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                      placeholder="e.g., 10"
                    />
                  </div>
                </div>
              </div>
            )}
            
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-medical-primary text-white py-2 px-4 rounded-md hover:bg-medical-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-medical-primary focus:ring-offset-2 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Register"}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-medical-primary hover:text-medical-secondary">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Register;
