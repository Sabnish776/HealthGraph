import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Activity, LogOut, User, Hospital, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const { user, type, logout } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'py-4' : 'py-6'}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className={`glass-panel rounded-[24px] px-8 py-4 flex items-center justify-between transition-all duration-500 ${isScrolled ? 'shadow-2xl shadow-medical-blue/10' : ''}`}>
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 gradient-blue-teal rounded-xl flex items-center justify-center shadow-lg shadow-medical-blue/20 group-hover:scale-110 transition-transform">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-black text-medical-blue tracking-tighter">
              HealthGraph <span className="text-teal-accent">India</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {user ? (
              <>
                <Link to={type === 'patient' ? '/patient/dashboard' : '/hospital/dashboard'} className="text-sm font-bold text-text-dark hover:text-medical-blue transition-colors">Dashboard</Link>
                {type === 'hospital' && (
                  <Link to="/hospital/search" className="text-sm font-bold text-text-dark hover:text-medical-blue transition-colors">Search Patient</Link>
                )}
                <div className="h-8 w-px bg-slate-100" />
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs font-black text-medical-blue uppercase tracking-widest leading-none mb-1">{type}</p>
                    <p className="text-sm font-bold text-text-dark">{user.name}</p>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="p-3 bg-slate-50 text-text-muted hover:bg-alert-red hover:text-white rounded-xl transition-all"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/patient/login" className="text-sm font-bold text-text-dark hover:text-medical-blue transition-colors px-4">Patient Login</Link>
                <Link to="/hospital/login" className="pill-button gradient-blue-teal text-white text-sm shadow-xl shadow-medical-blue/20 flex items-center justify-center">
                  Facility Access
                </Link>
              </div>
            )}
          </div>

          <button 
            className="md:hidden p-2 text-text-dark"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 px-6 pt-4 md:hidden"
          >
            <div className="glass-panel rounded-[24px] p-6 space-y-4">
              {user ? (
                <>
                  <Link to={type === 'patient' ? '/patient/dashboard' : '/hospital/dashboard'} className="block py-3 font-bold text-text-dark">Dashboard</Link>
                  {type === 'hospital' && (
                    <Link to="/hospital/search" className="block py-3 font-bold text-text-dark">Search Patient</Link>
                  )}
                  <button onClick={handleLogout} className="w-full py-3 font-bold text-alert-red text-left">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/patient/login" className="block py-3 font-bold text-text-dark">Patient Login</Link>
                  <Link to="/hospital/login" className="block py-4 gradient-blue-teal text-white rounded-xl text-center font-bold">Facility Access</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
