/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';

export const StackSection = () => {
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1 mt-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={8}
            className={`${
              star <= rating
                ? 'fill-purple-500 text-purple-500'
                : 'fill-transparent text-zinc-700'
            }`}
          />
        ))}
      </div>
    );
  };

  const renderProgress = (percentage: number) => {
    return (
      <div className="w-full h-[2px] bg-[#141417] mt-3">
        <div 
          className="h-full bg-purple-500 shadow-[0_0_5px_#a855f7]" 
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  };

  return (
    <div className="w-full space-y-8 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center border border-[#141417] bg-[#050505] p-8">
        <div className="lg:col-span-4 space-y-6 z-10">
          <div className="text-[10px] text-zinc-500 tracking-widest">// SYSTEM.STACK</div>
          <h2 className="text-4xl font-bold font-[family-name:var(--font-chakra)] text-white">
            My <span className="text-purple-400">Tech_Stack_</span>
          </h2>
          <p className="text-xs text-zinc-400 leading-relaxed font-sans max-w-sm">
            A curated collection of technologies, frameworks, and tools I use to build robust, scalable, and high-performance digital experiences.
          </p>
          <div className="inline-block mt-4 border border-purple-500/30 bg-purple-500/5 px-4 py-2 font-mono text-[10px] text-purple-300">
            {'>'} const stack = skills.map(passion =&gt; expertise)
          </div>
        </div>
        <div className="lg:col-span-4 relative flex justify-center items-center h-[300px] z-0">
          <div className="absolute inset-0 w-full h-full opacity-60 mix-blend-screen pointer-events-none">
            <Image
              src="/image-hero.png"
              alt="hero"
              fill
              className="object-contain object-center scale-122"
            />
            <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#050505] opacity-80" />
          </div>
        </div>
        <div className="lg:col-span-4 z-10">
          <div className="border border-[#1a1a1e] bg-[#08080a] rounded-lg p-5 font-mono text-[10px] leading-relaxed shadow-xl">
            <div className="flex justify-end gap-1.5 mb-4 pb-3 border-b border-[#141417]">
              <span className="w-2 h-2 rounded-full border border-zinc-600" />
              <span className="w-2 h-2 rounded-full border border-zinc-600" />
              <span className="w-2 h-2 rounded-full border border-zinc-600" />
            </div>
            <div className="space-y-1.5">
              <p className="text-purple-400 font-semibold">codesby@ashmit:~$ <span className="text-zinc-300">cat stack.json</span></p>
              <p className="text-zinc-600">{'{'}</p>
              <div className="pl-4 space-y-1">
                <p><span className="text-zinc-400">"passion"</span>: <span className="text-emerald-400">"System Architecture"</span>,</p>
                <p><span className="text-zinc-400">"drive"</span>: <span className="text-emerald-400">"Building Impactful Things"</span>,</p>
                <p><span className="text-zinc-400">"weapon"</span>: <span className="text-emerald-400">"Arch Linux / Neovim"</span>,</p>
                <p><span className="text-zinc-400">"mission"</span>: <span className="text-emerald-400">"Ship. Learn. Repeat."</span>,</p>
                <p><span className="text-zinc-400">"status"</span>: <span className="text-emerald-400">"Always Improving"</span></p>
              </div>
              <p className="text-zinc-600">{'}'}</p>
              <p className="text-purple-400 mt-2">codesby@ashmit:~$ <span className="animate-blink">█</span></p>
            </div>
          </div>
        </div>

      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
          <div className="text-[10px] text-zinc-500 tracking-widest">  // LANGUAGES</div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { name: 'TypeScript', icon: 'typescript/white', color: 'bg-blue-600', rating: 5, pct: 95 },
              { name: 'JavaScript', icon: 'javascript/black', color: 'bg-yellow-400', rating: 5, pct: 95 },
              { name: 'Python', icon: 'python/white', color: 'bg-blue-500', rating: 4, pct: 80 },
              { name: 'C / C++', icon: 'cplusplus/white', color: 'bg-indigo-600', rating: 4, pct: 75 },
              { name: 'Rust', icon: 'rust/white', color: 'bg-orange-700', rating: 3, pct: 60 },
            ].map((tech, i) => (
              <div key={i} className="border border-[#141417] bg-[#0a0a0a] p-3 rounded-sm flex flex-col justify-between hover:border-purple-500/30 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-5 h-5 rounded-[2px] flex items-center justify-center p-[3px] ${tech.color}`}>
                    <img src={`https://cdn.simpleicons.org/${tech.icon}`} alt={tech.name} className="w-full h-full object-contain" />
                  </div>
                  <span className="text-[10px] font-bold text-zinc-200 truncate">{tech.name}</span>
                </div>
                <div>
                  {renderStars(tech.rating)}
                  {renderProgress(tech.pct)}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="text-[10px] text-zinc-500 tracking-widest">// FRAMEWORKS & LIBRARIES</div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { name: 'React', icon: 'react/22d3ee', color: 'bg-cyan-500/20 border border-cyan-500', rating: 5, pct: 95 },
              { name: 'Next.js', icon: 'nextdotjs/black', color: 'bg-white', rating: 5, pct: 95 },
              { name: 'Node.js', icon: 'nodedotjs/22c55e', color: 'bg-green-600/20 border border-green-500', rating: 4, pct: 85 },
              { name: 'Tauri', icon: 'tauri/eab308', color: 'bg-yellow-600/20 border border-yellow-500', rating: 4, pct: 75 },
              { name: 'Tailwind', icon: 'tailwindcss/38bdf8', color: 'bg-sky-500/20 border border-sky-500', rating: 5, pct: 90 },
            ].map((tech, i) => (
              <div key={i} className="border border-[#141417] bg-[#0a0a0a] p-3 rounded-sm flex flex-col justify-between hover:border-purple-500/30 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-5 h-5 rounded-[2px] flex items-center justify-center p-[3px] ${tech.color}`}>
                    <img src={`https://cdn.simpleicons.org/${tech.icon}`} alt={tech.name} className="w-full h-full object-contain" />
                  </div>
                  <span className="text-[10px] font-bold text-zinc-200 truncate">{tech.name}</span>
                </div>
                <div>
                  {renderStars(tech.rating)}
                  {renderProgress(tech.pct)}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="text-[10px] text-zinc-500 tracking-widest">// DATABASES & BACKEND</div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { name: 'PostgreSQL', icon: 'postgresql/60a5fa', color: 'bg-blue-500/20 border border-blue-500', rating: 5, pct: 90 },
              { name: 'Supabase', icon: 'supabase/34d399', color: 'bg-emerald-500/20 border border-emerald-500', rating: 5, pct: 90 },
              { name: 'MongoDB', icon: 'mongodb/22c55e', color: 'bg-green-600/20 border border-green-600', rating: 4, pct: 80 },
              { name: 'Drizzle ORM', icon: 'drizzle/facc15', color: 'bg-yellow-400/20 border border-yellow-400', rating: 4, pct: 85 },
              { name: 'Redis', icon: 'redis/f87171', color: 'bg-red-500/20 border border-red-500', rating: 3, pct: 60 },
            ].map((tech, i) => (
              <div key={i} className="border border-[#141417] bg-[#0a0a0a] p-3 rounded-sm flex flex-col justify-between hover:border-purple-500/30 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-5 h-5 rounded-[2px] flex items-center justify-center p-[3px] ${tech.color}`}>
                    <img src={`https://cdn.simpleicons.org/${tech.icon}`} alt={tech.name} className="w-full h-full object-contain" />
                  </div>
                  <span className="text-[10px] font-bold text-zinc-200 truncate">{tech.name}</span>
                </div>
                <div>
                  {renderStars(tech.rating)}
                  {renderProgress(tech.pct)}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="text-[10px] text-zinc-500 tracking-widest">// TOOLS & PLATFORMS</div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { name: 'Linux', icon: 'linux/black', color: 'bg-zinc-200', rating: 5, pct: 95 },
              { name: 'Git', icon: 'git/f97316', color: 'bg-orange-500/20 border border-orange-500', rating: 5, pct: 90 },
              { name: 'Docker', icon: 'docker/3b82f6', color: 'bg-blue-600/20 border border-blue-600', rating: 4, pct: 75 },
              { name: 'Vercel', icon: 'vercel/black', color: 'bg-white', rating: 5, pct: 95 },
              { name: 'Figma', icon: 'figma/f472b6', color: 'bg-pink-500/20 border border-pink-500', rating: 4, pct: 85 },
            ].map((tech, i) => (
              <div key={i} className="border border-[#141417] bg-[#0a0a0a] p-3 rounded-sm flex flex-col justify-between hover:border-purple-500/30 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-5 h-5 rounded-[2px] flex items-center justify-center p-[3px] ${tech.color}`}>
                    <img src={`https://cdn.simpleicons.org/${tech.icon}`} alt={tech.name} className="w-full h-full object-contain" />
                  </div>
                  <span className="text-[10px] font-bold text-zinc-200 truncate">{tech.name}</span>
                </div>
                <div>
                  {renderStars(tech.rating)}
                  {renderProgress(tech.pct)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
  );
};