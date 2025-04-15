import React, { createContext, useContext, useState } from 'react';
import { User, MedicalRecord, Appointment, QrScanLog } from '@/types'; // Adjust import path as needed

interface MedicalRecordContextType {
  records: MedicalRecord[];
  appointments: Appointment[];
  qrLogs: QrScanLog[];
  getPatientRecords: (patientId: string) => MedicalRecord[];
  getPatientAppointments: (patientId: string) => Appointment[];
  getDoctorAppointments: (doctorId: string) => Appointment[];
  getDoctorPatients: (doctorId: string) => User[];
}

const MedicalRecordContext = createContext<MedicalRecordContextType>({
  records: [],
  appointments: [],
  qrLogs: [],
  getPatientRecords: () => [],
  getPatientAppointments: () => [],
  getDoctorAppointments: () => [],
  getDoctorPatients: () => [],
});

export const useMedicalRecord = () => useContext(MedicalRecordContext);

export const MedicalRecordProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [qrLogs, setQrLogs] = useState<QrScanLog[]>([]);

  const getPatientRecords = (patientId: string) => {
    return records.filter(record => record.patientId === patientId);
  };

  const getPatientAppointments = (patientId: string) => {
    return appointments.filter(appointment => appointment.patientId === patientId);
  };

  const getDoctorAppointments = (doctorId: string) => {
    return appointments.filter(appointment => appointment.doctorId === doctorId);
  };

  const getDoctorPatients = (doctorId: string) => {
    const doctorAppointments = getDoctorAppointments(doctorId);
    const patientIds = [...new Set(doctorAppointments.map(app => app.patientId))];
    return patientIds.map(id => ({ id, name: '', email: '', role: 'patient' }));
  };

  return (
    <MedicalRecordContext.Provider
      value={{
        records,
        appointments,
        qrLogs,
        getPatientRecords,
        getPatientAppointments,
        getDoctorAppointments,
        getDoctorPatients,
      }}
    >
      {children}
    </MedicalRecordContext.Provider>
  );
};