
import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import MainLayout from "@/components/layout/MainLayout";

// Options for blood group dropdown
const bloodGroupOptions = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

// Options for relation dropdown
const relationOptions = [
  "Parent", "Child", "Sibling", "Spouse", "Friend", "Other Family", "Guardian", "Caregiver"
];

const Register = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get("role") as UserRole || "patient";

  const [formData, setFormData] = useState({
    // Common Fields
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: initialRole,
    phoneNumber: "",
    gender: "",
    dateOfBirth: "",
    
    // Patient-specific fields
    height: "",
    weight: "",
    bloodGroup: "",
    emergencyContact: "",
    emergencyPhone: "",
    relationWithPatient: "",
    address: "",
    insurancePolicy: "",
    
    // Doctor-specific fields
    specialization: "",
    licenseNumber: "",
    experience: "",
    affiliation: "",
    education: "",
    availableDays: "",
    clinicAddress: "",
    appointmentContact: "",
  });
  
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
        phoneNumber: formData.phoneNumber,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth
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
            relationWithPatient: formData.relationWithPatient,
            address: formData.address,
            insurancePolicy: formData.insurancePolicy,
            allergies: [],
          },
        });
      } else if (formData.role === "doctor") {
        Object.assign(userData, {
          doctorData: {
            specialization: formData.specialization,
            licenseNumber: formData.licenseNumber,
            experience: formData.experience ? parseInt(formData.experience, 10) : 0,
            affiliation: formData.affiliation,
            education: formData.education,
            availableDays: formData.availableDays,
            clinicAddress: formData.clinicAddress,
            appointmentContact: formData.appointmentContact,
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
            <div>
              <h3 className="text-lg font-medium text-medical-dark mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name*
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
                    Email Address*
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
                    Password*
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
                    Confirm Password*
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
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number*
                  </label>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                    Gender*
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                    required
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth*
                  </label>
                  <input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                    Role*
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
            </div>
            
            {/* Patient-specific fields */}
            {formData.role === "patient" && (
              <div>
                <h3 className="text-lg font-medium text-medical-dark mb-4">Patient Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <select
                      id="bloodGroup"
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                    >
                      <option value="">Select blood group</option>
                      {bloodGroupOptions.map(group => (
                        <option key={group} value={group}>{group}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="md:col-span-3">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                      placeholder="Enter your full address"
                    />
                  </div>
                  
                  <div className="md:col-span-3">
                    <label htmlFor="insurancePolicy" className="block text-sm font-medium text-gray-700 mb-1">
                      Insurance Policy Number / Provider
                    </label>
                    <input
                      id="insurancePolicy"
                      name="insurancePolicy"
                      type="text"
                      value={formData.insurancePolicy}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                      placeholder="e.g., ABC123456 / XYZ Insurance"
                    />
                  </div>
                </div>
                
                <h3 className="text-lg font-medium text-medical-dark my-4">Emergency Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  
                  <div>
                    <label htmlFor="relationWithPatient" className="block text-sm font-medium text-gray-700 mb-1">
                      Relation with Patient
                    </label>
                    <select
                      id="relationWithPatient"
                      name="relationWithPatient"
                      value={formData.relationWithPatient}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                    >
                      <option value="">Select relation</option>
                      {relationOptions.map(relation => (
                        <option key={relation} value={relation}>{relation}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
            
            {/* Doctor-specific fields */}
            {formData.role === "doctor" && (
              <div>
                <h3 className="text-lg font-medium text-medical-dark mb-4">Professional Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Medical License Number*
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
                    <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-1">
                      Education
                    </label>
                    <input
                      id="education"
                      name="education"
                      type="text"
                      value={formData.education}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                      placeholder="e.g., MBBS, MD"
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
                  
                  <div>
                    <label htmlFor="affiliation" className="block text-sm font-medium text-gray-700 mb-1">
                      Affiliated Hospital/Clinic
                    </label>
                    <input
                      id="affiliation"
                      name="affiliation"
                      type="text"
                      value={formData.affiliation}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                      placeholder="e.g., City General Hospital"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="availableDays" className="block text-sm font-medium text-gray-700 mb-1">
                      Available Days/Time
                    </label>
                    <input
                      id="availableDays"
                      name="availableDays"
                      type="text"
                      value={formData.availableDays}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                      placeholder="e.g., Mon-Fri, 9AM-5PM"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="clinicAddress" className="block text-sm font-medium text-gray-700 mb-1">
                      Clinic Address
                    </label>
                    <textarea
                      id="clinicAddress"
                      name="clinicAddress"
                      value={formData.clinicAddress}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                      placeholder="Enter your clinic address"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="appointmentContact" className="block text-sm font-medium text-gray-700 mb-1">
                      Contact for Appointments
                    </label>
                    <input
                      id="appointmentContact"
                      name="appointmentContact"
                      type="text"
                      value={formData.appointmentContact}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                      placeholder="e.g., Phone or email for appointments"
                    />
                  </div>
                </div>
              </div>
            )}
            
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-medical-primary text-white py-2 px-4 rounded-md hover:bg-medical-brown/80 transition-colors focus:outline-none focus:ring-2 focus:ring-medical-primary focus:ring-offset-2 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Register"}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-medical-primary hover:text-medical-brown/80">
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
