"use client";
import { prettyCat } from "@/lib/utils";

interface ActiveFilterPillsProps {
  selectedCategories: string[];
  selectedLanguages: string[];
  onRemoveCategory: (cat: string) => void;
  onRemoveLanguage: (lang: string) => void;
  onClearAll: () => void;
}

const ActiveFilterPills: React.FC<ActiveFilterPillsProps> = ({
  selectedCategories,
  selectedLanguages,
  onRemoveCategory,
  onRemoveLanguage,
  onClearAll,
}) => {
  const total = selectedCategories.length + selectedLanguages.length;
  if (total === 0) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-[11px] text-[rgba(240,236,228,0.25)] mr-1">Filters:</span>

      {selectedCategories.map((cat) => (
        <button
          key={cat}
          onClick={() => onRemoveCategory(cat)}
          className="flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-lg bg-[rgba(240,236,228,0.06)] text-[rgba(240,236,228,0.5)] border border-[rgba(240,236,228,0.08)] transition-all duration-150 cursor-pointer hover:bg-[rgba(240,236,228,0.1)] hover:text-[rgba(240,236,228,0.7)]"
        >
          {prettyCat(cat)}
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      ))}

      {selectedLanguages.map((lang) => (
        <button
          key={lang}
          onClick={() => onRemoveLanguage(lang)}
          className="flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-lg bg-[rgba(139,92,246,0.08)] text-[rgba(167,139,250,0.6)] border border-[rgba(139,92,246,0.12)] transition-all duration-150 cursor-pointer hover:bg-[rgba(139,92,246,0.14)] hover:text-[rgba(167,139,250,0.8)]"
        >
          {lang}
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      ))}

      <button
        onClick={onClearAll}
        className="text-[11px] text-red-400/50 ml-2 transition-colors duration-150 cursor-pointer hover:text-red-400/80"
      >
        Clear all
      </button>
    </div>
  );
};

export default ActiveFilterPills;