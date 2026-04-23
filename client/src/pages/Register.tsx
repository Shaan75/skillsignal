import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, User, Zap, ArrowRight, Eye, EyeOff, ArrowLeft, Activity, ShieldCheck, Cpu } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { registerUser } from '../services/authService'

// --- HIGH-END UI COMPONENTS ---

const DiagnosticNode = ({ icon, title, delay }: { icon: any, title: string, delay: number }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    className="group flex items-center gap-4 p-4 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-3xl hover:bg-white/[0.04] hover:border-white/10 transition-all cursor-default"
  >
    <div className="w-10 h-10 rounded-xl bg-black/40 flex items-center justify-center text-purple-500 shadow-inner group-hover:text-cyan-400 transition-colors">
      {icon}
    </div>
    <div className="space-y-0.5">
      <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-600 group-hover:text-slate-400 transition-colors">Status: Verified</p>
      <h4 className="text-xs font-[1000] text-white/80 uppercase italic tracking-tight">{title}</h4>
    </div>
  </motion.div>
)

const TerminalInput = ({ label, icon: Icon, ...props }: any) => {
  const [isFocused, setIsFocused] = useState(false)
  return (
    <div className="space-y-2.5 w-full">
      <div className="flex justify-between items-end px-1">
        <label className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-500">{label}</label>
        {isFocused && (
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[8px] font-mono text-purple-500 uppercase tracking-widest">Input_Active</motion.span>
        )}
      </div>
      <div className="relative group">
        <Icon size={16} className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors duration-500 ${isFocused ? 'text-purple-400' : 'text-slate-700'}`} />
        <input
          {...props}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full bg-[#08080a] border border-white/5 rounded-2xl pl-12 pr-12 py-4 text-sm font-bold text-white outline-none transition-all focus:border-purple-500/30 focus:bg-black group-hover:border-white/10 placeholder:text-slate-900"
        />
        {isFocused && (
          <motion.div 
            layoutId="glow"
            className="absolute inset-0 rounded-2xl border border-purple-500/40 pointer-events-none shadow-[0_0_15px_rgba(168,85,247,0.1)]"
          />
        )}
      </div>
    </div>
  )
}

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await registerUser(form)
      login(data.user, data.token)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen flex bg-[#020203] text-slate-200 font-sans selection:bg-purple-500/30 overflow-hidden">
      
      {/* --- LEFT SIDE: THE DIAGNOSTIC ARRAY --- */}
      <div className="hidden lg:flex flex-col w-[45%] p-16 relative border-r border-white/5 bg-[#030304] overflow-hidden">
        {/* Background FX */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-purple-600/10 blur-[150px] rounded-full" />
        </div>

        {/* TOP HEADER: BRAND + BACK */}
        <div className="relative z-10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.3)] group-hover:rotate-12 transition-transform">
              <Zap size={18} className="text-white fill-current" />
            </div>
            <span className="font-black text-2xl tracking-tighter text-white uppercase italic">SkillSignal</span>
          </Link>
          
          <Link to="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 hover:text-white transition-all group px-4 py-2 rounded-full border border-white/5 bg-white/[0.02]">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Home
          </Link>
        </div>
        <br />
        {/* CENTERED CONTENT */}
        <div className="flex-1 flex flex-col justify-center relative z-10 space-y-10">
          <div className="space-y-6">
            <motion.div 
               initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
               className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.4em] bg-purple-500/10 border border-purple-500/20 text-purple-400"
            >
              <Activity size={12} className="animate-pulse" />Initialize protocol v1.0.4
            </motion.div>
            <h2 className="text-7xl font-[1000] tracking-tighter leading-[0.85] text-white italic">
              Register Now
            </h2>
            <p className="text-lg text-slate-500 font-small ">
              Secure your place in the high-fidelity diagnostic network. Processing latency &lt; 500ms.
            </p>
          </div>

          <div className="grid gap-4 max-w-sm">
            <DiagnosticNode icon={<ShieldCheck size={20} />} title="Encrypted Auth Nodes" delay={0.6} />
            <DiagnosticNode icon={<Cpu size={20} />} title="Llama 3.3 Engine Sync" delay={0.7} />
            <DiagnosticNode icon={<Activity size={20} />} title="Real-time Hotspots" delay={0.8} />
          </div>
        </div>

        {/* BOTTOM: SMALL VERSION */}
        <div className="relative z-10 opacity-20 text-[9px] font-bold uppercase tracking-[0.5em] text-slate-500"> <br />
          Diagnostic Suite // End-to-End Encryption Enabled
        </div>
      </div>

      {/* --- RIGHT SIDE: THE FORM TERMINAL --- */}
      <div className="flex-1 flex items-center justify-center p-8 relative overflow-hidden bg-black">
        {/* Cinematic Backdrop Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-[500px] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md relative z-10 space-y-10"
        >
          {/* Header */}
          <div className="text-center md:text-left space-y-3">
            <h2 className="text-5xl font-[1000] text-white tracking-tighter italic uppercase leading-none">Deploy Account.</h2>
            <p className="text-slate-500 font-bold tracking-tight uppercase text-[10px] opacity-60">System Ready for Calibration // Access: Open_Alpha</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-3"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-red-400">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <TerminalInput 
              label="Identity Token" 
              icon={User} 
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="YOUR FULL NAME"
              required
            />
            <TerminalInput 
              label="Sync Channel" 
              icon={Mail} 
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="YOU@EXAMPLE.COM"
              required
            />
            <div className="relative">
              <TerminalInput 
                label="Access Cipher" 
                icon={Lock} 
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 bottom-4 text-slate-700 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* CINEMATIC BUTTON */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="relative w-full group overflow-hidden rounded-2xl p-[1px]"
            >
              {/* Spinning Border Background */}
              <div className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_0,transparent_10%,#7c3aed_20%,#06b6d4_40%,transparent_50%)] animate-[spin_4s_linear_infinite]" />
              
              <div className="relative flex items-center justify-center gap-3 bg-[#08080a] rounded-[0.95rem] py-5 px-8 group-hover:bg-transparent transition-all duration-500">
                {loading ? (
                  <motion.div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
                ) : (
                  <>
                    <span className="text-xs font-[1000] text-white uppercase tracking-[0.4em]">Initialize Deployment</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
                  </>
                )}
              </div>
            </motion.button>
          </form>

          {/* Switch Link */}
          <div className="text-center">
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">
              Already Calibrated? {' '}
              <Link to="/login" className="text-white hover:text-purple-400 transition-colors underline underline-offset-8 decoration-purple-500/50">Sign In</Link>
             </p>
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