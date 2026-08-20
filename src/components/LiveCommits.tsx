import React from 'react';
import { GitCommit, FileCode2, PlusSquare, MinusSquare } from 'lucide-react';
async function getLatestCommits() {
  const username = process.env.GITHUB_USERNAME;
  const token = process.env.GITHUB_TOKEN;

  if (!username || !token) return [];
  const query = `
    query {
      user(login: "${username}") {
        repositories(first: 3, orderBy: {field: PUSHED_AT, direction: DESC}) {
          nodes {
            name
            isPrivate
            defaultBranchRef {
              target {
                ... on Commit {
                  message
                  additions
                  deletions
                  changedFilesIfAvailable
                  pushedDate
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
      next: { revalidate: 300 }, 
    });

    const data = await response.json();
    const repos = data?.data?.user?.repositories?.nodes || [];
    
    return repos
      .filter((repo: any) => repo.defaultBranchRef?.target) 
      .map((repo: any) => ({
        repoName: repo.name,
        isPrivate: repo.isPrivate,
        message: repo.defaultBranchRef.target.message,
        additions: repo.defaultBranchRef.target.additions,
        deletions: repo.defaultBranchRef.target.deletions,
        files: repo.defaultBranchRef.target.changedFilesIfAvailable,
        date: new Date(repo.defaultBranchRef.target.pushedDate),
      }));
  } catch (error) {
    console.error("GitHub fetch error:", error);
    return [];
  }
}
async function rephraseCommitMessage(rawMessage: string) {
  const apiKey = process.env.AI_API_KEY; 
  if (!apiKey) return rawMessage; 

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ 
            text: "You are a developer's assistant. Rewrite the provided git commit message to sound concise, professional, and impactful. Keep it strictly to one short sentence. Do not use quotes or introductory text." 
          }]
        },
        contents: [{
          parts: [{ text: rawMessage }]
        }],
        generationConfig: {
          maxOutputTokens: 40,
          temperature: 0.5,
        }
      }),
    });

    const data = await response.json();
        if (data.candidates && data.candidates.length > 0) {
      return data.candidates[0].content.parts[0].text.trim();
    }
    
    return rawMessage;
  } catch (error) {
    console.error("Gemini AI rewrite error:", error);
    return rawMessage;
  }
}
export const LiveCommits = async () => {
  const rawCommits = await getLatestCommits();
    const commits = await Promise.all(
    rawCommits.map(async (commit: any) => ({
      ...commit,
      rephrasedMessage: await rephraseCommitMessage(commit.message),
    }))
  );
  return (
    <div className="border border-[#141417] bg-[#050505] p-6 relative w-full z-10">
      <div className="flex justify-between items-end mb-6 border-b border-[#141417] pb-4">
        <div>
          <div className="text-[10px] text-zinc-500 tracking-widest mb-2">// SYSTEM.LOGS</div>
          <h3 className="text-xl font-bold font-sans text-white">Live Development Feed</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[10px] text-emerald-500 uppercase tracking-widest">Building in Public</span>
        </div>
      </div>
      <div className="space-y-4">
        {commits.length > 0 ? (
          commits.map((commit: any, index: number) => (
            <div key={index} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-[#0a0a0a] border border-[#141417] hover:border-purple-500/30 transition-colors rounded-sm gap-4">
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <GitCommit size={16} className="text-purple-500 mt-1 shrink-0" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-zinc-300 truncate">{commit.repoName}</span>
                    {commit.isPrivate && (
                      <span className="text-[9px] border border-zinc-700 text-zinc-500 px-1.5 py-0.5 rounded-sm">PRIVATE</span>
                    )}
                    <span className="text-[10px] text-zinc-600">
                      {commit.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-400 font-sans truncate pr-4">
                    {commit.rephrasedMessage}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0 font-mono text-xs">
                <div className="flex items-center gap-1.5 text-zinc-500" title="Files Changed">
                  <FileCode2 size={14} />
                  <span>{commit.files}</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-500" title="Lines Added">
                  <PlusSquare size={14} />
                  <span>{commit.additions}</span>
                </div>
                <div className="flex items-center gap-1.5 text-rose-500" title="Lines Removed">
                  <MinusSquare size={14} />
                  <span>{commit.deletions}</span>
                </div>
              </div>

            </div>
          ))
        ) : (
          <div className="text-xs text-zinc-600 font-mono py-4">No recent commits found or connecting to GitHub...</div>
        )}
      </div>
    </div>
  );
};