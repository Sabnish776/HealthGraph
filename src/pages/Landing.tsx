import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Database, Zap, ArrowRight, Activity, Users, FileText, Hospital, Heart, Globe, Smartphone, Lock } from 'lucide-react';
import { motion } from 'motion/react';

export default function Landing() {
  return (
    <div className="bg-mesh min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        {/* Abstract Waves */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
          <svg width="100%" height="100%" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 500 Q 250 400 500 500 T 1000 500" fill="none" stroke="#1E3A8A" strokeWidth="2" />
            <path d="M0 600 Q 250 500 500 600 T 1000 600" fill="none" stroke="#14B8A6" strokeWidth="2" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <span className="inline-block px-4 py-2 bg-medical-blue/5 text-medical-blue rounded-full text-xs font-black uppercase tracking-widest mb-6">
                  India's Unified Health Intelligence
                </span>
                <h1 className="text-6xl lg:text-8xl font-black text-medical-blue tracking-tighter leading-[0.9] mb-8">
                  Your Health, <br />
                  <span className="text-teal-accent">Visualized.</span>
                </h1>
                <p className="text-xl text-text-muted font-medium mb-12 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Experience the next generation of healthcare. HealthGraph India connects your entire medical journey into one premium, secure, and intelligent platform.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start">
                  <Link to="/patient/login" className="pill-button gradient-blue-teal text-white shadow-2xl shadow-medical-blue/20 flex items-center gap-3 group">
                    Get Started <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link to="/hospital/login" className="pill-button bg-white text-medical-blue border border-slate-100 shadow-soft hover:bg-slate-50">
                    Hospital Portal
                  </Link>
                </div>
              </motion.div>
            </div>

            <div className="flex-1 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="relative z-10"
              >
                <div className="glass-panel rounded-[40px] p-4 shadow-2xl shadow-medical-blue/10">
                  <img 
                    src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1000" 
                    alt="Modern Healthcare"
                    className="rounded-[32px] w-full h-[500px] object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                
                {/* Floating Stats */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-8 -right-8 glass-panel p-6 rounded-[24px] shadow-soft"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-health-green/10 rounded-xl flex items-center justify-center">
                      <Heart className="h-6 w-6 text-health-green" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-text-muted uppercase tracking-widest">Unified Health</p>
                      <p className="text-lg font-black text-text-dark">Records</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-8 -left-8 glass-panel p-6 rounded-[24px] shadow-soft"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-medical-blue/10 rounded-xl flex items-center justify-center">
                      <Shield className="h-6 w-6 text-medical-blue" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-text-muted uppercase tracking-widest">Security</p>
                      <p className="text-lg font-black text-text-dark">AES-256</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-6xl font-black text-medical-blue tracking-tighter mb-6">
              Designed for <span className="text-teal-accent">Excellence.</span>
            </h2>
            <p className="text-xl text-text-muted font-medium max-w-2xl mx-auto">
              A comprehensive suite of tools built with a focus on clarity, security, and human-centric design.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Activity className="text-medical-blue" />}
              title="Real-time Vitals"
              description="Monitor your health metrics with precision line charts and circular progress rings."
              color="bg-medical-blue/5"
            />
            <FeatureCard 
              icon={<Shield className="text-teal-accent" />}
              title="Secure Records"
              description="Your medical history is encrypted and accessible only by you and authorized facilities."
              color="bg-teal-accent/5"
            />
            <FeatureCard 
              icon={<Zap className="text-health-green" />}
              title="Instant Insights"
              description="AI-powered analysis provides clear, actionable health recommendations."
              color="bg-health-green/5"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-medical-blue pt-20 pb-10 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-10 w-10 gradient-teal-green rounded-xl flex items-center justify-center">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-black tracking-tighter">HealthGraph India</span>
              </div>
              <p className="text-white/60 font-medium max-w-md leading-relaxed">
                Building the digital backbone of India's healthcare system. Secure, unified, and intelligent health records for every citizen.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest mb-8 text-white/40">Platform</h4>
              <ul className="space-y-4">
                <li><Link to="/patient/login" className="text-white/70 hover:text-white transition-colors font-bold text-sm">Patient Portal</Link></li>
                <li><Link to="/hospital/login" className="text-white/70 hover:text-white transition-colors font-bold text-sm">Hospital Network</Link></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors font-bold text-sm">Security Standards</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest mb-8 text-white/40">Company</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-white/70 hover:text-white transition-colors font-bold text-sm">About Us</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors font-bold text-sm">Contact</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors font-bold text-sm">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest">© 2024 HealthGraph India. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Globe className="h-5 w-5 text-white/40 hover:text-white transition-colors cursor-pointer" />
              <Smartphone className="h-5 w-5 text-white/40 hover:text-white transition-colors cursor-pointer" />
              <Lock className="h-5 w-5 text-white/40 hover:text-white transition-colors cursor-pointer" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, color }: any) {
  return (
    <div className="card-premium group">
      <div className={`h-16 w-16 ${color} rounded-[20px] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
        {React.cloneElement(icon, { className: 'h-8 w-8 ' + icon.props.className })}
      </div>
      <h3 className="text-2xl font-black text-text-dark mb-4 tracking-tight">{title}</h3>
      <p className="text-text-muted font-medium leading-relaxed">{description}</p>
    </div>
  );
}

function StatItem({ label, value }: any) {
  return (
    <div className="text-center">
      <p className="text-xs font-black text-text-muted uppercase tracking-widest mb-2">{label}</p>
      <p className="text-5xl lg:text-7xl font-black text-medical-blue tracking-tighter">{value}</p>
    </div>
  );
}
