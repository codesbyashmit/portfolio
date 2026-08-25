import 'server-only';
import { unstable_cache } from 'next/cache';
import React from 'react';
import Image from 'next/image';
import {
  GitCommit,
  BookOpen,
  Terminal,
  ChevronRight,
  FileCode2,
  PlusSquare,
  MinusSquare,
  Flame,
  CalendarDays,
} from 'lucide-react';

const SHOW_PRIVATE_REPOS = true;
type RawCommit = {
  repoName: string;
  isPrivate: boolean;
  message: string;
  hash: string;
  date: string;
  additions: number;
  deletions: number;
  files: number;
};

function pluralize(count: number, singular: string) {
  return `${count} ${singular}${count === 1 ? '' : 's'}`;
}
function computeCurrentStreak(weeks: any[]) {
  const days = weeks.flatMap((w: any) => w.contributionDays);
  let streak = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if ((days[i]?.contributionCount || 0) > 0) streak++;
    else break;
  }
  return streak;
}
function computeMostActiveDay(weeks: any[]) {
  const days = weeks.flatMap((w: any) => w.contributionDays);
  const totals: Record<string, number> = {};

  days.forEach((d: any) => {
    if (!d?.date) return;
    const dow = new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' });
    totals[dow] = (totals[dow] || 0) + (d.contributionCount || 0);
  });

  let best = '—';
  let bestVal = -1;
  Object.entries(totals).forEach(([day, total]) => {
    if (total > bestVal) {
      bestVal = total;
      best = day;
    }
  });

  return bestVal > 0 ? best : '—';
}
async function fetchGithubData(username: string, token: string) {
  const headers = {
    Authorization: `bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const query = `
    query ($login: String!) {
      user(login: $login) {
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
        repositories(first: 5, orderBy: { field: PUSHED_AT, direction: DESC }, ownerAffiliations: OWNER) {
          nodes {
            name
            isPrivate
          }
        }
      }
    }
  `;

  const graphRes = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables: { login: username } }),
  });
  const graphData = await graphRes.json();

  const calendar =
    graphData?.data?.user?.contributionsCollection?.contributionCalendar ?? null;
  const repoNodes = (graphData?.data?.user?.repositories?.nodes || []) as any[];
  const perRepoCommits = await Promise.all(
    repoNodes.map(async (repo) => {
      try {
        const res = await fetch(
          `https://api.github.com/repos/${username}/${repo.name}/commits?author=${encodeURIComponent(
            username
          )}&per_page=5`,
          { headers }
        );
        const data = await res.json();
        if (!Array.isArray(data)) return [];

        return data.map((item: any) => ({
          repoName: repo.name as string,
          isPrivate: Boolean(repo.isPrivate),
          message: (item.commit?.message ?? '').split('\n')[0] as string,
          hash: (item.sha ?? '').substring(0, 7) as string,
          date: new Date(item.commit?.author?.date ?? Date.now()).toISOString(),
          statsUrl: item.url as string,
        }));
      } catch {
        return [];
      }
    })
  );

  const topCommits = perRepoCommits
    .flat()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  const rawCommits: RawCommit[] = await Promise.all(
    topCommits.map(async (c) => {
      let additions = 0;
      let deletions = 0;
      let files = 0;

      try {
        const statRes = await fetch(c.statsUrl, { headers });
        const statData = await statRes.json();
        additions = statData.stats?.additions ?? 0;
        deletions = statData.stats?.deletions ?? 0;
        files = statData.files?.length ?? 0;
      } catch {
      }

      return {
        repoName: c.repoName,
        isPrivate: c.isPrivate,
        message: c.message,
        hash: c.hash,
        date: c.date,
        additions,
        deletions,
        files,
      };
    })
  );

  return { rawCommits, calendar };
}

const getCachedGithubData = unstable_cache(
  async () => {
    const username = process.env.GITHUB_USERNAME;
    const token = process.env.GITHUB_TOKEN;
    if (!username || !token) return { rawCommits: [], calendar: null };
    return fetchGithubData(username, token);
  },
  ['github-logs-data'],
  { revalidate: 300 }
);

async function getLogsData() {
  const username = process.env.GITHUB_USERNAME;
  const token = process.env.GITHUB_TOKEN;

  if (!username || !token) return { commits: [], heatmap: null, totalCommits: 0 };

  try {
    const { rawCommits, calendar } = await getCachedGithubData();
    const commitsWithDates = rawCommits.map((c) => ({ ...c, date: new Date(c.date) }));

    const visibleCommits = SHOW_PRIVATE_REPOS
      ? commitsWithDates
      : commitsWithDates.filter((c) => !c.isPrivate);

    return {
      commits: visibleCommits.slice(0, 5),
      heatmap: calendar,
      totalCommits: calendar?.totalContributions || 0,
    };
  } catch (error) {
    console.error('GitHub fetch error:', error);
    return { commits: [], heatmap: null, totalCommits: 0 };
  }
}
const rephraseCommitMessage = unstable_cache(
  async (rawMessage: string) => {
    const apiKey = process.env.AI_API_KEY;
    if (!apiKey) return rawMessage;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: {
              parts: [
                {
                  text: "You are a developer's assistant. Rewrite the provided git commit message to sound concise, professional, and impactful. Keep it strictly to one short sentence. Do not use quotes or introductory text.",
                },
              ],
            },
            contents: [{ parts: [{ text: rawMessage }] }],
            generationConfig: { maxOutputTokens: 40, temperature: 0.5 },
          }),
        }
      );

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      return text ? text.trim() : rawMessage;
    } catch (error) {
      console.error('Gemini AI rewrite error:', error);
      return rawMessage;
    }
  },
  ['rephrase-commit-message'],
  { revalidate: 300 }
);

export const LogsSection = async () => {
  const { commits: rawCommits, heatmap, totalCommits } = await getLogsData();

  const commits = await Promise.all(
    rawCommits.map(async (commit) => ({
      ...commit,
      rephrasedMessage: await rephraseCommitMessage(commit.message),
    }))
  );

  const latestCommit = commits[0];

  const recentAdditions = commits.reduce((acc, curr) => acc + curr.additions, 0);
  const recentDeletions = commits.reduce((acc, curr) => acc + curr.deletions, 0);

  const allWeeks = heatmap?.weeks || [];
  const recentWeeks = allWeeks.slice(-6);
  const currentStreak = computeCurrentStreak(allWeeks);
  const mostActiveDay = computeMostActiveDay(allWeeks);

  const renderMiniHeatmap = () => {
    if (!recentWeeks.length) return <div className="text-[10px] text-zinc-600">No data.</div>;

    const allDays = recentWeeks.flatMap((week: any) => week.contributionDays);
    if (!allDays.length) return null;

    const firstDayDate = new Date(allDays[0].date);
    const firstDayOfWeek = firstDayDate.getDay();
    const padCount = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

    const paddedDays = Array(padCount).fill(null).concat(allDays);

    const weeks: any[][] = [];
    for (let i = 0; i < paddedDays.length; i += 7) {
      weeks.push(paddedDays.slice(i, i + 7));
    }

    return (
      <div className="flex w-full gap-4 pt-2">
        <div className="shrink-0 overflow-x-auto custom-scrollbar pb-2 flex">
          <div className="flex flex-col gap-1 text-[8px] text-zinc-500 mt-[16px] pr-2 shrink-0 text-right">
            <span className="h-2.5 leading-[10px]"></span>
            <span className="h-2.5 leading-[10px]">Mon</span>
            <span className="h-2.5 leading-[10px]"></span>
            <span className="h-2.5 leading-[10px]">Wed</span>
            <span className="h-2.5 leading-[10px]"></span>
            <span className="h-2.5 leading-[10px]">Fri</span>
            <span className="h-2.5 leading-[10px]"></span>
          </div>

          <div className="flex flex-col relative w-full">
            <div className="h-3 relative w-full mb-1">
              {weeks.map((week, i) => {
                const firstValidDay = week.find((d: any) => d !== null);
                if (!firstValidDay) return null;

                const monthStr = new Date(firstValidDay.date).toLocaleString('en-US', {
                  month: 'short',
                });

                let isNewMonth = false;
                if (i === 0) {
                  isNewMonth = true;
                } else {
                  const prevValidDay = weeks[i - 1].find((d: any) => d !== null);
                  if (prevValidDay) {
                    const prevMonthStr = new Date(prevValidDay.date).toLocaleString('en-US', {
                      month: 'short',
                    });
                    if (monthStr !== prevMonthStr) isNewMonth = true;
                  }
                }

                if (isNewMonth) {
                  return (
                    <span
                      key={`month-${i}`}
                      className="absolute text-[8px] text-zinc-500"
                      style={{ left: `${i * 14}px` }}
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
                      return <div key={dayIndex} className="w-2.5 h-2.5 rounded-[1px] bg-transparent" />;
                    }

                    const count = dayData.contributionCount || 0;
                    const dateStr = dayData.date || '';

                    let bg = 'bg-[#141417]';
                    if (count >= 10) bg = 'bg-purple-400 shadow-[0_0_4px_#a855f7]';
                    else if (count >= 5) bg = 'bg-purple-600';
                    else if (count >= 2) bg = 'bg-purple-800';
                    else if (count === 1) bg = 'bg-purple-900/60';

                    return (
                      <div
                        key={dayIndex}
                        title={`${count} contributions on ${dateStr}`}
                        className={`w-2.5 h-2.5 rounded-[1px] ${bg} transition-colors duration-200 hover:border hover:border-purple-400 cursor-crosshair`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center gap-6 border-l border-[#141417] px-4">
          <div className="space-y-1 text-center">
            <span className="text-[8px] text-zinc-500 tracking-widest block uppercase">Current Streak</span>
            <span className="text-sm font-mono text-purple-400 flex items-center justify-center gap-1.5">
              <Flame size={12} /> {pluralize(currentStreak, 'day')}
            </span>
          </div>
          <div className="space-y-1 text-center">
            <span className="text-[8px] text-zinc-500 tracking-widest block uppercase">Most Active</span>
            <span className="text-sm font-mono text-zinc-300 flex items-center justify-center gap-1.5">
              <CalendarDays size={12} /> {mostActiveDay}
            </span>
          </div>
        </div>
        <div className="flex flex-col justify-center gap-3 border-l border-[#141417] pl-4 shrink-0 min-w-[80px]">
          <div className="space-y-1">
            <span className="text-[8px] text-zinc-500 tracking-widest block uppercase">Lines Added</span>
            <span className="text-sm font-mono text-emerald-500 flex items-center gap-1.5">
              <PlusSquare size={10} /> {recentAdditions.toLocaleString()}
            </span>
          </div>
          <div className="space-y-1">
            <span className="text-[8px] text-zinc-500 tracking-widest block uppercase">Lines Removed</span>
            <span className="text-sm font-mono text-rose-500 flex items-center gap-1.5">
              <MinusSquare size={10} /> {recentDeletions.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full space-y-6 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch border border-[#141417] bg-[#050505] p-8 relative overflow-hidden">
        <div className="lg:col-span-4 space-y-6 z-10 flex flex-col justify-center">
          <div className="text-[10px] text-zinc-500 tracking-widest">// DEV.LOGS</div>
          <h2 className="text-4xl sm:text-5xl font-bold font-[family-name:var(--font-chakra)] text-white">
            My <span className="text-purple-500">Dev_Logs.</span>
          </h2>
          <p className="text-xs text-zinc-400 leading-relaxed font-sans max-w-sm">
            A chronicle of experiments, learnings, breakthroughs and late night builds. Documenting
            the journey, one commit at a time.
          </p>
          <div className="pt-4">
            <a
              href={`https://github.com/${process.env.GITHUB_USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-between w-full max-w-[240px] border border-purple-500/30 bg-[#0a0a0a] px-4 py-3 text-[10px] text-purple-400 tracking-widest hover:border-purple-500 transition-colors"
            >
              <span>{'>'} VIEW GITHUB PROFILE</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.03c3.15-.38 6.5-1.4 6.5-7.17a5.2 5.2 0 0 0-1.5-3.81 5.2 5.2 0 0 0-.1-3.82s-1.1-.35-3.5 1.2a11.5 11.5 0 0 0-6 0C6.1 1.3 5 1.65 5 1.65a5.2 5.2 0 0 0-.1 3.82A5.2 5.2 0 0 0 3 9.28c0 5.76 3.35 6.79 6.5 7.17A4.8 4.8 0 0 0 8 19.5v2.5"></path>
              </svg>
            </a>
          </div>
        </div>

        <div className="lg:col-span-4 z-10 flex flex-col justify-center relative px-6">
          <div className="absolute top-4 left-4 text-4xl text-purple-900/30 font-serif">"</div>
          <div className="absolute bottom-4 right-4 text-4xl text-purple-900/30 font-serif rotate-180">"</div>
          <p className="text-xl font-mono text-zinc-300 leading-relaxed relative z-10">
            Behind every line of code is a log of <span className="text-purple-400">curiosity</span>,
            frustration, <span className="text-purple-400">growth</span> and relentless{' '}
            <span className="text-purple-400">iteration</span>.
          </p>
          <p className="text-[10px] text-zinc-500 mt-6">- Ashmit Kumar</p>
        </div>

        <div className="lg:col-span-4 relative flex justify-center items-center z-0 min-h-[250px]">
          <div className="absolute inset-0 w-full h-full opacity-60 mix-blend-screen pointer-events-none">
            <Image src="/hero-image.png" alt="Logs Avatar" fill className="object-cover object-right scale-110" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#050505] to-transparent opacity-90" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 border border-[#141417] bg-[#050505] p-6 flex flex-col">
          <div className="text-[10px] text-zinc-500 tracking-widest mb-6 pb-4 border-b border-[#141417]">
            // RECENT LOGS
          </div>

          <div className="flex-1 space-y-4">
            {commits.length > 0 ? (
              commits.map((commit) => {
                const month = commit.date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
                const day = commit.date.getDate().toString().padStart(2, '0');
                const year = commit.date.getFullYear();

                return (
                  <div
                    key={commit.hash}
                    className="flex gap-4 p-4 border border-[#141417] bg-[#0a0a0a] rounded-sm hover:border-purple-500/30 transition-colors group"
                  >
                    <div className="flex flex-col items-center justify-center border-r border-[#141417] pr-4 shrink-0 min-w-[60px]">
                      <span className="text-[9px] text-purple-500 font-bold">{month}</span>
                      <span className="text-xl font-bold text-white leading-tight">{day}</span>
                      <span className="text-[9px] text-zinc-600">{year}</span>
                    </div>

                    <div className="flex items-center justify-center shrink-0">
                      <div className="w-10 h-10 rounded bg-[#141417] border border-[#2a2a2e] flex items-center justify-center group-hover:border-purple-500/50 transition-colors">
                        <Terminal size={16} className="text-purple-400" />
                      </div>
                    </div>

                    <div className="flex flex-col justify-center flex-1 min-w-0 pr-4">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-bold text-zinc-200 truncate">{commit.repoName}</h4>
                        <span className="text-[8px] border border-purple-500/30 bg-purple-500/10 text-purple-400 px-1.5 py-0.5 uppercase tracking-widest rounded-sm">
                          COMMIT
                        </span>
                        {commit.isPrivate && (
                          <span className="text-[8px] border border-zinc-700 text-zinc-500 px-1.5 py-0.5 uppercase tracking-widest rounded-sm">
                            PRIVATE
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-400 font-sans truncate">{commit.rephrasedMessage}</p>
                    </div>

                    <div className="hidden sm:flex items-center gap-4 shrink-0 pl-4 border-l border-[#141417]">
                      <div className="flex flex-col gap-1.5 font-mono text-[10px]">
                        <div className="flex items-center gap-1.5 text-emerald-500" title="Lines Added">
                          <PlusSquare size={11} />
                          <span>{commit.additions}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-rose-500" title="Lines Removed">
                          <MinusSquare size={11} />
                          <span>{commit.deletions}</span>
                        </div>
                      </div>
                      <div className="flex flex-col justify-center items-end text-[9px] text-zinc-600 font-mono gap-1.5 border-l border-[#141417] pl-4">
                        <div className="flex items-center gap-1.5 text-zinc-500" title="Files Changed">
                          <FileCode2 size={12} />
                          <span>{pluralize(commit.files, 'file')}</span>
                        </div>
                        <span className="text-[11px] text-purple-500 flex items-center gap-1 mt-1">
                          {commit.hash} <ChevronRight size={12} />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-48 flex items-center justify-center text-xs text-zinc-600 font-mono">
                Awaiting commit data...
              </div>
            )}
          </div>

          <div className="pt-6 mt-6 border-t border-[#141417] flex justify-between items-center text-[10px] text-zinc-500">
            <button className="text-purple-400 hover:text-purple-300 tracking-widest uppercase flex items-center gap-1">
              {'>'} VIEW ALL LOGS
            </button>
            <span>Showing {commits.length} of latest</span>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="border border-[#141417] bg-[#050505] p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] text-zinc-500 tracking-widest">// GITHUB ACTIVITY (30 DAYS)</span>
              <a
                href={`https://github.com/${process.env.GITHUB_USERNAME}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[9px] text-purple-400 hover:underline uppercase tracking-widest"
              >
                {'>'} VIEW PROFILE
              </a>
            </div>
            {renderMiniHeatmap()}
            <div className="flex justify-between text-[9px] text-zinc-500 mt-4 pt-4 border-t border-[#141417]">
              <span>Total Contributions: {totalCommits.toLocaleString()}+</span>
            </div>
          </div>

          <div className="border border-[#141417] bg-[#050505] p-6 flex flex-col justify-center">
            <div className="text-[10px] text-zinc-500 tracking-widest mb-4">// LATEST COMMIT</div>
            {latestCommit ? (
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex gap-2 min-w-0 text-sm">
                    <GitCommit size={16} className="text-purple-500 shrink-0 mt-0.5" />
                    <span className="text-zinc-300 truncate">{latestCommit.rephrasedMessage}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-zinc-500 font-mono pl-6">
                  <span className="flex items-center gap-1 text-purple-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.03c3.15-.38 6.5-1.4 6.5-7.17a5.2 5.2 0 0 0-1.5-3.81 5.2 5.2 0 0 0-.1-3.82s-1.1-.35-3.5 1.2a11.5 11.5 0 0 0-6 0C6.1 1.3 5 1.65 5 1.65a5.2 5.2 0 0 0-.1 3.82A5.2 5.2 0 0 0 3 9.28c0 5.76 3.35 6.79 6.5 7.17A4.8 4.8 0 0 0 8 19.5v2.5"></path>
                    </svg>
                    {latestCommit.hash}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitCommit size={10} /> main
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-xs text-zinc-600">No commits found.</div>
            )}
          </div>

          <div className="border border-[#141417] bg-[#050505] p-6">
            <div className="text-[10px] text-zinc-500 tracking-widest mb-4">// CURRENTLY READING</div>
            <div className="flex gap-6 items-center">
              <div className="w-16 h-24 bg-[#141417] border border-[#2a2a2e] flex items-center justify-center rounded-sm shrink-0 shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-zinc-800 to-black z-0" />
                <BookOpen size={20} className="text-zinc-500 relative z-10" />
                <div className="absolute bottom-0 w-full h-1 bg-purple-500" />
              </div>
              <div className="flex-1 space-y-2">
                <h4 className="text-sm font-bold text-zinc-200">Clean Architecture</h4>
                <p className="text-[10px] text-zinc-500">Robert C. Martin</p>
                <div className="pt-2">
                  <div className="flex justify-between text-[9px] text-zinc-500 mb-1">
                    <span>Progress</span>
                    <span>68%</span>
                  </div>
                  <div className="w-full h-1 bg-[#141417] rounded-full overflow-hidden">
                    <div className="w-[68%] h-full bg-purple-500 shadow-[0_0_5px_#a855f7]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center border-t border-[#141417] pt-8 mt-12">
        <div className="lg:col-span-6 flex flex-wrap gap-8">
          <div className="space-y-1">
            <h4 className="text-2xl font-bold text-white">28+</h4>
            <p className="text-[10px] text-zinc-500">
              Dev Logs
              <br />
              Documented
            </p>
          </div>
          <div className="space-y-1">
            <h4 className="text-2xl font-bold text-white">127+</h4>
            <p className="text-[10px] text-zinc-500">
              Hours Logged
              <br />
              This Month
            </p>
          </div>
          <div className="space-y-1">
            <h4 className="text-2xl font-bold text-white">16+</h4>
            <p className="text-[10px] text-zinc-500">
              Experiments
              <br />
              Run
            </p>
          </div>
          <div className="space-y-1">
            <h4 className="text-2xl font-bold text-white">∞</h4>
            <p className="text-[10px] text-zinc-500">
              Curiosity
              <br />
              Level
            </p>
          </div>
        </div>

        <div className="lg:col-span-6 flex justify-end">
          <div className="flex gap-4 max-w-sm">
            <span className="text-3xl text-purple-900/40 font-serif leading-none">"</span>
            <div>
              <p className="text-xs text-zinc-400 font-mono">
                The best logs aren't just about what you did, but what you learned along the way.
              </p>
              <div className="flex justify-end pt-2">
                <Image
                  src="https://res.cloudinary.com/nj4rcodl/image/upload/v1786429482/copy_of_signature.png"
                  alt="Ashmit's signature"
                  width={160}
                  height={56}
                  className="h-auto w-[140px] object-contain invert opacity-90"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};