'use client';

import React from 'react';

export const TerminalBio = () => {
  return (
    <div className="border border-[#1a1a1e] bg-[#08080a] rounded-lg p-4 font-mono text-[11px] leading-relaxed shadow-xl">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#141417]">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
        </div>
        <span className="text-[10px] text-zinc-500 tracking-wider">lowkey@ashmit:~</span>
        <div className="flex gap-1 text-zinc-700 text-[10px]">•••</div>
      </div>
      <div className="space-y-1">
        <p className="text-purple-400 font-semibold">lowkey@ashmit:~$</p>
        <p className="text-zinc-600">{'{'}</p>
        <div className="pl-4 space-y-0.5">
          <p>
            <span className="text-purple-400">"name"</span>: <span className="text-emerald-400">"Ashmit Kumar"</span>,
          </p>
          <p>
            <span className="text-purple-400">"role"</span>: <span className="text-emerald-400">"Full Stack Developer"</span>,
          </p>
          <p>
            <span className="text-purple-400">"focus"</span>: [<span className="text-emerald-400">"Web"</span>, <span className="text-emerald-400">"Systems"</span>, <span className="text-emerald-400">"UI/UX"</span>],
          </p>
          <p>
            <span className="text-purple-400">"coffee"</span>: <span className="text-emerald-400">"∞"</span>,
          </p>
          <p>
            <span className="text-purple-400">"location"</span>: <span className="text-emerald-400">"Somewhere building the future"</span>
          </p>
        </div>
        <p className="text-zinc-600">{'}'}</p>
        <p className="text-purple-400 animate-pulse mt-1">{'>'}_</p>
      </div>
    </div>
  );
};