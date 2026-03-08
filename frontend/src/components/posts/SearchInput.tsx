"use client";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = "Search...",
}) => {
  return (
    <div className="relative">
      <svg
        width="15" height="15" viewBox="0 0 24 24" fill="none"
        stroke="rgba(240,236,228,0.25)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-72 pl-10 pr-4 py-2.5 text-[13px] bg-[rgba(255,255,255,0.02)] text-[rgba(240,236,228,0.7)] border border-[rgba(240,236,228,0.07)] rounded-xl placeholder:text-[rgba(240,236,228,0.2)] outline-none transition-all duration-200 focus:border-[rgba(240,236,228,0.15)] focus:bg-[rgba(255,255,255,0.04)]"
      />
    </div>
  );
};

export default SearchInput;