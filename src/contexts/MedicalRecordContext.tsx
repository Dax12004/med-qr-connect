import React, { createContext, useContext, useState } from 'react';
import { User, MedicalRecord, Appointment, QrScanLog } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Re-export types used by other components
export type { MedicalRecord, Appointment, QrScanLog };

interface MedicalRecordContextType {
  records: MedicalRecord[];
  appointments: Appointment[];
  qrLogs: QrScanLog[];
  addRecord: (record: Omit<MedicalRecord, 'id'>) => Promise<MedicalRecord>;
  updateRecord: (id: string, updates: Partial<MedicalRecord>) => Promise<MedicalRecord>;
  deleteRecord: (id: string) => Promise<void>;
  addAppointment: (appointment: Omit<Appointment, 'id'>) => Promise<Appointment>;
  updateAppointment: (id: string, updates: Partial<Appointment>) => Promise<Appointment>;
  deleteAppointment: (id: string) => Promise<void>;
  getPatientRecords: (patientId: string) => MedicalRecord[];
  getPatientAppointments: (patientId: string) => Appointment[];
  getDoctorAppointments: (doctorId: string) => Appointment[];
  getDoctorPatients: (doctorId: string) => User[];
  addQrScanLog: (log: Omit<QrScanLog, 'id'>) => Promise<QrScanLog>;
}

const MedicalRecordContext = createContext<MedicalRecordContextType>({
  records: [],
  appointments: [],
  qrLogs: [],
  addRecord: async () => ({ id: '', patientId: '', title: '', type: 'other', date: '', description: '' }),
  updateRecord: async () => ({ id: '', patientId: '', title: '', type: 'other', date: '', description: '' }),
  deleteRecord: async () => {},
  addAppointment: async () => ({ 
    id: '', 
    patientId: '', 
    patientName: '', 
    doctorId: '', 
    doctorName: '', 
    date: '', 
    time: '', 
    status: 'scheduled', 
    purpose: '' 
  }),
  updateAppointment: async () => ({ 
    id: '', 
    patientId: '', 
    patientName: '', 
    doctorId: '', 
    doctorName: '', 
    date: '', 
    time: '', 
    status: 'scheduled', 
    purpose: '' 
  }),
  deleteAppointment: async () => {},
  getPatientRecords: () => [],
  getPatientAppointments: () => [],
  getDoctorAppointments: () => [],
  getDoctorPatients: () => [],
  addQrScanLog: async () => ({ id: '', recordId: '', scannedBy: '', scannedAt: '', ipAddress: '' }),
});

export const useMedicalRecord = () => useContext(MedicalRecordContext);

export const MedicalRecordProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [qrLogs, setQrLogs] = useState<QrScanLog[]>([]);

  const addRecord = async (recordData: Omit<MedicalRecord, 'id'>): Promise<MedicalRecord> => {
    const newRecord: MedicalRecord = {
      id: uuidv4(),
      ...recordData
    };
    setRecords(prev => [...prev, newRecord]);
    return newRecord;
  };

  const updateRecord = async (id: string, updates: Partial<MedicalRecord>): Promise<MedicalRecord> => {
    let updatedRecord: MedicalRecord = { id: '', patientId: '', title: '', type: 'other', date: '', description: '' };
    
    setRecords(prev => {
      const updated = prev.map(record => {
        if (record.id === id) {
          updatedRecord = { ...record, ...updates };
          return updatedRecord;
        }
        return record;
      });
      return updated;
    });
    
    return updatedRecord;
  };

  const deleteRecord = async (id: string): Promise<void> => {
    setRecords(prev => prev.filter(record => record.id !== id));
  };

  const addAppointment = async (appointmentData: Omit<Appointment, 'id'>): Promise<Appointment> => {
    const newAppointment: Appointment = {
      id: uuidv4(),
      ...appointmentData
    };
    setAppointments(prev => [...prev, newAppointment]);
    return newAppointment;
  };

  const updateAppointment = async (id: string, updates: Partial<Appointment>): Promise<Appointment> => {
    let updatedAppointment: Appointment = { 
      id: '', 
      patientId: '', 
      patientName: '', 
      doctorId: '', 
      doctorName: '', 
      date: '', 
      time: '', 
      status: 'scheduled', 
      purpose: '' 
    };
    
    setAppointments(prev => {
      const updated = prev.map(appointment => {
        if (appointment.id === id) {
          updatedAppointment = { ...appointment, ...updates };
          return updatedAppointment;
        }
        return appointment;
      });
      return updated;
    });
    
    return updatedAppointment;
  };

  const deleteAppointment = async (id: string): Promise<void> => {
    setAppointments(prev => prev.filter(appointment => appointment.id !== id));
  };

  const addQrScanLog = async (logData: Omit<QrScanLog, 'id'>): Promise<QrScanLog> => {
    const newLog: QrScanLog = {
      id: uuidv4(),
      ...logData
    };
    setQrLogs(prev => [...prev, newLog]);
    return newLog;
  };

  const getPatientRecords = (patientId: string) => {
    return records.filter(record => record.patientId === patientId);
  };

  const getPatientAppointments = (patientId: string) => {
    return appointments.filter(appointment => appointment.patientId === patientId);
  };

  const getDoctorAppointments = (doctorId: string) => {
    return appointments.filter(appointment => appointment.doctorId === doctorId);
  };

  const getDoctorPatients = (doctorId: string): User[] => {
    const doctorAppointments = getDoctorAppointments(doctorId);
    const patientIds = [...new Set(doctorAppointments.map(app => app.patientId))];
    return patientIds.map(id => ({ 
      id, 
      name: '', 
      email: '', 
      role: 'patient' as const 
    }));
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
        addAppointment,
        updateAppointment,
        deleteAppointment,
        getPatientRecords,
        getPatientAppointments,
        getDoctorAppointments,
        getDoctorPatients,
        addQrScanLog,
      }}
    >
      {children}
    </MedicalRecordContext.Provider>
  );
};
