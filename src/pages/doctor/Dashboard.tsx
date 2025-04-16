
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useMedicalRecord } from "@/contexts/MedicalRecordContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AppointmentCard from "@/components/ui/AppointmentCard";

import { QrReader } from 'react-qr-reader';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const { appointments, getDoctorAppointments, getDoctorPatients } = useMedicalRecord();
  const [scanResult, setScanResult] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  
  const handleScan = (result) => {
    if (result) {
      try {
        const data = JSON.parse(result?.text);
        setScanResult(data);
        setShowScanner(false);
      } catch (error) {
        console.error('Invalid QR code data:', error);
      }
    }
  };
  
  // Get doctor-specific data
  const doctorAppointments = user ? getDoctorAppointments(user.id) : [];
  const doctorPatients = user ? getDoctorPatients(user.id) : [];
  
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];
  
  // Filter for today's appointments
  const todayAppointments = doctorAppointments.filter(
    (appointment) => appointment.date === today && appointment.status === "scheduled"
  ).sort((a, b) => a.time.localeCompare(b.time));

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div>
          <h1 className="text-2xl font-bold text-medical-dark">
            Welcome, Dr. {user?.name}
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your patients and appointments
          </p>
        </div>

        {/* QR Scanner */}
        <div className="mb-8">
          <button
            onClick={() => setShowScanner(!showScanner)}
            className="px-4 py-2 bg-medical-primary text-white rounded-md hover:bg-medical-secondary"
          >
            {showScanner ? 'Close Scanner' : 'Scan QR Code'}
          </button>
          
          {showScanner && (
            <div className="mt-4 max-w-md">
              <QrReader
                onResult={handleScan}
                constraints={{ facingMode: 'environment' }}
                className="w-full"
              />
            </div>
          )}
          
          {scanResult && (
            <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">Scan Result:</h3>
              <pre className="bg-gray-50 p-2 rounded">
                {JSON.stringify(scanResult, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Patients</h3>
            <p className="text-3xl font-bold text-medical-dark">{doctorPatients.length}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Today's Appointments</h3>
            <p className="text-3xl font-bold text-medical-dark">{todayAppointments.length}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Pending Consultations</h3>
            <p className="text-3xl font-bold text-medical-dark">
              {doctorAppointments.filter(app => app.status === "scheduled").length}
            </p>
          </div>
        </div>

        {/* Today's Appointments */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-medical-dark">Today's Appointments</h2>
            <Link
              to="/doctor/appointments"
              className="text-sm text-medical-primary hover:text-medical-secondary"
            >
              View All Appointments
            </Link>
          </div>
          
          <div className="space-y-4">
            {todayAppointments.length > 0 ? (
              todayAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  isDoctor={true}
                  actions={
                    <Link
                      to={`/doctor/patients/${appointment.patientId}`}
                      className="inline-flex items-center px-3 py-1 text-xs rounded-md bg-medical-light text-medical-primary hover:bg-medical-primary hover:text-white transition-colors"
                    >
                      View Details
                    </Link>
                  }
                />
              ))
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <p className="text-gray-500">No appointments scheduled for today.</p>
                <Link
                  to="/doctor/appointments"
                  className="mt-4 inline-block px-4 py-2 bg-medical-primary text-white rounded-md hover:bg-medical-secondary transition-colors"
                >
                  View All Appointments
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Patients */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-medical-dark">Recent Patients</h2>
            <Link
              to="/doctor/patients"
              className="text-sm text-medical-primary hover:text-medical-secondary"
            >
              View All Patients
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Visit
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {doctorPatients.length > 0 ? (
                    doctorPatients.slice(0, 5).map((patient) => (
                      <tr key={patient.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-medical-light flex items-center justify-center">
                              <span className="text-medical-primary font-medium">
                                {patient.name.charAt(0)}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{patient.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">2 days ago</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link
                            to={`/doctor/patients/${patient.id}`}
                            className="text-medical-primary hover:text-medical-secondary"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                        No patients found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorDashboard;
