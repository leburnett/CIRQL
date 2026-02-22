"use client";

import { useState } from "react";

type MultiSelectProps = {
  value: string[];
  onChange: (value: string[]) => void;
  options: string[];
  customOptionsCategory?: string;
  onAddCustomOption?: (category: string, value: string) => void;
  colour: string;
};

export function MultiSelect({
  value,
  onChange,
  options,
  customOptionsCategory,
  onAddCustomOption,
}: MultiSelectProps) {
  const [selected, setSelected] = useState<string[]>(value);
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customValue, setCustomValue] = useState("");

  const toggleOption = (option: string) => {
    const next = selected.includes(option)
      ? selected.filter((s) => s !== option)
      : [...selected, option];
    setSelected(next);
    onChange(next);
  };

  const handleAddCustom = () => {
    if (customValue.trim() && customOptionsCategory) {
      onAddCustomOption?.(customOptionsCategory, customValue.trim());
      const next = [...selected, customValue.trim()];
      setSelected(next);
      onChange(next);
      setCustomValue("");
      setIsAddingCustom(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 w-full px-4">
      <div className="flex flex-wrap justify-center gap-2">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => toggleOption(option)}
            className={`px-4 py-2 rounded-full text-sm transition-all duration-150 ${
              selected.includes(option)
                ? "bg-white text-gray-900 font-medium"
                : "bg-white/15 text-white hover:bg-white/25"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {customOptionsCategory && !isAddingCustom && (
        <button
          onClick={() => setIsAddingCustom(true)}
          className="mt-2 px-4 py-2 rounded-full text-sm text-white/50 border border-white/20
                     hover:border-white/40 transition-colors"
        >
          + Add custom...
        </button>
      )}

      {isAddingCustom && (
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddCustom()}
            placeholder="Type option..."
            className="px-3 py-2 rounded-full bg-white/10 text-white text-sm
                       border border-white/20 outline-none focus:border-white/50
                       placeholder-white/30"
            autoFocus
          />
          <button
            onClick={handleAddCustom}
            className="px-3 py-2 rounded-full bg-white text-gray-900 text-sm font-medium"
          >
            Add
          </button>
          <button
            onClick={() => setIsAddingCustom(false)}
            className="px-3 py-2 rounded-full text-white/50 text-sm"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
