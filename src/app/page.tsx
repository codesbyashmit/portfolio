import React from 'react';
import { TerminalBio } from '@/components/TerminalBio';
import { GlitchedHeroImage } from '@/components/GlitchedHeroImage';
import { BottomStrip } from '@/components/BottomStrip';
import { Home, User, Briefcase, Code2, Edit3, Mail, ArrowDown } from 'lucide-react';
import { AboutWorkSection } from '@/components/AboutWorkSection';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-200 font-mono flex selection:bg-purple-600 selection:text-white overflow-hidden">
      <aside className="hidden lg:flex flex-col items-center justify-between py-6 w-14 border-r border-[#141417] bg-[#050505] fixed top-0 bottom-0 left-0 z-40">
        <div className="text-purple-500 font-black text-lg tracking-tight">AK/</div>
        <nav className="flex flex-col gap-6 text-zinc-600">
          <button className="text-purple-400 hover:text-purple-300 transition-colors"><Home size={16} /></button>
          <button className="hover:text-purple-400 transition-colors"><User size={16} /></button>
          <button className="hover:text-purple-400 transition-colors"><Briefcase size={16} /></button>
          <button className="hover:text-purple-400 transition-colors"><Code2 size={16} /></button>
          <button className="hover:text-purple-400 transition-colors"><Edit3 size={16} /></button>
          <button className="hover:text-purple-400 transition-colors"><Mail size={16} /></button>
        </nav>
        <div className="flex flex-col items-center gap-2 text-[9px] text-zinc-600 tracking-widest uppercase">
          <span className="rotate-180 [writing-mode:vertical-lr]">SCROLL</span>
          <ArrowDown size={10} className="animate-bounce text-purple-500" />
        </div>
      </aside>
      <div className="flex-1 lg:pl-14 flex flex-col min-w-0 min-h-screen">
        <header className="flex items-center justify-between px-6 lg:px-12 py-5 border-b border-[#141417] bg-[#050505]/90 backdrop-blur-md sticky top-0 z-30 h-[85px]">
          <div className="flex items-center gap-10">
            <span className="lg:hidden text-purple-500 font-black text-lg">AK/</span>
            <nav className="hidden md:flex items-center gap-8 text-[11px] text-zinc-400 tracking-wider">
              <a href="#home" className="text-purple-400 border-b-2 border-purple-500 pb-1 font-semibold">01_HOME</a>
              <a href="#about" className="hover:text-purple-400 transition-colors">02_ABOUT</a>
              <a href="#work" className="hover:text-purple-400 transition-colors">03_WORK</a>
              <a href="#stack" className="hover:text-purple-400 transition-colors">04_STACK</a>
              <a href="#logs" className="hover:text-purple-400 transition-colors">05_LOGS</a>
              <a href="#contact" className="hover:text-purple-400 transition-colors">06_CONTACT</a>
            </nav>
          </div>
          <button className="text-[11px] border border-purple-500/40 text-purple-400 px-5 py-2 hover:bg-purple-500/10 hover:border-purple-400 transition-all flex items-center gap-2 tracking-wide">
            <span>{'>'} LET'S CONNECT</span>
          </button>
        </header>
        <section className="px-6 lg:px-12 pt-4 lg:pt-6 pb-12 w-full relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full relative">
            <div className="lg:col-span-4 space-y-6 z-10">
              <div className="inline-flex items-center gap-2 text-[10px] text-purple-400 tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-ping" />
                // SYSTEM.STATUS: <span className="text-purple-400 font-bold">ONLINE</span>
              </div>

              <h1 className="font-[family-name:var(--font-chakra)] font-bold text-5xl sm:text-7xl xl:text-8xl tracking-tight uppercase leading-[0.88] text-white relative z-20">
                I TURN <br />
                <span className="text-purple-500 drop-shadow-[0_0_35px_rgba(168,85,247,0.3)]">IDEAS</span> <br />
                INTO <br />
                EXPERIENCES<span className="text-purple-500">_</span>
              </h1>

              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-sm font-sans relative z-20">
                Full Stack Developer crafting digital products that are <span className="text-white font-semibold">fast</span>, <span className="text-white font-semibold">scalable</span> and actually matter.
              </p>
    
              <div className="flex items-center gap-6 pt-2 text-[11px] relative z-20">
                <a href="#work" className="border border-purple-500/60 bg-purple-500/10 text-purple-300 px-6 py-3 hover:bg-purple-500 hover:text-black font-semibold transition-all">
                  {'>'} VIEW MY WORK
                </a>
                <span className="text-zinc-500 flex items-center gap-2">
                  {'>'} SCROLL TO EXPLORE ↓
                </span>
              </div>
            </div>
            <div className="lg:col-span-5 relative z-0 flex justify-center">
              <div className="lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 w-full lg:w-[120%] pointer-events-none flex items-center justify-center">
                <GlitchedHeroImage />
              </div>
            </div>
            <div className="lg:col-span-3 space-y-5 z-10">
              <div className="text-[10px] text-zinc-500 leading-tight">
                // BUILDING WITH PURPOSE<br />
                // CODING WITH PASSION
              </div>
              <TerminalBio />
              <div className="border border-[#1a1a1e] bg-[#0a0a0a] p-3.5 rounded-lg text-xs space-y-2">
                <div className="text-[9px] text-zinc-500 tracking-wider">NOW PLAYING</div>
                <div className="flex items-center gap-3">
                  <div className="h-6 flex items-end gap-0.5">
                    <span className="w-1 h-5 bg-purple-500 animate-bounce" />
                    <span className="w-1 h-3 bg-purple-500 animate-bounce [animation-delay:0.15s]" />
                    <span className="w-1 h-6 bg-purple-500 animate-bounce [animation-delay:0.3s]" />
                  </div>
                  <div>
                    <p className="text-white text-xs font-bold truncate">Dark Fantasy</p>
                    <p className="text-zinc-500 text-[10px]">Kanye West</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <BottomStrip />
        <AboutWorkSection />
      </div>
    </div>
  );
}