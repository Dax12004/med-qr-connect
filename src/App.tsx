
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Contexts
import { AuthProvider } from "@/contexts/AuthContext";
import { MedicalRecordProvider } from "@/contexts/MedicalRecordContext";

// Public Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

// Patient Pages
import PatientDashboard from "./pages/patient/Dashboard";
import PatientRecords from "./pages/patient/Records";
import PatientRecordDetail from "./pages/patient/RecordDetail";
import PatientAppointments from "./pages/patient/Appointments";
import PatientEmergency from "./pages/patient/Emergency";
import PatientProfile from "./pages/patient/Profile";

// Doctor Pages
import DoctorDashboard from "./pages/doctor/Dashboard";
import DoctorPatients from "@/pages/doctor/Patients";
import DoctorPatientDetail from "./pages/doctor/PatientDetail";
import DoctorAppointments from "./pages/doctor/Appointments";
import DoctorProfile from "./pages/doctor/Profile";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminQrManagement from "./pages/admin/QrManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <MedicalRecordProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Patient Routes */}
              <Route path="/patient/dashboard" element={<PatientDashboard />} />
              <Route path="/patient/records" element={<PatientRecords />} />
              <Route path="/patient/records/:recordId" element={<PatientRecordDetail />} />
              <Route path="/patient/appointments" element={<PatientAppointments />} />
              <Route path="/patient/emergency" element={<PatientEmergency />} />
              <Route path="/patient/profile" element={<PatientProfile />} />
              
              {/* Doctor Routes */}
              <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
              <Route path="/doctor/patients" element={<DoctorPatients />} />
              <Route path="/doctor/patients/:patientId" element={<DoctorPatientDetail />} />
              <Route path="/doctor/appointments" element={<DoctorAppointments />} />
              <Route path="/doctor/profile" element={<DoctorProfile />} />
              
              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/qr-management" element={<AdminQrManagement />} />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </MedicalRecordProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
