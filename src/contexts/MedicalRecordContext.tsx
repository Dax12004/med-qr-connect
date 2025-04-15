
import React, { createContext, useContext, useState } from "react";
import { useAuth, User } from "./AuthContext";

// Medical record interface
export interface MedicalRecord {
  id: string;
  patientId: string;
  title: string;
  type: "diagnosis" | "prescription" | "test" | "treatment" | "other";
  date: string;
  doctor?: {
    id: string;
    name: string;
  };
  description: string;
  prescriptions?: string[];
  attachmentUrl?: string;
  qrCode?: string;
}

// Appointment interface
export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  status: "scheduled" | "completed" | "cancelled";
  purpose: string;
  notes?: string;
}

// QR Scan Log interface
export interface QrScanLog {
  id: string;
  recordId: string;
  scannedBy: string;
  scannedAt: string;
  ipAddress?: string;
  location?: string;
}

// Medical Record context type
interface MedicalRecordContextType {
  records: MedicalRecord[];
  appointments: Appointment[];
  qrLogs: QrScanLog[];
  addRecord: (record: Omit<MedicalRecord, "id">) => Promise<MedicalRecord>;
  updateRecord: (id: string, record: Partial<MedicalRecord>) => Promise<MedicalRecord>;
  deleteRecord: (id: string) => Promise<void>;
  getPatientRecords: (patientId: string) => MedicalRecord[];
  getDoctorPatients: (doctorId: string) => User[];
  addAppointment: (appointment: Omit<Appointment, "id">) => Promise<Appointment>;
  updateAppointment: (id: string, appointment: Partial<Appointment>) => Promise<Appointment>;
  deleteAppointment: (id: string) => Promise<void>;
  getDoctorAppointments: (doctorId: string) => Appointment[];
  getPatientAppointments: (patientId: string) => Appointment[];
  logQrScan: (recordId: string, scannedBy: string) => Promise<void>;
  getQrLogs: (recordId?: string) => QrScanLog[];
}

// Mock data
const MOCK_RECORDS: MedicalRecord[] = [
  {
    id: "rec1",
    patientId: "p1",
    title: "Annual Physical",
    type: "diagnosis",
    date: "2023-01-15",
    doctor: {
      id: "d1",
      name: "Dr. Smith",
    },
    description: "Regular annual checkup. Patient is in good health.",
    prescriptions: ["Vitamin D - 1000IU daily"],
    attachmentUrl: "/mockfiles/physical-report.pdf",
  },
  {
    id: "rec2",
    patientId: "p1",
    title: "Flu Treatment",
    type: "treatment",
    date: "2023-03-22",
    doctor: {
      id: "d1",
      name: "Dr. Smith",
    },
    description: "Patient has flu symptoms. Prescribed bed rest and fluids.",
    prescriptions: ["Acetaminophen - 500mg every 6 hours as needed for fever"],
    attachmentUrl: "/mockfiles/flu-prescription.pdf",
  },
];

const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: "app1",
    patientId: "p1",
    patientName: "John Doe",
    doctorId: "d1",
    doctorName: "Dr. Smith",
    date: "2023-05-10",
    time: "09:00",
    status: "completed",
    purpose: "Follow-up Checkup",
    notes: "Patient reported improved symptoms",
  },
  {
    id: "app2",
    patientId: "p1",
    patientName: "John Doe",
    doctorId: "d1",
    doctorName: "Dr. Smith",
    date: new Date().toISOString().split('T')[0], // Today's date
    time: "14:00",
    status: "scheduled",
    purpose: "Vaccine Administration",
  },
];

const MOCK_PATIENTS: User[] = [
  {
    id: "p1",
    name: "John Doe",
    email: "patient@example.com",
    role: "patient",
  },
  {
    id: "p2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "patient",
  },
];

const MOCK_QR_LOGS: QrScanLog[] = [
  {
    id: "log1",
    recordId: "rec1",
    scannedBy: "d1",
    scannedAt: "2023-04-15T10:30:00",
    ipAddress: "192.168.1.1",
  },
];

// Create context
const MedicalRecordContext = createContext<MedicalRecordContextType>({
  records: [],
  appointments: [],
  qrLogs: [],
  addRecord: async () => ({ id: "", patientId: "", title: "", type: "other", date: "", description: "" }),
  updateRecord: async () => ({ id: "", patientId: "", title: "", type: "other", date: "", description: "" }),
  deleteRecord: async () => {},
  getPatientRecords: () => [],
  getDoctorPatients: () => [],
  addAppointment: async () => ({ 
    id: "", 
    patientId: "", 
    patientName: "", 
    doctorId: "", 
    doctorName: "", 
    date: "", 
    time: "", 
    status: "scheduled", 
    purpose: "" 
  }),
  updateAppointment: async () => ({ 
    id: "", 
    patientId: "", 
    patientName: "", 
    doctorId: "", 
    doctorName: "", 
    date: "", 
    time: "", 
    status: "scheduled", 
    purpose: "" 
  }),
  deleteAppointment: async () => {},
  getDoctorAppointments: () => [],
  getPatientAppointments: () => [],
  logQrScan: async () => {},
  getQrLogs: () => [],
});

// Provider component
export const MedicalRecordProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [records, setRecords] = useState<MedicalRecord[]>(MOCK_RECORDS);
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [qrLogs, setQrLogs] = useState<QrScanLog[]>(MOCK_QR_LOGS);
  const { user } = useAuth();

  // Record functions
  const addRecord = async (record: Omit<MedicalRecord, "id">): Promise<MedicalRecord> => {
    // In a real app, this would be an API call
    const newRecord = {
      ...record,
      id: `rec_${Date.now()}`,
    };
    setRecords([...records, newRecord]);
    return newRecord;
  };

  const updateRecord = async (id: string, record: Partial<MedicalRecord>): Promise<MedicalRecord> => {
    // In a real app, this would be an API call
    const index = records.findIndex((r) => r.id === id);
    if (index === -1) throw new Error("Record not found");

    const updatedRecord = { ...records[index], ...record };
    const updatedRecords = [...records];
    updatedRecords[index] = updatedRecord;
    setRecords(updatedRecords);
    return updatedRecord;
  };

  const deleteRecord = async (id: string): Promise<void> => {
    // In a real app, this would be an API call
    setRecords(records.filter((r) => r.id !== id));
  };

  const getPatientRecords = (patientId: string): MedicalRecord[] => {
    return records.filter((record) => record.patientId === patientId);
  };

  const getDoctorPatients = (doctorId: string): User[] => {
    // Get unique patient IDs from records where doctor ID matches
    const patientIds = Array.from(
      new Set(
        records
          .filter((record) => record.doctor?.id === doctorId)
          .map((record) => record.patientId)
      )
    );

    // Return mock patients that match the patient IDs
    return MOCK_PATIENTS.filter((patient) => patientIds.includes(patient.id));
  };

  // Appointment functions
  const addAppointment = async (appointment: Omit<Appointment, "id">): Promise<Appointment> => {
    const newAppointment = {
      ...appointment,
      id: `app_${Date.now()}`,
    };
    setAppointments([...appointments, newAppointment]);
    return newAppointment;
  };

  const updateAppointment = async (id: string, appointment: Partial<Appointment>): Promise<Appointment> => {
    const index = appointments.findIndex((a) => a.id === id);
    if (index === -1) throw new Error("Appointment not found");

    const updatedAppointment = { ...appointments[index], ...appointment };
    const updatedAppointments = [...appointments];
    updatedAppointments[index] = updatedAppointment;
    setAppointments(updatedAppointments);
    return updatedAppointment;
  };

  const deleteAppointment = async (id: string): Promise<void> => {
    setAppointments(appointments.filter((a) => a.id !== id));
  };

  const getDoctorAppointments = (doctorId: string): Appointment[] => {
    return appointments.filter((appointment) => appointment.doctorId === doctorId);
  };

  const getPatientAppointments = (patientId: string): Appointment[] => {
    return appointments.filter((appointment) => appointment.patientId === patientId);
  };

  // QR scan logging
  const logQrScan = async (recordId: string, scannedBy: string): Promise<void> => {
    const newLog: QrScanLog = {
      id: `log_${Date.now()}`,
      recordId,
      scannedBy,
      scannedAt: new Date().toISOString(),
      ipAddress: "192.168.1.1", // In a real app, this would be the actual IP
    };
    setQrLogs([...qrLogs, newLog]);
  };

  const getQrLogs = (recordId?: string): QrScanLog[] => {
    if (recordId) {
      return qrLogs.filter((log) => log.recordId === recordId);
    }
    return qrLogs;
  };

  return (
    <MedicalRecordContext.Provider
      value={{
        records,
        appointments,
        qrLogs,
        addRecord,
        updateRecord,
        deleteRecord,
        getPatientRecords,
        getDoctorPatients,
        addAppointment,
        updateAppointment,
        deleteAppointment,
        getDoctorAppointments,
        getPatientAppointments,
        logQrScan,
        getQrLogs,
      }}
    >
      {children}
    </MedicalRecordContext.Provider>
  );
};

// Custom hook for using the medical record context
export const useMedicalRecord = () => useContext(MedicalRecordContext);
