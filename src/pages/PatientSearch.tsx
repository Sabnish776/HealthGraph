import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { 
  Search, Phone, User, Heart, Calendar, 
  History, Plus, Pill, FileText, Loader2,
  ChevronLeft, ArrowRight, AlertCircle, CheckCircle2,
  Upload, X, Download, Activity, Clock, ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import { useDropzone } from 'react-dropzone';
import { useSearchParams } from 'react-router-dom';
import FilePreview from '../components/FilePreview';

export default function PatientSearch() {
  const [searchParams] = useSearchParams();
  const [mobile, setMobile] = useState('');
  const [patient, setPatient] = useState<any>(null);
  const [history, setHistory] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [view, setView] = useState<'search' | 'profile' | 'add-visit'>('search');
  const [previewFile, setPreviewFile] = useState<any>(null);

  useEffect(() => {
    const mobileParam = searchParams.get('mobile');
    if (mobileParam && mobileParam.length === 10) {
      setMobile(mobileParam);
      const autoSearch = async () => {
        setLoading(true);
        try {
          const { data } = await api.get(`/hospital/search-patient?mobile=${mobileParam}`);
          setPatient(data);
          const historyRes = await api.get(`/patient/history?patientId=${data.id}`);
          setHistory(historyRes.data);
          setView('profile');
        } catch (err) {
          setError('Patient not found');
        } finally {
          setLoading(false);
        }
      };
      autoSearch();
    }
  }, [searchParams]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get(`/hospital/search-patient?mobile=${mobile}`);
      setPatient(data);
      const historyRes = await api.get(`/patient/history?patientId=${data.id}`);
      setHistory(historyRes.data);
      setView('profile');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Patient not found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-mesh min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatePresence mode="wait">
          {view === 'search' && (
            <motion.div 
              key="search"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-3xl mx-auto mt-12"
            >
              <div className="text-center mb-16">
                <div className="inline-flex items-center justify-center h-24 w-24 gradient-blue-teal rounded-[32px] mb-8 shadow-2xl shadow-medical-blue/20">
                  <Search className="h-10 w-10 text-white" />
                </div>
                <h1 className="text-6xl font-black text-medical-blue mb-6 tracking-tighter leading-none">Patient Intelligence</h1>
                <p className="text-text-muted text-xl font-medium">Access unified medical records via mobile number</p>
              </div>

              <form onSubmit={handleSearch} className="relative">
                <div className="relative group">
                  <Phone className="absolute left-8 top-1/2 -translate-y-1/2 h-8 w-8 text-slate-300 group-focus-within:text-medical-blue transition-colors" />
                  <input
                    type="tel"
                    required
                    placeholder="Enter 10 digit mobile"
                    className="w-full pl-20 pr-44 py-8 bg-white border-4 border-slate-50 rounded-[32px] focus:border-medical-blue focus:ring-0 transition-all text-4xl font-black tracking-tighter shadow-2xl shadow-slate-100 outline-none"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  />
                  <button
                    type="submit"
                    disabled={loading || mobile.length !== 10}
                    className="absolute right-4 top-1/2 -translate-y-1/2 px-10 py-5 gradient-blue-teal text-white rounded-[24px] font-black text-sm uppercase tracking-widest disabled:opacity-50 transition-all shadow-xl shadow-medical-blue/20"
                  >
                    {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Search'}
                  </button>
                </div>
                {error && (
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 text-center text-alert-red font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2"
                  >
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </motion.p>
                )}
              </form>
            </motion.div>
          )}

          {view === 'profile' && patient && (
            <motion.div 
              key="profile"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <button 
                onClick={() => setView('search')}
                className="flex items-center gap-3 text-text-muted font-black text-xs uppercase tracking-widest mb-12 hover:text-medical-blue transition-colors group"
              >
                <ChevronLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                Back to Search
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* Patient Summary Card */}
                <div className="lg:col-span-1 space-y-8">
                  <div className="card-premium p-10">
                    <div className="text-center mb-10">
                      <div className="h-24 w-24 bg-medical-blue/5 rounded-[32px] flex items-center justify-center mx-auto mb-6 border border-medical-blue/10">
                        <User className="h-12 w-12 text-medical-blue" />
                      </div>
                      <h2 className="text-3xl font-black text-medical-blue tracking-tighter">{patient.name}</h2>
                      <p className="text-text-muted font-bold tracking-widest text-xs mt-2 uppercase">{patient.mobile}</p>
                    </div>

                    <div className="space-y-6">
                      <InfoRow label="Age" value={`${patient.age} Yrs`} />
                      <InfoRow label="Gender" value={patient.gender} />
                      <InfoRow label="Blood Group" value={patient.bloodGroup} color="text-alert-red" />
                      <InfoRow label="Emergency" value={patient.emergencyContact} />
                    </div>

                    <button 
                      onClick={() => setView('add-visit')}
                      className="w-full mt-10 pill-button gradient-blue-teal text-white shadow-2xl shadow-medical-blue/20 flex items-center justify-center gap-3"
                    >
                      <Plus className="h-5 w-5" />
                      Record Visit
                    </button>
                  </div>

                  <div className="card-premium bg-alert-yellow/5 border-alert-yellow/10">
                    <h3 className="font-black text-alert-yellow mb-6 flex items-center gap-3 uppercase tracking-widest text-xs">
                      <AlertCircle className="h-5 w-5" />
                      Prone Diseases
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {history.diseases.filter((d: any) => d.status === 'prone').map((d: any) => (
                        <span key={d.id} className="px-4 py-2 bg-white text-alert-yellow rounded-full text-xs font-bold border border-alert-yellow/20">
                          {d.name}
                        </span>
                      ))}
                      {history.diseases.filter((d: any) => d.status === 'prone').length === 0 && (
                        <p className="text-sm text-text-muted italic">No risks identified</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* History Tabs */}
                <div className="lg:col-span-3 space-y-12">
                  <div className="card-premium">
                    <h3 className="text-2xl font-black text-medical-blue mb-10 flex items-center gap-4">
                      <History className="h-6 w-6" />
                      Unified Medical History
                    </h3>
                    
                    <div className="relative pl-8 border-l-2 border-slate-100 space-y-12 ml-4">
                      {history.visits.map((v: any) => (
                        <div key={v.visit.id} className="relative">
                          <div className="absolute -left-[41px] top-0 h-6 w-6 bg-medical-blue rounded-full border-4 border-white shadow-lg shadow-medical-blue/20" />
                          <div className="bg-slate-50/50 rounded-[24px] p-8 border border-slate-100">
                            <div className="mb-6 flex justify-between items-start">
                              <div>
                                <h4 className="text-xl font-black text-text-dark tracking-tight">{v.hospitalName}</h4>
                                <p className="text-xs text-text-muted font-bold uppercase tracking-widest mt-1">{format(new Date(v.visit.date), 'PPP')}</p>
                              </div>
                              <span className="px-3 py-1 bg-medical-blue/10 text-medical-blue rounded-full text-[10px] font-black uppercase tracking-widest">VISITED</span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                              <div>
                                <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Reason</p>
                                <p className="text-sm font-medium text-text-dark leading-relaxed">{v.visit.reason}</p>
                              </div>
                              <div>
                                <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Diagnosis</p>
                                <p className="text-sm font-medium text-text-dark leading-relaxed">{v.visit.diagnosis}</p>
                              </div>
                            </div>
                            
                            {v.visit.notes && (
                              <div className="mb-8 p-4 bg-white rounded-xl border border-slate-100 italic text-sm text-text-muted">
                                "{v.visit.notes}"
                              </div>
                            )}
                            
                            <div className="space-y-6 pt-6 border-t border-slate-100">
                              {/* Visit Medications */}
                              {history.medications.filter((m: any) => m.visitId === v.visit.id).length > 0 && (
                                <div className="space-y-3">
                                  <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Prescribed Medications</p>
                                  <div className="flex flex-wrap gap-3">
                                    {history.medications.filter((m: any) => m.visitId === v.visit.id).map((m: any) => (
                                      <div key={m.id} className="flex items-center gap-2 px-4 py-2 bg-medical-blue/5 rounded-xl text-xs font-bold text-medical-blue border border-medical-blue/10">
                                        <Pill className="h-3 w-3" />
                                        {m.name} <span className="opacity-50">•</span> {m.dosage}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Visit Reports */}
                              {history.reports.filter((r: any) => r.visitId === v.visit.id).length > 0 && (
                                <div className="space-y-3">
                                  <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Attached Reports</p>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {history.reports.filter((r: any) => r.visitId === v.visit.id).map((r: any) => (
                                      <button 
                                        key={r.id}
                                        onClick={() => setPreviewFile(r)}
                                        className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 group hover:border-medical-blue transition-all"
                                      >
                                        <div className="flex items-center gap-3">
                                          <FileText className="h-4 w-4 text-text-muted group-hover:text-medical-blue" />
                                          <span className="text-sm font-bold text-text-dark group-hover:text-medical-blue truncate">{r.title}</span>
                                        </div>
                                        <ExternalLink className="h-4 w-4 text-text-muted group-hover:text-medical-blue" />
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      {history.visits.length === 0 && <EmptyState message="No previous visits found" />}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="card-premium">
                        <h3 className="text-xl font-black text-medical-blue mb-8 flex items-center gap-3">
                          <Pill className="h-5 w-5" />
                          Active Medications
                        </h3>
                        <div className="space-y-4">
                          {history.medications.filter((m: any) => m.status === 'active').map((m: any) => (
                            <div key={m.id} className="p-4 bg-medical-blue/5 rounded-2xl flex justify-between items-center border border-medical-blue/10">
                              <div>
                                <p className="text-sm font-bold text-text-dark">{m.name}</p>
                                <p className="text-xs text-text-muted font-medium">{m.dosage} • {m.frequency}</p>
                              </div>
                              <button 
                                onClick={async () => {
                                  await api.put('/hospital/update-medication', { medicationId: m.id, status: 'revoked', endDate: new Date() });
                                  const h = await api.get(`/patient/history?patientId=${patient.id}`);
                                  setHistory(h.data);
                                }}
                                className="text-[10px] font-black text-alert-red hover:underline uppercase tracking-widest"
                              >
                                Revoke
                              </button>
                            </div>
                          ))}
                          {history.medications.filter((m: any) => m.status === 'active').length === 0 && (
                            <p className="text-sm text-text-muted italic">No active medications</p>
                          )}
                        </div>
                      </div>

                      <div className="card-premium">
                        <h3 className="text-xl font-black text-medical-blue mb-8 flex items-center gap-3">
                          <AlertCircle className="h-5 w-5" />
                          Active Risks
                        </h3>
                        <div className="space-y-4">
                          {history.diseases.filter((d: any) => d.status === 'active' || d.status === 'prone').map((d: any) => (
                            <div key={d.id} className="p-4 bg-alert-yellow/5 rounded-2xl flex justify-between items-center border border-alert-yellow/10">
                              <div>
                                <p className="text-sm font-bold text-text-dark">{d.name}</p>
                                <p className="text-[10px] font-black text-alert-yellow uppercase tracking-widest">{d.status}</p>
                              </div>
                              <button 
                                onClick={async () => {
                                  await api.put('/hospital/update-disease', { diseaseId: d.id, status: 'resolved' });
                                  const h = await api.get(`/patient/history?patientId=${patient.id}`);
                                  setHistory(h.data);
                                }}
                                className="text-[10px] font-black text-health-green hover:underline uppercase tracking-widest"
                              >
                                Resolve
                              </button>
                            </div>
                          ))}
                          {history.diseases.filter((d: any) => d.status === 'active' || d.status === 'prone').length === 0 && (
                            <p className="text-sm text-text-muted italic">No active risks</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="card-premium">
                      <h3 className="text-xl font-black text-medical-blue mb-8 flex items-center gap-3">
                        <FileText className="h-5 w-5" />
                        Recent Reports
                      </h3>
                      <div className="space-y-4">
                        {history.reports.slice(0, 3).map((r: any) => (
                          <div key={r.id} className="p-4 bg-slate-50 rounded-2xl flex items-center gap-4 group cursor-pointer hover:bg-medical-blue/5 transition-colors">
                            <FileText className="h-5 w-5 text-text-muted group-hover:text-medical-blue" />
                            <span className="text-sm font-bold text-text-dark group-hover:text-medical-blue">{r.title}</span>
                          </div>
                        ))}
                        {history.reports.length === 0 && (
                          <p className="text-sm text-text-muted italic">No reports found</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'add-visit' && patient && (
            <AddVisitForm 
              patient={patient} 
              onBack={() => setView('profile')} 
              onSuccess={async () => {
                const historyRes = await api.get(`/patient/history?patientId=${patient.id}`);
                setHistory(historyRes.data);
                setView('profile');
              }} 
            />
          )}
        </AnimatePresence>
      </div>

      <FilePreview file={previewFile} onClose={() => setPreviewFile(null)} />
    </div>
  );
}

function InfoRow({ label, value, color = 'text-text-dark' }: any) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0">
      <span className="text-xs font-black text-text-muted uppercase tracking-widest">{label}</span>
      <span className={`text-sm font-bold ${color}`}>{value}</span>
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

function AddVisitForm({ patient, onBack, onSuccess }: any) {
  const [formData, setFormData] = useState({
    reason: '',
    diagnosis: '',
    notes: '',
    medications: [] as any[],
    diseases: [] as any[],
    reports: [] as any[],
  });
  const [newMed, setNewMed] = useState({ name: '', dosage: '', frequency: '' });
  const [newDisease, setNewDisease] = useState({ name: '', status: 'prone' });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const onDrop = async (acceptedFiles: File[]) => {
    setUploading(true);
    try {
      for (const file of acceptedFiles) {
        const uploadData = new FormData();
        uploadData.append('file', file);
        const { data } = await api.post('/upload', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setFormData(prev => ({
          ...prev,
          reports: [...prev.reports, { title: file.name, fileUrl: data.fileUrl }]
        }));
      }
    } catch (error) {
      console.error('Upload failed', error);
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop } as any);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const finalMedications = [...formData.medications];
    if (newMed.name) finalMedications.push(newMed);

    const finalDiseases = [...formData.diseases];
    if (newDisease.name) finalDiseases.push(newDisease);

    const payload = {
      patientId: patient.id,
      ...formData,
      medications: finalMedications,
      diseases: finalDiseases
    };

    try {
      await api.post('/hospital/add-visit', payload);
      onSuccess();
    } catch (error) {
      console.error('Failed to add visit', error);
    } finally {
      setLoading(false);
    }
  };

  const addMed = () => {
    if (newMed.name) {
      setFormData({ ...formData, medications: [...formData.medications, newMed] });
      setNewMed({ name: '', dosage: '', frequency: '' });
    }
  };

  const addDisease = () => {
    if (newDisease.name) {
      setFormData({ ...formData, diseases: [...formData.diseases, newDisease] });
      setNewDisease({ name: '', status: 'prone' });
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-3 text-text-muted font-black text-xs uppercase tracking-widest mb-12 hover:text-medical-blue transition-colors group">
        <ChevronLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
        Back to Profile
      </button>

      <div className="card-premium p-12">
        <h2 className="text-4xl font-black text-medical-blue mb-12 tracking-tighter">Record Consultation</h2>
        
        <form onSubmit={handleSubmit} className="space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-xs font-black text-text-muted uppercase tracking-widest ml-2">Reason for Visit</label>
                <input 
                  type="text" required className="input-premium" 
                  value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-text-muted uppercase tracking-widest ml-2">Diagnosis</label>
                <input 
                  type="text" required className="input-premium" 
                  value={formData.diagnosis} onChange={e => setFormData({...formData, diagnosis: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-text-muted uppercase tracking-widest ml-2">Clinical Notes</label>
                <textarea 
                  className="input-premium min-h-[160px] resize-none" 
                  value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-8">
              {/* Meds Section */}
              <div className="bg-medical-blue/5 p-8 rounded-[32px] border border-medical-blue/10">
                <h4 className="text-sm font-black text-medical-blue mb-6 flex items-center gap-3 uppercase tracking-widest">
                  <Pill className="h-5 w-5" />
                  Prescribe Medications
                </h4>
                <div className="space-y-3 mb-6">
                  {formData.medications.map((m, i) => (
                    <div key={i} className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                      <span className="text-sm font-bold text-text-dark">{m.name} <span className="text-text-muted opacity-50">•</span> {m.dosage}</span>
                      <button type="button" onClick={() => setFormData({...formData, medications: formData.medications.filter((_, idx) => idx !== i)})} className="text-alert-red p-1">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <input 
                    placeholder="Med Name" 
                    className="px-4 py-3 bg-white rounded-xl text-sm font-medium border border-slate-100 focus:border-medical-blue outline-none" 
                    value={newMed.name} 
                    onChange={e => setNewMed({...newMed, name: e.target.value})}
                  />
                  <input 
                    placeholder="Dosage" 
                    className="px-4 py-3 bg-white rounded-xl text-sm font-medium border border-slate-100 focus:border-medical-blue outline-none" 
                    value={newMed.dosage} 
                    onChange={e => setNewMed({...newMed, dosage: e.target.value})}
                  />
                </div>
                <div className="flex flex-wrap gap-4">
                  <input 
                    placeholder="Frequency (e.g. 1-0-1)" 
                    className="flex-grow min-w-[200px] px-4 py-3 bg-white rounded-xl text-sm font-medium border border-slate-100 focus:border-medical-blue outline-none" 
                    value={newMed.frequency} 
                    onChange={e => setNewMed({...newMed, frequency: e.target.value})}
                  />
                  <button type="button" onClick={addMed} className="bg-medical-blue text-white p-3 rounded-xl hover:bg-medical-blue/90 transition-all shadow-lg shadow-medical-blue/20 flex-shrink-0">
                    <Plus className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Diseases Section */}
              <div className="bg-alert-yellow/5 p-8 rounded-[32px] border border-alert-yellow/10">
                <h4 className="text-sm font-black text-alert-yellow mb-6 flex items-center gap-3 uppercase tracking-widest">
                  <AlertCircle className="h-5 w-5" />
                  Identify Risks
                </h4>
                <div className="space-y-3 mb-6">
                  {formData.diseases.map((d, i) => (
                    <div key={i} className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                      <span className="text-sm font-bold text-text-dark">{d.name} <span className="text-text-muted opacity-50">•</span> {d.status}</span>
                      <button type="button" onClick={() => setFormData({...formData, diseases: formData.diseases.filter((_, idx) => idx !== i)})} className="text-alert-red p-1">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-4">
                  <input 
                    placeholder="Disease Name" 
                    className="flex-grow min-w-[200px] px-4 py-3 bg-white rounded-xl text-sm font-medium border border-slate-100 focus:border-medical-blue outline-none" 
                    value={newDisease.name} 
                    onChange={e => setNewDisease({...newDisease, name: e.target.value})}
                  />
                  <select className="px-4 py-3 bg-white rounded-xl text-sm font-bold border border-slate-100 outline-none" value={newDisease.status} onChange={e => setNewDisease({...newDisease, status: e.target.value})}>
                    <option value="prone">Prone</option>
                    <option value="active">Active</option>
                  </select>
                  <button type="button" onClick={addDisease} className="bg-alert-yellow text-white p-3 rounded-xl hover:bg-alert-yellow/90 transition-all shadow-lg shadow-alert-yellow/20 flex-shrink-0">
                    <Plus className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Reports Section */}
              <div className="bg-teal-accent/5 p-8 rounded-[32px] border border-teal-accent/10">
                <h4 className="text-sm font-black text-teal-accent mb-6 flex items-center gap-3 uppercase tracking-widest">
                  <Upload className="h-5 w-5" />
                  Attach Reports
                </h4>
                
                <div className="space-y-3 mb-6">
                  {formData.reports.map((r, i) => (
                    <div key={i} className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <FileText className="h-5 w-5 text-teal-accent flex-shrink-0" />
                        <span className="text-sm font-bold text-text-dark truncate">{r.title}</span>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => setFormData({...formData, reports: formData.reports.filter((_, idx) => idx !== i)})} 
                        className="text-alert-red p-1"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div 
                  {...getRootProps()} 
                  className={`border-4 border-dashed rounded-[24px] p-8 text-center transition-all cursor-pointer ${
                    isDragActive ? 'border-teal-accent bg-teal-accent/10' : 'border-slate-100 bg-white hover:border-teal-accent/50'
                  }`}
                >
                  <input {...getInputProps()} />
                  {uploading ? (
                    <Loader2 className="h-10 w-10 text-teal-accent animate-spin mx-auto" />
                  ) : (
                    <>
                      <Upload className="h-10 w-10 text-slate-200 mx-auto mb-4" />
                      <p className="text-xs text-text-muted font-black uppercase tracking-widest">
                        {isDragActive ? 'Drop files here' : 'Click or drag reports'}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-12 border-t border-slate-100 flex justify-end gap-6">
            <button type="button" onClick={onBack} className="pill-button bg-slate-100 text-text-muted hover:bg-slate-200">Cancel</button>
            <button 
              type="submit" 
              disabled={loading}
              className="pill-button gradient-blue-teal text-white shadow-2xl shadow-medical-blue/20 flex items-center gap-3"
            >
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <CheckCircle2 className="h-6 w-6" />}
              Save Consultation
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
