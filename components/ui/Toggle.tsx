"use client";

import { useState } from "react";

type ToggleProps = {
  value: boolean;
  onChange: (value: boolean) => void;
  colour: string;
};

export function Toggle({ value, onChange }: ToggleProps) {
  const [on, setOn] = useState(value);

  const toggle = () => {
    const next = !on;
    setOn(next);
    onChange(next);
  };

  return (
    <button
      onClick={toggle}
      className="relative w-20 h-10 rounded-full transition-colors duration-200"
      style={{
        backgroundColor: on ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.2)",
      }}
    >
      <div
        className="absolute top-1 w-8 h-8 rounded-full transition-all duration-200"
        style={{
          left: on ? "calc(100% - 2.25rem)" : "0.25rem",
          backgroundColor: on ? "#333" : "rgba(255,255,255,0.6)",
        }}
      />
    </button>
  );
}
