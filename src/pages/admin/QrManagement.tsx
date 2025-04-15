
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useMedicalRecord, QrScanLog } from "@/contexts/MedicalRecordContext";

// Mock QR scan logs for the UI
const MOCK_QR_LOGS: QrScanLog[] = [
  {
    id: "log1",
    recordId: "rec1",
    scannedBy: "d1",
    scannedAt: "2023-04-15T10:30:00",
    ipAddress: "192.168.1.1",
  },
  {
    id: "log2",
    recordId: "rec1",
    scannedBy: "d2",
    scannedAt: "2023-04-16T14:45:00",
    ipAddress: "192.168.1.2",
  },
  {
    id: "log3",
    recordId: "rec2",
    scannedBy: "d1",
    scannedAt: "2023-04-17T09:15:00",
    ipAddress: "192.168.1.1",
  },
  {
    id: "log4",
    recordId: "rec3",
    scannedBy: "d3",
    scannedAt: "2023-04-18T16:20:00",
    ipAddress: "192.168.1.3",
  },
  {
    id: "log5",
    recordId: "rec1",
    scannedBy: "d2",
    scannedAt: "2023-04-19T11:10:00",
    ipAddress: "192.168.1.2",
  },
];

// Mock settings for QR code management
const mockSettings = {
  expiryTime: 24, // hours
  enableRecordTracking: true,
  enableLocationTracking: false,
  maxScansPerDay: 10,
};

const AdminQrManagement = () => {
  // State for QR settings
  const [settings, setSettings] = useState(mockSettings);
  const [isEditingSettings, setIsEditingSettings] = useState(false);
  const [editedSettings, setEditedSettings] = useState(mockSettings);
  
  // State for filtering logs
  const [recordFilter, setRecordFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [qrLogs, setQrLogs] = useState(MOCK_QR_LOGS);
  
  // Handle settings update
  const handleUpdateSettings = () => {
    setSettings(editedSettings);
    setIsEditingSettings(false);
  };
  
  // Filter logs based on filters
  const filteredLogs = qrLogs.filter((log) => {
    // Filter by record ID
    if (recordFilter && !log.recordId.includes(recordFilter)) {
      return false;
    }
    
    // Filter by date
    if (dateFilter) {
      const logDate = new Date(log.scannedAt).toISOString().split("T")[0];
      if (logDate !== dateFilter) {
        return false;
      }
    }
    
    return true;
  });
  
  // Format date from ISO string to readable format
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-medical-dark">QR Code Management</h1>
          <p className="text-gray-500 mt-1">
            Monitor QR code usage and configure QR code settings
          </p>
        </div>

        {/* QR Settings Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <h3 className="text-lg font-semibold text-medical-dark">QR Code Settings</h3>
            {!isEditingSettings ? (
              <button
                onClick={() => setIsEditingSettings(true)}
                className="px-4 py-2 bg-medical-primary text-white rounded-md hover:bg-medical-secondary"
              >
                Edit Settings
              </button>
            ) : (
              <div className="space-x-2">
                <button
                  onClick={() => setIsEditingSettings(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateSettings}
                  className="px-4 py-2 bg-medical-primary text-white rounded-md hover:bg-medical-secondary"
                >
                  Save
                </button>
              </div>
            )}
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  QR Code Expiry Time (hours)
                </label>
                {isEditingSettings ? (
                  <input
                    type="number"
                    min="1"
                    max="168"
                    value={editedSettings.expiryTime}
                    onChange={(e) => setEditedSettings({ ...editedSettings, expiryTime: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                  />
                ) : (
                  <p className="text-medical-dark">{settings.expiryTime} hours</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Time after which a QR code will expire and require regeneration
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Scans Per Day
                </label>
                {isEditingSettings ? (
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={editedSettings.maxScansPerDay}
                    onChange={(e) => setEditedSettings({ ...editedSettings, maxScansPerDay: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                  />
                ) : (
                  <p className="text-medical-dark">{settings.maxScansPerDay}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Maximum number of times a QR code can be scanned in a day
                </p>
              </div>
              
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700">
                  {isEditingSettings ? (
                    <input
                      type="checkbox"
                      checked={editedSettings.enableRecordTracking}
                      onChange={(e) => setEditedSettings({ ...editedSettings, enableRecordTracking: e.target.checked })}
                      className="mr-2 h-4 w-4 text-medical-primary focus:ring-medical-primary border-gray-300 rounded"
                    />
                  ) : (
                    <span className={`h-5 w-5 mr-2 inline-block rounded-full ${settings.enableRecordTracking ? "bg-green-500" : "bg-red-500"}`}></span>
                  )}
                  Enable Record Tracking
                </label>
                <p className="text-xs text-gray-500 mt-1 ml-7">
                  Track which records are accessed via QR code
                </p>
              </div>
              
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700">
                  {isEditingSettings ? (
                    <input
                      type="checkbox"
                      checked={editedSettings.enableLocationTracking}
                      onChange={(e) => setEditedSettings({ ...editedSettings, enableLocationTracking: e.target.checked })}
                      className="mr-2 h-4 w-4 text-medical-primary focus:ring-medical-primary border-gray-300 rounded"
                    />
                  ) : (
                    <span className={`h-5 w-5 mr-2 inline-block rounded-full ${settings.enableLocationTracking ? "bg-green-500" : "bg-red-500"}`}></span>
                  )}
                  Enable Location Tracking
                </label>
                <p className="text-xs text-gray-500 mt-1 ml-7">
                  Track location data when QR codes are scanned
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* QR Scan Logs */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold text-medical-dark">QR Scan Logs</h3>
          </div>
          
          <div className="p-4 border-b bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="recordFilter" className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by Record ID
                </label>
                <input
                  id="recordFilter"
                  type="text"
                  value={recordFilter}
                  onChange={(e) => setRecordFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                  placeholder="Enter record ID"
                />
              </div>
              
              <div>
                <label htmlFor="dateFilter" className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by Date
                </label>
                <input
                  id="dateFilter"
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                />
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setRecordFilter("");
                    setDateFilter("");
                  }}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Record ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Scanned By
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IP Address
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {log.recordId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.scannedBy === "d1" ? "Dr. Smith" : 
                       log.scannedBy === "d2" ? "Dr. Johnson" : 
                       log.scannedBy === "d3" ? "Dr. Williams" : log.scannedBy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(log.scannedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.ipAddress}
                    </td>
                  </tr>
                ))}
                
                {filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                      No scan logs found matching the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminQrManagement;
