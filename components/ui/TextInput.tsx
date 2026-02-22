"use client";

import { useState } from "react";

type TextInputProps = {
  value: string;
  onChange: (value: string) => void;
  colour: string;
};

export function TextInput({ value, onChange }: TextInputProps) {
  const [text, setText] = useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    onChange(e.target.value);
  };

  return (
    <textarea
      value={text}
      onChange={handleChange}
      placeholder="Add notes..."
      rows={3}
      className="w-full max-w-xs px-4 py-3 rounded-2xl bg-white/10 text-white text-sm
                 border border-white/20 outline-none focus:border-white/50
                 placeholder-white/30 resize-none"
    />
  );
}
