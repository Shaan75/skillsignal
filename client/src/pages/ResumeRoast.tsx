import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getResumes, roastResume } from '../services/resumeService'
import { 
  FileText, Flame, AlertTriangle, Skull, 
  Ghost, CheckCircle2, Menu, X,
  ChevronRight, TrendingDown, Brain, Sparkles, Target, Briefcase, Wand2, Map, Bot, LogOut
} from 'lucide-react'

interface Resume { _id: string; fileName: string }
interface Burn { section: string; roast: string; fix: string }
interface RoastResult {
  overallRoast: string
  roastScore: number
  burns: Burn[]
  savageLine: string
  redeeming: string
}

export default function ResumeRoast() {
  const { state, logout } = useAuth()
  const location = useLocation()
  const [resumes, setResumes] = useState<Resume[]>([])
  const [selectedId, setSelectedId] = useState('')
  const [result, setResult] = useState<RoastResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    getResumes().then(data => {
      setResumes(data.resumes)
      if (data.resumes.length > 0) setSelectedId(data.resumes[0]._id)
    })
  }, [])

  const handleRoast = async () => {
    if (!selectedId) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const data = await roastResume(selectedId)
      setResult(data)
    } catch {
      setError('The roast was too hot for our servers. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const getHeatColor = (score: number) => {
    if (score >= 70) return '#10b981' 
    if (score >= 40) return '#f59e0b' 
    return '#ef4444' 
  }

  const navItems = [
    { name: 'Dashboard', icon: Brain, path: '/dashboard' },
    { name: 'Cover Letter', icon: FileText, path: '/cover-letter' },
    { name: 'Interview Prep', icon: Sparkles, path: '/interview-prep' },
    { name: 'Job Matcher', icon: Target, path: '/job-matcher' },
    { name: 'LinkedIn Bio', icon: Briefcase, path: '/linkedin-bio' },
    { name: 'Resume Rewriter', icon: Wand2, path: '/resume-rewriter' },
    { name: 'Skill Gap', icon: Map, path: '/skill-gap' },
    { name: 'ATS Score', icon: Bot, path: '/ats-score' },
    { name: 'Resume Roast', icon: Flame, path: '/resume-roast', active: true },
  ]

  return (
    <div className="min-h-screen flex bg-[#030000] text-slate-200 font-sans selection:bg-red-500/30 overflow-hidden">
      
      {/* 1. CINEMATIC BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(220,38,38,0.12),transparent_70%)]" />
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
      </div>

      {/* 2. INTEGRATED SIDEBAR */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[90] lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={`fixed lg:static inset-y-0 left-0 z-[100] w-72 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out bg-[#08080a]/90 backdrop-blur-xl border-r border-white/5 flex flex-col p-6`}>
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/20">
              <Flame size={22} className="text-white fill-current" />
            </div>
            <span className="font-black text-xl tracking-tighter text-white uppercase">SkillSignal</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <nav className="space-y-1 flex-1 overflow-y-auto custom-scrollbar pr-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                location.pathname === item.path || item.active
                ? 'bg-red-600/10 text-red-500 border border-red-500/20' 
                : 'text-slate-500 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={18} />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="mt-6 pt-6 border-t border-white/5">
          <div className="flex items-center gap-3 px-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center text-[10px] font-bold text-red-400">
              {state.user?.name?.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{state.user?.name}</p>
              <p className="text-[10px] text-slate-500 truncate uppercase tracking-widest">{state.user?.email}</p>
            </div>
          </div>
          <button onClick={logout} className="flex items-center gap-3 w-full px-4 py-3 text-slate-500 hover:text-red-400 transition-colors text-sm font-bold rounded-xl hover:bg-red-500/5">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* 3. MAIN CONTENT */}
      <main className="flex-1 relative z-10 flex flex-col h-screen overflow-hidden">
        
        {/* MOBILE HEADER - Logo Left, Hamburguer Right */}
        <header className="lg:hidden h-16 flex items-center justify-between px-6 bg-black/50 backdrop-blur-xl border-b border-white/5 z-50">
          <div className="flex items-center gap-2">
             <Flame size={20} className="text-red-500 fill-current" />
             <span className="font-black text-lg tracking-tighter text-white uppercase">SkillSignal</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(true)} 
            className="p-2 bg-white/5 rounded-lg border border-white/10 text-white active:scale-95 transition-all"
          >
            <Menu size={24} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 custom-scrollbar">
          <div className="max-w-4xl mx-auto">
            
            {/* HERO SECTION */}
            <header className="mb-12 text-center md:text-left mt-4 md:mt-0">
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
                <Skull size={12} /> Brutal Honesty Mode
              </motion.div>
              <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-none mb-6">
                RESUME <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500">ROAST.</span>
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-lg text-slate-500 max-w-xl font-medium leading-relaxed">
                Your resume is a reflection of your career. Sometimes that reflection needs a reality check. <span className="text-red-400 italic font-bold">No mercy, just growth.</span>
              </motion.p>
            </header>

            {error && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mb-8 p-4 rounded-2xl bg-red-900/20 border border-red-500/30 text-red-400 flex items-center gap-3 text-sm font-bold">
                <AlertTriangle size={18} /> {error}
              </motion.div>
            )}

            {/* INPUT CARD */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/[0.02] border border-white/10 rounded-[40px] p-6 md:p-10 backdrop-blur-3xl mb-12 shadow-2xl relative overflow-hidden group">
               <div className="relative z-10">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-6 flex items-center gap-2">
                  <Ghost size={14} /> Feed the fire
                </h3>
                
                <div className="space-y-3 mb-8">
                  {resumes.map((r) => (
                    <button
                      key={r._id}
                      onClick={() => setSelectedId(r._id)}
                      className={`w-full text-left px-6 py-5 rounded-2xl text-sm transition-all flex items-center justify-between group border ${
                        selectedId === r._id 
                        ? 'bg-red-500/10 border-red-500/40 text-white shadow-[0_0_30px_rgba(239,68,68,0.15)]' 
                        : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10 hover:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <FileText size={20} className={selectedId === r._id ? 'text-red-500' : 'text-slate-600'} />
                        <span className="font-bold truncate text-base">{r.fileName}</span>
                      </div>
                      {selectedId === r._id && <Flame size={20} className="text-red-500 animate-pulse" />}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleRoast}
                  disabled={loading || !selectedId}
                  className="w-full relative group h-20 rounded-[2rem] font-black text-white text-base tracking-[0.2em] transition-all disabled:opacity-50 overflow-hidden shadow-2xl shadow-red-900/20"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 group-hover:scale-105 transition-transform duration-500" />
                  <div className="relative flex items-center justify-center gap-4">
                    {loading ? (
                      <motion.div className="w-6 h-6 rounded-full border-2 border-white/30 border-t-white" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
                    ) : (
                      <Flame size={24} />
                    )}
                    <span>{loading ? 'SCORCHING...' : 'ROAST MY RESUME'}</span>
                  </div>
                </button>
              </div>
            </motion.div>

            {/* RESULTS */}
            <AnimatePresence mode="wait">
              {result && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10 pb-24">
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    className="relative p-12 md:p-20 rounded-[50px] bg-gradient-to-br from-red-600/20 to-orange-600/10 border border-red-500/30 text-center shadow-2xl"
                  >
                    <span className="text-red-500 font-black uppercase tracking-[0.5em] text-[11px] mb-8 block">The Verdict</span>
                    <h2 className="text-3xl md:text-6xl font-black text-white leading-tight italic tracking-tighter italic">
                      "{result.savageLine}"
                    </h2>
                  </motion.div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-4 bg-white/[0.03] border border-white/10 rounded-[3rem] p-10 flex flex-col items-center justify-center text-center">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6">Survival Chance</h4>
                      <div className="text-8xl font-black mb-2" style={{ color: getHeatColor(result.roastScore), textShadow: `0 0 40px ${getHeatColor(result.roastScore)}40` }}>
                        {result.roastScore}
                      </div>
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Score / 100</div>
                    </div>
                    <div className="lg:col-span-8 bg-white/[0.03] border border-white/10 rounded-[3rem] p-10 flex flex-col justify-center italic text-xl text-slate-400 font-medium">
                      "{result.overallRoast}"
                    </div>
                  </div>

                  <div className="space-y-6">
                    {result.burns.map((burn, i) => (
                      <motion.div key={i} className="bg-[#08080a] border border-white/5 rounded-[3rem] p-8 md:p-12 hover:border-red-500/30 transition-all group">
                        <div className="flex flex-col md:flex-row gap-10">
                          <div className="md:w-1/2">
                            <span className="text-[10px] font-black text-red-500 uppercase tracking-widest block mb-4">{burn.section}</span>
                            <p className="text-2xl font-bold text-white leading-tight group-hover:text-red-500 transition-colors">"{burn.roast}"</p>
                          </div>
                          <div className="md:w-1/2 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl p-8 relative">
                            <p className="text-base text-emerald-400/90 font-medium leading-relaxed">{burn.fix}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="flex justify-center pt-12">
                    <Link to="/resume-rewriter" className="px-10 py-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-base font-bold text-white flex items-center gap-3">
                      Repair Your Resume <ChevronRight size={20} />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!result && !loading && (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-24 h-24 rounded-[2.5rem] bg-white/[0.03] flex items-center justify-center mb-8 border border-white/10">
                  <Flame size={40} className="text-slate-800" />
                </div>
                <h3 className="text-2xl font-black text-slate-500 uppercase tracking-widest uppercase">Awaiting Sacrifice</h3>
              </div>
            )}
          </div>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(239, 68, 68, 0.2); }
      `}</style>
    </div>
  )
}