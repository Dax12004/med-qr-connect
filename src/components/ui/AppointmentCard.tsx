
import React from "react";
import { Appointment } from "@/contexts/MedicalRecordContext";

interface AppointmentCardProps {
  appointment: Appointment;
  actions?: React.ReactNode;
  isDoctor?: boolean;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  actions,
  isDoctor = false,
}) => {
  // Format date and time
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":");
    const hour = parseInt(hours, 10);
    const amPm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${amPm}`;
  };

  // Status badge color
  const getStatusColor = () => {
    switch (appointment.status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 flex flex-col sm:flex-row justify-between">
        <div className="mb-3 sm:mb-0">
          <div className="flex items-center space-x-3 mb-2">
            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor()} capitalize`}>
              {appointment.status}
            </span>
            <h3 className="font-semibold text-medical-dark">{appointment.purpose}</h3>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
            <span>{formatDate(appointment.date)}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>{formatTime(appointment.time)}</span>
          </div>
        </div>
        
        <div className="flex flex-col justify-between">
          <div className="text-right mb-2">
            {isDoctor ? (
              <p className="text-sm font-medium text-medical-patient">
                Patient: {appointment.patientName}
              </p>
            ) : (
              <p className="text-sm font-medium text-medical-doctor">
                Doctor: Dr. {appointment.doctorName}
              </p>
            )}
          </div>
          
          <div className="flex justify-end">
            {actions}
          </div>
        </div>
      </div>
      
      {appointment.notes && (
        <div className="px-4 pb-4 pt-0">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Notes:</span> {appointment.notes}
          </p>
        </div>
      )}
    </div>
  );
};

export default AppointmentCard;
