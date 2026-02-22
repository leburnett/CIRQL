"use client";

import { useState } from "react";

type CounterProps = {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  colour: string;
};

export function Counter({ value, onChange, min, max }: CounterProps) {
  const [count, setCount] = useState(value);

  const increment = () => {
    if (count < max) {
      const next = count + 1;
      setCount(next);
      onChange(next);
    }
  };

  const decrement = () => {
    if (count > min) {
      const next = count - 1;
      setCount(next);
      onChange(next);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-6xl font-light text-white tabular-nums">{count}</div>
      <div className="flex gap-6">
        <button
          onClick={decrement}
          disabled={count <= min}
          className="w-14 h-14 rounded-full border-2 border-white/30 text-white text-2xl
                     flex items-center justify-center transition-opacity
                     disabled:opacity-20 active:scale-95"
        >
          −
        </button>
        <button
          onClick={increment}
          disabled={count >= max}
          className="w-14 h-14 rounded-full border-2 border-white text-white text-2xl
                     flex items-center justify-center transition-opacity
                     disabled:opacity-20 active:scale-95"
        >
          +
        </button>
      </div>
    </div>
  );
}
