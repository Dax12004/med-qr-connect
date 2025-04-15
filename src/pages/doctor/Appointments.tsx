
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useMedicalRecord } from "@/contexts/MedicalRecordContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AppointmentCard from "@/components/ui/AppointmentCard";

const DoctorAppointments = () => {
  const { user } = useAuth();
  const { appointments, updateAppointment, getDoctorAppointments } = useMedicalRecord();
  
  // Get doctor-specific appointments
  const doctorAppointments = user ? getDoctorAppointments(user.id) : [];
  
  // States for filtering appointments
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<"all" | "scheduled" | "completed" | "cancelled">("all");
  
  // Handle appointment completion
  const handleCompleteAppointment = async (id: string) => {
    try {
      await updateAppointment(id, { status: "completed" });
    } catch (error) {
      console.error("Failed to complete appointment:", error);
    }
  };
  
  // Filter appointments based on filters
  const filteredAppointments = doctorAppointments.filter((appointment) => {
    // Filter by status
    if (filterStatus !== "all" && appointment.status !== filterStatus) {
      return false;
    }
    
    // Filter by date
    if (selectedDate && appointment.date !== selectedDate) {
      return false;
    }
    
    return true;
  });
  
  // Sort appointments by date (most recent first) then by time
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    // First sort by date
    const dateComparison = new Date(b.date).getTime() - new Date(a.date).getTime();
    if (dateComparison !== 0) return dateComparison;
    
    // If date is the same, sort by time
    return a.time.localeCompare(b.time);
  });
  
  // Get unique dates for the date filter
  const uniqueDates = Array.from(new Set(doctorAppointments.map((app) => app.date)))
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-medical-dark">Appointments</h1>
          <p className="text-gray-500 mt-1">
            Manage your patient appointments
          </p>
        </div>

        {/* Filter Controls */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div>
              <label htmlFor="dateFilter" className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Date
              </label>
              <select
                id="dateFilter"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full sm:w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
              >
                <option value="">All Dates</option>
                {uniqueDates.map((date) => (
                  <option key={date} value={date}>
                    {new Date(date).toLocaleDateString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Status
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterStatus("all")}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    filterStatus === "all"
                      ? "bg-medical-primary text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterStatus("scheduled")}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    filterStatus === "scheduled"
                      ? "bg-medical-primary text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Upcoming
                </button>
                <button
                  onClick={() => setFilterStatus("completed")}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    filterStatus === "completed"
                      ? "bg-medical-primary text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Completed
                </button>
                <button
                  onClick={() => setFilterStatus("cancelled")}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    filterStatus === "cancelled"
                      ? "bg-medical-primary text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Cancelled
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {sortedAppointments.length > 0 ? (
            sortedAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                isDoctor={true}
                actions={
                  appointment.status === "scheduled" ? (
                    <div className="flex space-x-2">
                      <Link
                        to={`/doctor/patients/${appointment.patientId}`}
                        className="px-3 py-1 text-xs rounded-md bg-medical-light text-medical-primary hover:bg-medical-primary hover:text-white transition-colors"
                      >
                        View Patient
                      </Link>
                      <button
                        onClick={() => handleCompleteAppointment(appointment.id)}
                        className="px-3 py-1 text-xs rounded-md bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                      >
                        Complete
                      </button>
                    </div>
                  ) : (
                    <Link
                      to={`/doctor/patients/${appointment.patientId}`}
                      className="px-3 py-1 text-xs rounded-md bg-medical-light text-medical-primary hover:bg-medical-primary hover:text-white transition-colors"
                    >
                      View Patient
                    </Link>
                  )
                }
              />
            ))
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <p className="text-gray-500">No appointments found.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorAppointments;
