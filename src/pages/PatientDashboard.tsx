import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import { 
  Activity, Calendar, FileText, Pill, AlertCircle, 
  QrCode, User, Edit3, ChevronRight, Download, Brain,
  Clock, MapPin, Phone, Heart, Loader2, Zap, Hospital, ExternalLink, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import QRCode from 'react-qr-code';
import { format } from 'date-fns';
import { GoogleGenAI } from "@google/genai";
import FilePreview from '../components/FilePreview';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function PatientDashboard() {
  const { user } = useAuth();
  const [history, setHistory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'meds' | 'ai'>('overview');
  const [showQR, setShowQR] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [previewFile, setPreviewFile] = useState<any>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const { data } = await api.get('/patient/history');
      setHistory(data);
    } catch (error) {
      console.error('Failed to fetch history', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAiAnalysis = async () => {
    setAnalyzing(true);
    try {
      const prompt = `
        As a medical AI assistant, analyze the following patient history and provide a summary of their health status, 
        potential risks, and recommendations. 
        Patient Info: ${JSON.stringify(user)}
        Visits: ${JSON.stringify(history.visits)}
        Medications: ${JSON.stringify(history.medications)}
        Diseases: ${JSON.stringify(history.diseases)}
        
        Provide the response in a clean markdown format with sections for:
        1. Health Summary
        2. Active Risks
        3. Recommendations
      `;
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
      setAiAnalysis(response.text);
    } catch (error) {
      console.error('AI Analysis failed', error);
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-mesh">
      <div className="flex flex-col items-center gap-6">
        <div className="h-16 w-16 gradient-blue-teal rounded-2xl flex items-center justify-center animate-pulse shadow-2xl shadow-medical-blue/20">
          <Activity className="h-8 w-8 text-white" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-medical-blue font-black uppercase tracking-widest text-xs">Syncing Health Intelligence</p>
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

  return (
    <div className="bg-mesh min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          <div>
            <span className="text-xs font-black text-medical-blue uppercase tracking-widest mb-2 block">Patient Dashboard</span>
            <h1 className="text-5xl font-black text-medical-blue tracking-tighter leading-none">Welcome back, <br /><span className="text-teal-accent">{user.name}</span></h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowQR(true)}
              className="pill-button bg-white text-medical-blue border border-slate-100 shadow-soft flex items-center gap-3"
            >
              <QrCode className="h-5 w-5" />
              My Health ID
            </button>
            <button 
              onClick={() => setEditingProfile(true)}
              className="pill-button gradient-blue-teal text-white shadow-xl shadow-medical-blue/20 flex items-center gap-3"
            >
              <Edit3 className="h-5 w-5" />
              Edit Profile
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <StatCard title="Blood Group" value={user.bloodGroup} icon={<Heart className="text-alert-red" />} color="bg-alert-red/5" />
          <StatCard title="Age" value={`${user.age} Yrs`} icon={<User className="text-medical-blue" />} color="bg-medical-blue/5" />
          <StatCard title="Gender" value={user.gender || 'N/A'} icon={<Activity className="text-teal-accent" />} color="bg-teal-accent/5" />
          <StatCard title="Emergency" value={user.emergencyContact} icon={<Phone className="text-health-green" />} color="bg-health-green/5" />
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-100/50 rounded-[20px] w-fit mb-12">
          <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} label="Overview" icon={<Activity />} />
          <TabButton active={activeTab === 'timeline'} onClick={() => setActiveTab('timeline')} label="Timeline" icon={<Clock />} />
          <TabButton active={activeTab === 'meds'} onClick={() => setActiveTab('meds')} label="Medications" icon={<Pill />} />
          <TabButton active={activeTab === 'ai'} onClick={() => setActiveTab('ai')} label="AI Insights" icon={<Brain />} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-12">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div 
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-12"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="card-premium">
                      <h3 className="text-xl font-black text-medical-blue mb-8">Active Medications</h3>
                      <div className="space-y-4">
                        {history.medications.filter((m: any) => m.status === 'active').map((m: any) => (
                          <MedicationCard key={m.id} med={m} />
                        ))}
                        {history.medications.filter((m: any) => m.status === 'active').length === 0 && (
                          <EmptyState message="No active medications" />
                        )}
                      </div>
                    </div>

                    <div className="card-premium">
                      <h3 className="text-xl font-black text-medical-blue mb-8">Recent Activity</h3>
                      <div className="space-y-6">
                        {history.visits.slice(0, 3).map((v: any) => (
                          <div key={v.visit.id} className="flex items-start gap-4">
                            <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center shrink-0">
                              <Calendar className="h-5 w-5 text-medical-blue" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-text-dark">{v.hospitalName}</p>
                              <p className="text-xs text-text-muted font-medium">{format(new Date(v.visit.date), 'PPP')}</p>
                            </div>
                          </div>
                        ))}
                        {history.visits.length === 0 && <EmptyState message="No recent visits" />}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'timeline' && (
                <motion.div key="timeline" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                  <div className="relative pl-8 border-l-2 border-slate-100 space-y-12 ml-4">
                    {history.visits.map((v: any) => (
                      <TimelineItem 
                        key={v.visit.id} 
                        visit={v} 
                        reports={history.reports.filter((r: any) => r.visitId === v.visit.id)} 
                        medications={history.medications.filter((m: any) => m.visitId === v.visit.id)}
                        diseases={history.diseases.filter((d: any) => d.diagnosedAtVisitId === v.visit.id)}
                        onPreview={(r: any) => setPreviewFile(r)}
                      />
                    ))}
                    {history.visits.length === 0 && <EmptyState message="No medical history found" />}
                  </div>
                </motion.div>
              )}

              {activeTab === 'meds' && (
                <motion.div key="meds" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {history.medications.map((m: any) => (
                      <MedicationCard key={m.id} med={m} />
                    ))}
                    {history.medications.length === 0 && <EmptyState message="No medication records found" />}
                  </div>
                </motion.div>
              )}

              {activeTab === 'ai' && (
                <motion.div key="ai" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                  <div className="card-premium gradient-blue-teal p-10 text-white mb-8 border-none">
                    <div className="flex items-center gap-6 mb-8">
                      <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md">
                        <Brain className="h-10 w-10 text-white" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-black tracking-tighter">AI Health Intelligence</h2>
                        <p className="text-white/70 font-medium">Deep analysis of your unified medical records</p>
                      </div>
                    </div>
                    {!aiAnalysis ? (
                      <button 
                        onClick={handleAiAnalysis}
                        disabled={analyzing}
                        className="pill-button bg-white text-medical-blue shadow-2xl shadow-black/10 flex items-center gap-3 disabled:opacity-50"
                      >
                        {analyzing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Zap className="h-5 w-5" />}
                        Generate Analysis
                      </button>
                    ) : (
                      <div className="bg-white/10 backdrop-blur-md rounded-[24px] p-8 prose prose-invert max-w-none border border-white/10">
                        <div dangerouslySetInnerHTML={{ __html: aiAnalysis.replace(/\n/g, '<br/>') }} />
                        <button 
                          onClick={() => setAiAnalysis(null)}
                          className="mt-8 text-sm font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors"
                        >
                          Refresh Analysis
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                Active Prone Diseases
              </h3>
              <div className="space-y-3">
                {history.diseases.filter((d: any) => d.status === 'prone' || d.status === 'active').map((d: any) => (
                  <div key={d.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-xl">
                    <span className="font-medium text-orange-700">{d.name}</span>
                    <span className="text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded-full font-bold uppercase">{d.status}</span>
                  </div>
                ))}
                {history.diseases.filter((d: any) => d.status === 'prone' || d.status === 'active').length === 0 && (
                  <p className="text-sm text-gray-400 italic">No active risks recorded</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Phone className="h-5 w-5 text-blue-600" />
                Emergency Contact
              </h3>
              <div className="p-4 bg-blue-50 rounded-2xl">
                <p className="text-sm text-blue-600 font-bold uppercase tracking-wider mb-1">Mobile Number</p>
                <p className="text-xl font-bold text-gray-900">{user.emergencyContact}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QR Modal */}
      <AnimatePresence>
        {showQR && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-medical-blue/20 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-panel rounded-[40px] p-10 max-w-sm w-full text-center relative shadow-2xl"
            >
              <button onClick={() => setShowQR(false)} className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X className="h-6 w-6 text-text-muted" />
              </button>
              <h3 className="text-3xl font-black text-medical-blue tracking-tighter mb-2">Health ID</h3>
              <p className="text-text-muted font-medium mb-8">Instant record access for facilities</p>
              
              <div className="bg-white p-6 rounded-[32px] shadow-soft inline-block mb-8 border-4 border-medical-blue/5">
                <QRCode value={`HEALTH ID: ${user.id}\nNAME: ${user.name}\nBLOOD GROUP: ${user.bloodGroup}\nRISKS: ${history.diseases.map((d: any) => d.name).join(', ') || 'None'}`} size={200} />
              </div>

              <div className="text-left space-y-4 bg-slate-50 p-6 rounded-[24px]">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Name</span>
                  <span className="text-sm font-bold text-text-dark">{user.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Blood Group</span>
                  <span className="text-sm font-bold text-alert-red">{user.bloodGroup}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Verified Risks</span>
                  <span className="text-sm font-bold text-text-dark">{history.diseases.length} Identified</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {editingProfile && (
          <EditProfileModal user={user} onClose={() => setEditingProfile(false)} onUpdate={() => { setEditingProfile(false); window.location.reload(); }} />
        )}
      </AnimatePresence>

      <FilePreview file={previewFile} onClose={() => setPreviewFile(null)} />
    </div>
  );
}

function TabButton({ active, onClick, label, icon }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-8 py-3 rounded-[16px] text-sm font-bold transition-all ${
        active 
          ? 'bg-white text-medical-blue shadow-sm' 
          : 'text-text-muted hover:text-text-dark'
      }`}
    >
      {React.cloneElement(icon, { className: 'h-4 w-4' })}
      {label}
    </button>
  );
}

function StatCard({ title, value, icon, color }: any) {
  return (
    <div className="card-premium flex items-center justify-between p-6">
      <div>
        <p className="text-xs font-black text-text-muted uppercase tracking-widest mb-1">{title}</p>
        <p className="text-2xl font-black text-medical-blue tracking-tighter">{value}</p>
      </div>
      <div className={`h-12 w-12 ${color} rounded-xl flex items-center justify-center`}>
        {icon}
      </div>
    </div>
  );
}

function MedicationCard({ med }: any) {
  const isActive = med.status === 'active';
  return (
    <div className={`card-premium p-6 ${!isActive ? 'opacity-60 grayscale' : ''}`}>
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${isActive ? 'bg-medical-blue/10 text-medical-blue' : 'bg-slate-100 text-text-muted'}`}>
            <Pill className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-lg font-black text-text-dark tracking-tight">{med.name}</h4>
            <p className="text-sm text-text-muted font-medium">{med.dosage} <span className="opacity-50">•</span> {med.frequency}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isActive ? 'bg-medical-blue text-white' : 'bg-slate-200 text-text-muted'}`}>
          {med.status}
        </span>
      </div>
      <div className="flex items-center gap-2 text-[10px] text-text-muted font-black uppercase tracking-widest">
        <Clock className="h-3 w-3" />
        Started {format(new Date(med.startDate), 'PP')}
      </div>
    </div>
  );
}

function TimelineItem({ visit, reports, medications, diseases, onPreview }: any) {
  return (
    <div className="relative">
      <div className="absolute -left-[41px] top-0 h-6 w-6 gradient-blue-teal rounded-full border-4 border-white shadow-lg shadow-medical-blue/20" />
      <div className="card-premium">
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm font-black text-medical-blue uppercase tracking-widest">{format(new Date(visit.visit.date), 'MMMM yyyy')}</span>
          <span className="text-xs text-text-muted font-medium">{format(new Date(visit.visit.date), 'PPP')}</span>
        </div>
        <h4 className="text-2xl font-black text-text-dark mb-2 tracking-tight">{visit.hospitalName}</h4>
        <p className="text-text-muted font-medium mb-8 leading-relaxed">{visit.visit.diagnosis}</p>
        
        <div className="space-y-8 pt-8 border-t border-slate-50">
          {medications.length > 0 && (
            <div className="space-y-4">
              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Prescribed Medications</p>
              <div className="flex flex-wrap gap-3">
                {medications.map((m: any) => (
                  <div key={m.id} className="flex items-center gap-2 px-4 py-2 bg-medical-blue/5 rounded-xl text-xs font-bold text-medical-blue border border-medical-blue/10">
                    <Pill className="h-3 w-3" />
                    {m.name} <span className="opacity-50">•</span> {m.dosage}
                  </div>
                ))}
              </div>
            </div>
          )}

          {diseases.length > 0 && (
            <div className="space-y-4">
              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Identified Risks</p>
              <div className="flex flex-wrap gap-3">
                {diseases.map((d: any) => (
                  <div key={d.id} className="flex items-center gap-2 px-4 py-2 bg-alert-yellow/5 rounded-xl text-xs font-bold text-alert-yellow border border-alert-yellow/10">
                    <AlertCircle className="h-3 w-3" />
                    {d.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {reports.length > 0 && (
            <div className="space-y-4">
              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Reports & Lab Results</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reports.map((r: any) => (
                  <div key={r.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group hover:bg-medical-blue/5 transition-all border border-transparent hover:border-medical-blue/10">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-text-muted group-hover:text-medical-blue" />
                      <span className="text-sm font-bold text-text-dark group-hover:text-medical-blue transition-colors">{r.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => onPreview(r)}
                        className="p-2 text-text-muted hover:text-medical-blue transition-colors"
                        title="Preview"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </button>
                      <a 
                        href={r.fileUrl} 
                        download={r.title}
                        className="p-2 text-text-muted hover:text-medical-blue transition-colors"
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="p-16 text-center bg-slate-50/50 rounded-[32px] border-2 border-dashed border-slate-100">
      <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-soft">
        <Activity className="h-8 w-8 text-slate-200" />
      </div>
      <p className="text-text-muted font-medium">{message}</p>
    </div>
  );
}

function EditProfileModal({ user, onClose, onUpdate }: any) {
  const [formData, setFormData] = useState({
    name: user.name,
    age: user.age,
    emergencyContact: user.emergencyContact,
    bloodGroup: user.bloodGroup,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/patient/profile', formData);
      onUpdate();
    } catch (error) {
      console.error('Update failed', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-medical-blue/20 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="glass-panel rounded-[40px] p-10 max-w-md w-full shadow-2xl"
      >
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-3xl font-black text-medical-blue tracking-tighter">Edit Profile</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="h-6 w-6 text-text-muted" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-text-muted uppercase tracking-widest ml-2">Full Name</label>
            <input 
              type="text" 
              className="input-premium" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-text-muted uppercase tracking-widest ml-2">Age</label>
              <input 
                type="number" 
                className="input-premium" 
                value={formData.age} 
                onChange={e => setFormData({...formData, age: parseInt(e.target.value)})} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-text-muted uppercase tracking-widest ml-2">Blood Group</label>
              <select 
                className="input-premium appearance-none" 
                value={formData.bloodGroup} 
                onChange={e => setFormData({...formData, bloodGroup: e.target.value})}
              >
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-text-muted uppercase tracking-widest ml-2">Emergency Contact</label>
            <input 
              type="tel" 
              className="input-premium" 
              value={formData.emergencyContact} 
              onChange={e => setFormData({...formData, emergencyContact: e.target.value})} 
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 pill-button bg-slate-100 text-text-muted hover:bg-slate-200"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className="flex-1 pill-button gradient-blue-teal text-white shadow-xl shadow-medical-blue/20 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
