import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { getResumes, generateSkillGap } from '../services/resumeService'
import { 
  FileText, Zap, LogOut, Brain, Sparkles, Target, Briefcase, 
  Wand2, Map, CheckCircle, Bot, Flame, Menu, X, ChevronRight, 
  GraduationCap, Lightbulb, Compass, Search, Activity, ArrowRight
} from 'lucide-react'
import { Link } from 'react-router-dom'

interface Resume { _id: string; fileName: string }
interface MissingSkill {
  skill: string
  priority: 'High' | 'Medium' | 'Low'
  reason: string
  resource: string
}
interface RoadmapPhase {
  phase: string
  duration: string
  focus: string
  skills: string[]
}
interface SkillGapResult {
  targetJob: string
  readinessScore: number
  currentSkills: string[]
  missingSkills: MissingSkill[]
  roadmap: RoadmapPhase[]
  verdict: string
}

const priorityConfig = {
  High: { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400', glow: 'shadow-[0_0_15px_rgba(239,68,68,0.1)]' },
  Medium: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', glow: 'shadow-[0_0_15px_rgba(245,158,11,0.1)]' },
  Low: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', glow: 'shadow-[0_0_15px_rgba(16,185,129,0.1)]' },
}

export default function SkillGap() {
  const { state, logout } = useAuth()
  const [resumes, setResumes] = useState<Resume[]>([])
  const [selectedId, setSelectedId] = useState('')
  const [targetJob, setTargetJob] = useState('')
  const [result, setResult] = useState<SkillGapResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    getResumes().then(data => {
      setResumes(data.resumes)
      if (data.resumes.length > 0) setSelectedId(data.resumes[0]._id)
    })
  }, [])

  const handleGenerate = async () => {
    if (!selectedId || !targetJob.trim()) {
      setError('Please select a resume and enter a target job')
      return
    }
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const data = await generateSkillGap(selectedId, targetJob)
      setResult(data)
    } catch {
      setError('Failed to generate skill gap roadmap')
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981'
    if (score >= 60) return '#f59e0b'
    return '#ef4444'
  }

  const navItems = [
    { name: 'Dashboard', icon: Brain, path: '/dashboard' },
    { name: 'Cover Letter', icon: FileText, path: '/cover-letter' },
    { name: 'Interview Prep', icon: Sparkles, path: '/interview-prep' },
    { name: 'Job Matcher', icon: Target, path: '/job-matcher' },
    { name: 'LinkedIn Bio', icon: Briefcase, path: '/linkedin-bio' },
    { name: 'Resume Rewriter', icon: Wand2, path: '/resume-rewriter' },
    { name: 'Skill Gap', icon: Map, path: '/skill-gap', active: true },
    { name: 'ATS Score', icon: Bot, path: '/ats-score' },
    { name: 'Resume Roast', icon: Flame, path: '/resume-roast' }
  ]

  return (
    <div className="min-h-screen flex bg-[#050508] text-slate-200 font-sans selection:bg-purple-500/30">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(124,58,237,0.05),transparent_70%)]" />
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-600/10 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.01) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.01) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      {/* Sidebar Component */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden" />
        )}
      </AnimatePresence>

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-all duration-300 ease-in-out bg-[#08080a]/90 backdrop-blur-xl border-r border-white/5 flex flex-col p-6`}>
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Zap size={20} className="text-white" />
            </div>
            <span className="font-black text-xl tracking-tighter bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">SkillSignal</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-400"><X size={20} /></button>
        </div>

        <nav className="space-y-1.5 flex-1">
          {navItems.map((item) => (
            <Link key={item.name} to={item.path} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${item.active ? 'bg-purple-600/10 text-purple-400 border border-purple-500/20 shadow-[0_0_15px_rgba(124,58,237,0.1)]' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}>
              <item.icon size={18} /> {item.name}
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5">
          <div className="flex items-center gap-3 px-2 mb-6">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-cyan-500 flex items-center justify-center text-[10px] font-bold text-white uppercase">{state.user?.name?.charAt(0)}</div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{state.user?.name}</p>
              <p className="text-[10px] text-slate-500 truncate uppercase tracking-widest">{state.user?.email}</p>
            </div>
          </div>
          <button onClick={logout} className="flex items-center gap-3 w-full px-4 py-3 text-slate-500 hover:text-red-400 transition-colors text-sm font-medium rounded-xl hover:bg-red-500/5">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative z-10 flex flex-col h-screen overflow-hidden">
        {/* Mobile Nav Header */}
        <header className="lg:hidden h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#08080a]/50 backdrop-blur-md">
          <div className="flex items-center gap-2"><Zap size={18} className="text-purple-500" /><span className="font-bold text-white">SkillSignal</span></div>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-white/5 rounded-lg border border-white/10"><Menu size={20} /></button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 custom-scrollbar">
          <div className="max-w-5xl mx-auto">
            
            {/* Page Header */}
            <header className="mb-12">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 text-purple-400 font-bold tracking-[0.2em] text-[10px] uppercase mb-4">
                <Compass size={14} className="animate-spin-slow" /> Personalized Career Pathing
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-black text-white tracking-tight leading-[1.1] mb-6">
                Bridge the <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-emerald-400">Skill Gap</span>
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-lg text-slate-400 max-w-2xl leading-relaxed">
                Our AI analyzes your current resume against industry standards for your target role to generate a precise learning roadmap.
              </motion.p>
            </header>

            {error && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3 text-sm font-medium">
                <Activity size={18} /> {error}
              </motion.div>
            )}

            {/* Selection/Input Area */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/[0.02] border border-white/10 rounded-[32px] p-6 md:p-10 backdrop-blur-xl mb-12 shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
                
                {/* Resume Picker */}
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-5 flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-purple-500" /> 1. Select Active Resume
                  </h3>
                  <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                    {resumes.map((r) => (
                      <button
                        key={r._id}
                        onClick={() => setSelectedId(r._id)}
                        className={`w-full text-left px-5 py-4 rounded-2xl text-sm transition-all flex items-center justify-between group/item border ${
                          selectedId === r._id 
                          ? 'bg-purple-600/20 border-purple-500/40 text-white ring-1 ring-purple-500/20' 
                          : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:border-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-3 truncate">
                          <FileText size={16} className={selectedId === r._id ? 'text-purple-400' : 'text-slate-500'} />
                          <span className="truncate font-semibold">{r.fileName}</span>
                        </div>
                        {selectedId === r._id && <CheckCircle size={16} className="text-purple-400" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Job Title Input */}
                <div className="flex flex-col">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-5 flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-cyan-500" /> 2. Define Your Target Role
                  </h3>
                  <div className="relative group flex-1">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={20} />
                    <input
                      type="text"
                      value={targetJob}
                      onChange={e => setTargetJob(e.target.value)}
                      placeholder="e.g. Senior Software Engineer"
                      className="w-full pl-14 pr-6 py-5 h-16 bg-white/5 border border-white/10 rounded-2xl text-white font-medium outline-none focus:border-cyan-500/50 focus:ring-4 ring-cyan-500/5 transition-all text-base"
                    />
                  </div>
                  <button
                    onClick={handleGenerate}
                    disabled={loading || !selectedId || !targetJob.trim()}
                    className="mt-6 relative group h-16 rounded-2xl font-black text-white text-sm tracking-widest transition-all disabled:opacity-50 overflow-hidden shadow-xl shadow-purple-900/20"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 transition-transform group-hover:scale-105" />
                    <div className="relative flex items-center justify-center gap-3">
                      {loading ? (
                        <motion.div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
                      ) : (
                        <Map size={20} />
                      )}
                      <span>{loading ? 'CALCULATING PATH...' : 'GENERATE ROADMAP'}</span>
                    </div>
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Results Area */}
            <AnimatePresence mode="wait">
              {result && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ staggerChildren: 0.1 }} className="space-y-10 pb-20">
                  
                  {/* Top Stats */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/[0.02] border border-white/10 rounded-[32px] p-8 flex flex-col items-center justify-center text-center relative group">
                      <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6">Match Readiness</p>
                      <div className="relative mb-6">
                        <svg className="w-36 h-36 transform -rotate-90">
                          <circle cx="72" cy="72" r="64" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                          <motion.circle 
                            cx="72" cy="72" r="64" stroke={getScoreColor(result.readinessScore)} strokeWidth="8" fill="transparent"
                            strokeDasharray={402}
                            initial={{ strokeDashoffset: 402 }}
                            animate={{ strokeDashoffset: 402 - (402 * result.readinessScore) / 100 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-5xl font-black text-white">{result.readinessScore}%</span>
                          <span className="text-[10px] font-black text-slate-500 mt-1 uppercase tracking-tighter">Readiness</span>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 bg-gradient-to-br from-purple-600/10 via-transparent to-cyan-600/5 border border-white/10 rounded-[32px] p-8 md:p-10 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                          <Brain size={18} className="text-purple-400" />
                        </div>
                        <h4 className="text-xs font-black text-white uppercase tracking-widest">AI Market Analysis</h4>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">For the role of <span className="text-purple-400">{result.targetJob}</span></h2>
                      <p className="text-lg text-slate-400 leading-relaxed font-medium italic">"{result.verdict}"</p>
                    </motion.div>
                  </div>

                  {/* Skills Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Current Skills */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-emerald-500/[0.02] border border-emerald-500/10 rounded-[32px] p-8 shadow-xl">
                      <div className="flex items-center justify-between mb-8">
                        <h4 className="text-xs font-black uppercase tracking-widest text-emerald-500 flex items-center gap-2">
                          <CheckCircle size={18} /> Found Assets
                        </h4>
                        <span className="text-[10px] font-bold text-emerald-500/50 uppercase tracking-tighter bg-emerald-500/5 px-2 py-1 rounded-md">{result.currentSkills.length} SKILLS FOUND</span>
                      </div>
                      <div className="flex flex-wrap gap-2.5">
                        {result.currentSkills.map((skill, i) => (
                          <span key={i} className="px-5 py-2.5 rounded-2xl text-[13px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 hover:border-emerald-500/30 transition-all cursor-default">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </motion.div>

                    {/* Missing Skills */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white/[0.02] border border-white/10 rounded-[32px] p-8">
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-8 flex items-center gap-2">
                        <Sparkles size={18} className="text-purple-400" /> Skills to Acquire
                      </h4>
                      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {result.missingSkills.map((skill, i) => {
                          const cfg = priorityConfig[skill.priority] || priorityConfig.Medium
                          return (
                            <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-5 hover:bg-white/[0.08] transition-all group/card">
                              <div className="flex items-center gap-3 mb-3">
                                <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${cfg.bg} ${cfg.text} border ${cfg.border} ${cfg.glow}`}>
                                  {skill.priority} Priority
                                </span>
                                <h5 className="text-white font-bold text-base">{skill.skill}</h5>
                              </div>
                              <p className="text-xs text-slate-400 leading-relaxed mb-4">{skill.reason}</p>
                              <div className="flex items-center gap-2 text-purple-400 bg-purple-500/5 p-3 rounded-xl border border-purple-500/10">
                                <Lightbulb size={14} className="shrink-0" />
                                <span className="text-[11px] font-bold italic truncate">{skill.resource}</span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </motion.div>
                  </div>

                  {/* Learning Roadmap Timeline */}
                  <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="pt-10">
                    <div className="text-center mb-12">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-400 mb-4">Strategic Execution</h4>
                      <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight">Structured Timeline</h3>
                    </div>
                    
                    <div className="relative space-y-8 before:absolute before:left-8 md:before:left-1/2 before:top-4 before:bottom-4 before:w-px before:bg-gradient-to-b before:from-purple-500/0 before:via-purple-500/20 before:to-cyan-500/0 before:-translate-x-px">
                      {result.roadmap.map((phase, i) => (
                        <motion.div 
                          key={i} 
                          initial={{ opacity: 0, y: 20 }} 
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          className={`relative flex flex-col md:flex-row items-start md:items-center ${i % 2 === 0 ? 'md:flex-row-reverse' : ''} gap-8 md:gap-0`}
                        >
                          {/* Dot */}
                          <div className="absolute left-8 md:left-1/2 top-10 md:top-1/2 w-4 h-4 rounded-full bg-slate-900 border-2 border-purple-500 z-10 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
                          
                          {/* Card Container */}
                          <div className="w-full md:w-[45%] pl-20 md:pl-0">
                            <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 md:p-10 hover:bg-white/[0.05] transition-all group relative overflow-hidden">
                              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform">
                                <GraduationCap size={80} />
                              </div>
                              <div className="flex items-center justify-between mb-4">
                                <span className="px-4 py-1 rounded-full bg-purple-500/10 text-purple-400 text-[10px] font-black uppercase tracking-widest border border-purple-500/20">{phase.duration}</span>
                              </div>
                              <h3 className="text-2xl font-black text-white mb-2">{phase.phase}</h3>
                              <p className="text-sm font-bold text-cyan-400/80 mb-6 flex items-center gap-2 uppercase tracking-tighter">
                                <Activity size={14} /> Focus: {phase.focus}
                              </p>
                              <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                                {phase.skills.map((skill, j) => (
                                  <span key={j} className="text-[11px] font-black text-slate-400 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="hidden md:block w-[10%]" />
                          <div className="hidden md:block w-[45%]" />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Final CTA */}
                  <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="flex justify-center pt-12 pb-20">
                    <Link 
                      to="/resume-rewriter" 
                      className="group flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/10 px-8 py-4 rounded-2xl transition-all"
                    >
                      <div className="text-right">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Next Step</p>
                        <p className="text-sm font-bold text-white">Refactor your resume now</p>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center group-hover:translate-x-2 transition-transform">
                        <ArrowRight size={20} className="text-white" />
                      </div>
                    </Link>
                  </motion.div>

                </motion.div>
              )}
            </AnimatePresence>

            {/* Empty State */}
            {!result && !loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-24 h-24 rounded-[3rem] bg-white/[0.03] flex items-center justify-center mb-8 border border-white/10 relative">
                  <div className="absolute inset-0 rounded-[3rem] border border-purple-500/20 animate-ping opacity-20" />
                  <Map size={40} className="text-slate-700" />
                </div>
                <h3 className="text-2xl font-black text-slate-400">Roadmap Generator</h3>
                <p className="text-slate-600 text-sm mt-3 max-w-sm leading-relaxed">Select a resume and define your target job title to visualize your career progression path.</p>
              </motion.div>
            )}

          </div>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(124,58,237,0.3); }
        .animate-spin-slow { animation: spin 8s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}