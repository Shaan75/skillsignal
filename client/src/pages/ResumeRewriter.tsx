import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getResumes, rewriteResume } from '../services/resumeService'
import { 
  FileText, Wand2, Sparkles, AlertCircle, ChevronRight, 
  Lightbulb, Zap, Terminal, CheckCircle2, ArrowRightLeft 
} from 'lucide-react'
import Sidebar from '../components/ui/Sidebar'

interface Resume { _id: string; fileName: string }
interface Rewrite { original: string; rewritten: string; improvement: string }
interface RewriteResult { rewrites: Rewrite[]; generalTips: string[] }

export default function ResumeRewriter() {
  const [resumes, setResumes] = useState<Resume[]>([])
  const [selectedId, setSelectedId] = useState('')
  const [result, setResult] = useState<RewriteResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getResumes().then(data => { 
      setResumes(data.resumes)
      if (data.resumes.length > 0) setSelectedId(data.resumes[0]._id) 
    })
  }, [])

  const handleRewrite = async () => {
    if (!selectedId) return
    setLoading(true)
    setError('')
    setResult(null)
    try { 
      const data = await rewriteResume(selectedId)
      setResult(data) 
    } catch { 
      setError('Failed to rewrite resume bullets. Please try again.') 
    } finally { 
      setLoading(false) 
    }
  }

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 100, damping: 15 } }
}

  return (
    <div className="min-h-screen flex bg-[#030305] text-slate-200 font-sans selection:bg-purple-500/30">
      {/* Background Visuals */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-purple-600/5 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-cyan-600/5 blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      </div>

      <Sidebar />

      <div className="relative z-10 flex-1 h-screen overflow-y-auto custom-scrollbar">
        <div className="max-w-5xl mx-auto p-4 md:p-12 pt-20 md:pt-12">
          
          {/* Header */}
          <header className="mb-12">
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              className="flex items-center gap-2 text-purple-400 font-bold tracking-[0.2em] text-[10px] uppercase mb-4"
            >
              <Zap size={14} className="fill-current" /> AI Transformation Engine
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="text-4xl md:text-6xl font-black text-white tracking-tight leading-[1.1] mb-6"
            >
              Bullet Point <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Refining.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.2 }}
              className="text-lg text-slate-400 max-w-2xl leading-relaxed"
            >
              Turn passive responsibilities into high-impact achievements using linguistic patterns preferred by top-tier recruiters.
            </motion.p>
          </header>

          {error && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3 text-sm font-medium">
              <AlertCircle size={18} /> {error}
            </motion.div>
          )}

          {/* Main Controls Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="bg-white/[0.02] border border-white/10 rounded-[32px] p-6 md:p-10 backdrop-blur-xl mb-12 shadow-2xl relative overflow-hidden"
          >
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
              <div className="lg:col-span-7">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-5 flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-purple-500" /> Select Source Document
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {resumes.map((r) => (
                    <button
                      key={r._id}
                      onClick={() => setSelectedId(r._id)}
                      className={`text-left px-5 py-4 rounded-2xl text-sm transition-all flex items-center justify-between group border ${
                        selectedId === r._id 
                        ? 'bg-purple-600/20 border-purple-500/40 text-white ring-1 ring-purple-500/20' 
                        : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3 truncate">
                        <FileText size={16} className={selectedId === r._id ? 'text-purple-400' : 'text-slate-500'} />
                        <span className="truncate font-semibold">{r.fileName}</span>
                      </div>
                      {selectedId === r._id && <div className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(167,139,250,0.8)]" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5">
                <button
                  onClick={handleRewrite}
                  disabled={loading || !selectedId}
                  className="w-full relative group h-16 rounded-2xl font-black text-white text-sm tracking-widest transition-all disabled:opacity-50 overflow-hidden shadow-xl shadow-purple-900/20"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 group-hover:scale-105 transition-transform duration-500" />
                  <div className="relative flex items-center justify-center gap-3">
                    {loading ? (
                      <motion.div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
                    ) : (
                      <Wand2 size={20} className="group-hover:rotate-12 transition-transform" />
                    )}
                    <span>{loading ? 'RE-ENGINEERING...' : 'START REWRITING'}</span>
                  </div>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Results Area */}
          <AnimatePresence mode="wait">
            {result && (
              <motion.div 
                variants={containerVariants} 
                initial="hidden" 
                animate="visible" 
                className="space-y-10"
              >
                {/* General Strategy/Tips Section */}
                <motion.div variants={cardVariants} className="bg-gradient-to-br from-cyan-600/10 to-transparent border border-cyan-500/20 rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform duration-700">
                    <Lightbulb size={120} className="text-cyan-400" />
                  </div>
                  <div className="relative z-10">
                    <h4 className="text-xs font-black text-cyan-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                      <Terminal size={16} /> Rewriting Strategy
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                      {result.generalTips.map((tip, i) => (
                        <div key={i} className="flex items-start gap-4 text-sm text-slate-300 leading-relaxed group/tip">
                          <div className="mt-1.5 w-1 h-1 rounded-full bg-cyan-400 shrink-0 group-hover/tip:scale-150 transition-transform" />
                          {tip}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Rewritten Bullets Grid */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between px-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                      <ArrowRightLeft size={14} /> Transformation Gallery
                    </h4>
                    <span className="text-[10px] font-bold text-slate-500 bg-white/5 px-2 py-1 rounded-md">
                      {result.rewrites.length} NODES OPTIMIZED
                    </span>
                  </div>

                  {result.rewrites.map((rw, i) => (
                    <motion.div 
                      key={i} 
                      variants={cardVariants} 
                      className="group bg-white/[0.02] border border-white/10 rounded-[2.5rem] overflow-hidden hover:border-white/20 transition-all shadow-xl"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-2">
                        {/* Before Side */}
                        <div className="p-8 md:p-10 border-b lg:border-b-0 lg:border-r border-white/5 relative">
                          <div className="absolute top-4 left-8 text-[10px] font-black uppercase tracking-widest text-red-500/40">Baseline</div>
                          <p className="text-slate-400 text-sm leading-relaxed mt-4 italic">"{rw.original}"</p>
                        </div>
                        
                        {/* After Side */}
                        <div className="p-8 md:p-10 bg-gradient-to-br from-emerald-500/[0.03] to-transparent relative">
                          <div className="absolute top-4 left-8 text-[10px] font-black uppercase tracking-widest text-emerald-400/60">Optimized</div>
                          <div className="mt-4 flex items-start gap-4">
                            <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-1" />
                            <p className="text-white text-base md:text-lg font-bold leading-tight tracking-tight">
                              {rw.rewritten}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Analysis Logic */}
                      <div className="px-8 md:px-10 py-5 bg-white/[0.02] border-t border-white/5 flex items-center gap-3">
                        <Sparkles size={14} className="text-purple-400" />
                        <span className="text-xs font-medium text-purple-400/80">
                          <span className="font-black uppercase tracking-tighter mr-2">Reasoning:</span>
                          {rw.improvement}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Bottom Action */}
                <motion.div variants={cardVariants} className="flex justify-center pb-20 pt-10">
                  <p className="text-slate-500 text-sm flex items-center gap-2">
                    Happy with these? <span className="text-white font-bold cursor-pointer hover:text-purple-400 transition-colors underline decoration-purple-500/50 underline-offset-4">Copy all to clipboard</span>
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty State */}
          {!result && !loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-24 h-24 rounded-[3rem] bg-white/[0.03] flex items-center justify-center mb-8 border border-white/10 group">
                <Wand2 size={40} className="text-slate-700 group-hover:text-purple-500 transition-all duration-500" />
              </div>
              <h3 className="text-2xl font-black text-slate-400">Optimization Required</h3>
              <p className="text-slate-600 text-sm mt-3 max-w-sm leading-relaxed">
                Select a document above to let the AI analyze your bullet points and suggest impact-driven improvements.
              </p>
            </motion.div>
          )}

        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(168,85,247,0.2); }
      `}</style>
    </div>
  )
}