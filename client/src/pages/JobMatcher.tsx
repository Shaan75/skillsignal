import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getResumes, matchJob } from '../services/resumeService'
import { FileText, Target, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import Sidebar from '../components/ui/Sidebar'

interface Resume { _id: string; fileName: string }
interface MatchResult { matchScore: number; matchedSkills: string[]; missingSkills: string[]; recommendations: string[]; verdict: string }

export default function JobMatcher() {
  const [resumes, setResumes] = useState<Resume[]>([])
  const [selectedId, setSelectedId] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [result, setResult] = useState<MatchResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getResumes().then(data => { setResumes(data.resumes); if (data.resumes.length > 0) setSelectedId(data.resumes[0]._id) })
  }, [])

  const handleMatch = async () => {
    if (!selectedId || !jobDescription.trim()) { setError('Please select a resume and paste a job description'); return }
    setLoading(true); setError(''); setResult(null)
    try { const data = await matchJob(selectedId, jobDescription); setResult(data) }
    catch { setError('Failed to match job description') }
    finally { setLoading(false) }
  }

  const getScoreColor = (score: number) => score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444'

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
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-1">Job Matcher</h1>
            <p className="text-sm" style={{ color: 'rgba(148,163,184,0.5)' }}>See how well your resume matches any job description — instantly.</p>
          </div>

          {error && <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-4 px-4 py-3 rounded-2xl text-sm" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5' }}>{error}</motion.div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="rounded-3xl p-5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] mb-3" style={{ color: 'rgba(148,163,184,0.5)' }}>Select Resume</p>
              <div className="space-y-2">
                {resumes.map((r) => (
                  <div key={r._id} onClick={() => setSelectedId(r._id)} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all" style={{ background: selectedId === r._id ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.02)', border: selectedId === r._id ? '1px solid rgba(124,58,237,0.3)' : '1px solid rgba(255,255,255,0.04)' }}>
                    <FileText size={13} style={{ color: '#a78bfa' }} />
                    <span className="text-sm text-white truncate">{r.fileName}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl p-5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] mb-3" style={{ color: 'rgba(148,163,184,0.5)' }}>Job Description</p>
              <textarea value={jobDescription} onChange={e => setJobDescription(e.target.value)} placeholder="Paste the job description here..." rows={6} className="w-full rounded-2xl p-3 text-sm outline-none resize-none" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: 'white' }} onFocus={e => e.currentTarget.style.borderColor = 'rgba(124,58,237,0.4)'} onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'} />
            </div>
          </div>

          <motion.button onClick={handleMatch} disabled={loading} className="flex items-center justify-center gap-2.5 w-full md:w-auto px-8 py-3.5 rounded-2xl font-bold text-white text-sm disabled:opacity-50 mb-6" style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', boxShadow: '0 0 30px rgba(124,58,237,0.3)' }} whileTap={{ scale: 0.98 }}>
            {loading ? <><motion.div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} /> Analyzing...</> : <><Target size={16} /> Match My Resume</>}
          </motion.button>

          <AnimatePresence>
            {result && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="rounded-3xl p-5 relative overflow-hidden" style={{ background: `rgba(${result.matchScore >= 80 ? '16,185,129' : result.matchScore >= 60 ? '245,158,11' : '239,68,68'},0.06)`, border: `1px solid rgba(${result.matchScore >= 80 ? '16,185,129' : result.matchScore >= 60 ? '245,158,11' : '239,68,68'},0.15)` }}>
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] mb-3" style={{ color: 'rgba(148,163,184,0.5)' }}>Match Score</p>
                    <div className="flex items-end gap-1 mb-3">
                      <span className="text-5xl font-black" style={{ color: getScoreColor(result.matchScore), lineHeight: 1 }}>{result.matchScore}</span>
                      <span className="text-lg mb-1" style={{ color: 'rgba(148,163,184,0.3)' }}>/100</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <motion.div className="h-full rounded-full" style={{ background: getScoreColor(result.matchScore) }} initial={{ width: 0 }} animate={{ width: `${result.matchScore}%` }} transition={{ duration: 1.2 }} />
                    </div>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="md:col-span-2 rounded-3xl p-5 flex items-center" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.15em] mb-2" style={{ color: 'rgba(148,163,184,0.5)' }}>Verdict</p>
                      <p className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>{result.verdict}</p>
                    </div>
                  </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-3xl p-5" style={{ background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.12)' }}>
                    <div className="flex items-center gap-2 mb-3"><CheckCircle size={14} style={{ color: '#10b981' }} /><p className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: 'rgba(16,185,129,0.7)' }}>Matched Skills</p></div>
                    <div className="flex flex-wrap gap-1.5">
                      {result.matchedSkills.map((skill, i) => <span key={i} className="px-2.5 py-1 rounded-xl text-xs font-medium" style={{ background: 'rgba(16,185,129,0.1)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.2)' }}>{skill}</span>)}
                    </div>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-3xl p-5" style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.12)' }}>
                    <div className="flex items-center gap-2 mb-3"><XCircle size={14} style={{ color: '#ef4444' }} /><p className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: 'rgba(239,68,68,0.7)' }}>Missing Skills</p></div>
                    <div className="flex flex-wrap gap-1.5">
                      {result.missingSkills.map((skill, i) => <span key={i} className="px-2.5 py-1 rounded-xl text-xs font-medium" style={{ background: 'rgba(239,68,68,0.1)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.2)' }}>{skill}</span>)}
                    </div>
                  </motion.div>
                </div>

                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-3xl p-5" style={{ background: 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.12)' }}>
                  <div className="flex items-center gap-2 mb-3"><AlertCircle size={14} style={{ color: '#f59e0b' }} /><p className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: 'rgba(245,158,11,0.7)' }}>Recommendations</p></div>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec, i) => <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}><span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ background: '#f59e0b' }} />{rec}</li>)}
                  </ul>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}