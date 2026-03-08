
import { formatDate, formatTime, prettyCat } from "@/lib/utils";
import { IPost } from "@/types/entity.types";

interface PostCardProps {
  post: IPost;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const isLive = post.status === "LIVE";
  const fillPct = (post.interestedUsers / post.maxUsers) * 100;

  return (
    <a
      href={`/post/${post.id}`}
      className="group flex flex-col rounded-2xl bg-[rgba(255,255,255,0.02)] border border-[rgba(240,236,228,0.07)] transition-all duration-300 hover:bg-[rgba(255,255,255,0.04)] hover:border-[rgba(240,236,228,0.13)] no-underline overflow-hidden"
    >
      {/* Thumbnail */}
      <div className="w-full aspect-[16/9] bg-gradient-to-br from-[rgba(240,236,228,0.05)] to-[rgba(240,236,228,0.01)] relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(240,236,228,0.1)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </div>

        {/* Status */}
        <div className="absolute top-3 left-3">
          <span
            className={`inline-flex items-center gap-1.5 text-[10px] tracking-[0.05em] uppercase px-2.5 py-1 rounded-full backdrop-blur-[12px] ${
              isLive
                ? "bg-[rgba(52,211,153,0.12)] text-emerald-400/80 border border-emerald-400/15"
                : "bg-[rgba(251,191,36,0.1)] text-amber-400/70 border border-amber-400/12"
            }`}
          >
            <div className={`w-1 h-1 rounded-full ${isLive ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
            {isLive ? "Live" : "Upcoming"}
          </span>
        </div>

        {/* Date */}
        <div className="absolute top-3 right-3">
          <div className="px-2.5 py-1 rounded-lg bg-[rgba(0,0,0,0.5)] backdrop-blur-[12px] border border-[rgba(240,236,228,0.08)]">
            <span className="text-[10px] text-[rgba(240,236,228,0.6)]">{formatDate(post.startAt)}</span>
          </div>
        </div>

        {/* Category */}
        <div className="absolute bottom-3 left-3">
          <span className="text-[10px] tracking-[0.04em] px-2.5 py-1 rounded-lg bg-[rgba(0,0,0,0.45)] backdrop-blur-[10px] border border-[rgba(240,236,228,0.06)] text-[rgba(240,236,228,0.5)]">
            {prettyCat(post.category)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-[15px] font-normal text-[#f0ece4] leading-[1.4] tracking-[-0.01em] mb-2 group-hover:text-white transition-colors duration-200 line-clamp-2">
          {post.title}
        </h3>
        <p className="text-[12.5px] leading-[1.7] text-[rgba(240,236,228,0.3)] font-light mb-4 line-clamp-2 flex-1">
          {post.description}
        </p>

        {/* Skills + Languages */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {post.skillsRequired.slice(0, 2).map((skill) => (
            <span key={skill} className="text-[10px] px-2.5 py-1 rounded-md bg-[rgba(240,236,228,0.03)] text-[rgba(240,236,228,0.3)] border border-[rgba(240,236,228,0.06)]">
              {skill}
            </span>
          ))}
          {post.skillsRequired.length > 2 && (
            <span className="text-[10px] px-2 py-1 text-[rgba(240,236,228,0.2)]">+{post.skillsRequired.length - 2}</span>
          )}
          <span className="text-[10px] text-[rgba(240,236,228,0.12)] px-1">·</span>
          {post.languages.slice(0, 2).map((lang) => (
            <span key={lang} className="text-[10px] px-2.5 py-1 rounded-md bg-[rgba(139,92,246,0.06)] text-[rgba(167,139,250,0.5)] border border-[rgba(139,92,246,0.1)]">
              {lang}
            </span>
          ))}
          {post.languages.length > 2 && (
            <span className="text-[10px] px-2 py-1 text-[rgba(240,236,228,0.2)]">+{post.languages.length - 2}</span>
          )}
        </div>

        <div className="w-full h-px bg-[rgba(240,236,228,0.05)] mb-4" />

        {/* Bottom */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-6 h-6 rounded-full flex-shrink-0"
              style={{
                background: `linear-gradient(135deg, hsl(${Number(post.id) * 50 + 200}, 25%, 32%), hsl(${Number(post.id) * 50 + 240}, 20%, 22%))`,
              }}
            />
            <span className="text-[12px] text-[rgba(240,236,228,0.35)]">{post.owner.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-16 h-1 rounded-full bg-[rgba(240,236,228,0.06)] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500/40 to-emerald-400/60"
                style={{ width: `${fillPct}%` }}
              />
            </div>
            <span className="text-[10px] text-[rgba(240,236,228,0.25)]">
              {post.interestedUsers}/{post.maxUsers}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 mt-3">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(240,236,228,0.2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span className="text-[11px] text-[rgba(240,236,228,0.2)]">
            {formatTime(post.startAt)} — {formatTime(post.endAt)}
          </span>
        </div>
      </div>
    </a>
  );
};

export default PostCard;