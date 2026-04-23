import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import {
  Zap, Brain, FileText, Sparkles, Target, Briefcase,
  Wand2, Map, Bot, LogOut, Upload, User, Menu, X, Flame
} from 'lucide-react'

const navItems = [
  { to: '/dashboard', icon: <Brain size={15} />, label: 'Dashboard' },
  { to: '/cover-letter', icon: <FileText size={15} />, label: 'Cover Letter' },
  { to: '/interview-prep', icon: <Sparkles size={15} />, label: 'Interview Prep' },
  { to: '/job-matcher', icon: <Target size={15} />, label: 'Job Matcher' },
  { to: '/linkedin-bio', icon: <Briefcase size={15} />, label: 'LinkedIn Bio' },
  { to: '/resume-rewriter', icon: <Wand2 size={15} />, label: 'Resume Rewriter' },
  { to: '/skill-gap', icon: <Map size={15} />, label: 'Skill Gap' },
  { to: '/ats-score', icon: <Bot size={15} />, label: 'ATS Score' },
  { to: '/resume-roast', icon: <Flame size={15} />, label: 'Resume Roast 🔥', hot: true },
]

interface SidebarProps {
  onUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void
  uploading?: boolean
  showUpload?: boolean
  resumes?: { _id: string; fileName: string; analysis: any }[]
  selectedId?: string
  onSelectResume?: (id: string) => void
  onDeleteResume?: (id: string) => void
}

export default function Sidebar({
  onUpload,
  uploading,
  showUpload = false,
  resumes = [],
  selectedId,
  onSelectResume,
  onDeleteResume,
}: SidebarProps) {
  const { state, logout } = useAuth()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}>
            <Zap size={15} className="text-white" />
          </div>
          <span className="font-black text-base" style={{ background: 'linear-gradient(135deg, #a78bfa, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            SkillSignal
          </span>
        </div>
        <button onClick={() => setMobileOpen(false)} className="md:hidden" style={{ color: 'rgba(148,163,184,0.5)' }}>
          <X size={18} />
        </button>
      </div>

      {/* User */}
      <div className="rounded-2xl p-3 mb-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.3)' }}>
            <User size={14} style={{ color: '#a78bfa' }} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white truncate">{state.user?.name}</p>
            <p className="text-xs truncate" style={{ color: 'rgba(148,163,184,0.4)', fontSize: '10px' }}>{state.user?.email}</p>
          </div>
        </div>
      </div>

      {/* Upload */}
      {showUpload && (
        <label className="flex items-center justify-center gap-2 w-full py-2.5 rounded-2xl font-semibold text-xs text-white cursor-pointer mb-5 transition-opacity hover:opacity-90" style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', boxShadow: '0 0 20px rgba(124,58,237,0.25)' }}>
          {uploading ? (
            <motion.div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
          ) : (
            <><Upload size={13} /> Upload Resume</>
          )}
          <input type="file" accept=".pdf" className="hidden" onChange={onUpload} disabled={uploading} />
        </label>
      )}

      {/* Nav */}
      <nav className="space-y-0.5 flex-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all"
              style={{
                background: isActive ? 'rgba(124,58,237,0.15)' : 'transparent',
                border: isActive ? '1px solid rgba(124,58,237,0.3)' : '1px solid transparent',
                color: isActive ? '#a78bfa' : 'rgba(148,163,184,0.6)',
              }}
              onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)' }}
              onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
            >
              {item.icon}
              <span className="truncate">{item.label}</span>
              {(item as any).hot && !isActive && (
                <span className="ml-auto text-xs px-1.5 py-0.5 rounded-md font-bold" style={{ background: 'rgba(239,68,68,0.15)', color: '#fca5a5', fontSize: '9px' }}>NEW</span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Resume list for dashboard */}
      {showUpload && resumes.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] mb-2" style={{ color: 'rgba(148,163,184,0.3)', fontSize: '9px' }}>Your Resumes</p>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {resumes.map((r) => (
              <div
                key={r._id}
                onClick={() => onSelectResume?.(r._id)}
                className="flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all group"
                style={{
                  background: selectedId === r._id ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.02)',
                  border: selectedId === r._id ? '1px solid rgba(124,58,237,0.3)' : '1px solid rgba(255,255,255,0.04)',
                }}
              >
                <FileText size={11} style={{ color: '#a78bfa', flexShrink: 0 }} />
                <p className="text-xs text-white truncate flex-1">{r.fileName}</p>
                <button
                  onClick={(e) => { e.stopPropagation(); onDeleteResume?.(r._id) }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: '#ef4444' }}
                >
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Logout */}
      <button
        onClick={logout}
        className="flex items-center gap-2 text-sm py-2 px-3 rounded-xl mt-4 transition-all hover:bg-white/5 w-full"
        style={{ color: 'rgba(148,163,184,0.4)' }}
      >
        <LogOut size={13} /> Logout
      </button>
    </div>
  )

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 w-9 h-9 rounded-xl flex items-center justify-center"
        style={{ background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.3)' }}
      >
        <Menu size={16} style={{ color: '#a78bfa' }} />
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="md:hidden fixed top-0 left-0 bottom-0 z-50 w-72 p-6"
            style={{ background: '#0a0a0f', borderRight: '1px solid rgba(255,255,255,0.08)' }}
          >
            <SidebarContent />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <div
        className="hidden md:flex flex-col w-64 p-5"
        style={{ background: 'rgba(255,255,255,0.02)', borderRight: '1px solid rgba(255,255,255,0.05)', minHeight: '100vh' }}
      >
        <SidebarContent />
      </div>
    </>
  )
}