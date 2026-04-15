import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import { Phone, Lock, ArrowRight, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function PatientLogin() {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'mobile' | 'otp'>('mobile');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/patient/otp/send', { mobile });
      setStep('otp');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/patient/otp/verify', { mobile, code: otp });
      if (data.needsRegistration) {
        navigate('/patient/register', { state: { mobile } });
      } else {
        login(data.token, data.patient, 'patient');
        navigate('/patient/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid OTP');
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
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-md w-full glass-panel rounded-[40px] p-12 relative z-10 shadow-2xl shadow-medical-blue/5"
      >
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center h-20 w-20 gradient-blue-teal rounded-[24px] mb-8 shadow-2xl shadow-medical-blue/20">
            <Phone className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-4xl font-black text-medical-blue tracking-tighter leading-none mb-4">Patient Portal</h2>
          <p className="text-text-muted font-medium">Access your unified medical records</p>
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

        {step === 'mobile' ? (
          <form onSubmit={handleSendOtp} className="space-y-8">
            <div className="space-y-2">
              <label className="text-xs font-black text-text-muted uppercase tracking-widest ml-2">Mobile Number</label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">+91</span>
                <input
                  type="tel"
                  required
                  placeholder="10-digit number"
                  className="input-premium pl-16"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || mobile.length !== 10}
              className="pill-button w-full gradient-blue-teal text-white shadow-2xl shadow-medical-blue/20 flex items-center justify-center gap-3 group"
            >
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : (
                <>
                  Send Verification Code
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-black text-text-muted uppercase tracking-widest ml-2">Verification Code</label>
                <button 
                  type="button" 
                  onClick={() => setStep('mobile')}
                  className="text-xs text-medical-blue font-black uppercase tracking-widest hover:underline"
                >
                  Change Number
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
                  Verify & Continue
                  <CheckCircle2 className="h-5 w-5" />
                </>
              )}
            </button>
          </form>
        )}

        <div className="mt-12 text-center space-y-4">
          <p className="text-sm text-text-muted font-medium">
            New to HealthGraph? <Link to="/patient/register" className="text-medical-blue font-black hover:underline">Register here</Link>
          </p>
          <div className="pt-6 border-t border-slate-100">
            <p className="text-xs text-text-muted font-bold uppercase tracking-widest mb-4">Healthcare Provider?</p>
            <Link to="/hospital/login" className="pill-button bg-slate-100 text-medical-blue hover:bg-slate-200 inline-flex items-center gap-2 text-xs">
              Hospital Login
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
