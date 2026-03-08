"use client";

const post = {
  title: "Building a Real-Time Collaboration Tool from Scratch",
  description:
    "Join us for an in-depth discussion on architecting and building a real-time collaboration tool — think Figma meets Notion. We'll cover WebSocket infrastructure, CRDT-based conflict resolution, operational transforms, and how to scale collaborative editing to thousands of concurrent users. Whether you're a backend engineer curious about distributed systems or a frontend developer wanting to build rich interactive experiences, this session will have something for you. We'll also dive into the tradeoffs between different real-time sync strategies and share lessons learned from production systems.",
  owner: { name: "Alex Chen", avatar: null },
  admins: [
    { name: "Sarah Kim", avatar: null },
    { name: "Dev Patel", avatar: null },
  ],
  interestedUsers: 184,
  maxUsers: 250,
  eligibility: [
    "Intermediate to advanced developers",
    "Familiar with WebSockets or SSE",
    "Basic understanding of distributed systems",
  ],
  skillsRequired: ["TypeScript", "Node.js", "WebSockets", "React", "Redis"],
  keywords: ["real-time", "collaboration", "CRDT", "distributed-systems", "websockets"],
  status: "upcoming",
  startAt: "2026-03-15T18:00:00Z",
  endAt: "2026-03-15T20:30:00Z",
  thumbnail: null,
};

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function PostPage() {
  const isLive = post.status === "live";
  const spotsLeft = post.maxUsers - post.interestedUsers;

  return (
    <div className="min-h-screen bg-[#0a0a0a] font-['DM_Sans']">

      {/* Nav */}
      <nav className="flex items-center justify-between px-13 py-5">
        <a href="/" className="flex items-center gap-2.5 no-underline">
          <div className="w-8 h-8 rounded-lg bg-[rgba(240,236,228,0.1)] border border-[rgba(240,236,228,0.12)] flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f0ece4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <span className="font-['Playfair_Display'] font-normal text-xl text-[#f0ece4] tracking-[0.01em]">
            PublicThread
          </span>
        </a>

        <div className="flex gap-4 items-center">
          <a href="#" className="text-[13px] text-[rgba(240,236,228,0.4)] tracking-[0.03em] no-underline transition-colors duration-200 hover:text-[rgba(240,236,228,0.85)]">
            Log In
          </a>
          <button className="text-[13px] tracking-[0.04em] px-[22px] py-[9px] bg-[rgba(240,236,228,0.1)] text-[#f0ece4] border border-[rgba(240,236,228,0.15)] rounded-lg backdrop-blur-[14px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05),inset_0_1px_0_0_rgba(255,255,255,0.08),0_4px_16px_rgba(0,0,0,0.25)] transition-all duration-200 cursor-pointer hover:bg-[rgba(240,236,228,0.18)] hover:border-[rgba(240,236,228,0.25)]">
            Get Started
          </button>
        </div>
      </nav>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-[rgba(240,236,228,0.08)] to-transparent" />

      {/* Content */}
      <div className="max-w-5xl mx-auto px-8 py-16">

        {/* Back */}
        <a href="/" className="inline-flex items-center gap-2 text-[13px] text-[rgba(240,236,228,0.35)] no-underline transition-colors duration-200 hover:text-[rgba(240,236,228,0.7)] mb-10">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Explore
        </a>

        <div className="grid grid-cols-[1fr_340px] gap-10">

          {/* Left column */}
          <div>

            {/* Thumbnail */}
            <div className="w-full aspect-[16/8] rounded-2xl bg-gradient-to-br from-[rgba(240,236,228,0.06)] to-[rgba(240,236,228,0.02)] border border-[rgba(240,236,228,0.07)] flex items-center justify-center mb-8 overflow-hidden">
              <div className="flex flex-col items-center gap-3">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(240,236,228,0.15)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                </svg>
                <span className="text-[12px] text-[rgba(240,236,228,0.15)]">Thumbnail</span>
              </div>
            </div>

            {/* Status + Title */}
            <div className="flex items-center gap-3 mb-5">
              <span className={`
                inline-flex items-center gap-1.5 text-[11px] tracking-[0.05em] uppercase px-3 py-1 rounded-full border
                ${isLive
                  ? "bg-[rgba(52,211,153,0.1)] text-emerald-400/80 border-emerald-400/15"
                  : "bg-[rgba(251,191,36,0.08)] text-amber-400/70 border-amber-400/12"
                }
              `}>
                <div className={`w-1.5 h-1.5 rounded-full ${isLive ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
                {isLive ? "Live Now" : "Upcoming"}
              </span>
            </div>

            <h1 className="font-['Playfair_Display'] text-[clamp(28px,3.5vw,42px)] text-[#f0ece4] leading-[1.15] tracking-[-0.02em] mb-6">
              {post.title}
            </h1>

            {/* Description */}
            <div className="mb-10">
              <h3 className="text-[13px] uppercase tracking-[0.08em] text-[rgba(240,236,228,0.25)] mb-4">About this discussion</h3>
              <p className="text-[15px] leading-[1.85] text-[rgba(240,236,228,0.45)] font-light">
                {post.description}
              </p>
            </div>

            {/* Skills Required */}
            <div className="mb-10">
              <h3 className="text-[13px] uppercase tracking-[0.08em] text-[rgba(240,236,228,0.25)] mb-4">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {post.skillsRequired.map((skill) => (
                  <span
                    key={skill}
                    className="text-[12px] px-3.5 py-1.5 rounded-lg bg-[rgba(240,236,228,0.04)] text-[rgba(240,236,228,0.45)] border border-[rgba(240,236,228,0.07)] transition-colors duration-200 hover:bg-[rgba(240,236,228,0.07)] hover:text-[rgba(240,236,228,0.6)]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Eligibility */}
            <div className="mb-10">
              <h3 className="text-[13px] uppercase tracking-[0.08em] text-[rgba(240,236,228,0.25)] mb-4">Eligibility</h3>
              <ul className="flex flex-col gap-2.5">
                {post.eligibility.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(52,211,153,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span className="text-[14px] text-[rgba(240,236,228,0.4)] font-light leading-[1.5]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Keywords */}
            <div>
              <h3 className="text-[13px] uppercase tracking-[0.08em] text-[rgba(240,236,228,0.25)] mb-4">Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {post.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="text-[11px] px-3 py-1 rounded-full bg-[rgba(240,236,228,0.02)] text-[rgba(240,236,228,0.3)] border border-[rgba(240,236,228,0.05)]"
                  >
                    #{kw}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="flex flex-col gap-5">

            {/* Action card */}
            <div className="sticky top-8 flex flex-col gap-5">

              {/* Main card */}
              <div className="p-6 rounded-2xl bg-[rgba(255,255,255,0.02)] border border-[rgba(240,236,228,0.07)]">

                {/* Date & Time */}
                <div className="flex items-center gap-3 mb-5 pb-5 border-b border-[rgba(240,236,228,0.06)]">
                  <div className="w-12 h-12 rounded-xl bg-[rgba(240,236,228,0.05)] border border-[rgba(240,236,228,0.08)] flex flex-col items-center justify-center">
                    <span className="text-[10px] uppercase text-[rgba(240,236,228,0.35)] leading-none">
                      {new Date(post.startAt).toLocaleDateString("en-US", { month: "short" })}
                    </span>
                    <span className="text-[18px] text-[#f0ece4] font-normal leading-tight">
                      {new Date(post.startAt).getDate()}
                    </span>
                  </div>
                  <div>
                    <p className="text-[13px] text-[#f0ece4] mb-0.5">{formatDate(post.startAt)}</p>
                    <p className="text-[12px] text-[rgba(240,236,228,0.35)]">
                      {formatTime(post.startAt)} — {formatTime(post.endAt)}
                    </p>
                  </div>
                </div>

                {/* Spots */}
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[12px] text-[rgba(240,236,228,0.35)]">
                      {post.interestedUsers} interested
                    </span>
                    <span className="text-[12px] text-[rgba(240,236,228,0.25)]">
                      {spotsLeft} spots left
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[rgba(240,236,228,0.06)] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500/40 to-emerald-400/60 transition-all duration-500"
                      style={{ width: `${(post.interestedUsers / post.maxUsers) * 100}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-[rgba(240,236,228,0.2)] mt-2">
                    {post.maxUsers} max participants
                  </p>
                </div>

                {/* CTA */}
                <button className="w-full text-sm tracking-[0.04em] px-7 py-3.5 bg-[rgba(240,236,228,0.1)] text-[#f0ece4] border border-[rgba(240,236,228,0.15)] rounded-xl backdrop-blur-[16px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05),inset_0_1px_0_0_rgba(255,255,255,0.08),0_4px_20px_rgba(0,0,0,0.3)] transition-all duration-200 cursor-pointer hover:bg-[rgba(240,236,228,0.18)] hover:border-[rgba(240,236,228,0.25)] hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08),inset_0_1px_0_0_rgba(255,255,255,0.12),0_8px_32px_rgba(0,0,0,0.4)] mb-3 flex items-center justify-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                  I'm Interested
                </button>
                <button className="w-full text-[13px] tracking-[0.04em] px-7 py-3 bg-[rgba(255,255,255,0.04)] text-[rgba(240,236,228,0.5)] border border-[rgba(240,236,228,0.08)] rounded-xl transition-all duration-200 cursor-pointer hover:bg-[rgba(255,255,255,0.07)] hover:text-[rgba(240,236,228,0.75)] flex items-center justify-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                  Notify Me
                </button>
              </div>

              {/* Hosted by card */}
              <div className="p-6 rounded-2xl bg-[rgba(255,255,255,0.02)] border border-[rgba(240,236,228,0.07)]">
                <h3 className="text-[12px] uppercase tracking-[0.08em] text-[rgba(240,236,228,0.25)] mb-4">Hosted by</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[hsl(220,25%,32%)] to-[hsl(260,20%,22%)]" />
                  <div>
                    <p className="text-[14px] text-[#f0ece4]">{post.owner.name}</p>
                    <p className="text-[11px] text-[rgba(240,236,228,0.3)]">Organizer</p>
                  </div>
                </div>

                {post.admins.length > 0 && (
                  <>
                    <div className="w-full h-px bg-[rgba(240,236,228,0.05)] my-4" />
                    <h4 className="text-[11px] uppercase tracking-[0.06em] text-[rgba(240,236,228,0.2)] mb-3">Co-hosts</h4>
                    <div className="flex flex-col gap-3">
                      {post.admins.map((admin, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full"
                            style={{ background: `linear-gradient(135deg, hsl(${i * 50 + 180}, 25%, 30%), hsl(${i * 50 + 220}, 20%, 22%))` }}
                          />
                          <div>
                            <p className="text-[13px] text-[rgba(240,236,228,0.6)]">{admin.name}</p>
                            <p className="text-[10px] text-[rgba(240,236,228,0.25)]">Admin</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Share */}
              <div className="p-5 rounded-2xl bg-[rgba(255,255,255,0.015)] border border-[rgba(240,236,228,0.05)] flex items-center justify-between">
                <span className="text-[12px] text-[rgba(240,236,228,0.3)]">Share this discussion</span>
                <div className="flex gap-2">
                  {[
                    <svg key="link" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>,
                    <svg key="twitter" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" /></svg>,
                  ].map((icon, i) => (
                    <button
                      key={i}
                      className="w-8 h-8 rounded-lg bg-[rgba(240,236,228,0.04)] border border-[rgba(240,236,228,0.07)] flex items-center justify-center text-[rgba(240,236,228,0.3)] transition-all duration-200 cursor-pointer hover:bg-[rgba(240,236,228,0.08)] hover:text-[rgba(240,236,228,0.6)]"
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[rgba(240,236,228,0.06)] to-transparent mt-16" />
      <footer className="px-13 py-12 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-[rgba(240,236,228,0.06)] flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(240,236,228,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
          </div>
          <span className="text-[13px] text-[rgba(240,236,228,0.25)]">PublicThread</span>
        </div>
        <div className="flex gap-8">
          {["Terms", "Privacy", "Docs", "GitHub", "Twitter"].map((n) => (
            <a key={n} href="#" className="text-[12px] text-[rgba(240,236,228,0.25)] no-underline transition-colors duration-200 hover:text-[rgba(240,236,228,0.6)]">{n}</a>
          ))}
        </div>
        <span className="text-[12px] text-[rgba(240,236,228,0.15)]">© 2026 PublicThread</span>
      </footer>
    </div>
  );
}