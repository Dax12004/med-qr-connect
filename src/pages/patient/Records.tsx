
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useMedicalRecord, MedicalRecord } from "@/contexts/MedicalRecordContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import RecordCard from "@/components/ui/RecordCard";
import QRCodeCard from "@/components/ui/QRCodeCard";

const PatientRecords = () => {
  const { user } = useAuth();
  const { records, addRecord, getPatientRecords } = useMedicalRecord();
  
  // Get patient-specific records
  const patientRecords = user ? getPatientRecords(user.id) : [];
  
  // States for new record form
  const [isAddingRecord, setIsAddingRecord] = useState(false);
  const [newRecord, setNewRecord] = useState({
    title: "",
    type: "diagnosis" as MedicalRecord["type"],
    date: new Date().toISOString().split("T")[0],
    description: "",
    attachmentUrl: "",
  });
  
  // State for selected record (for QR code)
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  
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
        patientId: user.id,
        title: newRecord.title,
        type: newRecord.type,
        date: newRecord.date,
        description: newRecord.description,
        attachmentUrl: newRecord.attachmentUrl,
      });
      
      // Reset form
      setNewRecord({
        title: "",
        type: "diagnosis",
        date: new Date().toISOString().split("T")[0],
        description: "",
        attachmentUrl: "",
      });
      
      setIsAddingRecord(false);
    } catch (error) {
      console.error("Failed to add record:", error);
    }
  };
  
  // Generate QR code data for a record
  const generateRecordQrData = (record: MedicalRecord) => {
    return JSON.stringify({
      id: record.id,
      patientId: record.patientId,
      title: record.title,
      type: record.type,
      date: record.date,
      description: record.description,
    });
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-medical-dark">Medical Records</h1>
            <p className="text-gray-500 mt-1">
              View and manage your medical records
            </p>
          </div>
          <div className="mt-4 md:mt-0">
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

        {/* Add Record Form */}
        {isAddingRecord && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
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
                
                <div>
                  <label htmlFor="attachmentUrl" className="block text-sm font-medium text-gray-700 mb-1">
                    Attachment URL (optional)
                  </label>
                  <input
                    id="attachmentUrl"
                    name="attachmentUrl"
                    type="text"
                    value={newRecord.attachmentUrl}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                    placeholder="e.g., https://example.com/file.pdf"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={newRecord.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                  placeholder="Enter details about the medical record"
                  required
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

        {/* Records & QR Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Records List */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {patientRecords.length > 0 ? (
                patientRecords.map((record) => (
                  <RecordCard
                    key={record.id}
                    record={record}
                    actions={
                      <button
                        onClick={() => setSelectedRecord(record)}
                        className="p-2 text-gray-500 hover:text-medical-primary rounded-full hover:bg-gray-100"
                        title="Generate QR Code"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="5" height="5" x="3" y="3" rx="1" />
                          <rect width="5" height="5" x="16" y="3" rx="1" />
                          <rect width="5" height="5" x="3" y="16" rx="1" />
                          <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
                          <path d="M21 21v.01" />
                          <path d="M12 7v3a2 2 0 0 1-2 2H7" />
                          <path d="M3 12h.01" />
                          <path d="M12 3h.01" />
                          <path d="M12 16v.01" />
                          <path d="M16 12h1" />
                          <path d="M21 12v.01" />
                          <path d="M12 21v-1" />
                        </svg>
                      </button>
                    }
                  />
                ))
              ) : (
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                  <p className="text-gray-500">No medical records found.</p>
                  <button
                    onClick={() => setIsAddingRecord(true)}
                    className="mt-4 inline-block px-4 py-2 bg-medical-primary text-white rounded-md hover:bg-medical-secondary transition-colors"
                  >
                    Add Your First Record
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* QR Code Display */}
          <div className="lg:col-span-1">
            {selectedRecord ? (
              <div className="sticky top-8">
                <QRCodeCard
                  data={generateRecordQrData(selectedRecord)}
                  title={selectedRecord.title}
                  description="This QR code contains information about this specific medical record. Share it with healthcare providers for quick access."
                />
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setSelectedRecord(null)}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-medical-dark mb-4">Record QR Code</h3>
                <p className="text-gray-500 text-center">
                  Select a record to generate its QR code.
                </p>
                <div className="mt-6 border border-dashed border-gray-300 rounded-lg p-8 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="5" height="5" x="3" y="3" rx="1" />
                    <rect width="5" height="5" x="16" y="3" rx="1" />
                    <rect width="5" height="5" x="3" y="16" rx="1" />
                    <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
                    <path d="M21 21v.01" />
                    <path d="M12 7v3a2 2 0 0 1-2 2H7" />
                    <path d="M3 12h.01" />
                    <path d="M12 3h.01" />
                    <path d="M12 16v.01" />
                    <path d="M16 12h1" />
                    <path d="M21 12v.01" />
                    <path d="M12 21v-1" />
                  </svg>
                </div>
                <p className="text-xs text-gray-500 text-center mt-4">
                  QR codes allow for quick and secure sharing of your medical information with healthcare providers.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientRecords;
