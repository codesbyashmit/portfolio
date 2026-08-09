import React from 'react';
import Image from 'next/image';
import { Globe } from 'lucide-react';
import { LiveClock } from './LiveClock';
import { db } from '@/db';
import { projects, statusLogs } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';

export const BottomStrip = async () => {
  const statusData = await db
    .select()
    .from(statusLogs)
    .where(eq(statusLogs.isActive, true))
    .limit(1);
  const featuredProjects = await db
    .select()
    .from(projects)
    .where(eq(projects.isFeatured, true))
    .orderBy(asc(projects.displayOrder))
    .limit(3);
  const currentStatus = statusData[0] || {
    currentFocus: 'Setting up the admin panel and database pipelines.',
    locationLabel: 'Earth',
  };

  return (
    <section className="px-6 lg:px-12 pb-12 space-y-6 border-t border-[#141417] pt-8 relative z-10 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="border border-[#1a1a1e] bg-[#0a0a0a] p-4 rounded-lg space-y-2">
          <div className="text-[10px] text-zinc-500 tracking-wider">// CURRENTLY</div>
          <p className="text-xs text-zinc-300 font-sans leading-relaxed">
            {currentStatus.currentFocus}
          </p>
        </div>
        <div className="border border-[#1a1a1e] bg-[#0a0a0a] p-4 rounded-lg space-y-2">
          <div className="text-[10px] text-zinc-500 tracking-wider">// LOCATION</div>
          <div className="flex items-center justify-between text-xs text-zinc-300">
            <span className="flex items-center gap-1.5">
              <Globe size={12} className="text-purple-400" /> {currentStatus.locationLabel}
            </span>
            <span className="text-zinc-500 text-[10px]">Milky Way</span>
          </div>
        </div>
        <div className="border border-[#1a1a1e] bg-[#0a0a0a] p-4 rounded-lg space-y-1">
          <div className="text-[10px] text-zinc-500 tracking-wider">// TIMEZONE</div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold text-purple-400 font-mono">
              <LiveClock />
            </span>
            <span className="text-[10px] text-zinc-500">IST (UTC +5:30)</span>
          </div>
        </div>
        <div className="border border-[#1a1a1e] bg-[#0a0a0a] p-4 rounded-lg space-y-2">
          <div className="flex justify-between items-center text-[10px] text-zinc-500 tracking-wider">
            <span>// TECH STACK</span>
            <span className="text-purple-400">(T3+)</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1 font-mono">
            <span>Next.js</span>
            <span>TypeScript</span>
            <span>Tailwind</span>
            <span>Postgres</span>
          </div>
        </div>

      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="lg:col-span-8 border border-[#1a1a1e] bg-[#0a0a0a] p-4 rounded-lg space-y-3">
          <div className="text-[10px] text-zinc-500 tracking-wider">// SELECTED WORK ({featuredProjects.length.toString().padStart(2, '0')})</div>
          
          {featuredProjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {featuredProjects.map((project, index) => (
                <a 
                  key={project.id} 
                  href={project.demoUrl || project.githubUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-[#141417] bg-[#050505] p-3 rounded text-xs space-y-1 hover:border-purple-500/50 transition-colors cursor-pointer group block"
                >
                  <span className="text-[10px] text-zinc-500 group-hover:text-purple-400 transition-colors">
                    0{index + 1}
                  </span>
                  <p className="font-bold text-white group-hover:text-purple-300 transition-colors uppercase truncate">
                    {project.title}
                  </p>
                  <p className="text-[10px] text-zinc-500 truncate">
                    {project.shortDescription}
                  </p>
                </a>
              ))}
            </div>
          ) : (
            <div className="h-[72px] flex items-center justify-center border border-dashed border-[#141417] text-xs text-zinc-600 rounded">
              Awaiting project data from admin panel...
            </div>
          )}
        </div>
        <div className="lg:col-span-4 border border-[#1a1a1e] bg-[#0a0a0a] p-5 rounded-lg flex flex-col justify-between">
          <p className="text-xs text-zinc-400 italic font-sans leading-relaxed">
            "Code is not just logic. It's design. It's intent. It's impact."
          </p>
          <div className="flex justify-end pt-2">
            <div className="relative w-full h-20 opacity-100 hover:opacity-100 transition-opacity">
              <Image
                src="https://res.cloudinary.com/nj4rcodl/image/upload/v1786275400/signature.png"
                alt="Ashmit"
                fill
                className="object-contain object-right drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]"
              />
            </div>
          </div>
        </div>

      </div>

    </section>
  );
};