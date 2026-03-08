"use client";

interface EmptyStateProps {
  onClear: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onClear }) => {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(240,236,228,0.15)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <p className="text-[14px] text-[rgba(240,236,228,0.3)] mt-4">No discussions found</p>
      <p className="text-[12px] text-[rgba(240,236,228,0.2)] mt-1">Try adjusting your filters or search term</p>
      <button
        onClick={onClear}
        className="mt-5 text-[13px] tracking-[0.04em] px-5 py-2.5 bg-[rgba(240,236,228,0.06)] text-[rgba(240,236,228,0.5)] border border-[rgba(240,236,228,0.08)] rounded-xl transition-all duration-200 cursor-pointer hover:bg-[rgba(240,236,228,0.1)] hover:text-[rgba(240,236,228,0.7)]"
      >
        Clear all filters
      </button>
    </div>
  );
};

export default EmptyState;