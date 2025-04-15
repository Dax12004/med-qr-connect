
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import QRCodeCard from "@/components/ui/QRCodeCard";
import { QRCodeSVG } from "qrcode.react";

const PatientEmergency = () => {
  const { user } = useAuth();
  
  // Create emergency QR data
  const emergencyQrData = user ? JSON.stringify({
    id: user.id,
    name: user.name,
    type: "emergency",
    bloodGroup: user.patientData?.bloodGroup,
    emergencyContact: user.patientData?.emergencyContact,
    emergencyPhone: user.patientData?.emergencyPhone,
    allergies: user.patientData?.allergies,
  }) : "";

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-medical-dark">Emergency Information</h1>
          <p className="text-gray-500 mt-1">
            View and manage your emergency medical data
          </p>
        </div>

        {/* Emergency Data Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - QR Code */}
          <div>
            <QRCodeCard
              data={emergencyQrData}
              title="Emergency QR Code"
              description="This QR code contains your critical medical information for emergency situations. Keep it accessible to first responders."
            />
          </div>

          {/* Right Column - Emergency Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-medical-dark mb-6">Emergency Information</h2>

                <div className="space-y-6">
                  {/* Personal Details */}
                  <div>
                    <h3 className="text-lg font-medium text-medical-dark mb-3">Personal Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="font-medium text-medical-dark">{user?.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Blood Group</p>
                        <p className="font-medium text-medical-dark">{user?.patientData?.bloodGroup || "Not specified"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Height</p>
                        <p className="font-medium text-medical-dark">{user?.patientData?.height || "Not specified"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Weight</p>
                        <p className="font-medium text-medical-dark">{user?.patientData?.weight || "Not specified"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div>
                    <h3 className="text-lg font-medium text-medical-dark mb-3">Emergency Contact</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Contact Name</p>
                        <p className="font-medium text-medical-dark">{user?.patientData?.emergencyContact || "Not specified"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Contact Phone</p>
                        <p className="font-medium text-medical-dark">{user?.patientData?.emergencyPhone || "Not specified"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Allergies */}
                  <div>
                    <h3 className="text-lg font-medium text-medical-dark mb-3">Allergies & Medical Alerts</h3>
                    {user?.patientData?.allergies && user.patientData.allergies.length > 0 ? (
                      <ul className="list-disc list-inside space-y-1">
                        {user.patientData.allergies.map((allergy, index) => (
                          <li key={index} className="text-medical-dark">{allergy}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">No allergies specified</p>
                    )}
                  </div>

                  {/* Important Notes */}
                  <div>
                    <h3 className="text-lg font-medium text-medical-dark mb-3">
                      Instructions for First Responders
                    </h3>
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                      <p className="text-yellow-700">
                        In case of emergency, please scan the QR code to access critical medical information.
                        This QR code contains all the information displayed on this page.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Edit Button */}
                <div className="mt-8">
                  <a
                    href="/patient/profile"
                    className="inline-flex items-center px-4 py-2 bg-medical-primary text-white rounded-md hover:bg-medical-secondary transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Edit Emergency Information
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Print Version */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-medical-dark mb-4">Emergency Card</h2>
          <p className="text-gray-600 mb-4">
            Print this emergency card and keep it in your wallet or bag for quick access during emergencies.
          </p>
          
          <div className="border border-gray-300 rounded-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row items-center">
              <div className="mb-4 md:mb-0 md:mr-6">
                <QRCodeSVG
                  value={emergencyQrData}
                  size={150}
                  level="M"
                  className="border border-gray-200 p-2 rounded"
                />
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-bold text-medical-primary mb-2">{user?.name}</h3>
                <p className="text-sm mb-1">
                  <span className="font-semibold">Blood Type:</span> {user?.patientData?.bloodGroup || "Not specified"}
                </p>
                <p className="text-sm mb-1">
                  <span className="font-semibold">Emergency Contact:</span> {user?.patientData?.emergencyContact || "Not specified"}
                </p>
                <p className="text-sm mb-3">
                  <span className="font-semibold">Phone:</span> {user?.patientData?.emergencyPhone || "Not specified"}
                </p>
                
                {user?.patientData?.allergies && user.patientData.allergies.length > 0 && (
                  <div className="bg-red-50 border-l-4 border-red-400 p-2 text-sm">
                    <span className="font-semibold">Allergies:</span> {user.patientData.allergies.join(", ")}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex justify-center">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>
              Print Emergency Card
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientEmergency;
