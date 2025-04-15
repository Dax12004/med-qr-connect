
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useMedicalRecord, MedicalRecord } from "@/contexts/MedicalRecordContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import QRCodeCard from "@/components/ui/QRCodeCard";
import { toast } from "@/components/ui/use-toast";

const PatientRecordDetail = () => {
  const { recordId } = useParams<{ recordId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { records } = useMedicalRecord();
  
  const [record, setRecord] = useState<MedicalRecord | null>(null);
  
  useEffect(() => {
    if (!recordId || !user) {
      navigate("/patient/records");
      return;
    }
    
    const foundRecord = records.find(r => r.id === recordId && r.patientId === user.id);
    
    if (!foundRecord) {
      toast({
        title: "Record not found",
        description: "The requested medical record could not be found.",
        variant: "destructive",
      });
      navigate("/patient/records");
      return;
    }
    
    setRecord(foundRecord);
  }, [recordId, user, records, navigate]);
  
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
            <h1 className="text-2xl font-bold text-medical-dark">Medical Record Details</h1>
            <p className="text-gray-500 mt-1">
              View details for this medical record
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-4">
            <button
              onClick={() => navigate("/patient/records")}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back to Records
            </button>
          </div>
        </div>

        {record ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Record Details */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-medical-dark">{record.title}</h2>
                    <div className="flex flex-wrap items-center mt-2 space-x-3">
                      <span className="text-gray-500">
                        {new Date(record.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                        record.type === 'diagnosis' ? 'bg-blue-100 text-blue-800' : 
                        record.type === 'prescription' ? 'bg-green-100 text-green-800' : 
                        record.type === 'test' ? 'bg-purple-100 text-purple-800' : 
                        record.type === 'treatment' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {record.type}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {record.doctor && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Doctor</h3>
                      <p className="text-medical-dark mt-1">Dr. {record.doctor.name}</p>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Description</h3>
                    <p className="text-medical-dark mt-1 whitespace-pre-line">{record.description}</p>
                  </div>
                  
                  {record.prescriptions && record.prescriptions.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Prescriptions</h3>
                      <ul className="mt-1 list-disc list-inside text-medical-dark">
                        {record.prescriptions.map((prescription, index) => (
                          <li key={index}>{prescription}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {record.attachmentUrl && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Attachment</h3>
                      <div className="mt-2">
                        <a
                          href={record.attachmentUrl}
                          className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-md text-gray-700 hover:bg-gray-200"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" x2="12" y1="15" y2="3" />
                          </svg>
                          View Document
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* QR Code Section */}
            <div className="lg:col-span-1">
              <QRCodeCard
                data={generateRecordQrData(record)}
                title={`QR Code for ${record.title}`}
                description="Share this QR code with healthcare providers for quick access to this specific medical record."
              />
              
              <div className="mt-6 bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-medical-dark mb-4">Share Options</h3>
                <div className="space-y-4">
                  <button
                    className="inline-flex items-center w-full px-4 py-2 bg-medical-primary text-white rounded-md hover:bg-medical-secondary transition-colors"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast({
                        title: "Link copied",
                        description: "Record link has been copied to clipboard",
                      });
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    Copy Link
                  </button>
                  
                  <button
                    className="inline-flex items-center w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      const downloadLink = document.createElement('a');
                      downloadLink.href = `data:text/plain;charset=utf-8,${encodeURIComponent(JSON.stringify(record, null, 2))}`;
                      downloadLink.download = `medical-record-${record.id}.json`;
                      document.body.appendChild(downloadLink);
                      downloadLink.click();
                      document.body.removeChild(downloadLink);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" x2="12" y1="15" y2="3" />
                    </svg>
                    Download Record
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-gray-500">Loading record details...</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PatientRecordDetail;
