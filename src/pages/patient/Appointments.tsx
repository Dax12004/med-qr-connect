
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useMedicalRecord } from "@/contexts/MedicalRecordContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AppointmentCard from "@/components/ui/AppointmentCard";

const AVAILABLE_TIMES = [
  "09:00", "09:20", "09:40", "10:00", "10:20", "10:40", 
  "11:00", "11:20", "11:40", "13:00", "13:20", "13:40", 
  "14:00", "14:20", "14:40", "15:00", "15:20", "15:40", 
  "16:00", "16:20", "16:40", "17:00"
];

const AVAILABLE_DOCTORS = [
  { id: "d1", name: "Dr. Smith", specialization: "Cardiology" },
  { id: "d2", name: "Dr. Johnson", specialization: "Pediatrics" },
  { id: "d3", name: "Dr. Williams", specialization: "Neurology" },
  { id: "d4", name: "Dr. Brown", specialization: "Dermatology" },
  { id: "d5", name: "Dr. Davis", specialization: "Orthopedics" },
];

const PatientAppointments = () => {
  const { user } = useAuth();
  const { appointments, addAppointment, updateAppointment, getPatientAppointments } = useMedicalRecord();
  
  // Get patient-specific appointments
  const patientAppointments = user ? getPatientAppointments(user.id) : [];
  
  // States for new appointment form
  const [isBooking, setIsBooking] = useState(false);
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split("T")[0]);
  const [bookingTime, setBookingTime] = useState("");
  const [bookingDoctor, setBookingDoctor] = useState("");
  const [bookingPurpose, setBookingPurpose] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  // States for filtering appointments
  const [filterStatus, setFilterStatus] = useState<"all" | "scheduled" | "completed" | "cancelled">("all");
  
  // Handle form submission
  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setErrorMessage("You must be logged in to book an appointment");
      return;
    }
    
    if (!bookingDoctor || !bookingTime || !bookingPurpose) {
      setErrorMessage("Please fill in all required fields");
      return;
    }
    
    // Check if the selected date is in the past
    const selectedDate = new Date(bookingDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      setErrorMessage("Cannot book an appointment in the past");
      return;
    }
    
    // Check if the doctor is available at the selected time
    const existingAppointment = appointments.find(
      (a) => a.doctorId === bookingDoctor && a.date === bookingDate && a.time === bookingTime && a.status !== "cancelled"
    );
    
    if (existingAppointment) {
      setErrorMessage("This time slot is already booked");
      return;
    }
    
    try {
      // Find the doctor name
      const doctor = AVAILABLE_DOCTORS.find((doc) => doc.id === bookingDoctor);
      
      await addAppointment({
        patientId: user.id,
        patientName: user.name,
        doctorId: bookingDoctor,
        doctorName: doctor?.name || "Unknown Doctor",
        date: bookingDate,
        time: bookingTime,
        status: "scheduled",
        purpose: bookingPurpose,
      });
      
      // Reset form
      setBookingDate(new Date().toISOString().split("T")[0]);
      setBookingTime("");
      setBookingDoctor("");
      setBookingPurpose("");
      setErrorMessage("");
      setIsBooking(false);
    } catch (error) {
      console.error("Failed to book appointment:", error);
      setErrorMessage("Failed to book appointment. Please try again.");
    }
  };
  
  // Handle appointment cancellation
  const handleCancelAppointment = async (id: string) => {
    try {
      await updateAppointment(id, { status: "cancelled" });
    } catch (error) {
      console.error("Failed to cancel appointment:", error);
    }
  };
  
  // Filter appointments based on status
  const filteredAppointments = patientAppointments.filter((appointment) => {
    if (filterStatus === "all") return true;
    return appointment.status === filterStatus;
  });
  
  // Sort appointments by date (most recent first)
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-medical-dark">Appointments</h1>
            <p className="text-gray-500 mt-1">
              Book and manage your medical appointments
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <button
              onClick={() => setIsBooking(true)}
              className="inline-flex items-center px-4 py-2 bg-medical-primary text-white rounded-md hover:bg-medical-secondary transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" x2="12" y1="5" y2="19" />
                <line x1="5" x2="19" y1="12" y2="12" />
              </svg>
              Book Appointment
            </button>
          </div>
        </div>

        {/* Booking Form */}
        {isBooking && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-medical-dark">Book New Appointment</h2>
              <button
                onClick={() => setIsBooking(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" x2="6" y1="6" y2="18" />
                  <line x1="6" x2="18" y1="6" y2="18" />
                </svg>
              </button>
            </div>
            
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                {errorMessage}
              </div>
            )}
            
            <form onSubmit={handleBookAppointment}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="bookingDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Date*
                  </label>
                  <input
                    id="bookingDate"
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="bookingTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Time Slot*
                  </label>
                  <select
                    id="bookingTime"
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                    required
                  >
                    <option value="">Select a time slot</option>
                    {AVAILABLE_TIMES.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="bookingDoctor" className="block text-sm font-medium text-gray-700 mb-1">
                    Doctor*
                  </label>
                  <select
                    id="bookingDoctor"
                    value={bookingDoctor}
                    onChange={(e) => setBookingDoctor(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                    required
                  >
                    <option value="">Select a doctor</option>
                    {AVAILABLE_DOCTORS.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.name} - {doctor.specialization}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="bookingPurpose" className="block text-sm font-medium text-gray-700 mb-1">
                    Purpose of Visit*
                  </label>
                  <input
                    id="bookingPurpose"
                    type="text"
                    value={bookingPurpose}
                    onChange={(e) => setBookingPurpose(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-primary focus:border-medical-primary"
                    placeholder="e.g., Annual Checkup"
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsBooking(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-medical-primary text-white rounded-md hover:bg-medical-secondary"
                >
                  Book Appointment
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filter Controls */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
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

        {/* Appointments List */}
        <div className="space-y-4">
          {sortedAppointments.length > 0 ? (
            sortedAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                actions={
                  appointment.status === "scheduled" ? (
                    <button
                      onClick={() => handleCancelAppointment(appointment.id)}
                      className="px-3 py-1 text-xs rounded-md bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                    >
                      Cancel
                    </button>
                  ) : null
                }
              />
            ))
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <p className="text-gray-500">No appointments found.</p>
              <button
                onClick={() => setIsBooking(true)}
                className="mt-4 inline-block px-4 py-2 bg-medical-primary text-white rounded-md hover:bg-medical-secondary transition-colors"
              >
                Book Your First Appointment
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientAppointments;
