import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { uploadResume, getResumes, analyzeResume, deleteResume } from '../services/resumeService'
import { 
  Upload, Brain, TrendingUp, Sparkles, 
  Trash2, Calendar, FileText, LayoutDashboard, 
  Target, Wand2, Map, Bot, Flame, LogOut, Menu, Plus, Briefcase, AlertCircle
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

interface Resume {
  _id: string
  fileName: string
  createdAt: string
  analysis: {
    score: number
    skills: string[]
    strengths: string[]
    improvements: string[]
    summary: string
  } | null
}

export default function Dashboard() {
  const { state, logout } = useAuth()
  const location = useLocation()
  const [resumes, setResumes] = useState<Resume[]>([])
  const [uploading, setUploading] = useState(false)
  const [analyzing, setAnalyzing] = useState<string | null>(null)
  const [selected, setSelected] = useState<Resume | null>(null)
  const [error, setError] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => { fetchResumes() }, [])

  const fetchResumes = async () => {
    try {
      const data = await getResumes()
      setResumes(data.resumes)
      if (data.resumes.length > 0 && !selected) setSelected(data.resumes[0])
    } catch { setError('Failed to load resumes') }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    try {
      await uploadResume(file)
      await fetchResumes()
    } catch { setError('Upload failed') }
    finally { setUploading(false) }
  }

  const handleAnalyze = async (id: string) => {
    setAnalyzing(id)
    setError('')
    try {
      await analyzeResume(id)
      const data = await getResumes()
      const updated = data.resumes.find((r: Resume) => r._id === id)
      setResumes(data.resumes)
      if (updated) setSelected(updated)
    } catch { setError('Analysis failed') }
    finally { setAnalyzing(null) }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteResume(id)
      const newResumes = resumes.filter(r => r._id !== id)
      setResumes(newResumes)
      if (selected?._id === id) setSelected(newResumes[0] || null)
    } catch { setError('Delete failed') }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981'
    if (score >= 60) return '#f59e0b'
    return '#ef4444'
  }

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Cover Letter', icon: FileText, path: '/cover-letter' },
    { name: 'Interview Prep', icon: Sparkles, path: '/interview-prep' },
    { name: 'Job Matcher', icon: Target, path: '/job-matcher' },
    { name: 'LinkedIn Bio', icon: Briefcase, path: '/linkedin-bio' },
    { name: 'Resume Rewriter', icon: Wand2, path: '/resume-rewriter' },
    { name: 'Skill Gap', icon: Map, path: '/skill-gap' },
    { name: 'ATS Score', icon: Bot, path: '/ats-score' },
    { name: 'Resume Roast', icon: Flame, path: '/resume-roast' }
  ]

  return (
    <div className="flex h-screen bg-[#030305] text-slate-200 overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/5 blur-[120px] rounded-full" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out bg-[#08080a]/80 backdrop-blur-xl border-r border-white/5 flex flex-col p-6`}>
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Sparkles size={20} className="text-white fill-current" />
          </div>
          <span className="font-black text-xl tracking-tighter text-white">SkillSignal</span>
        </div>

        {/* Upload Button */}
        <label className="relative group cursor-pointer mb-8">
          <input type="file" className="hidden" onChange={handleUpload} accept=".pdf" disabled={uploading} />
          <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/5 border border-white/10 group-hover:bg-white/10 transition-all">
            {uploading ? (
              <motion.div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} />
            ) : (
              <Plus size={18} className="text-purple-400" />
            )}
            <span className="text-sm font-bold text-slate-200">New Resume</span>
          </div>
        </label>

        <nav className="space-y-1 flex-1 overflow-y-auto custom-scrollbar pr-2">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4 px-4">Menu</p>
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                location.pathname === item.path 
                ? 'bg-purple-600/10 text-purple-400 border border-purple-500/20 shadow-lg shadow-purple-900/10' 
                : 'text-slate-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon size={18} />
              {item.name}
            </Link>
          ))}

          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mt-8 mb-4 px-4">Your Files</p>
          {resumes.map((r) => (
            <div 
              key={r._id}
              onClick={() => { setSelected(r); setIsSidebarOpen(false); }}
              className={`flex items-center justify-between group px-4 py-3 rounded-xl cursor-pointer transition-all border ${
                selected?._id === r._id ? 'bg-white/5 border-white/10 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <FileText size={16} className={selected?._id === r._id ? 'text-cyan-400' : 'text-slate-600'} />
                <span className="text-xs font-medium truncate">{r.fileName}</span>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); handleDelete(r._id); }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </nav>

        <div className="pt-6 border-t border-white/5">
          <div className="flex items-center gap-3 px-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-500 to-cyan-500 flex items-center justify-center text-[10px] font-bold text-white">
              {state.user?.name?.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{state.user?.name}</p>
              <p className="text-[10px] text-slate-500 truncate uppercase tracking-widest">{state.user?.email}</p>
            </div>
          </div>
          <button onClick={logout} className="flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-red-400 transition-colors text-xs font-bold uppercase tracking-widest">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative z-10 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#08080a]/50 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-purple-500" />
            <span className="font-bold text-white">SkillSignal</span>
          </div>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-white/5 rounded-lg border border-white/10">
            <Menu size={20} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 custom-scrollbar">
          <div className="max-w-5xl mx-auto">
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3 font-medium">
                <AlertCircle size={18} /> {error}
              </motion.div>
            )}

            {!selected ? (
              <div className="h-[70vh] flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 rounded-[2.5rem] bg-white/[0.03] border border-white/10 flex items-center justify-center mb-8">
                  <Upload size={32} className="text-slate-600" />
                </div>
                <h1 className="text-3xl font-black text-white mb-4">No Resumes Found</h1>
                <p className="text-slate-500 max-w-sm mb-8">Upload your first resume to unlock AI-powered career insights and ATS optimization.</p>
                <label className="cursor-pointer bg-gradient-to-r from-purple-600 to-cyan-600 px-8 py-4 rounded-2xl font-black text-sm tracking-widest hover:scale-105 transition-transform shadow-xl shadow-purple-900/20">
                  <input type="file" className="hidden" onChange={handleUpload} accept=".pdf" />
                  UPLOAD NOW
                </label>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div 
                  key={selected._id} 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  {/* Hero Header */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                      <div className="flex items-center gap-2 text-purple-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                        <Calendar size={14} /> Uploaded {new Date(selected.createdAt).toLocaleDateString()}
                      </div>
                      <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">{selected.fileName}</h1>
                    </div>
                    {!selected.analysis && (
                      <button
                        onClick={() => handleAnalyze(selected._id)}
                        disabled={analyzing === selected._id}
                        className="relative group px-8 py-4 rounded-2xl font-black text-white text-xs tracking-widest overflow-hidden shadow-2xl shadow-purple-900/20"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 transition-transform group-hover:scale-105" />
                        <div className="relative flex items-center gap-2">
                          {analyzing === selected._id ? (
                            <motion.div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} />
                          ) : <Brain size={18} />}
                          {analyzing === selected._id ? 'ANALYZING...' : 'ANALYZE WITH AI'}
                        </div>
                      </button>
                    )}
                  </div>

                  {!selected.analysis ? (
                    <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-12 text-center flex flex-col items-center">
                      <div className="w-20 h-20 rounded-3xl bg-purple-600/10 flex items-center justify-center mb-6 border border-purple-500/20">
                        <Brain size={32} className="text-purple-400" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Analysis Pending</h3>
                      <p className="text-slate-500 max-w-xs leading-relaxed">Let our AI scan your document to find strengths, skills gaps, and your overall market readiness score.</p>
                    </div>
                  ) : (
                    <>
                      {/* Analysis Content */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Score Gauge */}
                        <div className="lg:col-span-4 bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 flex flex-col items-center justify-center relative overflow-hidden group">
                          <div className="absolute top-0 left-0 w-full h-1 bg-white/5" />
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-8">Ready Score</p>
                          <div className="relative mb-6">
                            <svg className="w-40 h-40 transform -rotate-90">
                              <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                              <motion.circle 
                                cx="80" cy="80" r="70" stroke={getScoreColor(selected.analysis.score)} strokeWidth="8" fill="transparent"
                                strokeDasharray={440}
                                initial={{ strokeDashoffset: 440 }}
                                animate={{ strokeDashoffset: 440 - (440 * selected.analysis.score) / 100 }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                strokeLinecap="round"
                              />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <span className="text-5xl font-black text-white">{selected.analysis.score}</span>
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Percent</span>
                            </div>
                          </div>
                        </div>

                        {/* AI Summary */}
                        <div className="lg:col-span-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10 flex flex-col justify-center">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-lg bg-cyan-500/10">
                              <TrendingUp size={20} className="text-cyan-400" />
                            </div>
                            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Executive Analysis</h4>
                          </div>
                          <p className="text-xl font-medium text-slate-300 leading-relaxed italic">
                            "{selected.analysis.summary}"
                          </p>
                        </div>
                      </div>

                      {/* Skills Badges */}
                      <div className="bg-gradient-to-br from-purple-600/5 to-cyan-600/5 border border-white/10 rounded-[2.5rem] p-8">
                        <div className="flex items-center gap-3 mb-6">
                          <Sparkles size={18} className="text-purple-400" />
                          <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 text-white">Detected Competencies</h4>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selected.analysis.skills.map((skill, i) => (
                            <motion.span 
                              key={i} 
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: i * 0.05 }}
                              className="px-4 py-2 rounded-xl text-xs font-bold bg-white/5 text-purple-300 border border-purple-500/10 hover:border-purple-500/40 transition-colors cursor-default"
                            >
                              {skill}
                            </motion.span>
                          ))}
                        </div>
                      </div>

                      {/* Strengths & Improvements */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-emerald-500/[0.02] border border-emerald-500/10 rounded-[2.5rem] p-8">
                          <h4 className="text-xs font-black text-emerald-500 uppercase tracking-[0.2em] mb-6">Core Strengths</h4>
                          <ul className="space-y-4">
                            {selected.analysis.strengths.map((s, i) => (
                              <li key={i} className="flex items-start gap-4 text-sm text-slate-300">
                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] shrink-0" />
                                {s}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-amber-500/[0.02] border border-amber-500/10 rounded-[2.5rem] p-8">
                          <h4 className="text-xs font-black text-amber-500 uppercase tracking-[0.2em] mb-6">Growth Areas</h4>
                          <ul className="space-y-4">
                            {selected.analysis.improvements.map((imp, i) => (
                              <li key={i} className="flex items-start gap-4 text-sm text-slate-300">
                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)] shrink-0" />
                                {imp}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(168, 85, 247, 0.2); }
      `}</style>
    </div>
  )
}