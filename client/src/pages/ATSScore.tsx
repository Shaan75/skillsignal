import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { getResumes, generateATSScore } from '../services/resumeService'
import { 
  FileText, Zap, LogOut, Brain, Sparkles, Target, Briefcase, 
  Wand2, Map, Bot, CheckCircle, XCircle, AlertCircle, Flame,
  Menu, X, ChevronRight, Activity, Terminal
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

interface Resume { _id: string; fileName: string }
interface ATSResult {
  atsScore: number
  verdict: string
  sections: {
    contactInfo: boolean
    summary: boolean
    experience: boolean
    education: boolean
    skills: boolean
    projects: boolean
  }
  keywordDensity: number
  formatIssues: string[]
  missingKeywords: string[]
  detectedKeywords: string[]
  improvements: string[]
  whatBotSees: string
}

export default function ATSScore() {
  const { state, logout } = useAuth()
  const location = useLocation()
  const [resumes, setResumes] = useState<Resume[]>([])
  const [selectedId, setSelectedId] = useState('')
  const [result, setResult] = useState<ATSResult | null>(null)
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
    if (!selectedId) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const data = await generateATSScore(selectedId)
      setResult(data)
    } catch {
      setError('Failed to generate ATS score')
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981'
    if (score >= 60) return '#f59e0b'
    return '#ef4444'
  }

  const sectionLabels: Record<string, string> = {
    contactInfo: 'Contact Info',
    summary: 'Summary',
    experience: 'Experience',
    education: 'Education',
    skills: 'Skills',
    projects: 'Projects',
  }

  const navItems = [
    { name: 'Dashboard', icon: Brain, path: '/dashboard' },
    { name: 'Cover Letter', icon: FileText, path: '/cover-letter' },
    { name: 'Interview Prep', icon: Sparkles, path: '/interview-prep' },
    { name: 'Job Matcher', icon: Target, path: '/job-matcher' },
    { name: 'LinkedIn Bio', icon: Briefcase, path: '/linkedin-bio' },
    { name: 'Resume Rewriter', icon: Wand2, path: '/resume-rewriter' },
    { name: 'Skill Gap', icon: Map, path: '/skill-gap' },
    { name: 'ATS Score', icon: Bot, path: '/ats-score', active: true },
    { name: 'Resume Roast', icon: Flame, path: '/resume-roast' },
    
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  }

  return (
    <div className="min-h-screen flex bg-[#030305] text-slate-200 font-sans selection:bg-purple-500/30">
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-600/10 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 pointer-events-none" />
      </div>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out bg-[#08080a]/80 backdrop-blur-xl border-r border-white/5 flex flex-col p-6`}>
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Zap size={20} className="text-white fill-current" />
            </div>
            <span className="font-black text-xl tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              SkillSignal
            </span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-400">
            <X size={20} />
          </button>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-xs">
              {state.user?.name?.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-white truncate">{state.user?.name}</p>
              <p className="text-[10px] text-slate-500 truncate uppercase tracking-wider">{state.user?.email}</p>
            </div>
          </div>
        </div>

        <nav className="space-y-1.5 flex-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                item.active 
                ? 'bg-purple-600/10 text-purple-400 border border-purple-500/20' 
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={18} className={`${item.active ? 'text-purple-400' : 'group-hover:scale-110 transition-transform'}`} />
              {item.name}
              {item.active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(167,139,250,0.6)]" />}
            </Link>
          ))}
        </nav>

        <button 
          onClick={logout} 
          className="mt-6 flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-400 transition-colors text-sm font-medium rounded-xl hover:bg-red-500/5"
        >
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative z-10 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#08080a]/50 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Zap size={18} className="text-purple-500" />
            <span className="font-bold text-white">SkillSignal</span>
          </div>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-white/5 rounded-lg border border-white/10">
            <Menu size={20} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 custom-scrollbar">
          <div className="max-w-5xl mx-auto">
            
            {/* Page Header */}
            <header className="mb-12">
              <motion.div 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-purple-400 font-bold tracking-widest text-[10px] uppercase mb-3"
              >
                <Activity size={14} /> AI Diagnostics
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4"
              >
                ATS Bot <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Simulator</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-slate-400 max-w-2xl"
              >
                Instantly decode how resume screening algorithms interpret your profile.
              </motion.p>
            </header>

            {error && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3 text-sm">
                <AlertCircle size={18} /> {error}
              </motion.div>
            )}

            {/* Resume Selection Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/[0.03] border border-white/10 rounded-[32px] p-6 md:p-8 backdrop-blur-md mb-10 shadow-2xl"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                    <FileText size={16} className="text-purple-400" /> Choose active resume
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {resumes.map((r) => (
                      <button
                        key={r._id}
                        onClick={() => setSelectedId(r._id)}
                        className={`text-left px-4 py-3 rounded-2xl text-sm transition-all flex items-center justify-between group ${
                          selectedId === r._id 
                          ? 'bg-purple-600/20 border-purple-500/40 text-white ring-1 ring-purple-500/20' 
                          : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                        } border`}
                      >
                        <span className="truncate pr-2 font-medium">{r.fileName}</span>
                        {selectedId === r._id && <div className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(167,139,250,0.8)]" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="lg:pl-8 lg:border-l border-white/5">
                  <button
                    onClick={handleGenerate}
                    disabled={loading || !selectedId}
                    className="w-full lg:w-auto relative group flex items-center justify-center gap-3 px-10 py-5 rounded-2xl font-black text-white text-sm transition-all disabled:opacity-50 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 group-hover:scale-105 transition-transform duration-300" />
                    {loading ? (
                      <><motion.div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} /> <span className="relative">Analyzing...</span></>
                    ) : (
                      <><Bot size={20} className="relative group-hover:rotate-12 transition-transform" /> <span className="relative">RUN ATS SCAN</span></>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Results Section */}
            <AnimatePresence mode="wait">
              {result && (
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-6"
                >
                  {/* Top Row: Score & Bot Perspective */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <motion.div variants={itemVariants} className="lg:col-span-4 bg-white/[0.03] border border-white/10 rounded-[32px] p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-full h-1 bg-white/5" />
                      <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6">Match Probability</p>
                      <div className="relative mb-6">
                        <svg className="w-40 h-40 transform -rotate-90">
                          <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                          <motion.circle 
                            cx="80" cy="80" r="70" stroke={getScoreColor(result.atsScore)} strokeWidth="8" fill="transparent"
                            strokeDasharray={440}
                            initial={{ strokeDashoffset: 440 }}
                            animate={{ strokeDashoffset: 440 - (440 * result.atsScore) / 100 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-5xl font-black text-white" style={{ textShadow: `0 0 20px ${getScoreColor(result.atsScore)}40` }}>
                            {result.atsScore}
                          </span>
                          <span className="text-[10px] text-slate-500 font-bold">OUT OF 100</span>
                        </div>
                      </div>
                      <p className="text-sm font-bold px-4 py-2 rounded-full bg-white/5 text-white/80 border border-white/10">
                        {result.verdict}
                      </p>
                    </motion.div>

                    <motion.div variants={itemVariants} className="lg:col-span-8 bg-black/40 border border-white/10 rounded-[32px] p-8 backdrop-blur-md relative overflow-hidden">
                      <div className="flex items-center gap-2 text-cyan-400 mb-4">
                        <Terminal size={18} />
                        <span className="text-xs font-black uppercase tracking-widest">Bot Parser Output</span>
                      </div>
                      <div className="font-mono text-sm text-slate-300 leading-relaxed bg-black/40 rounded-2xl p-6 border border-white/5 h-[200px] overflow-y-auto custom-scrollbar">
                        <span className="text-purple-400 font-bold">$</span> scanning_resume_buffer...<br/>
                        <span className="text-purple-400 font-bold">$</span> entity_extraction_complete<br/><br/>
                        <span className="text-cyan-500/80">"{result.whatBotSees}"</span>
                      </div>
                      <div className="absolute bottom-4 right-8 flex items-center gap-4 opacity-50">
                        <div className="flex gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" style={{ animationDelay: '0.2s' }} />
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" style={{ animationDelay: '0.4s' }} />
                        </div>
                        <span className="text-[10px] font-mono text-green-500">SYSTEM_OPTIMAL</span>
                      </div>
                    </motion.div>
                  </div>

                  {/* Detected Sections */}
                  <motion.div variants={itemVariants} className="bg-white/[0.03] border border-white/10 rounded-[32px] p-8 shadow-xl">
                    <h4 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-3">
                      <CheckCircle size={16} className="text-purple-500" /> Structural Analysis
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                      {Object.entries(result.sections).map(([key, found]) => (
                        <div 
                          key={key} 
                          className={`flex flex-col items-center justify-center p-5 rounded-2xl border transition-all duration-300 ${
                            found 
                            ? 'bg-green-500/5 border-green-500/20 text-green-400' 
                            : 'bg-red-500/5 border-red-500/20 text-red-400'
                          }`}
                        >
                          {found ? <CheckCircle size={24} className="mb-3" /> : <XCircle size={24} className="mb-3" />}
                          <span className="text-xs font-bold text-center">{sectionLabels[key]}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Keyword Density */}
                  <motion.div variants={itemVariants} className="bg-gradient-to-br from-cyan-600/10 to-purple-600/10 border border-white/10 rounded-[32px] p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                      <div>
                        <h4 className="text-lg font-black text-white mb-1">Semantic Relevance</h4>
                        <p className="text-xs text-slate-400">Frequency of industry-specific identifiers found</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-4xl font-black text-cyan-400">{result.keywordDensity}%</span>
                        <div className="w-32 h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                          <motion.div 
                            initial={{ width: 0 }} 
                            animate={{ width: `${result.keywordDensity}%` }} 
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-cyan-500 to-purple-500" 
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {result.detectedKeywords.map((kw, i) => (
                        <span key={i} className="px-4 py-2 rounded-xl text-xs font-bold bg-white/5 text-cyan-300 border border-cyan-500/20 hover:border-cyan-500/50 transition-colors">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </motion.div>

                  {/* Critiques & Issues */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div variants={itemVariants} className="bg-red-500/5 border border-red-500/10 rounded-[32px] p-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                          <XCircle size={16} className="text-red-400" />
                        </div>
                        <h4 className="text-sm font-black uppercase tracking-widest text-red-400">Missing Keywords</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {result.missingKeywords.map((kw, i) => (
                          <span key={i} className="px-4 py-2 rounded-xl text-xs font-bold bg-red-500/10 text-red-300 border border-red-500/20">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="bg-amber-500/5 border border-amber-500/10 rounded-[32px] p-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                          <AlertCircle size={16} className="text-amber-400" />
                        </div>
                        <h4 className="text-sm font-black uppercase tracking-widest text-amber-400">Format Issues</h4>
                      </div>
                      <ul className="space-y-3">
                        {result.formatIssues.map((issue, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-slate-300 group">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0 group-hover:scale-125 transition-transform" />
                            {issue}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  </div>

                  {/* Recommendations */}
                  <motion.div variants={itemVariants} className="bg-purple-600/5 border border-purple-500/10 rounded-[32px] p-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 text-purple-500/10">
                      <Sparkles size={120} />
                    </div>
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                        <Wand2 size={20} className="text-purple-400" />
                      </div>
                      <h4 className="text-lg font-black text-white">AI Optimization Roadmap</h4>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-4">
                      {result.improvements.map((tip, i) => (
                        <motion.div 
                          key={i} 
                          whileHover={{ x: 5 }}
                          className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-purple-500/20 transition-all"
                        >
                          <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-[10px] font-bold text-purple-400 shrink-0">
                            {i + 1}
                          </div>
                          <p className="text-sm text-slate-300 leading-relaxed">{tip}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Bottom Action */}
                  <motion.div variants={itemVariants} className="flex justify-center pt-8">
                    <Link to="/resume-rewriter" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group text-sm font-bold">
                      Apply recommendations in Rewriter <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </motion.div>

                </motion.div>
              )}
            </AnimatePresence>

            {!result && !loading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-20 h-20 rounded-[2rem] bg-white/5 flex items-center justify-center mb-6 border border-white/10">
                  <Activity size={32} className="text-slate-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-400">Ready to Scan</h3>
                <p className="text-slate-600 text-sm mt-2 max-w-xs">Select your resume above to see how AI sees you.</p>
              </motion.div>
            )}

          </div>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  )
}