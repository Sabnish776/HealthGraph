import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import { User, Mail, Calendar, Heart, Users, Loader2, CheckCircle2, ArrowRight, Lock, Phone, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function PatientRegistration() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    mobile: '',
    name: '',
    gender: '',
    bloodGroup: '',
    age: '',
    emergencyContact: '',
  });
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'info' | 'otp'>('info');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/patient/otp/send', { mobile: formData.mobile });
      setStep('otp');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/patient/otp/verify', { mobile: formData.mobile, code: otp });
      const { data } = await api.post('/patient/register', {
        ...formData,
        age: parseInt(formData.age)
      });
      login(data.token, data.patient, 'patient');
      navigate('/patient/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed or invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden bg-mesh">
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-medical-blue/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-accent/5 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full glass-panel rounded-[40px] p-12 relative z-10 shadow-2xl shadow-medical-blue/5"
      >
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center h-20 w-20 gradient-blue-teal rounded-[24px] mb-8 shadow-2xl shadow-medical-blue/20">
            <User className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-4xl font-black text-medical-blue tracking-tighter leading-none mb-4">Join HealthGraph</h2>
          <p className="text-text-muted font-medium">Create your unified medical identity in seconds</p>
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

        {step === 'info' ? (
          <form onSubmit={handleSendOtp} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="col-span-2 space-y-2">
              <label className="text-xs font-black text-text-muted uppercase tracking-widest ml-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  className="input-premium pl-14"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            <div className="col-span-2 md:col-span-1 space-y-2">
              <label className="text-xs font-black text-text-muted uppercase tracking-widest ml-2">Mobile Number</label>
              <div className="relative">
                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                <input
                  type="tel"
                  required
                  placeholder="10-digit mobile"
                  className="input-premium pl-14"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-text-muted uppercase tracking-widest ml-2">Gender</label>
              <select
                required
                className="input-premium appearance-none"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-text-muted uppercase tracking-widest ml-2">Blood Group</label>
              <select
                required
                className="input-premium appearance-none"
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
              >
                <option value="">Select Blood Group</option>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-text-muted uppercase tracking-widest ml-2">Age</label>
              <div className="relative">
                <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                <input
                  type="number"
                  required
                  placeholder="Years"
                  className="input-premium pl-14"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                />
              </div>
            </div>

            <div className="col-span-2 md:col-span-1 space-y-2">
              <label className="text-xs font-black text-text-muted uppercase tracking-widest ml-2">Emergency Contact</label>
              <div className="relative">
                <Heart className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                <input
                  type="tel"
                  required
                  placeholder="Contact number"
                  className="input-premium pl-14"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                />
              </div>
            </div>

            <div className="col-span-2 pt-6">
              <button
                type="submit"
                disabled={loading || formData.mobile.length !== 10}
                className="pill-button w-full gradient-blue-teal text-white shadow-2xl shadow-medical-blue/20 flex items-center justify-center gap-3 group"
              >
                {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : (
                  <>
                    Send Verification Code
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyAndRegister} className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-black text-text-muted uppercase tracking-widest ml-2">Verification Code</label>
                <button 
                  type="button" 
                  onClick={() => setStep('info')}
                  className="text-xs text-medical-blue font-black uppercase tracking-widest hover:underline"
                >
                  Edit Details
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-300" />
                <input
                  type="text"
                  required
                  placeholder="0 0 0 0 0 0"
                  className="input-premium pl-16 text-center text-2xl font-black tracking-[0.5em]"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                />
              </div>
              <p className="text-center text-[10px] font-black text-text-muted uppercase tracking-widest">
                Check console for your 6-digit code
              </p>
            </div>
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="pill-button w-full gradient-blue-teal text-white shadow-2xl shadow-medical-blue/20 flex items-center justify-center gap-3"
            >
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : (
                <>
                  Complete Registration
                  <CheckCircle2 className="h-5 w-5" />
                </>
              )}
            </button>
          </form>
        )}

        <div className="mt-12 text-center">
          <p className="text-sm text-text-muted font-medium">
            Already a member? <Link to="/patient/login" className="text-medical-blue font-black hover:underline">Login here</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
