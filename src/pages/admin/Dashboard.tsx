
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useMedicalRecord } from "@/contexts/MedicalRecordContext";
import DashboardLayout from "@/components/layout/DashboardLayout";

const AdminDashboard = () => {
  const { user } = useAuth();
  const { records, appointments, qrLogs } = useMedicalRecord();

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div>
          <h1 className="text-2xl font-bold text-medical-dark">
            Welcome, {user?.name}
          </h1>
          <p className="text-gray-500 mt-1">
            System administration and monitoring
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Total Users</h3>
                <p className="text-3xl font-bold text-medical-dark">15</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
            </div>
            <div className="mt-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Patients: 10</span>
                <span className="text-gray-500">Doctors: 5</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Medical Records</h3>
                <p className="text-3xl font-bold text-medical-dark">{records.length}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                  <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" />
                  <line x1="9" y1="9" x2="10" y2="9" />
                  <line x1="9" y1="13" x2="15" y2="13" />
                  <line x1="9" y1="17" x2="15" y2="17" />
                </svg>
              </div>
            </div>
            <div className="mt-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">This month: 5</span>
                <span className="text-gray-500">Total: {records.length}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Appointments</h3>
                <p className="text-3xl font-bold text-medical-dark">{appointments.length}</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                  <line x1="16" x2="16" y1="2" y2="6" />
                  <line x1="8" x2="8" y1="2" y2="6" />
                  <line x1="3" x2="21" y1="10" y2="10" />
                  <path d="M8 14h.01" />
                  <path d="M12 14h.01" />
                  <path d="M16 14h.01" />
                  <path d="M8 18h.01" />
                  <path d="M12 18h.01" />
                  <path d="M16 18h.01" />
                </svg>
              </div>
            </div>
            <div className="mt-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Active: {appointments.filter(a => a.status === "scheduled").length}</span>
                <span className="text-gray-500">Completed: {appointments.filter(a => a.status === "completed").length}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">QR Scans</h3>
                <p className="text-3xl font-bold text-medical-dark">{qrLogs.length}</p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
            </div>
            <div className="mt-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Today: 3</span>
                <span className="text-gray-500">Total: {qrLogs.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold text-medical-dark">Pending Doctor Approvals</h3>
          </div>
          
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Specialization
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      License
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-medical-light flex items-center justify-center">
                          <span className="text-medical-primary font-medium">JD</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">Dr. Jane Doe</div>
                          <div className="text-sm text-gray-500">jane.doe@example.com</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">Dermatology</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">MED789123</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-green-600 hover:text-green-900 mr-4">Approve</button>
                      <button className="text-red-600 hover:text-red-900">Reject</button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-medical-light flex items-center justify-center">
                          <span className="text-medical-primary font-medium">RJ</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">Dr. Robert Johnson</div>
                          <div className="text-sm text-gray-500">robert.j@example.com</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">Orthopedics</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">MED456789</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-green-600 hover:text-green-900 mr-4">Approve</button>
                      <button className="text-red-600 hover:text-red-900">Reject</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-medical-dark mb-4">User Management</h3>
            <p className="text-gray-600 mb-4">
              Manage user accounts, approve doctor registrations, and monitor user activity.
            </p>
            <Link
              to="/admin/users"
              className="inline-flex items-center text-medical-primary hover:text-medical-secondary"
            >
              Go to User Management
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-medical-dark mb-4">QR Management</h3>
            <p className="text-gray-600 mb-4">
              Monitor QR code usage, track scanning activity, and manage expiration settings.
            </p>
            <Link
              to="/admin/qr-management"
              className="inline-flex items-center text-medical-primary hover:text-medical-secondary"
            >
              Go to QR Management
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
