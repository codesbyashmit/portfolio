import React from 'react';
import Image from 'next/image';
import { ArrowRight, Mail } from 'lucide-react';
import { db } from '@/db';
import { projects } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';
async function getGithubData() {
  const username = process.env.GITHUB_USERNAME;
  const token = process.env.GITHUB_TOKEN;

  if (!username || !token) return { heatmap: null, totalCommits: 0 };

  const headers = {
    Authorization: `bearer ${token}`,
    "Content-Type": "application/json",
  };

  const query = `query {
    user(login: "${username}") {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
            }
          }
        }
      }
    }
  }`;

  try {
    const [graphRes, searchRes] = await Promise.all([
      fetch("https://api.github.com/graphql", {
        method: "POST",
        headers,
        body: JSON.stringify({ query }),
        next: { revalidate: 3600 }, 
      }),
      fetch(`https://api.github.com/search/commits?q=author:${username}`, {
        headers: { ...headers, Accept: "application/vnd.github.cloak-preview+json" },
        next: { revalidate: 3600 }, 
      })
    ]);

    const graphData = await graphRes.json();
    const searchData = await searchRes.json();

    const calendar = graphData?.data?.user?.contributionsCollection?.contributionCalendar;
    const totalCommits = searchData?.total_count || calendar?.totalContributions || 0;

    return { heatmap: calendar, totalCommits };
  } catch (error) {
    console.error("Error fetching GitHub data", error);
    return { heatmap: null, totalCommits: 0 };
  }
}

export const AboutWorkSection = async () => {
  const featuredProjects = await db
    .select()
    .from(projects)
    .where(eq(projects.isFeatured, true))
    .orderBy(asc(projects.displayOrder));
  const { heatmap, totalCommits } = await getGithubData();
  const allWeeks = heatmap?.weeks || [];

  const renderProgressBar = (percentage: number) => {
    const totalBlocks = 40;
    const filledBlocks = Math.floor((percentage / 100) * totalBlocks);
    
    return (
      <div className="flex gap-px mt-2">
        {Array.from({ length: totalBlocks }).map((_, i) => (
          <div 
            key={i} 
            className={`h-1.5 flex-1 ${i < filledBlocks ? 'bg-purple-500 shadow-[0_0_5px_#a855f7]' : 'bg-[#141417]'}`}
          />
        ))}
      </div>
    );
  };

  const renderGithubGraph = () => {
    if (!allWeeks.length) {
      return (
        <div className="text-[10px] text-zinc-600 flex items-center h-full ml-4">
          Github configuration missing.
        </div>
      );
    }
    const allDays = allWeeks.flatMap((week: any) => week.contributionDays);
    if (!allDays.length) return null;
    const firstDayDate = new Date(allDays[0].date);
    const firstDayOfWeek = firstDayDate.getDay(); // 0 = sun, 1 = mon and so on 
    const padCount = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    
    const paddedDays = Array(padCount).fill(null).concat(allDays);
    const weeks: any[][] = [];
    for (let i = 0; i < paddedDays.length; i += 7) {
        weeks.push(paddedDays.slice(i, i + 7));
    }

    const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return (
      <div className="flex w-full overflow-x-auto custom-scrollbar pb-4 pt-2">
          <div className="flex flex-col gap-1 text-[10px] text-zinc-500 mt-6 pr-3 shrink-0 text-right">
          {dayLabels.map(label => (
            <span key={label} className="h-3 leading-3">{label}</span>
          ))}
        </div>
        <div className="flex flex-col relative w-full">
          <div className="h-4 relative w-full mb-2">
            {weeks.map((week, i) => {
              const firstValidDay = week.find((d: any) => d !== null);
              if (!firstValidDay) return null;
              
              const monthStr = new Date(firstValidDay.date).toLocaleString('en-US', { month: 'short' });
              
              let isNewMonth = false;
              if (i === 0) {
                  isNewMonth = true;
              } else {
                  const prevValidDay = weeks[i-1].find((d: any) => d !== null);
                  if (prevValidDay) {
                      const prevMonthStr = new Date(prevValidDay.date).toLocaleString('en-US', { month: 'short' });
                      if (monthStr !== prevMonthStr) isNewMonth = true;
                  }
              }
              
              if (isNewMonth) {
                return (
                  <span 
                    key={`month-${i}`} 
                    className="absolute text-[10px] text-zinc-500" 
                    style={{ left: `${i * 16}px` }} 
                  >
                    {monthStr}
                  </span>
                );
              }
              return null;
            })}
          </div>
          <div className="flex gap-1">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1 shrink-0">
                {week.map((dayData, dayIndex) => {
                  if (!dayData) {
                    return <div key={dayIndex} className="w-3 h-3 rounded-sm bg-transparent" />;
                  }

                  const count = dayData.contributionCount || 0;
                  const dateStr = dayData.date || '';

                  let bg = 'bg-[#141417]';
                  if (count >= 10) bg = 'bg-purple-400 shadow-[0_0_6px_#a855f7]';
                  else if (count >= 5) bg = 'bg-purple-600';
                  else if (count >= 2) bg = 'bg-purple-800';
                  else if (count === 1) bg = 'bg-purple-900/60';

                  return (
                    <div 
                      key={dayIndex} 
                      title={`${count} contributions on ${dateStr}`}
                      className={`w-3 h-3 rounded-sm ${bg} transition-colors duration-200 hover:border hover:border-purple-400 cursor-crosshair`} 
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full space-y-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 border border-[#141417] bg-[#050505] p-8 flex flex-col justify-between relative group">
          <div className="space-y-6">
            <div className="text-[10px] text-zinc-500 tracking-widest">// ABOUT_ME</div>
            <h2 className="text-3xl font-bold font-[var(--font-chakra)] leading-snug">
              Crafting digital experiences that <span className="text-purple-400">solve real problems.</span>
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed font-sans">
I’m Ashmit. An engineer, developer, and builder who likes creating things that sit at the intersection of technology and design. From web applications and interfaces to hardware and emerging technologies, I’m driven by curiosity and the urge to understand how things work, then build something better.
            </p>
          </div>
          <div className="pt-8">
            <button className="text-xs text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-2 group-hover:translate-x-2 duration-300">
              {'>'} READ MORE ABOUT ME
            </button>
            <div className="absolute bottom-4 left-4 w-2 h-2 border-b border-l border-purple-500/50"></div>
            <div className="absolute bottom-4 right-4 w-2 h-2 border-b border-r border-purple-500/50"></div>
          </div>
        </div>
        <div className="lg:col-span-4 border border-[#141417] bg-[#050505] p-8 space-y-6">
          <div className="text-[10px] text-zinc-500 tracking-widest">// SKILLS_OVERVIEW</div>
          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-xs text-zinc-300 mb-1">
                <span className="flex items-center gap-2"><span className="w-1 h-1 bg-purple-500"></span> TypeScript / Next.js</span>
                <span>95%</span>
              </div>
              {renderProgressBar(95)}
            </div>
            <div>
              <div className="flex justify-between text-xs text-zinc-300 mb-1">
                <span className="flex items-center gap-2"><span className="w-1 h-1 bg-purple-500"></span> Supabase / PostgreSQL</span>
                <span>90%</span>
              </div>
              {renderProgressBar(90)}
            </div>
            <div>
              <div className="flex justify-between text-xs text-zinc-300 mb-1">
                <span className="flex items-center gap-2"><span className="w-1 h-1 bg-purple-500"></span> UI / UX / Tailwind</span>
                <span>85%</span>
              </div>
              {renderProgressBar(85)}
            </div>
            <div>
              <div className="flex justify-between text-xs text-zinc-300 mb-1">
                <span className="flex items-center gap-2"><span className="w-1 h-1 bg-purple-500"></span> Linux / Bash / Systems</span>
                <span>85%</span>
              </div>
              {renderProgressBar(85)}
            </div>
            <div>
              <div className="flex justify-between text-xs text-zinc-300 mb-1">
                <span className="flex items-center gap-2"><span className="w-1 h-1 bg-purple-500"></span> Rust / Tauri</span>
                <span>75%</span>
              </div>
              {renderProgressBar(75)}
            </div>
          </div>
        </div>
        <div className="lg:col-span-4 border border-[#141417] bg-[#050505] relative overflow-hidden group p-8 flex flex-col justify-between">
          <div className="relative z-10 space-y-4">
            <div className="text-[10px] text-zinc-500 tracking-widest">// PHILOSOPHY</div>
            <h3 className="text-2xl font-serif italic leading-tight text-white mt-4">
              "Simplicity is<br />
              <span className="text-purple-400">the ultimate<br />sophistication."</span>
            </h3>
          </div>
          
          <div className="relative z-10 pt-16">
            <button className="text-xs text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-2 group-hover:translate-x-2 duration-300">
              {'>'} VIEW MY MANIFESTO
            </button>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-purple-500/50"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-purple-500/50"></div>
          </div>
        </div>
      </div>
      <div className="border border-[#141417] bg-[#050505] p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div className="text-[10px] text-zinc-500 tracking-widest">// FEATURED_PROJECTS</div>
          {featuredProjects.length > 0 && (
            <button className="text-[10px] text-purple-400 hover:text-purple-300 tracking-widest uppercase">
              {'>'} VIEW ALL PROJECTS
            </button>
          )}
        </div>
        {featuredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProjects.map((project, index) => (
              <a 
                key={project.id}
                href={project.demoUrl || project.githubUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-[#141417] bg-[#0a0a0a] p-5 rounded-sm relative group overflow-hidden cursor-pointer hover:border-purple-500/40 transition-colors block"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] text-zinc-500">{(index + 1).toString().padStart(2, '0')}</span>
                </div>
                <h4 className="text-lg font-bold text-white mb-1">{project.title}</h4>
                <p className="text-[11px] text-zinc-400 mb-4 h-12 overflow-hidden">{project.shortDescription}</p>
                <ArrowRight size={14} className="absolute bottom-5 right-5 text-purple-500 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
              </a>
            ))}
          </div>
        ) : (
          <div className="h-48 flex flex-col items-center justify-center border border-dashed border-[#141417] rounded bg-[#0a0a0a]">
            <span className="text-purple-500 mb-2 animate-pulse">_</span>
            <p className="text-xs text-zinc-500 font-mono">No projects featured yet.</p>
            <p className="text-[10px] text-zinc-600 font-mono mt-1">Awaiting data from admin panel.</p>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 border border-[#141417] bg-[#050505] p-6 flex flex-col justify-between overflow-hidden">
          <div>
            <div className="text-[10px] text-zinc-500 tracking-widest mb-4">// GITHUB_ACTIVITY</div>
            {renderGithubGraph()}
          </div>
          <div className="flex justify-between items-center text-[10px] text-zinc-400 pt-4 border-t border-[#141417] mt-4">
            <a href={`https://github.com/${process.env.GITHUB_USERNAME}`} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">
              {'>'} github.com/{process.env.GITHUB_USERNAME || 'AshmitKumar'}
            </a>
            <span>Total Commits: {totalCommits.toLocaleString()}+</span>
          </div>
        </div>
        <div className="lg:col-span-4 border border-[#141417] bg-[#050505] p-8 relative overflow-hidden flex flex-col justify-center">
          <div className="relative z-10 space-y-4">
            <div className="text-[10px] text-zinc-500 tracking-widest">// LET'S_BUILD_SOMETHING_AMAZING</div>
            <h3 className="text-3xl font-bold font-sans text-white leading-tight">
              Got an idea?<br />
              <span className="text-purple-400">Let's turn it into<br />something real.</span>
            </h3>
            <button className="mt-4 border border-purple-500/50 text-purple-400 text-xs px-6 py-3 hover:bg-purple-500 hover:text-black transition-colors">
              {'>'} START A PROJECT
            </button>
          </div>
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute top-1/2 -right-12 -translate-y-1/2 w-48 h-48 border border-purple-500/20 rounded-full pointer-events-none animate-[spin_10s_linear_infinite]"></div>
          <div className="absolute top-1/2 -right-12 -translate-y-1/2 w-32 h-32 border border-purple-500/40 rounded-full pointer-events-none animate-[spin_7s_linear_infinite_reverse] border-dashed"></div>
        </div>

      </div>
    </div>
  );
};