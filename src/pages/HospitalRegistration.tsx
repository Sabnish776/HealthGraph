import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../lib/api';
import { Hospital, MapPin, Lock, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function HospitalRegistration() {
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/hospital/register', formData);
      navigate('/hospital/login');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
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
          <h2 className="text-4xl font-black text-medical-blue tracking-tighter leading-none mb-4">Register Facility</h2>
          <p className="text-text-muted font-medium">Join the HealthGraph Intelligence Network</p>
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

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label className="text-xs font-black text-text-muted uppercase tracking-widest ml-2">Hospital Name</label>
            <div className="relative">
              <Hospital className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
              <input
                type="text"
                required
                placeholder="e.g. AIIMS Delhi"
                className="input-premium pl-14"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-text-muted uppercase tracking-widest ml-2">Address</label>
            <div className="relative">
              <MapPin className="absolute left-5 top-5 h-5 w-5 text-slate-300" />
              <textarea
                required
                placeholder="Full facility address"
                className="input-premium pl-14 min-h-[120px] resize-none pt-4"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-text-muted uppercase tracking-widest ml-2">Portal Password</label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
              <input
                type="password"
                required
                placeholder="Create a strong password"
                className="input-premium pl-14"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                Register Facility
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-12 text-center">
          <p className="text-sm text-text-muted font-medium">
            Already registered? <Link to="/hospital/login" className="text-medical-blue font-black hover:underline">Login here</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
