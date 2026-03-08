"use client";
import { useState } from "react";
import { prettyCat } from "@/lib/utils";
import { IPost } from "@/types/entity.types";
import { CATEGORIES, Category, PostStatus, STATUS_FILTERS, StatusFilter } from "@/types/constants.types";
import Navbar from "@/components/landingPage/Navbar";
import StatusTabs from "@/components/posts/StatusTabs";
import FilterDropdown from "@/components/posts/FilterDropdown";
import SearchInput from "@/components/posts/SearchInput";
import ActiveFilterPills from "@/components/posts/ActiveFilterPills";
import PostCard from "@/components/posts/PostCard";
import EmptyState from "@/components/posts/EmptyState";
import Footer from "@/components/landingPage/Footer";
import LiveBanner from "@/components/posts/LiveBanner";

const posts: IPost[] = [
  {
    id: "1",
    title: "Building a Real-Time Collaboration Tool from Scratch",
    description: "Deep dive into WebSocket infrastructure, CRDT-based conflict resolution, and scaling collaborative editing to thousands of concurrent users.",
    owner: { name: "Alex Chen" },
    interestedUsers: 184,
    maxUsers: 250,
    eligibility: ["Intermediate to advanced developers"],
    skillsRequired: ["TypeScript", "Node.js", "WebSockets"],
    keywords: ["real-time", "collaboration", "CRDT"],
    languages: ["English", "Hindi"],
    category: Category.TECHNOLOGY,
    status: PostStatus.UPCOMING,
    startAt: "2026-03-15T18:00:00Z",
    endAt: "2026-03-15T20:30:00Z",
  },
  {
    id: "2",
    title: "Is AI Replacing Junior Developers? An Honest Discussion",
    description: "Let's talk about the real impact of AI coding assistants on entry-level roles, what skills still matter, and how the industry is shifting.",
    owner: { name: "Sarah Kim" },
    interestedUsers: 312,
    maxUsers: 500,
    eligibility: ["Open to all"],
    skillsRequired: ["AI/ML", "Career Development"],
    keywords: ["ai", "careers", "junior-dev"],
    languages: ["English", "Korean"],
    category: Category.TECHNOLOGY,
    status: PostStatus.LIVE,
    startAt: "2026-03-08T14:00:00Z",
    endAt: "2026-03-08T16:00:00Z",
  },
  {
    id: "3",
    title: "Designing for Dark Mode: Beyond Inverting Colors",
    description: "Explore the nuances of dark mode design — contrast ratios, color psychology, accessible palettes, and why most dark modes feel wrong.",
    owner: { name: "Lex UI" },
    interestedUsers: 97,
    maxUsers: 150,
    eligibility: ["Designers and frontend devs"],
    skillsRequired: ["Figma", "CSS", "Design Systems"],
    keywords: ["design", "dark-mode", "accessibility"],
    languages: ["English"],
    category: Category.ART,
    status: PostStatus.UPCOMING,
    startAt: "2026-03-20T19:00:00Z",
    endAt: "2026-03-20T21:00:00Z",
  },
  {
    id: "4",
    title: "Open Source Maintainers Deserve Better — A Funding Proposal",
    description: "Presenting a new model for sustainable open source funding. Current challenges, failed models, and a path forward for maintainers.",
    owner: { name: "Dev Jane" },
    interestedUsers: 156,
    maxUsers: 200,
    eligibility: ["OSS contributors and maintainers"],
    skillsRequired: ["Open Source", "Community"],
    keywords: ["opensource", "funding", "sustainability"],
    languages: ["English", "Spanish"],
    category: Category.BUSINESS,
    status: PostStatus.UPCOMING,
    startAt: "2026-03-22T17:00:00Z",
    endAt: "2026-03-22T19:30:00Z",
  },
  {
    id: "5",
    title: "From Zero to Production: Deploying on the Edge",
    description: "Walk through deploying a full-stack app on edge infrastructure — Cloudflare Workers, Deno Deploy, and Vercel Edge Functions compared.",
    owner: { name: "Mike R" },
    interestedUsers: 210,
    maxUsers: 300,
    eligibility: ["Familiar with serverless concepts"],
    skillsRequired: ["Edge Computing", "Serverless", "JavaScript"],
    keywords: ["edge", "deployment", "serverless"],
    languages: ["English", "Japanese"],
    category: Category.TECHNOLOGY,
    status: PostStatus.LIVE,
    startAt: "2026-03-08T16:00:00Z",
    endAt: "2026-03-08T18:30:00Z",
  },
  {
    id: "6",
    title: "The Psychology of Developer Experience",
    description: "Why do some tools feel magical and others feel hostile? Exploring cognitive load, API design patterns, and what makes a great DX.",
    owner: { name: "Priya S" },
    interestedUsers: 45,
    maxUsers: 120,
    eligibility: ["All levels welcome"],
    skillsRequired: ["DX", "API Design", "UX"],
    keywords: ["developer-experience", "ux", "api-design"],
    languages: ["English", "Hindi", "French"],
    category: Category.PSYCHOLOGY,
    status: PostStatus.UPCOMING,
    startAt: "2026-03-25T20:00:00Z",
    endAt: "2026-03-25T22:00:00Z",
  },
  {
    id: "7",
    title: "Stoicism in the Age of Social Media",
    description: "How ancient Stoic philosophy applies to modern digital life. Managing attention, dealing with outrage culture, and finding calm.",
    owner: { name: "Marcus A" },
    interestedUsers: 88,
    maxUsers: 200,
    eligibility: ["Open to all"],
    skillsRequired: ["Philosophy", "Mindfulness"],
    keywords: ["stoicism", "social-media", "philosophy"],
    languages: ["English", "German"],
    category: Category.PHILOSOPHY,
    status: PostStatus.UPCOMING,
    startAt: "2026-03-28T18:00:00Z",
    endAt: "2026-03-28T20:00:00Z",
  },
  {
    id: "8",
    title: "Indie Game Dev: From Prototype to Steam Launch",
    description: "A panel with indie devs who shipped on Steam. Godot vs Unity, zero-budget marketing, and avoiding burnout.",
    owner: { name: "Pixel Pat" },
    interestedUsers: 275,
    maxUsers: 400,
    eligibility: ["Aspiring and active game developers"],
    skillsRequired: ["Game Dev", "Unity", "Godot"],
    keywords: ["indie", "gamedev", "steam"],
    languages: ["English", "Portuguese"],
    category: Category.GAMING,
    status: PostStatus.UPCOMING,
    startAt: "2026-04-02T17:00:00Z",
    endAt: "2026-04-02T19:30:00Z",
  },
];

export default function PostsPage() {
  const [activeStatus, setActiveStatus] = useState<StatusFilter>("All");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const filtered = posts.filter((p) => {
    const matchesStatus = activeStatus === "All" || p.status === activeStatus;
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(p.category);
    const matchesLanguage = selectedLanguages.length === 0 || p.languages.some((l) => selectedLanguages.includes(l));
    const matchesSearch =
      search === "" ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.keywords.some((k) => k.toLowerCase().includes(search.toLowerCase())) ||
      p.skillsRequired.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    return matchesStatus && matchesCategory && matchesLanguage && matchesSearch;
  });

  const liveCount = posts.filter((p) => p.status === PostStatus.LIVE).length;
  const upcomingCount = posts.filter((p) => p.status === PostStatus.UPCOMING).length;

  const counts: Record<StatusFilter, number> = {
    All: posts.length,
    LIVE: liveCount,
    UPCOMING: upcomingCount,
  };

  const clearAll = () => {
    setSelectedCategories([]);
    setSelectedLanguages([]);
    setActiveStatus("All");
    setSearch("");
  };

  const showLiveBanner = (activeStatus === "All" || activeStatus === "LIVE") && liveCount > 0;

  return (
    <div className="min-h-screen bg-[#0a0a0a] font-['DM_Sans']">
      <Navbar />

      {/* Header */}
      <div className="max-w-6xl mx-auto px-8 pt-14 pb-6">
        <div className="flex items-end justify-between mb-3">
          <div>
            <h1 className="font-['Playfair_Display'] text-[clamp(32px,4vw,48px)] text-[#f0ece4] leading-[1] tracking-[-0.02em]">
              Explore Discussions
            </h1>
            <p className="text-[14px] text-[rgba(240,236,228,0.35)] font-light mt-3 leading-[1.6]">
              Find conversations worth joining — or start your own
            </p>
          </div>
          <button className="text-[13px] tracking-[0.04em] px-5 py-2.5 bg-[rgba(240,236,228,0.08)] text-[rgba(240,236,228,0.7)] border border-[rgba(240,236,228,0.1)] rounded-xl transition-all duration-200 cursor-pointer hover:bg-[rgba(240,236,228,0.14)] hover:text-[#f0ece4] flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Post
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-6xl mx-auto px-8 pb-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 flex-wrap">
            <StatusTabs
              filters={STATUS_FILTERS}
              active={activeStatus}
              onChange={setActiveStatus}
              counts={counts}
            />
            <div className="w-px h-7 bg-[rgba(240,236,228,0.08)]" />
            <FilterDropdown
              label="Category"
              options={CATEGORIES}
              selected={selectedCategories}
              onChange={setSelectedCategories}
              formatOption={prettyCat}
            />
            <FilterDropdown
              label="Language"
              options={[...new Set(posts.flatMap((p) => p.languages))]} // Get unique languages from posts
              selected={selectedLanguages}
              onChange={setSelectedLanguages}
            />
          </div>
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search by title, skill, or keyword..."
          />
        </div>
      </div>

      {/* Active pills */}
      <div className="max-w-6xl mx-auto px-8 pb-4">
        <ActiveFilterPills
          selectedCategories={selectedCategories}
          selectedLanguages={selectedLanguages}
          onRemoveCategory={(cat) => setSelectedCategories((prev) => prev.filter((c) => c !== cat))}
          onRemoveLanguage={(lang) => setSelectedLanguages((prev) => prev.filter((l) => l !== lang))}
          onClearAll={clearAll}
        />
      </div>

      {/* Live banner */}
      {showLiveBanner && (
        <div className="max-w-6xl mx-auto px-8 mb-6">
          <LiveBanner count={liveCount} />
        </div>
      )}

      {/* Results */}
      <div className="max-w-6xl mx-auto px-8 mb-5">
        <span className="text-[12px] text-[rgba(240,236,228,0.2)]">
          {filtered.length} discussion{filtered.length !== 1 ? "s" : ""} found
        </span>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-8 pb-24">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-3 gap-5">
            {filtered.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <EmptyState onClear={clearAll} />
        )}
      </div>

      <Footer />
    </div>
  );
}