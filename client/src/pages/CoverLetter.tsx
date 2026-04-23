import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getResumes, generateCoverLetter } from '../services/resumeService'
import { FileText, Sparkles, Copy, Check } from 'lucide-react'
import Sidebar from '../components/ui/Sidebar'

interface Resume { _id: string; fileName: string; analysis: null | object }

export default function CoverLetter() {
  const [resumes, setResumes] = useState<Resume[]>([])
  const [selectedId, setSelectedId] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [result, setResult] = useState<{ coverLetter: string; matchScore: number; keyPoints: string[] } | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getResumes().then(data => {
      setResumes(data.resumes)
      if (data.resumes.length > 0) setSelectedId(data.resumes[0]._id)
    })
  }, [])

  const handleGenerate = async () => {
    if (!selectedId || !jobDescription.trim()) { setError('Please select a resume and paste a job description'); return }
    setLoading(true); setError(''); setResult(null)
    try { const data = await generateCoverLetter(selectedId, jobDescription); setResult(data) }
    catch { setError('Failed to generate cover letter') }
    finally { setLoading(false) }
  }

  const handleCopy = () => {
    if (result?.coverLetter) {
      navigator.clipboard.writeText(result.coverLetter)
      setCopied(true); setTimeout(() => setCopied(false), 2000)
    }
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
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-1">Cover Letter Generator</h1>
            <p className="text-sm" style={{ color: 'rgba(148,163,184,0.5)' }}>Paste a job description and get a tailored cover letter in seconds.</p>
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

          <motion.button onClick={handleGenerate} disabled={loading} className="flex items-center justify-center gap-2.5 w-full md:w-auto px-8 py-3.5 rounded-2xl font-bold text-white text-sm disabled:opacity-50 mb-6" style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', boxShadow: '0 0 30px rgba(124,58,237,0.3)' }} whileTap={{ scale: 0.98 }}>
            {loading ? <><motion.div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} /> Generating...</> : <><Sparkles size={16} /> Generate Cover Letter</>}
          </motion.button>

          <AnimatePresence>
            {result && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-3xl p-5" style={{ background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.15)' }}>
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] mb-3" style={{ color: 'rgba(6,182,212,0.7)' }}>Job Match Score</p>
                    <div className="flex items-end gap-1 mb-2">
                      <span className="text-4xl font-black" style={{ color: '#06b6d4', lineHeight: 1 }}>{result.matchScore}</span>
                      <span className="mb-1 text-sm" style={{ color: 'rgba(148,163,184,0.4)' }}>/100</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #7c3aed, #06b6d4)' }} initial={{ width: 0 }} animate={{ width: `${result.matchScore}%` }} transition={{ duration: 1 }} />
                    </div>
                  </div>
                  <div className="rounded-3xl p-5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] mb-3" style={{ color: 'rgba(148,163,184,0.5)' }}>Key Points Used</p>
                    <ul className="space-y-1.5">
                      {result.keyPoints.map((p, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>
                          <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ background: '#a78bfa' }} />{p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="rounded-3xl p-5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: 'rgba(148,163,184,0.5)' }}>Generated Cover Letter</p>
                    <motion.button onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold" style={{ background: copied ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)', border: copied ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(255,255,255,0.08)', color: copied ? '#10b981' : 'rgba(148,163,184,0.7)' }} whileTap={{ scale: 0.95 }}>
                      {copied ? <><Check size={11} /> Copied!</> : <><Copy size={11} /> Copy</>}
                    </motion.button>
                  </div>
                  <div className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'rgba(255,255,255,0.75)' }}>{result.coverLetter}</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}