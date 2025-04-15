
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useMedicalRecord, MedicalRecord } from "@/contexts/MedicalRecordContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import RecordCard from "@/components/ui/RecordCard";
import QRCodeCard from "@/components/ui/QRCodeCard";

const DoctorPatientDetail = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const { user } = useAuth();
  const { records, addRecord, updateRecord, getPatientRecords } = useMedicalRecord();
  
  // Get patient-specific records
  const patientRecords = getPatientRecords(patientId || "");
  
  // State for adding new record
  const [isAddingRecord, setIsAddingRecord] = useState(false);
  const [newRecord, setNewRecord] = useState({
    title: "",
    type: "diagnosis" as MedicalRecord["type"],
    date: new Date().toISOString().split("T")[0],
    description: "",
    prescriptions: "",
  });
  
  // Mock patient data (in a real app, this would come from an API)
  const patient = {
    id: patientId || "",
    name: "John Doe",
    email: "patient@example.com",
    bloodGroup: "O+",
    height: "175cm",
    weight: "70kg",
    allergies: ["Peanuts", "Penicillin"],
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewRecord((prev) => ({ ...prev, [name]: value }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      await addRecord({
        patientId: patientId || "",
        title: newRecord.title,
        type: newRecord.type,
        date: newRecord.date,
        description: newRecord.description,
        doctor: {
          id: user.id,
          name: user.name,
        },
        prescriptions: newRecord.prescriptions.split("\n").filter(line => line.trim() !== ""),
      });
      
      // Reset form
      setNewRecord({
        title: "",
        type: "diagnosis",
        date: new Date().toISOString().split("T")[0],
        description: "",
        prescriptions: "",
      });
      
      setIsAddingRecord(false);
    } catch (error) {
      console.error("Failed to add record:", error);
    }
  };
  
  // Handle record update
  const handleUpdateRecord = async (id: string, updatedData: Partial<MedicalRecord>) => {
    try {
      await updateRecord(id, updatedData);
    } catch (error) {
      console.error("Failed to update record:", error);
    }
  };
  
  // Generate Patient QR code data
  const patientQrData = JSON.stringify({
    id: patient.id,
    name: patient.name,
    bloodGroup: patient.bloodGroup,
    allergies: patient.allergies,
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header with Back Button */}
        <div className="flex items-center space-x-4">
          <Link
            to="/doctor/patients"
            className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-medical-dark">
              Patient: {patient.name}
            </h1>
            <p className="text-gray-500 mt-1">
              View and manage patient records
            </p>
          </div>
        </div>

        {/* Patient Information & QR Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Patient QR Code */}
          <div>
            <QRCodeCard
              data={patientQrData}
              title="Patient QR Code"
              description="Scan this QR code to quickly access this patient's information during consultations."
            />
          </div>

          {/* Patient Details */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-medical-dark mb-6">Patient Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Personal Details</h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-500">Full Name</p>
                      <p className="font-medium text-medical-dark">{patient.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="font-medium text-medical-dark">{patient.email}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Medical Information</h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-500">Blood Group</p>
                      <p className="font-medium text-medical-dark">{patient.bloodGroup}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Height / Weight</p>
                      <p className="font-medium text-medical-dark">{patient.height} / {patient.weight}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Allergies</h3>
                {patient.allergies && patient.allergies.length > 0 ? (
                  <div className="bg-red-50 border-l-4 border-red-400 p-3">
                    <ul className="list-disc list-inside space-y-1">
                      {patient.allergies.map((allergy, index) => (
                        <li key={index} className="text-red-700">{allergy}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-gray-500">No known allergies</p>
                )}
              </div>
              
              {/* Add Record Button */}
              <div className="mt-8">
                <button
                  onClick={() => setIsAddingRecord(true)}
                  className="inline-flex items-center px-4 py-2 bg-medical-primary text-white rounded-md hover:bg-medical-secondary transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" x2="12" y1="5" y2="19" />
                    <line x1="5" x2="19" y1="12" y2="12" />
                  </svg>
                  Add New Record
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Add Record Form */}
        {isAddingRecord && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-medical-dark">Add New Medical Record</h2>
              <button
                onClick={() => setIsAddingRecord(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" x2="6" y1="6" y2="18" />
                  <line x1="6" x2="18" y1="6" y2="18" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={newRecord.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                    placeholder="e.g., Annual Physical Exam"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                    Record Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={newRecord.type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                    required
                  >
                    <option value="diagnosis">Diagnosis</option>
                    <option value="prescription">Prescription</option>
                    <option value="test">Medical Test</option>
                    <option value="treatment">Treatment</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    value={newRecord.date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description / Diagnosis
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={newRecord.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                  placeholder="Enter diagnosis details or notes about the consultation"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="prescriptions" className="block text-sm font-medium text-gray-700 mb-1">
                  Prescriptions / Instructions
                </label>
                <textarea
                  id="prescriptions"
                  name="prescriptions"
                  value={newRecord.prescriptions}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                  placeholder="Enter each prescription on a new line"
                />
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsAddingRecord(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-medical-primary text-white rounded-md hover:bg-medical-secondary"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Medical Records */}
        <div>
          <h2 className="text-lg font-semibold text-medical-dark mb-4">Medical Records</h2>
          
          <div className="space-y-6">
            {patientRecords.length > 0 ? (
              patientRecords.map((record) => (
                <RecordCard
                  key={record.id}
                  record={record}
                  isDoctor={true}
                  onUpdateRecord={handleUpdateRecord}
                />
              ))
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <p className="text-gray-500">No medical records found for this patient.</p>
                <button
                  onClick={() => setIsAddingRecord(true)}
                  className="mt-4 inline-block px-4 py-2 bg-medical-primary text-white rounded-md hover:bg-medical-secondary transition-colors"
                >
                  Add First Record
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorPatientDetail;
