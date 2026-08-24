'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
type Project = {
  id: string | number;
  title: string;
  shortDescription: string;
  coverImage?: string | null; 
  demoUrl?: string | null;
  githubUrl?: string | null;
  category?: string | null;
  subtitle?: string | null; 
};

export const WorkGrid = ({ projects }: { projects: Project[] }) => {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const filters = ['ALL', 'FULL STACK', 'WEB APPS', 'UI/UX', 'TOOLS', 'EXPERIMENTS'];

  const filteredProjects = projects.filter((project) => {
    if (activeFilter === 'ALL') return true;
    return project.category?.toUpperCase() === activeFilter;
  });

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
        <div className="lg:col-span-6 space-y-4">
          <div className="text-[10px] text-zinc-500 tracking-widest">// WORK.EXE</div>
          <h2 className="text-4xl sm:text-5xl font-bold font-[family-name:var(--font-chakra)] text-white">
            My <span className="text-purple-500">Creations_</span>
          </h2>
          <p className="text-xs text-zinc-400 leading-relaxed font-sans max-w-md">
            A collection of projects where ideas met execution. Solving problems, building products and crafting digital experiences.
          </p>
        </div>
        <div className="lg:col-span-6 flex flex-col lg:items-end space-y-8">
          <div className="flex flex-wrap gap-x-6 gap-y-4 text-[10px] font-mono tracking-widest lg:justify-end">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`relative pb-1 transition-colors ${
                  activeFilter === filter ? 'text-purple-400' : 'text-zinc-600 hover:text-zinc-400'
                }`}
              >
                {activeFilter === filter && (
                  <span className="absolute left-[-12px] text-purple-500">•</span>
                )}
                {filter}
                {activeFilter === filter && (
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-purple-500" />
                )}
              </button>
            ))}
          </div>
          <button className="text-[10px] text-purple-400 hover:text-purple-300 tracking-widest uppercase flex items-center gap-2">
            {'>'} VIEW ARCHIVE
          </button>
        </div>
      </div>
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <div key={project.id} className="border border-[#141417] bg-[#050505] flex flex-col group overflow-hidden">
              <div className="relative w-full h-[240px] border-b border-[#141417] bg-[#0a0a0a] overflow-hidden">
                {project.coverImage ? (
                  <Image
                    src={project.coverImage}
                    alt={project.title}
                    fill
                    className="object-cover opacity-70 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-zinc-800 text-xs font-mono">AWAITING_ASSET</div>
                )}
                <div className="absolute top-4 left-4 text-[10px] text-white font-bold tracking-widest z-10">
                  {(index + 1).toString().padStart(2, '0')}
                </div>
                    <div className="absolute top-4 right-4 text-[9px] border border-purple-500/30 bg-purple-500/10 text-purple-400 px-2 py-1 tracking-widest uppercase z-10">
                  {project.category || 'PROJECT'}
                </div>
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#050505] to-transparent z-0" />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h4 className="text-xl font-bold text-white mb-1 font-[family-name:var(--font-chakra)]">{project.title}</h4>
                <p className="text-[10px] text-purple-400 font-mono mb-4">{project.subtitle || 'Digital Experience'}</p>
                
                <p className="text-xs text-zinc-400 leading-relaxed mb-8 flex-1">
                  {project.shortDescription}
                </p>
                
                <div className="flex justify-between items-end mt-auto pt-4 border-t border-[#141417]/50">
                  <div className="flex gap-2 text-zinc-500">
                    <div className="w-5 h-5 border border-[#141417] bg-[#0a0a0a] flex items-center justify-center rounded-[2px] text-[8px]">TS</div>
                    <div className="w-5 h-5 border border-[#141417] bg-[#0a0a0a] flex items-center justify-center rounded-[2px] text-[8px]">N</div>
                  </div>
                  <a href={project.demoUrl || project.githubUrl || '#'} target="_blank" rel="noopener noreferrer" className="text-[10px] text-purple-400 hover:text-purple-300 tracking-widest uppercase flex items-center gap-1.5 transition-colors">
                    {project.demoUrl ? 'VIEW PROJECT' : 'VIEW CODE'} <ArrowUpRight size={12} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="h-64 flex flex-col items-center justify-center border border-dashed border-[#141417] rounded bg-[#0a0a0a]">
          <span className="text-purple-500 mb-2 animate-pulse">_</span>
          <p className="text-xs text-zinc-500 font-mono">No projects found for {activeFilter}.</p>
          <p className="text-[10px] text-zinc-600 font-mono mt-1">Awaiting payload from admin panel.</p>
        </div>
      )}
      <div className="flex flex-col items-center justify-center text-center border-t border-[#141417] pt-16 mt-12 w-full relative">
        <div className="relative inline-flex flex-col items-center text-center px-8 md:px-16">
          <span className="absolute -top-6 left-0 text-6xl text-purple-500/30 font-serif leading-none">“</span>
          
          <p className="text-lg md:text-2xl text-zinc-300 font-mono tracking-wide leading-relaxed z-10 relative">
            I don't just write code. <span className="text-purple-400 font-semibold">I engineer experiences.</span>
          </p>
          <p className="text-sm md:text-base text-zinc-500 font-mono mt-3 z-10 relative">
            Each project is a step towards something bigger.
          </p>

          <span className="absolute -bottom-8 right-8 text-6xl text-purple-500/30 font-serif leading-none">”</span>
          <div className="absolute -bottom-10 md:-bottom-14 -right-4 md:-right-16 w-64 h-24 opacity-80 hover:opacity-100 transition-opacity z-20 -rotate-3 pointer-events-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://res.cloudinary.com/nj4rcodl/image/upload/v1786429482/copy_of_signature.png"
              alt="Signature"
              className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};