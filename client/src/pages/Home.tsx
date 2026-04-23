import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  ArrowRight, TrendingUp, Sparkles, 
  Zap, Menu, X, Activity, Terminal, 
  Cpu, BarChart3, Eye, Target, Shield, ArrowUp 
} from 'lucide-react'

// --- EXTRAORDINARY HOVER COMPONENT ---
const MenuLink = ({ title, href, onClick, isSmall = false }: { title: string, href: string, onClick: () => void, isSmall?: boolean }) => {
  return (
    <motion.a
      href={href}
      onClick={onClick}
      initial="initial"
      whileHover="hover"
      className={`relative group cursor-pointer flex items-center justify-center overflow-hidden py-2 px-4 w-full ${isSmall ? 'text-xl font-bold text-slate-500' : 'text-4xl md:text-6xl font-[1000] text-white uppercase tracking-tighter italic'}`}
    >
      {/* Background Spotlight Glow */}
      <motion.div 
        variants={{
          initial: { scale: 0, opacity: 0 },
          hover: { scale: 1.5, opacity: 0.15 }
        }}
        className="absolute inset-0 bg-gradient-to-r from-purple-600 via-cyan-400 to-purple-600 blur-3xl rounded-full pointer-events-none"
      />

      {/* Text Animation: Letter Stagger */}
      <div className="relative flex overflow-hidden">
        {title.split("").map((char, i) => (
          <motion.span
            key={i}
            variants={{
              initial: { y: 0 },
              hover: { y: -5, color: "#fff", textShadow: "0px 0px 20px rgba(168,85,247,0.8)" }
            }}
            transition={{
              type: "spring",
              damping: 12,
              stiffness: 200,
              delay: i * 0.02
            }}
            className="inline-block"
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </div>

      {/* Underline "Signal" Beam */}
      <motion.div 
        variants={{
          initial: { x: "-100%" },
          hover: { x: "100%" }
        }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100"
      />
    </motion.a>
  )
}

// --- CORE ANIMATION COMPONENT ---
const Reveal = ({ children, delay = 0, y = 30 }: { children: React.ReactNode, delay?: number, y?: number }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  return (
    <div ref={ref} className="relative w-full flex justify-center">
      <motion.div
        variants={{
          hidden: { opacity: 0, y },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
      >
        {children}
      </motion.div>
    </div>
  )
}

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const containerRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
      setShowScrollTop(window.scrollY > 500)

      const sections = ['diagnostics', 'gaze', 'velocity']
      const current = sections.find(section => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 150 && rect.bottom >= 150
        }
        return false
      })
      if (current) setActiveSection(current)
      else if (window.scrollY < 500) setActiveSection('hero')
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div ref={containerRef} className="bg-[#020203] text-slate-200 selection:bg-purple-500/30 font-sans overflow-x-hidden scroll-smooth">
      
      {/* --- FIXED NAVBAR --- */}
      <nav className={`fixed top-0 inset-x-0 z-[2000] transition-all duration-700 ${isScrolled ? 'py-3' : 'py-6 md:py-8'}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className={`flex items-center justify-between p-2 rounded-2xl border transition-all duration-700 ${isScrolled ? 'bg-black/60 backdrop-blur-2xl border-white/10 shadow-2xl' : 'bg-transparent border-transparent'}`}>
            <div onClick={scrollToTop} className="flex items-center gap-3 px-4 group cursor-pointer">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                <Zap size={18} className="text-white fill-current" />
              </div>
              <span className="font-black text-xl tracking-tighter text-white uppercase italic">SkillSignal</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-10 font-bold text-[10px] uppercase tracking-[0.3em] text-slate-500">
              <a href="#diagnostics" className={`transition-all hover:text-white ${activeSection === 'diagnostics' ? 'text-purple-400' : ''}`}>Diagnostics</a>
              <a href="#gaze" className={`transition-all hover:text-white ${activeSection === 'gaze' ? 'text-purple-400' : ''}`}>Heatmap</a>
              <Link to="/login" className="text-white/60 hover:text-white transition-colors">Login</Link>
              <Link to="/register" className="bg-white text-black px-6 py-2.5 rounded-xl font-black transition-all hover:scale-105 active:scale-95 shadow-xl">Get Started</Link>
            </div>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-3 text-white px-4 relative z-[2001]">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* --- MOBILE MENU DRAWER --- */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-[#020203] z-[1999] flex flex-col items-center justify-center md:hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(124,58,237,0.1),transparent_70%)] pointer-events-none" />
            
            <div className="flex flex-col items-center gap-6 relative z-10 w-full px-10">
              <MenuLink title="Diagnostics" href="#diagnostics" onClick={() => setMobileMenuOpen(false)} />
              <MenuLink title="Heatmap" href="#gaze" onClick={() => setMobileMenuOpen(false)} />
              
              <div className="h-px w-24 bg-white/10 my-4" />
              
              <MenuLink title="Sign In" href="/login" onClick={() => setMobileMenuOpen(false)} isSmall />
              
              <Link to="/register" className="mt-8 bg-white text-black px-12 py-5 rounded-2xl font-[1000] text-2xl shadow-[0_0_50px_rgba(255,255,255,0.2)] hover:scale-105 transition-all uppercase tracking-tighter" onClick={() => setMobileMenuOpen(false)}>Get Started</Link>
            </div>

            {/* Mobile Drawer Bottom Branding */}
            <div className="absolute bottom-12 flex flex-col items-center gap-3 opacity-30 select-none">
               <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center">
                    <Zap size={10} className="text-white fill-current" />
                  </div>
                  <span className="font-black text-[10px] tracking-widest text-white uppercase italic">SkillSignal</span>
               </div>
               <div className="flex items-center gap-4 text-[8px] font-bold text-slate-500 uppercase tracking-[0.4em]">
                  <span>v1.0.4</span>
                  <div className="w-1 h-1 rounded-full bg-slate-800" />
                  <span>System Active</span>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- HERO SECTION --- */}
      <section className="relative h-screen flex flex-col items-center justify-center px-6 pt-20 border-b border-white/5">
        <div className="max-w-5xl mx-auto text-center flex flex-col items-center z-10">
          <Reveal>
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full mb-8 text-[10px] font-black uppercase tracking-[0.4em] bg-purple-500/10 border border-purple-500/20 text-purple-400 backdrop-blur-xl">
              <Activity size={12} className="animate-pulse" /> AI Sync Active
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="text-[clamp(40px,9vw,110px)] font-[1000] leading-[0.85] tracking-[-0.05em] text-white mb-8">
              Know Your Signal<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-white to-cyan-400 animate-gradient-x px-2 italic">Land Your Role.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="max-w-xl mx-auto text-lg md:text-xl text-slate-500 font-medium mb-12">
              Our LPU-powered engine decodes exactly what recruiters see. High-fidelity diagnostics in under 500ms.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 via-white/20 to-cyan-500 rounded-2xl blur-2xl opacity-20 group-hover:opacity-60 transition-all duration-1000" />
              <Link to="/register" className="relative flex items-center gap-8 bg-[#08080a] hover:bg-black border border-white/10 px-10 md:px-16 py-6 md:py-8 rounded-2xl transition-all shadow-[0_0_80px_-20px_rgba(124,58,237,0.8)]">
                <span className="text-white font-[1000] text-sm md:text-lg tracking-[0.25em] uppercase">Analyze Resume</span>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center text-white shadow-xl group-hover:rotate-90 transition-transform duration-700">
                  <ArrowRight size={22} strokeWidth={3} />
                </div>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* --- SCANNER SECTION --- */}
      <section className="relative py-32 px-6 bg-[#030305] border-y border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="relative h-[450px] w-full bg-white/[0.01] border border-white/10 rounded-[3.5rem] overflow-hidden backdrop-blur-3xl shadow-2xl">
            <motion.div 
              initial={{ top: -20 }}
              animate={{ top: "100%" }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent z-30 shadow-[0_0_15px_#22d3ee]"
            />
            <div className="absolute inset-0 p-10 md:p-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8 opacity-20 select-none">
                 <div className="flex justify-between border-b border-white/5 pb-4 uppercase font-black text-[9px] text-slate-500">
                    <div className="flex items-center gap-3"><Terminal size={14} className="text-cyan-500" /> [ENGINE_SCAN: ACTIVE]</div>
                    <div className="text-purple-500 font-mono italic">0.12s_READY</div>
                 </div>
                 <div className="space-y-4">
                    <div className="h-2 w-full bg-white/10 rounded-full" />
                    <div className="h-2 w-3/4 bg-white/10 rounded-full" />
                    <div className="h-2 w-5/6 bg-white/10 rounded-full" />
                 </div>
              </div>
              <div className="space-y-5">
                {['ACHIEVEMENT_NODE_EXTRACTED', 'SIGNAL_SYNTAX_CALIBRATED', 'RECRUITER_MATCH_VERIFIED'].map((text, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.5, duration: 0.8 }}
                    className={`flex items-center gap-4 text-cyan-400 font-black text-[10px] tracking-[0.2em] uppercase`}
                  >
                    <div className={`w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_10px_currentColor] animate-pulse`} />
                    {text}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SIGNAL VS NOISE --- */}
      <section className="relative py-40 px-6 bg-black">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <Reveal>
              <div className="text-center lg:text-left">
                <span className="text-purple-500 font-black text-[10px] uppercase tracking-[0.5em] mb-4 block">The Calibration</span>
                <h2 className="text-5xl md:text-7xl font-black text-white leading-none mb-8 tracking-tighter italic">Signal vs.<br /><span className="text-slate-800">Noise.</span></h2>
                <div className="space-y-3">
                  {[
                    { from: '"Responsible for sales..."', to: '"Generated $2.4M ARR..."', color: 'emerald' },
                    { from: '"Team player with passion..."', to: '"Led 12 engineers to ship..."', color: 'cyan' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
                       <span className="text-[9px] text-red-500/50 line-through truncate font-bold uppercase tracking-widest italic">{item.from}</span>
                       <ArrowRight size={14} className="text-slate-700" />
                       <span className={`text-[11px] text-${item.color}-400 font-black truncate uppercase tracking-widest`}>{item.to}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
            <div className="relative bg-[#08080a] border border-white/10 rounded-[3rem] p-12 overflow-hidden shadow-2xl">
                <BarChart3 className="text-purple-500/5 absolute -bottom-10 -right-10 w-80 h-80" />
                <div className="space-y-3 relative z-10 text-center md:text-left">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Efficiency multiplier</p>
                    <div className="text-8xl font-black text-white italic tracking-tighter animate-pulse">+340%</div>
                    <p className="text-slate-400 font-medium leading-relaxed italic border-l-0 md:border-l-2 border-purple-500 md:pl-6 mt-8">
                        "SkillSignal identifies generic filler and amplifies facts that trigger interviews."
                    </p>
                </div>
            </div>
        </div>
      </section>

      {/* --- HEATMAP: THE RECRUITER'S EYE --- */}
      <section id="gaze" className="relative py-40 px-6 bg-[#030304] border-y border-white/5 overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-24">
          <div className="lg:w-1/2">
            <Reveal>
              <div className="text-center lg:text-left">
                <span className="text-red-500 font-black text-[10px] uppercase tracking-[0.5em] mb-4 block">Visual Psychology</span>
                <h2 className="text-5xl md:text-8xl font-black text-white leading-[0.85] tracking-tighter mb-8 italic">
                  The <br/>Recruiter's<br/> <span className="text-slate-800">Gaze.</span>
                </h2>
                <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-sm mx-auto lg:mx-0">
                   We map the visual hot-spots to ensure your value is impossible to miss.
                </p>
              </div>
            </Reveal>
          </div>
          
          <div className="lg:w-1/2 relative h-[550px] w-full bg-[#08080a] border border-white/5 rounded-[4rem] p-12 overflow-hidden shadow-2xl">
            <Eye size={300} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/[0.01]" />
            <div className="relative z-10 space-y-6 opacity-30">
              <div className="h-2 w-full bg-white/10 rounded-full" />
              <div className="h-2 w-3/4 bg-white/10 rounded-full" />
              
              <div className="relative h-28 w-full flex items-center justify-center">
                 <motion.div animate={{ scale: [1, 2], opacity: [0.5, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute w-24 h-24 border border-emerald-500/50 rounded-full" />
                 <div className="h-20 w-3/4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center relative z-20 backdrop-blur-md">
                   <span className="text-emerald-500 font-black text-[10px] uppercase tracking-[0.4em] italic">Focus: Achievement Node</span>
                 </div>
              </div>

              <div className="h-2 w-5/6 bg-white/10 rounded-full" />
              <div className="h-2 w-1/2 bg-white/10 rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* --- CLINICAL DIAGNOSTICS --- */}
      <section id="diagnostics" className="relative py-40 px-6 bg-black border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <Reveal>
             <div className="mb-24 text-center">
                <h2 className="text-5xl md:text-9xl font-black text-white tracking-tighter leading-[0.8] mb-8 italic">Clinical<br /><span className="text-slate-800">Diagnostics.</span></h2>
                <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-xs opacity-50">Four Layer Semantic Analysis</p>
             </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {[
               { icon: <Cpu />, title: 'Tone Analysis', desc: 'Verifying if your language matches executive-level confidence.' },
               { icon: <Shield />, title: 'ATS Parsing', desc: 'Simulating 40+ systems to ensure 100% human-readability.' },
               { icon: <Target />, title: 'Skill Gaps', desc: 'Detecting the specific nodes missing for your target salary.' },
               { icon: <TrendingUp />, title: 'Impact AI', desc: 'Quantifying passive statements into data-driven milestones.' }
             ].map((node, i) => (
               <motion.div key={i} whileHover={{ y: -8 }} className="p-10 bg-white/[0.02] border border-white/5 rounded-[3rem] group">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-purple-400 transition-colors mb-8">
                     {node.icon}
                  </div>
                  <h4 className="text-xl font-black text-white mb-3 italic tracking-tight">{node.title}</h4>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed">{node.desc}</p>
               </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* --- CINEMATIC FINAL CTA --- */}
      <section id="velocity" className="relative py-60 px-6 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[500px] bg-purple-600/5 blur-[150px] rounded-full pointer-events-none opacity-50" />
        <div className="max-w-5xl mx-auto text-center relative z-10 flex flex-col items-center">
          <Reveal>
             <div className="flex flex-col items-center gap-4">
                <h2 className="text-7xl md:text-[140px] font-black text-white leading-[0.75] tracking-tighter mb-4 italic select-none">
                  Signal 
                </h2>
                <div className="relative mb-12">
                   <span className="text-7xl md:text-[140px] font-black tracking-tighter italic text-transparent bg-clip-text bg-gradient-to-b from-slate-400 to-slate-800 opacity-60">Unlocked.</span>
                   <div className="absolute inset-0 bg-purple-500/20 blur-[60px] rounded-full animate-pulse" />
                </div>
                <Link to="/register" className="group relative h-24 px-16 inline-flex items-center gap-6 rounded-full bg-white text-black font-[1000] text-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_100px_rgba(255,255,255,0.3)]">
                  <span className="uppercase tracking-[0.1em]">Deploy Now</span>
                  <Sparkles size={28} className="group-hover:rotate-12 transition-transform duration-500" />
                </Link>
             </div>
          </Reveal>
        </div>
      </section>

      {/* --- PREMIUM FOOTER --- */}
      <footer className="relative bg-[#020203] border-t border-white/5 pt-24 pb-12 md:pb-16 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
  
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Left Side: Brand & Copyright */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <div onClick={scrollToTop} className="flex items-center gap-3 cursor-pointer group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg shadow-purple-500/20">
                <Zap size={24} className="text-white fill-current" />
              </div>
              <span className="font-black text-3xl tracking-tighter text-white uppercase italic">SkillSignal</span>
            </div>
            <p className="text-slate-600 text-[10px] font-bold uppercase tracking-[0.3em] ml-1">
              © 2026 SkillSignal. All Rights Reserved.
            </p>
          </div>

          {/* Right Side: Developer Attribution */}
          <div className="flex flex-col items-center md:items-end gap-2 pr-0 md:pr-16">
            <span className="text-slate-500 text-[9px] font-black uppercase tracking-[0.5em] opacity-40">
              Engineered By
            </span>
            <p className="text-white font-[1000] text-lg uppercase tracking-[0.1em] italic group cursor-default">
              Shaunak <span className="text-purple-500 group-hover:text-cyan-400 transition-colors">Sikdar</span>
            </p>
          </div>
        </div>

        {/* Mobile Safety Spacer */}
        <div className="h-12 md:hidden" />
      </footer>

      {/* --- FLOATING BACK TO TOP --- */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[3000] w-12 h-12 bg-white text-black rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all group"
          >
            <ArrowUp size={20} strokeWidth={3} className="group-hover:-translate-y-1 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>
      
      <style>{`
        html { scroll-behavior: smooth; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
        .animate-gradient-x { background-size: 200% 200%; animation: gradient-x 10s linear infinite; }
        @keyframes gradient-x { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
      `}</style>
    </div>
  )
}