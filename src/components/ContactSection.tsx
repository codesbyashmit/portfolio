'use client';

import React, { useState, useEffect } from 'react';
import { submitContactForm } from '@/actions/contact';
import { Terminal, Activity } from 'lucide-react';

export const ContactSection = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [time, setTime] = useState('');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');

    const formData = new FormData(e.currentTarget);
    const response = await submitContactForm(formData);

    if (response.error) {
      setStatus('error');
    } else {
      setStatus('success');
      (e.target as HTMLFormElement).reset();
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <div className="w-full space-y-6 relative z-10">
        <div className="border border-[#141417] bg-[#050505] p-6 md:p-12 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2 text-purple-500 font-mono text-[10px] mb-4">
            <Terminal size={14} /> <span>~/system/contact.exe</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-bold font-[family-name:var(--font-chakra)] text-white leading-none">
            Initiate <br/><span className="text-purple-500">Handshake_</span>
          </h2>
        </div>
        <p className="text-xs text-zinc-400 font-mono max-w-xs md:text-right relative z-10">
          Got a project in mind, a system to architect, or just want to talk tech? Send a payload directly to my local server.
        </p>
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#a855f7 1px, transparent 1px), linear-gradient(90deg, #a855f7 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
                <div className="xl:col-span-8 border border-[#141417] bg-[#050505] overflow-hidden flex flex-col">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-[#141417] bg-[#0a0a0a]">
            <div className="flex gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500/20 border border-rose-500/50"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/50"></div>
            </div>
            <div className="text-[10px] text-zinc-500 font-mono">transmission.ts</div>
            <div className="w-8"></div> 
          </div>
                    <div className="p-6 font-mono text-xs sm:text-sm overflow-x-auto flex-1 flex">
            
            <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
              <div className="flex flex-1">
                <div className="flex flex-col text-zinc-700 select-none pr-4 sm:pr-6 text-right border-r border-[#141417] mr-4 sm:mr-6">
                  {[...Array(20)].map((_, i) => (
                    <span key={i} className="h-7 flex items-center justify-end">{i + 1}</span>
                  ))}
                </div>
                <div className="flex-1 min-w-[300px] flex flex-col text-[13px]">
                 <div className="h-7 flex items-center whitespace-nowrap">
                    <span className="text-purple-400">import</span> <span className="text-blue-400 ml-2 mr-2">{'{'}</span> <span className="text-white">API</span><span className="text-zinc-500">,</span> <span className="text-white ml-2">type Payload</span> <span className="text-blue-400 ml-2 mr-2">{'}'}</span> <span className="text-purple-400">from</span> <span className="text-emerald-400 ml-2">'@/core/network'</span><span className="text-zinc-500">;</span>
                  </div>
                      <div className="h-7 flex items-center whitespace-nowrap">
                    <span className="text-purple-400">import</span> <span className="text-blue-400 ml-2 mr-2">{'{'}</span> <span className="text-white">encrypt</span> <span className="text-blue-400 ml-2 mr-2">{'}'}</span> <span className="text-purple-400">from</span> <span className="text-emerald-400 ml-2">'@/utils/security'</span><span className="text-zinc-500">;</span>
                  </div>
                  <div className="h-7"></div>
                  <div className="h-7 flex items-center text-zinc-500 whitespace-nowrap">
                    // Initialize secure connection protocol
                  </div>
                  <div className="h-7 flex items-center whitespace-nowrap">
                    <span className="text-purple-400">const</span> <span className="text-blue-400 ml-2 mr-2">config</span> <span className="text-purple-400 mr-2">=</span> <span className="text-yellow-400 mr-2">{'{'}</span> <span className="text-cyan-300">encryption</span><span className="text-purple-400">:</span> <span className="text-emerald-400 ml-2">'RSA-2048'</span><span className="text-zinc-500">,</span> <span className="text-cyan-300 ml-2">priority</span><span className="text-purple-400">:</span> <span className="text-emerald-400 ml-2">'high'</span> <span className="text-yellow-400 ml-2">{'}'}</span><span className="text-zinc-500">;</span>
                  </div>
                  <div className="h-7"></div>
                  <div className="h-7 flex items-center whitespace-nowrap">
                    <span className="text-purple-400">const</span> <span className="text-blue-400 ml-2">transmission</span><span className="text-purple-400">:</span> <span className="text-teal-400 ml-2 mr-2">Payload</span> <span className="text-purple-400 mr-2">=</span> <span className="text-yellow-400">{'{'}</span>
                  </div>
                  <div className="pl-6 border-l border-zinc-800/50 ml-1.5 flex flex-col">
                      <div className="h-7 flex items-center group">
                      <span className="text-cyan-300 w-20 shrink-0">sender</span><span className="text-purple-400 mr-2">:</span>
                      <span className="text-emerald-400">"</span>
                      <input 
                        type="text" 
                        name="name" 
                        required 
                        disabled={status === 'loading' || status === 'success'}
                        placeholder="Enter Your Name "
                        className="bg-transparent text-emerald-400 focus:outline-none focus:bg-emerald-400/10 transition-colors h-full px-1 w-full max-w-[250px] disabled:opacity-50 placeholder:text-emerald-900/50"
                      />
                      <span className="text-emerald-400">"</span><span className="text-zinc-500">,</span>
                    </div>
                    <div className="h-7 flex items-center group">
                      <span className="text-cyan-300 w-20 shrink-0">replyTo</span><span className="text-purple-400 mr-2">:</span>
                      <span className="text-emerald-400">"</span>
                      <input 
                        type="email" 
                        name="email" 
                        required 
                        disabled={status === 'loading' || status === 'success'}
                        placeholder="Enter Your Email "
                        className="bg-transparent text-emerald-400 focus:outline-none focus:bg-emerald-400/10 transition-colors h-full px-1 w-full max-w-[250px] disabled:opacity-50 placeholder:text-emerald-900/50"
                      />
                      <span className="text-emerald-400">"</span><span className="text-zinc-500">,</span>
                    </div>
                    <div className="h-7 flex items-center group">
                      <span className="text-cyan-300 w-20 shrink-0">subject</span><span className="text-purple-400 mr-2">:</span>
                      <span className="text-emerald-400">"</span>
                      <input 
                        type="text" 
                        name="subject" 
                        required 
                        disabled={status === 'loading' || status === 'success'}
                        placeholder="Project Inquiry"
                        className="bg-transparent text-emerald-400 focus:outline-none focus:bg-emerald-400/10 transition-colors h-full px-1 w-full max-w-[250px] disabled:opacity-50 placeholder:text-emerald-900/50"
                      />
                      <span className="text-emerald-400">"</span><span className="text-zinc-500">,</span>
                    </div>
                    <div className="h-[84px] flex w-full relative">
                      <div className="h-7 flex items-center shrink-0 w-[96px]">
                        <span className="text-cyan-300 w-20 shrink-0">message</span><span className="text-purple-400 mr-2">:</span>
                        <span className="text-emerald-400">`</span>
                      </div>
                      <textarea 
                        name="content" 
                        required 
                        disabled={status === 'loading' || status === 'success'}
                        placeholder="Type your message here..."
                        className="bg-transparent text-emerald-400 focus:outline-none focus:bg-emerald-400/10 transition-colors px-1 w-full max-w-[350px] h-[84px] leading-7 resize-none custom-scrollbar disabled:opacity-50 placeholder:text-emerald-900/50"
                      />
                    </div>
                    <div className="h-7 flex items-center pl-[96px]">
                      <span className="text-emerald-400">`</span><span className="text-zinc-500">,</span>
                    </div>
                    <div className="h-7 flex items-center">
                      <span className="text-cyan-300 w-20 shrink-0">timestamp</span><span className="text-purple-400 mr-2">:</span>
                      <span className="text-white">Date</span><span className="text-zinc-500">.</span><span className="text-blue-300">now</span><span className="text-zinc-500">()</span>
                    </div>
                  </div>
                  <div className="h-7 flex items-center">
                    <span className="text-yellow-400">{'}'}</span><span className="text-zinc-500">;</span>
                  </div>
                  <div className="h-7"></div>
                  <div className="h-7 flex items-center text-zinc-500 whitespace-nowrap">
                    // Awaiting execution authorization...
                  </div>
                  <div className="h-14 flex flex-col items-center justify-center relative">
                    <button 
                      type="submit" 
                      disabled={status === 'loading' || status === 'success'}
                      className={`h-9 px-8 border transition-all duration-300 flex items-center justify-center gap-2 group w-full sm:w-auto min-w-[300px]
                        ${status === 'success' ? 'border-emerald-500/50 text-emerald-500 bg-emerald-500/10' : 
                          status === 'error' ? 'border-rose-500/50 text-rose-500 bg-rose-500/10' :
                        'border-purple-500/30 text-purple-400 hover:bg-purple-500 hover:text-black hover:shadow-[0_0_15px_rgba(168,85,247,0.4)]'}
                        disabled:cursor-not-allowed`}
                    >
                      {status === 'idle' && (
                        <>
                          <span className="text-purple-400 group-hover:text-black transition-colors">await</span> 
                          <span className="text-white group-hover:text-black transition-colors">API.send</span>
                          <span className="text-blue-400 group-hover:text-black transition-colors">(</span>
                          <span className="text-cyan-300 group-hover:text-black transition-colors">encrypt</span>
                          <span className="text-blue-400 group-hover:text-black transition-colors">(</span>
                          <span className="text-white group-hover:text-black transition-colors">transmission</span>
                          <span className="text-zinc-500 group-hover:text-black transition-colors">,</span>
                          <span className="text-cyan-300 ml-1 group-hover:text-black transition-colors">config</span>
                          <span className="text-blue-400 group-hover:text-black transition-colors">))</span>
                        </>
                      )}
                      {status === 'loading' && <span className="animate-pulse tracking-widest">// EXECUTING...</span>}
                      {status === 'success' && <span>// 200 OK: PAYLOAD DELIVERED</span>}
                      {status === 'error' && <span>// 500 ERR: TRANSMISSION FAILED</span>}
                    </button>
                  </div>

                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="xl:col-span-4 flex flex-col gap-6">
                    <div className="border border-[#141417] bg-[#050505] p-6 flex flex-col relative overflow-hidden">
            <div className="text-[10px] text-zinc-500 tracking-widest mb-5 border-b border-[#141417] pb-2 flex justify-between items-center">
              <span>// SYS.STATUS</span>
              <Activity size={12} className="text-emerald-500" />
            </div>
            
            <div className="space-y-3 relative z-10 font-mono text-[10px]">
              <div className="flex justify-between items-center">
                <span className="text-zinc-600">UPTIME</span>
                <span className="text-zinc-300">99.99%</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-zinc-600">LATENCY</span>
                <span className="text-zinc-300">12ms</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-zinc-600">ENCRYPTION</span>
                <span className="text-zinc-300">RSA-2048</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-zinc-600">SYS_TIME</span>
                <span className="text-emerald-400 flex items-center justify-end gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_4px_#10b981]"></span>
                  {time || '...'}
                </span>
              </div>

              <div className="pt-3 mt-3 border-t border-[#141417]">
                <div className="text-purple-400 text-center border border-purple-500/30 bg-purple-500/10 py-1.5">
                  [ ACCEPTING_REQUESTS ]
                </div>
              </div>
            </div>
          </div>
          <div className="border border-[#141417] bg-[#050505] p-6 px-8 flex-1 flex flex-col items-center justify-center relative overflow-hidden group text-center">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <p className="text-sm sm:text-base font-mono text-zinc-300 leading-relaxed relative z-10 italic">
              "Every great developer you know got there by solving problems they were unqualified to solve until they actually did it."
            </p>
            <p className="text-[10px] text-zinc-500 mt-4 font-mono relative z-10 uppercase tracking-widest">
              — Patrick McKenzie
            </p>
            <div className="absolute -bottom-4 -right-4 text-8xl text-zinc-800/10 font-serif pointer-events-none">"</div>
            <div className="absolute -top-4 -left-4 text-8xl text-zinc-800/10 font-serif pointer-events-none rotate-180">"</div>
          </div>
          <div className="grid grid-cols-2 gap-4 shrink-0">
              <a href="https://github.com/codesbyashmit" target="_blank" rel="noopener noreferrer" 
              className="border border-[#141417] bg-[#050505] p-4 flex items-center gap-3 hover:border-zinc-400 hover:bg-[#0a0a0a] transition-all group relative overflow-hidden">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500 group-hover:text-white transition-colors relative z-10 shrink-0"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.03c3.15-.38 6.5-1.4 6.5-7.17a5.2 5.2 0 0 0-1.5-3.81 5.2 5.2 0 0 0-.1-3.82s-1.1-.35-3.5 1.2a11.5 11.5 0 0 0-6 0C6.1 1.3 5 1.65 5 1.65a5.2 5.2 0 0 0-.1 3.82A5.2 5.2 0 0 0 3 9.28c0 5.76 3.35 6.79 6.5 7.17A4.8 4.8 0 0 0 8 19.5v2.5"></path></svg>
              <span className="text-[10px] font-mono tracking-widest text-zinc-400 group-hover:text-white relative z-10">GITHUB</span>
              <div className="absolute inset-0 bg-gradient-to-r from-zinc-800/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </a>
            <a href="https://www.linkedin.com/in/ashmit-kumar-a24769381/" target="_blank" rel="noopener noreferrer" 
              className="border border-[#141417] bg-[#050505] p-4 flex items-center gap-3 hover:border-[#0A66C2] hover:bg-[#0a0a0a] transition-all group relative overflow-hidden">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500 group-hover:text-[#0A66C2] transition-colors relative z-10 shrink-0"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              <span className="text-[10px] font-mono tracking-widest text-zinc-400 group-hover:text-[#0A66C2] relative z-10">LINKEDIN</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#0A66C2]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </a>
            <a href="https://x.com/" target="_blank" rel="noopener noreferrer" 
              className="border border-[#141417] bg-[#050505] p-4 flex items-center gap-3 hover:border-white hover:bg-[#0a0a0a] transition-all group relative overflow-hidden">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-zinc-500 group-hover:text-white transition-colors relative z-10 shrink-0">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 4.15H5.078z"/>
              </svg>
              <span className="text-[10px] font-mono tracking-widest text-zinc-400 group-hover:text-white relative z-10">TWITTER</span>
              <div className="absolute inset-0 bg-gradient-to-r from-zinc-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </a>
            <a href="work.ashmitkumar@gmail.com" 
              className="border border-[#141417] bg-[#050505] p-4 flex items-center gap-3 hover:border-rose-500 hover:bg-[#0a0a0a] transition-all group relative overflow-hidden">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500 group-hover:text-rose-500 transition-colors relative z-10 shrink-0"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              <span className="text-[10px] font-mono tracking-widest text-zinc-400 group-hover:text-rose-500 relative z-10">EMAIL</span>
              <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </a>

          </div>

        </div>
      </div>
      <footer className="w-full border-t border-[#141417] mt-12 pt-8 pb-8 flex justify-center items-center text-[10px] font-mono text-zinc-500">
        <div className="flex items-center gap-2">
           <span className="text-purple-500">©</span> 2026 Ashmit Kumar. All rights reserved.
        </div>
      </footer>
    </div>
  );
};