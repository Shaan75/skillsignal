import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getResumes, generateInterviewQuestions } from '../services/resumeService'
import { FileText, Sparkles, ChevronDown, ChevronUp } from 'lucide-react'
import Sidebar from '../components/ui/Sidebar'

interface Question { question: string; category: string; answer: string }
interface Resume { _id: string; fileName: string }

const categoryColors: Record<string, { bg: string; border: string; text: string }> = {
  Technical: { bg: 'rgba(124,58,237,0.1)', border: 'rgba(124,58,237,0.25)', text: '#a78bfa' },
  Behavioral: { bg: 'rgba(6,182,212,0.1)', border: 'rgba(6,182,212,0.25)', text: '#67e8f9' },
  Project: { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.25)', text: '#6ee7b7' },
  HR: { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)', text: '#fcd34d' },
}

export default function InterviewPrep() {
  const [resumes, setResumes] = useState<Resume[]>([])
  const [selectedId, setSelectedId] = useState('')
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [expanded, setExpanded] = useState<number | null>(null)

  useEffect(() => {
    getResumes().then(data => {
      setResumes(data.resumes)
      if (data.resumes.length > 0) setSelectedId(data.resumes[0]._id)
    })
  }, [])

  const handleGenerate = async () => {
    if (!selectedId) return
    setLoading(true); setError(''); setQuestions([]); setExpanded(null)
    try { const data = await generateInterviewQuestions(selectedId); setQuestions(data.questions) }
    catch { setError('Failed to generate interview questions') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#050508', fontFamily: "'DM Sans', 'Inter', system-ui, sans-serif" }}>
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full blur-[120px]" style={{ background: 'rgba(124,58,237,0.08)' }} />
      </div>

      <Sidebar />

      <div className="relative z-10 flex-1 p-4 md:p-8 pt-16 md:pt-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-1">Interview Prep</h1>
            <p className="text-sm" style={{ color: 'rgba(148,163,184,0.5)' }}>Get personalized interview questions based on YOUR resume — with model answers.</p>
          </div>

          {error && <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-4 px-4 py-3 rounded-2xl text-sm" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5' }}>{error}</motion.div>}

          <div className="rounded-3xl p-5 mb-6" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] mb-3" style={{ color: 'rgba(148,163,184,0.5)' }}>Select Resume</p>
            <div className="space-y-2 mb-4">
              {resumes.map((r) => (
                <div key={r._id} onClick={() => setSelectedId(r._id)} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all" style={{ background: selectedId === r._id ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.02)', border: selectedId === r._id ? '1px solid rgba(124,58,237,0.3)' : '1px solid rgba(255,255,255,0.04)' }}>
                  <FileText size={13} style={{ color: '#a78bfa' }} />
                  <span className="text-sm text-white truncate">{r.fileName}</span>
                </div>
              ))}
            </div>
            <motion.button onClick={handleGenerate} disabled={loading || !selectedId} className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-2xl font-bold text-white text-sm disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', boxShadow: '0 0 30px rgba(124,58,237,0.3)' }} whileTap={{ scale: 0.98 }}>
              {loading ? <><motion.div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} /> Generating...</> : <><Sparkles size={16} /> Generate Questions</>}
            </motion.button>
          </div>

          <AnimatePresence>
            {questions.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] mb-2" style={{ color: 'rgba(148,163,184,0.4)' }}>{questions.length} Questions Generated</p>
                {questions.map((q, i) => {
                  const colors = categoryColors[q.category] || categoryColors.Technical
                  return (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <button onClick={() => setExpanded(expanded === i ? null : i)} className="w-full flex items-center gap-3 p-4 text-left">
                        <span className="text-base font-black shrink-0" style={{ color: 'rgba(255,255,255,0.15)', lineHeight: 1, minWidth: '24px' }}>{String(i + 1).padStart(2, '0')}</span>
                        <div className="flex-1 min-w-0">
                          <span className="inline-block px-2 py-0.5 rounded-md text-xs font-semibold mb-1" style={{ background: colors.bg, border: `1px solid ${colors.border}`, color: colors.text }}>{q.category}</span>
                          <p className="text-sm font-medium text-white leading-snug">{q.question}</p>
                        </div>
                        <div className="shrink-0 ml-2" style={{ color: 'rgba(148,163,184,0.4)' }}>{expanded === i ? <ChevronUp size={15} /> : <ChevronDown size={15} />}</div>
                      </button>
                      <AnimatePresence>
                        {expanded === i && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                            <div className="px-4 pb-4 ml-9">
                              <div className="rounded-2xl p-4" style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)' }}>
                                <p className="text-xs font-semibold uppercase tracking-[0.12em] mb-2" style={{ color: 'rgba(167,139,250,0.6)' }}>Model Answer</p>
                                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>{q.answer}</p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}