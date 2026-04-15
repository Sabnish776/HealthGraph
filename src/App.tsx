import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import PatientLogin from './pages/PatientLogin';
import HospitalLogin from './pages/HospitalLogin';
import PatientDashboard from './pages/PatientDashboard';
import HospitalDashboard from './pages/HospitalDashboard';
import PatientSearch from './pages/PatientSearch';
import PatientRegistration from './pages/PatientRegistration';
import HospitalRegistration from './pages/HospitalRegistration';
import SplashScreen from './components/SplashScreen';
import { Activity } from 'lucide-react';
import { motion } from 'motion/react';

const PrivateRoute = ({ children, type }: { children: React.ReactNode, type: 'patient' | 'hospital' }) => {
  const { user, type: userType, loading } = useAuth();
  
  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-mesh">
      <div className="flex flex-col items-center gap-6">
        <div className="h-16 w-16 gradient-blue-teal rounded-2xl flex items-center justify-center animate-pulse shadow-2xl shadow-medical-blue/20">
          <Activity className="h-8 w-8 text-white" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-medical-blue font-black uppercase tracking-widest text-xs">Accessing Secure Records</p>
          <div className="h-1 w-32 bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
              className="h-full gradient-blue-teal"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
  if (!user || userType !== type) return <Navigate to="/" />;
  
  return <>{children}</>;
};

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-mesh flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/patient/login" element={<PatientLogin />} />
              <Route path="/patient/register" element={<PatientRegistration />} />
              <Route path="/hospital/login" element={<HospitalLogin />} />
              <Route path="/hospital/register" element={<HospitalRegistration />} />
              
              <Route 
                path="/patient/dashboard" 
                element={
                  <PrivateRoute type="patient">
                    <PatientDashboard />
                  </PrivateRoute>
                } 
              />
              
              <Route 
                path="/hospital/dashboard" 
                element={
                  <PrivateRoute type="hospital">
                    <HospitalDashboard />
                  </PrivateRoute>
                } 
              />
              
              <Route 
                path="/hospital/search" 
                element={
                  <PrivateRoute type="hospital">
                    <PatientSearch />
                  </PrivateRoute>
                } 
              />
            </Routes>
          </main>
          <footer className="bg-white border-t border-slate-100 py-20">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-12">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 gradient-blue-teal rounded-xl flex items-center justify-center shadow-lg shadow-medical-blue/20">
                    <Activity className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-2xl font-black text-medical-blue tracking-tighter">
                    HealthGraph <span className="text-teal-accent">India</span>
                  </span>
                </div>
                
                <div className="flex flex-wrap justify-center gap-8 text-text-muted text-xs font-black uppercase tracking-widest">
                  <a href="#" className="hover:text-medical-blue transition-colors">Privacy Standards</a>
                  <a href="#" className="hover:text-medical-blue transition-colors">Terms of Service</a>
                  <a href="#" className="hover:text-medical-blue transition-colors">Facility Network</a>
                  <a href="#" className="hover:text-medical-blue transition-colors">Contact Support</a>
                </div>

                <div className="text-text-muted text-xs font-bold">
                  &copy; 2024 HealthGraph India. Unified Intelligence Layer.
                </div>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}
