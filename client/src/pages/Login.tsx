import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, Zap, ArrowRight, Eye, EyeOff, ArrowLeft, Activity, ShieldCheck, TrendingUp, Cpu } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { loginUser } from '../services/authService'

// --- HIGH-DENSITY UI MODULES ---

const DiagnosticModule = ({ icon, title, label, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.8 }}
    className="group flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-xl hover:border-cyan-500/30 transition-all cursor-default"
  >
    <div className="w-10 h-10 rounded-xl bg-black/60 flex items-center justify-center text-purple-400 group-hover:text-cyan-400 transition-colors border border-white/5 shadow-inner">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-center mb-0.5">
        <span className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-600">Protocol: Active</span>
        <Activity size={10} className="text-emerald-500/50 animate-pulse" />
      </div>
      <h4 className="text-[11px] font-[1000] text-white/90 uppercase tracking-widest italic truncate">{title}</h4>
    </div>
  </motion.div>
)

const TerminalInput = ({ label, icon: Icon, ...props }: any) => {
  const [isFocused, setIsFocused] = useState(false)
  return (
    <div className="space-y-2 w-full">
      <div className="flex justify-between items-end px-1">
        <label className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-500">{label}</label>
        {isFocused && <span className="text-[8px] font-mono text-cyan-400 uppercase animate-pulse">Link_Established</span>}
      </div>
      <div className="relative">
        <Icon size={16} className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors duration-300 ${isFocused ? 'text-cyan-400' : 'text-slate-700'}`} />
        <input
          {...props}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full bg-[#08080a] border border-white/5 rounded-2xl pl-12 pr-12 py-4 text-sm font-bold text-white outline-none transition-all focus:border-cyan-500/30 focus:bg-black placeholder:text-slate-900"
        />
        <div className={`absolute inset-0 rounded-2xl border border-cyan-500/0 transition-all duration-500 pointer-events-none ${isFocused ? 'border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.05)]' : ''}`} />
      </div>
    </div>
  )
}

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await loginUser(form)
      login(data.user, data.token)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Access Denied: Signature Mismatch')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen w-screen flex bg-[#020203] text-slate-200 font-sans selection:bg-cyan-500/30 overflow-hidden">
      
      {/* --- LEFT SIDE: THE NEURAL HUB (48% WIDTH) --- */}
      <div className="hidden lg:flex flex-col w-[48%] p-12 relative bg-[#030304] border-r border-white/5">
        {/* Background Mesh */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-cyan-600/10 blur-[120px] rounded-full" />
        </div>

        {/* TOP: NAVIGATION ZONE (10% HEIGHT) */}
        <div className="relative z-10 flex items-center justify-between h-[10%]">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
              <Zap size={18} className="text-white fill-current" />
            </div>
            <span className="font-black text-2xl tracking-tighter text-white uppercase italic">SkillSignal</span>
          </Link>
          
          <Link to="/" className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.5em] text-slate-600 hover:text-white transition-all group px-5 py-2 rounded-full border border-white/5 bg-white/[0.02]">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Home
          </Link>
        </div>

        {/* MIDDLE: TITLE ZONE (40% HEIGHT) */}
        <div className="flex-1 flex flex-col justify-center relative z-10 h-[40%]">
          <div className="space-y-4 max-w-lg">
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }}
               className="inline-flex items-center gap-3 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.4em] bg-purple-500/10 border border-purple-500/20 text-purple-400"
            >
              <Activity size={12} className="animate-pulse" /> Authentication Link
            </motion.div>
            
            <h1 className="text-[clamp(40px,5vh+20px,60px)] font-[1000] tracking-tighter leading-[0.85] text-white italic">
              Login to
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-white to-cyan-400 animate-gradient-x px-1"> Start Now.</span>
            </h1>
            
            <p className="text-base text-slate-500 font-small">
               Calibrate your professional value through real-time diagnostic arrays.
            </p>
          </div>
        </div>

        {/* BOTTOM: DATA ZONE (40% HEIGHT) */}
        <div className="relative z-10 h-[40%] flex flex-col justify-end space-y-4">
          <div className="grid gap-3 max-w-sm">
            <DiagnosticModule icon={<ShieldCheck size={20} />} title="High-Fidelity Scoring" delay={0.6} />
            <DiagnosticModule icon={<Cpu size={20} />} title="Skill Matrix Sync" delay={0.7} />
            <DiagnosticModule icon={<TrendingUp size={20} />} title="Actionable Hotspots" delay={0.8} />
          </div>
          <div className="pt-4 border-t border-white/5 opacity-30 text-[8px] font-bold uppercase tracking-[0.6em] text-slate-600">
             System Status // 0 Errors Detected // Encryption: AES-256
          </div>
        </div>
      </div>

      {/* --- RIGHT SIDE: THE PORTAL (FITS ON ONE PAGE) --- */}
      <div className="flex-1 flex items-center justify-center p-8 relative overflow-hidden bg-black">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-[400px] bg-purple-600/5 blur-[100px] rounded-full pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md relative z-10 space-y-8"
        >
          <div className="text-center md:text-left space-y-2">
            <h2 className="text-5xl font-[1000] text-white tracking-tighter italic uppercase leading-none">Initialize.</h2>
            <p className="text-slate-600 font-bold tracking-[0.4em] uppercase text-[9px] opacity-70">Waiting for user signature // portal_v1.0</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-3"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-red-400">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <TerminalInput label="Sync Channel" icon={Mail} type="email" name="email" value={form.email} onChange={(e: any) => setForm({...form, email: e.target.value})} placeholder="ENTER REGISTERED EMAIL" required />
            
            <div className="relative">
              <TerminalInput label="Access Cipher" icon={Lock} type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={(e: any) => setForm({...form, password: e.target.value})} placeholder="••••••••" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 bottom-4 text-slate-700 hover:text-white transition-colors">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="relative w-full group overflow-hidden rounded-2xl p-[1px] shadow-2xl"
            >
              <div className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_0,transparent_10%,#7c3aed_20%,#06b6d4_40%,transparent_50%)] animate-[spin_4s_linear_infinite]" />
              <div className="relative flex items-center justify-center gap-3 bg-[#08080a] rounded-[0.95rem] py-5 px-8 group-hover:bg-transparent transition-all duration-500">
                {loading ? (
                  <motion.div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
                ) : (
                  <>
                    <span className="text-xs font-[1000] text-white uppercase tracking-[0.4em]">Initialize Access</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
                  </>
                )}
              </div>
            </motion.button>
          </form>

          <div className="text-center pt-2">
             <Link to="/register" className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-600 hover:text-cyan-400 transition-all underline underline-offset-8 decoration-cyan-500/50">
                New Signal Detected? Deploy Account
             </Link>
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes gradient-x { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .animate-gradient-x { background-size: 200% 200%; animation: gradient-x 10s linear infinite; }
      `}</style>
    </div>
  )
}