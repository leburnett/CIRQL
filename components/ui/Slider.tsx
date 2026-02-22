"use client";

import { useState, useCallback } from "react";

type SliderProps = {
  value: number | null;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  unit?: string;
  colour: string;
};

export function Slider({ value, onChange, min, max, step, unit, colour }: SliderProps) {
  const [localValue, setLocalValue] = useState(value ?? Math.round((min + max) / 2));
  const [hasInteracted, setHasInteracted] = useState(value !== null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = parseFloat(e.target.value);
      setLocalValue(val);
      setHasInteracted(true);
      onChange(val);
    },
    [onChange]
  );

  const percentage = ((localValue - min) / (max - min)) * 100;

  return (
    <div className="flex flex-col items-center gap-4 w-full px-6">
      <div className="text-4xl font-light text-white tabular-nums">
        {hasInteracted ? localValue : "—"}
        {hasInteracted && unit && (
          <span className="text-lg ml-1 opacity-70">{unit}</span>
        )}
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={localValue}
        onChange={handleChange}
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, white ${percentage}%, rgba(255,255,255,0.3) ${percentage}%)`,
          accentColor: "white",
        }}
      />
      <div className="flex justify-between w-full text-xs text-white/50">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
