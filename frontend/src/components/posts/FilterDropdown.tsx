"use client";
import { useState, useRef, useEffect } from "react";

interface FilterDropdownProps {
  label: string;
  options: readonly string[] | string[];
  selected: string[];
  onChange: (value: string[]) => void;
  formatOption?: (option: string) => string;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label,
  options,
  selected,
  onChange,
  formatOption,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggle = (val: string) => {
    onChange(
      selected.includes(val)
        ? selected.filter((s) => s !== val)
        : [...selected, val]
    );
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`
          flex items-center gap-2 text-[13px] tracking-[0.02em] px-4 py-2.5 rounded-xl border transition-all duration-200 cursor-pointer
          ${selected.length > 0
            ? "bg-[rgba(240,236,228,0.08)] text-[#f0ece4] border-[rgba(240,236,228,0.15)]"
            : "bg-[rgba(255,255,255,0.02)] text-[rgba(240,236,228,0.4)] border-[rgba(240,236,228,0.07)] hover:border-[rgba(240,236,228,0.15)] hover:text-[rgba(240,236,228,0.6)]"
          }
        `}
      >
        <span>{label}</span>
        {selected.length > 0 && (
          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[rgba(240,236,228,0.12)] text-[rgba(240,236,228,0.7)]">
            {selected.length}
          </span>
        )}
        <svg
          width="12" height="12" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-64 max-h-72 overflow-y-auto rounded-xl bg-[#111111] border border-[rgba(240,236,228,0.1)] shadow-[0_16px_48px_rgba(0,0,0,0.5)] z-[100] py-2">
          {selected.length > 0 && (
            <>
              <button
                onClick={() => onChange([])}
                className="w-full text-left px-4 py-2 text-[12px] text-red-400/60 hover:bg-[rgba(255,255,255,0.04)] transition-colors duration-150 cursor-pointer"
              >
                Clear all
              </button>
              <div className="w-full h-px bg-[rgba(240,236,228,0.06)] my-1" />
            </>
          )}

          {options.map((opt) => {
            const isSelected = selected.includes(opt);
            return (
              <button
                key={opt}
                onClick={() => toggle(opt)}
                className={`
                  w-full text-left px-4 py-2 text-[13px] flex items-center gap-3 transition-colors duration-150 cursor-pointer
                  ${isSelected
                    ? "text-[#f0ece4] bg-[rgba(240,236,228,0.06)]"
                    : "text-[rgba(240,236,228,0.45)] hover:bg-[rgba(255,255,255,0.03)] hover:text-[rgba(240,236,228,0.7)]"
                  }
                `}
              >
                <div
                  className={`
                    w-4 h-4 rounded flex-shrink-0 border flex items-center justify-center transition-all duration-150
                    ${isSelected
                      ? "bg-[rgba(240,236,228,0.15)] border-[rgba(240,236,228,0.3)]"
                      : "border-[rgba(240,236,228,0.12)] bg-transparent"
                    }
                  `}
                >
                  {isSelected && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#f0ece4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                {formatOption ? formatOption(opt) : opt}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;