import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import { Hospital, Lock, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function HospitalLogin() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/hospital/login', { name, password });
      login(data.token, data.hospital, 'hospital');
      navigate('/hospital/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden bg-mesh">
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-medical-blue/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-accent/5 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-md w-full glass-panel rounded-[40px] p-12 relative z-10 shadow-2xl shadow-medical-blue/5"
      >
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center h-20 w-20 gradient-blue-teal rounded-[24px] mb-8 shadow-2xl shadow-medical-blue/20">
            <Hospital className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-4xl font-black text-medical-blue tracking-tighter leading-none mb-4">Hospital Portal</h2>
          <p className="text-text-muted font-medium">Facility Management & Records</p>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 p-4 bg-alert-red/5 text-alert-red rounded-2xl text-sm font-bold border border-alert-red/10 flex items-center gap-3"
            >
              <ShieldCheck className="h-5 w-5" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleLogin} className="space-y-8">
          <div className="space-y-2">
            <label className="text-xs font-black text-text-muted uppercase tracking-widest ml-2">Hospital Name</label>
            <div className="relative">
              <Hospital className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
              <input
                type="text"
                required
                placeholder="Enter registered name"
                className="input-premium pl-14"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-text-muted uppercase tracking-widest ml-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
              <input
                type="password"
                required
                placeholder="••••••••"
                className="input-premium pl-14"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="pill-button w-full gradient-blue-teal text-white shadow-2xl shadow-medical-blue/20 flex items-center justify-center gap-3 group"
          >
            {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : (
              <>
                Login to Portal
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-12 text-center space-y-4">
          <p className="text-sm text-text-muted font-medium">
            New facility? <Link to="/hospital/register" className="text-medical-blue font-black hover:underline">Register Hospital</Link>
          </p>
          <div className="pt-6 border-t border-slate-100">
            <p className="text-xs text-text-muted font-bold uppercase tracking-widest mb-4">Patient?</p>
            <Link to="/patient/login" className="pill-button bg-slate-100 text-medical-blue hover:bg-slate-200 inline-flex items-center gap-2 text-xs">
              Patient Login
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
