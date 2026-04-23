import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getResumes, generateLinkedInBio } from '../services/resumeService'
import { FileText, Briefcase, Copy, Check } from 'lucide-react'
import Sidebar from '../components/ui/Sidebar'

interface Resume { _id: string; fileName: string }
interface BioResult { bio: string; headline: string; keywords: string[] }

export default function LinkedInBio() {
  const [resumes, setResumes] = useState<Resume[]>([])
  const [selectedId, setSelectedId] = useState('')
  const [result, setResult] = useState<BioResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copiedBio, setCopiedBio] = useState(false)
  const [copiedHeadline, setCopiedHeadline] = useState(false)

  useEffect(() => {
    getResumes().then(data => { setResumes(data.resumes); if (data.resumes.length > 0) setSelectedId(data.resumes[0]._id) })
  }, [])

  const handleGenerate = async () => {
    if (!selectedId) return
    setLoading(true); setError(''); setResult(null)
    try { const data = await generateLinkedInBio(selectedId); setResult(data) }
    catch { setError('Failed to generate LinkedIn bio') }
    finally { setLoading(false) }
  }

  const handleCopy = (text: string, type: 'bio' | 'headline') => {
    navigator.clipboard.writeText(text)
    if (type === 'bio') { setCopiedBio(true); setTimeout(() => setCopiedBio(false), 2000) }
    else { setCopiedHeadline(true); setTimeout(() => setCopiedHeadline(false), 2000) }
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
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-1">LinkedIn Bio Generator</h1>
            <p className="text-sm" style={{ color: 'rgba(148,163,184,0.5)' }}>Generate a killer LinkedIn About section + headline based on your resume.</p>
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
              {loading ? <><motion.div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} /> Generating...</> : <><Briefcase size={16} /> Generate Bio</>}
            </motion.button>
          </div>

          <AnimatePresence>
            {result && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl p-5" style={{ background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.15)' }}>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: 'rgba(6,182,212,0.7)' }}>LinkedIn Headline</p>
                    <motion.button onClick={() => handleCopy(result.headline, 'headline')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold" style={{ background: copiedHeadline ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)', border: copiedHeadline ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(255,255,255,0.08)', color: copiedHeadline ? '#10b981' : 'rgba(148,163,184,0.7)' }} whileTap={{ scale: 0.95 }}>
                      {copiedHeadline ? <><Check size={11} /> Copied!</> : <><Copy size={11} /> Copy</>}
                    </motion.button>
                  </div>
                  <p className="text-base font-semibold" style={{ color: 'rgba(255,255,255,0.9)' }}>{result.headline}</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-3xl p-5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: 'rgba(148,163,184,0.5)' }}>LinkedIn About Section</p>
                    <motion.button onClick={() => handleCopy(result.bio, 'bio')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold" style={{ background: copiedBio ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)', border: copiedBio ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(255,255,255,0.08)', color: copiedBio ? '#10b981' : 'rgba(148,163,184,0.7)' }} whileTap={{ scale: 0.95 }}>
                      {copiedBio ? <><Check size={11} /> Copied!</> : <><Copy size={11} /> Copy</>}
                    </motion.button>
                  </div>
                  <div className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'rgba(255,255,255,0.75)' }}>{result.bio}</div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-3xl p-5" style={{ background: 'rgba(124,58,237,0.04)', border: '1px solid rgba(124,58,237,0.12)' }}>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] mb-3" style={{ color: 'rgba(167,139,250,0.7)' }}>LinkedIn SEO Keywords</p>
                  <div className="flex flex-wrap gap-2">
                    {result.keywords.map((kw, i) => <motion.span key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + i * 0.04 }} className="px-3 py-1.5 rounded-xl text-xs font-medium" style={{ background: 'rgba(124,58,237,0.12)', color: '#c4b5fd', border: '1px solid rgba(124,58,237,0.2)' }}>{kw}</motion.span>)}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}