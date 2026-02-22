"use client";

import { useState } from "react";

type FlowIndicatorProps = {
  value: string | null;
  onChange: (value: string) => void;
  options: string[];
  colour: string;
};

export function FlowIndicator({ value, onChange, options }: FlowIndicatorProps) {
  const [selected, setSelected] = useState(value);

  const handleSelect = (option: string) => {
    setSelected(option);
    onChange(option);
  };

  return (
    <div className="flex gap-3">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => handleSelect(option)}
          className={`px-5 py-2.5 rounded-full text-sm capitalize transition-all duration-150 ${
            selected === option
              ? "bg-white text-gray-900 font-medium"
              : "bg-white/15 text-white hover:bg-white/25"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
