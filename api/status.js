export default async function handler(req, res) {
  res.setHeader("content-type", "application/json");
  res.setHeader("cache-control", "no-store");
  const GITHUB_API = "https://api.github.com/repos/ehary-devs/virtual-office";
  let postCount = 0, lastPost = "", siteUp = false, lastCommit = "", commitAuthor = "";
  try { const r = await fetch("https://ehary.id/api/posts?limit=1"); const d = await r.json(); postCount = d.total ?? 0; if (d.posts?.[0]) lastPost = d.posts[0].title.slice(0,40); } catch {}
  try { const r = await fetch(GITHUB_API + "/commits?per_page=1"); const d = await r.json(); if (d?.[0]) { lastCommit = d[0].commit?.author?.date ?? ""; commitAuthor = d[0].commit?.author?.name ?? ""; } } catch {}
  try { const r = await fetch("https://ehary.id", { method: "HEAD" }); siteUp = r.ok; } catch {}
  res.json({
    posts: { total: postCount, latest: lastPost },
    github: { lastCommit, commitAuthor },
    site: { up: siteUp },
    agentStatus: {
      ceo: "online", manager: "online", assistant: "online",
      webmon: siteUp ? "online" : "error",
      portfolio: lastCommit ? "active" : "idle",
      backend: lastCommit ? "active" : "idle",
      frontend: lastCommit ? "active" : "idle",
      blogger: postCount > 0 ? "active" : "counting",
      sosmed: postCount > 0 ? "active" : "idle",
    },
    task: {
      webmon: siteUp ? "Server OK · " + new Date().toLocaleTimeString("id-ID") : "DOWN!",
      portfolio: lastCommit ? "Update: " + commitAuthor : "Tidak ada aktivitas",
      backend: lastCommit ? "Push: " + new Date(lastCommit).toLocaleDateString("id-ID") : "Idle",
      frontend: lastCommit ? "Aktif (" + commitAuthor + ")" : "Idle",
      blogger: postCount > 0 ? postCount + " artikel terbit" : "Menunggu konten",
      sosmed: postCount > 0 ? postCount + " konten tersedia" : "Idle",
    },
  });
}
