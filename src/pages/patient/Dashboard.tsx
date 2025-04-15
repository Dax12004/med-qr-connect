import React, { useState } from "react";
import { Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { useAuth } from "@/contexts/AuthContext";
import { useMedicalRecord } from "@/contexts/MedicalRecordContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import RecordCard from "@/components/ui/RecordCard";
import AppointmentCard from "@/components/ui/AppointmentCard";
import QRCodeCard from "@/components/ui/QRCodeCard";

const PatientDashboard = () => {
  const { user } = useAuth();
  const { records, appointments, getPatientRecords, getPatientAppointments } = useMedicalRecord();
  
  const patientRecords = user ? getPatientRecords(user.id) : [];
  const patientAppointments = user ? getPatientAppointments(user.id) : [];
  
  const upcomingAppointments = patientAppointments.filter(
    (appointment) => appointment.status === "scheduled"
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const patientQrData = user ? JSON.stringify({
    id: user.id,
    name: user.name,
    type: "patient",
    emergencyContact: user.patientData?.emergencyContact,
    emergencyPhone: user.patientData?.emergencyPhone,
    bloodGroup: user.patientData?.bloodGroup,
  }) : "";

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-medical-dark">
              Welcome, {user?.name}
            </h1>
            <p className="text-gray-500 mt-1">
              Manage your medical records and appointments
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link
              to="/patient/records"
              className="inline-flex items-center px-4 py-2 bg-medical-primary text-white rounded-md hover:bg-medical-secondary transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" />
                <line x1="12" x2="12" y1="11" y2="17" />
                <line x1="9" x2="15" y1="14" y2="14" />
              </svg>
              Add New Record
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <QRCodeCard
              data={patientQrData}
              title="Your Personal QR Code"
              description="Share this QR code with healthcare providers to give them access to your medical information."
              className="mb-8"
            />
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-medical-dark mb-4">Personal Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Blood Group</p>
                  <p className="font-medium text-medical-dark">
                    {user?.patientData?.bloodGroup || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Height</p>
                  <p className="font-medium text-medical-dark">
                    {user?.patientData?.height || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Weight</p>
                  <p className="font-medium text-medical-dark">
                    {user?.patientData?.weight || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Emergency Contact</p>
                  <p className="font-medium text-medical-dark">
                    {user?.patientData?.emergencyContact || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Emergency Phone</p>
                  <p className="font-medium text-medical-dark">
                    {user?.patientData?.emergencyPhone || "Not specified"}
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <Link
                  to="/patient/profile"
                  className="text-sm text-medical-primary hover:text-medical-secondary"
                >
                  Edit Personal Information
                </Link>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-medical-dark">Recent Medical Records</h3>
                <Link
                  to="/patient/records"
                  className="text-sm text-medical-primary hover:text-medical-secondary"
                >
                  View All Records
                </Link>
              </div>
              
              <div className="space-y-4">
                {patientRecords.length > 0 ? (
                  patientRecords.slice(0, 3).map((record) => (
                    <RecordCard
                      key={record.id}
                      record={record}
                      actions={
                        <Link
                          to={`/patient/records/${record.id}`}
                          className="p-2 text-gray-500 hover:text-medical-primary rounded-full hover:bg-gray-100"
                          title="View record details"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </Link>
                      }
                    />
                  ))
                ) : (
                  <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <p className="text-gray-500">No medical records found.</p>
                    <Link
                      to="/patient/records"
                      className="mt-4 inline-block px-4 py-2 bg-medical-primary text-white rounded-md hover:bg-medical-secondary transition-colors"
                    >
                      Add Your First Record
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-medical-dark">Upcoming Appointments</h3>
                <Link
                  to="/patient/appointments"
                  className="text-sm text-medical-primary hover:text-medical-secondary"
                >
                  View All Appointments
                </Link>
              </div>
              
              <div className="space-y-4">
                {upcomingAppointments.length > 0 ? (
                  upcomingAppointments.slice(0, 3).map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      actions={
                        <button className="px-3 py-1 text-xs rounded-md bg-medical-light text-medical-primary hover:bg-medical-primary hover:text-white transition-colors">
                          Cancel
                        </button>
                      }
                    />
                  ))
                ) : (
                  <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <p className="text-gray-500">No upcoming appointments.</p>
                    <Link
                      to="/patient/appointments"
                      className="mt-4 inline-block px-4 py-2 bg-medical-primary text-white rounded-md hover:bg-medical-secondary transition-colors"
                    >
                      Book an Appointment
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientDashboard;
