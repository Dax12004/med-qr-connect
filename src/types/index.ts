
// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'patient' | 'doctor' | 'admin';
  phone?: string;
  gender?: 'male' | 'female' | 'other';
  dateOfBirth?: string;
  bloodGroup?: string;
  height?: string;
  weight?: string;
  emergencyContactName?: string;
  emergencyContactNumber?: string;
  emergencyContactRelation?: string;
  address?: string;
  insuranceInfo?: string;
  specialization?: string;
  licenseNumber?: string;
  experience?: string;
  education?: string;
  hospital?: string;
  availability?: string;
  clinicAddress?: string;
  appointmentContact?: string;
}

// Medical Record Types
export interface MedicalRecord {
  id: string;
  patientId: string;
  title: string;
  type: 'diagnosis' | 'prescription' | 'test' | 'treatment' | 'other';
  date: string;
  description: string;
  attachmentUrl?: string;
  doctor?: {
    id: string;
    name: string;
  };
  prescriptions?: string[];
}

// Appointment Types
export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  purpose: string;
  notes?: string;
}

// QR Scan Log Types
export interface QrScanLog {
  id: string;
  recordId: string;
  scannedBy: string;
  scannedAt: string;
  ipAddress: string;
  location?: string;
}
