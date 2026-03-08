"use client";

import { StatusFilter } from "@/types/constants.types";

interface StatusTabsProps {
  filters: readonly StatusFilter[];
  active: StatusFilter;
  onChange: (value: StatusFilter) => void;
  counts: Record<StatusFilter, number>;
}

const StatusTabs: React.FC<StatusTabsProps> = ({ filters, active, onChange, counts }) => {
  return (
    <div className="flex items-center gap-1 p-1 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(240,236,228,0.06)]">
      {filters.map((f) => {
        const isActive = active === f;
        return (
          <button
            key={f}
            onClick={() => onChange(f)}
            className={`
              flex items-center gap-2 text-[13px] tracking-[0.02em] px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer border
              ${isActive
                ? "bg-[rgba(240,236,228,0.08)] text-[#f0ece4] border-[rgba(240,236,228,0.1)]"
                : "bg-transparent text-[rgba(240,236,228,0.35)] border-transparent hover:text-[rgba(240,236,228,0.6)]"
              }
            `}
          >
            {f}
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                isActive
                  ? "bg-[rgba(240,236,228,0.1)] text-[rgba(240,236,228,0.6)]"
                  : "bg-[rgba(240,236,228,0.04)] text-[rgba(240,236,228,0.25)]"
              }`}
            >
              {counts[f]}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default StatusTabs;