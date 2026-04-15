import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import { 
  Users, Activity, Calendar, Search, ArrowRight, 
  PlusCircle, FileText, Clock, Hospital as HospitalIcon,
  Loader2, Phone, Shield, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

export default function HospitalDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalConsultations: 0,
    reportsUploaded: 0,
    loggedPatients: 0,
    recentActivity: [] as any[]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/hospital/dashboard-stats');
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-mesh">
        <div className="flex flex-col items-center gap-6">
          <div className="h-16 w-16 gradient-blue-teal rounded-2xl flex items-center justify-center animate-pulse shadow-2xl shadow-medical-blue/20">
            <HospitalIcon className="h-8 w-8 text-white" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-medical-blue font-black uppercase tracking-widest text-xs">Syncing Facility Intelligence</p>
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
  }

  return (
    <div className="bg-mesh min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          <div>
            <span className="text-xs font-black text-medical-blue uppercase tracking-widest mb-2 block">Facility Dashboard</span>
            <h1 className="text-5xl font-black text-medical-blue tracking-tighter leading-none">{user.name}</h1>
          </div>
          <Link 
            to="/hospital/search"
            className="pill-button gradient-blue-teal text-white shadow-2xl shadow-medical-blue/20 flex items-center gap-3 group"
          >
            <Search className="h-5 w-5" />
            Search Patient
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <HospitalStatCard 
            title="Logged Patients" 
            value={stats.loggedPatients} 
            icon={<Users className="text-medical-blue" />} 
            color="bg-medical-blue/5"
          />
          <HospitalStatCard 
            title="Reports Uploaded" 
            value={stats.reportsUploaded} 
            icon={<FileText className="text-teal-accent" />} 
            color="bg-teal-accent/5"
          />
          <HospitalStatCard 
            title="Total Consultations" 
            value={stats.totalConsultations} 
            icon={<Activity className="text-health-green" />} 
            color="bg-health-green/5"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="card-premium">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-2xl font-black text-medical-blue tracking-tight flex items-center gap-4">
                  <div className="h-10 w-10 bg-medical-blue/5 rounded-xl flex items-center justify-center">
                    <Clock className="h-5 w-5 text-medical-blue" />
                  </div>
                  Recent Facility Activity
                </h3>
              </div>

              <div className="space-y-4">
                {stats.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-6 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all rounded-[24px] group border border-transparent hover:border-slate-100">
                    <div className="flex items-center gap-6">
                      <div className="h-14 w-14 bg-white border-2 border-slate-100 rounded-2xl flex items-center justify-center font-black text-xl text-medical-blue shadow-sm group-hover:scale-110 transition-transform">
                        {activity.patientName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-text-dark">{activity.patientName}</h4>
                        <p className="text-text-muted font-medium">{activity.reason} <span className="opacity-50">•</span> {format(new Date(activity.date), 'PPp')}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => navigate(`/hospital/search?mobile=${activity.patientMobile}`)}
                      className="px-6 py-3 bg-white border border-slate-100 rounded-xl font-bold text-xs uppercase tracking-widest text-text-muted hover:border-medical-blue hover:text-medical-blue transition-all"
                    >
                      View Profile
                    </button>
                  </div>
                ))}
                {stats.recentActivity.length === 0 && (
                  <div className="text-center py-20">
                    <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Activity className="h-10 w-10 text-slate-200" />
                    </div>
                    <p className="text-text-muted font-black uppercase tracking-widest text-sm">No recent activity found</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="card-premium gradient-blue-teal text-white border-none">
              <h3 className="text-xl font-black mb-8 uppercase tracking-widest text-white/60">Quick Actions</h3>
              <div className="space-y-3">
                <QuickActionBtn icon={<PlusCircle />} label="Register Patient" />
                <QuickActionBtn icon={<FileText />} label="Upload Results" />
                <QuickActionBtn icon={<Activity />} label="Emergency" />
              </div>
            </div>

            <div className="card-premium">
              <h3 className="text-xl font-black text-medical-blue mb-8">Facility Info</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center shrink-0">
                    <HospitalIcon className="h-5 w-5 text-text-muted" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Registered Name</p>
                    <p className="text-sm font-bold text-text-dark leading-tight">{user.name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 bg-health-green/5 rounded-xl flex items-center justify-center shrink-0">
                    <Shield className="h-5 w-5 text-health-green" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">System Status</p>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-health-green rounded-full animate-pulse" />
                      <p className="text-sm font-bold text-health-green">Live Connection</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HospitalStatCard({ title, value, icon, color }: any) {
  return (
    <div className="card-premium flex items-center justify-between p-10 group">
      <div>
        <p className="text-xs font-black text-text-muted uppercase tracking-widest mb-2">{title}</p>
        <p className="text-6xl font-black text-medical-blue tracking-tighter">{value}</p>
      </div>
      <div className={`h-20 w-20 ${color} rounded-[24px] flex items-center justify-center group-hover:scale-110 transition-transform`}>
        {React.cloneElement(icon, { className: 'h-10 w-10 ' + icon.props.className })}
      </div>
    </div>
  );
}

function QuickActionBtn({ icon, label }: any) {
  return (
    <button className="w-full flex items-center gap-4 p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all text-left font-bold text-xs uppercase tracking-widest border border-white/5">
      <div className="text-white/80">
        {React.cloneElement(icon, { className: 'h-5 w-5' })}
      </div>
      {label}
    </button>
  );
}
