interface LiveBannerProps {
  count: number;
}

const LiveBanner: React.FC<LiveBannerProps> = ({ count }) => {
  if (count === 0) return null;

  return (
    <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[rgba(52,211,153,0.04)] border border-[rgba(52,211,153,0.1)]">
      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      <span className="text-[12px] text-emerald-400/70 tracking-[0.02em]">
        {count} discussion{count > 1 ? "s" : ""} happening right now
      </span>
    </div>
  );
};

export default LiveBanner;